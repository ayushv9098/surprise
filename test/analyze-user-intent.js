import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const SCREENSHOT_213038 = 'C:\\Users\\hp\\Pictures\\Screenshots\\Screenshot 2026-10-23 213038.png';
const SCREENSHOT_212020 = 'C:\\Users\\hp\\Pictures\\Screenshots\\Screenshot 2026-10-23 212020.png';
const SCREENSHOT_180514 = 'C:\\Users\\hp\\Pictures\\Screenshots\\Screenshot 2026-10-24 180514.png';

async function main() {
  console.log('=== STARTING USER INTENT & COLOR ANALYSIS ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-web-security']
  });

  try {
    const page = await browser.newPage();

    // 1. Inspect Screenshot 2026-10-23 213038.png
    console.log(`\n--- 1. Analyzing Screenshot 2026-10-23 213038.png ---`);
    if (fs.existsSync(SCREENSHOT_213038)) {
      const b64_213038 = fs.readFileSync(SCREENSHOT_213038).toString('base64');
      await page.goto('about:blank');
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <body style="margin:0; background:#111;">
          <img id="img213038" src="data:image/png;base64,${b64_213038}" />
          <canvas id="c"></canvas>
        </body>
        </html>
      `);

      const imgInfo = await page.evaluate(() => {
        const img = document.getElementById('img213038');
        const c = document.getElementById('c');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(0, 0, c.width, c.height).data;

        // Find agentation highlight or red/pink boxes, or dark blue card areas
        // Let's sample colors in a grid across the entire image
        const colorSamples = [];
        const stepX = Math.floor(c.width / 20);
        const stepY = Math.floor(c.height / 20);

        // Also detect dominant colors
        const colorCounts = {};
        for (let y = 0; y < c.height; y += 4) {
          for (let x = 0; x < c.width; x += 4) {
            const idx = (y * c.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            // Quantize to 16
            const qr = Math.round(r / 16) * 16;
            const qg = Math.round(g / 16) * 16;
            const qb = Math.round(b / 16) * 16;
            const k = `#${qr.toString(16).padStart(2,'0')}${qg.toString(16).padStart(2,'0')}${qb.toString(16).padStart(2,'0')}`;
            colorCounts[k] = (colorCounts[k] || 0) + 1;
          }
        }

        const sortedColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([hex, count]) => ({ hex, percentage: ((count / ((c.width / 4) * (c.height / 4))) * 100).toFixed(1) + '%' }));

        return {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          topDominantColors: sortedColors,
        };
      });

      console.log('Image dimensions:', imgInfo.naturalWidth, 'x', imgInfo.naturalHeight);
      console.log('Top Dominant quantized colors in 213038:', imgInfo.topDominantColors);

      // Save a rendered full view of 213038
      await page.setViewport({ width: imgInfo.naturalWidth, height: imgInfo.naturalHeight });
      const outPath213038 = path.join(__dirname, 'view-213038-inspected.png');
      await page.screenshot({ path: outPath213038 });
      console.log(`Saved screenshot view to: ${outPath213038}`);
    } else {
      console.log('Screenshot 213038 does not exist at path:', SCREENSHOT_213038);
    }

    // 2. Inspect Screenshot 2026-10-23 212020.png
    console.log(`\n--- 2. Analyzing Screenshot 2026-10-23 212020.png ---`);
    if (fs.existsSync(SCREENSHOT_212020)) {
      const b64_212020 = fs.readFileSync(SCREENSHOT_212020).toString('base64');
      await page.goto('about:blank');
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <body style="margin:0; background:#111;">
          <img id="img212020" src="data:image/png;base64,${b64_212020}" />
          <canvas id="c"></canvas>
        </body>
        </html>
      `);

      const imgInfo2 = await page.evaluate(() => {
        const img = document.getElementById('img212020');
        const c = document.getElementById('c');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(0, 0, c.width, c.height).data;
        const colorCounts = {};
        for (let y = 0; y < c.height; y += 4) {
          for (let x = 0; x < c.width; x += 4) {
            const idx = (y * c.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const qr = Math.round(r / 16) * 16;
            const qg = Math.round(g / 16) * 16;
            const qb = Math.round(b / 16) * 16;
            const k = `#${qr.toString(16).padStart(2,'0')}${qg.toString(16).padStart(2,'0')}${qb.toString(16).padStart(2,'0')}`;
            colorCounts[k] = (colorCounts[k] || 0) + 1;
          }
        }

        const sortedColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([hex, count]) => ({ hex, percentage: ((count / ((c.width / 4) * (c.height / 4))) * 100).toFixed(1) + '%' }));

        return {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          topDominantColors: sortedColors,
        };
      });

      console.log('Image dimensions 212020:', imgInfo2.naturalWidth, 'x', imgInfo2.naturalHeight);
      console.log('Top Dominant quantized colors in 212020:', imgInfo2.topDominantColors);

      await page.setViewport({ width: imgInfo2.naturalWidth, height: imgInfo2.naturalHeight });
      const outPath212020 = path.join(__dirname, 'view-212020-inspected.png');
      await page.screenshot({ path: outPath212020 });
      console.log(`Saved screenshot view to: ${outPath212020}`);
    }

    // 3. Inspect Screenshot 2026-10-24 180514.png (Latest screenshot from user today!)
    console.log(`\n--- 3. Analyzing Screenshot 2026-10-24 180514.png (Latest today) ---`);
    if (fs.existsSync(SCREENSHOT_180514)) {
      const b64_180514 = fs.readFileSync(SCREENSHOT_180514).toString('base64');
      await page.goto('about:blank');
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <body style="margin:0; background:#111;">
          <img id="img180514" src="data:image/png;base64,${b64_180514}" />
          <canvas id="c"></canvas>
        </body>
        </html>
      `);

      const imgInfo3 = await page.evaluate(() => {
        const img = document.getElementById('img180514');
        const c = document.getElementById('c');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Sample regions:
        // Left side cards area: x: 100 to 500, y: 150 to 500
        // Check pixel colors inside the Royal Sapphire preview card in the browser
        // Let's sample specific points
        const samplePoint = (x, y) => {
          const p = ctx.getImageData(x, y, 1, 1).data;
          return {
            x, y,
            rgb: `rgb(${p[0]}, ${p[1]}, ${p[2]})`,
            hex: '#' + [p[0], p[1], p[2]].map(v => v.toString(16).padStart(2, '0')).join('')
          };
        };

        return {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          samples: [
            samplePoint(Math.round(c.width * 0.15), Math.round(c.height * 0.35)),
            samplePoint(Math.round(c.width * 0.25), Math.round(c.height * 0.35)),
            samplePoint(Math.round(c.width * 0.35), Math.round(c.height * 0.35)),
            samplePoint(Math.round(c.width * 0.75), Math.round(c.height * 0.40)), // phone preview
            samplePoint(Math.round(c.width * 0.75), Math.round(c.height * 0.60)), // phone card
          ]
        };
      });

      console.log('Image dimensions 180514:', imgInfo3.naturalWidth, 'x', imgInfo3.naturalHeight);
      console.log('Sample points in 180514:', imgInfo3.samples);
    }

  } finally {
    await browser.close();
  }

  // 4. Inspect templates.js data and all SVGs
  console.log(`\n--- 4. Template Configurations & Colors ---`);
  const templatesFile = path.resolve(__dirname, '../src/data/templates.js');
  const templatesContent = fs.readFileSync(templatesFile, 'utf8');

  // Extract templates info
  console.log('Checking TEMPLATES definitions...');
  const templateRegex = /id:\s*'([^']+)',[\s\S]*?name:\s*'([^']+)',[\s\S]*?accentColor:\s*'([^']+)',[\s\S]*?themeClass:\s*'([^']+)',[\s\S]*?themeId:\s*'([^']+)',[\s\S]*?gradientBg:\s*'([^']+)',[\s\S]*?previewImage:\s*'([^']+)'/g;

  let match;
  const tmpls = [];
  while ((match = templateRegex.exec(templatesContent)) !== null) {
    tmpls.push({
      id: match[1],
      name: match[2],
      accentColor: match[3],
      themeClass: match[4],
      themeId: match[5],
      gradientBg: match[6],
      previewImage: match[7]
    });
  }
  console.log(`Found ${tmpls.length} templates:`);
  console.table(tmpls.slice(0, 10));

  // 5. Inspect royal-sapphire.svg vs other SVG files
  console.log(`\n--- 5. Inspecting royal-sapphire.svg ---`);
  const royalSvgPath = path.resolve(__dirname, '../public/previews/royal-sapphire.svg');
  if (fs.existsSync(royalSvgPath)) {
    const royalSvg = fs.readFileSync(royalSvgPath, 'utf8');
    console.log('royal-sapphire.svg length:', royalSvg.length);
    // Find linearGradient stops
    const gradMatches = [...royalSvg.matchAll(/<stop offset="([^"]+)" stop-color="([^"]+)"(?:\s+stop-opacity="([^"]+)")?/g)];
    console.log('Gradients in royal-sapphire.svg:');
    gradMatches.forEach(m => console.log(`  stop offset="${m[1]}" stop-color="${m[2]}" ${m[3] ? `stop-opacity="${m[3]}"` : ''}`));
  }

  console.log('\n=== ANALYSIS SCRIPT COMPLETED ===');
}

main().catch(err => {
  console.error('Fatal in main:', err);
  process.exit(1);
});
