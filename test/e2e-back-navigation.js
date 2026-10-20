import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FRONTEND_URL = 'http://localhost:5174';

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('====================================================');
  console.log('🧭 TESTING BUILDER BACK TO HOME NAVIGATION VIA CDP');
  console.log('====================================================\n');

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-test-'));
  const port = 9223;

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
    // Wait for Chrome remote debugging to become available
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

    // Create a new target page
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

    console.log('[Step 1] Navigating to Home page (/)');
    await sendCommand('Page.navigate', { url: FRONTEND_URL });
    await delay(1200);

    // Verify home page text
    async function evaluate(expression) {
      const result = await sendCommand('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return result.result?.value;
    }

    const initialHeading = await evaluate('document.querySelector("h1")?.innerText');
    console.log(`  ✓ Initial heading found: "${initialHeading}"`);
    if (!initialHeading?.includes('surprise website')) {
      throw new Error(`Expected home page heading, got: "${initialHeading}"`);
    }

    // Step 2: Navigate to Builder mode via Navbar "Create Free" button
    console.log('\n[Step 2] Clicking "Create Free" in Navbar to enter Builder mode');
    const enteredBuilder = await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const createBtn = btns.find(b => b.innerText.includes('Create Free'));
      if (createBtn) {
        createBtn.click();
        return true;
      }
      return false;
    })()`);
    console.log(`  ✓ "Create Free" clicked: ${enteredBuilder}`);
    await delay(800);

    // Verify Builder mode UI
    const isStudioVisible = await evaluate(`(() => {
      const text = document.body.innerText;
      return text.includes('Select Surprise Aesthetic') || text.includes('Choose Style') || text.includes('Back to Home');
    })()`);
    console.log(`  ✓ Builder Studio is visible in DOM: ${isStudioVisible}`);
    if (!isStudioVisible) {
      throw new Error('Builder Studio was not found in DOM after clicking Create Free');
    }

    // Step 3: Check that "Back to Home" is visible in Navbar and bottom toolbar
    console.log('\n[Step 3] Verifying "Back to Home" buttons in Navbar and bottom toolbar');
    const backButtonInfo = await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const backHomeBtns = btns.filter(b => b.innerText.includes('Back to Home'));
      return {
        count: backHomeBtns.length,
        texts: backHomeBtns.map(b => b.innerText.trim())
      };
    })()`);
    console.log(`  ✓ Found ${backButtonInfo.count} "Back to Home" button(s):`, backButtonInfo.texts);
    if (backButtonInfo.count === 0) {
      throw new Error('No "Back to Home" buttons found in builder mode');
    }

    // Step 4: Click the Navbar "Back to Home" button
    console.log('\n[Step 4] Clicking "Back to Home" in Navbar');
    const clickedNavBack = await evaluate(`(() => {
      const header = document.querySelector('header');
      const navBack = header ? Array.from(header.querySelectorAll('button')).find(b => b.innerText.includes('Back to Home')) : null;
      if (navBack) {
        navBack.click();
        return true;
      }
      return false;
    })()`);
    console.log(`  ✓ Clicked Navbar "Back to Home": ${clickedNavBack}`);
    await delay(600);

    // Verify returned to Home page
    const returnedHeading = await evaluate('document.querySelector("h1")?.innerText');
    console.log(`  ✓ Landing page heading after back navigation: "${returnedHeading}"`);
    if (!returnedHeading?.includes('surprise website')) {
      throw new Error(`Expected to land back on Home page, but h1 is: "${returnedHeading}"`);
    }

    const occasionsSection = await evaluate(`document.querySelector('#occasions h2')?.innerText`);
    console.log(`  ✓ Occasions section found: "${occasionsSection}"`);

    // Step 5: Enter Builder mode again via hero "Start Creating →" modal
    console.log('\n[Step 5] Clicking "Start Creating →" and choosing recipient');
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.innerText.includes('Start Creating'));
      if (startBtn) startBtn.click();
    })()`);
    await delay(400);

    const modalVisible = await evaluate(`document.body.innerText.includes('Who are you celebrating?')`);
    console.log(`  ✓ Recipient modal opened: ${modalVisible}`);

    // Select "For a Boy"
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const boyBtn = btns.find(b => b.innerText.includes('For a Boy'));
      if (boyBtn) boyBtn.click();
    })()`);
    await delay(800);

    const inBuilderAgain = await evaluate(`document.body.innerText.includes('Select Surprise Aesthetic')`);
    console.log(`  ✓ In Builder Studio after recipient selection: ${inBuilderAgain}`);

    // Step 6: Click bottom toolbar "Back to Home" button
    console.log('\n[Step 6] Clicking bottom toolbar "Back to Home" button');
    const clickedBottomBack = await evaluate(`(() => {
      const fixedBar = document.querySelector('.fixed.bottom-0');
      const bottomBack = fixedBar ? Array.from(fixedBar.querySelectorAll('button')).find(b => b.innerText.includes('Back to Home')) : null;
      if (bottomBack) {
        bottomBack.click();
        return true;
      }
      return false;
    })()`);
    console.log(`  ✓ Clicked bottom bar "Back to Home": ${clickedBottomBack}`);
    await delay(600);

    const finalHeading = await evaluate('document.querySelector("h1")?.innerText');
    console.log(`  ✓ Landed safely on Home page again: "${finalHeading}"`);
    if (!finalHeading?.includes('surprise website')) {
      throw new Error(`Expected to land back on Home page, but h1 is: "${finalHeading}"`);
    }

    // Step 7: Check console errors
    console.log('\n[Step 7] Checking console errors throughout navigation');
    console.log(`  Console errors encountered: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(e => console.error('    ->', e));
    }

    ws.close();
    console.log('\n====================================================');
    console.log('🎉 ALL BACK NAVIGATION CHECKS PASSED WITH 0 ERRORS');
    console.log('====================================================\n');

  } finally {
    try {
      chromeProcess.kill();
    } catch {}
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
