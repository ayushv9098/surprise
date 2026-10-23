import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function readTextOfCrops() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const bStatus = fs.readFileSync('test/crop_status.png').toString('base64');
  const bAddr = fs.readFileSync('test/crop_addr.png').toString('base64');
  const bToolbar = fs.readFileSync('test/crop_toolbar.png').toString('base64');

  await page.goto('about:blank');
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js' }).catch(() => null);

  const results = await page.evaluate(async (s, a) => {
    if (!window.Tesseract) return null;
    const worker = await Tesseract.createWorker('eng');
    const resStatus = await worker.recognize('data:image/png;base64,' + s);
    const resAddr = await worker.recognize('data:image/png;base64,' + a);
    await worker.terminate();
    return {
      statusText: resStatus.data.text.trim(),
      addrText: resAddr.data.text.trim(),
    };
  }, bStatus, bAddr).catch(err => ({ error: err.message }));

  console.log('OCR of crops:', results);
  await browser.close();
}

readTextOfCrops().catch(console.error);
