import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9255;
const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';

async function runVerification() {
  console.log('===============================================================');
  console.log('🧪 VERIFY ERROR BOUNDARY FIX & COMPREHENSIVE E2E TEST');
  console.log(`Target: ${BASE_URL}`);
  console.log('===============================================================\n');

  // Spawn Headless Chrome directly on base URL
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `${BASE_URL}/`
  ]);

  let isKilled = false;
  const killChrome = () => {
    if (!isKilled) {
      isKilled = true;
      try { chrome.kill(); } catch (e) {}
    }
  };
  process.on('exit', killChrome);
  process.on('SIGINT', killChrome);

  await new Promise((r) => setTimeout(r, 2000));

  // Find the page target
  const listRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
  const pages = await listRes.json();
  const pageTarget = pages.find((p) => p.type === 'page') || pages[0];

  if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
    throw new Error('Failed to discover page target in headless Chrome');
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let msgId = 1;
  const pendingPromises = new Map();
  const exceptionsCaught = [];
  const consoleErrors = [];

  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && pendingPromises.has(msg.id)) {
      const { resolve } = pendingPromises.get(msg.id);
      pendingPromises.delete(msg.id);
      resolve(msg);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map((a) => a.value || a.description || JSON.stringify(a)).join(' ');
      if (msg.params.type === 'error') {
        if (!text.includes('favicon.ico') && !text.includes('soundhelix') && !text.includes('pixabay')) {
          console.error(`  [Browser Console Error]: ${text}`);
          consoleErrors.push(text);
        }
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const desc = msg.params.exceptionDetails?.exception?.description || JSON.stringify(msg.params.exceptionDetails);
      console.error(`  [Browser Uncaught Exception]: ${desc}`);
      exceptionsCaught.push(desc);
    }
  };

  function sendCommand(method, params = {}, timeoutMs = 6000) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      const timer = setTimeout(() => {
        pendingPromises.delete(id);
        resolve({ error: { message: `Command ${method} timed out after ${timeoutMs}ms` } });
      }, timeoutMs);

      pendingPromises.set(id, {
        resolve: (result) => {
          clearTimeout(timer);
          resolve(result);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        }
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  async function evaluate(expression) {
    const resp = await sendCommand('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return resp?.result?.result?.value;
  }

  async function checkErrorBoundary(stepLabel) {
    const bodyText = (await evaluate('document.body ? document.body.innerText : ""')) || '';
    if (bodyText.includes('Something went wrong while rendering this section') ||
        (bodyText.includes('Something went wrong') && bodyText.includes('refresh this page'))) {
      const errDetails = await evaluate('document.querySelector(".text-slate-500")?.innerText');
      console.error(`❌ ERROR BOUNDARY TRIGGERED at [${stepLabel}]:`, errDetails);
      return false;
    }
    console.log(`  ✓ PASS: ${stepLabel}`);
    return true;
  }

  let totalTests = 0;
  let passedTests = 0;

  function recordResult(success, desc) {
    totalTests++;
    if (success) {
      passedTests++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // TEST 1: HOME PAGE LOAD & TITLE
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Home Page Load ---');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 2000));
    const homeOk = await checkErrorBoundary('Home page initial load');
    recordResult(homeOk, 'Home page rendered cleanly');

    const title = await evaluate('document.title');
    console.log(`  Page Title: "${title}"`);
    recordResult(Boolean(title && title.includes('Wishly')), 'Page Title contains Wishly');

    // -------------------------------------------------------------
    // TEST 2: OCCASION NAVIGATION TO BUILDER (ALL 4 CATEGORIES)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Occasion Selection to Builder Studio ---');

    // 2.1: Romance
    console.log('Testing Romance Category...');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 1200));
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const card = btns.find(b => b.innerText.includes('Love & Anniversary') || b.innerText.includes('Romance'));
      if (card) card.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1500));
    const romanceOk = await checkErrorBoundary('Enter Romance Category Studio');
    recordResult(romanceOk, 'Romance Studio loaded');

    // 2.2: Scrapbook
    console.log('Testing Scrapbook Category...');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 1200));
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const card = btns.find(b => b.innerText.includes('Scrapbook') || b.innerText.includes('Memories'));
      if (card) card.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1500));
    const scrapbookOk = await checkErrorBoundary('Enter Scrapbook Category Studio');
    recordResult(scrapbookOk, 'Scrapbook Studio loaded');

    // 2.3: Apology
    console.log('Testing Apology Category...');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 1200));
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const card = btns.find(b => b.innerText.includes('Apology'));
      if (card) card.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1500));
    const apologyOk = await checkErrorBoundary('Enter Apology Category Studio');
    recordResult(apologyOk, 'Apology Studio loaded');

    // 2.4: Birthday via "Start Creating"
    console.log('Testing Birthday Category via Start Creating...');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 1200));
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.innerText.includes('Start Creating'));
      if (startBtn) startBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 800));
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const boyBtn = btns.find(b => b.innerText.includes('Boy') || b.innerText.includes('Him'));
      if (boyBtn) boyBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1500));
    const birthdayOk = await checkErrorBoundary('Enter Birthday Studio (Boy)');
    recordResult(birthdayOk, 'Birthday Studio loaded');

    // -------------------------------------------------------------
    // TEST 3: COMPREHENSIVE TEMPLATE SWITCHING ACROSS ALL 15 TEMPLATES
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Switching All Templates in Preview Simulator ---');
    const allTemplates = [
      'royal-sapphire',
      'golden-birthday',
      'polaroid-scrapbook',
      'blush-rose',
      'princess-peach',
      'lavender-dream',
      'velvet-romance',
      'sunset-romance',
      'celestial-love',
      'vintage-kodak',
      'neon-nostalgia',
      'cozy-memories',
      'gentle-peace',
      'sweet-forgive',
      'fresh-start'
    ];

    for (const tmplId of allTemplates) {
      console.log(`Checking template: ${tmplId}...`);
      await sendCommand('Page.navigate', { url: `${BASE_URL}/?preview=${tmplId}` });
      await new Promise((r) => setTimeout(r, 1000));
      const tmplOk = await checkErrorBoundary(`Template: ${tmplId}`);
      recordResult(tmplOk, `Template ${tmplId} rendered cleanly`);
    }

    // -------------------------------------------------------------
    // TEST 4: BUILDER STUDIO STEP 2 INPUT EDITING & EMPTY INPUT HANDLING
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Builder Studio Input Editing & Empty Field Resilience ---');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 1200));
    // Click Romance
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const card = btns.find(b => b.innerText.includes('Love & Anniversary') || b.innerText.includes('Romance'));
      if (card) card.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1500));

    // Proceed to Form (Step 2)
    console.log('Proceeding to Step 2 Form...');
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const proceed = btns.find(b => b.innerText.includes('Proceed to Form') || b.innerText.includes('Next'));
      if (proceed) proceed.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));
    const step2Ok = await checkErrorBoundary('Step 2 Form loaded');
    recordResult(step2Ok, 'Step 2 Form active');

    // Test clearing all text inputs (must not throw or crash simulator)
    console.log('Clearing inputs to test empty-field resilience...');
    await evaluate(`(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      inputs.forEach(inp => {
        inp.value = '';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
      });
    })()`);
    await new Promise((r) => setTimeout(r, 1000));
    const emptyOk = await checkErrorBoundary('Empty form inputs resilience in LivePhonePreview');
    recordResult(emptyOk, 'LivePhonePreview resilient against empty inputs');

    // Test typing custom text into recipient and sender inputs
    console.log('Typing custom text into form...');
    await evaluate(`(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs[0]) {
        inputs[0].value = 'Alexander';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (inputs[1]) {
        inputs[1].value = 'Victoria';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 800));
    const customOk = await checkErrorBoundary('Custom form inputs update');
    recordResult(customOk, 'Simulator updated with custom text');

    // Test switching form tabs
    console.log('Switching Form tabs: Names, Photo, Letter...');
    for (const t of ['Names', 'Photo', 'Letter']) {
      await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const tabBtn = btns.find(b => b.innerText.includes('${t}'));
        if (tabBtn) tabBtn.click();
      })()`);
      await new Promise((r) => setTimeout(r, 800));
      const tabOk = await checkErrorBoundary(`Form tab ${t}`);
      recordResult(tabOk, `Form tab ${t} clicked without crash`);
    }

    // Test switching internal phone simulator tabs
    console.log('Switching Phone Simulator internal tabs (Photos, Letter, Quiz)...');
    for (const simTab of ['Photos', 'Letter', 'Quiz', 'Reasons']) {
      await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const tab = btns.find(b => b.innerText.trim() === '${simTab}' || b.innerText.includes('${simTab}'));
        if (tab) tab.click();
      })()`);
      await new Promise((r) => setTimeout(r, 600));
      const simOk = await checkErrorBoundary(`Simulator tab: ${simTab}`);
      recordResult(simOk, `Simulator tab ${simTab} rendered`);
    }

    // Test unsealing wax seal
    console.log('Unsealing wax seal in simulator...');
    await evaluate(`(() => {
      const seal = document.querySelector('[title*="unseal"]') || document.querySelector('.khat-envelope');
      if (seal) seal.click();
    })()`);
    await new Promise((r) => setTimeout(r, 800));
    const sealOk = await checkErrorBoundary('Unseal wax seal in simulator');
    recordResult(sealOk, 'Wax seal opened');

    // -------------------------------------------------------------
    // TEST 5: KEEPSAKE VIEW (?v=maya-eq97c)
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Keepsake View (?v=maya-eq97c) ---');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/?v=maya-eq97c` });
    await new Promise((r) => setTimeout(r, 2000));
    const keepsakeLoadOk = await checkErrorBoundary('Keepsake initial landing load (?v=maya-eq97c)');
    recordResult(keepsakeLoadOk, 'Keepsake loaded cleanly');

    // Click "Tap to Open Surprise"
    console.log('Clicking Tap to Open Surprise in Keepsake...');
    await evaluate(`(() => {
      const btn = document.querySelector('.intro-enter-btn') ||
                  Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tap to Open'));
      if (btn) btn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));
    const openKeepsakeOk = await checkErrorBoundary('Keepsake experience opened');
    recordResult(openKeepsakeOk, 'Tap to Open transition smooth');

    // Toggle Music Pill
    console.log('Testing audio toggle pill...');
    await evaluate(`(() => {
      const pill = document.querySelector('.soft-music-pill');
      if (pill) pill.click();
    })()`);
    await new Promise((r) => setTimeout(r, 500));
    const musicOk = await checkErrorBoundary('Music toggle pill clicked');
    recordResult(musicOk, 'Music toggle pill responsive');

    // Keepsake tabs
    console.log('Testing Keepsake navigation tabs...');
    for (const pill of ['Photos', 'Letter', 'Quiz', 'game']) {
      await evaluate(`(() => {
        const pills = document.querySelectorAll('.nav-pill');
        pills.forEach(p => {
          if (p.innerText.includes('${pill}')) p.click();
        });
      })()`);
      await new Promise((r) => setTimeout(r, 600));
      const pillOk = await checkErrorBoundary(`Keepsake tab ${pill}`);
      recordResult(pillOk, `Keepsake tab ${pill} active`);
    }

    // Quiz interaction
    console.log('Testing Keepsake Quiz YES button...');
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const yesBtn = btns.find(b => b.innerText.includes('YES'));
      if (yesBtn) yesBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 600));
    const quizOk = await checkErrorBoundary('Keepsake Quiz YES interaction');
    recordResult(quizOk, 'Quiz interaction succeeded');

    // -------------------------------------------------------------
    // TEST 6: DIRECT PREVIEW (?preview=velvet-romance)
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Direct Preview (?preview=velvet-romance) ---');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/?preview=velvet-romance` });
    await new Promise((r) => setTimeout(r, 1500));
    const previewOk = await checkErrorBoundary('Direct Preview: velvet-romance');
    recordResult(previewOk, 'Direct preview loaded without error');

    // -------------------------------------------------------------
    // TEST 7: PRIVACY AUDIT (ZERO OCCURRENCES OF 'aditi' AND 'devi')
    // -------------------------------------------------------------
    console.log('\n--- 7. Privacy Audit (Zero aditi/devi) ---');
    const walkDir = (dir) => {
      let results = [];
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results = results.concat(walkDir(fullPath));
        } else {
          results.push(fullPath);
        }
      }
      return results;
    };

    const auditedDirs = ['src', 'data', 'server'];
    let privacyViolations = [];
    let fileCount = 0;

    for (const d of auditedDirs) {
      const dirPath = path.join(ROOT, d);
      if (fs.existsSync(dirPath)) {
        const files = walkDir(dirPath);
        for (const f of files) {
          if (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.json') || f.endsWith('.html')) {
            fileCount++;
            const content = fs.readFileSync(f, 'utf8');
            const match = content.match(/\b(aditi|devi)\b/i);
            if (match) {
              privacyViolations.push(`${f}: contains "${match[0]}"`);
            }
          }
        }
      }
    }

    const indexHtmlPath = path.join(ROOT, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      fileCount++;
      const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
      const match = indexContent.match(/\b(aditi|devi)\b/i);
      if (match) {
        privacyViolations.push(`index.html: contains "${match[0]}"`);
      }
    }

    if (privacyViolations.length === 0) {
      console.log(`  ✓ PASS: Zero occurrences of private names across ${fileCount} audited files`);
      recordResult(true, 'Privacy audit passed');
    } else {
      console.error(`  ✗ FAIL: Found private name occurrences:\n`, privacyViolations.join('\n'));
      recordResult(false, 'Privacy audit failed');
    }

  } catch (err) {
    console.error('Fatal test execution error:', err);
    recordResult(false, `Fatal execution error: ${err.message}`);
  } finally {
    killChrome();
  }

  // -------------------------------------------------------------
  // FINAL SCORE & SUMMARY
  // -------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`FINAL REPORT: Passed ${passedTests} / ${totalTests} assertions`);
  console.log(`Console Errors Caught: ${consoleErrors.length}`);
  console.log(`Browser Exceptions: ${exceptionsCaught.length}`);
  console.log('===============================================================\n');

  const allPassed = passedTests === totalTests && exceptionsCaught.length === 0;
  if (!allPassed) {
    console.error('❌ E2E VERIFICATION FAILED');
    process.exit(1);
  } else {
    console.log('🎉 ALL END-TO-END VERIFICATION CHECKS PASSED PERFECTLY!');
    process.exit(0);
  }
}

runVerification();
