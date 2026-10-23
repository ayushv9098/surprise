import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspect213038() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  const b = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 213038.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head><style>body { background: #000; color: #fff; font-family: sans-serif; padding: 20px; }</style></head>
    <body>
      <h2>Screenshot 2026-10-23 213038.png</h2>
      <img id="im" src="data:image/png;base64,${b}" style="max-width: 100%; border: 2px solid cyan;" />
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/view-213038.png', fullPage: true });
  console.log('Saved test/view-213038.png');

  // Let's get image dimensions
  const dims = await page.evaluate(() => {
    const im = document.getElementById('im');
    return { w: im.naturalWidth, h: im.naturalHeight };
  });
  console.log('Dimensions of 213038:', dims);

  // Let's do OCR on 213038
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js' }).catch(() => null);
  const text = await page.evaluate(async (img) => {
    if (!window.Tesseract) return null;
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize('data:image/png;base64,' + img);
    await worker.terminate();
    return ret.data.text;
  }, b).catch(e => e.message);

  console.log('OCR text of 213038:\n', text);

  await browser.close();
}

inspect213038().catch(console.error);
