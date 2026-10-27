import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const INDEX_HTML_PATH = path.join(ROOT, 'index.html');

/**
 * Robust cross-platform Chrome / Chromium / Edge executable resolver
 */
export function findChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const localAppData = process.env.LOCALAPPDATA || '';
  const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
  const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

  const candidates = [
    path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ];

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
}

/**
 * Dearly Imperial Jewel Squircle & Keepsake Heart Vector Mark
 * Matches src/components/common/DearlyLogo.jsx 1:1
 */
export const DEFAULT_SVG_FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
  <defs>
    <linearGradient id="dearly-fav-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3366"/>
      <stop offset="38%" stop-color="#E11D48"/>
      <stop offset="80%" stop-color="#BE123C"/>
      <stop offset="100%" stop-color="#881337"/>
    </linearGradient>
    <linearGradient id="dearly-fav-rim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.85"/>
      <stop offset="45%" stop-color="#FFA8BA" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#881337" stop-opacity="0.1"/>
    </linearGradient>
  </defs>

  <!-- Full Floating Keepsake Heart Silhouette (100% Transparent Canvas) -->
  <path
    d="M 16 5.8 C 13.8 2.2 8.6 1.2 4.6 4.8 C 0.8 8.2 0.8 14.2 4.4 18.4 L 16 29.5 L 27.6 18.4 C 31.2 14.2 31.2 8.2 27.4 4.8 C 23.4 1.2 18.2 2.2 16 5.8 Z"
    fill="url(#dearly-fav-grad)"
  />

  <!-- Specular Rim Light Stroke -->
  <path
    d="M 16 5.8 C 13.8 2.2 8.6 1.2 4.6 4.8 C 0.8 8.2 0.8 14.2 4.4 18.4 L 16 29.5 L 27.6 18.4 C 31.2 14.2 31.2 8.2 27.4 4.8 C 23.4 1.2 18.2 2.2 16 5.8 Z"
    stroke="url(#dearly-fav-rim)"
    stroke-width="1.2"
  />

  <!-- Gloss Reflection Droplet on Left Lobe -->
  <ellipse cx="9" cy="9.5" rx="4.2" ry="2.4" transform="rotate(-35 9 9.5)" fill="#FFFFFF" fill-opacity="0.6"/>

  <!-- Signature 4-Point Diamond Sparkle Star (✦) inside right lobe -->
  <path d="M 23 7.5 Q 23 11 19.5 11 Q 23 11 23 14.5 Q 23 11 26.5 11 Q 23 11 23 7.5 Z" fill="#FFFFFF"/>
  <circle cx="23" cy="11" r="0.9" fill="#FFF1F3"/>
</svg>`;

/**
 * Full-bleed app mark for iOS Apple Touch Icon and Android Chrome PWA Maskable Icon.
 * Complies with Apple HIG (square icon with no transparency, iOS applies squircle mask)
 * and W3C WebApp Manifest maskable icon spec (background extends to 100% of canvas).
 */
export const DEFAULT_SVG_APP_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
  <defs>
    <linearGradient id="app-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4C0519"/>
      <stop offset="60%" stop-color="#26020D"/>
      <stop offset="100%" stop-color="#140106"/>
    </linearGradient>
    <radialGradient id="app-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#E11D48" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#E11D48" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="app-heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3366"/>
      <stop offset="38%" stop-color="#E11D48"/>
      <stop offset="80%" stop-color="#BE123C"/>
      <stop offset="100%" stop-color="#881337"/>
    </linearGradient>
    <linearGradient id="app-heart-rim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.85"/>
      <stop offset="45%" stop-color="#FFA8BA" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#881337" stop-opacity="0.1"/>
    </linearGradient>
  </defs>

  <!-- Rich Velvet Background -->
  <rect width="32" height="32" fill="url(#app-bg)"/>
  <circle cx="16" cy="16" r="14" fill="url(#app-glow)"/>

  <!-- Centered Keepsake Heart Mark -->
  <g transform="translate(1.6, 1.6) scale(0.9)">
    <path
      d="M 16 5.8 C 13.8 2.2 8.6 1.2 4.6 4.8 C 0.8 8.2 0.8 14.2 4.4 18.4 L 16 29.5 L 27.6 18.4 C 31.2 14.2 31.2 8.2 27.4 4.8 C 23.4 1.2 18.2 2.2 16 5.8 Z"
      fill="url(#app-heart-grad)"
    />
    <path
      d="M 16 5.8 C 13.8 2.2 8.6 1.2 4.6 4.8 C 0.8 8.2 0.8 14.2 4.4 18.4 L 16 29.5 L 27.6 18.4 C 31.2 14.2 31.2 8.2 27.4 4.8 C 23.4 1.2 18.2 2.2 16 5.8 Z"
      stroke="url(#app-heart-rim)"
      stroke-width="1.2"
    />
    <ellipse cx="9" cy="9.5" rx="4.2" ry="2.4" transform="rotate(-35 9 9.5)" fill="#FFFFFF" fill-opacity="0.6"/>
    <path d="M 23 7.5 Q 23 11 19.5 11 Q 23 11 23 14.5 Q 23 11 26.5 11 Q 23 11 23 7.5 Z" fill="#FFFFFF"/>
    <circle cx="23" cy="11" r="0.9" fill="#FFF1F3"/>
  </g>
</svg>`;

/**
 * Standard ICO format builder wrapping 16px, 32px, 48px PNG buffers
 * Complies with Microsoft ICO container spec embedding modern PNG streams
 */
export function createIcoFromPngs(pngBuffers) {
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
    entry.writeUInt8(0, 2); // color palette (0 = no palette / >= 8bpp)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel (32-bit RGBA)
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    offset += item.buffer.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

/**
 * Validates binary structure of an ICO buffer
 */
export function verifyIcoBuffer(icoBuffer) {
  if (!icoBuffer || icoBuffer.length < 6) {
    throw new Error('ICO buffer too small');
  }
  const reserved = icoBuffer.readUInt16LE(0);
  const type = icoBuffer.readUInt16LE(2);
  const count = icoBuffer.readUInt16LE(4);

  if (reserved !== 0 || type !== 1) {
    throw new Error(`Invalid ICO header: reserved=${reserved}, type=${type}`);
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    const offset = 6 + i * 16;
    const w = icoBuffer.readUInt8(offset) || 256;
    const h = icoBuffer.readUInt8(offset + 1) || 256;
    const size = icoBuffer.readUInt32LE(offset + 8);
    const imgOffset = icoBuffer.readUInt32LE(offset + 12);
    const magic = icoBuffer.subarray(imgOffset, imgOffset + 8).toString('hex');
    const isPng = magic === '89504e470d0a1a0a';
    results.push({ index: i, width: w, height: h, size, imgOffset, isPng });
  }

  return { count, images: results };
}

/**
 * Updates index.html favicon tags with cache-busting query parameter ?v=<version>
 */
export function updateIndexHtmlFaviconVersion(version = '2') {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.warn(`[Favicon Pipeline] index.html not found at ${INDEX_HTML_PATH}`);
    return false;
  }

  let html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

  // Regex to match existing favicon & manifest link tags
  const vStr = version ? `?v=${version}` : '';
  
  const replacements = [
    { pattern: /<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg(?:\?v=[^"']*)?" \/>/g, replacement: `<link rel="icon" type="image/svg+xml" href="/favicon.svg${vStr}" />` },
    { pattern: /<link rel="icon" type="image\/png" sizes="48x48" href="\/favicon-48x48\.png(?:\?v=[^"']*)?" \/>/g, replacement: `<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png${vStr}" />` },
    { pattern: /<link rel="icon" type="image\/png" sizes="32x32" href="\/favicon-32x32\.png(?:\?v=[^"']*)?" \/>/g, replacement: `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png${vStr}" />` },
    { pattern: /<link rel="icon" type="image\/png" sizes="16x16" href="\/favicon-16x16\.png(?:\?v=[^"']*)?" \/>/g, replacement: `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png${vStr}" />` },
    { pattern: /<link rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png(?:\?v=[^"']*)?" \/>/g, replacement: `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png${vStr}" />` },
    { pattern: /<link rel="shortcut icon" href="\/favicon\.ico(?:\?v=[^"']*)?" \/>/g, replacement: `<link rel="shortcut icon" href="/favicon.ico${vStr}" />` },
    { pattern: /<link rel="manifest" href="\/site\.webmanifest(?:\?v=[^"']*)?" \/>/g, replacement: `<link rel="manifest" href="/site.webmanifest${vStr}" />` }
  ];

  let modified = false;
  for (const { pattern, replacement } of replacements) {
    if (pattern.test(html)) {
      html = html.replace(pattern, replacement);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(INDEX_HTML_PATH, html, 'utf8');
    console.log(`  ✓ Updated index.html favicon tags with version bust "${vStr}"`);
    return true;
  } else {
    console.log('  ℹ index.html tags already up to date.');
    return false;
  }
}

/**
 * Normalizes input SVG, ensuring proper shape-rendering and viewBox attributes
 */
function normalizeSvg(svgString) {
  let cleaned = svgString.trim();
  if (!cleaned.startsWith('<svg')) {
    const idx = cleaned.indexOf('<svg');
    if (idx !== -1) cleaned = cleaned.substring(idx);
  }

  // Ensure shape-rendering is set for razor-sharp antialiasing
  if (!cleaned.includes('shape-rendering=')) {
    cleaned = cleaned.replace('<svg ', '<svg shape-rendering="geometricPrecision" text-rendering="geometricPrecision" ');
  }

  return cleaned;
}

/**
 * Master generator function:
 * Accepts any SVG geometry and produces the entire favicon & app icon suite.
 *
 * @param {Object} options
 * @param {string} [options.svgFavicon] - SVG string or file path for tab favicon (transparent corners)
 * @param {string} [options.svgAppIcon] - SVG string or file path for full-bleed app icon
 * @param {string} [options.version='2'] - Cache-busting version query string
 * @param {boolean} [options.updateHtml=true] - Whether to update index.html with ?v=<version>
 * @param {string} [options.themeColor='#E11D48'] - Web app manifest theme color
 * @param {string} [options.outputDir=PUBLIC_DIR] - Output directory
 */
export async function generateFavicons(options = {}) {
  const {
    svgFavicon: rawFaviconSvg,
    svgAppIcon: rawAppIconSvg,
    version = '2',
    updateHtml = true,
    themeColor = '#E11D48',
    outputDir = PUBLIC_DIR
  } = options;

  console.log('=====================================================');
  console.log('  Dearly Technical Favicon & Cache Asset Pipeline    ');
  console.log('=====================================================');

  // 1. Resolve Favicon SVG geometry
  let svgFavicon = DEFAULT_SVG_FAVICON;
  if (rawFaviconSvg) {
    if (fs.existsSync(rawFaviconSvg)) {
      console.log(`[Pipeline] Loading Favicon SVG from file: ${rawFaviconSvg}`);
      svgFavicon = fs.readFileSync(rawFaviconSvg, 'utf8');
    } else if (rawFaviconSvg.includes('<svg')) {
      console.log('[Pipeline] Using provided inline Favicon SVG geometry');
      svgFavicon = rawFaviconSvg;
    }
  }
  svgFavicon = normalizeSvg(svgFavicon);

  // 2. Resolve App Icon SVG geometry (or derive full-bleed version)
  let svgAppIcon = DEFAULT_SVG_APP_ICON;
  if (rawAppIconSvg) {
    if (fs.existsSync(rawAppIconSvg)) {
      console.log(`[Pipeline] Loading App Icon SVG from file: ${rawAppIconSvg}`);
      svgAppIcon = fs.readFileSync(rawAppIconSvg, 'utf8');
    } else if (rawAppIconSvg.includes('<svg')) {
      console.log('[Pipeline] Using provided inline App Icon SVG geometry');
      svgAppIcon = rawAppIconSvg;
    }
  } else if (rawFaviconSvg && !rawAppIconSvg) {
    // If only favicon SVG was supplied, use it directly (app wrapper ensures full-bleed)
    svgAppIcon = svgFavicon;
  }
  svgAppIcon = normalizeSvg(svgAppIcon);

  // 3. Write public/favicon.svg
  console.log(`1. Writing ${path.join(outputDir, 'favicon.svg')}...`);
  fs.writeFileSync(path.join(outputDir, 'favicon.svg'), svgFavicon, 'utf8');

  // 4. Write public/site.webmanifest
  console.log(`2. Writing ${path.join(outputDir, 'site.webmanifest')} (theme_color: ${themeColor})...`);
  const manifest = {
    name: 'Dearly — Keepsake & Surprise Websites',
    short_name: 'Dearly',
    description: 'Create heartfelt digital keepsake cards, surprise websites, anniversary letters, and memory scrapbooks in seconds.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFFDFB',
    theme_color: themeColor,
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
        src: '/favicon-48x48.png',
        sizes: '48x48',
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
  fs.writeFileSync(path.join(outputDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');

  // 5. Launch Chrome Puppeteer
  const chromePath = findChrome();
  console.log(`3. Launching Chrome Puppeteer via: ${chromePath}...`);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  });

  const page = await browser.newPage();

  // Tab Favicons (Transparent background outside squircle: 16x16, 32x32, 48x48)
  const tabFaviconHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
    #container { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
    svg { display: block; width: 100% !important; height: 100% !important; shape-rendering: geometricPrecision; }
  </style>
</head>
<body>
  <div id="container">
    ${svgFavicon}
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
    fs.writeFileSync(path.join(outputDir, file), buffer);
    console.log(`  ✓ Generated public/${file} (${size}x${size}, transparent antialiased edges)`);
    pngBuffers.push({ width: size, height: size, buffer });
  }

  // App Icons (Full-bleed compliant with Apple HIG & Android PWA Adaptive Launcher)
  const appIconHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #6B0A26;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    svg { display: block; width: 100% !important; height: 100% !important; shape-rendering: geometricPrecision; }
  </style>
</head>
<body>
  <div id="container">
    ${svgAppIcon}
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
    fs.writeFileSync(path.join(outputDir, file), buffer);
    console.log(`  ✓ Generated public/${file} (${size}x${size}, full-bleed jewel app mark)`);
  }

  await browser.close();

  // 6. Generate binary favicon.ico with 16, 32, 48px embedded
  console.log('4. Generating binary public/favicon.ico (16, 32, 48px embedded)...');
  const icoBuffer = createIcoFromPngs(pngBuffers);
  fs.writeFileSync(path.join(outputDir, 'favicon.ico'), icoBuffer);

  // 7. Verify ICO binary integrity
  const icoMeta = verifyIcoBuffer(icoBuffer);
  console.log(`  ✓ Generated public/favicon.ico (${icoBuffer.length} bytes, ${icoMeta.count} images verified)`);
  for (const img of icoMeta.images) {
    console.log(`    - Layer ${img.index}: ${img.width}x${img.height} (${img.size} bytes, PNG valid: ${img.isPng})`);
  }

  // 8. Update index.html cache-busting version tags if requested
  if (updateHtml) {
    console.log('5. Synchronizing index.html cache-busting headers/tags...');
    updateIndexHtmlFaviconVersion(version);
  }

  console.log('\n[Favicon Pipeline] Success! All favicon & PWA assets ready & cache-busted.');
  return {
    success: true,
    version,
    icoSize: icoBuffer.length,
    targets: [...tabTargets, ...appTargets, { size: 'multi', file: 'favicon.ico' }]
  };
}

// CLI entry point
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const args = process.argv.slice(2);
  let svgFaviconArg = null;
  let svgAppIconArg = null;
  let versionArg = '2';
  let updateHtmlArg = true;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--svg=')) {
      svgFaviconArg = arg.substring(6);
    } else if (arg === '--svg' && args[i + 1]) {
      svgFaviconArg = args[++i];
    } else if (arg.startsWith('--app-icon=')) {
      svgAppIconArg = arg.substring(11);
    } else if (arg.startsWith('--version=') || arg.startsWith('-v=')) {
      versionArg = arg.split('=')[1];
    } else if ((arg === '--version' || arg === '-v') && args[i + 1]) {
      versionArg = args[++i];
    } else if (arg === '--no-html') {
      updateHtmlArg = false;
    }
  }

  generateFavicons({
    svgFavicon: svgFaviconArg,
    svgAppIcon: svgAppIconArg,
    version: versionArg,
    updateHtml: updateHtmlArg
  }).catch(err => {
    console.error('[Favicon Pipeline] Error:', err);
    process.exit(1);
  });
}
