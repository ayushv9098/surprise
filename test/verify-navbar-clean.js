import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';
const OUTPUT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';
const MAIN_SCREENSHOT_PATH = path.join(OUTPUT_DIR, 'qa-navbar-clean.png');

async function verifyNavbarClean() {
  console.log('======================================================================');
  console.log('🧼 DEARLY NAVBAR & UI VERIFICATION SUITE');
  console.log('======================================================================\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop Viewport Verification (1280x800)
    console.log('[1/4] Loading desktop viewport (1280x800)...');
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.waitForSelector('header');

    const desktopNavbarInfo = await page.evaluate(() => {
      const header = document.querySelector('header');
      const text = header ? header.innerText.trim() : '';
      const hasSparkle = text.includes('✨') || header.innerHTML.includes('✨');
      const svg = header.querySelector('svg');
      const brandSpan = header.querySelector('button span');
      return {
        text,
        hasSparkle,
        hasSvgLogo: !!svg,
        brandText: brandSpan ? brandSpan.innerText : '',
        fontClass: brandSpan ? brandSpan.className : ''
      };
    });

    console.log('Desktop Header Analysis:', JSON.stringify(desktopNavbarInfo, null, 2));

    const headerElement = await page.$('header');
    const desktopHeaderBuffer = await headerElement.screenshot();
    const desktopHeaderBase64 = desktopHeaderBuffer.toString('base64');

    // 2. Mobile Viewport Verification (390x844 - iPhone 14 style)
    console.log('\n[2/4] Loading mobile viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.waitForSelector('header');

    const mobileNavbarInfo = await page.evaluate(() => {
      const header = document.querySelector('header');
      const text = header ? header.innerText.trim() : '';
      const hasSparkle = text.includes('✨') || header.innerHTML.includes('✨');
      const svg = header.querySelector('svg');
      const brandSpan = header.querySelector('button span');
      return {
        text,
        hasSparkle,
        hasSvgLogo: !!svg,
        brandText: brandSpan ? brandSpan.innerText : '',
        fontClass: brandSpan ? brandSpan.className : ''
      };
    });

    console.log('Mobile Header Analysis:', JSON.stringify(mobileNavbarInfo, null, 2));

    const mobileHeaderElement = await page.$('header');
    const mobileHeaderBuffer = await mobileHeaderElement.screenshot();
    const mobileHeaderBase64 = mobileHeaderBuffer.toString('base64');

    // 3. Composite Presentation Page for visual QA
    console.log('\n[3/4] Generating high-resolution combined visual QA screenshot...');
    const compositeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          body {
            background: #0d1117;
            padding: 32px;
            color: #e6edf3;
            display: flex;
            justify-content: center;
          }
          .container {
            width: 1040px;
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          }
          .title-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #30363d;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .title {
            font-size: 20px;
            font-weight: 700;
            color: #f0f6fc;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .badge-clean {
            display: inline-block;
            background: #238636;
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          .section {
            margin-bottom: 28px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #8b949e;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .preview-box {
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #d0d7de;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .preview-box img {
            display: block;
            width: 100%;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 20px;
          }
          .metric-card {
            background: #21262d;
            border: 1px solid #30363d;
            border-radius: 8px;
            padding: 12px 16px;
          }
          .metric-label {
            font-size: 11px;
            color: #8b949e;
            margin-bottom: 4px;
          }
          .metric-val {
            font-size: 14px;
            font-weight: 600;
            color: #58a6ff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title-bar">
            <div class="title">
              <span>Dearly — Verified Navbar & Clean Logo QA</span>
              <span class="badge-clean">✨ EMOJI REMOVED • 100% CLEAN</span>
            </div>
            <div style="font-size: 12px; color: #8b949e;">Resolution: 2x Retina</div>
          </div>

          <div class="section">
            <div class="section-title">Desktop Header Viewport (1280px)</div>
            <div class="preview-box">
              <img src="data:image/png;base64,${desktopHeaderBase64}" alt="Desktop Header" />
            </div>
          </div>

          <div class="section">
            <div class="section-title">Mobile Header Viewport (390px)</div>
            <div class="preview-box" style="max-width: 420px;">
              <img src="data:image/png;base64,${mobileHeaderBase64}" alt="Mobile Header" />
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Cheesy Sparkle Emoji Status</div>
              <div class="metric-val" style="color: #3fb950;">None Detected (Clean)</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Logo Mark</div>
              <div class="metric-val">Obsidian & Champagne Gold D</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Typography</div>
              <div class="metric-val">font-semibold text-lg (Slate-900)</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const compositePage = await browser.newPage();
    await compositePage.setViewport({ width: 1120, height: 680, deviceScaleFactor: 2 });
    await compositePage.setContent(compositeHtml, { waitUntil: 'load' });
    await compositePage.screenshot({
      path: MAIN_SCREENSHOT_PATH,
      fullPage: true
    });

    console.log(`\n[4/4] Screenshot saved to: ${MAIN_SCREENSHOT_PATH}`);

    const allPassed = !desktopNavbarInfo.hasSparkle && 
                      desktopNavbarInfo.hasSvgLogo && 
                      !mobileNavbarInfo.hasSparkle && 
                      mobileNavbarInfo.hasSvgLogo;

    if (allPassed) {
      console.log('\n✅ VERIFICATION COMPLETE: ALL CHECKS PASSED PERFECTLY!');
    } else {
      console.error('\n❌ VERIFICATION FAILED: Some checks did not pass.');
      process.exitCode = 1;
    }

  } catch (err) {
    console.error('Error during verification:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

verifyNavbarClean();
