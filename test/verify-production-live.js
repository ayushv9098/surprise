import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'https://wishcraft-surprise.vercel.app';

async function test() {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1400, height: 900 });

  const errors = [];
  p.on('console', m => m.type() === 'error' && !m.text().includes('favicon') && !m.text().includes('404') && errors.push(m.text()));
  p.on('pageerror', err => errors.push(err.message));

  console.log('Navigating to live production:', URL);
  await p.goto(URL, { waitUntil: 'networkidle2' });

  // Wait for section#occasions and click Romance button
  await p.waitForSelector('section#occasions', { timeout: 10000 });
  const clickedRomance = await p.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('section#occasions button'));
    for (const btn of buttons) {
      if (btn.innerText.includes('Romance') || btn.innerText.includes('Love')) {
        btn.click();
        return true;
      }
    }
    return false;
  });
  console.log('Clicked Romance Occasion button:', clickedRomance);

  // Wait for builder studio to load (Step 1)
  await p.waitForSelector('.soft-app.in-phone-simulator', { timeout: 15000 });
  console.log('Builder studio Step 1 loaded!');

  // Click "Proceed to Form" to advance to Step 2 Form
  const clickedNext = await p.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const nextBtn = buttons.find(b => b.innerText.includes('Proceed to Form') || b.innerText.includes('Customize Details'));
    if (nextBtn) {
      nextBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Proceed to Form button:', clickedNext);

  await new Promise(r => setTimeout(r, 1200));

  // Now inspect Step 2 Form (Left panel)
  const formChecks = await p.evaluate(() => {
    // 1. Tab 1 button
    const tabBtns = Array.from(document.querySelectorAll('button'));
    const tab1 = tabBtns.find(b => b.innerText.includes('1. Names'));
    const tab1Text = tab1 ? tab1.innerText.replace(/\s+/g, ' ').trim() : 'missing';
    const tab1HasHeart = Boolean(tab1?.querySelector('img[alt="❤️"]') || tab1?.innerText.includes('❤️'));

    // 2. Section 1 header
    const h2s = Array.from(document.querySelectorAll('h2'));
    const h2 = h2s.find(el => el.innerText.includes('Names'));
    const h2Text = h2 ? h2.innerText.replace(/\s+/g, ' ').trim() : 'missing';

    // 3. Recipient Name label
    const labels = Array.from(document.querySelectorAll('label'));
    const recLabel = labels.find(l => l.innerText.toLowerCase().includes('partner') || l.innerText.toLowerCase().includes('birthday') || l.innerText.toLowerCase().includes('person'));
    const recLabelText = recLabel ? recLabel.innerText.replace(/\s+/g, ' ').trim() : 'missing';

    // 4. Occasion label & placeholder
    const occLabel = labels.find(l => l.innerText.includes('Occasion') || l.innerText.includes('Greeting') || l.innerText.includes('Headline'));
    const occLabelText = occLabel ? occLabel.innerText.replace(/\s+/g, ' ').trim() : 'missing';

    const inputs = Array.from(document.querySelectorAll('input'));
    const occInput = inputs.find(i => i.placeholder && (i.placeholder.includes('Anniversary') || i.placeholder.includes('Birthday')));
    const occPlaceholder = occInput ? occInput.placeholder : 'missing';

    // 5. Bottom bar badge
    const badge = Array.from(document.querySelectorAll('span, div')).find(el => el.innerText && el.innerText.includes('Step 2/2'));
    const badgeText = badge ? (badge.parentElement?.innerText || badge.innerText).replace(/\s+/g, ' ').trim() : 'missing';

    return { tab1Text, tab1HasHeart, h2Text, recLabelText, occLabelText, occPlaceholder, badgeText };
  });

  console.log('\n--- LIVE PRODUCTION FORM ADAPTATION CHECKS (STEP 2) ---');
  console.log('Tab 1:', formChecks.tab1Text);
  console.log('Tab 1 Has Heart:', formChecks.tab1HasHeart);
  console.log('Header:', formChecks.h2Text);
  console.log('Recipient Label:', formChecks.recLabelText);
  console.log('Occasion Label:', formChecks.occLabelText);
  console.log('Occasion Placeholder:', formChecks.occPlaceholder);
  console.log('Bottom Badge:', formChecks.badgeText);

  // Assertions for Romance Form
  const isRomanceForm = 
    formChecks.tab1HasHeart &&
    formChecks.h2Text.includes('Romantic Greeting') &&
    formChecks.recLabelText.includes('Partner') &&
    !formChecks.h2Text.includes('👑') &&
    !formChecks.tab1Text.includes('👑') &&
    !formChecks.recLabelText.includes('Birthday Person');

  console.log('Romance Form Validated (No birthday prompts/crowns):', isRomanceForm);

  // Now inspect Mobile Simulator (Right panel)
  console.log('\n--- LIVE PRODUCTION SIMULATOR CHECKS ---');
  const simChecks = await p.evaluate(() => {
    const washi = !!document.querySelector('.washi-tape-strip');
    const zoom = !!document.querySelector('.photo-card-zoom-btn');
    const like = !!document.querySelector('.polaroid-like-btn');
    const swipePill = !!document.querySelector('.photo-swipe-guide-pill');
    const musicPill = !!document.querySelector('.soft-music-pill');
    const navPills = Array.from(document.querySelectorAll('.soft-nav-pills .nav-pill')).map(b => b.innerText.trim());
    const tactileBtns = document.querySelectorAll('.tactile-btn.photo-nav-btn').length;
    const photoCounter = document.querySelector('.photo-counter-pill')?.innerText.replace(/\s+/g, ' ').trim() || '';

    const titleEl = document.querySelector('.soft-hero-title, .soft-title, h1');
    const font = titleEl ? window.getComputedStyle(titleEl).fontFamily : '';

    return { washi, zoom, like, swipePill, musicPill, navPills, tactileBtns, photoCounter, font };
  });

  console.log('Washi tape strip:', simChecks.washi);
  console.log('Zoom button:', simChecks.zoom);
  console.log('Like button:', simChecks.like);
  console.log('Swipe guide pill:', simChecks.swipePill);
  console.log('Floating music pill inside simulator:', simChecks.musicPill);
  console.log('Nav pills:', simChecks.navPills);
  console.log('Tactile Prev/Next buttons count:', simChecks.tactileBtns);
  console.log('Photo counter:', simChecks.photoCounter);
  console.log('Hero title font family:', simChecks.font);

  console.log('\nTotal Console Errors:', errors.length);

  await b.close();
}

test().catch(e => { console.error('Test error:', e); process.exit(1); });
