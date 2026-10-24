import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function generateComparison() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // 1. Outfit 20px
  await page.evaluate(() => {
    const span = document.querySelector('header button span');
    span.className = "font-['Outfit'] font-bold text-[20px] tracking-tight text-slate-950";
    span.style = '';
  });
  const outfitBuffer = await page.screenshot({
    clip: { x: 0, y: 0, width: 393, height: 320 }
  });

  // 2. Playfair Display 21px
  await page.evaluate(() => {
    const span = document.querySelector('header button span');
    span.className = "font-['Playfair_Display'] font-bold text-[21px] tracking-tight text-slate-900";
    span.style = '';
  });
  const playfairBuffer = await page.screenshot({
    clip: { x: 0, y: 0, width: 393, height: 320 }
  });

  // 3. Outfit 20.5px subtle tracking
  await page.evaluate(() => {
    const span = document.querySelector('header button span');
    span.className = "font-['Outfit'] font-extrabold text-[20.5px] tracking-[-0.025em] text-slate-950 leading-none select-none";
    span.style = '';
  });
  const outfitRefinedBuffer = await page.screenshot({
    clip: { x: 0, y: 0, width: 393, height: 320 }
  });

  // 4. Playfair 21px refined
  await page.evaluate(() => {
    const span = document.querySelector('header button span');
    span.className = "font-['Playfair_Display'] font-bold text-[21px] tracking-tight text-slate-900 leading-none select-none";
    span.style = '';
  });
  const playfairRefinedBuffer = await page.screenshot({
    clip: { x: 0, y: 0, width: 393, height: 320 }
  });

  fs.writeFileSync('D:/avprojects/surprise-builder/test/outfit.png', outfitBuffer);
  fs.writeFileSync('D:/avprojects/surprise-builder/test/playfair.png', playfairBuffer);
  fs.writeFileSync('D:/avprojects/surprise-builder/test/outfit-refined.png', outfitRefinedBuffer);
  fs.writeFileSync('D:/avprojects/surprise-builder/test/playfair-refined.png', playfairRefinedBuffer);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Navbar Typography Comparison</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f172a; color: white; padding: 24px; text-align: center; }
    .grid { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; }
    .card { background: #1e293b; border-radius: 12px; padding: 16px; width: 420px; text-align: left; }
    h2 { font-size: 16px; margin: 0 0 10px 0; color: #38bdf8; }
    p { font-size: 12px; color: #94a3b8; margin: 0 0 12px 0; }
    img { width: 100%; border-radius: 8px; border: 1px solid #334155; }
  </style>
</head>
<body>
  <h1>Dearly Navbar Mobile Typography QA (393px)</h1>
  <div class="grid">
    <div class="card">
      <h2>Option A: Outfit (font-bold 20px)</h2>
      <p>Clean modern luxury sans-serif, crisp geometric legibility on small screens</p>
      <img src="outfit.png" />
    </div>
    <div class="card">
      <h2>Option B: Playfair Display (font-bold 21px)</h2>
      <p>Romantic editorial serif, luxurious magazine keepsake branding</p>
      <img src="playfair.png" />
    </div>
    <div class="card">
      <h2>Option C: Outfit Refined (font-extrabold 20.5px tracking-[-0.025em])</h2>
      <p>Premium modern tech-luxury, perfectly balanced weight next to 2.4px logo stroke</p>
      <img src="outfit-refined.png" />
    </div>
    <div class="card">
      <h2>Option D: Playfair Display Refined (font-bold 21px leading-none)</h2>
      <p>Editorial luxury serif with optical vertical centering</p>
      <img src="playfair-refined.png" />
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync('D:/avprojects/surprise-builder/test/font-comparison.html', html);
  console.log('Generated test/font-comparison.html');
  await browser.close();
}

generateComparison().catch(console.error);
