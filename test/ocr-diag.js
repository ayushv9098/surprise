import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function ocrDiag() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800 });

  const bTop = fs.readFileSync('test/diag_top_status.png').toString('base64');
  const bBot = fs.readFileSync('test/diag_bot_safari.png').toString('base64');

  await page.goto('about:blank');
  await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js' }).catch(() => null);

  const t = await page.evaluate(async (topImg, botImg) => {
    if (!window.Tesseract) return null;
    const worker = await Tesseract.createWorker('eng');
    const rTop = await worker.recognize('data:image/png;base64,' + topImg);
    const rBot = await worker.recognize('data:image/png;base64,' + botImg);
    await worker.terminate();
    return { top: rTop.data.text.trim(), bot: rBot.data.text.trim() };
  }, bTop, bBot).catch(e => e.message);

  console.log('OCR Diag:', t);
  await browser.close();
}

ocrDiag().catch(console.error);
