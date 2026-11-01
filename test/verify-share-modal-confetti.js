import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:/Users/hp/.gemini/antigravity-cli/brain/e0e6b5bc-9361-4005-afae-ef68c72d0d8f';

async function run() {
  console.log('🚀 Running High-Precision Confetti & Modal Compositor Benchmark...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-gpu',
      '--disable-gpu-vsync'
    ]
  });

  try {
    const page = await browser.newPage();
    // Simulate high-density mobile viewport (iPhone 14 Pro: 393x852 @ 3x DPR)
    await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 3 });

    console.log('1. Navigating to builder studio...');
    await page.goto('http://localhost:5174/?view=builder&category=birthday&template=lavender-dream', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    // Advance to Form step
    const proceedBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Proceed to Form'));
    });
    if (proceedBtn) {
      await proceedBtn.click();
      await new Promise(r => setTimeout(r, 600));
    }

    const createBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Create') && b.textContent.includes('Live Link'));
    });

    if (!createBtn) throw new Error('Create button not found');

    // Attach frame recorder
    await page.evaluate(() => {
      window.__frameTimes = [];
      window.__recording = false;
      window.__lastTime = performance.now();
      function recordFrame(now) {
        if (window.__recording) {
          const delta = now - window.__lastTime;
          window.__frameTimes.push(delta);
        }
        window.__lastTime = now;
        requestAnimationFrame(recordFrame);
      }
      requestAnimationFrame(recordFrame);
    });

    console.log('2. Clicking Create & Share Live Link...');
    await createBtn.click();

    // Wait until modal appears in DOM
    await page.waitForFunction(() => {
      return document.querySelector('h3') && document.querySelector('h3').textContent.includes('Surprise is Ready');
    }, { timeout: 10000 });

    console.log('3. Modal visible! Recording entrance & confetti burst frames...');

    // Start recording frames purely during the entire 2200ms confetti celebration
    await page.evaluate(() => {
      window.__lastTime = performance.now();
      window.__frameTimes = [];
      window.__recording = true;
    });

    // Let the cannons fire (220ms) and shower burst (340ms) and fall across 2000ms
    await new Promise(r => setTimeout(r, 2000));

    // Stop recording
    await page.evaluate(() => {
      window.__recording = false;
    });

    const metrics = await page.evaluate(() => {
      const frames = window.__frameTimes || [];
      if (frames.length === 0) return { error: 'No frames recorded' };

      const totalTime = frames.reduce((a, b) => a + b, 0);
      const avgFrameTime = totalTime / frames.length;
      const avgFps = 1000 / avgFrameTime;
      const sorted = [...frames].sort((a, b) => b - a);
      const maxFrameTime = sorted[0];
      const p95FrameTime = sorted[Math.floor(sorted.length * 0.05)];
      const p99FrameTime = sorted[Math.floor(sorted.length * 0.01)];
      const minFps = 1000 / maxFrameTime;
      const p1LowFps = 1000 / p99FrameTime;

      const jankFramesOver20ms = frames.filter(f => f > 20).length;
      const jankFramesOver33ms = frames.filter(f => f > 33.33).length;
      const jankFramesOver50ms = frames.filter(f => f > 50).length;

      return {
        totalFrames: frames.length,
        durationMs: Math.round(totalTime),
        avgFps: Math.round(avgFps * 10) / 10,
        minFps: Math.round(minFps * 10) / 10,
        p1LowFps: Math.round(p1LowFps * 10) / 10,
        avgFrameTimeMs: Math.round(avgFrameTime * 100) / 100,
        maxFrameTimeMs: Math.round(maxFrameTime * 100) / 100,
        p95FrameTimeMs: Math.round(p95FrameTime * 100) / 100,
        p99FrameTimeMs: Math.round(p99FrameTime * 100) / 100,
        jankFramesOver20ms,
        jankFramesOver33ms,
        jankFramesOver50ms,
        first25FramesMs: frames.slice(0, 25).map(f => Math.round(f * 10) / 10)
      };
    });

    console.log('✅ Pure FPS & Frame Latency Metrics:\n', JSON.stringify(metrics, null, 2));

    // Also desktop screenshot (1280x800)
    await page.setViewport({ width: 1280, height: 800 });
    const desktopScreenshot = path.join(ARTIFACT_DIR, 'qa-confetti-desktop.png');
    await page.screenshot({ path: desktopScreenshot });
    console.log('📸 Captured desktop screenshot to:', desktopScreenshot);

  } catch (err) {
    console.error('Benchmark failed:', err);
  } finally {
    await browser.close();
  }
}

run();
