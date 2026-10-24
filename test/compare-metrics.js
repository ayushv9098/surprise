import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testMetrics() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  // Test Playfair Display
  await page.evaluate(() => {
    const span = document.querySelector('header button span');
    span.className = "font-['Playfair_Display'] font-bold text-[21px] tracking-tight text-slate-900 select-none";
  });
  const playfair = await page.evaluate(() => {
    const span = document.querySelector('header button span');
    const svg = document.querySelector('header button svg');
    const spanR = span.getBoundingClientRect();
    const svgR = svg.getBoundingClientRect();
    return {
      span: { top: spanR.top, height: spanR.height, center: spanR.top + spanR.height / 2 },
      svg: { top: svgR.top, height: svgR.height, center: svgR.top + svgR.height / 2 },
      delta: (spanR.top + spanR.height / 2) - (svgR.top + svgR.height / 2)
    };
  });
  console.log('Playfair Metrics:', playfair);

  // Test Outfit
  await page.evaluate(() => {
    const span = document.querySelector('header button span');
    span.className = "font-['Outfit'] font-bold text-[20px] tracking-tight text-slate-950 select-none";
  });
  const outfit = await page.evaluate(() => {
    const span = document.querySelector('header button span');
    const svg = document.querySelector('header button svg');
    const spanR = span.getBoundingClientRect();
    const svgR = svg.getBoundingClientRect();
    return {
      span: { top: spanR.top, height: spanR.height, center: spanR.top + spanR.height / 2 },
      svg: { top: svgR.top, height: svgR.height, center: svgR.top + svgR.height / 2 },
      delta: (spanR.top + spanR.height / 2) - (svgR.top + svgR.height / 2)
    };
  });
  console.log('Outfit Metrics:', outfit);

  await browser.close();
}

testMetrics().catch(console.error);
