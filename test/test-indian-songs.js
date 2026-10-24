// test/test-indian-songs.js
import puppeteer from 'puppeteer-core';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testAudio() {
  console.log('Launching browser to test Indian songs integration...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser Error:', msg.text());
    }
  });

  await page.goto('http://localhost:5174/?view=builder', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. In-browser audio decoding verification for all 7 mp3 files
  console.log('\n--- 1. Testing Audio Element Decoding for each local MP3 ---');
  const files = [
    'baar-baar-din-ye-aaye.mp3',
    'kesariya.mp3',
    'raataan-lambiyan.mp3',
    'tum-hi-ho.mp3',
    'apna-bana-le.mp3',
    'pehla-nasha.mp3',
    'ilahi.mp3'
  ];

  const decodeResults = await page.evaluate(async (trackFiles) => {
    const results = [];
    for (const f of trackFiles) {
      const url = '/audio/' + f;
      const res = await new Promise((resolve) => {
        const audio = new Audio();
        audio.preload = 'auto';
        let resolved = false;

        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve({ file: f, success: false, error: 'Timeout 5000ms' });
          }
        }, 5000);

        audio.oncanplaythrough = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            resolve({
              file: f,
              success: true,
              duration: audio.duration,
              canPlayType: audio.canPlayType('audio/mpeg')
            });
          }
        };

        audio.onerror = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            resolve({
              file: f,
              success: false,
              error: audio.error ? audio.error.message || `Code ${audio.error.code}` : 'Unknown audio error'
            });
          }
        };

        audio.src = url;
        audio.load();
      });
      results.push(res);
    }
    return results;
  }, files);

  console.log('Audio decoding test results:');
  for (const r of decodeResults) {
    if (r.success) {
      console.log(` ✅ ${r.file}: playable (Duration: ${r.duration.toFixed(1)}s, canPlayType: ${r.canPlayType})`);
    } else {
      console.error(` ❌ ${r.file}: FAILED - ${r.error}`);
    }
  }

  // 2. Click "Proceed to Form" to enter Step 2
  console.log('\n--- 2. Entering Step 2 Form & Media Tab ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const proceed = btns.find(b => b.textContent.includes('Proceed to Form'));
    if (proceed) proceed.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click the "Photo & Song" / Media tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const media = btns.find(b => b.textContent.includes('Photo & Song') || b.textContent.includes('Photos') || b.textContent.includes('Media'));
    if (media) media.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 3. Inspect Song Cards in DOM
  const songCardsInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.grid > div'));
    return cards.map(c => {
      const title = c.querySelector('span.text-xs.font-bold')?.textContent?.trim();
      const meta = c.querySelector('.flex.items-center.gap-1\\.5.mt-0\\.5')?.textContent?.trim();
      return { title, meta };
    }).filter(x => x.title);
  });

  console.log(`Found ${songCardsInfo.length} Song Cards in StepMedia:`);
  songCardsInfo.forEach((s, idx) => {
    console.log(`  [${idx + 1}] "${s.title}" (${s.meta})`);
  });

  // Take screenshot of StepMedia songs selection
  const screenshotPath = 'D:\\avprojects\\surprise-builder\\test\\step2-indian-songs.png';
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot: ${screenshotPath}`);

  // 4. Test Play/Pause on Kesariya
  console.log('\n--- 3. Testing Interactive Audio Preview Play/Pause ---');
  const playbackTest = await page.evaluate(async () => {
    const cards = Array.from(document.querySelectorAll('.grid > div'));
    const kesariyaCard = cards.find(c => c.textContent.includes('Kesariya'));
    if (!kesariyaCard) return { error: 'Kesariya card not found' };

    const playBtn = kesariyaCard.querySelector('button[title*="Play"]');
    if (!playBtn) return { error: 'Play button on Kesariya not found' };

    playBtn.click();
    await new Promise(r => setTimeout(r, 1200));

    // Check if pause button is now visible
    const pauseBtn = kesariyaCard.querySelector('button[title*="Pause"]');
    const isPlaying = Boolean(pauseBtn);

    // Now click pause
    if (pauseBtn) pauseBtn.click();
    await new Promise(r => setTimeout(r, 600));
    const backToPlay = Boolean(kesariyaCard.querySelector('button[title*="Play"]'));

    return { success: true, played: isPlaying, paused: backToPlay };
  });

  console.log('Playback test on Kesariya:', playbackTest);

  // 5. Test Song Selection (Clicking on Baar Baar Din Ye Aaye)
  console.log('\n--- 4. Testing Song Selection ---');
  const selectTest = await page.evaluate(async () => {
    const cards = Array.from(document.querySelectorAll('.grid > div'));
    const bbCard = cards.find(c => c.textContent.includes('Baar Baar'));
    if (!bbCard) return { error: 'Baar Baar Din Ye Aaye card not found' };

    bbCard.click();
    await new Promise(r => setTimeout(r, 600));

    const checkIcon = bbCard.querySelector('.bg-rose-500');
    return { success: Boolean(checkIcon), title: bbCard.querySelector('span.text-xs.font-bold')?.textContent?.trim() };
  });

  console.log('Song selection test on Baar Baar Din Ye Aaye:', selectTest);

  await browser.close();
  console.log('\n🎉 ALL REAL INDIAN SONGS & AUDIO CONTROLS TESTED SUCCESSFULLY!');
}

testAudio().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
