import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_PATH = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\qa-dearly-font-options.png';

async function generateFontComparison() {
  console.log('Launching headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=max']
  });

  const page = await browser.newPage();
  
  // Set exact mobile viewport with high DPI (deviceScaleFactor: 2 for crisp Retina display)
  await page.setViewport({
    width: 393,
    height: 852,
    deviceScaleFactor: 2
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=393, initial-scale=1.0">
  <title>Dearly Brand Typography Comparison</title>
  
  <!-- Google Fonts Preconnect & Load -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    body {
      background: #F8FAFC;
      color: #0F172A;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      width: 393px;
      height: 852px;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 11px;
      overflow: hidden;
    }
    
    /* Header Bar */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 4px 4px 4px;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 8px;
    }
    .header-titles h1 {
      font-size: 14.5px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.02em;
    }
    .header-titles p {
      font-size: 11px;
      color: #64748B;
      font-weight: 500;
      margin-top: 1.5px;
    }
    .viewport-pill {
      background: #0F172A;
      color: #F8FAFC;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 9999px;
      letter-spacing: 0.02em;
    }

    /* Cards */
    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 11px 13px;
      box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .card.highlighted {
      border: 1.5px solid #E11D48;
      background: linear-gradient(180deg, #FFFFFF 0%, #FFFDFE 100%);
      box-shadow: 0 4px 14px -3px rgba(225, 29, 72, 0.12), 0 1px 2px rgba(15, 23, 42, 0.03);
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .option-tag {
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      padding: 2.5px 8px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .tag-neutral { background: #F1F5F9; color: #475569; }
    .tag-rose { background: #FFF1F2; color: #BE123C; }
    .tag-blue { background: #EFF6FF; color: #1D4ED8; }
    .tag-amber { background: #FFFBEB; color: #B45309; }

    .style-label {
      font-size: 10.5px;
      color: #64748B;
      font-weight: 600;
    }
    .style-label.star {
      color: #E11D48;
      font-weight: 700;
    }

    /* Exact Navbar Simulation */
    .navbar-preview {
      background: rgba(255, 255, 255, 0.98);
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 11px;
      padding: 9px 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    /* Typography Treatments for "Dearly" */
    .font-opt-1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      font-size: 20px;
      letter-spacing: -0.02em;
      color: #0F172A;
      line-height: 1;
    }
    .font-opt-2 {
      font-family: 'Outfit', system-ui, sans-serif;
      font-weight: 700;
      font-size: 21px;
      letter-spacing: -0.03em;
      color: #0F172A;
      line-height: 1;
    }
    .font-opt-3 {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      font-weight: 700;
      font-size: 20px;
      letter-spacing: -0.02em;
      color: #090A0F;
      line-height: 1;
    }
    .font-opt-4 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-weight: 700;
      font-size: 22px;
      letter-spacing: -0.01em;
      color: #0F172A;
      line-height: 1;
    }

    .navbar-right-mock {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .clean-pill {
      font-size: 9.5px;
      font-weight: 600;
      color: #64748B;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 3px 8px;
      border-radius: 9999px;
    }

    /* Meta / Specs */
    .card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1px;
    }
    .specs-text {
      font-size: 9.5px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #64748B;
      font-weight: 600;
      background: #F8FAFC;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #F1F5F9;
    }
    .vibe-desc {
      font-size: 10px;
      color: #334155;
      font-weight: 600;
    }

    /* Verdict Card */
    .verdict-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .verdict-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0F172A;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .verdict-line {
      font-size: 10px;
      color: #475569;
      line-height: 1.4;
    }
    .verdict-line strong {
      color: #0F172A;
    }
  </style>
</head>
<body>

  <!-- Top Title Bar -->
  <div class="header">
    <div class="header-titles">
      <h1>Dearly — Brand Typography Showcase</h1>
      <p>Comparing 4 premium treatments on mobile navbar</p>
    </div>
    <div class="viewport-pill">393 × 852 Viewport</div>
  </div>

  <!-- OPTION 1: Playfair Display -->
  <div class="card">
    <div class="card-top">
      <span class="option-tag tag-neutral">Option 1 • Editorial Serif</span>
      <span class="style-label">Timeless Keepsake Romance</span>
    </div>
    <div class="navbar-preview">
      <div class="brand-group">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FB7185" />
              <stop offset="45%" stop-color="#E11D48" />
              <stop offset="100%" stop-color="#BE123C" />
            </linearGradient>
          </defs>
          <rect x="4" y="6" width="24" height="20" rx="4.5" stroke="url(#g1)" stroke-width="2.4" />
          <path d="M5.5 8.2L14.6 16.3C15.4 17 16.6 17 17.4 16.3L26.5 8.2" stroke="url(#g1)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 14.2C15.1 13.1 13.4 13.4 13.4 14.8C13.4 16.6 16 18.7 16 18.7C16 18.7 18.6 16.6 18.6 14.8C18.6 13.4 16.9 13.1 16 14.2Z" fill="url(#g1)" />
        </svg>
        <span class="font-opt-1">Dearly</span>
      </div>
      <div class="navbar-right-mock">
        <span class="clean-pill">Navbar</span>
      </div>
    </div>
    <div class="card-meta">
      <span class="specs-text">Playfair Display 700 • 20px</span>
      <span class="vibe-desc">High contrast editorial serif</span>
    </div>
  </div>

  <!-- OPTION 2: Outfit (Modern Geometric Luxury) -->
  <div class="card highlighted">
    <div class="card-top">
      <span class="option-tag tag-rose">Option 2 • Modern Geometric</span>
      <span class="style-label star">★ Top Pick for High Clarity</span>
    </div>
    <div class="navbar-preview">
      <div class="brand-group">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FB7185" />
              <stop offset="45%" stop-color="#E11D48" />
              <stop offset="100%" stop-color="#BE123C" />
            </linearGradient>
          </defs>
          <rect x="4" y="6" width="24" height="20" rx="4.5" stroke="url(#g2)" stroke-width="2.4" />
          <path d="M5.5 8.2L14.6 16.3C15.4 17 16.6 17 17.4 16.3L26.5 8.2" stroke="url(#g2)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 14.2C15.1 13.1 13.4 13.4 13.4 14.8C13.4 16.6 16 18.7 16 18.7C16 18.7 18.6 16.6 18.6 14.8C18.6 13.4 16.9 13.1 16 14.2Z" fill="url(#g2)" />
        </svg>
        <span class="font-opt-2">Dearly</span>
      </div>
      <div class="navbar-right-mock">
        <span class="clean-pill">Navbar</span>
      </div>
    </div>
    <div class="card-meta">
      <span class="specs-text">Outfit 700 • 21px • -0.03em</span>
      <span class="vibe-desc">Ultra-clean Apple/Linear aesthetic</span>
    </div>
  </div>

  <!-- OPTION 3: Plus Jakarta Sans -->
  <div class="card">
    <div class="card-top">
      <span class="option-tag tag-blue">Option 3 • Neo-Grotesque</span>
      <span class="style-label">Swiss High-DPI Precision</span>
    </div>
    <div class="navbar-preview">
      <div class="brand-group">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FB7185" />
              <stop offset="45%" stop-color="#E11D48" />
              <stop offset="100%" stop-color="#BE123C" />
            </linearGradient>
          </defs>
          <rect x="4" y="6" width="24" height="20" rx="4.5" stroke="url(#g3)" stroke-width="2.4" />
          <path d="M5.5 8.2L14.6 16.3C15.4 17 16.6 17 17.4 16.3L26.5 8.2" stroke="url(#g3)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 14.2C15.1 13.1 13.4 13.4 13.4 14.8C13.4 16.6 16 18.7 16 18.7C16 18.7 18.6 16.6 18.6 14.8C18.6 13.4 16.9 13.1 16 14.2Z" fill="url(#g3)" />
        </svg>
        <span class="font-opt-3">Dearly</span>
      </div>
      <div class="navbar-right-mock">
        <span class="clean-pill">Navbar</span>
      </div>
    </div>
    <div class="card-meta">
      <span class="specs-text">Plus Jakarta Sans 700 • 20px</span>
      <span class="vibe-desc">Engineered for razor-sharp readability</span>
    </div>
  </div>

  <!-- OPTION 4: Cormorant Garamond -->
  <div class="card">
    <div class="card-top">
      <span class="option-tag tag-amber">Option 4 • Classic Warm Serif</span>
      <span class="style-label">Literary Boutique Warmth</span>
    </div>
    <div class="navbar-preview">
      <div class="brand-group">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FB7185" />
              <stop offset="45%" stop-color="#E11D48" />
              <stop offset="100%" stop-color="#BE123C" />
            </linearGradient>
          </defs>
          <rect x="4" y="6" width="24" height="20" rx="4.5" stroke="url(#g4)" stroke-width="2.4" />
          <path d="M5.5 8.2L14.6 16.3C15.4 17 16.6 17 17.4 16.3L26.5 8.2" stroke="url(#g4)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 14.2C15.1 13.1 13.4 13.4 13.4 14.8C13.4 16.6 16 18.7 16 18.7C16 18.7 18.6 16.6 18.6 14.8C18.6 13.4 16.9 13.1 16 14.2Z" fill="url(#g4)" />
        </svg>
        <span class="font-opt-4">Dearly</span>
      </div>
      <div class="navbar-right-mock">
        <span class="clean-pill">Navbar</span>
      </div>
    </div>
    <div class="card-meta">
      <span class="specs-text">Cormorant Garamond 700 • 22px</span>
      <span class="vibe-desc">Delicate, traditional Italian elegance</span>
    </div>
  </div>

  <!-- Readability Verdict Box -->
  <div class="verdict-card">
    <div class="verdict-title">
      <span>Readability &amp; Premium Rating</span>
      <span style="color: #E11D48;">User Focus: Easy to Read</span>
    </div>
    <div class="verdict-line">
      <strong>Option 2 (Outfit):</strong> Highest instant clarity, modern Apple-grade luxury.
    </div>
    <div class="verdict-line">
      <strong>Option 1 (Playfair):</strong> Best keepsake letter aesthetic with editorial poise.
    </div>
  </div>

</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  // Wait for Google web fonts to be completely ready
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  
  // Extra pause for full antialiasing and subpixel render
  await new Promise(resolve => setTimeout(resolve, 800));

  await page.screenshot({
    path: OUTPUT_PATH,
    clip: {
      x: 0,
      y: 0,
      width: 393,
      height: 852
    }
  });

  console.log(`Successfully captured comparison screenshot to: ${OUTPUT_PATH}`);
  await browser.close();
}

generateFontComparison().catch(err => {
  console.error('Error generating font comparison:', err);
  process.exit(1);
});
