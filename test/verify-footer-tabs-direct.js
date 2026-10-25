import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

async function verifyTabs() {
  console.log('Testing Footer Tabs Direct Visibility on Mobile (393x852)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Mobile 393x852
    await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });

    // Click Privacy Policy in footer
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const btn = btns.find(b => b.textContent.includes('Privacy Policy'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Verify tabs dimensions and visibility
    const data = await page.evaluate(() => {
      const modal = document.querySelector('div[role="dialog"] > div');
      const tabsContainer = modal.querySelector('.grid.grid-cols-3') || modal.querySelector('[role="tablist"]') || modal.querySelector('.my-3\\.5');
      const buttons = Array.from(tabsContainer.querySelectorAll('button'));
      const cRect = tabsContainer.getBoundingClientRect();

      const tabsInfo = buttons.map(b => {
        const r = b.getBoundingClientRect();
        return {
          text: b.textContent.trim(),
          left: r.left,
          right: r.right,
          width: r.width,
          isWithinContainer: r.left >= cRect.left - 2 && r.right <= cRect.right + 2,
        };
      });

      return {
        containerScrollWidth: tabsContainer.scrollWidth,
        containerClientWidth: tabsContainer.clientWidth,
        hasHorizontalScroll: tabsContainer.scrollWidth > tabsContainer.clientWidth + 1,
        tabsInfo
      };
    });

    console.log('Tabs Verification Data:', JSON.stringify(data, null, 2));

    if (data.hasHorizontalScroll) {
      throw new Error('❌ Container still has horizontal scroll!');
    }

    for (const tab of data.tabsInfo) {
      if (!tab.isWithinContainer) {
        throw new Error(`❌ Tab "${tab.text}" is cut off / outside container!`);
      }
    }

    console.log('✅ ALL 3 TABS ARE 100% DIRECTLY VISIBLE ON SCREEN WITHOUT SCROLL!');

    const screenshotPath = path.join(ARTIFACT_DIR, 'qa-footer-modal-tabs-direct.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);

  } finally {
    await browser.close();
  }
}

verifyTabs().catch(err => {
  console.error(err);
  process.exit(1);
});
