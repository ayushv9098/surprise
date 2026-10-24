/**
 * Wishly Marketing Video — Puppeteer Scene Capture Script
 * Captures 6 scenes as frame sequences (PNG) for FFmpeg video assembly.
 * Output: media/marketing-video/scenes/scene{N}/frame%04d.png
 */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SCENES_DIR = path.join(ROOT, 'media', 'marketing-video', 'scenes');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5174';
const FFMPEG = 'C:\\Users\\hp\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe';

// Video dimensions: 1080 wide × 1920 tall (9:16 vertical reel)
const W = 1080;
const H = 1920;
const FPS = 24;

// --- Helpers ---
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function captureFrames(page, dir, durationMs, fps = FPS) {
  ensureDir(dir);
  const frameCount = Math.ceil((durationMs / 1000) * fps);
  const interval = 1000 / fps;
  for (let i = 0; i < frameCount; i++) {
    const framePath = path.join(dir, `frame${String(i).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    await sleep(interval);
  }
  return frameCount;
}

async function framesToMp4(framesDir, outputPath, fps = FPS) {
  const { execSync } = await import('child_process');
  const inputPattern = path.join(framesDir, 'frame%04d.png');
  const cmd = `"${FFMPEG}" -y -framerate ${fps} -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 22 "${outputPath}"`;
  console.log('  [ffmpeg]', cmd);
  execSync(cmd, { stdio: 'inherit' });
}

// ============================
// SCENE 1: The Hook (0–3.5s)
// Boring text vs Wishly tease
// ============================
async function captureScene1(browser) {
  console.log('\n🎬 Scene 1: The Hook...');
  const dir = path.join(SCENES_DIR, 'scene1');
  ensureDir(dir);

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  // Inject a mocked "boring message" graphic overlay
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: ${W}px; height: ${H}px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        overflow: hidden;
      }
      .phone-mock {
        width: 380px;
        background: #1c1c1e;
        border-radius: 44px;
        padding: 16px;
        box-shadow: 0 40px 80px rgba(0,0,0,0.8), 0 0 0 2px #333;
      }
      .notch { width: 120px; height: 34px; background: #000; border-radius: 20px; margin: 0 auto 16px; }
      .chat-header {
        display: flex; align-items: center; gap: 12px;
        padding: 12px 16px;
        border-bottom: 1px solid #2c2c2e;
        color: #fff;
        font-size: 17px; font-weight: 600;
      }
      .avatar { width: 40px; height: 40px; border-radius: 50%; background: #4a4a6a; display: flex; align-items: center; justify-content: center; font-size: 20px; }
      .messages { padding: 16px; min-height: 280px; display: flex; flex-direction: column; gap: 10px; }
      .bubble {
        max-width: 80%; padding: 12px 16px; border-radius: 18px;
        font-size: 16px; line-height: 1.4;
      }
      .sent { background: #1c7a3d; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
      .received { background: #2c2c2e; color: #fff; align-self: flex-start; border-bottom-left-radius: 4px; }
      .tag {
        position: absolute; top: 80px; left: 50%; transform: translateX(-50%);
        background: #E8364E; color: #fff;
        font-size: 22px; font-weight: 800; padding: 12px 28px; border-radius: 50px;
        white-space: nowrap; letter-spacing: 0.3px;
        box-shadow: 0 8px 24px rgba(232,54,78,0.4);
      }
      .emoji-big { font-size: 96px; position: absolute; top: 120px; right: 80px; opacity: 0.15; }
      .footer-label {
        position: absolute; bottom: 120px; left: 0; right: 0; text-align: center;
        color: rgba(255,255,255,0.5); font-size: 18px; font-weight: 500;
        letter-spacing: 0.5px;
      }
    </style>
    </head>
    <body>
      <div class="emoji-big">😴</div>
      <div style="position:absolute;top:140px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.9);font-size:28px;font-weight:800;text-align:center;line-height:1.3;white-space:nowrap;">Still sending boring texts?</div>
      <div class="phone-mock" style="margin-top:80px;">
        <div class="notch"></div>
        <div class="chat-header">
          <div class="avatar">👤</div>
          <div>Rohan</div>
        </div>
        <div class="messages">
          <div class="bubble sent">Bhai Happy Birthday 🎂</div>
          <div class="bubble sent">HBD bro! Have a great day</div>
          <div class="bubble received">Thanks 😊</div>
          <div class="bubble sent">Enjoy!</div>
        </div>
      </div>
      <div class="footer-label">❌ Generic. Forgettable. Cringe.</div>
    </body>
    </html>
  `);
  await sleep(600);
  await captureFrames(page, dir, 3500);
  await page.close();
  await framesToMp4(dir, path.join(SCENES_DIR, 'scene1.mp4'));
  console.log('  ✅ Scene 1 done');
}

// ============================
// SCENE 2: Wishly Landing (3.5–7.5s = 4s)
// ============================
async function captureScene2(browser) {
  console.log('\n🎬 Scene 2: Wishly Landing Page...');
  const dir = path.join(SCENES_DIR, 'scene2');
  ensureDir(dir);

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await sleep(1200);

  // Capture from top (hero section) for 2s
  let frameCount = 0;
  const fps = FPS;
  const interval = 1000 / fps;
  const totalFrames = Math.ceil(4 * fps); // 4 seconds

  for (let i = 0; i < totalFrames; i++) {
    // Gradually scroll down to reveal occasions section
    const scrollY = Math.min(i * 3, 400);
    await page.evaluate((y) => window.scrollTo({ top: y }), scrollY);
    const framePath = path.join(dir, `frame${String(frameCount).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    frameCount++;
    await sleep(interval);
  }

  await page.close();
  await framesToMp4(dir, path.join(SCENES_DIR, 'scene2.mp4'));
  console.log('  ✅ Scene 2 done');
}

// ============================
// SCENE 3: Builder Studio (7.5–12s = 4.5s)
// ============================
async function captureScene3(browser) {
  console.log('\n🎬 Scene 3: Builder Studio...');
  const dir = path.join(SCENES_DIR, 'scene3');
  ensureDir(dir);

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await sleep(1000);

  // Click "Start Creating"
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const txt = await page.evaluate(el => el.textContent, btn);
    if (txt && txt.includes('Start Creating')) {
      await btn.click();
      break;
    }
  }
  await sleep(800);

  // Dismiss recipient modal — click a gender button
  const modalBtns = await page.$$('button');
  for (const btn of modalBtns) {
    const txt = await page.evaluate(el => el.textContent, btn);
    if (txt && (txt.includes('Boy') || txt.includes('Girl') || txt.includes('🎂') || txt.includes('girl') || txt.includes('boy'))) {
      await btn.click();
      break;
    }
  }
  await sleep(1500);

  // Now capture the builder studio
  await captureFrames(page, dir, 4500);
  await page.close();
  await framesToMp4(dir, path.join(SCENES_DIR, 'scene3.mp4'));
  console.log('  ✅ Scene 3 done');
}

// ============================
// SCENE 4: Keepsake Preview (12–16.5s = 4.5s)
// ============================
async function captureScene4(browser) {
  console.log('\n🎬 Scene 4: Keepsake Preview...');
  const dir = path.join(SCENES_DIR, 'scene4');
  ensureDir(dir);

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}/?preview=royal-sapphire`, { waitUntil: 'networkidle2' });
  await sleep(1500);

  // Try to click the wax seal / envelope CTA
  const allBtns = await page.$$('button');
  for (const btn of allBtns) {
    const txt = await page.evaluate(el => el.textContent || el.getAttribute('aria-label'), btn);
    if (txt && (txt.includes('Open') || txt.includes('Seal') || txt.includes('Letter') || txt.includes('💌') || txt.includes('Reveal'))) {
      await btn.click();
      break;
    }
  }
  await sleep(600);

  await captureFrames(page, dir, 4500);
  await page.close();
  await framesToMp4(dir, path.join(SCENES_DIR, 'scene4.mp4'));
  console.log('  ✅ Scene 4 done');
}

// ============================
// SCENE 5: Sharing / QR Code (16.5–20s = 3.5s)
// ============================
async function captureScene5(browser) {
  console.log('\n🎬 Scene 5: Sharing / QR Code...');
  const dir = path.join(SCENES_DIR, 'scene5');
  ensureDir(dir);

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await sleep(800);

  // Navigate to builder and try to get to the sharing step
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const txt = await page.evaluate(el => el.textContent, btn);
    if (txt && txt.includes('Start Creating')) {
      await btn.click();
      break;
    }
  }
  await sleep(800);

  const modalBtns = await page.$$('button');
  for (const btn of modalBtns) {
    const txt = await page.evaluate(el => el.textContent, btn);
    if (txt && (txt.includes('Boy') || txt.includes('Girl') || txt.includes('boy') || txt.includes('girl'))) {
      await btn.click();
      break;
    }
  }
  await sleep(1500);

  // Try clicking "Publish" or "Share" button in the builder
  const builderBtns = await page.$$('button');
  for (const btn of builderBtns) {
    const txt = await page.evaluate(el => el.textContent, btn);
    if (txt && (txt.includes('Publish') || txt.includes('Share') || txt.includes('Create'))) {
      await btn.click();
      break;
    }
  }
  await sleep(1000);

  await captureFrames(page, dir, 3500);
  await page.close();
  await framesToMp4(dir, path.join(SCENES_DIR, 'scene5.mp4'));
  console.log('  ✅ Scene 5 done');
}

// ============================
// SCENE 6: Outro CTA (20–24s = 4s)
// ============================
async function captureScene6(browser) {
  console.log('\n🎬 Scene 6: Outro CTA...');
  const dir = path.join(SCENES_DIR, 'scene6');
  ensureDir(dir);

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  // Render a beautiful outro card
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: ${W}px; height: ${H}px;
        background: linear-gradient(160deg, #fff5f7 0%, #fff0f6 40%, #f0f4ff 100%);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        font-family: 'Inter', -apple-system, sans-serif; overflow: hidden;
        position: relative;
      }
      .sparkle { position: absolute; font-size: 48px; animation: float 3s ease-in-out infinite; }
      @keyframes float { 0%,100%{transform:translateY(0) rotate(-5deg);} 50%{transform:translateY(-20px) rotate(5deg);} }
      .brand { font-size: 72px; font-weight: 900; color: #1a1a1a; letter-spacing: -2px; margin-bottom: 12px; }
      .brand span { color: #E8364E; }
      .tagline { font-size: 30px; font-weight: 600; color: #555; text-align: center; max-width: 700px; line-height: 1.4; margin-bottom: 40px; }
      .cta-btn {
        background: #E8364E; color: #fff;
        font-size: 28px; font-weight: 700; padding: 22px 56px;
        border-radius: 60px; border: none;
        box-shadow: 0 16px 48px rgba(232,54,78,0.4);
        margin-bottom: 28px;
      }
      .url { font-size: 24px; color: #999; font-weight: 500; }
      .url span { color: #E8364E; font-weight: 700; }
      .hearts { font-size: 36px; margin-top: 24px; letter-spacing: 8px; }
    </style>
    </head>
    <body>
      <span class="sparkle" style="top:80px;left:80px;">✨</span>
      <span class="sparkle" style="top:120px;right:100px;animation-delay:0.5s;">🌟</span>
      <span class="sparkle" style="bottom:200px;left:60px;animation-delay:1s;">💫</span>
      <span class="sparkle" style="bottom:260px;right:80px;animation-delay:1.5s;">⭐</span>
      <span class="sparkle" style="top:400px;left:30px;font-size:36px;animation-delay:0.8s;">🎉</span>
      <span class="sparkle" style="top:350px;right:40px;font-size:36px;animation-delay:1.2s;">🎊</span>

      <div class="brand">Wish<span>ly</span> ✨</div>
      <div class="tagline">Make their day unforgettable<br>with a personalized surprise website</div>
      <button class="cta-btn">Create Yours — It's Free! 🎁</button>
      <div class="url">Create at <span>wishly.in</span></div>
      <div class="hearts">💙🌸💛</div>
    </body>
    </html>
  `);
  await sleep(800);
  await captureFrames(page, dir, 4000);
  await page.close();
  await framesToMp4(dir, path.join(SCENES_DIR, 'scene6.mp4'));
  console.log('  ✅ Scene 6 done');
}

// ============================
// MAIN
// ============================
async function main() {
  console.log('🚀 Starting Wishly Marketing Video Capture...');
  console.log(`   Output: ${SCENES_DIR}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', `--window-size=${W},${H}`, '--force-device-scale-factor=1'],
  });

  try {
    await captureScene1(browser);
    await captureScene2(browser);
    await captureScene3(browser);
    await captureScene4(browser);
    await captureScene5(browser);
    await captureScene6(browser);
  } finally {
    await browser.close();
  }

  console.log('\n✅ All scenes captured! Run the compose script next.');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
