import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

function checkRectOverlap(r1, r2) {
  return !(
    r1.right <= r2.left ||
    r1.left >= r2.right ||
    r1.bottom <= r2.top ||
    r1.top >= r2.bottom
  );
}

async function verifyModal() {
  console.log('🚀 Starting Comprehensive Footer Modal Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Test on user's exact mobile viewport 393x852
    await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 30000 });

    // Open Privacy Policy modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const btn = btns.find(b => b.textContent.includes('Privacy Policy'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Capture Privacy tab
    const privPath = path.join(ARTIFACT_DIR, 'qa-footer-modal-privacy-fixed.png');
    await page.screenshot({ path: privPath });
    console.log(`📸 Privacy modal screenshot saved: ${privPath}`);

    // Switch to Terms tab
    await page.evaluate(() => {
      const modal = document.querySelector('div[role="dialog"]');
      const termsBtn = Array.from(modal.querySelectorAll('button')).find(b => b.textContent.includes('Terms'));
      if (termsBtn) termsBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const termsPath = path.join(ARTIFACT_DIR, 'qa-footer-modal-terms-fixed.png');
    await page.screenshot({ path: termsPath });
    console.log(`📸 Terms modal screenshot saved: ${termsPath}`);

    // Switch to Security tab
    await page.evaluate(() => {
      const modal = document.querySelector('div[role="dialog"]');
      const secBtn = Array.from(modal.querySelectorAll('button')).find(b => b.textContent.includes('Security'));
      if (secBtn) secBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    const secPath = path.join(ARTIFACT_DIR, 'qa-footer-modal-security-fixed.png');
    await page.screenshot({ path: secPath });
    console.log(`📸 Security modal screenshot saved: ${secPath}`);

    // Run overlap and overflow assertions
    const evaluation = await page.evaluate(() => {
      const modal = document.querySelector('div[role="dialog"] > div');
      const closeBtn = modal.querySelector('button[aria-label="Close modal"]');
      const cr = closeBtn.getBoundingClientRect();
      const tabBtns = Array.from(modal.querySelectorAll('button')).filter(b => 
        b.textContent.includes('Privacy') || b.textContent.includes('Terms') || b.textContent.includes('Security')
      );

      const tabRects = tabBtns.map(b => {
        const r = b.getBoundingClientRect();
        return {
          text: b.textContent.trim(),
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
          height: r.height,
        };
      });

      const hasHorizontalOverflow = modal.scrollWidth > modal.clientWidth + 2;

      return {
        hasHorizontalOverflow,
        modalScrollWidth: modal.scrollWidth,
        modalClientWidth: modal.clientWidth,
        closeRect: { left: cr.left, right: cr.right, top: cr.top, bottom: cr.bottom },
        tabRects
      };
    });

    console.log('Evaluation:', JSON.stringify(evaluation, null, 2));

    // Assert zero overlap between close button and any tab button
    for (const tab of evaluation.tabRects) {
      const overlaps = checkRectOverlap(evaluation.closeRect, tab);
      if (overlaps) {
        throw new Error(`❌ Close button overlaps with tab: "${tab.text}"!`);
      }
    }
    console.log('✅ Overlap Check: PASSED (Close button and tabs have zero overlap)');

    // Assert zero horizontal overflow
    if (evaluation.hasHorizontalOverflow) {
      throw new Error(`❌ Modal has horizontal overflow: scrollWidth (${evaluation.modalScrollWidth}) > clientWidth (${evaluation.modalClientWidth})!`);
    }
    console.log('✅ Horizontal Overflow Check: PASSED (No overflow)');

    console.log('🎉 ALL MODAL RESPONSIVE CHECKS PASSED PERFECTLY!');
  } finally {
    await browser.close();
  }
}

verifyModal().catch(err => {
  console.error(err);
  process.exit(1);
});
