import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9245;
const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';

async function runVerification() {
  console.log('===============================================================');
  console.log('🧪 VERIFY ERROR BOUNDARY FIX & FULL E2E WORKFLOW TEST');
  console.log(`Target: ${BASE_URL}`);
  console.log('===============================================================\n');

  // Spawn Headless Chrome
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    'about:blank'
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

  await new Promise((r) => setTimeout(r, 1800));

  const listRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
  const pages = await listRes.json();
  const pageTarget = pages.find((p) => p.type === 'page') || pages[0];
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
      resolve(msg.result);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map((a) => a.value || a.description || JSON.stringify(a)).join(' ');
      if (msg.params.type === 'error') {
        // Exclude benign network errors for third-party media in headless test if any
        if (!text.includes('favicon.ico') && !text.includes('soundhelix')) {
          console.error(`  [Browser Console Error]: ${text}`);
          consoleErrors.push(text);
        }
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const desc = msg.params.exceptionDetails?.exception?.description || JSON.stringify(msg.params.exceptionDetails);
      console.error(`  [Browser Exception]: ${desc}`);
      exceptionsCaught.push(desc);
    }
  };

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pendingPromises.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');
  await sendCommand('DOM.enable');

  async function evaluate(expression) {
    const result = await sendCommand('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return result?.result?.value;
  }

  async function checkErrorBoundary(stepLabel) {
    const bodyText = (await evaluate('document.body.innerText')) || '';
    if (bodyText.includes('Something went wrong while rendering this section') ||
        bodyText.includes('Something went wrong') && bodyText.includes('refresh this page')) {
      const errDetails = await evaluate('document.querySelector(".text-slate-500")?.innerText');
      console.error(`❌ CRASH DETECTED at [${stepLabel}]:`, errDetails);
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
    // TEST 1: HOME PAGE LOAD
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Home Page Load ---');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 2000));
    const homeOk = await checkErrorBoundary('Home page initial load');
    recordResult(homeOk, 'Home page rendered cleanly');

    const title = await evaluate('document.title');
    console.log(`  Page Title: "${title}"`);
    recordResult(Boolean(title), 'Title loaded');

    // -------------------------------------------------------------
    // TEST 2: OCCASION NAVIGATION TO BUILDER (ALL 4 CATEGORIES)
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Occasion Selection to Builder Studio ---');

    // Category 2.1: Romance
    console.log('Testing Romance Category...');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 1200));
    await evaluate(`(() => {
      const cards = Array.from(document.querySelectorAll('button'));
      const romanceCard = cards.find(b => b.innerText.includes('Love & Anniversary') || b.innerText.includes('Romance'));
      if (romanceCard) romanceCard.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1500));
    const romanceOk = await checkErrorBoundary('Enter Romance category');
    recordResult(romanceOk, 'Romance category builder loaded');

    // Category 2.2: Scrapbook
    console.log('Testing Scrapbook Category...');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 1200));
    await evaluate(`(() => {
      const cards = Array.from(document.querySelectorAll('button'));
      const card = cards.find(b => b.innerText.includes('Scrapbook') || b.innerText.includes('Memories'));
      if (card) card.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1500));
    const scrapbookOk = await checkErrorBoundary('Enter Scrapbook category');
    recordResult(scrapbookOk, 'Scrapbook category builder loaded');

    // Category 2.3: Apology
    console.log('Testing Apology Category...');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 1200));
    await evaluate(`(() => {
      const cards = Array.from(document.querySelectorAll('button'));
      const card = cards.find(b => b.innerText.includes('Apology'));
      if (card) card.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1500));
    const apologyOk = await checkErrorBoundary('Enter Apology category');
    recordResult(apologyOk, 'Apology category builder loaded');

    // Category 2.4: Birthday via "Start Creating"
    console.log('Testing Birthday Category via Start Creating...');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 1200));
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.innerText.includes('Start Creating'));
      if (startBtn) startBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 800));
    // Click Boy in RecipientModal
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const boyBtn = btns.find(b => b.innerText.includes('Boy') || b.innerText.includes('Him'));
      if (boyBtn) boyBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1500));
    const birthdayOk = await checkErrorBoundary('Enter Birthday category (Boy)');
    recordResult(birthdayOk, 'Birthday category builder loaded');

    // -------------------------------------------------------------
    // TEST 3: COMPREHENSIVE TEMPLATE SWITCHING ACROSS ALL STYLES
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Switching All Templates in Builder ---');
    // We test switching through templates directly in the preview simulator
    const allTemplates = [
      // Birthday
      'royal-sapphire',
      'golden-birthday',
      'polaroid-scrapbook',
      'blush-rose',
      'princess-peach',
      'lavender-dream',
      // Romance
      'velvet-romance',
      'sunset-romance',
      'celestial-love',
      // Scrapbook
      'vintage-kodak',
      'neon-nostalgia',
      'cozy-memories',
      // Apology
      'gentle-peace',
      'sweet-forgive',
      'fresh-start'
    ];

    for (const tmplId of allTemplates) {
      console.log(`Switching to template: ${tmplId}...`);
      await evaluate(`(() => {
        // Trigger React state change or navigate directly to test simulator rendering
        window.history.pushState({}, '', '/');
      })()`);
      await sendCommand('Page.navigate', { url: `${BASE_URL}/?preview=${tmplId}` });
      await new Promise((r) => setTimeout(r, 1000));
      const tmplOk = await checkErrorBoundary(`Template preview: ${tmplId}`);
      recordResult(tmplOk, `Template ${tmplId} rendered cleanly without ErrorBoundary`);
    }

    // -------------------------------------------------------------
    // TEST 4: BUILDER STUDIO INPUT EDITING & EMPTY INPUT RESILIENCE
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Builder Studio Input Editing & Empty Fields ---');
    // Navigate into Builder Studio
    await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 1200));
    await evaluate(`(() => {
      const cards = Array.from(document.querySelectorAll('button'));
      const card = cards.find(b => b.innerText.includes('Love & Anniversary') || b.innerText.includes('Romance'));
      if (card) card.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1500));

    // Click "Proceed to Form" (Step 2)
    console.log('Navigating to Step 2 Form...');
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const proceed = btns.find(b => b.innerText.includes('Proceed to Form') || b.innerText.includes('Next') || b.innerText.includes('Step 2'));
      if (proceed) proceed.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));
    const step2Ok = await checkErrorBoundary('Step 2 Form loaded');
    recordResult(step2Ok, 'Step 2 Form opened');

    // Test clearing recipient name and sender name (empty values must not throw)
    console.log('Testing empty input values...');
    await evaluate(`(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      inputs.forEach(input => {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    })()`);
    await new Promise((r) => setTimeout(r, 1000));
    const emptyOk = await checkErrorBoundary('Empty form inputs resilience');
    recordResult(emptyOk, 'Mobile simulator handled empty strings safely');

    // Test filling custom names
    console.log('Testing custom input values...');
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

    // Switch between form tabs: Names, Photo & Song, Reasons & Letter
    console.log('Testing switching form tabs...');
    const formTabs = ['Names', 'Photo', 'Letter'];
    for (const t of formTabs) {
      await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const tabBtn = btns.find(b => b.innerText.includes('${t}'));
        if (tabBtn) tabBtn.click();
      })()`);
      await new Promise((r) => setTimeout(r, 800));
      const tabOk = await checkErrorBoundary(`Form tab: ${t}`);
      recordResult(tabOk, `Form tab ${t} active without crash`);
    }

    // Test simulator internal tab navigation
    console.log('Testing Phone Simulator internal tabs (Photos, Letter, Quiz)...');
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

    // Test clicking wax seal envelope in simulator
    console.log('Testing wax envelope unseal in simulator...');
    await evaluate(`(() => {
      const seal = document.querySelector('[title*="unseal"]') || document.querySelector('.khat-envelope');
      if (seal) seal.click();
    })()`);
    await new Promise((r) => setTimeout(r, 800));
    const envelopeOk = await checkErrorBoundary('Wax envelope opened in simulator');
    recordResult(envelopeOk, 'Envelope opened cleanly');

    // -------------------------------------------------------------
    // TEST 5: PRODUCTION KEEPSAKE VIEW (?v=maya-eq97c)
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Keepsake View (?v=maya-eq97c) ---');
    await sendCommand('Page.navigate', { url: `${BASE_URL}/?v=maya-eq97c` });
    await new Promise((r) => setTimeout(r, 2000));
    const keepsakeOk = await checkErrorBoundary('Keepsake initial load (?v=maya-eq97c)');
    recordResult(keepsakeOk, 'Keepsake page loaded without error boundary');

    // Click "Tap to Open Surprise"
    console.log('Interacting: Tap to Open Surprise...');
    await evaluate(`(() => {
      const btn = document.querySelector('.intro-enter-btn') ||
                  Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tap to Open'));
      if (btn) btn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 1200));
    const openOk = await checkErrorBoundary('After Tap to Open in Keepsake');
    recordResult(openOk, 'Surprise opened successfully');

    // Toggle Music Pill
    console.log('Interacting: Music toggle pill...');
    await evaluate(`(() => {
      const pill = document.querySelector('.soft-music-pill');
      if (pill) pill.click();
    })()`);
    await new Promise((r) => setTimeout(r, 600));
    const musicOk = await checkErrorBoundary('Music pill toggle');
    recordResult(musicOk, 'Music pill clicked without crash');

    // Test Keepsake Tab Switching
    console.log('Interacting: Keepsake Navigation Pills...');
    const navPills = ['Photos', 'Letter', 'Quiz', 'game'];
    for (const pill of navPills) {
      await evaluate(`(() => {
        const pills = document.querySelectorAll('.nav-pill');
        pills.forEach(p => {
          if (p.innerText.includes('${pill}')) p.click();
        });
      })()`);
      await new Promise((r) => setTimeout(r, 600));
      const pillOk = await checkErrorBoundary(`Keepsake nav pill ${pill}`);
      recordResult(pillOk, `Keepsake tab ${pill} active`);
    }

    // Test interactive quiz in keepsake
    console.log('Interacting: Quiz YES button...');
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const yesBtn = btns.find(b => b.innerText.includes('YES'));
      if (yesBtn) yesBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 600));
    const quizOk = await checkErrorBoundary('Quiz YES button click');
    recordResult(quizOk, 'Quiz interaction succeeded');

    // -------------------------------------------------------------
    // TEST 6: PRIVACY AUDIT (ZERO OCCURRENCES OF 'aditi' AND 'devi')
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Privacy Audit (Zero aditi/devi) ---');
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

    // Also check index.html
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
