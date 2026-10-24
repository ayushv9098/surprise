import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = 'D:\\avprojects\\surprise-builder';

// Let's create 5 distinct, world-class vector designs in a test HTML page
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dearly Logo Exploration</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #F8FAFC;
      color: #0F172A;
      padding: 40px;
      margin: 0;
    }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
    p.subtitle { color: #64748B; margin-bottom: 32px; font-size: 15px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; }
    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .card-title { font-weight: 600; font-size: 16px; margin-bottom: 4px; }
    .card-desc { font-size: 13px; color: #64748B; margin-bottom: 20px; min-height: 38px; }
    .preview-box {
      background: #FFFFFF;
      border: 1px solid #F1F5F9;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .preview-box.dark {
      background: #0F172A;
      border-color: #1E293B;
      color: #FFFFFF;
    }
    .nav-sim {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-text {
      font-weight: 700;
      font-size: 18px;
      letter-spacing: -0.02em;
    }
    .icon-sizes {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #F1F5F9;
    }
    .size-label { font-size: 11px; color: #94A3B8; text-align: center; }
  </style>
</head>
<body>
  <h1>Dearly — Vector Logo Explorations</h1>
  <p class="subtitle">Comparing standalone vector marks in navbar context (light & dark) and favicon scales.</p>

  <div class="grid">

    <!-- CONCEPT 1: Continuous Ribbon Heart-D (Gradient) -->
    <div class="card">
      <div class="card-title">Concept 1: Continuous Ribbon Heart 'd'</div>
      <div class="card-desc">Single flowing line forming ascender stem and heart bowl. Romantic Rose-to-Violet gradient.</div>
      
      <div class="preview-box">
        <div class="nav-sim">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E11D48"/>
                <stop offset="50%" stop-color="#BE185D"/>
                <stop offset="100%" stop-color="#7C3AED"/>
              </linearGradient>
            </defs>
            <!-- Continuous Ribbon: Stem down, loop around heart bowl, back up to ascender -->
            <path d="M34 6 V34 C34 39 30 42 24 42 C16 42 10 36 10 28 C10 22 13 16 19 16 C23 16 26 18.5 28 22 C30 18.5 33 16 34 16"
                  stroke="url(#g1)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text" style="color: #0F172A;">Dearly</span>
        </div>
        <span style="font-size: 12px; color: #10B981; font-weight: 500;">Navbar (Light)</span>
      </div>

      <div class="preview-box dark">
        <div class="nav-sim">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <use href="#c1-svg"/>
            <defs>
              <linearGradient id="g1-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FB7185"/>
                <stop offset="100%" stop-color="#A78BFA"/>
              </linearGradient>
            </defs>
            <path d="M34 6 V34 C34 39 30 42 24 42 C16 42 10 36 10 28 C10 22 13 16 19 16 C23 16 26 18.5 28 22 C30 18.5 33 16 34 16"
                  stroke="url(#g1-dark)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text" style="color: #FFFFFF;">Dearly</span>
        </div>
        <span style="font-size: 12px; color: #94A3B8;">Navbar (Dark)</span>
      </div>
    </div>

    <!-- CONCEPT 2: Sculpted Heart-Knot 'd' (Continuous Möbius Path) -->
    <div class="card">
      <div class="card-title">Concept 2: The Keepsake Knot 'd'</div>
      <div class="card-desc">Symmetrical heart bowl with right lobe ascending effortlessly into the vertical stem.</div>
      
      <div class="preview-box">
        <div class="nav-sim">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E11D48"/>
                <stop offset="100%" stop-color="#6366F1"/>
              </linearGradient>
            </defs>
            <!-- Start at stem top (34, 6), down to (34, 30), heart cusp (22, 42), left lobe up to (10, 22), notch at (22, 22), right lobe joins stem -->
            <path d="M34 6 V34 C34 39 30.5 42 25 42 C17 42 10 36 10 27 C10 19.5 15.5 15 21.5 15 C26 15 29.5 18 31 22 C32.5 17 34 11 34 6 Z"
                  fill="url(#g2)" fill-rule="evenodd"/>
          </svg>
          <span class="brand-text" style="color: #0F172A;">Dearly</span>
        </div>
        <span style="font-size: 12px; color: #10B981; font-weight: 500;">Navbar (Light)</span>
      </div>
    </div>

    <!-- CONCEPT 3: The Interlocking Keepsake Ribbon (Linear/Raycast grade dual facet) -->
    <div class="card">
      <div class="card-title">Concept 3: Interlocking Keepsake Ribbons</div>
      <div class="card-desc">Two fluid overlapping ribbon segments forming an unmistakable 'd' + heart with depth.</div>
      
      <div class="preview-box">
        <div class="nav-sim">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g3a" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F43F5E"/>
                <stop offset="100%" stop-color="#E11D48"/>
              </linearGradient>
              <linearGradient id="g3b" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#8B5CF6"/>
                <stop offset="100%" stop-color="#6D28D9"/>
              </linearGradient>
            </defs>
            <!-- Vertical Ascender Stem -->
            <rect x="31" y="6" width="6" height="34" rx="3" fill="url(#g3b)"/>
            <!-- Heart Bowl Ribbon overlapping stem -->
            <path d="M34 22 C34 16 28 14 23 14 C15 14 10 20 10 28 C10 36 17 42 24 42 C29 42 33 39 34 35"
                  stroke="url(#g3a)" stroke-width="5" stroke-linecap="round"/>
            <path d="M23 14 C27 18 29 23 34 26"
                  stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
          </svg>
          <span class="brand-text" style="color: #0F172A;">Dearly</span>
        </div>
        <span style="font-size: 12px; color: #10B981; font-weight: 500;">Navbar (Light)</span>
      </div>
    </div>

    <!-- CONCEPT 4: Pure Bélo-d (Pure Single-Stroke Iconic Monoline) -->
    <div class="card">
      <div class="card-title">Concept 4: Iconic Heart Ribbon Loop</div>
      <div class="card-desc">Mathematically harmonized golden-ratio curve forming the letter 'd' with an integrated heart.</div>
      
      <div class="preview-box">
        <div class="nav-sim">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF2E63"/>
                <stop offset="60%" stop-color="#E11D48"/>
                <stop offset="100%" stop-color="#7C3AED"/>
              </linearGradient>
            </defs>
            <!-- The loop: Ascender top (34, 7), down stem to (34, 33), loops around bottom base to (23, 41), up outer heart lobe (10, 31) -> (10, 21) -> (17, 15) -> heart notch dip (23, 19) -> inner right lobe (29, 15) -> connects smoothly back to stem at (34, 20) -->
            <path d="M34 7 V33 C34 38 29.5 41.5 23 41.5 C15.5 41.5 9.5 35.5 9.5 27 C9.5 19.5 15 15 21.5 15 C25 15 27.5 17 29 19.5 C30.5 17 33 15 34 15"
                  stroke="url(#g4)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text" style="color: #0F172A;">Dearly</span>
        </div>
        <span style="font-size: 12px; color: #10B981; font-weight: 500;">Navbar (Light)</span>
      </div>

      <div class="preview-box dark">
        <div class="nav-sim">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34 7 V33 C34 38 29.5 41.5 23 41.5 C15.5 41.5 9.5 35.5 9.5 27 C9.5 19.5 15 15 21.5 15 C25 15 27.5 17 29 19.5 C30.5 17 33 15 34 15"
                  stroke="url(#g4)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="brand-text" style="color: #FFFFFF;">Dearly</span>
        </div>
        <span style="font-size: 12px; color: #94A3B8;">Navbar (Dark)</span>
      </div>
    </div>

    <!-- CONCEPT 5: Geometric Origami Keepsake Envelope / Letter-D -->
    <div class="card">
      <div class="card-title">Concept 5: The Keepsake Envelope 'd'</div>
      <div class="card-desc">An iconic love-letter seal fold forming a faceted letter 'd' and keepsake envelope flap.</div>
      
      <div class="preview-box">
        <div class="nav-sim">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g5a" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E11D48"/>
                <stop offset="100%" stop-color="#BE185D"/>
              </linearGradient>
              <linearGradient id="g5b" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#BE185D"/>
                <stop offset="100%" stop-color="#7C3AED"/>
              </linearGradient>
            </defs>
            <!-- Vertical Ascender -->
            <path d="M31 7 C31 5.34 32.34 4 34 4 C35.66 4 37 5.34 37 7 V37 C37 38.66 35.66 40 34 40 C32.34 40 31 38.66 31 37 Z" fill="url(#g5b)"/>
            <!-- Faceted Heart Envelope Bowl -->
            <path d="M31 18 L19 28 L11 20 C9 24 10 32 17 38 C23 42 31 40 31 37 V18 Z" fill="url(#g5a)" opacity="0.95"/>
            <!-- Envelope Flap / Heart facet -->
            <path d="M31 18 L19 28 L31 37 Z" fill="#FFFFFF" opacity="0.2"/>
          </svg>
          <span class="brand-text" style="color: #0F172A;">Dearly</span>
        </div>
        <span style="font-size: 12px; color: #10B981; font-weight: 500;">Navbar (Light)</span>
      </div>
    </div>

  </div>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT, 'scratch-logo-test.html'), htmlContent, 'utf8');

async function testScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(ROOT, 'scratch-logo-test.html').replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.screenshot({ path: path.join(ROOT, 'scratch-logo-preview.png'), fullPage: true });
  await browser.close();
  console.log('Generated scratch-logo-preview.png!');
}

testScreenshots().catch(console.error);
