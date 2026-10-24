import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function crop() {
  const browser = await puppeteer.launch({ headless: 'new', executablePath: CHROME_PATH, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5174/builder', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const start = btns.find(x => x.textContent.includes('Start Creating'));
    if (start) start.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const boy = btns.find(x => x.textContent.includes('Him') || x.textContent.includes('Boy'));
    if (boy) boy.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  const el = await page.$('.grid');
  if (el) {
    await el.screenshot({ path: 'test/current-cards-view.png' });
    console.log('Saved test/current-cards-view.png');
  }
  await browser.close();
}
crop().catch(console.error);
