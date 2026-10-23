import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function ocrInspect() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  const b = fs.readFileSync('test/qa-studio-birthday-boy-upgraded.png').toString('base64');
  await page.setContent(`<img id="im" src="data:image/png;base64,${b}" />`);
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js' }).catch(() => null);
  const text = await page.evaluate(async (img) => {
    if (!window.Tesseract) return null;
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize('data:image/png;base64=' + img);
    await worker.terminate();
    return ret.data.text;
  }, b).catch(e => e.message);

  console.log('OCR text of upgraded studio grid:\n', text);
  await browser.close();
}

ocrInspect().catch(console.error);
