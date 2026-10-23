import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkGirl() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Click Birthday
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const start = btns.find(x => x.textContent.includes('Start Creating'));
    if (start) start.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click "For Her" in the recipient modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const her = btns.find(x => x.textContent.includes('Her') || x.textContent.includes('Girl'));
    if (her) her.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'test/qa-studio-birthday-girl-verified.png' });
  console.log('Saved test/qa-studio-birthday-girl-verified.png');

  await browser.close();
}

checkGirl().catch(console.error);
