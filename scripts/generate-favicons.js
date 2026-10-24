import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = 'D:\\avprojects\\surprise-builder';
const PUBLIC_DIR = path.join(ROOT, 'public');

// Concept A: Quiet Luxury Obsidian & Champagne Gold Architectural Keepsake Ribbon 'D'
const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Deep Obsidian Midnight Foundation -->
    <linearGradient id="obsidian-bg-a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14151C" />
      <stop offset="50%" stop-color="#0E0F14" />
      <stop offset="100%" stop-color="#07080B" />
    </linearGradient>

    <!-- Champagne Gold Perimeter Rim -->
    <linearGradient id="gold-rim-a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBF4E8" stop-opacity="0.45" />
      <stop offset="45%" stop-color="#DDB97A" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#936F35" stop-opacity="0.10" />
    </linearGradient>

    <!-- Top-down subtle specular lighting (Apple-grade) -->
    <linearGradient id="specular-a" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.08" />
      <stop offset="30%" stop-color="#FFFFFF" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <!-- Champagne Gold Metallic Gradients -->
    <linearGradient id="gold-ribbon-primary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF7" />
      <stop offset="22%" stop-color="#F4DEB8" />
      <stop offset="60%" stop-color="#DCB879" />
      <stop offset="100%" stop-color="#A8803E" />
    </linearGradient>

    <linearGradient id="gold-facet-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.32" />
      <stop offset="50%" stop-color="#F4DEB8" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#DCB879" stop-opacity="0" />
    </linearGradient>

    <!-- Subtle ambient gold warmth -->
    <radialGradient id="center-gold-glow" cx="50%" cy="50%" r="48%">
      <stop offset="0%" stop-color="#DDB97A" stop-opacity="0.15" />
      <stop offset="60%" stop-color="#DDB97A" stop-opacity="0.03" />
      <stop offset="100%" stop-color="#0E0F14" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Obsidian Squircle Foundation -->
  <rect width="512" height="512" rx="116" fill="url(#obsidian-bg-a)" />
  <rect width="512" height="512" rx="116" fill="url(#specular-a)" />
  <rect width="504" height="504" x="4" y="4" rx="112" fill="none" stroke="url(#gold-rim-a)" stroke-width="3" />

  <!-- Ambient Gold Atmosphere -->
  <circle cx="256" cy="256" r="170" fill="url(#center-gold-glow)" />

  <!-- Architectural Ribbon Monogram 'D' / Origami Keepsake Fold -->
  <g id="icon-concept-a">
    <!-- Left Pillar Stem -->
    <rect x="138" y="134" width="46" height="244" rx="23" fill="url(#gold-ribbon-primary)" />

    <!-- Continuous Ribbon Arch (Golden Ratio Curvature) -->
    <path
      d="M 161 157
         C 256 157, 350 197, 350 256
         C 350 315, 256 355, 161 355"
      fill="none"
      stroke="url(#gold-ribbon-primary)"
      stroke-width="46"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Origami Ribbon Fold Facet (Lustrous Architectural Bevel) -->
    <path
      d="M 184 157
         C 246 157, 304 195, 304 256
         L 230 256
         C 204 256, 184 236, 184 210 Z"
      fill="url(#gold-facet-shimmer)"
    />

    <!-- Crown Specular Catchlight -->
    <path
      d="M 198 157
         C 260 157, 314 184, 330 220"
      fill="none"
      stroke="#FFFDF9"
      stroke-width="6"
      stroke-linecap="round"
      opacity="0.85"
    />
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
  console.log('Writing public/favicon.svg...');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), SVG_CONTENT, 'utf8');

  console.log('Writing public/site.webmanifest...');
  const manifest = {
    name: 'Dearly — Keepsake & Surprise Websites',
    short_name: 'Dearly',
    description: 'Create heartfelt digital keepsake cards, surprise websites, anniversary letters, and memory scrapbooks in seconds.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0E0F14',
    theme_color: '#14151C',
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

  console.log('Launching Puppeteer to render pixel-perfect PNG assets...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const html = `<!DOCTYPE html>
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
    ${SVG_CONTENT}
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'load' });

  const targets = [
    { size: 16, file: 'favicon-16x16.png' },
    { size: 32, file: 'favicon-32x32.png' },
    { size: 48, file: 'favicon-48x48.png' },
    { size: 180, file: 'apple-touch-icon.png' },
    { size: 192, file: 'android-chrome-192x192.png' },
    { size: 512, file: 'android-chrome-512x512.png' },
  ];

  const pngBuffers = [];

  for (const { size, file } of targets) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    const buffer = await page.screenshot({
      omitBackground: true,
      clip: { x: 0, y: 0, width: size, height: size }
    });
    fs.writeFileSync(path.join(PUBLIC_DIR, file), buffer);
    console.log(`  ✓ Generated public/${file} (${size}x${size})`);

    if (size === 16 || size === 32 || size === 48) {
      pngBuffers.push({ width: size, height: size, buffer });
    }
  }

  // Create favicon.ico
  console.log('Generating public/favicon.ico with 16, 32, 48px icons...');
  const icoBuffer = createIcoFromPngs(pngBuffers);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log('  ✓ Generated public/favicon.ico');

  await browser.close();
  console.log('\nAll luxury favicon and webmanifest assets successfully generated!');
}

generate().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
