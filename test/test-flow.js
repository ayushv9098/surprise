import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';

async function testFlow() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  console.log('Loaded:', BASE_URL);

  // Click "Start Creating"
  const clickedStart = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => (b.textContent || '').includes('Start Creating'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Start Creating clicked:', clickedStart);

  // Wait for modal
  await new Promise(r => setTimeout(r, 600));

  // Click "For a Boy"
  const clickedBoy = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const boyBtn = btns.find(b => (b.textContent || '').includes('For a Boy') || (b.textContent || '').includes('Select boy style'));
    if (boyBtn) {
      boyBtn.click();
      return true;
    }
    return false;
  });
  console.log('Boy option clicked:', clickedBoy);

  await new Promise(r => setTimeout(r, 1200));

  // Verify BuilderStudio is loaded
  const studioInfo = await page.evaluate(() => {
    const h2 = document.querySelector('h2');
    const cards = Array.from(document.querySelectorAll('.grid > div')).map(c => {
      const h3 = c.querySelector('h3');
      const img = c.querySelector('img');
      return {
        title: h3 ? h3.textContent.trim() : '',
        imgSrc: img ? img.src : ''
      };
    });
    return {
      h2: h2 ? h2.textContent.trim() : '',
      cards
    };
  });

  console.log('Studio Info:', JSON.stringify(studioInfo, null, 2));

  await browser.close();
}

testFlow().catch(console.error);
