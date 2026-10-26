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
const SVG_FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <!-- Luxury Jewel Gradient: Top-Left Radiant Rose -> Royal Crimson -> Velvet Wine -->
    <linearGradient id="dearly-envelope" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF4372" />
      <stop offset="35%" stop-color="#F43F5E" />
      <stop offset="70%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#880E4F" />
    </linearGradient>

    <!-- Inner Ruby Gemstone Gradient -->
    <linearGradient id="dearly-ruby" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF386B" />
      <stop offset="45%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#9F1239" />
    </linearGradient>

    <!-- Specular Glass Sheen Gradient -->
    <linearGradient id="dearly-specular" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.1" />
    </linearGradient>

    <!-- Ambient Ruby Luminescence Filter -->
    <filter id="dearly-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.8" flood-color="#E11D48" flood-opacity="0.36" />
    </filter>
  </defs>

  <g filter="url(#dearly-glow)">
    <!-- Outer Keepsake Envelope Silhouette -->
    <rect
      x="7"
      y="11"
      width="50"
      height="42"
      rx="9"
      stroke="url(#dearly-envelope)"
      stroke-width="4.2"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- Top Rim Light (Glass Specular Reflection on Upper Border) -->
    <path
      d="M 18 11 H 46"
      stroke="#FFFFFF"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-opacity="0.65"
    />

    <!-- Keepsake Envelope Flap V-Fold Line -->
    <path
      d="M 8.5 16.5 L 26.5 32 C 29.8 34.6 34.2 34.6 37.5 32 L 55.5 16.5"
      stroke="url(#dearly-envelope)"
      stroke-width="4.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Radiant Center Ruby Wax Seal Heart -->
    <path
      d="M 32 25.5 C 30.2 22.2 26.8 20.5 23.5 20.5 C 19.8 20.5 17 23.5 17 27.5 C 17 32.8 22.8 38 32 44.5 C 41.2 38 47 32.8 47 27.5 C 47 23.5 44.2 20.5 40.5 20.5 C 37.2 20.5 33.8 22.2 32 25.5 Z"
      fill="url(#dearly-ruby)"
    />

    <!-- Heart Top Bevel / Lobe Rim Glow -->
    <path
      d="M 23.5 22 C 26 22 28.5 23 32 25.5 C 35.5 23 38 22 40.5 22 C 43.5 22 45.2 23.8 45.5 26.5 C 44.5 24.8 42.8 23.5 40.5 23.5 C 37.8 23.5 35 24.8 32 27.2 C 29 24.8 26.2 23.5 23.5 23.5 C 21.2 23.5 19.5 24.8 18.5 26.5 C 18.8 23.8 20.5 22 23.5 22 Z"
      fill="url(#dearly-specular)"
      opacity="0.75"
    />

    <!-- Specular Gloss Droplet (Left Lobe Reflection) -->
    <ellipse
      cx="24.8"
      cy="25"
      rx="3.6"
      ry="2"
      transform="rotate(-32 24.8 25)"
      fill="#FFFFFF"
      fill-opacity="0.92"
    />

    <!-- Specular Gloss Accent Dot (Right Lobe Reflection) -->
    <circle
      cx="39.8"
      cy="24.5"
      r="1.4"
      fill="#FFFFFF"
      fill-opacity="0.8"
    />

    <!-- Signature 4-Point Specular Star Flare (Diamond Sparkle) -->
    <path
      d="M 52.5 5 Q 52.5 9 48.5 9 Q 52.5 9 52.5 13 Q 52.5 9 56.5 9 Q 52.5 9 52.5 5 Z"
      fill="#FFF1F3"
    />
    <circle cx="52.5" cy="9" r="1.2" fill="#FFFFFF" />
  </g>
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
