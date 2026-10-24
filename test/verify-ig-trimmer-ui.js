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

async function runTest() {
  console.log('🚀 [QA] Starting Automated Verification for Instagram Story Audio Trimmer UI...');
  console.log(`📍 Chrome executable: ${CHROME_PATH}`);
  console.log(`📍 Test target URL: ${BASE_URL}`);

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

  const testResults = {
    timestamp: new Date().toISOString(),
    desktop: {},
    mobile: {},
    allPassed: false
  };

  try {
    // =========================================================================
    // PART 1: DESKTOP VIEWPORT TEST (1280 x 800)
    // =========================================================================
    console.log('\n======================================================');
    console.log('🖥️  PART 1: DESKTOP VIEWPORT TEST (1280x800)');
    console.log('======================================================');

    const desktopPage = await browser.newPage();
    await desktopPage.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

    // Step 1: Open Homepage
    console.log(`Navigating to ${BASE_URL} ...`);
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await sleep(600);

    // Step 2: Click "Start Creating →"
    console.log('Clicking "Start Creating →" ...');
    const startClicked = await desktopPage.evaluate(() => {
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

    // Step 3: Category Modal -> Select "Birthday"
    console.log('Selecting "Birthday" category in Category Modal ...');
    const bdayClicked = await desktopPage.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]') || document;
      const buttons = Array.from(modal.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent && b.textContent.includes('Birthday'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    if (!bdayClicked) throw new Error('Could not click Birthday category');
    await sleep(600);

    // Recipient Modal: Select Girl style (e.g. Blush Rose)
    const recipientHandled = await desktopPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const recipientBtn = buttons.find(b => 
        b.textContent && (
          b.textContent.includes('Girl') || 
          b.textContent.includes('Boy') || 
          b.textContent.includes('Her') || 
          b.textContent.includes('Him')
        ) && b.closest('[role="dialog"]')
      );
      if (recipientBtn) {
        recipientBtn.click();
        return true;
      }
      return false;
    });
    if (recipientHandled) {
      console.log('Recipient card clicked, navigated to builder');
      await sleep(1000);
    }

    // Step 4: Click "Proceed to Form" in BuilderStudio
    console.log('Clicking "Proceed to Form" in BuilderStudio ...');
    await desktopPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const proceed = buttons.find(b => b.textContent && b.textContent.includes('Proceed to Form'));
      if (proceed) proceed.click();
    });
    await sleep(800);

    // Step 5: Switch to "2. Photo & Song" / "2. Photos & Music"
    console.log('Clicking "2. Photo & Song" tab ...');
    const tabClicked = await desktopPage.evaluate(() => {
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
    console.log(`Switched to tab: ${tabClicked}`);
    await sleep(800);

    // Scroll visible AudioTrimmer into view
    await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const visible = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      if (visible) visible.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await sleep(500);

    // Verify UI Components & Structure
    console.log('\n--- 🔍 Inspecting Top & Bottom Rows in AudioTrimmer (Desktop) ---');
    const desktopAudit = await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      if (!container) return { containerFound: false };

      // Duration circle button inside visible container
      const durationBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const text = b.textContent ? b.textContent.trim() : '';
        const title = b.getAttribute('title') || '';
        return /^(15|30|60|Full|∞)$/.test(text) || title.includes('Snippet Duration');
      });

      // Mini timeline track & components
      const topTimelineTrack = container.querySelector('[title*="Overview timeline"]') ||
        container.querySelector('.h-\\[2px\\], .h-\\[3px\\]');
      const whiteSegment = topTimelineTrack ? topTimelineTrack.querySelector('.bg-white.rounded-full') : null;
      const pinkHookDot = topTimelineTrack ? topTimelineTrack.querySelector('.bg-rose-500.rounded-full, button[title*="Chorus"]') : null;

      // Circular white Play button
      const playBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const title = (b.getAttribute('title') || '').toLowerCase();
        return (title.includes('preview') || title.includes('play')) && b.className.includes('bg-white') && b.className.includes('rounded-full');
      });

      // Waveform track & bars
      const waveformTrack = container.querySelector('[title*="waveform tape"], [title*="Full song active"]') ||
        container.querySelector('.h-18, .h-20');
      const waveformBars = waveformTrack ? waveformTrack.querySelectorAll('.w-1.rounded-full') : [];

      // Floating white selector card
      const whiteSelectorCard = container.querySelector('.bg-white.rounded-xl.shadow-lg');
      const leftHandle = container.querySelector('.-left-1');
      const rightHandle = container.querySelector('.-right-1');

      // Time display
      const timeDisplay = container.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2})/);

      return {
        containerFound: Boolean(container),
        durationButtonFound: Boolean(durationBtn),
        durationText: durationBtn ? durationBtn.textContent.trim() : null,
        topTimelineFound: Boolean(topTimelineTrack),
        whiteSegmentFound: Boolean(whiteSegment),
        pinkHookDotFound: Boolean(pinkHookDot),
        playButtonFound: Boolean(playBtn),
        waveformTrackFound: Boolean(waveformTrack),
        waveformBarsCount: waveformBars.length,
        whiteSelectorCardFound: Boolean(whiteSelectorCard),
        leftHandleFound: Boolean(leftHandle),
        rightHandleFound: Boolean(rightHandle),
        timeRangeText: timeDisplay ? timeDisplay[0] : null
      };
    });
    console.log('Desktop UI Audit Results:', JSON.stringify(desktopAudit, null, 2));
    testResults.desktop.audit = desktopAudit;

    // Test Interaction 1: Duration cycling
    console.log('\n--- ⏱️ Testing Duration Button Cycling (Desktop) ---');
    const durationCycleResult = await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      const durationBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const text = b.textContent ? b.textContent.trim() : '';
        const title = b.getAttribute('title') || '';
        return /^(15|30|60|Full|∞)$/.test(text) || title.includes('Snippet Duration');
      });
      if (!durationBtn) return { error: 'Duration button not found' };

      const initial = durationBtn.textContent.trim();
      durationBtn.click();
      return { initial };
    });
    await sleep(400);

    const postDurationText = await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      const durationBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const text = b.textContent ? b.textContent.trim() : '';
        const title = b.getAttribute('title') || '';
        return /^(15|30|60|Full|∞)$/.test(text) || title.includes('Snippet Duration');
      });
      return durationBtn ? durationBtn.textContent.trim() : null;
    });
    console.log(`Duration cycled: ${durationCycleResult.initial} -> ${postDurationText}`);
    testResults.desktop.durationCycle = { before: durationCycleResult.initial, after: postDurationText };

    // Test Interaction 2: Play/Pause Toggle
    console.log('\n--- 🎵 Testing Play / Pause Button (Desktop) ---');
    const playClicked = await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      const playBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const title = (b.getAttribute('title') || '').toLowerCase();
        return (title.includes('preview') || title.includes('play')) && b.className.includes('bg-white') && b.className.includes('rounded-full');
      });
      if (!playBtn) return false;
      playBtn.click();
      return true;
    });
    console.log(`Play button clicked: ${playClicked}`);
    await sleep(600);

    const playState = await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      const playBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const title = (b.getAttribute('title') || '').toLowerCase();
        return (title.includes('preview') || title.includes('play') || title.includes('pause')) && b.className.includes('bg-white') && b.className.includes('rounded-full');
      });
      if (!playBtn) return { found: false };
      const title = playBtn.getAttribute('title') || '';
      const hasPauseIcon = Boolean(playBtn.querySelector('svg.lucide-pause'));
      return {
        found: true,
        title,
        isPlaying: hasPauseIcon || title.toLowerCase().includes('pause')
      };
    });
    console.log('Play state after clicking play:', playState);
    testResults.desktop.playState = playState;

    // Click again to pause
    await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      const playBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const title = (b.getAttribute('title') || '').toLowerCase();
        return (title.includes('preview') || title.includes('play') || title.includes('pause')) && b.className.includes('bg-white') && b.className.includes('rounded-full');
      });
      if (playBtn) playBtn.click();
    });
    await sleep(400);

    // Test Interaction 3: Hook Dot Jump
    console.log('\n--- ✨ Testing Pink Hook Dot Marker Click (Desktop) ---');
    const hookJumpResult = await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      const hookDot = container.querySelector('button[title*="Chorus"], [title*="Jump to Chorus"]');
      if (hookDot) {
        hookDot.click();
        return { clicked: true, title: hookDot.getAttribute('title') };
      }
      return { clicked: false };
    });
    console.log('Hook dot clicked:', hookJumpResult);
    await sleep(500);

    const timeAfterHook = await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      const match = container.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2})/);
      return match ? match[0] : null;
    });
    console.log(`Timestamp after Hook Jump: ${timeAfterHook}`);
    testResults.desktop.timeAfterHook = timeAfterHook;

    // Test Interaction 4: Waveform scrubbing
    console.log('\n--- 👆 Testing Waveform Drag / Scrub Interaction (Desktop) ---');
    const scrubResult = await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      const waveformTrack = container.querySelector('[title*="waveform tape"], [title*="Full song active"]') ||
        container.querySelector('.h-18, .h-20');
      if (!waveformTrack) return { success: false, reason: 'Waveform track not found' };

      const rect = waveformTrack.getBoundingClientRect();
      const clickX = rect.left + rect.width * 0.15;
      const clickY = rect.top + rect.height * 0.5;

      waveformTrack.dispatchEvent(new PointerEvent('pointerdown', {
        clientX: clickX,
        clientY: clickY,
        button: 0,
        bubbles: true
      }));

      return { success: true, rectWidth: rect.width };
    });
    console.log('Scrub result:', scrubResult);
    await sleep(500);

    const timeAfterScrub = await desktopPage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      const match = container.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2})/);
      return match ? match[0] : null;
    });
    console.log(`Timestamp after waveform scrub: ${timeAfterScrub}`);
    testResults.desktop.timeAfterScrub = timeAfterScrub;

    // Capture Desktop Screenshot
    const desktopScreenshotPath = 'D:\\avprojects\\surprise-builder\\test\\qa-ig-trimmer-desktop.png';
    await desktopPage.screenshot({ path: desktopScreenshotPath, fullPage: false });
    console.log(`📸 Desktop screenshot saved: ${desktopScreenshotPath}`);

    if (fs.existsSync(PARENT_ARTIFACT_DIR)) {
      const parentDesktopPath = path.join(PARENT_ARTIFACT_DIR, 'qa-ig-trimmer-desktop.png');
      fs.copyFileSync(desktopScreenshotPath, parentDesktopPath);
      console.log(`📋 Copied desktop screenshot to parent artifact: ${parentDesktopPath}`);
    }

    await desktopPage.close();

    // =========================================================================
    // PART 2: MOBILE VIEWPORT TEST (393 x 852 - Modern Phone Viewport)
    // =========================================================================
    console.log('\n======================================================');
    console.log('📱 PART 2: MOBILE VIEWPORT TEST (393x852)');
    console.log('======================================================');

    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

    console.log(`Navigating to ${BASE_URL} on Mobile...`);
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await sleep(600);

    // Click "Start Creating →"
    console.log('Clicking "Start Creating →" on Mobile...');
    await mobilePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const btn = buttons.find(b => b.textContent && b.textContent.includes('Start Creating'));
      if (btn) btn.click();
    });
    await sleep(600);

    // Select "Birthday"
    console.log('Selecting "Birthday" category on Mobile...');
    await mobilePage.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]') || document;
      const buttons = Array.from(modal.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent && b.textContent.includes('Birthday'));
      if (btn) btn.click();
    });
    await sleep(600);

    // Select Recipient Card
    await mobilePage.evaluate(() => {
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

    // On mobile builder, click "Proceed to Form"
    console.log('Clicking "Proceed to Form" on Mobile...');
    await mobilePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const proceed = buttons.find(b => b.textContent && b.textContent.includes('Proceed to Form'));
      if (proceed) proceed.click();

      // Ensure active mobile view is 'editor'
      const formToggle = buttons.find(b => b.textContent && b.textContent.trim() === 'Form');
      if (formToggle) formToggle.click();
    });
    await sleep(800);

    // Switch to Photos & Music tab
    console.log('Switching to Photos & Music tab on Mobile...');
    await mobilePage.evaluate(() => {
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
      if (tab) tab.click();
    });
    await sleep(800);

    // Scroll VISIBLE AudioTrimmer into clear view
    await mobilePage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const visible = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      if (visible) {
        visible.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    await sleep(600);

    // Inspect mobile visible trimmer
    const mobileAudit = await mobilePage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      if (!container) return { containerFound: false };

      const durationBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const text = b.textContent ? b.textContent.trim() : '';
        const title = b.getAttribute('title') || '';
        return /^(15|30|60|Full|∞)$/.test(text) || title.includes('Snippet Duration');
      });
      const playBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const title = (b.getAttribute('title') || '').toLowerCase();
        return (title.includes('preview') || title.includes('play')) && b.className.includes('bg-white');
      });
      const whiteCard = container.querySelector('.bg-white.rounded-xl.shadow-lg');
      const timeDisplay = container.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2})/);

      return {
        containerFound: Boolean(container),
        durationButtonFound: Boolean(durationBtn),
        durationVal: durationBtn ? durationBtn.textContent.trim() : null,
        playButtonFound: Boolean(playBtn),
        whiteCardFound: Boolean(whiteCard),
        timeDisplay: timeDisplay ? timeDisplay[0] : null
      };
    });
    console.log('Mobile UI Audit Results:', JSON.stringify(mobileAudit, null, 2));
    testResults.mobile.audit = mobileAudit;

    // Test mobile duration cycle
    console.log('\n--- ⏱️ Testing Duration Cycle on Mobile ---');
    await mobilePage.evaluate(() => {
      const trimmers = Array.from(document.querySelectorAll('.bg-\\[\\#16181d\\], .bg-\\[\\#121316\\]'));
      const container = trimmers.find(el => el.getBoundingClientRect().height > 0) || trimmers[0];
      const durationBtn = Array.from(container.querySelectorAll('button')).find(b => {
        const text = b.textContent ? b.textContent.trim() : '';
        const title = b.getAttribute('title') || '';
        return /^(15|30|60|Full|∞)$/.test(text) || title.includes('Snippet Duration');
      });
      if (durationBtn) durationBtn.click();
    });
    await sleep(400);

    // Capture Mobile Screenshot
    const mobileScreenshotPath = 'D:\\avprojects\\surprise-builder\\test\\qa-ig-trimmer-mobile.png';
    await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: false });
    console.log(`📸 Mobile screenshot saved: ${mobileScreenshotPath}`);

    if (fs.existsSync(PARENT_ARTIFACT_DIR)) {
      const parentMobilePath = path.join(PARENT_ARTIFACT_DIR, 'qa-ig-trimmer-mobile.png');
      fs.copyFileSync(mobileScreenshotPath, parentMobilePath);
      console.log(`📋 Copied mobile screenshot to parent artifact: ${parentMobilePath}`);
    }

    await mobilePage.close();

    testResults.allPassed = Boolean(
      desktopAudit.containerFound &&
      desktopAudit.durationButtonFound &&
      desktopAudit.topTimelineFound &&
      desktopAudit.playButtonFound &&
      desktopAudit.waveformTrackFound &&
      desktopAudit.whiteSelectorCardFound &&
      mobileAudit.containerFound &&
      mobileAudit.playButtonFound &&
      mobileAudit.whiteCardFound
    );

    console.log('\n======================================================');
    console.log(testResults.allPassed ? '✅ ALL TEST ASSERTIONS PASSED!' : '⚠️ SOME ASSERTIONS FAILED');
    console.log('======================================================');

  } catch (err) {
    console.error('❌ Test failed with exception:', err);
    testResults.error = err.message;
    testResults.allPassed = false;
  } finally {
    await browser.close();
  }

  return testResults;
}

runTest().then(report => {
  console.log('\n📊 FINAL AUTOMATED QA REPORT:');
  console.log(JSON.stringify(report, null, 2));
  if (!report.allPassed) {
    process.exit(1);
  }
});
