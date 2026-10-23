import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function diagnose204952() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const b2 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204952.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c" width="415" height="618"></canvas>
      <script>
        const img = new Image();
        img.src = "data:image/png;base64,${b2}";
        img.onload = () => {
          const ctx = document.getElementById('c').getContext('2d');
          ctx.drawImage(img, 0, 0);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);

  const analysis = await page.evaluate(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // Scan vertical center x=207
    const col207 = [];
    for (let y = 0; y < 618; y += 10) {
      col207.push({ y, hex: getHex(207, y) });
    }

    // Scan horizontal center y=300
    const row300 = [];
    for (let x = 0; x < 415; x += 10) {
      row300.push({ x, hex: getHex(x, 300) });
    }

    return { col207, row300 };
  });

  console.log('204952 col207:', JSON.stringify(analysis.col207, null, 2));
  console.log('204952 row300:', JSON.stringify(analysis.row300, null, 2));

  await browser.close();
}

diagnose204952().catch(console.error);
