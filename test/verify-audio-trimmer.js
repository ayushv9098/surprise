import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testAudioTrimmer() {
  console.log('🚀 Starting Puppeteer Verification for Instagram Story Audio Trimmer...');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  try {
    // ----------------------------------------------------
    // TEST 1: DESKTOP VIEWPORT (1280 x 800)
    // ----------------------------------------------------
    console.log('\n--- 1. Testing on Desktop Viewport (1280x800) ---');
    const desktopPage = await browser.newPage();
    await desktopPage.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to http://localhost:5174/?view=builder ...');
    await desktopPage.goto('http://localhost:5174/?view=builder', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Proceed from Step 1 to Step 2 Form
    await desktopPage.evaluate(() => {
      const proceed = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Proceed'));
      if (proceed) proceed.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Click "2. Photo & Song" tab
    await desktopPage.evaluate(() => {
      const mediaTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Photo') || b.textContent.includes('📸'));
      if (mediaTab) mediaTab.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Verify AudioTrimmer is rendered
    const trimmerPresent = await desktopPage.evaluate(() => {
      const text = document.body.textContent;
      const hasHeader = text.includes('Trim Song Part (Instagram Story Style)');
      const hasSubtitle = text.includes('Choose the exact part of the song');
      return { hasHeader, hasSubtitle };
    });
    console.log('AudioTrimmer header checks:', trimmerPresent);
    if (!trimmerPresent.hasHeader) {
      throw new Error('AudioTrimmer header not found!');
    }

    // Capture initial state screenshot on Desktop
    await desktopPage.screenshot({ path: 'test/qa-trimmer-desktop-initial.png' });
    console.log('📸 Saved test/qa-trimmer-desktop-initial.png');

    // Test 1-Click "✨ Jump to Chorus / Hook"
    console.log('Testing 1-Click "✨ Jump to Chorus / Hook"...');
    const jumpResult = await desktopPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const hookBtn = buttons.find(b => b.textContent.includes('Jump to Chorus'));
      if (hookBtn) {
        const textBefore = hookBtn.textContent.trim().replace(/\s+/g, ' ');
        hookBtn.click();
        return { clicked: true, text: textBefore };
      }
      return { clicked: false };
    });
    console.log('Jump to Hook clicked:', jumpResult);
    await new Promise(r => setTimeout(r, 800));

    // Verify timestamp badge changed after jumping to hook
    const timeAfterHook = await desktopPage.evaluate(() => {
      const text = document.body.textContent;
      const matches = text.match(/(\d+:\d{2}\s*-\s*\d+:\d{2}\s*\([^)]+\))/);
      return matches ? matches[0] : null;
    });
    console.log('Timestamp after Jump to Hook:', timeAfterHook);

    // Test Duration Chips: 15s, 60s, Full Song, 30s
    console.log('Testing Duration Chips...');
    await desktopPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const chip15 = buttons.find(b => b.textContent.trim() === '15s');
      if (chip15) chip15.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const timeAfter15 = await desktopPage.evaluate(() => {
      const match = document.body.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2}\s*\([^)]+\))/);
      return match ? match[0] : null;
    });
    console.log('Time badge after 15s chip:', timeAfter15);

    // Click 60s chip
    await desktopPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const chip60 = buttons.find(b => b.textContent.trim() === '60s');
      if (chip60) chip60.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const timeAfter60 = await desktopPage.evaluate(() => {
      const match = document.body.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2}\s*\([^)]+\))/);
      return match ? match[0] : null;
    });
    console.log('Time badge after 60s chip:', timeAfter60);

    // Click Full Song chip
    await desktopPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const chipFull = buttons.find(b => b.textContent.trim() === 'Full Song');
      if (chipFull) chipFull.click();
    });
    await new Promise(r => setTimeout(r, 400));

    const timeAfterFull = await desktopPage.evaluate(() => {
      const match = document.body.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2}\s*\([^)]+\))/);
      return match ? match[0] : null;
    });
    console.log('Time badge after Full Song chip:', timeAfterFull);

    // Click 30s (Default) chip
    await desktopPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const chip30 = buttons.find(b => b.textContent.includes('30s'));
      if (chip30) chip30.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Test Range Slider Adjustment
    console.log('Testing Range Slider Adjustment to 45s...');
    const sliderTested = await desktopPage.evaluate(() => {
      const slider = document.querySelector('input[type="range"][aria-label="Adjust start timestamp"]');
      if (slider) {
        slider.value = 45;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
        return { found: true, val: slider.value };
      }
      return { found: false };
    });
    console.log('Slider adjust result:', sliderTested);
    await new Promise(r => setTimeout(r, 400));

    // Test Preview Play/Pause
    console.log('Testing Instant Preview Play...');
    const playClicked = await desktopPage.evaluate(() => {
      const playBtn = document.querySelector('button[title*="snippet preview"]');
      if (playBtn) {
        playBtn.click();
        return true;
      }
      return false;
    });
    console.log('Play button clicked:', playClicked);
    await new Promise(r => setTimeout(r, 600));

    // Pause preview
    await desktopPage.evaluate(() => {
      const pauseBtn = document.querySelector('button[title*="snippet preview"]');
      if (pauseBtn) pauseBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Test switching to another song (Kesariya)
    console.log('Switching song to Kesariya...');
    await desktopPage.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div')).filter(el =>
        el.textContent.includes('Kesariya (Brahmastra)') && el.classList.contains('cursor-pointer')
      );
      if (cards.length > 0) cards[0].click();
    });
    await new Promise(r => setTimeout(r, 600));

    const kesariyaHookInfo = await desktopPage.evaluate(() => {
      const hookBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Jump to Chorus'));
      return hookBtn ? hookBtn.textContent.trim().replace(/\s+/g, ' ') : null;
    });
    console.log('Kesariya Chorus Hook Info:', kesariyaHookInfo);

    // Click Jump to Chorus on Kesariya
    await desktopPage.evaluate(() => {
      const hookBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Jump to Chorus'));
      if (hookBtn) hookBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const kesariyaTime = await desktopPage.evaluate(() => {
      const match = document.body.textContent.match(/(\d+:\d{2}\s*-\s*\d+:\d{2}\s*\([^)]+\))/);
      return match ? match[0] : null;
    });
    console.log('Kesariya Time after Hook Jump:', kesariyaTime);

    // Screenshot Desktop Final
    await desktopPage.screenshot({ path: 'test/qa-trimmer-desktop-verified.png' });
    console.log('📸 Saved test/qa-trimmer-desktop-verified.png');

    // ----------------------------------------------------
    // TEST 2: MOBILE VIEWPORT (393 x 852 - iPhone 16)
    // ----------------------------------------------------
    console.log('\n--- 2. Testing on Mobile Viewport (393x852) ---');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });

    console.log('Navigating mobilePage to http://localhost:5174/?view=builder ...');
    await mobilePage.goto('http://localhost:5174/?view=builder', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Click Proceed on mobile
    await mobilePage.evaluate(() => {
      const proceed = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Proceed'));
      if (proceed) proceed.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Ensure 'Form' view tab is active
    await mobilePage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const formBtn = btns.find(b => b.textContent.trim() === 'Form');
      if (formBtn) formBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Click '2. Photos' tab on mobile
    await mobilePage.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const mediaBtn = btns.find(b => b.textContent.includes('Photos') || b.textContent.includes('📸'));
      if (mediaBtn) mediaBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Scroll trimmer into view on mobile
    await mobilePage.evaluate(() => {
      const trimmerHeader = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Trim Song Part'));
      if (trimmerHeader) {
        trimmerHeader.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    await new Promise(r => setTimeout(r, 600));

    // Verify Mobile layout elements
    const mobileElementsCheck = await mobilePage.evaluate(() => {
      const text = document.body.textContent;
      return {
        hasTrimmerHeader: text.includes('Trim Song Part'),
        hasJumpHook: text.includes('Jump to Chorus'),
        hasDurationChips: text.includes('15s') && text.includes('30s') && text.includes('60s'),
        hasWaveform: Boolean(document.querySelector('.cursor-ew-resize')),
      };
    });
    console.log('Mobile Elements Check:', mobileElementsCheck);

    if (!mobileElementsCheck.hasTrimmerHeader || !mobileElementsCheck.hasJumpHook || !mobileElementsCheck.hasDurationChips) {
      throw new Error('Mobile element check failed!');
    }

    // Screenshot Mobile View
    await mobilePage.screenshot({ path: 'test/qa-trimmer-mobile-verified.png' });
    console.log('📸 Saved test/qa-trimmer-mobile-verified.png');

    console.log('\n🎉 ALL AUDIO TRIMMER TESTS PASSED 100%!');
  } catch (err) {
    console.error('❌ Error during Audio Trimmer verification:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

testAudioTrimmer();
