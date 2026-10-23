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
    await new Promise(r => setTimeout(r, 600));

    // Click Start Creating
    const btns = await page.$$('button');
    for (const b of btns) {
      const t = await page.evaluate(el => el.textContent, b);
      if (t && (t.includes('Start Creating') || t.includes('Make a Keepsake'))) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));

    // Handle modal if open
    const modalBtns = await page.$$('button');
    for (const b of modalBtns) {
      const t = await page.evaluate(el => el.textContent, b);
      if (t && (t.includes('Continue') || t.includes('Personalize') || t.includes('Start'))) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1200));

    // Locate simulator container
    const simulatorEl = await page.$('.shrink-0 .relative.w-\\[393px\\]') || await page.$('.shrink-0 [style*="393"]');
    
    // Screenshot full viewport
    await page.screenshot({ path: 'test/qa-mockup-full.png' });
    console.log('Saved test/qa-mockup-full.png');

    // Screenshot just the simulator element if found, or capture bounding box
    const simBox = await page.evaluate(() => {
      const sim = document.querySelector('.bg-gradient-to-b.from-\\[\\#8a8698\\]')?.parentElement;
      if (!sim) return null;
      const rect = sim.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });

    if (simBox) {
      await page.screenshot({
        path: 'test/qa-mockup-simulator-cropped.png',
        clip: {
          x: Math.max(0, simBox.x - 10),
          y: Math.max(0, simBox.y - 10),
          width: Math.min(1280 - simBox.x, simBox.width + 20),
          height: Math.min(720 - simBox.y, simBox.height + 20)
        }
      });
      console.log('Saved test/qa-mockup-simulator-cropped.png');
    }
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
