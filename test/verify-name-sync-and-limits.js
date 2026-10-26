import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

async function testNameSyncAndLimits() {
  console.log('🚀 Testing Recipient Name Sync, Occasion Cleanliness, and Character Limits...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:5174/?view=builder', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    // 1. Select Girl -> Lavender Dream
    await page.evaluate(() => {
      const girlBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('For a Girl'));
      if (girlBtn) girlBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div, button'));
      const lavenderCard = cards.find(el => el.textContent.includes('Lavender Dream'));
      if (lavenderCard) lavenderCard.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // 2. Click "Proceed to Form"
    await page.evaluate(() => {
      const proceedBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Proceed to Form'));
      if (proceedBtn) proceedBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // 3. Inspect Form Inputs
    const inputMetrics = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const nameInput = inputs.find(i => i.placeholder && (i.placeholder.includes('Sarah') || i.placeholder.includes('Rohan') || i.placeholder.includes('Maya')));
      const senderInput = inputs.find(i => i.placeholder && (i.placeholder.includes('Elena') || i.placeholder.includes('Alex') || i.placeholder.includes('Liam')));
      const occasionInput = inputs.find(i => i.placeholder && i.placeholder.includes('Happy Birthday'));

      return {
        recipientNameValue: nameInput ? nameInput.value : null,
        recipientMaxLength: nameInput ? nameInput.getAttribute('maxlength') : null,
        senderMaxLength: senderInput ? senderInput.getAttribute('maxlength') : null,
        occasionValue: occasionInput ? occasionInput.value : null,
        occasionMaxLength: occasionInput ? occasionInput.getAttribute('maxlength') : null,
      };
    });

    console.log('Form Input Metrics:', inputMetrics);

    // 4. Type custom name "Aaradhya" into Recipient Name
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const nameInput = inputs.find(i => i.placeholder && (i.placeholder.includes('Sarah') || i.placeholder.includes('Rohan') || i.placeholder.includes('Maya')));
      if (nameInput) {
        // Trigger React change
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(nameInput, 'Aaradhya');
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        nameInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 600));

    // 5. Inspect Scene 0 in phone simulator
    const scene0Text = await page.evaluate(() => {
      const phone = document.querySelector('.relative.shrink-0.select-none');
      return phone ? phone.innerText : '';
    });

    console.log('Scene 0 text preview in phone:', scene0Text.substring(0, 300));

    const shot0 = path.join(ARTIFACT_DIR, 'qa-name-sync-scene0.png');
    const phoneEl = await page.$('.relative.shrink-0.select-none');
    if (phoneEl) await phoneEl.screenshot({ path: shot0 });
    console.log('Saved Scene 0 shot to:', shot0);

    // 6. Click through to Scene 4 (Letter)
    // Click "Tap to Open 🎁"
    await page.evaluate(() => {
      const phone = document.querySelector('.relative.shrink-0.select-none');
      const tapBtn = Array.from(phone.querySelectorAll('button')).find(b => b.textContent.includes('Tap to Open'));
      if (tapBtn) tapBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Click Next (Photo)
    await page.evaluate(() => {
      const phone = document.querySelector('.relative.shrink-0.select-none');
      const nextBtn = Array.from(phone.querySelectorAll('button')).find(b => b.textContent.includes('Next') || b.textContent.includes('Reasons'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Click Next (Reasons to Letter)
    await page.evaluate(() => {
      const phone = document.querySelector('.relative.shrink-0.select-none');
      const nextBtn = Array.from(phone.querySelectorAll('button')).find(b => b.textContent.includes('Letter') || b.textContent.includes('Next') || b.textContent.includes('Final'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Click Wax Seal / Envelope to open letter
    await page.evaluate(() => {
      const phone = document.querySelector('.relative.shrink-0.select-none');
      const envelope = phone.querySelector('[class*="group relative cursor-pointer"]') || Array.from(phone.querySelectorAll('div, button')).find(b => b.textContent.includes('Tap to open') || b.textContent.includes('A special letter'));
      if (envelope) envelope.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Inspect Letter text in phone simulator
    const letterText = await page.evaluate(() => {
      const phone = document.querySelector('.relative.shrink-0.select-none');
      return phone ? phone.innerText : '';
    });

    console.log('Letter text in phone:', letterText.substring(0, 400));

    const shot4 = path.join(ARTIFACT_DIR, 'qa-name-sync-letter.png');
    if (phoneEl) await phoneEl.screenshot({ path: shot4 });
    console.log('Saved Letter shot to:', shot4);

    // Assertions
    const hasLavenderDreamerInScene0 = scene0Text.includes('Lavender Dreamer');
    const hasAaradhyaInScene0 = scene0Text.includes('Aaradhya');
    const hasAaradhyaInLetter = letterText.includes('Aaradhya');

    console.log(`Results:
      hasLavenderDreamerInScene0: ${hasLavenderDreamerInScene0} (should be false)
      hasAaradhyaInScene0: ${hasAaradhyaInScene0} (should be true)
      hasAaradhyaInLetter: ${hasAaradhyaInLetter} (should be true)
    `);

  } finally {
    await browser.close();
  }
}

testNameSyncAndLimits().catch(err => {
  console.error(err);
  process.exit(1);
});
