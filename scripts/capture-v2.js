/**
 * Wishly Marketing Video — PROPER Scene Capture
 * 
 * Captures the ACTUAL working app with phone simulator visible,
 * real mouse clicks with cursor effect, and live interactions.
 * 
 * All scenes captured at 1280×720 landscape (widescreen) to show
 * the full builder + phone simulator side-by-side, then we'll
 * compose a 1080×1920 vertical reel by cropping/zooming the phone.
 * 
 * Scenes:
 *   scene1 — Boring text vs Wishly hook (custom HTML overlay)
 *   scene2 — Wishly landing page hero + scroll to occasions
 *   scene3 — Builder studio: left form + RIGHT phone simulator live
 *   scene4 — /?preview=royal-sapphire keepsake viewer (envelope open, confetti)
 *   scene5 — Share modal with QR code visible
 *   scene6 — Outro CTA card
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

// Capture at 1280×720 wide (shows builder + phone simulator properly)
const W = 1280, H = 720;
const FPS = 24;

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function ff(args, label = '') {
  const preview = typeof args === 'string' ? args.slice(0, 80) : args.slice(0, 4).join(' ');
  console.log(`  [ffmpeg${label ? ' ' + label : ''}]`, preview, '...');
  const cmd = typeof args === 'string' ? `"${FFMPEG}" -y ${args}` : `"${FFMPEG}" -y ${args.join(' ')}`;
  execSync(cmd, { stdio: 'inherit' });
}

// Draw a visible cursor dot on the page at (x, y)
async function showCursor(page, x, y, color = '#E8364E') {
  await page.evaluate((x, y, color) => {
    let el = document.getElementById('__demo_cursor__');
    if (!el) {
      el = document.createElement('div');
      el.id = '__demo_cursor__';
      el.style.cssText = `
        position: fixed; z-index: 999999; pointer-events: none;
        width: 22px; height: 22px; border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 0 2px ${color}, 0 4px 12px rgba(0,0,0,0.4);
        transform: translate(-50%, -50%);
        transition: left 0.1s ease, top 0.1s ease;
      `;
      document.body.appendChild(el);
    }
    el.style.backgroundColor = color;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }, x, y, color);
}

// Smooth mouse move with visible cursor
async function moveTo(page, x, y, steps = 12) {
  const curr = await page.evaluate(() => ({ x: window.__lastX || 0, y: window.__lastY || 0 }));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease in-out
    const nx = curr.x + (x - curr.x) * ease;
    const ny = curr.y + (y - curr.y) * ease;
    await page.mouse.move(nx, ny);
    await showCursor(page, nx, ny);
    await sleep(1000 / FPS);
  }
  await page.evaluate((x, y) => { window.__lastX = x; window.__lastY = y; }, x, y);
}

// Click with ripple animation
async function clickAt(page, x, y, label = '') {
  if (label) console.log(`  🖱️  Click: ${label} @ (${x}, ${y})`);
  await moveTo(page, x, y, 16);
  // Show click ripple
  await page.evaluate((x, y, color) => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed; z-index: 999998; pointer-events: none;
      width: 8px; height: 8px; border-radius: 50%;
      background: ${color}; opacity: 0.9;
      left: ${x}px; top: ${y}px;
      transform: translate(-50%, -50%);
      animation: ripple-out 0.5s ease-out forwards;
    `;
    const style = document.createElement('style');
    style.textContent = `@keyframes ripple-out {
      0% { width: 8px; height: 8px; opacity: 0.9; }
      100% { width: 48px; height: 48px; opacity: 0; }
    }`;
    document.head.appendChild(style);
    document.body.appendChild(ripple);
    setTimeout(() => { ripple.remove(); style.remove(); }, 600);
  }, x, y, '#E8364E');
  await page.mouse.click(x, y);
  await sleep(200);
}

// Capture frames at FPS
async function captureFrames(page, dir, durationMs, label = '') {
  ensureDir(dir);
  const frameCount = Math.ceil((durationMs / 1000) * FPS);
  const interval = 1000 / FPS;
  process.stdout.write(`  📸 Capturing ${frameCount} frames (${label || durationMs + 'ms'})`);
  for (let i = 0; i < frameCount; i++) {
    const framePath = path.join(dir, `frame${String(i).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    if (i % 12 === 0) process.stdout.write('.');
    await sleep(interval);
  }
  console.log(` done (${frameCount} frames)`);
  return frameCount;
}

// Convert frames to MP4
function framesToMp4(framesDir, outputMp4, fps = FPS) {
  const input = path.join(framesDir, 'frame%04d.png');
  ff(`-framerate ${fps} -i "${input}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 20 "${outputMp4}"`, path.basename(outputMp4));
}

// ─────────────────────────────────────────────
// SCENE 1: Hook (3.5s) — Boring text vs Wishly
// ─────────────────────────────────────────────
async function scene1(browser) {
  console.log('\n🎬 Scene 1: The Hook (boring texts vs Wishly)...');
  const dir = path.join(SCENES_DIR, 'sc1');
  ensureDir(dir);
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  await page.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      width:${W}px; height:${H}px;
      background: linear-gradient(135deg,#0f0c29,#302b63,#24243e);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display:flex; align-items:center; justify-content:center; gap:60px;
      overflow:hidden; position:relative;
    }
    /* Left: boring chat mockup */
    .phone {
      width:260px; background:#1c1c1e; border-radius:36px;
      box-shadow:0 24px 64px rgba(0,0,0,0.7), 0 0 0 2px #333;
      overflow:hidden; flex-shrink:0;
    }
    .phone-bar {
      background:#000; padding:12px 20px 8px;
      display:flex; align-items:center; gap:10px; color:#fff;
      font-size:13px; font-weight:600;
    }
    .av { width:32px;height:32px;border-radius:50%;background:#3a3a5c;
          display:flex;align-items:center;justify-content:center;font-size:16px; }
    .msgs { padding:14px 12px; display:flex; flex-direction:column; gap:8px; min-height:220px; }
    .b { padding:10px 14px; border-radius:16px; font-size:13px; line-height:1.4; max-width:80%; }
    .s { background:#1c7a3d; color:#fff; align-self:flex-end; border-bottom-right-radius:4px; }
    .r { background:#2c2c2e; color:#fff; align-self:flex-start; border-bottom-left-radius:4px; }
    /* Right: Wishly teaser */
    .wishly-teaser {
      text-align:center;
    }
    .vs { font-size:28px; font-weight:900; color:rgba(255,255,255,0.3); margin:0 0; letter-spacing:2px; }
    .brand { font-size:54px; font-weight:900; color:#fff; line-height:1.1; }
    .brand span { color:#E8364E; }
    .sub { font-size:18px; color:rgba(255,255,255,0.6); margin-top:8px; }
    /* Badge labels */
    .badge-bad {
      position:absolute; top:30px; left:50px;
      background:rgba(255,50,50,0.15); border:1.5px solid rgba(255,50,50,0.5);
      color:#ff6b6b; font-size:13px; font-weight:700;
      padding:6px 16px; border-radius:20px;
    }
    .badge-good {
      position:absolute; top:30px; right:60px;
      background:rgba(232,54,78,0.15); border:1.5px solid rgba(232,54,78,0.5);
      color:#E8364E; font-size:13px; font-weight:700;
      padding:6px 16px; border-radius:20px;
    }
    .big-emoji { font-size:80px; position:absolute; top:60px; left:200px; opacity:0.12; }
    .sparkles { position:absolute; bottom:50px; right:100px; font-size:40px; opacity:0.2; }
  </style>
  </head><body>
    <div class="big-emoji">😴</div>
    <div class="sparkles">✨🎉💫</div>
    <div class="badge-bad">❌ Boring & Generic</div>
    <div class="badge-good">✨ Make it Special</div>

    <!-- boring chat -->
    <div class="phone">
      <div class="phone-bar">
        <div class="av">👤</div>
        <div>Rohan</div>
      </div>
      <div class="msgs">
        <div class="b s">Bhai Happy Birthday 🎂</div>
        <div class="b s">HBD bro enjoy!</div>
        <div class="b r">Thanks 😊</div>
        <div class="b s">Have a great day!</div>
        <div class="b r">Ok 👍</div>
      </div>
    </div>

    <div class="vs">VS</div>

    <!-- Wishly teaser -->
    <div class="wishly-teaser">
      <div class="brand">Wish<span>ly</span></div>
      <div style="font-size:48px;margin:8px 0;">✨</div>
      <div class="sub">Create a surprise website<br>for someone special</div>
    </div>
  </body></html>`);

  await sleep(500);
  await captureFrames(page, dir, 3500, '3.5s hook');
  await page.close();
  framesToMp4(dir, path.join(SCENES_DIR, 'scene1.mp4'));
  console.log('  ✅ Scene 1 done');
}

// ─────────────────────────────────────────────
// SCENE 2: Landing page + occasion click (4.5s)
// ─────────────────────────────────────────────
async function scene2(browser) {
  console.log('\n🎬 Scene 2: Wishly landing page + occasion selection...');
  const dir = path.join(SCENES_DIR, 'sc2');
  ensureDir(dir);
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1200);

  const FPS2 = FPS;
  let frameIdx = 0;
  const interval = 1000 / FPS2;
  const totalDuration = 4500;
  const totalFrames = Math.ceil((totalDuration / 1000) * FPS2);

  process.stdout.write(`  📸 Capturing ${totalFrames} frames...`);

  // Phase 1: Hold on hero (1.5s = 36 frames)
  for (let i = 0; i < 36; i++) {
    await page.screenshot({ path: path.join(dir, `frame${String(frameIdx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }

  // Find and hover "Start Creating" button
  const startBtn = await page.$('button');
  let btnBounds = null;
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Start Creating')) {
      btnBounds = await b.boundingBox();
      break;
    }
  }

  // Phase 2: Scroll down slowly (1s = 24 frames)
  for (let i = 0; i < 24; i++) {
    await page.evaluate((i) => window.scrollTo({ top: i * 8 }), i);
    await showCursor(page, btnBounds ? btnBounds.x + btnBounds.width / 2 : 640, btnBounds ? btnBounds.y + btnBounds.height / 2 : 360);
    await page.screenshot({ path: path.join(dir, `frame${String(frameIdx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }

  // Phase 3: Move cursor to Start Creating button (0.8s = 19 frames)
  if (btnBounds) {
    const bx = btnBounds.x + btnBounds.width / 2;
    const by = btnBounds.y + btnBounds.height / 2;
    for (let i = 0; i < 19; i++) {
      await showCursor(page, bx, by);
      await page.screenshot({ path: path.join(dir, `frame${String(frameIdx++).padStart(4,'0')}.png`) });
      await sleep(interval);
    }
    // Click it
    await clickAt(page, bx, by, 'Start Creating');
  }
  await sleep(600);

  // Phase 4: Capture the modal (1.2s = 29 frames)
  for (let i = 0; i < Math.max(0, totalFrames - frameIdx); i++) {
    await page.screenshot({ path: path.join(dir, `frame${String(frameIdx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }
  console.log(' done');

  await page.close();
  framesToMp4(dir, path.join(SCENES_DIR, 'scene2.mp4'));
  console.log('  ✅ Scene 2 done');
}

// ─────────────────────────────────────────────
// SCENE 3: Builder Studio with Phone Simulator (6s)
// Focus on the RIGHT side phone preview with real interactions
// ─────────────────────────────────────────────
async function scene3(browser) {
  console.log('\n🎬 Scene 3: Builder Studio + Live Phone Simulator...');
  const dir = path.join(SCENES_DIR, 'sc3');
  ensureDir(dir);
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(800);

  // Navigate into builder: click "Start Creating"
  let allBtns = await page.$$('button');
  for (const b of allBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Start Creating')) {
      const box = await b.boundingBox();
      if (box) await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Start Creating');
      break;
    }
  }
  await sleep(900);

  // Step 1: Click "Birthday Celebration" occasion card
  allBtns = await page.$$('button, [role="button"]');
  for (const b of allBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && (txt.includes('Birthday') || txt.includes('Celebration'))) {
      const box = await b.boundingBox();
      if (box && box.width > 100) {
        await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Birthday Celebration');
        break;
      }
    }
  }
  await sleep(900);

  // Step 2: Click boy/girl selector in the recipient modal
  allBtns = await page.$$('button');
  for (const b of allBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && (txt.match(/boy|him|bro|king/i) || txt.includes('👦') || txt.includes('🎂'))) {
      const box = await b.boundingBox();
      if (box && box.y > 100 && box.width > 60) {
        await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Boy');
        break;
      }
    }
  }
  await sleep(2500); // Wait for builder to fully load

  // We're now in builder studio. Let's capture it.
  // Detect if we're still on modal vs builder by checking for phone simulator
  const isInBuilder = await page.evaluate(() => !!document.querySelector('.shrink-0'));
  console.log('  Builder loaded:', isInBuilder);
  // First scroll right to show the phone simulator
  const frameCount = Math.ceil(6 * FPS);
  const interval = 1000 / FPS;
  let idx = 0;
  process.stdout.write(`  📸 Capturing ${frameCount} frames (builder studio)...`);

  // Phase 1: Initial view of builder (1s)
  for (let i = 0; i < 24; i++) {
    await page.screenshot({ path: path.join(dir, `frame${String(idx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }

  // Phase 2: Move cursor to phone simulator area (right side ~940px x)
  for (let i = 0; i < 20; i++) {
    const x = 640 + (i / 20) * 340;
    await showCursor(page, x, 360);
    await page.screenshot({ path: path.join(dir, `frame${String(idx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }

  // Phase 3: Hover around phone simulator (1.5s)
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    const cx = 980, cy = 360;
    const rx = 30, ry = 20;
    await showCursor(page, cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry);
    await page.screenshot({ path: path.join(dir, `frame${String(idx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }

  // Phase 4: Click "Media" tab in left panel
  const tabBtns = await page.$$('button');
  for (const b of tabBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && (txt.includes('Photo') || txt.includes('Media') || txt.includes('Song'))) {
      const box = await b.boundingBox();
      if (box && box.x < 800) {
        await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Media tab');
        break;
      }
    }
  }
  await sleep(800);

  // Remaining frames
  while (idx < frameCount) {
    await page.screenshot({ path: path.join(dir, `frame${String(idx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }
  console.log(' done');

  await page.close();
  framesToMp4(dir, path.join(SCENES_DIR, 'scene3.mp4'));
  console.log('  ✅ Scene 3 done');
}

// ─────────────────────────────────────────────
// SCENE 4: Live Keepsake Viewer — envelope interaction (5s)
// ─────────────────────────────────────────────
async function scene4(browser) {
  console.log('\n🎬 Scene 4: Live Keepsake Viewer + Envelope Interaction...');
  const dir = path.join(SCENES_DIR, 'sc4');
  ensureDir(dir);
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}/?preview=royal-sapphire`, { waitUntil: 'networkidle2' });
  await sleep(2000);

  const frameCount = Math.ceil(5 * FPS);
  const interval = 1000 / FPS;
  let idx = 0;
  process.stdout.write(`  📸 Capturing ${frameCount} frames (keepsake viewer)...`);

  // Phase 1: View the initial screen (1.5s)
  for (let i = 0; i < 36; i++) {
    await page.screenshot({ path: path.join(dir, `frame${String(idx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }

  // Scroll down to find the envelope / wax seal
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'smooth' }));
  await sleep(500);

  // Try clicking the wax seal / envelope button
  const allBtns = await page.$$('button, [role="button"], .cursor-pointer');
  for (const el of allBtns) {
    const txt = await page.evaluate(e => (e.textContent + ' ' + (e.getAttribute('class') || '')), el);
    if (txt.match(/seal|envelope|open|letter|tap|click|reveal|wax/i)) {
      const box = await el.boundingBox();
      if (box && box.width > 20 && box.height > 20) {
        console.log('\n  💌 Found envelope trigger, clicking...');
        await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Wax Seal/Envelope');
        break;
      }
    }
  }
  await sleep(800);

  // Phase 2: Capture post-click envelope animation (3.5s)
  while (idx < frameCount) {
    await page.screenshot({ path: path.join(dir, `frame${String(idx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }
  console.log(' done');

  await page.close();
  framesToMp4(dir, path.join(SCENES_DIR, 'scene4.mp4'));
  console.log('  ✅ Scene 4 done');
}

// ─────────────────────────────────────────────
// SCENE 5: Back to builder → Share modal + QR (4s)
// ─────────────────────────────────────────────
async function scene5(browser) {
  console.log('\n🎬 Scene 5: Builder → Publish → Share Modal...');
  const dir = path.join(SCENES_DIR, 'sc5');
  ensureDir(dir);
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(800);

  // Open builder
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Start Creating')) {
      const box = await b.boundingBox();
      if (box) await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Start Creating');
      break;
    }
  }
  await sleep(700);

  // Pick birthday boy
  const mBtns = await page.$$('button');
  for (const b of mBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.match(/boy|👦/i)) {
      const box = await b.boundingBox();
      if (box && box.y > 100) {
        await clickAt(page, box.x + box.width/2, box.y + box.height/2, 'Birthday Boy');
        break;
      }
    }
  }
  await sleep(2000);

  // Find publish / create surprise button
  const pBtns = await page.$$('button');
  let publishBtn = null;
  for (const b of pBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && (txt.match(/publish|create surprise|generate|share|send/i))) {
      const box = await b.boundingBox();
      if (box) { publishBtn = { el: b, box }; break; }
    }
  }

  const frameCount = Math.ceil(4 * FPS);
  const interval = 1000 / FPS;
  let idx = 0;
  process.stdout.write(`  📸 Capturing ${frameCount} frames...`);

  // Capture builder first (1.5s)
  for (let i = 0; i < 36; i++) {
    await page.screenshot({ path: path.join(dir, `frame${String(idx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }

  if (publishBtn) {
    await clickAt(page, publishBtn.box.x + publishBtn.box.width/2, publishBtn.box.y + publishBtn.box.height/2, 'Publish');
    await sleep(1000);
  }

  // Remaining frames
  while (idx < frameCount) {
    await page.screenshot({ path: path.join(dir, `frame${String(idx++).padStart(4,'0')}.png`) });
    await sleep(interval);
  }
  console.log(' done');

  await page.close();
  framesToMp4(dir, path.join(SCENES_DIR, 'scene5.mp4'));
  console.log('  ✅ Scene 5 done');
}

// ─────────────────────────────────────────────
// SCENE 6: Outro CTA (4s)
// ─────────────────────────────────────────────
async function scene6(browser) {
  console.log('\n🎬 Scene 6: Outro CTA...');
  const dir = path.join(SCENES_DIR, 'sc6');
  ensureDir(dir);
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  await page.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8">
  <style>
    @keyframes float { 0%,100%{transform:translateY(0) rotate(-3deg);} 50%{transform:translateY(-14px) rotate(3deg);} }
    @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.04);} }
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      width:${W}px; height:${H}px;
      background:linear-gradient(135deg,#fff5f7 0%,#ffeef5 50%,#f5f0ff 100%);
      display:flex; align-items:center; justify-content:center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      position:relative; overflow:hidden;
    }
    .card {
      text-align:center; padding:60px 80px;
      background:rgba(255,255,255,0.85);
      border-radius:32px;
      box-shadow: 0 24px 80px rgba(232,54,78,0.12), 0 4px 24px rgba(0,0,0,0.06);
      border: 1.5px solid rgba(232,54,78,0.1);
    }
    .brand { font-size:64px; font-weight:900; color:#1a1a1a; letter-spacing:-2px; }
    .brand span { color:#E8364E; }
    .tag { font-size:22px; color:#666; margin:16px 0 32px; font-weight:500; line-height:1.5; }
    .cta {
      display:inline-block; background:#E8364E; color:#fff;
      font-size:22px; font-weight:700; padding:18px 48px;
      border-radius:50px; border:none; cursor:pointer;
      box-shadow:0 12px 40px rgba(232,54,78,0.35);
      animation: pulse 2s ease-in-out infinite;
      margin-bottom:20px;
    }
    .url { font-size:18px; color:#aaa; font-weight:500; }
    .url span { color:#E8364E; font-weight:700; }
    .sp1 { position:absolute; top:50px; left:80px; font-size:44px; animation:float 2.5s ease-in-out infinite; }
    .sp2 { position:absolute; top:40px; right:100px; font-size:36px; animation:float 3s ease-in-out infinite 0.5s; }
    .sp3 { position:absolute; bottom:80px; left:60px; font-size:32px; animation:float 2.8s ease-in-out infinite 1s; }
    .sp4 { position:absolute; bottom:60px; right:80px; font-size:44px; animation:float 3.2s ease-in-out infinite 0.3s; }
    .sp5 { position:absolute; top:50%; left:40px; font-size:28px; animation:float 2.2s ease-in-out infinite 0.8s; }
    .sp6 { position:absolute; top:50%; right:50px; font-size:28px; animation:float 2.6s ease-in-out infinite 1.2s; }
  </style>
  </head><body>
    <div class="sp1">✨</div>
    <div class="sp2">🎉</div>
    <div class="sp3">💫</div>
    <div class="sp4">🌟</div>
    <div class="sp5">💙</div>
    <div class="sp6">🌸</div>
    <div class="card">
      <div class="brand">Wish<span>ly</span> ✨</div>
      <div class="tag">Turn photos, letters & songs<br>into a heartfelt interactive website.</div>
      <div class="cta">Create Yours — It's FREE! 🎁</div><br>
      <div class="url">wishly.in &nbsp;·&nbsp; No coding needed &nbsp;·&nbsp; Ready in 60 seconds</div>
    </div>
  </body></html>`);

  await sleep(600);
  await captureFrames(page, dir, 4000, '4s outro');
  await page.close();
  framesToMp4(dir, path.join(SCENES_DIR, 'scene6.mp4'));
  console.log('  ✅ Scene 6 done');
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('🚀 Wishly Marketing Video — PROPER Capture with Phone Simulator');
  console.log(`   Viewport: ${W}×${H} @ ${FPS}fps`);
  console.log(`   Output: ${SCENES_DIR}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--window-size=${W},${H}`,
      '--force-device-scale-factor=1',
      '--disable-web-security',
    ],
  });

  try {
    await scene1(browser);
    await scene2(browser);
    await scene3(browser);
    await scene4(browser);
    await scene5(browser);
    await scene6(browser);
  } finally {
    await browser.close();
  }

  console.log('\n✅ All scenes done! Now run: node scripts/compose-v2.js');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
