import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';
const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedChecks++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function verifyDevServer() {
  try {
    const res = await fetch(BASE_URL);
    if (res.ok) {
      console.log(`[0/4] Dev server verified responding at ${BASE_URL}`);
      return true;
    }
  } catch (e) {
    console.error(`Dev server at ${BASE_URL} is not responding:`, e.message);
  }
  return false;
}

async function runSimulatorLaptopFitSuite() {
  console.log('===============================================================');
  console.log('📐 WISHCRAFT VISUAL QA: SIMULATOR LAPTOP & VIEWPORT FIT SUITE');
  console.log('===============================================================\n');

  const serverOk = await verifyDevServer();
  if (!serverOk) {
    console.error(`Cannot proceed: Dev server at ${BASE_URL} not reachable.`);
    process.exit(1);
  }

  if (!fs.existsSync(CHROME_PATH)) {
    console.error(`Chrome executable not found at ${CHROME_PATH}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,720',
    ],
    defaultViewport: { width: 1280, height: 551 }
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon.ico') && !text.includes('404')) {
        consoleErrors.push(text);
      }
    }
  });

  try {
    // -------------------------------------------------------------
    // TEST CASE 1: LAPTOP VIEWPORT 1280x551 (User's Exact Screen)
    // -------------------------------------------------------------
    console.log('\n[1/4] Testing Viewport 1280x551 (Exact user laptop screen)...');
    await page.setViewport({ width: 1280, height: 551, deviceScaleFactor: 1 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    // Click Romance Occasion
    await page.waitForSelector('section#occasions', { timeout: 10000 });
    const clickedRomance = await page.evaluate(() => {
      const occasionButtons = Array.from(document.querySelectorAll('section#occasions button'));
      for (const btn of occasionButtons) {
        if (btn.innerText.includes('Romance') || btn.innerText.includes('Love')) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    assert(clickedRomance, 'Clicked Romance Occasion card to open Builder Studio');

    // Wait for phone simulator to load and scale
    await page.waitForSelector('.soft-app.in-phone-simulator, .romance-phone-simulator', { timeout: 15000 });
    await page.waitForSelector('.rounded-\\[52px\\]', { timeout: 10000 });
    // Let ResizeObserver settle scale
    await new Promise((r) => setTimeout(r, 1200));

    // Measure metrics on 1280x551
    const laptop551Metrics = await page.evaluate(() => {
      const phoneRims = Array.from(document.querySelectorAll('.rounded-\\[52px\\]'));
      const phoneRim = phoneRims.find((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 0 && r.width > 0;
      }) || phoneRims[0];
      const bottomBar = document.querySelector('.fixed.bottom-0');
      const navbar = document.querySelector('header');
      
      // Find "Proceed to Form" button
      const allButtons = Array.from(document.querySelectorAll('button'));
      const proceedBtn = allButtons.find((b) => b.innerText && b.innerText.includes('Proceed to Form'));

      if (!phoneRim || !bottomBar) {
        return { error: 'Required elements not found' };
      }

      const phoneRect = phoneRim.getBoundingClientRect();
      const bottomBarRect = bottomBar.getBoundingClientRect();
      const navbarRect = navbar ? navbar.getBoundingClientRect() : { top: 0, bottom: 56, height: 56 };
      const proceedBtnRect = proceedBtn ? proceedBtn.getBoundingClientRect() : null;

      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        phone: {
          top: phoneRect.top,
          bottom: phoneRect.bottom,
          left: phoneRect.left,
          right: phoneRect.right,
          width: phoneRect.width,
          height: phoneRect.height,
        },
        bottomBar: {
          top: bottomBarRect.top,
          bottom: bottomBarRect.bottom,
          height: bottomBarRect.height,
        },
        navbar: {
          top: navbarRect.top,
          bottom: navbarRect.bottom,
          height: navbarRect.height,
        },
        proceedBtn: proceedBtnRect ? {
          top: proceedBtnRect.top,
          bottom: proceedBtnRect.bottom,
          left: proceedBtnRect.left,
          right: proceedBtnRect.right,
          width: proceedBtnRect.width,
          height: proceedBtnRect.height,
        } : null,
      };
    });

    console.log('  Metrics for 1280x551:', JSON.stringify(laptop551Metrics, null, 2));

    const phone = laptop551Metrics.phone;
    const bottomBar = laptop551Metrics.bottomBar;
    const proceedBtn = laptop551Metrics.proceedBtn;

    // Assert: Chassis top >= 56px (does not clip under or behind the top navbar)
    assert(
      phone.top >= 56,
      `Chassis top (${phone.top.toFixed(1)}px) >= 56px (no navbar clipping)`
    );

    // Assert: Chassis bottom <= 551 - 60px (491px) (leaves breathing room above fixed bottom bar)
    assert(
      phone.bottom <= 491,
      `Chassis bottom (${phone.bottom.toFixed(1)}px) <= 491px (551 - 60px: breathing room above bottom bar at ${bottomBar.top.toFixed(1)}px)`
    );

    // Assert: Chassis height <= 425px so entire phone fits completely inside viewport
    assert(
      phone.height <= 425,
      `Chassis height (${phone.height.toFixed(1)}px) <= 425px (fits completely inside screen)`
    );

    // Assert: Proceed to Form button does NOT collide with or overlap the phone chassis
    assert(Boolean(proceedBtn), 'Proceed to Form button located in DOM');
    if (proceedBtn) {
      const collides = !(
        phone.right < proceedBtn.left ||
        phone.left > proceedBtn.right ||
        phone.bottom < proceedBtn.top ||
        phone.top > proceedBtn.bottom
      );
      assert(
        !collides,
        `Proceed to Form button does not collide/overlap chassis (Phone bottom ${phone.bottom.toFixed(1)}px < Button top ${proceedBtn.top.toFixed(1)}px)`
      );
    }

    const screenshot551Path = path.join(__dirname, 'simulator-laptop-551-fit.png');
    await page.screenshot({ path: screenshot551Path, fullPage: false });
    console.log(`  📸 Saved screenshot: ${screenshot551Path}`);
    assert(fs.existsSync(screenshot551Path), 'Screenshot simulator-laptop-551-fit.png exists on disk');

    // -------------------------------------------------------------
    // TEST CASE 2: LAPTOP VIEWPORT 1366x768 (Standard HD Laptop)
    // -------------------------------------------------------------
    console.log('\n[2/4] Testing Viewport 1366x768 (Standard HD Laptop)...');
    await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });
    // Allow ResizeObserver to update dimensions and recalculate scale
    await new Promise((r) => setTimeout(r, 1200));

    const laptop768Metrics = await page.evaluate(() => {
      const phoneRims = Array.from(document.querySelectorAll('.rounded-\\[52px\\]'));
      const phoneRim = phoneRims.find((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 0 && r.width > 0;
      }) || phoneRims[0];
      const bottomBar = document.querySelector('.fixed.bottom-0');
      const navbar = document.querySelector('header');

      const phoneRect = phoneRim.getBoundingClientRect();
      const bottomBarRect = bottomBar.getBoundingClientRect();
      const navbarRect = navbar ? navbar.getBoundingClientRect() : { top: 0, bottom: 56, height: 56 };

      return {
        phone: {
          top: phoneRect.top,
          bottom: phoneRect.bottom,
          height: phoneRect.height,
        },
        bottomBar: {
          top: bottomBarRect.top,
          height: bottomBarRect.height,
        },
        navbar: {
          bottom: navbarRect.bottom,
        },
      };
    });

    console.log('  Metrics for 1366x768:', JSON.stringify(laptop768Metrics, null, 2));

    assert(
      laptop768Metrics.phone.top >= laptop768Metrics.navbar.bottom,
      `Chassis top (${laptop768Metrics.phone.top.toFixed(1)}px) >= Navbar bottom (${laptop768Metrics.navbar.bottom}px)`
    );
    assert(
      laptop768Metrics.phone.bottom <= laptop768Metrics.bottomBar.top,
      `Chassis bottom (${laptop768Metrics.phone.bottom.toFixed(1)}px) <= Bottom bar top (${laptop768Metrics.bottomBar.top.toFixed(1)}px)`
    );
    assert(
      laptop768Metrics.phone.height <= 600,
      `Chassis height (${laptop768Metrics.phone.height.toFixed(1)}px) <= 600px (clean fit with ample margin)`
    );

    const screenshot768Path = path.join(__dirname, 'simulator-laptop-768-fit.png');
    await page.screenshot({ path: screenshot768Path, fullPage: false });
    console.log(`  📸 Saved screenshot: ${screenshot768Path}`);
    assert(fs.existsSync(screenshot768Path), 'Screenshot simulator-laptop-768-fit.png exists on disk');

    // -------------------------------------------------------------
    // TEST CASE 3: MOBILE VIEWPORT 393x852 (iPhone 15 / Modern Mobile)
    // -------------------------------------------------------------
    console.log('\n[3/4] Testing Mobile Viewport 393x852 (Mobile Preview Tab)...');
    await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 1 });
    await new Promise((r) => setTimeout(r, 1000));

    // Ensure we are inside Builder Studio; if a reload occurred, navigate back to romance
    const isBuilderOpen = await page.evaluate(() =>
      Boolean(document.querySelector('.soft-app.in-phone-simulator, .romance-phone-simulator'))
    );
    if (!isBuilderOpen) {
      console.log('  Re-opening Romance occasion on mobile layout...');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('section#occasions button'));
        for (const btn of btns) {
          if (btn.innerText.includes('Romance') || btn.innerText.includes('Love')) {
            btn.click();
            break;
          }
        }
      });
      await page.waitForSelector('.soft-app.in-phone-simulator, .romance-phone-simulator', { timeout: 10000 });
      await new Promise((r) => setTimeout(r, 1000));
    }

    // Click "Phone Preview" tab in mobile view
    const clickedPreviewTab = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const previewBtn = buttons.find((b) => (b.innerText || b.textContent || '').includes('Phone Preview'));
      if (previewBtn) {
        previewBtn.click();
        return true;
      }
      return false;
    });
    assert(clickedPreviewTab, 'Clicked "Phone Preview" tab in mobile view');

    // Wait for mobile preview container to mount and ResizeObserver to calculate scale
    await new Promise((r) => setTimeout(r, 1200));

    const mobileMetrics = await page.evaluate(() => {
      // Find the VISIBLE phone chassis in mobile preview (not the hidden desktop panel)
      const phoneRims = Array.from(document.querySelectorAll('.rounded-\\[52px\\]'));
      const phoneRim = phoneRims.find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.height > 0 && rect.width > 0;
      }) || phoneRims[1] || phoneRims[0];

      const bottomBar = document.querySelector('.fixed.bottom-0');
      // The mobile container has style height calc(100vh - 180px)
      const container = Array.from(document.querySelectorAll('div')).find((d) => d.style && d.style.height && d.style.height.includes('180px'));

      const phoneRect = phoneRim ? phoneRim.getBoundingClientRect() : null;
      const bottomBarRect = bottomBar ? bottomBar.getBoundingClientRect() : null;
      const containerRect = container ? container.getBoundingClientRect() : null;

      return {
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        phone: phoneRect ? {
          top: phoneRect.top,
          bottom: phoneRect.bottom,
          height: phoneRect.height,
          width: phoneRect.width,
        } : null,
        bottomBar: bottomBarRect ? {
          top: bottomBarRect.top,
          height: bottomBarRect.height,
        } : null,
        container: containerRect ? {
          top: containerRect.top,
          bottom: containerRect.bottom,
          height: containerRect.height,
        } : null,
      };
    });

    console.log('  Metrics for 393x852:', JSON.stringify(mobileMetrics, null, 2));

    assert(Boolean(mobileMetrics.phone), 'Mobile phone chassis detected in DOM');
    if (mobileMetrics.phone) {
      assert(
        mobileMetrics.phone.top >= 0,
        `Mobile chassis top (${mobileMetrics.phone.top.toFixed(1)}px) >= 0px (no top off-screen clipping)`
      );
      assert(
        mobileMetrics.phone.bottom <= mobileMetrics.viewportHeight,
        `Mobile chassis bottom (${mobileMetrics.phone.bottom.toFixed(1)}px) <= Viewport height (${mobileMetrics.viewportHeight}px)`
      );
      assert(
        mobileMetrics.phone.bottom <= (mobileMetrics.bottomBar?.top || 852),
        `Mobile chassis bottom (${mobileMetrics.phone.bottom.toFixed(1)}px) <= Bottom bar top (${mobileMetrics.bottomBar?.top.toFixed(1)}px)`
      );
      if (mobileMetrics.container) {
        assert(
          mobileMetrics.phone.height <= mobileMetrics.container.height + 4,
          `Mobile chassis height (${mobileMetrics.phone.height.toFixed(1)}px) fits inside calc(100vh - 180px) container (${mobileMetrics.container.height.toFixed(1)}px)`
        );
      }
    }

    const screenshotMobilePath = path.join(__dirname, 'simulator-mobile-preview.png');
    await page.screenshot({ path: screenshotMobilePath, fullPage: false });
    console.log(`  📸 Saved screenshot: ${screenshotMobilePath}`);
    assert(fs.existsSync(screenshotMobilePath), 'Screenshot simulator-mobile-preview.png exists on disk');

    // -------------------------------------------------------------
    // TEST CASE 4: CONSOLE ERRORS AUDIT
    // -------------------------------------------------------------
    console.log('\n[4/4] Console Error Audit...');
    assert(consoleErrors.length === 0, `0 console errors encountered (actual: ${consoleErrors.length})`);
    if (consoleErrors.length > 0) {
      console.warn('Console errors encountered:', consoleErrors);
    }

  } catch (err) {
    console.error('Unhandled test suite error:', err);
    assert(false, `Test suite execution without unhandled exceptions: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n===============================================================');
  console.log(`RESULTS: ${passedChecks}/${totalChecks} checks passed (${failedChecks} failed)`);
  console.log('===============================================================\n');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runSimulatorLaptopFitSuite();
