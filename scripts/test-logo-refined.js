import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = 'D:\\avprojects\\surprise-builder';

// Let's create refined variations
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dearly Refined Logo Studies</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif;
      background: #F1F5F9;
      color: #0F172A;
      padding: 48px 32px;
    }
    .header { max-width: 1200px; margin: 0 auto 36px; }
    h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 6px; }
    p { color: #64748B; font-size: 15px; }
    .grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 20px -4px rgba(0,0,0,0.05);
    }
    .card-head { margin-bottom: 16px; }
    .card-title { font-size: 17px; font-weight: 700; color: #0F172A; }
    .card-subtitle { font-size: 13px; color: #64748B; margin-top: 3px; }
    
    /* Navbar Simulator */
    .nav-mock {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      height: 56px;
      padding: 0 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .brand-name {
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: #0F172A;
    }
    .nav-right-mock {
      display: flex;
      gap: 8px;
    }
    .nav-btn-mock {
      font-size: 13px;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 8px;
      background: #0F172A;
      color: white;
    }

    /* Dark Navbar Simulator */
    .nav-mock.dark {
      background: #0B0F17;
      border-color: #1E293B;
    }
    .nav-mock.dark .brand-name {
      color: #F8FAFC;
    }

    /* Multi-scale Preview */
    .scales {
      background: #F8FAFC;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 14px;
    }
    .scale-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .scale-label { font-size: 11px; font-weight: 600; color: #94A3B8; text-transform: uppercase; }

    /* Favicon squircle preview */
    .favicon-preview {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: #0F172A;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Dearly — Master Vector Craftsmanship</h1>
    <p>Testing world-class standalone brand marks in navbar contexts (Light & Dark) and multi-resolution scales.</p>
  </div>

  <div class="grid">

    <!-- VARIATION A: The "Dearly Ribbon Bélo" -->
    <div class="card">
      <div class="card-head">
        <div class="card-title">Variation A: Continuous Bélo Heart-D (Rose to Violet)</div>
        <div class="card-subtitle">Harmonic golden-ratio single line loop. Warm crimson rose into royal purple.</div>
      </div>

      <div class="nav-mock">
        <div class="nav-brand">
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="vA-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F43F5E"/>
                <stop offset="50%" stop-color="#E11D48"/>
                <stop offset="100%" stop-color="#7C3AED"/>
              </linearGradient>
            </defs>
            <path d="M34 6 V32 C34 37.5 29.5 41.5 23 41.5 C15 41.5 9 35.5 9 27 C9 19.5 14.5 15 21 15 C24.5 15 27.5 16.8 29 19.5 C30.5 16.8 33 15 34 15"
                  stroke="url(#vA-grad)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-name">Dearly</span>
        </div>
        <div class="nav-right-mock"><div class="nav-btn-mock">Get Started</div></div>
      </div>

      <div class="nav-mock dark">
        <div class="nav-brand">
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="vA-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FB7185"/>
                <stop offset="100%" stop-color="#A78BFA"/>
              </linearGradient>
            </defs>
            <path d="M34 6 V32 C34 37.5 29.5 41.5 23 41.5 C15 41.5 9 35.5 9 27 C9 19.5 14.5 15 21 15 C24.5 15 27.5 16.8 29 19.5 C30.5 16.8 33 15 34 15"
                  stroke="url(#vA-dark)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-name">Dearly</span>
        </div>
      </div>

      <div class="scales">
        <div class="scale-item">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M34 6 V32 C34 37.5 29.5 41.5 23 41.5 C15 41.5 9 35.5 9 27 C9 19.5 14.5 15 21 15 C24.5 15 27.5 16.8 29 19.5 C30.5 16.8 33 15 34 15"
                  stroke="#E11D48" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="scale-label">18px</span>
        </div>
        <div class="scale-item">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <path d="M34 6 V32 C34 37.5 29.5 41.5 23 41.5 C15 41.5 9 35.5 9 27 C9 19.5 14.5 15 21 15 C24.5 15 27.5 16.8 29 19.5 C30.5 16.8 33 15 34 15"
                  stroke="url(#vA-grad)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="scale-label">28px Nav</span>
        </div>
        <div class="scale-item">
          <div class="favicon-preview">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <path d="M34 6 V32 C34 37.5 29.5 41.5 23 41.5 C15 41.5 9 35.5 9 27 C9 19.5 14.5 15 21 15 C24.5 15 27.5 16.8 29 19.5 C30.5 16.8 33 15 34 15"
                    stroke="#F43F5E" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="scale-label">Tab Icon</span>
        </div>
      </div>
    </div>

    <!-- VARIATION B: The "Architectural Keepsake Loop" (Möbius Ribbon Loop) -->
    <div class="card">
      <div class="card-head">
        <div class="card-title">Variation B: Möbius Ribbon Keepsake (Overlapping Depth)</div>
        <div class="card-subtitle">Loop forms the complete letter 'd' where the heart ribbon wraps behind the stem.</div>
      </div>

      <div class="nav-mock">
        <div class="nav-brand">
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="vB-stem" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#E11D48"/>
                <stop offset="100%" stop-color="#7C3AED"/>
              </linearGradient>
              <linearGradient id="vB-heart" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF477E"/>
                <stop offset="100%" stop-color="#9333EA"/>
              </linearGradient>
            </defs>
            <!-- Vertical Ascender Stem -->
            <rect x="32" y="6" width="4.5" height="34" rx="2.25" fill="url(#vB-stem)"/>
            <!-- Heart Ribbon Loop -->
            <path d="M32 18 C28.5 14.5 23.5 14 19 16.5 C13 19.8 9.5 26 10 32 C10.5 38 16 42 22 41 C27.5 40 31.5 36 32 32"
                  stroke="url(#vB-heart)" stroke-width="4.2" stroke-linecap="round"/>
            <path d="M19 16.5 C22.5 19 25.5 23 32 25"
                  stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.35"/>
          </svg>
          <span class="brand-name">Dearly</span>
        </div>
        <div class="nav-right-mock"><div class="nav-btn-mock">Get Started</div></div>
      </div>

      <div class="nav-mock dark">
        <div class="nav-brand">
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
            <rect x="32" y="6" width="4.5" height="34" rx="2.25" fill="#A78BFA"/>
            <path d="M32 18 C28.5 14.5 23.5 14 19 16.5 C13 19.8 9.5 26 10 32 C10.5 38 16 42 22 41 C27.5 40 31.5 36 32 32"
                  stroke="#FB7185" stroke-width="4.2" stroke-linecap="round"/>
          </svg>
          <span class="brand-name">Dearly</span>
        </div>
      </div>

      <div class="scales">
        <div class="scale-item">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <rect x="32" y="6" width="4.5" height="34" rx="2.25" fill="#7C3AED"/>
            <path d="M32 18 C28.5 14.5 23.5 14 19 16.5 C13 19.8 9.5 26 10 32 C10.5 38 16 42 22 41 C27.5 40 31.5 36 32 32"
                  stroke="#E11D48" stroke-width="4.5" stroke-linecap="round"/>
          </svg>
          <span class="scale-label">18px</span>
        </div>
        <div class="scale-item">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <use href="#vB-stem"/>
            <rect x="32" y="6" width="4.5" height="34" rx="2.25" fill="url(#vB-stem)"/>
            <path d="M32 18 C28.5 14.5 23.5 14 19 16.5 C13 19.8 9.5 26 10 32 C10.5 38 16 42 22 41 C27.5 40 31.5 36 32 32"
                  stroke="url(#vB-heart)" stroke-width="4.2" stroke-linecap="round"/>
          </svg>
          <span class="scale-label">28px Nav</span>
        </div>
        <div class="scale-item">
          <div class="favicon-preview">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <rect x="32" y="6" width="4.5" height="34" rx="2.25" fill="#A78BFA"/>
              <path d="M32 18 C28.5 14.5 23.5 14 19 16.5 C13 19.8 9.5 26 10 32 C10.5 38 16 42 22 41 C27.5 40 31.5 36 32 32"
                    stroke="#FB7185" stroke-width="4.2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="scale-label">Tab Icon</span>
        </div>
      </div>
    </div>

    <!-- VARIATION C: The "Solid Monogram with Sculpted Heart Counter" -->
    <div class="card">
      <div class="card-head">
        <div class="card-title">Variation C: Solid Architectural 'd' with Heart Counter</div>
        <div class="card-subtitle">Bold geometric lowercase 'd' whose negative space counter is a heartfelt heart.</div>
      </div>

      <div class="nav-mock">
        <div class="nav-brand">
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="vC-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E11D48"/>
                <stop offset="100%" stop-color="#6B21A8"/>
              </linearGradient>
            </defs>
            <!-- Solid 'd' path with heart cutout in evenodd fill -->
            <path d="M31 6 H38 V42 H31 V38.5 C28.5 41 24.5 42.5 20 42.5 C10 42.5 4 35 4 25 C4 15 10 7.5 20 7.5 C24.5 7.5 28.5 9 31 11.5 V6 Z
                     M21 16 C16 16 12 20 12 25 C12 30 16 34 21 34 C26 34 30 30 30 25 C30 20 26 16 21 16 Z"
                  fill="url(#vC-grad)" fill-rule="evenodd"/>
          </svg>
          <span class="brand-name">Dearly</span>
        </div>
        <div class="nav-right-mock"><div class="nav-btn-mock">Get Started</div></div>
      </div>
    </div>

    <!-- VARIATION D: The "Pure Continuous Love-Letter 'd'" (Fluid Calligraphic Monoline) -->
    <div class="card">
      <div class="card-head">
        <div class="card-title">Variation D: Fluid Keepsake Ribbon 'd'</div>
        <div class="card-subtitle">Smooth continuous sweep from heart lobe directly up into the stem.</div>
      </div>

      <div class="nav-mock">
        <div class="nav-brand">
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="vD-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF2E63"/>
                <stop offset="50%" stop-color="#E11D48"/>
                <stop offset="100%" stop-color="#4F46E5"/>
              </linearGradient>
            </defs>
            <!-- Starting at the heart base (22, 41), looping up left (8, 26), heart lobe (14, 14), notch (22, 20), right lobe flowing up to ascender (34, 6), down stem (34, 40) -->
            <path d="M34 6 V36 C34 40 30.5 42 24 42 C16 42 8.5 35 8.5 26.5 C8.5 18 15 13.5 21.5 13.5 C25.5 13.5 29 16 31 19.5"
                  stroke="url(#vD-grad)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-name">Dearly</span>
        </div>
        <div class="nav-right-mock"><div class="nav-btn-mock">Get Started</div></div>
      </div>

      <div class="nav-mock dark">
        <div class="nav-brand">
          <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="vD-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FDA4AF"/>
                <stop offset="100%" stop-color="#818CF8"/>
              </linearGradient>
            </defs>
            <path d="M34 6 V36 C34 40 30.5 42 24 42 C16 42 8.5 35 8.5 26.5 C8.5 18 15 13.5 21.5 13.5 C25.5 13.5 29 16 31 19.5"
                  stroke="url(#vD-dark)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-name">Dearly</span>
        </div>
      </div>

      <div class="scales">
        <div class="scale-item">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M34 6 V36 C34 40 30.5 42 24 42 C16 42 8.5 35 8.5 26.5 C8.5 18 15 13.5 21.5 13.5 C25.5 13.5 29 16 31 19.5"
                  stroke="#E11D48" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="scale-label">18px</span>
        </div>
        <div class="scale-item">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <path d="M34 6 V36 C34 40 30.5 42 24 42 C16 42 8.5 35 8.5 26.5 C8.5 18 15 13.5 21.5 13.5 C25.5 13.5 29 16 31 19.5"
                  stroke="url(#vD-grad)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="scale-label">28px Nav</span>
        </div>
        <div class="scale-item">
          <div class="favicon-preview">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <path d="M34 6 V36 C34 40 30.5 42 24 42 C16 42 8.5 35 8.5 26.5 C8.5 18 15 13.5 21.5 13.5 C25.5 13.5 29 16 31 19.5"
                    stroke="#FF2E63" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="scale-label">Tab Icon</span>
        </div>
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'scratch-logo-refined.html'), htmlContent, 'utf8');

async function testScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 1100, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(ROOT, 'scratch-logo-refined.html').replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.screenshot({ path: path.join(ROOT, 'scratch-logo-refined.png'), fullPage: true });
  await browser.close();
  console.log('Generated scratch-logo-refined.png successfully!');
}

testScreenshots().catch(console.error);
