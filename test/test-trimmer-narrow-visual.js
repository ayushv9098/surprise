import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const NARROW_PNG = 'D:\\avprojects\\surprise-builder\\test\\qa-polished-trimmer-narrow.png';
const DESKTOP_PNG = 'D:\\avprojects\\surprise-builder\\test\\qa-polished-trimmer-desktop.png';
const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

async function runTest() {
  console.log('🚀 Running Visual Test for Polished Trimmer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // TEST 1: NARROW VIEWPORT (360x780)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 360, height: 780, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });

  // Click Start Creating
  await mobilePage.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start Creating'))?.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click Birthday
  await mobilePage.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Birthday'))?.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Recipient Card
  await mobilePage.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    btns.find(b => b.textContent && (b.textContent.includes('Girl') || b.textContent.includes('Her')))?.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Proceed to Form & Form Tab
  await mobilePage.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Proceed to Form'))?.click();
    Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Form')?.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Switch to Photos & Music tab
  await mobilePage.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    tabs.find(b => b.textContent.includes('Photo') || b.textContent.includes('Photos'))?.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Audit Trimmer on 360px viewport
  const auditResult = await mobilePage.evaluate(() => {
    // Find visible AudioTrimmer
    const allTrimmers = Array.from(document.querySelectorAll('div')).filter(d => 
      d.className.includes('bg-gradient-to-b from-[#1c1d24]') ||
      d.textContent.includes('Story Cropper')
    );
    const visibleTrimmer = allTrimmers.find(el => el.getBoundingClientRect().height > 0) || allTrimmers[0];
    if (!visibleTrimmer) return { error: 'Trimmer not found' };

    visibleTrimmer.scrollIntoView({ behavior: 'instant', block: 'center' });

    // Inspect bottom row duration buttons
    const buttons = Array.from(visibleTrimmer.querySelectorAll('button')).filter(b => 
      ['15s', '30s', '60s', 'Full'].includes(b.textContent.trim())
    );
    const rects = buttons.map(b => ({ label: b.textContent.trim(), ...b.getBoundingClientRect().toJSON() }));

    // Check if any button wrapped vertically (diff in top <= 2px)
    const tops = rects.map(r => r.top);
    const maxTop = Math.max(...tops);
    const minTop = Math.min(...tops);
    const isSingleLine = Math.abs(maxTop - minTop) <= 2;

    return {
      isSingleLine,
      buttonsCount: buttons.length,
      rects,
      timestampText: visibleTrimmer.querySelector('.font-mono')?.textContent
    };
  });

  console.log('Mobile (360px) Audit Result:', auditResult);

  // Take screenshot of trimmer element
  const trimmerHandle = await mobilePage.evaluateHandle(() => {
    const allTrimmers = Array.from(document.querySelectorAll('div')).filter(d => 
      d.className.includes('bg-gradient-to-b from-[#1c1d24]') ||
      d.textContent.includes('Story Cropper')
    );
    return allTrimmers.find(el => el.getBoundingClientRect().height > 0) || allTrimmers[0];
  });

  if (trimmerHandle) {
    await trimmerHandle.screenshot({ path: NARROW_PNG });
    fs.copyFileSync(NARROW_PNG, `${ARTIFACT_DIR}\\qa-polished-trimmer-narrow.png`);
    console.log('Saved narrow trimmer screenshot!');
  }

  // TEST 2: DESKTOP VIEWPORT (1280x800)
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await desktopPage.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });

  await desktopPage.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start Creating'))?.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await desktopPage.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Birthday'))?.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await desktopPage.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    btns.find(b => b.textContent && (b.textContent.includes('Girl') || b.textContent.includes('Her')))?.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await desktopPage.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Proceed to Form'))?.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await desktopPage.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    tabs.find(b => b.textContent.includes('Photo') || b.textContent.includes('Song'))?.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const desktopTrimmerHandle = await desktopPage.evaluateHandle(() => {
    const allTrimmers = Array.from(document.querySelectorAll('div')).filter(d => 
      d.className.includes('bg-gradient-to-b from-[#1c1d24]') ||
      d.textContent.includes('Story Cropper')
    );
    return allTrimmers.find(el => el.getBoundingClientRect().height > 0) || allTrimmers[0];
  });

  if (desktopTrimmerHandle) {
    await desktopTrimmerHandle.screenshot({ path: DESKTOP_PNG });
    fs.copyFileSync(DESKTOP_PNG, `${ARTIFACT_DIR}\\qa-polished-trimmer-desktop.png`);
    console.log('Saved desktop trimmer screenshot!');
  }

  await browser.close();
  console.log('✅ Visual test completed successfully!');
}

runTest().catch(console.error);
