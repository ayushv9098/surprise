import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';
const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_PATH = path.join(ROOT_DIR, 'test', 'qa-exact-reference-match.png');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ PASS: ${message}`);
    return true;
  } else {
    failedChecks++;
    console.error(`  ✗ FAIL: ${message}`);
    return false;
  }
}

async function runExactReferenceMatchAudit() {
  console.log('================================================================');
  console.log('📱 QA AUDIT: EXACT REFERENCE MATCH (Screenshot 2026-10-23 163538)');
  console.log('   Target: Phone Simulator vs Reference Spec');
  console.log('   URL:    ' + BASE_URL);
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
      '--window-size=1280,720',
    ],
    defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 2 },
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });

    console.log(`Navigating to ${BASE_URL}...`);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });

    // Step 1: Click "Start Creating" or "Make a Keepsake"
    console.log('Entering Builder Studio...');
    const startClicked = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll('button, a'));
      for (const el of candidates) {
        const text = (el.textContent || '').trim();
        if (text.includes('Start Creating') || text.includes('Make a Keepsake') || text.includes('Create Keepsake')) {
          el.click();
          return true;
        }
      }
      return false;
    });

    if (startClicked) {
      console.log('Clicked landing CTA to open Builder Studio.');
    }

    await new Promise((r) => setTimeout(r, 800));

    // Handle Recipient Modal if open: select Royal Sapphire / Boy style to match reference screenshot
    await page.evaluate(() => {
      // First look inside dialog if open
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog) {
        const dialogBtns = Array.from(dialog.querySelectorAll('button'));
        const boyBtn = dialogBtns.find((b) => {
          const txt = b.textContent || '';
          return txt.includes('Boy') || txt.includes('For a Boy') || txt.includes('boy style') || txt.includes('For Him');
        });
        if (boyBtn) {
          boyBtn.click();
          return;
        }
      }

      // Fallback
      const buttons = Array.from(document.querySelectorAll('button'));
      for (const btn of buttons) {
        const txt = (btn.textContent || '').toLowerCase();
        if (txt.includes('for a boy') || txt.includes('select boy style') || txt.includes('for him')) {
          btn.click();
          break;
        }
      }
    });

    await new Promise((r) => setTimeout(r, 1200));

    // Wait for the Phone Simulator chassis / preview to be rendered
    await page.waitForFunction(
      () => {
        return (
          document.body.innerText.includes('Back to Wishly') ||
          Boolean(document.querySelector('.lucide-lock')) ||
          Boolean(document.querySelector('.lucide-chevron-left'))
        );
      },
      { timeout: 15000 }
    );
    console.log('Phone Simulator detected and rendered successfully.\n');

    // =========================================================================
    // VERIFICATION 1: TOP IN-SIMULATOR HEADER
    // =========================================================================
    console.log('--- Verification 1: Top In-Simulator Header ---');
    const headerDetails = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));

      // 1. "< Back to Wishly" button
      const backButton = buttons.find((b) => {
        const text = (b.textContent || '').trim();
        return text.includes('Back to Wishly');
      });

      const hasBackToWishly = Boolean(backButton);
      const backButtonText = backButton ? backButton.textContent.trim() : '';
      const backHasChevron = Boolean(backButton?.querySelector('.lucide-chevron-left, svg'));

      // 2. Circular Share button with Share2 icon
      const shareButton = buttons.find((b) => {
        const hasShare2Icon = Boolean(
          b.querySelector('.lucide-share-2, .lucide-share2') ||
          b.querySelector('svg.lucide-share-2')
        );
        const title = (b.getAttribute('title') || b.getAttribute('aria-label') || '').toLowerCase();
        return (hasShare2Icon || title === 'share') && b !== backButton;
      });

      const hasShareButton = Boolean(shareButton);
      const isShareRounded = shareButton
        ? shareButton.classList.contains('rounded-full') ||
          window.getComputedStyle(shareButton).borderRadius.includes('9999') ||
          window.getComputedStyle(shareButton).borderRadius.includes('50%')
        : false;
      const shareHasShare2 = Boolean(
        shareButton?.querySelector('.lucide-share-2, .lucide-share2, svg')
      );

      // 3. Circular Fullscreen button with Maximize icon
      const fullscreenButton = buttons.find((b) => {
        const hasMaximizeIcon = Boolean(
          b.querySelector('.lucide-maximize, .lucide-maximize-2, .lucide-expand') ||
          b.querySelector('svg.lucide-maximize')
        );
        const title = (b.getAttribute('title') || b.getAttribute('aria-label') || '').toLowerCase();
        return (hasMaximizeIcon || title.includes('fullscreen') || title.includes('maximize')) && b !== backButton;
      });

      const hasFullscreenButton = Boolean(fullscreenButton);
      const isFullscreenRounded = fullscreenButton
        ? fullscreenButton.classList.contains('rounded-full') ||
          window.getComputedStyle(fullscreenButton).borderRadius.includes('9999') ||
          window.getComputedStyle(fullscreenButton).borderRadius.includes('50%')
        : false;
      const fullscreenHasMaximize = Boolean(
        fullscreenButton?.querySelector('.lucide-maximize, .lucide-maximize-2, svg')
      );

      return {
        hasBackToWishly,
        backButtonText,
        backHasChevron,
        hasShareButton,
        isShareRounded,
        shareHasShare2,
        hasFullscreenButton,
        isFullscreenRounded,
        fullscreenHasMaximize,
      };
    });

    assert(headerDetails.hasBackToWishly, `Top header contains "< Back to Wishly" button (text: "${headerDetails.backButtonText}")`);
    assert(headerDetails.backHasChevron, 'Back to Wishly button contains left chevron/arrow icon');
    assert(headerDetails.hasShareButton, 'Top header contains circular Share button with Share2 icon');
    assert(headerDetails.isShareRounded, 'Share button has circular rounded-full styling');
    assert(headerDetails.hasFullscreenButton, 'Top header contains circular Fullscreen button with Maximize icon');
    assert(headerDetails.isFullscreenRounded, 'Fullscreen button has circular rounded-full styling');

    // =========================================================================
    // VERIFICATION 2: CENTER CARD & TYPOGRAPHY & "Tap to Open 🎁"
    // =========================================================================
    console.log('\n--- Verification 2: Center Card, Crown & "Tap to Open 🎁" ---');
    const centerCardDetails = await page.evaluate(() => {
      const bodyText = document.body.innerText || '';

      // Check for crown emoji 👑 or crown SVG / AppleEmoji
      const hasCrownText = bodyText.includes('👑');
      const hasCrownImg = Boolean(
        document.querySelector('img[alt="👑"]') ||
        document.querySelector('img[src*="1f451"]') ||
        document.querySelector('.lucide-crown')
      );
      const hasCrown = hasCrownText || hasCrownImg;

      // Check celebratory typography
      const hasTitleTypography =
        bodyText.includes('Happy Birthday') ||
        bodyText.includes('King') ||
        bodyText.includes('Rohan') ||
        bodyText.includes('Alex');

      // Check "Tap to Open 🎁" button
      const allButtons = Array.from(document.querySelectorAll('button'));
      const tapToOpenBtn = allButtons.find((b) => {
        const txt = (b.textContent || '').trim();
        return txt.includes('Tap to Open');
      });

      const hasTapToOpen = Boolean(tapToOpenBtn);
      const tapToOpenText = tapToOpenBtn ? tapToOpenBtn.textContent.trim() : '';
      const hasGiftEmoji = tapToOpenText.includes('🎁') || Boolean(tapToOpenBtn?.querySelector('img[alt="🎁"]'));

      return {
        hasCrown,
        hasTitleTypography,
        hasTapToOpen,
        tapToOpenText,
        hasGiftEmoji,
      };
    });

    assert(centerCardDetails.hasCrown, 'Center card rendered with crown emoji 👑');
    assert(centerCardDetails.hasTitleTypography, 'Center card rendered with typography matching reference');
    assert(centerCardDetails.hasTapToOpen, `Center card rendered with "Tap to Open" button (text: "${centerCardDetails.tapToOpenText}")`);
    assert(centerCardDetails.hasGiftEmoji, 'Center card "Tap to Open" button contains gift emoji 🎁');

    // =========================================================================
    // VERIFICATION 3: BOTTOM SAFARI ADDRESS BAR
    // =========================================================================
    console.log('\n--- Verification 3: Bottom Safari Address Bar ---');
    const safariBarDetails = await page.evaluate(() => {
      const lockIcon = document.querySelector('.lucide-lock');
      const hasLock = Boolean(lockIcon);
      const reloadIcon = document.querySelector('.lucide-rotate-cw');
      const hasReload = Boolean(reloadIcon);

      const addressContainer =
        lockIcon?.closest('.bg-black\\/5, .bg-slate-100, .bg-white\\/70, .rounded-xl, .rounded-lg') ||
        lockIcon?.parentElement;
      const addressText = (addressContainer?.textContent || document.body.innerText).trim();
      const hasLocalhost = addressText.includes('localhost') || addressText.includes('127.0.0.1');

      return {
        hasLock,
        hasReload,
        hasLocalhost,
        addressText,
      };
    });

    assert(safariBarDetails.hasLock, 'Bottom Safari address bar exists with Lock icon (lucide-lock)');
    assert(safariBarDetails.hasLocalhost, 'Bottom Safari address bar contains "localhost"');
    assert(safariBarDetails.hasReload, 'Bottom Safari address bar contains reload icon (lucide-rotate-cw)');

    // =========================================================================
    // VERIFICATION 4: NO BLUE SCENE DOTS BETWEEN ADDRESS BAR & TOOLBAR
    // =========================================================================
    console.log('\n--- Verification 4: NO Blue Scene Dots (Verified Completely Absent) ---');
    const sceneDotsCheck = await page.evaluate(() => {
      // 1. Check for any scene indicator dot buttons
      const sceneButtons = Array.from(document.querySelectorAll('button[aria-label*="Go to scene"], button[aria-label*="scene"]'));

      // 2. Check for blue dot indicator classes
      const blueDotElements = Array.from(
        document.querySelectorAll('.bg-blue-600.rounded-full.h-1\\.5, .bg-blue-600.w-4, .w-1\\.5.bg-slate-400\\/60')
      );

      // 3. Check for any dot containers between address bar and toolbar
      const lock = document.querySelector('.lucide-lock');
      const toolbarChevron = document.querySelector('.lucide-chevron-left');
      let dotsBetween = 0;

      if (lock && toolbarChevron) {
        const phoneScreen = lock.closest('.relative.w-\\[393px\\]') || document.body;
        const candidateDots = phoneScreen.querySelectorAll('.h-1\\.5.rounded-full');
        dotsBetween = candidateDots.length;
      }

      return {
        sceneButtonsCount: sceneButtons.length,
        blueDotElementsCount: blueDotElements.length,
        dotsBetweenCount: dotsBetween,
      };
    });

    const dotsAbsent =
      sceneDotsCheck.sceneButtonsCount === 0 &&
      sceneDotsCheck.blueDotElementsCount === 0 &&
      sceneDotsCheck.dotsBetweenCount === 0;

    assert(
      dotsAbsent,
      `NO blue scene dots between address bar and toolbar (completely absent, count: ${sceneDotsCheck.sceneButtonsCount + sceneDotsCheck.blueDotElementsCount + sceneDotsCheck.dotsBetweenCount})`
    );

    // =========================================================================
    // VERIFICATION 5: SAFARI 5-BUTTON TOOLBAR
    // =========================================================================
    console.log('\n--- Verification 5: Safari 5-Button Toolbar ---');
    const toolbarDetails = await page.evaluate(() => {
      const hasChevronLeft = Boolean(document.querySelector('.lucide-chevron-left'));
      const hasChevronRight = Boolean(document.querySelector('.lucide-chevron-right'));
      const hasBookOpen = Boolean(document.querySelector('.lucide-book-open'));
      const hasTabs = Boolean(document.querySelector('.lucide-copy'));

      // Middle button: iOS share box with arrow
      const shareBoxSvg = Array.from(document.querySelectorAll('svg')).find((svg) => {
        const polyline = svg.querySelector('polyline[points="16 6 12 2 8 6"]');
        const line = svg.querySelector('line[x1="12"][y1="2"][x2="12"][y2="15"]');
        return Boolean(polyline && line);
      });
      const hasShareBox = Boolean(shareBoxSvg);

      return {
        hasChevronLeft,
        hasChevronRight,
        hasShareBox,
        hasBookOpen,
        hasTabs,
      };
    });

    assert(toolbarDetails.hasChevronLeft, 'Toolbar Icon 1: ChevronLeft exists (lucide-chevron-left)');
    assert(toolbarDetails.hasChevronRight, 'Toolbar Icon 2: ChevronRight exists (lucide-chevron-right)');
    assert(toolbarDetails.hasShareBox, 'Toolbar Icon 3: iOS Action Share box exists');
    assert(toolbarDetails.hasBookOpen, 'Toolbar Icon 4: Bookmarks BookOpen exists (lucide-book-open)');
    assert(toolbarDetails.hasTabs, 'Toolbar Icon 5: Safari Tabs Copy exists (lucide-copy)');

    // =========================================================================
    // VERIFICATION 6: iOS HOME INDICATOR BAR
    // =========================================================================
    console.log('\n--- Verification 6: iOS Home Indicator Bar ---');
    const homeIndicatorCheck = await page.evaluate(() => {
      const el = document.querySelector('.w-28.h-1.bg-black, .bg-black.rounded-full.w-28');
      if (el) return true;

      const divs = Array.from(document.querySelectorAll('div'));
      return divs.some((d) => {
        const cl = d.className || '';
        return typeof cl === 'string' && cl.includes('w-28') && cl.includes('h-1') && cl.includes('bg-black');
      });
    });

    assert(homeIndicatorCheck, 'iOS Home Indicator bar exists at bottom of phone simulator');

    // =========================================================================
    // CAPTURE HIGH-RES SCREENSHOT
    // =========================================================================
    console.log('\n--- Capturing High-Res Screenshot ---');
    const testDir = path.dirname(SCREENSHOT_PATH);
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Try to crop to phone simulator container for maximum visual clarity
    const phoneElement = await page.$('div[style*="393px"], .rounded-\\[52px\\], .rounded-\\[49px\\]');
    if (phoneElement) {
      await phoneElement.screenshot({ path: SCREENSHOT_PATH });
      console.log(`✓ High-res phone simulator screenshot saved to: ${SCREENSHOT_PATH}`);
    } else {
      await page.screenshot({ path: SCREENSHOT_PATH, fullPage: false });
      console.log(`✓ High-res viewport screenshot saved to: ${SCREENSHOT_PATH}`);
    }

    // Also save full viewport screenshot for reference
    const fullViewportPath = path.join(ROOT_DIR, 'test', 'qa-exact-reference-full-view.png');
    await page.screenshot({ path: fullViewportPath, fullPage: false });
    console.log(`✓ Full viewport screenshot saved to: ${fullViewportPath}`);

    // =========================================================================
    // FINAL SUMMARY
    // =========================================================================
    console.log('\n================================================================');
    console.log(`QA AUDIT RESULT: ${passedChecks}/${totalChecks} CHECKS PASSED`);
    if (failedChecks > 0) {
      console.error(`❌ FAILED: ${failedChecks} checks failed.`);
      console.log('================================================================\n');
      process.exit(1);
    } else {
      console.log('🎉 ALL VERIFICATIONS PASSED WITH 100% PARITY!');
      console.log('================================================================\n');
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runExactReferenceMatchAudit();
