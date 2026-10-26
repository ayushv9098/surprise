import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

(async () => {
  console.log('Testing Name Sync and Letter Formatter on fresh server...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  await page.goto('http://localhost:5174/?view=builder', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));

  // Click "Proceed to Form"
  await page.evaluate(() => {
    const proceedBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Proceed to Form'));
    if (proceedBtn) proceedBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Check form values
  const formMetrics = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const nameInput = inputs[0];
    const senderInput = inputs[1];
    const occasionInput = inputs[2];
    return {
      recipientValue: nameInput ? nameInput.value : null,
      recipientMaxLength: nameInput ? nameInput.maxLength : null,
      senderMaxLength: senderInput ? senderInput.maxLength : null,
      occasionValue: occasionInput ? occasionInput.value : null,
      occasionMaxLength: occasionInput ? occasionInput.maxLength : null,
    };
  });
  console.log('Initial Form Metrics:', formMetrics);

  // Type custom name "Aaradhya" into Recipient Name input
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const nameInput = inputs[0];
    if (nameInput) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(nameInput, 'Aaradhya');
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 500));

  // Check phone simulator Scene 0 text
  const scene0Text = await page.evaluate(() => {
    const phone = document.querySelector('.relative.shrink-0.select-none');
    return phone ? phone.innerText : '';
  });
  console.log('Scene 0 Phone Text:\n', scene0Text.substring(0, 200));

  const shot0 = path.join(ARTIFACT_DIR, 'qa-aaradhya-scene0.png');
  const phoneEl = await page.$('.relative.shrink-0.select-none');
  if (phoneEl) await phoneEl.screenshot({ path: shot0 });

  // Switch to Tab 3 (Reasons & Letter) in the editor
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const surprisesTab = tabs.find(b => b.textContent.includes('Reasons & Letter') || b.textContent.includes('Surprises'));
    if (surprisesTab) surprisesTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Check the letter textarea content
  const letterFormContent = await page.evaluate(() => {
    const textareas = Array.from(document.querySelectorAll('textarea'));
    const letterTextarea = textareas.find(t => t.placeholder.includes('Write your heartfelt note') || t.rows === 6);
    return letterTextarea ? letterTextarea.value : '';
  });
  console.log('Letter Form Content:\n', letterFormContent.substring(0, 200));

  // Click on the envelope inside the phone to open it
  await page.evaluate(() => {
    const phone = document.querySelector('.relative.shrink-0.select-none');
    const seal = phone ? (phone.querySelector('[class*="group relative cursor-pointer"]') || phone.querySelector('button[title*="open"]')) : null;
    if (seal) seal.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const phoneLetterText = await page.evaluate(() => {
    const phone = document.querySelector('.relative.shrink-0.select-none');
    return phone ? phone.innerText : '';
  });
  console.log('Phone Letter Text:\n', phoneLetterText.substring(0, 300));

  const shot4 = path.join(ARTIFACT_DIR, 'qa-aaradhya-letter.png');
  if (phoneEl) await phoneEl.screenshot({ path: shot4 });

  await browser.close();

  const isScene0Valid = scene0Text.includes('Aaradhya') && !scene0Text.includes('Lavender Dreamer');
  const isLetterValid = letterFormContent.includes('Aaradhya') || phoneLetterText.includes('Aaradhya');

  console.log(`Summary:
    isScene0Valid: ${isScene0Valid}
    isLetterValid: ${isLetterValid}
  `);

  if (isScene0Valid && isLetterValid) {
    console.log('🎉 ALL ASSERTIONS PASSED! "Aaradhya" synced in Scene 0 and Letter!');
    process.exit(0);
  } else {
    console.error('❌ Assertion failed!');
    process.exit(1);
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
