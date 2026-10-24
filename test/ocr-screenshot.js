import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function readTextFromImage() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // We can inject Tesseract.js via CDN or script tag in our browser page!
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
      </head>
      <body>
        <img id="img-url" src="data:image/png;base64,${fs.readFileSync('test/crop-urlbar.png').toString('base64')}" />
        <img id="img-hdr" src="data:image/png;base64,${fs.readFileSync('test/crop-inpage-header.png').toString('base64')}" />
        <img id="img-pin" src="data:image/png;base64,${fs.readFileSync('test/crop-pin-zoom.png').toString('base64')}" />
        <img id="img-card" src="data:image/png;base64,${fs.readFileSync('test/view-180514-cards.png').toString('base64')}" />
      </body>
    </html>
  `);

  console.log('Waiting for Tesseract to load and recognize text...');
  const ocrResults = await page.evaluate(async () => {
    const results = {};
    if (typeof Tesseract !== 'undefined') {
      const worker = await Tesseract.createWorker('eng');
      
      const r1 = await worker.recognize(document.getElementById('img-url'));
      results.urlBar = r1.data.text.trim();

      const r2 = await worker.recognize(document.getElementById('img-hdr'));
      results.header = r2.data.text.trim();

      const r3 = await worker.recognize(document.getElementById('img-pin'));
      results.pinZoom = r3.data.text.trim();

      const r4 = await worker.recognize(document.getElementById('img-card'));
      results.cards = r4.data.text.trim();

      await worker.terminate();
    } else {
      results.error = 'Tesseract not defined';
    }
    return results;
  });

  console.log('OCR Results:', JSON.stringify(ocrResults, null, 2));
  await browser.close();
}

readTextFromImage().catch(console.error);
