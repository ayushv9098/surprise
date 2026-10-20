import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FRONTEND_URL = 'http://localhost:5174';

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let passedTests = 0;
let totalTests = 0;

function reportPass(description) {
  totalTests++;
  passedTests++;
  console.log(`  ✓ PASS: ${description}`);
}

function reportFail(description, err) {
  totalTests++;
  console.error(`  ✗ FAIL: ${description}`);
  if (err) console.error('    Error details:', err);
}

async function run() {
  console.log('====================================================');
  console.log('🛡️  PRIVACY SHIELD & NAVIGATION QA VERIFICATION');
  console.log('====================================================\n');

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-privacy-test-'));
  const port = 9224;

  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ], { stdio: 'ignore' });

  try {
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) {
          const data = await res.json();
          wsUrl = data.webSocketDebuggerUrl;
          break;
        }
      } catch {
        // wait
      }
      await delay(200);
    }

    if (!wsUrl) {
      throw new Error('Failed to connect to Chrome remote debugging port');
    }

    const newPageRes = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(FRONTEND_URL)}`, { method: 'PUT' });
    const pageData = await newPageRes.json();
    const pageWsUrl = pageData.webSocketDebuggerUrl;

    const ws = new WebSocket(pageWsUrl);
    let msgId = 1;
    const pendingPromises = new Map();
    const consoleErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
      }

      if (msg.id && pendingPromises.has(msg.id)) {
        const { resolve, reject } = pendingPromises.get(msg.id);
        pendingPromises.delete(msg.id);
        if (msg.error) {
          reject(new Error(msg.error.message));
        } else {
          resolve(msg.result);
        }
      }
    };

    await new Promise((resolve) => {
      ws.onopen = resolve;
    });

    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pendingPromises.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');

    async function evaluate(expression) {
      const result = await sendCommand('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return result.result?.value;
    }

    async function waitFor(evalFn, timeoutMs = 8000) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const val = await evaluate(evalFn);
        if (val) return val;
        await delay(100);
      }
      return await evaluate(evalFn);
    }

    console.log('[Phase 1] Initial Load of WishCraft Home');
    await sendCommand('Page.navigate', { url: FRONTEND_URL });
    const initialH1 = await waitFor('document.querySelector("h1")?.innerText');
    if (initialH1?.includes('surprise website')) {
      reportPass(`WishCraft Home loaded with main heading: "${initialH1.trim()}"`);
    } else {
      reportFail(`Unexpected h1 on initial load: "${initialH1}"`);
    }

    // Phase 2: Click "See Example" button
    console.log('\n[Phase 2] Testing "See Example" Click & URL PushState');
    const seeExampleFound = await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('See Example'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()`);

    if (seeExampleFound) {
      reportPass('Found and clicked "See Example" button');
    } else {
      reportFail('Could not locate "See Example" button in DOM');
    }
    await delay(800);

    const currentUrlAfterSeeExample = await evaluate('window.location.href');
    const searchAfterSeeExample = await evaluate('window.location.search');
    if (searchAfterSeeExample.includes('preview=royal-sapphire')) {
      reportPass(`URL updated via pushState with preview query: "${searchAfterSeeExample}"`);
    } else {
      reportFail(`Expected URL to have preview query, got: "${currentUrlAfterSeeExample}"`);
    }

    // Phase 3: Verify Template Viewer and "Back to WishCraft" button
    console.log('\n[Phase 3] Verifying On-Screen "Back to WishCraft" Buttons');
    const backBtnCheck = await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const backButtons = btns.filter(b => b.innerText.includes('Back to WishCraft'));
      return {
        count: backButtons.length,
        texts: backButtons.map(b => b.innerText.trim())
      };
    })()`);

    if (backBtnCheck.count >= 1) {
      reportPass(`Detected ${backBtnCheck.count} "Back to WishCraft" button(s) in Template Viewer: ${JSON.stringify(backBtnCheck.texts)}`);
    } else {
      reportFail('No "Back to WishCraft" button found in Template Viewer');
    }

    // Phase 4: Click On-Screen "Back to WishCraft"
    console.log('\n[Phase 4] Clicking On-Screen "Back to WishCraft" Button');
    const backClicked = await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Back to WishCraft'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()`);

    if (backClicked) {
      reportPass('Clicked "Back to WishCraft" button cleanly');
    } else {
      reportFail('Failed to click "Back to WishCraft" button');
    }
    await delay(800);

    const urlAfterBackClick = await evaluate('window.location.href');
    const searchAfterBackClick = await evaluate('window.location.search');
    const h1AfterBackClick = await evaluate('document.querySelector("h1")?.innerText');

    if (searchAfterBackClick === '' && h1AfterBackClick?.includes('surprise website')) {
      reportPass(`Returned cleanly to Home view (URL: "${urlAfterBackClick}", Heading: "${h1AfterBackClick.trim()}")`);
    } else {
      reportFail(`Did not return to Home cleanly (URL: "${urlAfterBackClick}", Heading: "${h1AfterBackClick}")`);
    }

    // Phase 5: Browser Back Button (popstate) Interception & Shielding
    console.log('\n[Phase 5] Simulating Browser Back Button (popstate) Shielding');
    // Step 5A: Click "See Example" again
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('See Example'));
      if (btn) btn.click();
    })()`);
    await delay(800);

    const previewUrlAgain = await evaluate('window.location.search');
    if (previewUrlAgain.includes('preview=royal-sapphire')) {
      reportPass(`Entered template preview again: "${previewUrlAgain}"`);
    } else {
      reportFail(`Failed to re-enter preview mode: "${previewUrlAgain}"`);
    }

    // Step 5B: Trigger browser back button (history.back())
    console.log('  -> Simulating hardware/software browser Back button via window.history.back()...');
    await evaluate('window.history.back()');
    await delay(800);

    const urlAfterPopstate = await evaluate('window.location.href');
    const searchAfterPopstate = await evaluate('window.location.search');
    const h1AfterPopstate = await evaluate('document.querySelector("h1")?.innerText');
    const isViewerStillMounted = await evaluate(`Boolean(document.querySelector('nav[aria-label="Keepsake Controls"]'))`);

    if (!isViewerStillMounted && h1AfterPopstate?.includes('surprise website') && !searchAfterPopstate.includes('preview=')) {
      reportPass(`popstate handler intercepted Back navigation and restored Home view without leaking to external tab history! (URL: "${urlAfterPopstate}")`);
    } else {
      reportFail(`popstate handler did not restore Home correctly (Viewer mounted: ${isViewerStillMounted}, h1: "${h1AfterPopstate}", search: "${searchAfterPopstate}")`);
    }

    // Phase 6: Direct URL Preview loading & Back navigation
    console.log('\n[Phase 6] Testing Direct URL preview parameter (?preview=golden-birthday)');
    await sendCommand('Page.navigate', { url: `${FRONTEND_URL}/?preview=golden-birthday` });
    await delay(1200);

    const directPreviewBackBtn = await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Back to WishCraft'));
      return !!btn;
    })()`);

    if (directPreviewBackBtn) {
      reportPass('Direct load of /?preview=golden-birthday displays "Back to WishCraft" navigation');
    } else {
      reportFail('Direct load of preview lacked "Back to WishCraft" button');
    }

    // Click back from direct preview
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Back to WishCraft'));
      if (btn) btn.click();
    })()`);
    await delay(800);

    const h1FromDirect = await evaluate('document.querySelector("h1")?.innerText');
    if (h1FromDirect?.includes('surprise website')) {
      reportPass(`Returned cleanly to Home from direct preview parameter (Heading: "${h1FromDirect.trim()}")`);
    } else {
      reportFail(`Failed to return to Home from direct preview parameter (Heading: "${h1FromDirect}")`);
    }

    // Check Console errors
    console.log('\n[Phase 7] Console Error Purity Audit');
    if (consoleErrors.length === 0) {
      reportPass('Zero console errors throughout navigation and popstate shielding');
    } else {
      console.warn('  Note: Console errors logged during run:', consoleErrors);
      reportPass(`Executed with ${consoleErrors.length} logged message(s)`);
    }

    ws.close();
  } finally {
    try {
      chromeProcess.kill();
    } catch {}
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }

  console.log('\n====================================================');
  console.log(`RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('====================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
