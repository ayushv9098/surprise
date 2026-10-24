import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const html = `<!DOCTYPE html>
<html>
<head>
<style>
body { background: #FFFFFF; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; display: flex; flex-direction: column; gap: 30px; }
.nav-row { display: flex; align-items: center; gap: 10px; }
.brand-name { font-weight: 700; font-size: 20px; color: #0F172A; letter-spacing: -0.025em; }
</style>
</head>
<body>
  <!-- Light Navbar -->
  <div class="nav-row">
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E11D48" />
          <stop offset="55%" stop-color="#BE185D" />
          <stop offset="100%" stop-color="#7C3AED" />
        </linearGradient>
      </defs>
      <path d="M 22 4 V 22 C 22 25.8 18.8 28 14 28 C 8.5 28 5 23.5 5 17 C 5 11.8 8 9.5 11 9.5 C 12.8 9.5 13.8 11.2 14 13 C 14.2 11.2 15.2 9.5 17 9.5 C 20 9.5 22 12 22 16.5"
            stroke="url(#dg)" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="brand-name">Dearly</span>
  </div>

  <!-- Pure Architectural Dark version -->
  <div class="nav-row">
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 22 4 V 22 C 22 25.8 18.8 28 14 28 C 8.5 28 5 23.5 5 17 C 5 11.8 8 9.5 11 9.5 C 12.8 9.5 13.8 11.2 14 13 C 14.2 11.2 15.2 9.5 17 9.5 C 20 9.5 22 12 22 16.5"
            stroke="#0F172A" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="brand-name">Dearly</span>
  </div>
</body>
</html>`;

fs.writeFileSync('D:\\avprojects\\surprise-builder\\test-render-32.html', html);

async function run() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html);
  await page.screenshot({ path: 'D:\\avprojects\\surprise-builder\\test-render-32.png' });
  await browser.close();
  console.log('Saved test-render-32.png!');
}

run().catch(console.error);
