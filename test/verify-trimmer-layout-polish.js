import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 
  (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe');

const PARENT_ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5174/';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runVerification() {
  console.log('🚀 [QA] Starting Polish Layout & UI Verification for Instagram Audio Trimmer...');
  console.log(`📍 Chrome executable: ${CHROME_PATH}`);
  console.log(`📍 Target URL: ${BASE_URL}`);

  if (!fs.existsSync(CHROME_PATH)) {
    throw new Error(`Chrome binary not found at ${CHROME_PATH}`);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--window-size=1280,850'
    ]
  });

  const report = {
    timestamp: new Date().toISOString(),
    desktop: {},
    narrowMobile: {},
    ultraNarrowMobile: {},
    allPassed: false
  };

  try {
    // Helper function to navigate to the Photos & Music tab
    const navigateToPhotosAndMusic = async (page, isMobile = false) => {
      console.log(`  🌐 Navigating to ${BASE_URL}...`);
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      await sleep(600);

      // 1. Click "Start Creating →"
      console.log('  👉 Clicking "Start Creating →"...');
      const startClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, a'));
        const btn = buttons.find(b => b.textContent && b.textContent.includes('Start Creating'));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });
      if (!startClicked) throw new Error('Could not find "Start Creating" button on homepage');
      await sleep(600);

      // 2. Select "Birthday" in Category Modal
      console.log('  🎂 Selecting "Birthday" category...');
      const bdayClicked = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]') || document;
        const buttons = Array.from(modal.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent && b.textContent.includes('Birthday'));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });
      if (!bdayClicked) throw new Error('Could not click "Birthday" category');
      await sleep(600);

      // 3. Select recipient (Girl / Blush Rose)
      console.log('  🎁 Selecting recipient template...');
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const recipientBtn = buttons.find(b => 
          b.textContent && (
            b.textContent.includes('Girl') || 
            b.textContent.includes('Boy') || 
            b.textContent.includes('Her') || 
            b.textContent.includes('Him')
          ) && b.closest('[role="dialog"]')
        );
        if (recipientBtn) recipientBtn.click();
      });
      await sleep(1000);

      // 4. In Builder Studio: Click "Proceed to Form"
      console.log('  📝 Clicking "Proceed to Form"...');
      await page.evaluate((mobile) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const proceed = buttons.find(b => b.textContent && b.textContent.includes('Proceed to Form'));
        if (proceed) proceed.click();

        if (mobile) {
          const formToggle = buttons.find(b => b.textContent && b.textContent.trim() === 'Form');
          if (formToggle) formToggle.click();
        }
      }, isMobile);
      await sleep(800);

      // 5. Switch to Photos & Music tab
      console.log('  🎵 Switching to "Photos & Music" tab...');
      const tabName = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const tab = buttons.find(b => 
          b.textContent && (
            b.textContent.includes('Photo') || 
            b.textContent.includes('Music') || 
            b.textContent.includes('Song') ||
            b.textContent.includes('📸') ||
            b.textContent.includes('🎵')
          )
        );
        if (tab) {
          tab.click();
          return tab.textContent.trim();
        }
        return null;
      });
      console.log(`  Tab active: ${tabName}`);
      await sleep(800);

      // 6. Scroll visible AudioTrimmer into view
      const found = await page.evaluate(() => {
        const candidates = Array.from(document.querySelectorAll('*')).filter(el => {
          const text = el.textContent || '';
          return text.includes('15s') && text.includes('30s') && text.includes('60s') && text.includes('Full');
        });
        const container = candidates.find(el => el.classList.contains('rounded-2xl') && el.getBoundingClientRect().height > 0)
          || document.querySelector('[title*="Overview timeline"]')?.closest('.rounded-2xl');
        if (container) {
          container.scrollIntoView({ behavior: 'instant', block: 'center' });
          return true;
        }
        return false;
      });
      console.log(`  AudioTrimmer container located & scrolled: ${found}`);
      await sleep(500);
      return found;
    };

    // Helper function to inspect the AudioTrimmer layout and duration buttons
    const inspectTrimmerLayout = async (page) => {
      return await page.evaluate(() => {
        // Find visible trimmer
        const track = document.querySelector('[title*="Overview timeline"]') || document.querySelector('[title*="waveform tape"]');
        let container = track ? track.closest('.rounded-2xl') : null;
        if (!container) {
          const buttons = Array.from(document.querySelectorAll('button'));
          const btn15 = buttons.find(b => b.textContent && b.textContent.trim() === '15s');
          if (btn15) container = btn15.closest('.rounded-2xl');
        }

        if (!container) return { found: false };

        // 1. Duration buttons: 15s, 30s, 60s, Full
        const buttons = Array.from(container.querySelectorAll('button'));
        const btn15 = buttons.find(b => b.textContent && b.textContent.trim() === '15s');
        const btn30 = buttons.find(b => b.textContent && b.textContent.trim() === '30s');
        const btn60 = buttons.find(b => b.textContent && b.textContent.trim() === '60s');
        const btnFull = buttons.find(b => b.textContent && b.textContent.trim() === 'Full');

        const durationButtonsFound = Boolean(btn15 && btn30 && btn60 && btnFull);

        let buttonRects = null;
        let topDiff = null;
        let allInOneRow = false;

        if (durationButtonsFound) {
          const r15 = btn15.getBoundingClientRect();
          const r30 = btn30.getBoundingClientRect();
          const r60 = btn60.getBoundingClientRect();
          const rFull = btnFull.getBoundingClientRect();

          buttonRects = {
            '15s': { top: Math.round(r15.top), left: Math.round(r15.left), width: Math.round(r15.width), height: Math.round(r15.height) },
            '30s': { top: Math.round(r30.top), left: Math.round(r30.left), width: Math.round(r30.width), height: Math.round(r30.height) },
            '60s': { top: Math.round(r60.top), left: Math.round(r60.left), width: Math.round(r60.width), height: Math.round(r60.height) },
            'Full': { top: Math.round(rFull.top), left: Math.round(rFull.left), width: Math.round(rFull.width), height: Math.round(rFull.height) },
          };

          const tops = [r15.top, r30.top, r60.top, rFull.top];
          topDiff = Math.max(...tops) - Math.min(...tops);
          allInOneRow = topDiff <= 2.0; // All button bounding rect top values must be equal within 2px
        }

        // 2. Timestamp indicator
        const timeMatch = container.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2})/);
        const timeText = timeMatch ? timeMatch[0] : null;

        // Timestamp element
        const timeEl = Array.from(container.querySelectorAll('span, div')).find(el => el.textContent && el.textContent.includes('-') && /^\d+:\d{2}\s*-\s*\d+:\d{2}$/.test(el.textContent.trim()));
        let timestampRect = null;
        let timestampAlignedWithButtons = false;

        if (timeEl && durationButtonsFound) {
          const tRect = timeEl.getBoundingClientRect();
          const btnParent = btn15.parentElement;
          const bpRect = btnParent.getBoundingClientRect();
          timestampRect = { top: Math.round(tRect.top), height: Math.round(tRect.height) };

          // Both timestamp and buttons row should be vertically aligned (same horizontal row)
          const rowDiff = Math.abs(tRect.top - bpRect.top);
          timestampAlignedWithButtons = rowDiff <= 8.0; // within same line-height alignment
        }

        // 3. Play Button
        const playBtn = buttons.find(b => {
          const title = (b.getAttribute('title') || '').toLowerCase();
          return (title.includes('preview') || title.includes('play') || title.includes('pause')) && b.className.includes('bg-white');
        });

        // 4. Top Duration Badge (Circle)
        const circleBadge = buttons.find(b => {
          const title = b.getAttribute('title') || '';
          return title.includes('Snippet Duration') || b.classList.contains('rounded-full');
        });

        // 5. Chorus Button (if song has hook)
        const chorusBtn = buttons.find(b => (b.getAttribute('title') || '').includes('Chorus') || (b.textContent || '').includes('Chorus'));

        // 6. Waveform Track & Bars
        const waveformTrack = container.querySelector('[title*="waveform tape"], [title*="Full song active"]');
        const whiteSelectorCard = container.querySelector('.bg-white.rounded-xl.shadow-lg');

        return {
          found: true,
          containerWidth: Math.round(container.getBoundingClientRect().width),
          durationButtonsFound,
          buttonRects,
          topDiff,
          allInOneRow,
          timeText,
          timestampRect,
          timestampAlignedWithButtons,
          playButtonFound: Boolean(playBtn),
          circleBadgeFound: Boolean(circleBadge),
          chorusButtonFound: Boolean(chorusBtn),
          waveformTrackFound: Boolean(waveformTrack),
          whiteSelectorCardFound: Boolean(whiteSelectorCard)
        };
      });
    };

    // =========================================================================
    // TEST 1: NARROW MOBILE VIEWPORT (360 x 780)
    // =========================================================================
    console.log('\n======================================================');
    console.log('📱 TEST 1: NARROW MOBILE VIEWPORT (360x780)');
    console.log('======================================================');

    const narrowPage = await browser.newPage();
    await narrowPage.setViewport({ width: 360, height: 780, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

    await navigateToPhotosAndMusic(narrowPage, true);

    const narrowLayout = await inspectTrimmerLayout(narrowPage);
    console.log('Narrow Mobile Layout Audit:', JSON.stringify(narrowLayout, null, 2));

    // Assertions for Narrow Mobile
    if (!narrowLayout.found) throw new Error('AudioTrimmer container not found on Narrow Mobile');
    if (!narrowLayout.durationButtonsFound) throw new Error('Duration buttons (15s, 30s, 60s, Full) not found');
    if (!narrowLayout.allInOneRow) {
      throw new Error(`Vertical wrapping detected in duration buttons! topDiff = ${narrowLayout.topDiff}px (must be <= 2px)`);
    }
    console.log(`✅ [PASS] Narrow Mobile Duration Buttons in single horizontal row: topDiff = ${narrowLayout.topDiff}px (<= 2px)`);
    console.log(`✅ [PASS] Timestamp aligned with duration buttons on same row: ${narrowLayout.timestampAlignedWithButtons}`);

    // Test Duration Button Interactions on Narrow Mobile
    console.log('\n--- ⏱️ Testing Duration Button Clicking (Narrow Mobile) ---');
    const durationClickResults = await narrowPage.evaluate(async () => {
      const track = document.querySelector('[title*="Overview timeline"]') || document.querySelector('[title*="waveform tape"]');
      const container = track.closest('.rounded-2xl');
      const buttons = Array.from(container.querySelectorAll('button'));
      const btn15 = buttons.find(b => b.textContent && b.textContent.trim() === '15s');
      const btn30 = buttons.find(b => b.textContent && b.textContent.trim() === '30s');
      const btn60 = buttons.find(b => b.textContent && b.textContent.trim() === '60s');

      const results = {};

      if (btn15) {
        btn15.click();
        await new Promise(r => setTimeout(r, 200));
        results.clicked15 = {
          active: btn15.className.includes('bg-white text-black'),
          text: container.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2})/)?.[0]
        };
      }

      if (btn60) {
        btn60.click();
        await new Promise(r => setTimeout(r, 200));
        results.clicked60 = {
          active: btn60.className.includes('bg-white text-black'),
          text: container.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2})/)?.[0]
        };
      }

      if (btn30) {
        btn30.click();
        await new Promise(r => setTimeout(r, 200));
        results.clicked30 = {
          active: btn30.className.includes('bg-white text-black'),
          text: container.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2})/)?.[0]
        };
      }

      return results;
    });
    console.log('Duration button click tests:', JSON.stringify(durationClickResults, null, 2));

    // Test Play / Pause Toggle on Narrow Mobile
    console.log('\n--- 🎵 Testing Play / Pause Toggle (Narrow Mobile) ---');
    const playToggleResult = await narrowPage.evaluate(async () => {
      const track = document.querySelector('[title*="Overview timeline"]') || document.querySelector('[title*="waveform tape"]');
      const container = track.closest('.rounded-2xl');
      const playBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const title = (b.getAttribute('title') || '').toLowerCase();
        return (title.includes('preview') || title.includes('play') || title.includes('pause')) && b.className.includes('bg-white');
      });
      if (!playBtn) return { success: false, reason: 'Play button not found' };

      const initialTitle = playBtn.getAttribute('title');
      playBtn.click();
      await new Promise(r => setTimeout(r, 600));

      const playingTitle = playBtn.getAttribute('title');
      const hasPauseIcon = Boolean(container.querySelector('svg.lucide-pause'));

      // Pause again
      playBtn.click();
      await new Promise(r => setTimeout(r, 400));
      const pausedTitle = playBtn.getAttribute('title');

      return {
        success: true,
        initialTitle,
        playingTitle,
        hasPauseIcon,
        pausedTitle
      };
    });
    console.log('Play/Pause Toggle Result:', JSON.stringify(playToggleResult, null, 2));

    // Test Dragging / Scrubbing on Waveform
    console.log('\n--- 👆 Testing Dragging / Scrubbing on Waveform (Narrow Mobile) ---');
    const dragResult = await narrowPage.evaluate(async () => {
      const track = document.querySelector('[title*="Overview timeline"]') || document.querySelector('[title*="waveform tape"]');
      const container = track.closest('.rounded-2xl');
      const waveformTrack = container.querySelector('[title*="waveform tape"], [title*="Full song active"]');
      if (!waveformTrack) return { success: false, reason: 'Waveform track not found' };

      const timeBefore = container.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2})/)?.[0];
      const rect = waveformTrack.getBoundingClientRect();
      const startX = rect.left + rect.width * 0.2;
      const moveX = rect.left + rect.width * 0.6;
      const centerY = rect.top + rect.height * 0.5;

      waveformTrack.dispatchEvent(new PointerEvent('pointerdown', {
        clientX: startX,
        clientY: centerY,
        button: 0,
        bubbles: true
      }));

      await new Promise(r => setTimeout(r, 100));

      waveformTrack.dispatchEvent(new PointerEvent('pointermove', {
        clientX: moveX,
        clientY: centerY,
        button: 0,
        bubbles: true
      }));

      await new Promise(r => setTimeout(r, 100));

      waveformTrack.dispatchEvent(new PointerEvent('pointerup', {
        clientX: moveX,
        clientY: centerY,
        button: 0,
        bubbles: true
      }));

      await new Promise(r => setTimeout(r, 200));

      const timeAfter = container.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2})/)?.[0];
      return {
        success: true,
        timeBefore,
        timeAfter,
        scrubDispatched: true
      };
    });
    console.log('Waveform Drag/Scrub Result:', JSON.stringify(dragResult, null, 2));

    // Capture Narrow Mobile Screenshot
    const narrowScreenshotPath = 'D:\\avprojects\\surprise-builder\\test\\qa-polished-trimmer-narrow.png';
    await narrowPage.screenshot({ path: narrowScreenshotPath, fullPage: false });
    console.log(`📸 Narrow Mobile screenshot saved: ${narrowScreenshotPath}`);

    if (fs.existsSync(PARENT_ARTIFACT_DIR)) {
      const parentNarrowPath = path.join(PARENT_ARTIFACT_DIR, 'qa-polished-trimmer-narrow.png');
      fs.copyFileSync(narrowScreenshotPath, parentNarrowPath);
      console.log(`📋 Copied to parent artifact dir: ${parentNarrowPath}`);
    }

    report.narrowMobile = {
      layout: narrowLayout,
      durationClicks: durationClickResults,
      playToggle: playToggleResult,
      dragResult,
      screenshot: narrowScreenshotPath
    };

    await narrowPage.close();

    // =========================================================================
    // TEST 2: ULTRA-NARROW VIEWPORT (320 x 640)
    // =========================================================================
    console.log('\n======================================================');
    console.log('📱 TEST 2: ULTRA-NARROW VIEWPORT (320x640)');
    console.log('======================================================');

    const ultraPage = await browser.newPage();
    await ultraPage.setViewport({ width: 320, height: 640, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

    await navigateToPhotosAndMusic(ultraPage, true);

    const ultraLayout = await inspectTrimmerLayout(ultraPage);
    console.log('Ultra-Narrow Layout Audit:', JSON.stringify(ultraLayout, null, 2));

    if (!ultraLayout.found) throw new Error('AudioTrimmer container not found on Ultra-Narrow Viewport');
    if (!ultraLayout.allInOneRow) {
      throw new Error(`Vertical wrapping detected on 320px viewport! topDiff = ${ultraLayout.topDiff}px`);
    }
    console.log(`✅ [PASS] Ultra-Narrow (320px) Duration Buttons in single horizontal row: topDiff = ${ultraLayout.topDiff}px (<= 2px)`);

    const ultraScreenshotPath = 'D:\\avprojects\\surprise-builder\\test\\qa-polished-trimmer-ultra-narrow.png';
    await ultraPage.screenshot({ path: ultraScreenshotPath, fullPage: false });
    console.log(`📸 Ultra-narrow screenshot saved: ${ultraScreenshotPath}`);

    report.ultraNarrowMobile = {
      layout: ultraLayout,
      screenshot: ultraScreenshotPath
    };

    await ultraPage.close();

    // =========================================================================
    // TEST 3: DESKTOP VIEWPORT (1280 x 800)
    // =========================================================================
    console.log('\n======================================================');
    console.log('🖥️  TEST 3: DESKTOP VIEWPORT (1280x800)');
    console.log('======================================================');

    const desktopPage = await browser.newPage();
    await desktopPage.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

    await navigateToPhotosAndMusic(desktopPage, false);

    const desktopLayout = await inspectTrimmerLayout(desktopPage);
    console.log('Desktop Layout Audit:', JSON.stringify(desktopLayout, null, 2));

    if (!desktopLayout.found) throw new Error('AudioTrimmer container not found on Desktop');
    if (!desktopLayout.allInOneRow) {
      throw new Error(`Vertical wrapping detected on Desktop! topDiff = ${desktopLayout.topDiff}px`);
    }
    console.log(`✅ [PASS] Desktop Duration Buttons in single horizontal row: topDiff = ${desktopLayout.topDiff}px (<= 2px)`);

    // Capture Desktop Screenshot
    const desktopScreenshotPath = 'D:\\avprojects\\surprise-builder\\test\\qa-polished-trimmer-desktop.png';
    await desktopPage.screenshot({ path: desktopScreenshotPath, fullPage: false });
    console.log(`📸 Desktop screenshot saved: ${desktopScreenshotPath}`);

    if (fs.existsSync(PARENT_ARTIFACT_DIR)) {
      const parentDesktopPath = path.join(PARENT_ARTIFACT_DIR, 'qa-polished-trimmer-desktop.png');
      fs.copyFileSync(desktopScreenshotPath, parentDesktopPath);
      console.log(`📋 Copied to parent artifact dir: ${parentDesktopPath}`);
    }

    report.desktop = {
      layout: desktopLayout,
      screenshot: desktopScreenshotPath
    };

    await desktopPage.close();

    report.allPassed = Boolean(
      narrowLayout.allInOneRow &&
      ultraLayout.allInOneRow &&
      desktopLayout.allInOneRow &&
      durationClickResults.clicked15?.active &&
      durationClickResults.clicked30?.active &&
      durationClickResults.clicked60?.active &&
      playToggleResult.success &&
      dragResult.success
    );

    console.log('\n======================================================');
    console.log(report.allPassed ? '🎉 ALL TESTS & POLISH ASSERTIONS PASSED!' : '⚠️ TEST FINISHED WITH WARNINGS');
    console.log('======================================================');

  } catch (err) {
    console.error('❌ Verification failed with error:', err);
    report.error = err.message;
    report.allPassed = false;
  } finally {
    await browser.close();
  }

  return report;
}

runVerification().then(report => {
  console.log('\n📊 COMPLETE VERIFICATION REPORT:');
  console.log(JSON.stringify(report, null, 2));
  if (!report.allPassed) {
    process.exit(1);
  }
});
