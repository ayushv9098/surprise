import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function previewLogos() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 700 });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Outfit:wght@600;700&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 40px;
          background: #F8FAFC;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0F172A;
        }
        h2 { font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #1E293B; }
        .row {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 600px;
        }
        .nav-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .brand-text {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #0F172A;
        }
        .tag {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          background: #F1F5F9;
          color: #64748B;
        }
      </style>
    </head>
    <body>
      <h2>Dearly — Standalone Vector Logo Options (Clean White Navbar, No Black Box, No Emojis)</h2>

      <div class="row">
        <!-- Option 1: Continuous Ribbon Monogram 'D' with Heart Loop (Rose-Wine Gradient) -->
        <div class="nav-card">
          <div class="brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F43F5E" />
                  <stop offset="100%" stop-color="#9333EA" />
                </linearGradient>
              </defs>
              <!-- Architectural Monogram D & Heart loop -->
              <path d="M7 6C7 4.89543 7.89543 4 9 4H16C22.6274 4 27 8.47715 27 16C27 23.5228 22.6274 28 16 28H9C7.89543 28 7 27.1046 7 26V6Z" stroke="url(#g1)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              <!-- Inner Heart Accent -->
              <path d="M15 12C13.8 10.6 11.2 11.2 11.2 13.5C11.2 16.2 16 19.5 16 19.5C16 19.5 20.8 16.2 20.8 13.5C20.8 11.2 18.2 10.6 17 12L16 13.2L15 12Z" fill="url(#g1)" />
            </svg>
            <span class="brand-text">Dearly</span>
          </div>
          <span class="tag">Option 1: Modern 'D' + Heart Seal</span>
        </div>

        <!-- Option 2: Architectural Origami Fold / Love Letter (Rose Gold / Coral) -->
        <div class="nav-card">
          <div class="brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FB7185" />
                  <stop offset="50%" stop-color="#E11D48" />
                  <stop offset="100%" stop-color="#BE123C" />
                </linearGradient>
              </defs>
              <!-- Letter envelope outline with heart apex -->
              <rect x="4" y="6" width="24" height="20" rx="4" stroke="url(#g2)" stroke-width="2.5" />
              <path d="M5.5 8L14.6 16.2C15.4 16.9 16.6 16.9 17.4 16.2L26.5 8" stroke="url(#g2)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <!-- Micro Heart Seal -->
              <path d="M16 14.5C15.2 13.5 13.5 13.8 13.5 15.2C13.5 17 16 19 16 19C16 19 18.5 17 18.5 15.2C18.5 13.8 16.8 13.5 16 14.5Z" fill="url(#g2)" />
            </svg>
            <span class="brand-text">Dearly</span>
          </div>
          <span class="tag">Option 2: Minimal Keepsake Envelope</span>
        </div>

        <!-- Option 3: Continuous Dual Heart Loop / Infinity Knot (Locket & Cartier Tier) -->
        <div class="nav-card">
          <div class="brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#E11D48" />
                  <stop offset="100%" stop-color="#4F46E5" />
                </linearGradient>
              </defs>
              <path d="M16 27C16 27 6 20.5 6 12.8C6 7.8 10 4.8 14.5 5.8C15.1 6 15.6 6.3 16 6.7C16.4 6.3 16.9 6 17.5 5.8C22 4.8 26 7.8 26 12.8C26 20.5 16 27 16 27Z" stroke="url(#g3)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="16" cy="14" r="2.5" fill="url(#g3)" />
            </svg>
            <span class="brand-text">Dearly</span>
          </div>
          <span class="tag">Option 3: Intertwined Keepsake Knot</span>
        </div>

        <!-- Option 4: Pure Minimalist Monogram 'd' (Lowercase Tech-Chic like Linear / Airbnb) -->
        <div class="nav-card">
          <div class="brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#0F172A" />
                  <stop offset="100%" stop-color="#334155" />
                </linearGradient>
                <linearGradient id="g4-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F43F5E" />
                  <stop offset="100%" stop-color="#E11D48" />
                </linearGradient>
              </defs>
              <!-- Clean modern 'd' with coral heart dot -->
              <path d="M21 4V26M21 26C21 26 19.5 28 15 28C9.5 28 6 23.5 6 16.5C6 9.5 9.5 5 15 5C19.5 5 21 7 21 7" stroke="url(#g4)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M14 13C13.2 12 11.5 12.3 11.5 13.8C11.5 15.6 14 17.5 14 17.5C14 17.5 16.5 15.6 16.5 13.8C16.5 12.3 14.8 12 14 13Z" fill="url(#g4-accent)" />
            </svg>
            <span class="brand-text">Dearly</span>
          </div>
          <span class="tag">Option 4: Tech-Chic Monogram 'd'</span>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  const outPath = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\qa-navbar-logo-options.png';
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved options screenshot to:', outPath);
  await browser.close();
}

previewLogos();
