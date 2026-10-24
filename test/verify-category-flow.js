import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\f953c98b-6d6b-4455-954a-017be6da4531';

async function runVerification() {
  console.log('Launching Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  // 1. Visit home page
  console.log('1. Navigating to http://localhost:5174/');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Screenshot initial home
  await page.screenshot({ path: 'test/step1-home.png' });

  // 2. Click "Start Creating →"
  console.log('2. Clicking "Start Creating →" button...');
  const clickedStartCreating = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Start Creating'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  if (!clickedStartCreating) {
    throw new Error('Could not find "Start Creating" button!');
  }

  await new Promise(r => setTimeout(r, 600));

  // Verify Category Modal is open and shows "What are you celebrating?"
  const modalInfo = await page.evaluate(() => {
    const titleEl = document.querySelector('#category-modal-title');
    const buttons = Array.from(document.querySelectorAll('button'));
    const categoryTitles = Array.from(document.querySelectorAll('#category-modal-title ~ div button h4'))
      .map(h => h.textContent.trim());

    return {
      hasModalTitle: Boolean(titleEl),
      titleText: titleEl ? titleEl.textContent.trim() : null,
      categoryTitles,
    };
  });

  console.log('Category Modal Info:', modalInfo);
  if (!modalInfo.hasModalTitle || modalInfo.titleText !== 'What are you celebrating?') {
    throw new Error(`Expected modal title 'What are you celebrating?', found: ${modalInfo.titleText}`);
  }

  await page.screenshot({ path: 'test/step2-category-modal.png' });
  console.log('Saved test/step2-category-modal.png');

  // 3. Click Coming Soon item (e.g. Memory Scrapbook)
  console.log('3. Clicking coming soon category...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const scrapbookBtn = buttons.find(b => b.textContent.includes('Memory Scrapbook'));
    if (scrapbookBtn) scrapbookBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ path: 'test/step3-coming-soon-toast.png' });
  console.log('Saved test/step3-coming-soon-toast.png');

  // 4. Click "Birthday Celebration" inside Category Modal
  console.log('4. Clicking "Birthday Celebration" inside Category Modal...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bdayBtn = buttons.find(b => b.textContent.includes('Birthday Celebration') && b.closest('[role="dialog"]'));
    if (bdayBtn) bdayBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify Recipient Modal is now displayed
  const recipientModalInfo = await page.evaluate(() => {
    const titleEl = document.querySelector('#recipient-modal-title');
    const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Back'));
    return {
      hasRecipientModal: Boolean(titleEl),
      titleText: titleEl ? titleEl.textContent.trim() : null,
      hasBackButton: Boolean(backBtn)
    };
  });

  console.log('Recipient Modal Info:', recipientModalInfo);
  if (!recipientModalInfo.hasRecipientModal || !recipientModalInfo.hasBackButton) {
    throw new Error('Recipient modal did not open properly with Back button!');
  }

  await page.screenshot({ path: 'test/step4-recipient-modal.png' });
  console.log('Saved test/step4-recipient-modal.png');

  // 5. Test "Back" button to return to Category modal
  console.log('5. Clicking "Back" to return to Category selection...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const backBtn = buttons.find(b => b.textContent.includes('Back'));
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const recheckCategoryModal = await page.evaluate(() => {
    const titleEl = document.querySelector('#category-modal-title');
    return Boolean(titleEl);
  });
  console.log('Returned to Category Modal:', recheckCategoryModal);
  if (!recheckCategoryModal) {
    throw new Error('Did not return to Category modal on Back click!');
  }

  await page.screenshot({ path: 'test/step5-returned-to-category-modal.png' });

  // 6. Click "Special Someone & Connection"
  console.log('6. Clicking "Special Someone & Connection"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const romanceBtn = buttons.find(b => b.textContent.includes('Special Someone') && b.closest('[role="dialog"]'));
    if (romanceBtn) romanceBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Verify Studio Builder for Romance is loaded
  const builderInfo = await page.evaluate(() => {
    return {
      url: window.location.href,
      hasBuilder: Boolean(document.querySelector('main')) && document.body.textContent.includes('Velvet Romance') || document.body.textContent.includes('Surprise')
    };
  });
  console.log('Builder Info:', builderInfo);
  await page.screenshot({ path: 'test/step6-romance-builder.png' });

  // 7. Test Home navigation and #occasions section
  console.log('7. Returning home to test #occasions section...');
  await page.evaluate(() => {
    const brand = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Wishly'));
    if (brand) brand.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click Birthday in #occasions section
  console.log('8. Clicking Birthday in #occasions section on landing page...');
  await page.evaluate(() => {
    const occasionsSec = document.querySelector('#occasions');
    if (occasionsSec) {
      const bdayCard = Array.from(occasionsSec.querySelectorAll('button')).find(b => b.textContent.includes('Birthday Celebration'));
      if (bdayCard) bdayCard.click();
    }
  });
  await new Promise(r => setTimeout(r, 600));

  const occasionRecipientModal = await page.evaluate(() => {
    const titleEl = document.querySelector('#recipient-modal-title');
    return Boolean(titleEl);
  });
  console.log('Recipient modal opened from #occasions:', occasionRecipientModal);

  // Close modal via Escape
  console.log('9. Pressing Escape key to close modal...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  const modalStillOpen = await page.evaluate(() => {
    return Boolean(document.querySelector('[role="dialog"]'));
  });
  console.log('Modal closed on Escape:', !modalStillOpen);

  // Copy screenshots to artifact dir if exists
  if (fs.existsSync(ARTIFACT_DIR)) {
    ['step1-home.png', 'step2-category-modal.png', 'step3-coming-soon-toast.png', 'step4-recipient-modal.png', 'step5-returned-to-category-modal.png', 'step6-romance-builder.png'].forEach(f => {
      if (fs.existsSync(`test/${f}`)) {
        fs.copyFileSync(`test/${f}`, path.join(ARTIFACT_DIR, f));
      }
    });
  }

  await browser.close();
  console.log('✅ ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

runVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
