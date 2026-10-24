import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = 'D:\\avprojects\\surprise-builder';

// Test 4 variations of this harmonious geometry
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dearly Harmonious Geometry Studies</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
      background: #F8FAFC;
      color: #0F172A;
      padding: 40px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .card {
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.04);
    }
    h2 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    p.desc { font-size: 13px; color: #64748B; margin-bottom: 20px; }
    .nav-box {
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .nav-box.dark {
      background: #090D16;
      border-color: #1E293B;
      color: white;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-text {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.03em;
    }
    .dark .brand-text { color: white; }
    .scales {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #F1F5F9;
      padding: 16px 24px;
      border-radius: 12px;
      margin-top: 16px;
    }
    .scale-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .scale-item span { font-size: 11px; color: #64748B; font-weight: 600; }
    .favicon-squircle {
      width: 44px;
      height: 44px;
      border-radius: 11px;
      background: #090D16;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }
  </style>
</head>
<body>
  <div style="max-width: 1200px; margin: 0 auto 32px;">
    <h1 style="font-size: 26px; font-weight: 800; letter-spacing: -0.03em;">Dearly — Symmetrical Heart-Bowl 'd' Logo</h1>
    <p style="color: #64748B; font-size: 15px;">Golden-ratio curves where both heart lobes are mathematically equal and the right lobe ascends into the letter 'd' stem.</p>
  </div>

  <div class="grid">

    <!-- STUDY 1: Fluid Continuous Ribbon with Center Notch -->
    <div class="card">
      <h2>Study 1: Continuous Monoline Loop</h2>
      <p class="desc">Stem extends down, sweeps around base, rises into left lobe, dips into center notch, arches over right lobe and connects to stem.</p>
      
      <div class="nav-box">
        <div class="brand">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="g-study1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E11D48"/>
                <stop offset="45%" stop-color="#BE185D"/>
                <stop offset="100%" stop-color="#7C3AED"/>
              </linearGradient>
            </defs>
            <!-- Symmetrical Heart Bowl:
                 Left lobe peak at x=15.5, y=14
                 Center notch at x=21.5, y=20
                 Right lobe peak at x=27.5, y=14
                 Stem at x=34 (6 to 34)
                 Bottom curve centered at x=21.5, y=41.5
            -->
            <path d="M 34 6 
                     V 33 
                     C 34 38.5, 29 42, 21.5 42 
                     C 14 42, 9 36, 9 27 
                     C 9 19, 12 14, 15.5 14 
                     C 18.5 14, 20.5 16.5, 21.5 19.5 
                     C 22.5 16.5, 24.5 14, 27.5 14 
                     C 31 14, 34 19, 34 27"
                  stroke="url(#g-study1)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text">Dearly</span>
        </div>
        <span style="font-size: 13px; color: #10B981; font-weight: 600;">Navbar (Light)</span>
      </div>

      <div class="nav-box dark">
        <div class="brand">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="g-study1-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FB7185"/>
                <stop offset="100%" stop-color="#A78BFA"/>
              </linearGradient>
            </defs>
            <path d="M 34 6 
                     V 33 
                     C 34 38.5, 29 42, 21.5 42 
                     C 14 42, 9 36, 9 27 
                     C 9 19, 12 14, 15.5 14 
                     C 18.5 14, 20.5 16.5, 21.5 19.5 
                     C 22.5 16.5, 24.5 14, 27.5 14 
                     C 31 14, 34 19, 34 27"
                  stroke="url(#g-study1-dark)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text">Dearly</span>
        </div>
        <span style="font-size: 13px; color: #94A3B8;">Navbar (Dark)</span>
      </div>

      <div class="scales">
        <div class="scale-item">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M 34 6 V 33 C 34 38.5, 29 42, 21.5 42 C 14 42, 9 36, 9 27 C 9 19, 12 14, 15.5 14 C 18.5 14, 20.5 16.5, 21.5 19.5 C 22.5 16.5, 24.5 14, 27.5 14 C 31 14, 34 19, 34 27"
                  stroke="#E11D48" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>18px</span>
        </div>
        <div class="scale-item">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <path d="M 34 6 V 33 C 34 38.5, 29 42, 21.5 42 C 14 42, 9 36, 9 27 C 9 19, 12 14, 15.5 14 C 18.5 14, 20.5 16.5, 21.5 19.5 C 22.5 16.5, 24.5 14, 27.5 14 C 31 14, 34 19, 34 27"
                  stroke="url(#g-study1)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>28px Nav</span>
        </div>
        <div class="scale-item">
          <div class="favicon-squircle">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <path d="M 34 6 V 33 C 34 38.5, 29 42, 21.5 42 C 14 42, 9 36, 9 27 C 9 19, 12 14, 15.5 14 C 18.5 14, 20.5 16.5, 21.5 19.5 C 22.5 16.5, 24.5 14, 27.5 14 C 31 14, 34 19, 34 27"
                    stroke="#FB7185" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span>Favicon</span>
        </div>
      </div>
    </div>

    <!-- STUDY 2: The Pure Möbius Keepsake Loop (Closed Endless Path) -->
    <div class="card">
      <h2>Study 2: The Endless Keepsake Loop (Closed Ribbon)</h2>
      <p class="desc">A single closed path where the stem flows upward, loops over the crown, down the heart notch and under the base.</p>
      
      <div class="nav-box">
        <div class="brand">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="g-study2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F43F5E"/>
                <stop offset="60%" stop-color="#E11D48"/>
                <stop offset="100%" stop-color="#6D28D9"/>
              </linearGradient>
            </defs>
            <!-- Continuous loop closing back at ascender top (34, 6) -->
            <path d="M 34 6
                     V 33
                     C 34 39, 29 42.5, 21.5 42.5
                     C 13.5 42.5, 8.5 36.5, 8.5 27
                     C 8.5 18, 12.5 13.5, 16 13.5
                     C 19 13.5, 21 16, 21.5 19
                     C 22 16, 24 13.5, 27 13.5
                     C 30.5 13.5, 34 17, 34 6 Z"
                  fill="url(#g-study2)" fill-rule="evenodd"/>
          </svg>
          <span class="brand-text">Dearly</span>
        </div>
        <span style="font-size: 13px; color: #10B981; font-weight: 600;">Navbar (Light)</span>
      </div>

      <div class="nav-box dark">
        <div class="brand">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="g-study2-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FDA4AF"/>
                <stop offset="100%" stop-color="#C084FC"/>
              </linearGradient>
            </defs>
            <path d="M 34 6
                     V 33
                     C 34 39, 29 42.5, 21.5 42.5
                     C 13.5 42.5, 8.5 36.5, 8.5 27
                     C 8.5 18, 12.5 13.5, 16 13.5
                     C 19 13.5, 21 16, 21.5 19
                     C 22 16, 24 13.5, 27 13.5
                     C 30.5 13.5, 34 17, 34 6 Z"
                  fill="url(#g-study2-dark)" fill-rule="evenodd"/>
          </svg>
          <span class="brand-text">Dearly</span>
        </div>
        <span style="font-size: 13px; color: #94A3B8;">Navbar (Dark)</span>
      </div>

      <div class="scales">
        <div class="scale-item">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M 34 6 V 33 C 34 39, 29 42.5, 21.5 42.5 C 13.5 42.5, 8.5 36.5, 8.5 27 C 8.5 18, 12.5 13.5, 16 13.5 C 19 13.5, 21 16, 21.5 19 C 22 16, 24 13.5, 27 13.5 C 30.5 13.5, 34 17, 34 6 Z"
                  fill="#E11D48" fill-rule="evenodd"/>
          </svg>
          <span>18px</span>
        </div>
        <div class="scale-item">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <use href="#g-study2"/>
            <path d="M 34 6 V 33 C 34 39, 29 42.5, 21.5 42.5 C 13.5 42.5, 8.5 36.5, 8.5 27 C 8.5 18, 12.5 13.5, 16 13.5 C 19 13.5, 21 16, 21.5 19 C 22 16, 24 13.5, 27 13.5 C 30.5 13.5, 34 17, 34 6 Z"
                  fill="url(#g-study2)" fill-rule="evenodd"/>
          </svg>
          <span>28px Nav</span>
        </div>
        <div class="scale-item">
          <div class="favicon-squircle">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <path d="M 34 6 V 33 C 34 39, 29 42.5, 21.5 42.5 C 13.5 42.5, 8.5 36.5, 8.5 27 C 8.5 18, 12.5 13.5, 16 13.5 C 19 13.5, 21 16, 21.5 19 C 22 16, 24 13.5, 27 13.5 C 30.5 13.5, 34 17, 34 6 Z"
                    fill="#FDA4AF" fill-rule="evenodd"/>
            </svg>
          </div>
          <span>Favicon</span>
        </div>
      </div>
    </div>

    <!-- STUDY 3: The Interlocking Silk Ribbon (Dual-Tone Tactile Keepsake) -->
    <div class="card">
      <h2>Study 3: Interlocking Silk Ribbon 'd'</h2>
      <p class="desc">Two intertwining gradient ribbon paths creating tactile physical keepsake depth, as if tying a luxury package.</p>
      
      <div class="nav-box">
        <div class="brand">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="g-s3-stem" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#E11D48"/>
                <stop offset="100%" stop-color="#7C3AED"/>
              </linearGradient>
              <linearGradient id="g-s3-heart" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF385C"/>
                <stop offset="100%" stop-color="#BE185D"/>
              </linearGradient>
            </defs>
            <!-- Stem Pillar -->
            <rect x="32" y="6" width="4.5" height="34" rx="2.25" fill="url(#g-s3-stem)"/>
            <!-- Heart Ribbon Crossing Front & Back -->
            <path d="M 34.25 18
                     C 30 14, 25 14, 21.5 18
                     C 18 14, 13 14, 9.5 18
                     C 6 22, 6 28, 9.5 33
                     C 13 38, 17 41.5, 21.5 41.5
                     C 27 41.5, 31 38, 34.25 33"
                  stroke="url(#g-s3-heart)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text">Dearly</span>
        </div>
        <span style="font-size: 13px; color: #10B981; font-weight: 600;">Navbar (Light)</span>
      </div>

      <div class="nav-box dark">
        <div class="brand">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <rect x="32" y="6" width="4.5" height="34" rx="2.25" fill="#A78BFA"/>
            <path d="M 34.25 18
                     C 30 14, 25 14, 21.5 18
                     C 18 14, 13 14, 9.5 18
                     C 6 22, 6 28, 9.5 33
                     C 13 38, 17 41.5, 21.5 41.5
                     C 27 41.5, 31 38, 34.25 33"
                  stroke="#FB7185" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text">Dearly</span>
        </div>
        <span style="font-size: 13px; color: #94A3B8;">Navbar (Dark)</span>
      </div>

      <div class="scales">
        <div class="scale-item">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <rect x="32" y="6" width="4.5" height="34" rx="2.25" fill="#7C3AED"/>
            <path d="M 34.25 18 C 30 14, 25 14, 21.5 18 C 18 14, 13 14, 9.5 18 C 6 22, 6 28, 9.5 33 C 13 38, 17 41.5, 21.5 41.5 C 27 41.5, 31 38, 34.25 33"
                  stroke="#E11D48" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>18px</span>
        </div>
        <div class="scale-item">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <rect x="32" y="6" width="4.5" height="34" rx="2.25" fill="url(#g-s3-stem)"/>
            <path d="M 34.25 18 C 30 14, 25 14, 21.5 18 C 18 14, 13 14, 9.5 18 C 6 22, 6 28, 9.5 33 C 13 38, 17 41.5, 21.5 41.5 C 27 41.5, 31 38, 34.25 33"
                  stroke="url(#g-s3-heart)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>28px Nav</span>
        </div>
        <div class="scale-item">
          <div class="favicon-squircle">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <rect x="32" y="6" width="4.5" height="34" rx="2.25" fill="#A78BFA"/>
              <path d="M 34.25 18 C 30 14, 25 14, 21.5 18 C 18 14, 13 14, 9.5 18 C 6 22, 6 28, 9.5 33 C 13 38, 17 41.5, 21.5 41.5 C 27 41.5, 31 38, 34.25 33"
                    stroke="#FB7185" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span>Favicon</span>
        </div>
      </div>
    </div>

    <!-- STUDY 4: The Signature "Dearly Bélo" Ribbon (Unbroken Single Stroke) -->
    <div class="card">
      <h2>Study 4: The Signature Bélo 'd' (Unbroken Flow)</h2>
      <p class="desc">A single continuous ribbon line that sweeps down from ascender, forms the heart bowl, and finishes in a gentle upward inner flourish.</p>
      
      <div class="nav-box">
        <div class="brand">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="g-s4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E11D48"/>
                <stop offset="55%" stop-color="#BE185D"/>
                <stop offset="100%" stop-color="#6366F1"/>
              </linearGradient>
            </defs>
            <path d="M 34 6 
                     V 34 
                     C 34 39, 29.5 42, 22.5 42 
                     C 14 42, 8.5 35.5, 8.5 26.5 
                     C 8.5 18, 13.5 13.5, 18.5 13.5 
                     C 22.5 13.5, 25.5 16, 27 19.5 
                     C 28.5 16, 31.5 13.5, 34 13.5"
                  stroke="url(#g-s4)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text">Dearly</span>
        </div>
        <span style="font-size: 13px; color: #10B981; font-weight: 600;">Navbar (Light)</span>
      </div>

      <div class="nav-box dark">
        <div class="brand">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="g-s4-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FB7185"/>
                <stop offset="100%" stop-color="#818CF8"/>
              </linearGradient>
            </defs>
            <path d="M 34 6 
                     V 34 
                     C 34 39, 29.5 42, 22.5 42 
                     C 14 42, 8.5 35.5, 8.5 26.5 
                     C 8.5 18, 13.5 13.5, 18.5 13.5 
                     C 22.5 13.5, 25.5 16, 27 19.5 
                     C 28.5 16, 31.5 13.5, 34 13.5"
                  stroke="url(#g-s4-dark)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text">Dearly</span>
        </div>
        <span style="font-size: 13px; color: #94A3B8;">Navbar (Dark)</span>
      </div>

      <div class="scales">
        <div class="scale-item">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
            <path d="M 34 6 V 34 C 34 39, 29.5 42, 22.5 42 C 14 42, 8.5 35.5, 8.5 26.5 C 8.5 18, 13.5 13.5, 18.5 13.5 C 22.5 13.5, 25.5 16, 27 19.5 C 28.5 16, 31.5 13.5, 34 13.5"
                  stroke="#E11D48" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>18px</span>
        </div>
        <div class="scale-item">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <path d="M 34 6 V 34 C 34 39, 29.5 42, 22.5 42 C 14 42, 8.5 35.5, 8.5 26.5 C 8.5 18, 13.5 13.5, 18.5 13.5 C 22.5 13.5, 25.5 16, 27 19.5 C 28.5 16, 31.5 13.5, 34 13.5"
                  stroke="url(#g-s4)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>28px Nav</span>
        </div>
        <div class="scale-item">
          <div class="favicon-squircle">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <path d="M 34 6 V 34 C 34 39, 29.5 42, 22.5 42 C 14 42, 8.5 35.5, 8.5 26.5 C 8.5 18, 13.5 13.5, 18.5 13.5 C 22.5 13.5, 25.5 16, 27 19.5 C 28.5 16, 31.5 13.5, 34 13.5"
                    stroke="#FB7185" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span>Favicon</span>
        </div>
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'scratch-perfect-curves.html'), htmlContent, 'utf8');

async function render() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 1100, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(ROOT, 'scratch-perfect-curves.html').replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.screenshot({ path: path.join(ROOT, 'scratch-perfect-curves.png'), fullPage: true });
  await browser.close();
  console.log('Rendered scratch-perfect-curves.png!');
}

render().catch(console.error);
