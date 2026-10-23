import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function qa() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Visit builder directly via URL param or click
  await page.goto('http://localhost:4173/?view=builder', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // If on home, let's click "Start Creating ->" then "Boy" or "Girl"
  const startBtn = await page.$('button');
  await page.evaluate(() => {
    // Click Start Creating
    const btns = Array.from(document.querySelectorAll('button'));
    const start = btns.find(x => x.textContent.includes('Start Creating'));
    if (start) start.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Now click "Boy" or "Girl" in RecipientModal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const boy = btns.find(x => x.textContent.includes('Him') || x.textContent.includes('Boy'));
    if (boy) boy.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Now we are inside BuilderStudio!
  await page.screenshot({ path: 'test/qa-studio-birthday-boy.png' });
  console.log('Saved test/qa-studio-birthday-boy.png');

  // Let's crop the template selector cards in the left column
  const tmplSelector = await page.$('.space-y-4, [class*="TemplateSelector"]');
  if (tmplSelector) {
    await tmplSelector.screenshot({ path: 'test/qa-templates-crop.png' });
    console.log('Saved test/qa-templates-crop.png');
  }

  // Now let's switch gender to "Her" to see the girl templates
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const her = btns.find(x => x.textContent.includes('For Her') || x.textContent.includes('Female'));
    if (her) her.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'test/qa-studio-birthday-girl.png' });
  console.log('Saved test/qa-studio-birthday-girl.png');

  // Now let's navigate to Romance / Special Someone category
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const romance = btns.find(x => x.textContent.includes('Special Someone & Connection'));
    if (romance) romance.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'test/qa-studio-romance.png' });
  console.log('Saved test/qa-studio-romance.png');

  // Viewport 1280x551 laptop check
  await page.setViewport({ width: 1280, height: 551 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test/qa-laptop-551-studio-final.png' });
  console.log('Saved test/qa-laptop-551-studio-final.png');

  await browser.close();
}

qa().catch(console.error);
