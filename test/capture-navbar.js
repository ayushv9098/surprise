import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureNavbar() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));

  const outPath = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\qa-final-navbar.png';
  const header = await page.$('header');
  if (header) {
    await header.screenshot({ path: outPath });
  } else {
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1280, height: 100 } });
  }
  console.log('Saved actual navbar screenshot to:', outPath);
  await browser.close();
}

captureNavbar();
