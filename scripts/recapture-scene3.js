/**
 * Re-capture scene3 only: Builder Studio with phone simulator properly visible.
 * Opens builder via direct URL param approach to skip the modals.
 */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SCENES_DIR = path.join(ROOT, 'media', 'marketing-video', 'scenes');
const FFMPEG = 'C:\\Users\\hp\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5174';
const W = 1280, H = 720, FPS = 24;

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function showCursor(page, x, y, color = '#E8364E') {
  await page.evaluate((x, y, color) => {
    let el = document.getElementById('__demo_cursor__');
    if (!el) {
      el = document.createElement('div');
      el.id = '__demo_cursor__';
      el.style.cssText = `position:fixed;z-index:999999;pointer-events:none;width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px ${color},0 4px 12px rgba(0,0,0,0.4);transform:translate(-50%,-50%);`;
      document.body.appendChild(el);
    }
    el.style.backgroundColor = color;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }, x, y, color);
}

async function clickAt(page, x, y, label = '') {
  if (label) console.log(`  🖱️  Click: ${label} @ (${Math.round(x)}, ${Math.round(y)})`);
  await showCursor(page, x, y);
  await page.evaluate((x, y) => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `position:fixed;z-index:999998;pointer-events:none;width:8px;height:8px;border-radius:50%;background:#E8364E;opacity:0.9;left:${x}px;top:${y}px;transform:translate(-50%,-50%);animation:rpl 0.5s ease-out forwards;`;
    const s = document.createElement('style');
    s.textContent = `@keyframes rpl{0%{width:8px;height:8px;opacity:0.9}100%{width:52px;height:52px;opacity:0}}`;
    document.head.appendChild(s);
    document.body.appendChild(ripple);
    setTimeout(()=>{ripple.remove();s.remove();},600);
  }, x, y);
  await page.mouse.click(x, y);
  await sleep(200);
}

async function main() {
  console.log('🎬 Re-capturing Scene 3: Builder + Phone Simulator');

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', `--window-size=${W},${H}`, '--force-device-scale-factor=1'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  // Load home
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(800);

  console.log('  Clicking Start Creating...');
  let btns = await page.$$('button');
  for (const b of btns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Start Creating')) {
      const box = await b.boundingBox();
      if (box) { await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Start Creating'); break; }
    }
  }
  await sleep(1000);

  // Now we should see "What are you celebrating?" modal — click Birthday Celebration
  console.log('  Clicking Birthday Celebration...');
  btns = await page.$$('button');
  for (const b of btns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.match(/birthday/i)) {
      const box = await b.boundingBox();
      if (box && box.width > 80) { await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Birthday'); break; }
    }
  }
  await sleep(1000);

  // Now we might see "Who is the birthday for?" → Boy / Girl
  console.log('  Looking for Boy/Girl selector...');
  btns = await page.$$('button');
  let clicked = false;
  for (const b of btns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.match(/boy|girl|him|her/i)) {
      const box = await b.boundingBox();
      if (box && box.y > 100) {
        await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Boy/Girl');
        clicked = true; break;
      }
    }
  }

  // If no boy/girl found, log page state
  if (!clicked) {
    const url = page.url();
    console.log('  ⚠️  No boy/girl btn found. URL:', url);
    const allTxt = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()).join(' | '));
    console.log('  Buttons visible:', allTxt.slice(0, 300));
  }

  // Wait for builder to load
  await sleep(3500);

  // Check current URL and page state
  const url = page.url();
  console.log('  Page URL after nav:', url);
  const hasSim = await page.evaluate(() => {
    // Look for the phone simulator div or builder markers
    return !!(document.querySelector('[class*="LivePhone"]') ||
              document.querySelector('[style*="420px"]') ||
              document.querySelector('.shrink-0') ||
              document.title.includes('Builder') ||
              document.body.innerHTML.includes('phone'));
  });
  console.log('  Builder/simulator visible:', hasSim);

  // Take a snapshot first
  await page.screenshot({ path: path.join(SCENES_DIR, 'debug_scene3_state.png') });
  console.log('  Saved debug snapshot');

  // Now capture 6s of builder
  const dir = path.join(SCENES_DIR, 'sc3');
  ensureDir(dir);
  // Remove old frames
  fs.readdirSync(dir).forEach(f => fs.unlinkSync(path.join(dir, f)));

  const frameCount = Math.ceil(6 * FPS);
  const interval = 1000 / FPS;
  let idx = 0;
  process.stdout.write(`  📸 Capturing ${frameCount} frames...`);

  // Phase 1: Show the full builder layout (2s)
  for (let i = 0; i < 48; i++) {
    await showCursor(page, 900 + Math.sin(i * 0.2) * 30, 360 + Math.cos(i * 0.15) * 20);
    await page.screenshot({ path: path.join(dir, `frame${String(idx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }

  // Phase 2: Click on "Media" or "Photo & Song" tab in builder (if exists)
  btns = await page.$$('button');
  for (const b of btns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && (txt.includes('Photo') || txt.includes('Media') || txt.includes('Song'))) {
      const box = await b.boundingBox();
      if (box && box.x < 800) {
        await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Media/Photo tab');
        break;
      }
    }
  }
  await sleep(600);

  // Phase 3: Hover over the right panel (phone simulator area)
  for (let i = 0; i < Math.max(0, frameCount - idx); i++) {
    const t = i / (frameCount - idx);
    await showCursor(page, 960 + Math.sin(t * Math.PI * 3) * 40, 360 + Math.cos(t * Math.PI * 2) * 60);
    await page.screenshot({ path: path.join(dir, `frame${String(idx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }
  console.log(` done (${idx} frames)`);

  await browser.close();

  // Convert to MP4
  console.log('  Converting to MP4...');
  const input = path.join(dir, 'frame%04d.png');
  execSync(`"${FFMPEG}" -y -framerate ${FPS} -i "${input}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 20 "${path.join(SCENES_DIR, 'scene3.mp4')}"`, { stdio: 'inherit' });
  console.log('  ✅ scene3.mp4 updated!');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
