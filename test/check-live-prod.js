import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function investigateTarget(browser, url, label) {
  console.log(`\n======================================================`);
  console.log(`[${label.toUpperCase()}] Starting Investigation for: ${url}`);
  console.log(`======================================================`);

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });

  // STRICTLY DISABLE BROWSER CACHE
  await page.setCacheEnabled(false);

  const networkLogs = [];

  page.on('response', async (response) => {
    const reqUrl = response.url();
    if (
      reqUrl.includes('royal-sapphire.svg') ||
      reqUrl.includes('/assets/index') ||
      reqUrl === url ||
      reqUrl === `${url}/`
    ) {
      const headers = response.headers();
      networkLogs.push({
        url: reqUrl,
        status: response.status(),
        statusText: response.statusText(),
        headers: {
          'cache-control': headers['cache-control'] || null,
          'etag': headers['etag'] || null,
          'last-modified': headers['last-modified'] || null,
          'x-vercel-cache': headers['x-vercel-cache'] || null,
          'age': headers['age'] || null,
          'content-type': headers['content-type'] || null,
          'content-length': headers['content-length'] || null,
          'date': headers['date'] || null,
        }
      });
    }
  });

  // Navigate to target
  console.log(`[${label}] Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Check if Home or Builder
  let currentTitle = await page.title();
  console.log(`[${label}] Page loaded. Title: "${currentTitle}"`);

  // Step 1: Click "Start Creating"
  console.log(`[${label}] Clicking "Start Creating"...`);
  const clickedStart = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => (b.textContent || '').includes('Start Creating'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log(`[${label}] "Start Creating" clicked: ${clickedStart}`);

  // Wait for modal
  await new Promise(r => setTimeout(r, 800));

  // Step 2: Click "For a Boy"
  console.log(`[${label}] Selecting "For a Boy"...`);
  const clickedBoy = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const boyBtn = btns.find(b => 
      (b.textContent || '').includes('For a Boy') || 
      (b.textContent || '').includes('Select boy style') ||
      (b.textContent || '').includes('Him')
    );
    if (boyBtn) {
      boyBtn.click();
      return true;
    }
    return false;
  });
  console.log(`[${label}] "For a Boy" clicked: ${clickedBoy}`);

  // Wait for Builder Studio to load
  await new Promise(r => setTimeout(r, 2000));
  await page.waitForSelector('.grid', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  // Take full builder page screenshot
  const fullScreenshotPath = path.join(__dirname, `${label}-builder-full.png`);
  await page.screenshot({ path: fullScreenshotPath, fullPage: false });
  console.log(`[${label}] Saved full screenshot: ${fullScreenshotPath}`);

  // Locate the template grid container
  const gridHandle = await page.evaluateHandle(() => {
    const grids = Array.from(document.querySelectorAll('div.grid'));
    return grids.find(g => g.textContent.includes('Royal Sapphire') || g.textContent.includes('Choose a Style')) || grids[0];
  });

  const gridScreenshotPath = path.join(__dirname, `${label}-template-grid.png`);
  if (gridHandle && (await gridHandle.asElement())) {
    await (await gridHandle.asElement()).screenshot({ path: gridScreenshotPath });
    console.log(`[${label}] Saved grid screenshot: ${gridScreenshotPath}`);
  }

  // Locate Royal Sapphire card specifically
  const cardData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.grid > div'));
    const royalCard = cards.find(c => (c.textContent || '').includes('Royal Sapphire'));
    if (!royalCard) return null;

    const img = royalCard.querySelector('img');
    const imgWrapper = img ? img.parentElement : null;

    // Check classes
    const wrapperClass = imgWrapper ? imgWrapper.className : '';
    const cardClass = royalCard.className;

    // Get computed styles
    const computedWrapper = imgWrapper ? window.getComputedStyle(imgWrapper) : null;

    return {
      found: true,
      cardClass,
      wrapperClass,
      hasFromBlue50: wrapperClass.includes('from-blue-50'),
      hasFromBlue900: wrapperClass.includes('from-blue-900'),
      imgSrc: img ? img.src : null,
      wrapperBgImage: computedWrapper ? computedWrapper.backgroundImage : null,
      wrapperBgColor: computedWrapper ? computedWrapper.backgroundColor : null,
      cardRect: royalCard.getBoundingClientRect(),
      imgRect: img ? img.getBoundingClientRect() : null,
    };
  });

  console.log(`[${label}] Card DOM analysis:`, JSON.stringify(cardData, null, 2));

  // Take Royal Sapphire card screenshot
  const royalCardHandle = await page.evaluateHandle(() => {
    const cards = Array.from(document.querySelectorAll('.grid > div'));
    return cards.find(c => (c.textContent || '').includes('Royal Sapphire'));
  });

  const cardScreenshotPath = path.join(__dirname, `${label}-royal-sapphire-card.png`);
  let cardScreenshotBase64 = null;
  if (royalCardHandle && (await royalCardHandle.asElement())) {
    const cardEl = await royalCardHandle.asElement();
    cardScreenshotBase64 = await cardEl.screenshot({ encoding: 'base64' });
    fs.writeFileSync(cardScreenshotPath, Buffer.from(cardScreenshotBase64, 'base64'));
    console.log(`[${label}] Saved Royal Sapphire card screenshot: ${cardScreenshotPath}`);
  }

  // Take Royal Sapphire preview image container screenshot
  const previewContainerHandle = await page.evaluateHandle(() => {
    const cards = Array.from(document.querySelectorAll('.grid > div'));
    const royalCard = cards.find(c => (c.textContent || '').includes('Royal Sapphire'));
    if (!royalCard) return null;
    const img = royalCard.querySelector('img');
    return img ? img.parentElement : null;
  });

  const previewScreenshotPath = path.join(__dirname, `${label}-royal-sapphire-preview-crop.png`);
  let previewScreenshotBase64 = null;
  if (previewContainerHandle && (await previewContainerHandle.asElement())) {
    const prevEl = await previewContainerHandle.asElement();
    previewScreenshotBase64 = await prevEl.screenshot({ encoding: 'base64' });
    fs.writeFileSync(previewScreenshotPath, Buffer.from(previewScreenshotBase64, 'base64'));
    console.log(`[${label}] Saved Royal Sapphire preview crop: ${previewScreenshotPath}`);
  }

  // Perform precise pixel sampling on the rendered preview crop image
  let sampledPixels = null;
  if (previewScreenshotBase64) {
    sampledPixels = await page.evaluate(async (base64) => {
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = 'data:image/png;base64,' + base64;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      const sampleAt = (xPct, yPct, desc) => {
        const x = Math.max(0, Math.min(img.width - 1, Math.floor(img.width * xPct)));
        const y = Math.max(0, Math.min(img.height - 1, Math.floor(img.height * yPct)));
        const d = ctx.getImageData(x, y, 1, 1).data;
        const r = d[0], g = d[1], b = d[2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        const luminance = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
        const isDark = luminance < 100;
        return {
          description: desc,
          x,
          y,
          r,
          g,
          b,
          hex,
          luminance,
          aesthetic: isDark ? 'DARK NAVY' : 'LIGHT SOFT AESTHETIC'
        };
      };

      return {
        imageWidth: img.width,
        imageHeight: img.height,
        samples: [
          sampleAt(0.04, 0.04, 'Top-Left Canvas Background Corner'),
          sampleAt(0.96, 0.04, 'Top-Right Canvas Background Corner'),
          sampleAt(0.04, 0.96, 'Bottom-Left Canvas Background Corner'),
          sampleAt(0.96, 0.96, 'Bottom-Right Canvas Background Corner'),
          sampleAt(0.50, 0.08, 'Top-Center Canvas Glow / Pill Region'),
          sampleAt(0.50, 0.50, 'Center of Hero Card Inside Preview'),
          sampleAt(0.25, 0.50, 'Polaroid Photo Region (Left)'),
          sampleAt(0.75, 0.50, 'Right Column Action Button Area'),
        ]
      };
    }, previewScreenshotBase64);

    console.log(`[${label}] Pixel Color Samples:`, JSON.stringify(sampledPixels, null, 2));
  }

  // Fetch raw SVG content to verify exact gradient stops in file
  const svgAnalysis = await page.evaluate(async () => {
    try {
      const resp = await fetch('/previews/royal-sapphire.svg', { cache: 'no-store' });
      const text = await resp.text();
      const hasDarkStop = text.includes('#091024') || text.includes('#0f172a');
      const hasLightStop = text.includes('#f8fbff') || text.includes('#e8f2fe');

      // extract gradient stops
      const gradMatch = text.match(/<linearGradient id="royal-sapphire-canvasBg"[^>]*>([\s\S]*?)<\/linearGradient>/);
      const stops = gradMatch ? gradMatch[1].trim() : 'NOT_FOUND';

      return {
        fetchStatus: resp.status,
        hasDarkStop,
        hasLightStop,
        canvasBgStops: stops
      };
    } catch (e) {
      return { error: e.message };
    }
  });

  console.log(`[${label}] SVG Content Analysis:`, JSON.stringify(svgAnalysis, null, 2));

  await page.close();

  return {
    target: label,
    url,
    cardData,
    networkLogs,
    sampledPixels,
    svgAnalysis,
    screenshots: {
      full: fullScreenshotPath,
      grid: gridScreenshotPath,
      card: cardScreenshotPath,
      previewCrop: previewScreenshotPath,
    }
  };
}

async function main() {
  console.log('Launching browser with chrome:', CHROME_PATH);
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    protocolTimeout: 60000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const prodResults = await investigateTarget(browser, 'https://wishcraft-surprise.vercel.app', 'prod');
    const localResults = await investigateTarget(browser, 'http://localhost:5174', 'local');

    const report = {
      timestamp: new Date().toISOString(),
      production: prodResults,
      localhost: localResults,
      comparison: {
        prodWrapperClass: prodResults.cardData?.wrapperClass,
        localWrapperClass: localResults.cardData?.wrapperClass,
        prodHasFromBlue50: prodResults.cardData?.hasFromBlue50,
        localHasFromBlue50: localResults.cardData?.hasFromBlue50,
        prodHasFromBlue900: prodResults.cardData?.hasFromBlue900,
        localHasFromBlue900: localResults.cardData?.hasFromBlue900,
        prodSvgStops: prodResults.svgAnalysis?.canvasBgStops,
        localSvgStops: localResults.svgAnalysis?.canvasBgStops,
        prodIsLightAesthetic: prodResults.sampledPixels?.samples?.[0]?.aesthetic === 'LIGHT SOFT AESTHETIC',
        localIsLightAesthetic: localResults.sampledPixels?.samples?.[0]?.aesthetic === 'LIGHT SOFT AESTHETIC',
      }
    };

    const reportPath = path.join(__dirname, 'check-live-prod-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n======================================================`);
    console.log(`Comprehensive Investigation Report written to: ${reportPath}`);
    console.log(`======================================================\n`);
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Investigation failed:', err);
  process.exit(1);
});
