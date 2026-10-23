import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testLaptopFinal() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 551 });
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    const btns = await page.$$('button');
    for (const b of btns) {
      const t = await page.evaluate(el => el.textContent, b);
      if (t && (t.includes('Start Creating') || t.includes('Make a Keepsake'))) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    const modalBtns = await page.$$('button');
    for (const b of modalBtns) {
      const t = await page.evaluate(el => el.textContent, b);
      if (t && (t.includes('Continue') || t.includes('Personalize') || t.includes('Start'))) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: 'test/laptop-551-ultimate.png' });
    console.log('Saved test/laptop-551-ultimate.png');
  } finally {
    await browser.close();
  }
}

testLaptopFinal().catch(console.error);
