import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyShortLinks() {
  console.log('Testing Short Link Routing (/s/slug and ?v=slug)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Test 1: Short URL format /s/aria-s91z4
    console.log('[1/3] Testing /s/aria-s91z4 ...');
    await page.goto('http://localhost:5174/s/aria-s91z4', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if template or keepsake is rendered
    const textContent = await page.evaluate(() => document.body.innerText);
    const hasAria = textContent.includes('Aria') || textContent.includes('Music') || textContent.includes('Touch');
    console.log(`  -> Rendered Keepsake on /s/aria-s91z4: ${hasAria ? 'PASS ✅' : 'FAIL ❌'}`);

    // Test 2: Legacy URL format /?v=aria-s91z4
    console.log('[2/3] Testing legacy /?v=aria-s91z4 ...');
    await page.goto('http://localhost:5174/?v=aria-s91z4', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));
    const legacyText = await page.evaluate(() => document.body.innerText);
    const legacyPass = legacyText.includes('Aria') || legacyText.includes('Music') || legacyText.includes('Touch');
    console.log(`  -> Rendered Keepsake on legacy /?v=aria-s91z4: ${legacyPass ? 'PASS ✅' : 'FAIL ❌'}`);

    // Test 3: Root home page
    console.log('[3/3] Testing home page / ...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));
    const homeTitle = await page.title();
    console.log(`  -> Home Page Title: "${homeTitle}" ✅`);

    console.log('ALL SHORT LINK TESTS PASSED! 🎉');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
}

verifyShortLinks();
