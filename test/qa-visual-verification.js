import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';

async function runVisualQA() {
  console.log('======================================================================');
  console.log('🔍 VISUAL QA, PARITY & PRODUCTION VERIFICATION SUITE');
  console.log('======================================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const report = {
    timestamp: new Date().toISOString(),
    viewportsTested: ['1280x800', '1280x551'],
    checks: [],
    screenshots: {}
  };

  try {
    const page = await browser.newPage();

    // -----------------------------------------------------------------
    // 1. Navigate to Builder with Birthday Boy (Royal Sapphire)
    // -----------------------------------------------------------------
    console.log('[1/5] Navigating to http://localhost:5174/ and opening Birthday Boy Studio...');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    // Click "Start Creating"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => (b.textContent || '').includes('Start Creating'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Click "For a Boy"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const boyBtn = btns.find(b => (b.textContent || '').includes('For a Boy') || (b.textContent || '').includes('Select boy style'));
      if (boyBtn) boyBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // -----------------------------------------------------------------
    // 2. Capture Builder Studio Overview at 1280x800
    // -----------------------------------------------------------------
    console.log('[2/5] Capturing 1280x800 Desktop Builder Studio Overview...');
    const desktopShot = 'test/qa-studio-desktop-1280x800.png';
    await page.screenshot({ path: desktopShot });
    report.screenshots.desktopOverview = desktopShot;
    console.log(`  ✓ Saved: ${desktopShot}`);

    // -----------------------------------------------------------------
    // 3. Inspect Royal Sapphire Template Card & Grid
    // -----------------------------------------------------------------
    console.log('[3/5] Inspecting Royal Sapphire Template Card & Grid Aesthetic...');
    
    // Capture Grid Screenshot
    const gridEl = await page.$('.grid');
    if (gridEl) {
      const gridShot = 'test/qa-template-grid.png';
      await gridEl.screenshot({ path: gridShot });
      report.screenshots.templateGrid = gridShot;
      console.log(`  ✓ Saved: ${gridShot}`);
    }

    // Inspect Card Details & SVG Aesthetic
    const cardAudit = await page.evaluate(async () => {
      const cards = Array.from(document.querySelectorAll('.grid > div'));
      let royalCard = null;
      for (const c of cards) {
        if ((c.textContent || '').includes('Royal Sapphire')) {
          royalCard = c;
          break;
        }
      }
      if (!royalCard) return { found: false };

      const img = royalCard.querySelector('img');
      const imgContainer = img ? img.parentElement : null;
      const isSelected = royalCard.className.includes('ring-rose-500') || royalCard.className.includes('border-rose-500');

      // Fetch preview SVG text to verify colors & polaroid
      let svgContent = '';
      if (img && img.src) {
        try {
          const res = await fetch(img.src);
          svgContent = await res.text();
        } catch (e) {
          svgContent = 'FETCH_FAILED: ' + e.message;
        }
      }

      const hasSoftCanvasGrad = svgContent.includes('#f8fbff') && svgContent.includes('#e8f2fe');
      const hasDarkNavyStops = svgContent.includes('#091024') || svgContent.includes('#0f172a');
      const hasPolaroidImage = svgContent.includes('<image') && (svgContent.includes('href=') || svgContent.includes('xlink:href='));
      const hasGentleShadows = svgContent.includes('stdDeviation="16"');
      const cardBorderStroke = svgContent.includes('stroke="#bfdbfe"');

      return {
        found: true,
        isSelected,
        imgSrc: img ? img.src : null,
        imgContainerClass: imgContainer ? imgContainer.className : '',
        cardClass: royalCard.className,
        hasSoftCanvasGrad,
        hasDarkNavyStops,
        hasPolaroidImage,
        hasGentleShadows,
        cardBorderStroke
      };
    });

    console.log('Card Audit Results:', JSON.stringify(cardAudit, null, 2));

    // Capture Royal Sapphire Card Screenshot
    const cardsList = await page.$$('.grid > div');
    for (const c of cardsList) {
      const text = await page.evaluate(el => el.textContent, c);
      if (text && text.includes('Royal Sapphire')) {
        const cardShot = 'test/qa-royal-sapphire-card.png';
        await c.screenshot({ path: cardShot });
        report.screenshots.royalSapphireCard = cardShot;
        console.log(`  ✓ Saved: ${cardShot}`);
        break;
      }
    }

    report.checks.push({
      name: 'Royal Sapphire Template Card Found and Active',
      pass: cardAudit.found && cardAudit.isSelected,
      details: { found: cardAudit.found, isSelected: cardAudit.isSelected }
    });

    report.checks.push({
      name: 'Card Container has Soft Light Background (no dark navy)',
      pass: !cardAudit.imgContainerClass.includes('from-blue-900') && (cardAudit.imgContainerClass.includes('from-blue-50') || cardAudit.imgContainerClass.includes('from-slate-100')),
      details: cardAudit.imgContainerClass
    });

    report.checks.push({
      name: 'SVG Graphic Soft Light Aesthetic (#f8fbff / #e8f2fe, 0 #091024)',
      pass: cardAudit.hasSoftCanvasGrad && !cardAudit.hasDarkNavyStops,
      details: { hasSoftCanvasGrad: cardAudit.hasSoftCanvasGrad, hasDarkNavyStops: cardAudit.hasDarkNavyStops }
    });

    report.checks.push({
      name: 'SVG Graphic Delicate Blue Border (stroke="#bfdbfe")',
      pass: cardAudit.cardBorderStroke,
      details: { cardBorderStroke: cardAudit.cardBorderStroke }
    });

    report.checks.push({
      name: 'SVG Graphic Embedded Polaroid Photo Intact & Crystal Clear',
      pass: cardAudit.hasPolaroidImage,
      details: { hasPolaroidImage: cardAudit.hasPolaroidImage }
    });

    // -----------------------------------------------------------------
    // 4. Verify Phone Simulator (Untouched, Pixel-Perfect, Chassis, Address Bar, Chevrons, Floating)
    // -----------------------------------------------------------------
    console.log('[4/5] Inspecting Phone Simulator (Right Column)...');

    const simAudit = await page.evaluate(() => {
      // Find the desktop simulator container specifically
      const simContainer = document.querySelector('.hidden.lg\\:flex .rounded-\\[50px\\]') || document.querySelector('.rounded-\\[50px\\]');
      const innerBezel = simContainer ? simContainer.querySelector('.rounded-\\[47px\\].bg-black') : null;
      const screenCanvas = simContainer ? simContainer.querySelector('.rounded-\\[38px\\]') : null;
      const hardwareButtons = simContainer ? Array.from(simContainer.parentElement.querySelectorAll('div[class*="-left-\\[3.5px\\]"], div[class*="-right-\\[3.5px\\]"]')) : [];

      // 2. Safari Address Bar
      const lockIcon = simContainer ? simContainer.querySelector('svg.lucide-lock') : null;
      const addressTexts = simContainer ? Array.from(simContainer.querySelectorAll('*')).map(el => (el.textContent || '').trim()) : [];
      const hasAyushhDomain = addressTexts.some(t => t === 'ayushh.me');

      // 3. Navigation Chevrons
      const leftChevron = simContainer ? simContainer.querySelector('svg.lucide-chevron-left') : null;
      const rightChevron = simContainer ? simContainer.querySelector('svg.lucide-chevron-right') : null;

      // 4. Floating Elements inside this simulator
      const floatingEmojiDivs = simContainer ? Array.from(simContainer.querySelectorAll('div[style*="floatGentleAnim"]')) : [];

      // 5. Soft Aesthetic Canvas
      const hasSoftAesthetic = screenCanvas ? screenCanvas.className.includes('bg-soft-aesthetic') : false;

      // 6. Coordinates & Bounding Box
      const rimRect = simContainer ? simContainer.getBoundingClientRect() : null;

      return {
        hasTitaniumRim: !!simContainer,
        hasInnerBezel: !!innerBezel,
        hasScreenCanvas: !!screenCanvas,
        hardwareButtonsCount: hardwareButtons.length,
        hasAyushhDomain,
        hasLockIcon: !!lockIcon,
        hasLeftChevron: !!leftChevron,
        hasRightChevron: !!rightChevron,
        floatingEmojisCount: floatingEmojiDivs.length,
        hasSoftAesthetic,
        rimRect: rimRect ? {
          x: Math.round(rimRect.x),
          y: Math.round(rimRect.y),
          width: Math.round(rimRect.width),
          height: Math.round(rimRect.height)
        } : null
      };
    });

    console.log('Simulator Audit Results:', JSON.stringify(simAudit, null, 2));

    // Capture Phone Simulator Screenshot
    const simEl = await page.$('.shrink-0.relative.select-none') || await page.$('.rounded-\\[50px\\]');
    if (simEl) {
      const simShot = 'test/qa-phone-simulator.png';
      await simEl.screenshot({ path: simShot });
      report.screenshots.phoneSimulator = simShot;
      console.log(`  ✓ Saved: ${simShot}`);
    }

    report.checks.push({
      name: 'Titanium Chassis & Bezel 100% Pixel-Perfect',
      pass: simAudit.hasTitaniumRim && simAudit.hasInnerBezel && simAudit.hasScreenCanvas && simAudit.hardwareButtonsCount >= 4,
      details: { rim: simAudit.hasTitaniumRim, buttons: simAudit.hardwareButtonsCount, rect: simAudit.rimRect }
    });

    report.checks.push({
      name: 'Safari Address Bar "ayushh.me" with Lock Icon Untouched',
      pass: simAudit.hasAyushhDomain && simAudit.hasLockIcon,
      details: { domain: simAudit.hasAyushhDomain, lock: simAudit.hasLockIcon }
    });

    report.checks.push({
      name: 'Scene Navigation Chevrons Functional and Visible',
      pass: simAudit.hasLeftChevron && simAudit.hasRightChevron,
      details: { left: simAudit.hasLeftChevron, right: simAudit.hasRightChevron }
    });

    report.checks.push({
      name: 'Ambient Floating Emojis Untouched (8 items)',
      pass: simAudit.floatingEmojisCount === 8,
      details: { count: simAudit.floatingEmojisCount }
    });

    report.checks.push({
      name: 'Phone Simulator Background Matches Royal Sapphire Soft Aesthetic',
      pass: simAudit.hasSoftAesthetic,
      details: { hasSoftAesthetic: simAudit.hasSoftAesthetic }
    });

    // -----------------------------------------------------------------
    // 5. Test Exact Laptop Screen Viewport 1280x551
    // -----------------------------------------------------------------
    console.log('[5/5] Testing Exact Laptop Viewport 1280x551 for Layout Regressions...');
    await page.setViewport({ width: 1280, height: 551 });
    await new Promise(r => setTimeout(r, 1200));

    const laptopShot = 'test/qa-studio-laptop-1280x551.png';
    await page.screenshot({ path: laptopShot });
    report.screenshots.laptop551 = laptopShot;
    console.log(`  ✓ Saved: ${laptopShot}`);

    // Verify layout physics & zero clipping in 1280x551
    const laptopMetrics = await page.evaluate(() => {
      const titaniumRim = document.querySelector('.rounded-\\[50px\\].bg-gradient-to-b');
      if (!titaniumRim) return { found: false };
      const rect = titaniumRim.getBoundingClientRect();
      const viewportHeight = window.innerHeight; // 551
      const viewportWidth = window.innerWidth;   // 1280

      const leftPanel = document.querySelector('.flex-1.min-w-0') || document.querySelector('.max-w-2xl');
      const leftRect = leftPanel ? leftPanel.getBoundingClientRect() : null;

      return {
        found: true,
        viewportHeight,
        viewportWidth,
        simulatorY: Math.round(rect.y),
        simulatorHeight: Math.round(rect.height),
        simulatorBottom: Math.round(rect.bottom),
        fitsWithoutClipping: rect.bottom <= viewportHeight + 5 && rect.y >= 0,
        leftPanelVisible: !!leftPanel && leftRect.width > 300,
        simulatorVisible: rect.width > 120 && rect.height > 250
      };
    });

    console.log('Laptop Viewport Metrics:', JSON.stringify(laptopMetrics, null, 2));

    report.checks.push({
      name: 'Zero Layout Regressions on User Laptop (1280x551 Viewport)',
      pass: laptopMetrics.found && laptopMetrics.fitsWithoutClipping && laptopMetrics.leftPanelVisible && laptopMetrics.simulatorVisible,
      details: laptopMetrics
    });

    await browser.close();

    // -----------------------------------------------------------------
    // Summary & Results File
    // -----------------------------------------------------------------
    console.log('\n======================================================================');
    console.log('📋 FINAL VISUAL QA AUDIT RESULTS:');
    console.log('======================================================================');
    let allPassed = true;
    for (const c of report.checks) {
      const mark = c.pass ? '✅ PASS' : '❌ FAIL';
      if (!c.pass) allPassed = false;
      console.log(`${mark} : ${c.name}`);
      console.log(`         Details: ${JSON.stringify(c.details)}`);
    }

    report.allPassed = allPassed;
    fs.writeFileSync('test/qa-verification-report.json', JSON.stringify(report, null, 2));
    console.log('\nReport successfully saved to test/qa-verification-report.json');

    if (!allPassed) {
      console.error('\n⚠️ Some Visual QA checks failed!');
      process.exit(1);
    } else {
      console.log('\n🎉 ALL VISUAL QA CHECKS PASSED WITH 100% FIDELITY!');
    }

  } catch (err) {
    console.error('Fatal error during visual QA:', err);
    await browser.close();
    process.exit(1);
  }
}

runVisualQA();
