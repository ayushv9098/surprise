import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = 'D:\\avprojects\\surprise-builder';
const PUBLIC_DIR = path.join(ROOT, 'public');

/**
 * Dearly Keepsake Envelope with Heart Fold SVG Geometry
 * Extracted directly from src/components/common/DearlyLogo.jsx
 *
 * Color palette:
 * - #FB7185 (Rose 400 - bright coral highlights)
 * - #F43F5E (Rose 500 - vibrant core contrast)
 * - #E11D48 (Rose 600 - brand signature crimson-rose)
 * - #BE123C (Rose 700 - rich deep anchor)
 *
 * Optimized for high contrast & razor-sharp legibility on both
 * Dark Mode (#202124 / #000000) and Light Mode (#FFFFFF / #DEE1E6) browser tabs.
 */
const SVG_FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
  <defs>
    <linearGradient id="dearly-fav-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3366"/>
      <stop offset="38%" stop-color="#E11D48"/>
      <stop offset="80%" stop-color="#9F1239"/>
      <stop offset="100%" stop-color="#6B0A26"/>
    </linearGradient>
    <linearGradient id="dearly-fav-rim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.65"/>
      <stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="dearly-fav-heart" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FFE4E8"/>
    </linearGradient>
    <filter id="dearly-fav-shadow" x="-15%" y="-15%" width="130%" height="135%">
      <feDropShadow dx="0" dy="1.2" stdDeviation="0.9" flood-color="#4C0519" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="1.25" y="1.25" width="29.5" height="29.5" rx="8.5" fill="url(#dearly-fav-bg)"/>
  <rect x="1.25" y="1.25" width="29.5" height="29.5" rx="8.5" stroke="url(#dearly-fav-rim)" stroke-width="1.2"/>

  <!-- Upper Glass Sheen Arc -->
  <path
    d="M 2.5 9.5 C 2.5 5.5 5.5 2.5 9.5 2.5 L 22.5 2.5 C 26.5 2.5 29.5 5.5 29.5 9.5 C 22 13.5 10 13.5 2.5 9.5 Z"
    fill="#FFFFFF"
    fill-opacity="0.18"
  />

  <!-- Center Keepsake Heart -->
  <path
    filter="url(#dearly-fav-shadow)"
    d="M 16 11.2 C 14.6 9.4 12.2 8.5 10 9 C 7.6 9.6 6 11.8 6 14.5 C 6 18.2 10.4 22 16 25 C 21.6 22 26 18.2 26 14.5 C 26 11.8 24.4 9.6 22 9 C 19.8 8.5 17.4 9.4 16 11.2 Z"
    fill="url(#dearly-fav-heart)"
  />

  <!-- Specular Gloss Reflection on Left Lobe -->
  <ellipse cx="11" cy="12.5" rx="2" ry="1.2" transform="rotate(-30 11 12.5)" fill="#FFFFFF" fill-opacity="0.75"/>

  <!-- Signature 4-Point Diamond Sparkle Star (✦) -->
  <path d="M 24.5 4 Q 24.5 7 21.5 7 Q 24.5 7 24.5 10 Q 24.5 7 27.5 7 Q 24.5 7 24.5 4 Z" fill="#FFF1F3"/>
  <circle cx="24.5" cy="7" r="0.8" fill="#FFFFFF"/>
</svg>`;

// Standard ICO format builder wrapping PNG data
function createIcoFromPngs(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + count * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // image type (1 = ICO)
  header.writeUInt16LE(count, 4); // number of images

  const entries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0); // width
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    offset += item.buffer.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

async function generate() {
  console.log('1. Writing public/favicon.svg (Dearly Keepsake Envelope with Heart Fold)...');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), SVG_FAVICON.trim(), 'utf8');

  console.log('2. Writing public/site.webmanifest (theme_color: #E11D48)...');
  const manifest = {
    name: 'Dearly — Keepsake & Surprise Websites',
    short_name: 'Dearly',
    description: 'Create heartfelt digital keepsake cards, surprise websites, anniversary letters, and memory scrapbooks in seconds.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFFDFB',
    theme_color: '#E11D48',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };
  fs.writeFileSync(path.join(PUBLIC_DIR, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log('3. Launching Chrome Puppeteer to render pixel-perfect rasterized favicon assets...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Tab Favicons (Transparent background: 16x16, 32x32, 48x48)
  const tabFaviconHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
    #container { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
    svg { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="container">
    ${SVG_FAVICON}
  </div>
</body>
</html>`;

  await page.setContent(tabFaviconHtml, { waitUntil: 'load' });

  const tabTargets = [
    { size: 16, file: 'favicon-16x16.png' },
    { size: 32, file: 'favicon-32x32.png' },
    { size: 48, file: 'favicon-48x48.png' },
  ];

  const pngBuffers = [];

  for (const { size, file } of tabTargets) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    const buffer = await page.screenshot({
      omitBackground: true,
      clip: { x: 0, y: 0, width: size, height: size }
    });
    fs.writeFileSync(path.join(PUBLIC_DIR, file), buffer);
    console.log(`  ✓ Generated public/${file} (${size}x${size}, transparent)`);
    pngBuffers.push({ width: size, height: size, buffer });
  }

  // App Icons (Opaque background for iOS / Android Home Screen & PWA Maskable Compliance)
  const appIconHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 78%;
      height: 78%;
    }
    svg { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="container">
    ${SVG_FAVICON}
  </div>
</body>
</html>`;

  await page.setContent(appIconHtml, { waitUntil: 'load' });

  const appTargets = [
    { size: 180, file: 'apple-touch-icon.png' },
    { size: 192, file: 'android-chrome-192x192.png' },
    { size: 512, file: 'android-chrome-512x512.png' },
  ];

  for (const { size, file } of appTargets) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    const buffer = await page.screenshot({
      omitBackground: false,
      clip: { x: 0, y: 0, width: size, height: size }
    });
    fs.writeFileSync(path.join(PUBLIC_DIR, file), buffer);
    console.log(`  ✓ Generated public/${file} (${size}x${size}, app standard)`);
  }

  // Create favicon.ico (multi-resolution ICO combining 16, 32, 48px)
  console.log('4. Generating public/favicon.ico (16, 32, 48px)...');
  const icoBuffer = createIcoFromPngs(pngBuffers);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log('  ✓ Generated public/favicon.ico');

  await browser.close();
  console.log('\nAll Dearly Keepsake Envelope favicon & manifest assets generated with 0 errors!');
}

generate().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
