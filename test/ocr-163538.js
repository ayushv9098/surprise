import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function ocr163538() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const b16 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 163538.png').toString('base64');

  await page.goto('about:blank');
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js' }).catch(() => null);

  const text = await page.evaluate(async (img) => {
    if (!window.Tesseract) return null;
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize('data:image/png;base64,' + img);
    await worker.terminate();
    return ret.data.text;
  }, b16).catch(e => e.message);

  console.log('163538 Text:\n', text);
  await browser.close();
}

ocr163538().catch(console.error);
