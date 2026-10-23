import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function examineUserImageInDetail() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  const b = fs.readFileSync('C:/Users/hp/Pictures/Screenshots/Screenshot 2026-10-23 212020.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="c" width="454" height="602"></canvas>
      <script>
        const im = new Image();
        im.src = 'data:image/png;base64,' + "${b}";
        im.onload = () => {
          document.getElementById('c').getContext('2d').drawImage(im, 0, 0);
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready);

  const samplePoints = await page.evaluate(() => {
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    const getHex = (x, y) => {
      const p = ctx.getImageData(x, y, 1, 1).data;
      return '#' + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    return {
      topOuterArea: getHex(227, 20),      // above phone
      topPhoneRim: getHex(227, 48),       // top titanium rim
      dynamicIsland: getHex(227, 75),     // island center
      screenCard: getHex(227, 280),       // card center
      addressBar: getHex(227, 510),       // address bar
      bottomBar: getHex(227, 560),        // bottom bar area
      bottomRim: getHex(227, 595),        // bottom phone rim
      bottomOuterArea: getHex(227, 601),  // very bottom edge
    };
  });

  console.log('Sample points in 212020:', samplePoints);
  await browser.close();
}

examineUserImageInDetail().catch(console.error);
