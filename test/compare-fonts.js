import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function compare() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const navElem = await page.$('header');
  await navElem.screenshot({ path: 'D:/avprojects/surprise-builder/test/navbar-outfit.png' });

  await page.evaluate(() => {
    const span = document.querySelector('header button span');
    span.style.fontFamily = "'Playfair Display', Georgia, serif";
    span.style.fontSize = '21px';
    span.style.fontWeight = '700';
    span.style.letterSpacing = '-0.02em';
    span.style.color = '#0f172a';
  });
  await navElem.screenshot({ path: 'D:/avprojects/surprise-builder/test/navbar-playfair.png' });

  console.log('Saved both screenshots to test/navbar-outfit.png and test/navbar-playfair.png');
  await browser.close();
}

compare().catch(console.error);
