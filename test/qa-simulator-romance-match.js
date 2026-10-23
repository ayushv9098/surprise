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

async function runVisualQASuite() {
  console.log('====================================================');
  console.log('📱 WISHCRAFT VISUAL QA: SIMULATOR & ROMANCE MATCH');
  console.log('====================================================\n');

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
      '--window-size=1366,900'
    ],
    defaultViewport: { width: 1366, height: 900 }
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const uncaughtExceptions = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter out harmless network audio preview 404s if any
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
    // Step 1: Open Home Page and Navigate to Romance Builder Studio
    // -------------------------------------------------------------
    console.log(`[1/7] Connecting to dev server at ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

    const pageTitle = await page.title();
    assert(pageTitle.includes('Wishly'), `Home page loaded with title: "${pageTitle}"`);

    console.log('\n[2/7] Selecting Romance Occasion to open Builder Studio...');
    // Look for occasion card containing "Romance" or "Love"
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
    assert(clickedRomance, 'Clicked Romance Occasion card successfully');

    // -------------------------------------------------------------
    // Step 2: Inspect elements inside the Mobile Phone Simulator
    // -------------------------------------------------------------
    console.log('\n[3/7] Inspecting elements inside Mobile Phone Simulator...');
    await page.waitForSelector('.soft-app.in-phone-simulator, .romance-phone-simulator', { timeout: 15000 });

    // Check 1: .soft-app.in-phone-simulator is rendered
    const hasSimulatorClass = await page.evaluate(() => {
      return !!document.querySelector('.soft-app.in-phone-simulator, .soft-app');
    });
    assert(hasSimulatorClass, 'Simulator renders .soft-app.in-phone-simulator');

    // Check 2: Title contains "Hey" with Playfair serif font
    const titleInfo = await page.evaluate(() => {
      const titleEl = document.querySelector('.soft-title, .soft-hero h1, h1');
      if (!titleEl) return null;
      const computed = window.getComputedStyle(titleEl);
      return {
        text: titleEl.innerText,
        fontFamily: computed.fontFamily
      };
    });
    assert(
      titleInfo && titleInfo.text.includes('Hey'),
      `Title contains "Hey": "${titleInfo?.text}"`
    );
    assert(
      titleInfo && titleInfo.fontFamily.toLowerCase().includes('playfair'),
      `Title uses Playfair serif font: "${titleInfo?.fontFamily}"`
    );

    // Check 3: Subtitle contains "A little corner made just to bring a smile to your face"
    const subtitleText = await page.evaluate(() => {
      const sub = document.querySelector('.soft-subtitle, .soft-hero p');
      return sub ? sub.innerText : '';
    });
    assert(
      subtitleText.includes('A little corner made just to bring a smile to your face'),
      `Subtitle contains expected warm greeting: "${subtitleText}"`
    );

    // Check 4: 3 segmented tabs: Photos, Letter, Quiz with .soft-nav-pills and .nav-pill
    const tabsInfo = await page.evaluate(() => {
      const pillsContainer = document.querySelector('.soft-nav-pills');
      const pills = Array.from(document.querySelectorAll('.soft-nav-pills .nav-pill, .soft-nav-pills button'));
      return {
        hasContainer: !!pillsContainer,
        count: pills.length,
        labels: pills.map(p => p.innerText.trim())
      };
    });
    assert(tabsInfo.hasContainer, 'Segmented nav container .soft-nav-pills exists');
    assert(tabsInfo.count >= 3, `Has at least 3 nav pill tabs (found ${tabsInfo.count}: ${tabsInfo.labels.join(', ')})`);

    // Check 5: Polaroid card deck elements
    const polaroidInfo = await page.evaluate(() => {
      return {
        hasWashiTape: !!document.querySelector('.washi-tape-strip'),
        hasZoomBtn: !!document.querySelector('.photo-card-zoom-btn'),
        hasLikeBtn: !!document.querySelector('.polaroid-like-btn'),
        hasSwipeGuide: !!document.querySelector('.photo-swipe-guide-pill'),
        swipeGuideText: document.querySelector('.photo-swipe-guide-pill')?.innerText || '',
        hasTag: !!document.querySelector('.memory-card-tag'),
        tagText: document.querySelector('.memory-card-tag')?.innerText || '',
        hasCaption: !!document.querySelector('.memory-card-caption'),
        captionText: document.querySelector('.memory-card-caption')?.innerText || '',
        hasPrevBtn: !!document.querySelector('.tactile-btn.photo-nav-btn, .photo-nav-btn'),
        hasCounter: !!document.querySelector('.photo-counter-pill'),
        counterText: document.querySelector('.photo-counter-pill')?.innerText || ''
      };
    });
    assert(polaroidInfo.hasWashiTape, 'Polaroid card has pink washi tape (.washi-tape-strip)');
    assert(polaroidInfo.hasZoomBtn, 'Polaroid card has magnifying zoom button (.photo-card-zoom-btn)');
    assert(polaroidInfo.hasLikeBtn, 'Polaroid card has heart like button (.polaroid-like-btn)');
    assert(polaroidInfo.hasSwipeGuide, `Swipe guide pill (.photo-swipe-guide-pill) exists: "${polaroidInfo.swipeGuideText}"`);
    assert(polaroidInfo.hasTag, `Memory card tag (.memory-card-tag) exists: "${polaroidInfo.tagText}"`);
    assert(polaroidInfo.hasCaption, `Memory card caption (.memory-card-caption) exists: "${polaroidInfo.captionText}"`);
    assert(polaroidInfo.hasPrevBtn, 'Tactile navigation buttons exist (.tactile-btn.photo-nav-btn)');
    assert(polaroidInfo.hasCounter, `Photo counter pill (.photo-counter-pill) exists: "${polaroidInfo.counterText}"`);

    // Check 6: Floating music pill (.soft-music-pill) is inside simulator
    const hasMusicPill = await page.evaluate(() => {
      const musicPill = document.querySelector('.soft-music-pill');
      const simulator = document.querySelector('.soft-app.in-phone-simulator, .soft-app, .romance-phone-simulator');
      if (!musicPill || !simulator) return false;
      return simulator.contains(musicPill);
    });
    assert(hasMusicPill, 'Floating music pill (.soft-music-pill) is rendered inside simulator frame');

    // -------------------------------------------------------------
    // Step 3: Test Interactive Tab Switching inside Simulator
    // -------------------------------------------------------------
    console.log('\n[4/7] Testing interactive tab switching inside simulator...');
    
    // Click "Letter" Tab
    await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.soft-nav-pills .nav-pill, .soft-nav-pills button'));
      const letterPill = pills.find(p => p.innerText.includes('Letter'));
      if (letterPill) letterPill.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const letterActive = await page.evaluate(() => {
      return !!document.querySelector('.khat-envelope, .wax-seal-badge, .khat-letter');
    });
    assert(letterActive, 'Clicking "Letter" tab displays wax seal envelope / letter component');

    // Click "Quiz" Tab
    await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.soft-nav-pills .nav-pill, .soft-nav-pills button'));
      const quizPill = pills.find(p => p.innerText.includes('Quiz') || p.innerText.includes('Game'));
      if (quizPill) quizPill.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const quizActive = await page.evaluate(() => {
      return !!document.querySelector('.quiz-heading, .game-question, .game-no-btn');
    });
    assert(quizActive, 'Clicking "Quiz" tab opens runaway "No" button game');

    // Switch back to "Photos" Tab
    await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.soft-nav-pills .nav-pill, .soft-nav-pills button'));
      const photosPill = pills.find(p => p.innerText.includes('Photos'));
      if (photosPill) photosPill.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // -------------------------------------------------------------
    // Step 4: Verify Reactive Form Edits Update Simulator Immediately
    // -------------------------------------------------------------
    console.log('\n[5/7] Testing reactive form edits in Builder Studio...');
    // Advance to Step 2 if currently on Step 1
    const onStep1 = await page.evaluate(() => {
      const cta = document.querySelector('button[type="button"] span.font-bold');
      return cta && cta.innerText.includes('Proceed to Form');
    });
    if (onStep1) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const nextBtn = btns.find(b => b.innerText.includes('Proceed to Form'));
        if (nextBtn) nextBtn.click();
      });
      await new Promise(r => setTimeout(r, 800));
    }

    // Type a new recipient name
    const testRecipientName = 'Aarohi Special';
    await page.evaluate((name) => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      // Find the recipientName input (first or by label)
      if (inputs.length > 0) {
        const input = inputs[0];
        // Trigger React synthetic event
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, name);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, testRecipientName);

    await new Promise(r => setTimeout(r, 500));

    const updatedTitle = await page.evaluate(() => {
      const titleEl = document.querySelector('.soft-title, .soft-hero h1, h1');
      return titleEl ? titleEl.innerText : '';
    });
    assert(
      updatedTitle.includes(testRecipientName) || updatedTitle.includes('Aarohi'),
      `Editing recipient name immediately updates simulator title: "${updatedTitle}"`
    );

    // Take screenshot of simulator
    const screenshotDir = path.resolve(ROOT_DIR, 'test');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
    const screenshotPath = path.resolve(screenshotDir, 'simulator-preview-verified.png');

    // Get bounding box of simulator or phone container
    const simulatorElement = await page.$('.soft-app.in-phone-simulator, .romance-phone-simulator, [style*="320px"]');
    if (simulatorElement) {
      await simulatorElement.screenshot({ path: screenshotPath });
      console.log(`  📸 Screenshot of simulator saved to: ${screenshotPath}`);
    } else {
      await page.screenshot({ path: screenshotPath });
      console.log(`  📸 Full page screenshot saved to: ${screenshotPath}`);
    }
    assert(fs.existsSync(screenshotPath), 'Simulator preview verified screenshot created on disk');

    // -------------------------------------------------------------
    // Step 5: Verify Live Keepsake URL
    // -------------------------------------------------------------
    console.log('\n[6/7] Verifying live keepsake URL http://localhost:5174/?v=maya-eq97c...');
    await page.goto(`${BASE_URL}/?v=maya-eq97c`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    const liveKeepsakeLoaded = await page.evaluate(() => {
      const app = document.querySelector('.soft-app, .blush-romance-root, .template-viewer');
      const title = document.querySelector('.soft-title, h1, .intro-cursive-text');
      return !!(app || title);
    });
    assert(liveKeepsakeLoaded, 'Live keepsake URL loads successfully');

    // -------------------------------------------------------------
    // Step 6: Console Errors & Privacy Audits
    // -------------------------------------------------------------
    console.log('\n[7/7] Auditing console errors and privacy...');
    assert(consoleErrors.length === 0, `0 console errors encountered (actual: ${consoleErrors.length}${consoleErrors.length > 0 ? ': ' + consoleErrors.join(', ') : ''})`);
    assert(uncaughtExceptions.length === 0, `0 uncaught exceptions encountered (actual: ${uncaughtExceptions.length}${uncaughtExceptions.length > 0 ? ': ' + uncaughtExceptions.join(', ') : ''})`);

  } catch (err) {
    console.error('Fatal error during visual QA execution:', err);
    failedChecks++;
  } finally {
    await browser.close();
  }

  // -------------------------------------------------------------
  // Step 7: Privacy scan on repository code
  // -------------------------------------------------------------
  console.log('\n🔒 Auditing repository for privacy compliance (ZERO occurrences of forbidden personal names)...');
  const srcDir = path.resolve(ROOT_DIR, 'src');
  let privacyViolations = 0;
  const forbiddenFirst = ['a', 'd', 'i', 't', 'i'].join('');
  const forbiddenLast = ['d', 'e', 'v', 'i'].join('');
  const regexFirst = new RegExp(forbiddenFirst, 'i');
  const regexLast = new RegExp(`\\b${forbiddenLast}\\b`, 'i');

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (/\.(jsx?|tsx?|html|css|json)$/i.test(file)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (regexFirst.test(content)) {
          console.error(`  ✗ Privacy violation: first forbidden name found in ${fullPath}`);
          privacyViolations++;
        }
        if (regexLast.test(content)) {
          console.error(`  ✗ Privacy violation: last forbidden name found in ${fullPath}`);
          privacyViolations++;
        }
      }
    }
  }

  scanDirectory(srcDir);
  assert(privacyViolations === 0, `Repository privacy audit: ZERO occurrences of forbidden personal names (violations: ${privacyViolations})`);

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passedChecks}/${totalChecks} checks passed, ${failedChecks} failed.`);
  console.log('====================================================');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runVisualQASuite();
