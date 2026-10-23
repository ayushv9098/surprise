import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  const b64 = fs.readFileSync('D:/avprojects/surprise-builder/public/previews/photos/royal-sapphire.jpg').toString('base64');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 200" width="300" height="200">
    <rect width="300" height="200" fill="#0f172a"/>
    <image href="data:image/jpeg;base64,${b64}" xlink:href="data:image/jpeg;base64,${b64}" x="20" y="20" width="100" height="100" preserveAspectRatio="xMidYMid slice"/>
    <text x="140" y="50" fill="white" font-size="14">Royal Sapphire</text>
  </svg>`;
  fs.writeFileSync('D:/avprojects/surprise-builder/public/previews/test-embed.svg', svgContent);

  // Now open in browser via <img> tag served by Vite
  await page.goto('http://localhost:5174/');
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="background: #111; padding: 20px;">
        <h2>Testing SVG in &lt;img&gt; tag</h2>
        <img id="test-img" src="/previews/test-embed.svg" width="300" height="200" style="border: 2px solid cyan;" />
      </body>
    </html>
  `);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'D:/avprojects/surprise-builder/test/test-direct-render.png' });
  console.log('Saved D:/avprojects/surprise-builder/test/test-direct-render.png');

  // Let's check size
  const stat = fs.statSync('D:/avprojects/surprise-builder/test/test-direct-render.png');
  console.log('Screenshot size:', stat.size);

  await browser.close();
}

run().catch(console.error);
