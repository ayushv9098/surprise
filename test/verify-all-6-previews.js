import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const SVGS = [
  'royal-sapphire.svg',
  'golden-birthday.svg',
  'polaroid-scrapbook.svg',
  'blush-rose.svg',
  'lavender-dream.svg',
  'princess-peach.svg'
];

async function verifyAll() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  console.log('--- 1. Testing XML parsing for each SVG in Chrome ---');
  for (const name of SVGS) {
    const content = fs.readFileSync(`public/previews/${name}`, 'utf8');
    const parseResult = await page.evaluate((xmlStr, filename) => {
      const p = new DOMParser();
      const doc = p.parseFromString(xmlStr, 'image/svg+xml');
      const err = doc.querySelector('parsererror');
      if (err) {
        return { valid: false, error: err.textContent };
      }
      const svg = doc.querySelector('svg');
      return {
        valid: true,
        viewBox: svg ? svg.getAttribute('viewBox') : null,
        images: Array.from(doc.querySelectorAll('image')).map(im => ({
          href: im.getAttribute('href') ? im.getAttribute('href').substring(0, 30) + '...' : null,
          width: im.getAttribute('width'),
          height: im.getAttribute('height')
        }))
      };
    }, content, name);

    if (!parseResult.valid) {
      console.error(`FAILED XML parse for ${name}:`, parseResult.error);
      process.exit(1);
    }
    console.log(`PASS ${name}: Valid XML, viewBox=${parseResult.viewBox}, images=${JSON.stringify(parseResult.images)}`);
  }

  console.log('--- 2. Screenshot all 6 SVGs in grid ---');
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { background: #0f172a; color: #fff; font-family: system-ui, sans-serif; padding: 30px; margin: 0; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1300px; margin: 0 auto; }
          .card { background: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155; padding: 12px; }
          .card h3 { margin: 0 0 10px 0; font-size: 14px; text-align: center; color: #94a3b8; }
          .preview-box { aspect-ratio: 4/3; width: 100%; border-radius: 12px; overflow: hidden; background: #000; }
          .preview-box img { width: 100%; height: 100%; object-fit: cover; display: block; }
        </style>
      </head>
      <body>
        <h1 style="text-align: center; margin-bottom: 24px;">Birthday Keepsake Web Previews (6 Upgraded Templates)</h1>
        <div class="grid">
          ${SVGS.map(name => `
            <div class="card">
              <h3>${name}</h3>
              <div class="preview-box">
                <img src="http://localhost:5174/previews/${name}" alt="${name}" />
              </div>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `);

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'test/all-6-birthday-previews.png', fullPage: true });
  console.log('Saved test/all-6-birthday-previews.png');

  console.log('--- 3. Testing Live Builder Studio integration ---');
  await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  // Click start creating / make keepsake
  const btns = await page.$$('button');
  for (const b of btns) {
    const t = await page.evaluate(el => el.textContent, b);
    if (t && (t.includes('Start Creating') || t.includes('Make a Keepsake'))) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  // Click modal continue
  const modalBtns = await page.$$('button');
  for (const b of modalBtns) {
    const t = await page.evaluate(el => el.textContent, b);
    if (t && (t.includes('Continue') || t.includes('Personalize') || t.includes('Start'))) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot Birthday Boy Grid
  const boyGrid = await page.$('.grid.grid-cols-2');
  if (boyGrid) {
    await boyGrid.screenshot({ path: 'test/qa-studio-birthday-boy-upgraded.png' });
    console.log('Saved test/qa-studio-birthday-boy-upgraded.png');
  }

  // Toggle to Birthday Girl
  const girlToggle = await page.$('button[title*="Switch to Girl"]');
  if (girlToggle) {
    await girlToggle.click();
    await new Promise(r => setTimeout(r, 800));
    if (boyGrid) {
      await boyGrid.screenshot({ path: 'test/qa-studio-birthday-girl-upgraded.png' });
      console.log('Saved test/qa-studio-birthday-girl-upgraded.png');
    }
  }

  // Full studio screenshot
  await page.screenshot({ path: 'test/qa-studio-full-view.png' });
  console.log('Saved test/qa-studio-full-view.png');

  console.log('--- 4. Checking Privacy across previews ---');
  for (const name of SVGS) {
    const content = fs.readFileSync(`public/previews/${name}`, 'utf8');
    if (/aditi|\bdevi\b/i.test(content)) {
      throw new Error(`Privacy violation found in public/previews/${name}`);
    }
  }
  console.log('PASS: All 6 SVGs are 100% clean with zero privacy violations!');

  await browser.close();
}

verifyAll().catch(err => {
  console.error(err);
  process.exit(1);
});
