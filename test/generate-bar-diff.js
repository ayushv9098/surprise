import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function generateBarDiffView() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 700 });

  const bTTop = fs.readFileSync('test/cmp_t_top.png').toString('base64');
  const bNTop = fs.readFileSync('test/cmp_n_top.png').toString('base64');
  const bTBot = fs.readFileSync('test/cmp_t_bot.png').toString('base64');
  const bNBot = fs.readFileSync('test/cmp_n_bot.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background: #18181b; color: #f4f4f5; font-family: system-ui; padding: 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .box { background: #27272a; padding: 12px; border-radius: 8px; }
        h4 { margin: 0 0 8px; font-size: 13px; }
        img { width: 100%; border: 1px solid #3f3f46; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="grid">
        <div class="box">
          <h4 style="color: #38bdf8;">TARGET STATUS BAR</h4>
          <img src="data:image/png;base64,${bTTop}" />
        </div>
        <div class="box">
          <h4 style="color: #4ade80;">OUR STATUS BAR</h4>
          <img src="data:image/png;base64,${bNTop}" />
        </div>
        <div class="box">
          <h4 style="color: #38bdf8;">TARGET BOTTOM BAR (Notice #f9f9f9 bar background!)</h4>
          <img src="data:image/png;base64,${bTBot}" />
        </div>
        <div class="box">
          <h4 style="color: #f43f5e;">OUR BOTTOM BAR (Transparent/no background!)</h4>
          <img src="data:image/png;base64,${bNBot}" />
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'test/bar-diff-comparison.png', fullPage: true });
  console.log('Saved test/bar-diff-comparison.png');
  await browser.close();
}

generateBarDiffView().catch(console.error);
