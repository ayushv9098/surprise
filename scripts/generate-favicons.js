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
    <linearGradient id="dearly-envelope-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="40%" stop-color="#F43F5E" />
      <stop offset="75%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#BE123C" />
    </linearGradient>
  </defs>

  <!-- Keepsake envelope card silhouette -->
  <rect
    x="4"
    y="6"
    width="24"
    height="20"
    rx="4.5"
    stroke="url(#dearly-envelope-grad)"
    stroke-width="2.6"
  />

  <!-- Diagonal envelope fold line -->
  <path
    d="M5.5 8.2L14.6 16.3C15.4 17 16.6 17 17.4 16.3L26.5 8.2"
    stroke="url(#dearly-envelope-grad)"
    stroke-width="2.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Micro Keepsake Heart Seal in center -->
  <path
    d="M16 14.2C15.1 13.1 13.4 13.4 13.4 14.8C13.4 16.6 16 18.7 16 18.7C16 18.7 18.6 16.6 18.6 14.8C18.6 13.4 16.9 13.1 16 14.2Z"
    fill="url(#dearly-envelope-grad)"
  />
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
