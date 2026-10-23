import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));

    // Click Special Someone & Romance category card
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('button'));
      const romanceBtn = cards.find(b => b.textContent.includes('Special Someone & Romance'));
      if (romanceBtn) romanceBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Click continue modal
    await page.evaluate(() => {
      const modalBtns = Array.from(document.querySelectorAll('button'));
      const cont = modalBtns.find(b => b.textContent.includes('Continue') || b.textContent.includes('Start'));
      if (cont) cont.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    // Screenshot of Romance Template Selector
    await page.screenshot({ path: 'test/qa-romance-templates-verified.png' });
    console.log('Saved test/qa-romance-templates-verified.png');

    // Click Proceed to Form
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const proceed = btns.find(b => b.textContent.includes('Proceed to Form'));
      if (proceed) proceed.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Click Photos & Music tab (Step 2)
    await page.evaluate(() => {
      const stepBtns = Array.from(document.querySelectorAll('button'));
      const photoTab = stepBtns.find(b => b.textContent.includes('Photos & Music') || b.textContent.includes('Memory Deck'));
      if (photoTab) photoTab.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Screenshot of Step 2 Photo upload cards
    await page.screenshot({ path: 'test/qa-romance-photos-verified.png' });
    console.log('Saved test/qa-romance-photos-verified.png');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
