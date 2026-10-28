import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_PATH = 'C:/Users/hp/.gemini/antigravity-cli/brain/e0e6b5bc-9361-4005-afae-ef68c72d0d8f/qa-footer-contrast-1280x551.png';

async function verifyFooterContrast() {
  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 551 });
    console.log('Viewport set to 1280x551');

    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });
    console.log('Page loaded');

    // Wait for footer to be present
    const footerHandle = await page.waitForSelector('footer', { visible: true, timeout: 5000 });
    
    // Scroll to footer
    await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'instant', block: 'end' });
      }
    });
    await new Promise(r => setTimeout(r, 600));

    // Extract computed styles and resolve exact sRGB & contrast ratios in browser
    const auditData = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      const footerStyles = window.getComputedStyle(footer);

      // Helper to convert any CSS color string (oklch, hex, rgb) to [r, g, b]
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      function colorToRgb(cssColor) {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = cssColor;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b];
      }

      function getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      function getContrastRatio(rgb1, rgb2) {
        const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
        const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
      }

      const bgFAF6F3 = colorToRgb('#FAF6F3');
      const bgFFFDFB = colorToRgb('#FFFDFB');

      function analyzeElement(el) {
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        const rawColor = cs.color;
        const rgb = colorToRgb(rawColor);
        const ratioBottom = getContrastRatio(rgb, bgFAF6F3);
        const ratioTop = getContrastRatio(rgb, bgFFFDFB);
        return {
          text: el.innerText ? el.innerText.trim() : el.textContent.trim(),
          computedColor: rawColor,
          sRgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          fontFamily: cs.fontFamily,
          contrastAgainstFAF6F3: `${ratioBottom.toFixed(2)}:1`,
          contrastAgainstFFFDFB: `${ratioTop.toFixed(2)}:1`,
          wcagAA_NormalText: ratioBottom >= 4.5 ? 'PASS (≥ 4.5:1)' : 'FAIL (< 4.5:1)',
          wcagAA_LargeOrBoldText: ratioBottom >= 3.0 ? 'PASS (≥ 3.0:1)' : 'FAIL (< 3.0:1)',
          className: el.className
        };
      }

      const trustEl = footer.querySelector('.max-w-3xl p');
      const buttons = Array.from(footer.querySelectorAll('.max-w-3xl button'));
      const attrEl = footer.querySelector('.max-w-3xl > div:last-child');
      const attrLink = attrEl ? attrEl.querySelector('a') : null;

      return {
        footer: {
          backgroundColor: footerStyles.backgroundColor,
          backgroundImage: footerStyles.backgroundImage,
        },
        trustStatement: analyzeElement(trustEl),
        buttons: buttons.map(b => analyzeElement(b)),
        attribution: analyzeElement(attrEl),
        attributionLink: analyzeElement(attrLink)
      };
    });

    console.log('--- COMPREHENSIVE CONTRAST AUDIT ---');
    console.log(JSON.stringify(auditData, null, 2));

    // Ensure output directory exists
    const dir = path.dirname(ARTIFACT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Take screenshot of footer element
    await footerHandle.screenshot({ path: ARTIFACT_PATH });
    console.log(`Saved footer screenshot to: ${ARTIFACT_PATH}`);

    // Scrolled viewport screenshot
    const fullViewportPath = path.join(dir, 'qa-footer-viewport-1280x551.png');
    await page.screenshot({ path: fullViewportPath });
    console.log(`Saved scrolled viewport screenshot to: ${fullViewportPath}`);

    // Write audit summary json
    const summaryJsonPath = path.join(dir, 'qa-footer-contrast-summary.json');
    fs.writeFileSync(summaryJsonPath, JSON.stringify(auditData, null, 2));

    console.log('Verification completed successfully!');
    return auditData;
  } finally {
    await browser.close();
  }
}

verifyFooterContrast().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
