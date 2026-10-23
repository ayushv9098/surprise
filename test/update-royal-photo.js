import fs from 'fs';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function updateAndVerifyRoyalSapphire() {
  const photoBuf = fs.readFileSync('public/previews/photos/royal-sapphire.jpg');
  const b64 = photoBuf.toString('base64');

  let svg = fs.readFileSync('public/previews/royal-sapphire.svg', 'utf-8');

  // Replace the cartoon silhouette in polaroid:
  // Old:
  //   <circle cx="32" cy="24" r="11" fill="#3b82f6"/>
  //   <path d="M16 48 C 16 38, 22 35, 32 35 C 42 35, 48 38, 48 48 Z" fill="#60a5fa"/>
  const oldSilhouette = `<circle cx="32" cy="24" r="11" fill="#3b82f6"/>
    <path d="M16 48 C 16 38, 22 35, 32 35 C 42 35, 48 38, 48 48 Z" fill="#60a5fa"/>`;

  const newPhoto = `<defs>
      <clipPath id="royalPolaroidClip">
        <rect x="5" y="5" width="54" height="48" rx="2"/>
      </clipPath>
    </defs>
    <image href="data:image/jpeg;base64,${b64}" x="5" y="5" width="54" height="48" preserveAspectRatio="xMidYMid slice" clip-path="url(#royalPolaroidClip)"/>`;

  if (svg.includes('<circle cx="32" cy="24" r="11"')) {
    svg = svg.replace(/<circle cx="32" cy="24" r="11" fill="#3b82f6"\/>\s*<path d="M16 48 C 16 38, 22 35, 32 35 C 42 35, 48 38, 48 48 Z" fill="#60a5fa"\/>/, newPhoto);
    fs.writeFileSync('public/previews/royal-sapphire.svg', svg);
    console.log('Successfully replaced cartoon silhouette with real photo in royal-sapphire.svg');
  } else {
    console.log('Silhouette pattern not matched, checking SVG content');
  }

  // Verify in puppeteer via <img src="http://localhost:5174/previews/royal-sapphire.svg" />
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 500, height: 400 });
  await page.setContent(`
    <!DOCTYPE html>
    <html><body style="background:#0f172a; padding: 20px;">
      <img id="testImg" src="http://localhost:5174/previews/royal-sapphire.svg" width="400" height="300" style="border: 2px solid #3b82f6; border-radius: 12px;" />
    </body></html>
  `);

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'test/verify-royal-sapphire-photo.png' });
  console.log('Saved test/verify-royal-sapphire-photo.png');

  await browser.close();
}

updateAndVerifyRoyalSapphire().catch(console.error);
