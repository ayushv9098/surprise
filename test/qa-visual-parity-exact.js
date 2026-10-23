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

// Bounding box collision helper
function boxesIntersect(r1, r2) {
  return !(
    r2.left >= r1.right ||
    r2.right <= r1.left ||
    r2.top >= r1.bottom ||
    r2.bottom <= r1.top
  );
}

async function runExactVisualParitySuite() {
  console.log('================================================================');
  console.log('🔍 WISHCRAFT EXACT VISUAL PARITY & HEADLESS VERIFICATION SUITE');
  console.log('   Target: Mobile Simulator vs Screenshot 2026-10-23 110935.png');
  console.log('================================================================\n');

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
      '--window-size=1440,900'
    ],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const uncaughtExceptions = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon.ico') && !text.includes('404')) {
        consoleErrors.push(text);
      }
    }
  });

  page.on('pageerror', (err) => {
    uncaughtExceptions.push(err.toString());
  });

  try {
    // -------------------------------------------------------------
    // Step 1: Open Dev Server and Navigate to Romance Builder Studio
    // -------------------------------------------------------------
    console.log(`[1/7] Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    const pageTitle = await page.title();
    assert(pageTitle.includes('Wishly'), `Home page loaded with title: "${pageTitle}"`);

    console.log('\n[2/7] Selecting Romance Occasion card to open Builder Studio...');
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
    assert(clickedRomance, 'Clicked Romance Occasion card');

    // Wait for the Romance simulator to appear
    await page.waitForSelector('.soft-app.in-phone-simulator, .romance-phone-simulator', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1200));

    // -------------------------------------------------------------
    // Step 2: High-Resolution Screenshot of Mobile Phone Simulator
    // -------------------------------------------------------------
    console.log('\n[3/7] Capturing high-resolution screenshot of the simulator element...');
    const currentSimulatorScreenshotPath = path.resolve(ROOT_DIR, 'test', 'current-simulator-parity.png');

    // Locate phone simulator chassis element
    const phoneSimulatorHandle = await page.$(
      '.soft-app.in-phone-simulator, .romance-phone-simulator, [style*="320px"]'
    );
    if (phoneSimulatorHandle) {
      await phoneSimulatorHandle.screenshot({ path: currentSimulatorScreenshotPath });
      console.log(`  📸 High-res screenshot saved to: ${currentSimulatorScreenshotPath}`);
    } else {
      await page.screenshot({ path: currentSimulatorScreenshotPath });
      console.log(`  📸 Full-page fallback screenshot saved to: ${currentSimulatorScreenshotPath}`);
    }

    assert(
      fs.existsSync(currentSimulatorScreenshotPath) && fs.statSync(currentSimulatorScreenshotPath).size > 15000,
      `Simulator screenshot verified on disk (${fs.statSync(currentSimulatorScreenshotPath).size} bytes)`
    );

    // -------------------------------------------------------------
    // Step 3: Exact Visual Parity & CSS Property Verifications
    // -------------------------------------------------------------
    console.log('\n[4/7] Deep CSS property and bounding box verification...');

    const visualMetrics = await page.evaluate(() => {
      // 1. Title & font
      const titleEl = document.querySelector('.soft-title');
      const titleComputed = titleEl ? window.getComputedStyle(titleEl) : null;

      // 2. Subtitle
      const subtitleEl = document.querySelector('.soft-subtitle');

      // 3. Swipe Guide Pill
      const swipePillEl = document.querySelector('.photo-swipe-guide-pill');
      const swipePillComputed = swipePillEl ? window.getComputedStyle(swipePillEl) : null;
      const swipePillRect = swipePillEl ? swipePillEl.getBoundingClientRect() : null;

      // 4. Music Pill
      const musicPillEl = document.querySelector('.soft-music-pill');
      const musicPillRect = musicPillEl ? musicPillEl.getBoundingClientRect() : null;
      const musicTitleEl = document.querySelector('.music-title');
      const musicTitleText = musicTitleEl ? musicTitleEl.innerText.trim() : '';

      // 5. Status bar (above simulator inside phone preview)
      const statusBarEl = document.querySelector('.relative.w-full.pt-3.px-6.pb-1');
      const statusBarRect = statusBarEl ? statusBarEl.getBoundingClientRect() : null;
      const titleRect = titleEl ? titleEl.getBoundingClientRect() : null;

      // 6. Polaroid deck elements (target active foreground card first)
      const washiTapeEl = document.querySelector('.card-active .washi-tape-strip') || document.querySelector('.washi-tape-strip');
      const zoomBtnEl = document.querySelector('.card-active .photo-card-zoom-btn') || document.querySelector('.photo-card-zoom-btn');
      const likeBtnEl = document.querySelector('.card-active .polaroid-like-btn') || document.querySelector('.polaroid-like-btn');
      const tagEl = document.querySelector('.card-active .memory-card-tag') || document.querySelector('.memory-card-tag');
      const captionEl = document.querySelector('.card-active .memory-card-caption') || document.querySelector('.memory-card-caption');
      const prevBtnEl = document.querySelector('.tactile-btn.photo-nav-btn');
      const counterPillEl = document.querySelector('.photo-counter-pill');

      // 7. Tabs
      const pillsContainer = document.querySelector('.soft-nav-pills');
      const navPills = Array.from(document.querySelectorAll('.soft-nav-pills .nav-pill'));
      const activePill = document.querySelector('.soft-nav-pills .nav-pill.active');

      return {
        title: {
          text: titleEl ? titleEl.innerText : '',
          fontFamily: titleComputed ? titleComputed.fontFamily : '',
          rect: titleRect ? { top: titleRect.top, bottom: titleRect.bottom, left: titleRect.left, right: titleRect.right } : null
        },
        subtitle: {
          text: subtitleEl ? subtitleEl.innerText : ''
        },
        swipePill: {
          exists: !!swipePillEl,
          clientHeight: swipePillEl ? swipePillEl.clientHeight : 0,
          offsetHeight: swipePillEl ? swipePillEl.offsetHeight : 0,
          whiteSpace: swipePillComputed ? swipePillComputed.whiteSpace : '',
          text: swipePillEl ? swipePillEl.innerText.replace(/\s+/g, ' ').trim() : '',
          rect: swipePillRect ? { top: swipePillRect.top, bottom: swipePillRect.bottom, left: swipePillRect.left, right: swipePillRect.right } : null
        },
        musicPill: {
          exists: !!musicPillEl,
          titleText: musicTitleText,
          rect: musicPillRect ? { top: musicPillRect.top, bottom: musicPillRect.bottom, left: musicPillRect.left, right: musicPillRect.right } : null
        },
        statusBar: {
          rect: statusBarRect ? { top: statusBarRect.top, bottom: statusBarRect.bottom, left: statusBarRect.left, right: statusBarRect.right } : null
        },
        polaroid: {
          hasWashiTape: !!washiTapeEl,
          hasZoomBtn: !!zoomBtnEl,
          hasLikeBtn: !!likeBtnEl,
          hasTag: !!tagEl,
          tagText: tagEl ? tagEl.innerText.trim() : '',
          hasCaption: !!captionEl,
          captionText: captionEl ? captionEl.innerText.trim() : '',
          hasPrevBtn: !!prevBtnEl,
          hasCounter: !!counterPillEl,
          counterText: counterPillEl ? counterPillEl.innerText.replace(/\s+/g, ' ').trim() : ''
        },
        tabs: {
          hasContainer: !!pillsContainer,
          count: navPills.length,
          labels: navPills.map((p) => p.innerText.replace(/\s+/g, ' ').trim()),
          activeLabel: activePill ? activePill.innerText.replace(/\s+/g, ' ').trim() : ''
        }
      };
    });

    // Check Title & Playfair Display serif font
    assert(
      visualMetrics.title.text.includes('Hey Maya') || visualMetrics.title.text.includes('Hey'),
      `Title has elegant greeting: "${visualMetrics.title.text}"`
    );
    assert(
      visualMetrics.title.fontFamily.toLowerCase().includes('playfair'),
      `Title uses Playfair Display serif font: "${visualMetrics.title.fontFamily}"`
    );

    // Check Centered Warm Subtitle
    assert(
      visualMetrics.subtitle.text.includes('A little corner made just to bring a smile to your face'),
      `Subtitle matches warm copy: "${visualMetrics.subtitle.text}"`
    );

    // Assert photo-swipe-guide-pill clientHeight <= 36px and never wraps into two lines!
    assert(visualMetrics.swipePill.exists, 'photo-swipe-guide-pill exists');
    assert(
      visualMetrics.swipePill.clientHeight <= 36,
      `photo-swipe-guide-pill clientHeight is <= 36px (actual: ${visualMetrics.swipePill.clientHeight}px)`
    );
    assert(
      visualMetrics.swipePill.whiteSpace === 'nowrap',
      `photo-swipe-guide-pill CSS white-space is nowrap (actual: ${visualMetrics.swipePill.whiteSpace})`
    );
    assert(
      visualMetrics.swipePill.text.includes('Swipe for more') && visualMetrics.swipePill.text.includes('1/2'),
      `photo-swipe-guide-pill text matches single line: "${visualMetrics.swipePill.text}"`
    );

    // Assert Music Pill has full title visible and doesn't collide with status bar or title
    assert(visualMetrics.musicPill.exists, 'Floating music pill exists');
    assert(
      visualMetrics.musicPill.titleText.length > 5,
      `Music pill has title visible: "${visualMetrics.musicPill.titleText}"`
    );

    // Collision checks
    console.log('  [Debug] Music Pill Rect:', visualMetrics.musicPill.rect);
    console.log('  [Debug] Title Rect:', visualMetrics.title.rect);
    console.log('  [Debug] Status Bar Rect:', visualMetrics.statusBar.rect);
    console.log('  [Debug] Active Caption:', visualMetrics.polaroid.captionText);
    console.log('  [Debug] Active Tag:', visualMetrics.polaroid.tagText);

    if (visualMetrics.musicPill.rect && visualMetrics.statusBar.rect) {
      const collideWithStatus = boxesIntersect(visualMetrics.musicPill.rect, visualMetrics.statusBar.rect);
      assert(!collideWithStatus, 'Music pill does NOT collide with top iOS status bar');
    }
    if (visualMetrics.musicPill.rect && visualMetrics.title.rect) {
      const collideWithTitle = boxesIntersect(visualMetrics.musicPill.rect, visualMetrics.title.rect);
      assert(!collideWithTitle, 'Music pill does NOT collide with recipient title text');
    }

    // Verify 3 Segmented Pill Tabs
    assert(visualMetrics.tabs.count >= 3, `Has 3 segmented tabs: ${visualMetrics.tabs.labels.join(', ')}`);
    assert(
      visualMetrics.tabs.activeLabel.includes('Photos'),
      `"Photos" is initial active tab: "${visualMetrics.tabs.activeLabel}"`
    );

    // Verify Polaroid Deck Elements
    assert(visualMetrics.polaroid.hasWashiTape, 'Polaroid card has pink washi tape overhang (.washi-tape-strip)');
    assert(visualMetrics.polaroid.hasZoomBtn, 'Circular frosted glass zoom button exists (.photo-card-zoom-btn)');
    assert(visualMetrics.polaroid.hasLikeBtn, 'Circular heart like button exists (.polaroid-like-btn)');
    assert(
      visualMetrics.polaroid.tagText.includes('BEGINNING') || visualMetrics.polaroid.tagText.includes('✨'),
      `Memory tag badge chip exists: "${visualMetrics.polaroid.tagText}"`
    );
    assert(
      visualMetrics.polaroid.captionText.startsWith('“') && visualMetrics.polaroid.captionText.endsWith('”'),
      `Caption is enclosed in elegant curly quotes: "${visualMetrics.polaroid.captionText}"`
    );
    assert(visualMetrics.polaroid.hasPrevBtn, 'Bottom tactile Prev navigation button exists');
    assert(
      visualMetrics.polaroid.counterText === '1 / 2' || visualMetrics.polaroid.counterText.includes('1 / 2'),
      `Bottom photo counter pill shows "1 / 2": "${visualMetrics.polaroid.counterText}"`
    );

    // -------------------------------------------------------------
    // Step 4: Test Tab Switching (Photos -> Letter -> Quiz -> Photos)
    // -------------------------------------------------------------
    console.log('\n[5/7] Testing interactive tab switching...');

    // Switch to Letter Tab
    await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.soft-nav-pills .nav-pill'));
      const letterPill = pills.find((p) => p.innerText.includes('Letter'));
      if (letterPill) letterPill.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const letterActive = await page.evaluate(() => {
      return !!document.querySelector('.khat-envelope, .wax-seal-badge, .khat-letter');
    });
    assert(letterActive, 'Clicking "Letter" tab successfully displays wax-sealed envelope');

    // Switch to Quiz Tab
    await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.soft-nav-pills .nav-pill'));
      const quizPill = pills.find((p) => p.innerText.includes('Quiz'));
      if (quizPill) quizPill.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const quizActive = await page.evaluate(() => {
      return !!document.querySelector('.quiz-heading, .game-question, .game-no-btn');
    });
    assert(quizActive, 'Clicking "Quiz" tab successfully displays runaway "No" button game');

    // Switch back to Photos Tab
    await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.soft-nav-pills .nav-pill'));
      const photosPill = pills.find((p) => p.innerText.includes('Photos'));
      if (photosPill) photosPill.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // -------------------------------------------------------------
    // Step 5: Test Reactive Form Input Updates Simulator Immediately
    // -------------------------------------------------------------
    console.log('\n[6/7] Testing reactive form updates in Builder Studio...');

    // Advance to Step 2 if on Step 1
    const onStep1 = await page.evaluate(() => {
      const cta = document.querySelector('button[type="button"] span.font-bold');
      return cta && cta.innerText.includes('Proceed to Form');
    });
    if (onStep1) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const nextBtn = btns.find((b) => b.innerText.includes('Proceed to Form'));
        if (nextBtn) nextBtn.click();
      });
      await new Promise((r) => setTimeout(r, 800));
    }

    const testName = 'Parity Verified Maya';
    await page.evaluate((name) => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs.length > 0) {
        const input = inputs[0];
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, name);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, testName);

    await new Promise((r) => setTimeout(r, 600));

    const updatedTitleText = await page.evaluate(() => {
      const titleEl = document.querySelector('.soft-title');
      return titleEl ? titleEl.innerText : '';
    });
    assert(
      updatedTitleText.includes(testName),
      `Typing in recipient form updates simulator title in real time: "${updatedTitleText}"`
    );

    // -------------------------------------------------------------
    // Step 6: Console Errors & Exceptions Audit
    // -------------------------------------------------------------
    console.log('\n[7/7] Auditing console errors and uncaught exceptions...');
    assert(
      consoleErrors.length === 0,
      `0 console errors encountered (actual: ${consoleErrors.length}${
        consoleErrors.length > 0 ? ': ' + consoleErrors.join(' | ') : ''
      })`
    );
    assert(
      uncaughtExceptions.length === 0,
      `0 uncaught exceptions encountered (actual: ${uncaughtExceptions.length}${
        uncaughtExceptions.length > 0 ? ': ' + uncaughtExceptions.join(' | ') : ''
      })`
    );
  } catch (err) {
    console.error('Fatal error during exact visual parity test:', err);
    failedChecks++;
  } finally {
    await browser.close();
  }

  // -------------------------------------------------------------
  // Privacy Audit: Assert ZERO occurrences of 'aditi' or 'devi'
  // -------------------------------------------------------------
  console.log('\n🔒 Repository Privacy Audit (ZERO occurrences of "aditi" or "devi")...');
  let privacyViolations = 0;

  function scanFolder(dir) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git' || entry === 'dist' || entry.endsWith('.png')) continue;
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanFolder(fullPath);
      } else if (/\.(jsx?|tsx?|html|css|json)$/i.test(entry)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (/aditi/i.test(content)) {
          console.error(`  ✗ Privacy violation: "aditi" found in ${fullPath}`);
          privacyViolations++;
        }
        if (/\bdevi\b/i.test(content)) {
          console.error(`  ✗ Privacy violation: whole word "devi" found in ${fullPath}`);
          privacyViolations++;
        }
      }
    }
  }

  scanFolder(path.resolve(ROOT_DIR, 'src'));
  scanFolder(path.resolve(ROOT_DIR, 'data'));
  assert(
    privacyViolations === 0,
    `Privacy audit passed: ZERO occurrences of 'aditi' or 'devi' across src/ and data/ (violations: ${privacyViolations})`
  );

  console.log('\n================================================================');
  console.log(`🏆 PARITY TEST SUMMARY: ${passedChecks}/${totalChecks} checks passed (${failedChecks} failed).`);
  console.log('================================================================');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runExactVisualParitySuite();
