import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectTextAndContent() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  // Use Tesseract CDN inside page to read text of target-extracted-phone.png
  await page.goto('about:blank');
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js' }).catch(() => null);

  const b1 = fs.readFileSync('test/target-extracted-phone.png').toString('base64');

  const text = await page.evaluate(async (imgBase64) => {
    if (window.Tesseract) {
      const worker = await Tesseract.createWorker('eng');
      const ret = await worker.recognize('data:image/png;base64,' + imgBase64);
      await worker.terminate();
      return ret.data.text;
    }
    return null;
  }, b1).catch(() => null);

  console.log('OCR Result from Target Mockup:', text);

  await browser.close();
}

inspectTextAndContent().catch(console.error);
