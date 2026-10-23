import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function cropAndExamine() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const b1 = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 204201.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="background: #222; margin: 0; padding: 20px;">
      <h3>Phone extracted from Screenshot 2026-10-23 204201.png (333x676)</h3>
      <canvas id="cTarget" width="333" height="676" style="border: 2px solid cyan;"></canvas>
      <script>
        const img = new Image();
        img.src = "data:image/png;base64,${b1}";
        img.onload = () => {
          const ctx = document.getElementById('cTarget').getContext('2d');
          // draw only target bounds: sx=38, sy=18, sWidth=333, sHeight=676
          ctx.drawImage(img, 38, 18, 333, 676, 0, 0, 333, 676);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);
  await page.screenshot({ path: 'test/target-extracted-phone.png' });
  console.log('Saved test/target-extracted-phone.png');

  // Let's inspect the chassis rim and bezel
  const phoneStructure = await page.evaluate(() => {
    const c = document.getElementById('cTarget');
    const ctx = c.getContext('2d');
    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    // Horizontal scan across center y = 300
    const row300 = [];
    for (let x = 0; x < 333; x += 5) {
      row300.push({ x, hex: getHex(x, 300) });
    }

    // Vertical scan down center x = 166
    const col166 = [];
    for (let y = 0; y < 676; y += 15) {
      col166.push({ y, hex: getHex(166, y) });
    }

    return { row300: row300.slice(0, 10), col166Top: col166.slice(0, 10), col166Bottom: col166.slice(-10) };
  });

  console.log('Phone Structure:', JSON.stringify(phoneStructure, null, 2));

  await browser.close();
}

cropAndExamine().catch(console.error);
