import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9266;
const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';

async function main() {
  console.log('===============================================================');
  console.log('🧪 TESTING SIMULATOR VIEWPORT AUTO-SCALE & RESIZE PHYSICS FIX');
  console.log('===============================================================\n');

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

  const listRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
  const pages = await listRes.json();
  const pageTarget = pages.find((p) => p.type === 'page') || pages[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let msgId = 1;
  const pendingPromises = new Map();

  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && pendingPromises.has(msg.id)) {
      const { resolve } = pendingPromises.get(msg.id);
      pendingPromises.delete(msg.id);
      resolve(msg);
    }
  };

  function sendCommand(method, params = {}, timeoutMs = 8000) {
    return new Promise((resolve) => {
      const id = msgId++;
      const timer = setTimeout(() => {
        pendingPromises.delete(id);
        resolve({ error: { message: `Timeout ${method}` } });
      }, timeoutMs);

      pendingPromises.set(id, {
        resolve: (val) => {
          clearTimeout(timer);
          resolve(val);
        }
      });

      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCommand('Runtime.enable');
  await sendCommand('DOM.enable');

  async function evaluate(expression) {
    const res = await sendCommand('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.result?.value;
  }

  async function captureScreenshot(filepath) {
    const shot = await sendCommand('Page.captureScreenshot', { format: 'png' });
    if (shot.result?.data) {
      fs.writeFileSync(filepath, Buffer.from(shot.result.data, 'base64'));
      console.log(`  📸 Screenshot saved: ${filepath}`);
    }
  }

  // 1. Navigate to Builder view
  console.log('Navigating to Builder view...');
  await sendCommand('Page.navigate', { url: `${BASE_URL}/` });
  await new Promise((r) => setTimeout(r, 2000));

  await evaluate(`(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const bdayCard = btns.find(b => b.innerText && (b.innerText.includes('Birthday') || b.innerText.includes('Royal Sapphire')));
    if (bdayCard) {
      bdayCard.click();
    } else {
      const anyBtn = btns.find(b => b.innerText && b.innerText.includes('Create'));
      if (anyBtn) anyBtn.click();
    }
  })()`);
  await new Promise((r) => setTimeout(r, 2000));

  // If recipient modal opened, click boy or girl
  await evaluate(`(() => {
    const modalBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && (b.innerText.includes('Him') || b.innerText.includes('Boy') || b.innerText.includes('Her')));
    if (modalBtn) modalBtn.click();
  })()`);
  await new Promise((r) => setTimeout(r, 2000));

  // -------------------------------------------------------------
  // TEST CASE 1: LAPTOP VIEWPORT 1280 x 551 (User's Exact Screen)
  // -------------------------------------------------------------
  console.log('\n--- TEST CASE 1: Laptop Screen (1280x551) ---');
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 551,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise((r) => setTimeout(r, 1200));

  const desktopMetrics = await evaluate(`
    (() => {
      // Find the phone chassis
      const phoneRim = document.querySelector('.rounded-\\\\[52px\\\\]');
      const bottomBar = document.querySelector('.fixed.bottom-0');
      const rightPanel = phoneRim ? phoneRim.closest('[style*="420px"]') : null;

      if (!phoneRim || !bottomBar) {
        return { error: 'Elements not found', hasPhone: Boolean(phoneRim), hasBottomBar: Boolean(bottomBar) };
      }

      const phoneRect = phoneRim.getBoundingClientRect();
      const bottomBarRect = bottomBar.getBoundingClientRect();
      const rightPanelRect = rightPanel ? rightPanel.getBoundingClientRect() : null;

      return {
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        phone: {
          top: phoneRect.top,
          bottom: phoneRect.bottom,
          height: phoneRect.height,
          width: phoneRect.width
        },
        bottomBar: {
          top: bottomBarRect.top,
          height: bottomBarRect.height
        },
        rightPanel: rightPanelRect ? {
          top: rightPanelRect.top,
          bottom: rightPanelRect.bottom,
          height: rightPanelRect.height
        } : null
      };
    })()
  `);

  console.log('Desktop 1280x551 Metrics:', JSON.stringify(desktopMetrics, null, 2));

  if (desktopMetrics && !desktopMetrics.error) {
    const { phone, bottomBar, rightPanel } = desktopMetrics;
    const phoneTop = phone.top;
    const phoneBottom = phone.bottom;
    const bottomBarTop = bottomBar.top;

    const noTopClipping = phoneTop >= (rightPanel?.top || 56);
    const noBottomOverlap = phoneBottom <= bottomBarTop;

    console.log(`  Top clearance: Phone top ${phoneTop.toFixed(1)}px >= Panel top ${rightPanel?.top || 56}px: ${noTopClipping ? 'PASS' : 'FAIL'}`);
    console.log(`  Bottom clearance: Phone bottom ${phoneBottom.toFixed(1)}px <= Bottom bar ${bottomBarTop.toFixed(1)}px: ${noBottomOverlap ? 'PASS' : 'FAIL'}`);

    if (noTopClipping && noBottomOverlap) {
      console.log('  ✅ SUCCESS: Phone fits completely within 1280x551 laptop screen without any clipping or bottom overlap!');
    } else {
      console.error('  ❌ FAILED clearance check!');
    }
  }

  await captureScreenshot(path.join(__dirname, 'test-laptop-1280x551.png'));

  // -------------------------------------------------------------
  // TEST CASE 2: MOBILE VIEWPORT 390 x 844 (iPhone 14 / 15)
  // -------------------------------------------------------------
  console.log('\n--- TEST CASE 2: Mobile Screen (390x844) ---');
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise((r) => setTimeout(r, 1200));

  // Switch to "Phone Preview" tab
  await evaluate(`
    const previewBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Phone Preview'));
    if (previewBtn) previewBtn.click();
  `);
  await new Promise((r) => setTimeout(r, 1200));

  const mobileMetrics = await evaluate(`
    (() => {
      // Find the VISIBLE phone chassis (not the hidden desktop one)
      const phoneRims = Array.from(document.querySelectorAll('.rounded-\\\\[52px\\\\]'));
      const phoneRim = phoneRims.find(el => el.getBoundingClientRect().height > 0) || phoneRims[1] || phoneRims[0];
      const bottomBar = document.querySelector('.fixed.bottom-0');

      if (!phoneRim || !bottomBar) {
        return { error: 'Elements not found on mobile', count: phoneRims.length, hasBottomBar: Boolean(bottomBar) };
      }

      const phoneRect = phoneRim.getBoundingClientRect();
      const bottomBarRect = bottomBar.getBoundingClientRect();

      return {
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        phone: {
          top: phoneRect.top,
          bottom: phoneRect.bottom,
          height: phoneRect.height,
          width: phoneRect.width
        },
        bottomBar: {
          top: bottomBarRect.top,
          height: bottomBarRect.height
        }
      };
    })()
  `);

  console.log('Mobile 390x844 Metrics:', JSON.stringify(mobileMetrics, null, 2));

  if (mobileMetrics && !mobileMetrics.error) {
    const { phone, bottomBar } = mobileMetrics;
    const phoneTop = phone.top;
    const phoneBottom = phone.bottom;
    const bottomBarTop = bottomBar.top;

    const noTopClipping = phoneTop >= 56; // Below navbar
    const noBottomOverlap = phoneBottom <= bottomBarTop;

    console.log(`  Top clearance: Phone top ${phoneTop.toFixed(1)}px >= Navbar ~56px: ${noTopClipping ? 'PASS' : 'FAIL'}`);
    console.log(`  Bottom clearance: Phone bottom ${phoneBottom.toFixed(1)}px <= Bottom bar ${bottomBarTop.toFixed(1)}px: ${noBottomOverlap ? 'PASS' : 'FAIL'}`);

    if (noTopClipping && noBottomOverlap) {
      console.log('  ✅ SUCCESS: Phone fits cleanly within mobile screen without any bottom overflow!');
    } else {
      console.error('  ❌ FAILED mobile clearance check!');
    }
  }

  await captureScreenshot(path.join(__dirname, 'test-mobile-390x844.png'));

  killChrome();
  console.log('\nVerification complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
