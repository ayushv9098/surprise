import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function ocr200939() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800 });

  const b = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 200939.png').toString('base64');

  await page.goto('about:blank');
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js' }).catch(() => null);

  const text = await page.evaluate(async (img) => {
    if (!window.Tesseract) return null;
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize('data:image/png;base64,' + img);
    await worker.terminate();
    return ret.data.text;
  }, b).catch(e => e.message);

  console.log('200939 Text:\n', text);
  await browser.close();
}

ocr200939().catch(console.error);
