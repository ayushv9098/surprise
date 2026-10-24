/**
 * Wishly Marketing Video v2 Composer
 * 
 * Input scenes are 1280×720 (wide, shows full builder + phone simulator).
 * We have TWO output modes per scene:
 *   - Full-width crops for scenes that don't need the simulator
 *   - Phone-simulator crop/zoom for builder scenes (right panel ~420px wide)
 * 
 * Final output: 1080×1920 vertical reel.
 */
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FFMPEG = 'C:\\Users\\hp\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe';
const SCENES = path.join(ROOT, 'media', 'marketing-video', 'scenes');
const AUDIO = path.join(ROOT, 'media', 'marketing-video', 'audio');
const OUTPUT = path.join(ROOT, 'media', 'marketing-video', 'v2');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function ff(args, label = '') {
  const cmd = `"${FFMPEG}" -y ${args}`;
  console.log(`  [ffmpeg] ${label || args.slice(0, 80)}...`);
  try {
    execSync(cmd, { stdio: 'inherit', maxBuffer: 500 * 1024 * 1024 });
  } catch (e) {
    console.error(`  ❌ FFmpeg failed: ${e.message}`);
    throw e;
  }
}

// Check that all input scene files exist
function checkScenes() {
  const missing = [];
  for (let i = 1; i <= 6; i++) {
    const f = path.join(SCENES, `scene${i}.mp4`);
    if (!fs.existsSync(f)) missing.push(`scene${i}.mp4`);
  }
  if (missing.length) {
    console.error('❌ Missing scenes:', missing.join(', '));
    process.exit(1);
  }
  console.log('  ✅ All 6 scenes found');
}

// Scene crop/zoom config (from 1280×720 source).
// Source is 1280×720. Target is 1080×1920.
// 1280×720 = 16:9. To get 9:16 we scale height to 1920 → width = 1920*(16/9)= 3413, crop 1080 center.
// OR: scale width to 1080 → height = 1080*(9/16) = 607 (not enough for 1920, need to pad or zoom differently)
// CORRECT approach: scale so height=1920, then crop width to 1080 from center.
const SCENE_FILTERS = {
  // Hook: scale h=1920, crop w=1080 center
  1: `scale=3414:1920,crop=1080:1920:(iw-1080)/2:0`,
  // Landing page: same
  2: `scale=3414:1920,crop=1080:1920:(iw-1080)/2:0`,
  // Builder: crop phone simulator right panel (x=855, w=425, h=720 → 425/720 ≈ 9:16.2)
  // then scale to 1080×1920
  3: `crop=405:720:855:0,scale=1080:1920:flags=lanczos`,
  // Keepsake viewer: scale h=1920, crop center
  4: `scale=3414:1920,crop=1080:1920:(iw-1080)/2:0`,
  // Share modal: scale h=1920, crop center
  5: `scale=3414:1920,crop=1080:1920:(iw-1080)/2:0`,
  // Outro: scale h=1920, crop center
  6: `scale=3414:1920,crop=1080:1920:(iw-1080)/2:0`,
};

// Step 1: Process each scene to 1080×1920
function processScenes() {
  console.log('\n📐 Processing scenes to 1080×1920...');
  for (let i = 1; i <= 6; i++) {
    const input = path.join(SCENES, `scene${i}.mp4`);
    const output = path.join(OUTPUT, `s${i}.mp4`);
    const filter = SCENE_FILTERS[i];
    ff(`-i "${input}" -vf "${filter},fps=24,format=yuv420p" -c:v libx264 -preset fast -crf 18 -an "${output}"`, `scene${i}`);
    console.log(`  ✅ s${i}.mp4 → 1080×1920`);
  }
}

// Step 2: Concat scenes
function concatScenes() {
  console.log('\n🔗 Concatenating all scenes...');
  const listFile = path.join(OUTPUT, 'list.txt');
  const lines = [1,2,3,4,5,6].map(i => `file '${path.join(OUTPUT, `s${i}.mp4`).replace(/\\/g, '/')}'`);
  fs.writeFileSync(listFile, lines.join('\n'));
  ff(`-f concat -safe 0 -i "${listFile}" -c:v copy "${path.join(OUTPUT, 'video_raw.mp4')}"`, 'concat');
  console.log('  ✅ video_raw.mp4');
}

// Step 3: Mix audio
function mixAudio() {
  console.log('\n🎵 Mixing BGM + SFX...');
  const bgm        = path.join(AUDIO, 'bgm.mp3');
  const sfxBeep    = path.join(AUDIO, 'sfx_dull_beep.wav');
  const sfxScratch = path.join(AUDIO, 'sfx_record_scratch.wav');
  const sfxWhoosh  = path.join(AUDIO, 'sfx_whoosh.wav');
  const sfxSparkle = path.join(AUDIO, 'sfx_sparkle_pop.wav');
  const sfxConfetti= path.join(AUDIO, 'sfx_confetti_burst.wav');
  const sfxChime   = path.join(AUDIO, 'sfx_chime.wav');

  // Duration from scene timing:
  // s1: 3.5s, s2: 4.5s, s3: 6.0s, s4: 5.0s, s5: 4.0s, s6: 4.0s = 27s total

  ff(
    `-i "${bgm}" -i "${sfxBeep}" -i "${sfxScratch}" -i "${sfxWhoosh}" -i "${sfxSparkle}" -i "${sfxWhoosh}" -i "${sfxConfetti}" -i "${sfxWhoosh}" -i "${sfxChime}" ` +
    `-filter_complex ` +
    `"[0:a]atrim=0:27,asetpts=PTS-STARTPTS,volume=0.22,afade=t=in:st=0:d=0.5,afade=t=out:st=25.5:d=1.5[bgm];` +
    `[1:a]adelay=0|0[s1];` +
    `[2:a]adelay=3000|3000[s2];` +
    `[3:a]adelay=3400|3400[s3];` +
    `[4:a]adelay=8000|8000[s4];` +
    `[5:a]adelay=13400|13400[s5];` +
    `[6:a]adelay=14300|14300[s6];` +
    `[7:a]adelay=18200|18200[s7];` +
    `[8:a]adelay=23200|23200[s8];` +
    `[bgm][s1][s2][s3][s4][s5][s6][s7][s8]amix=inputs=9:duration=first:normalize=0[mix];` +
    `[mix]atrim=0:27,asetpts=PTS-STARTPTS[audio_out]" ` +
    `-map "[audio_out]" -t 27 -ar 44100 -ac 2 -ab 192k "${path.join(OUTPUT, 'audio_mix.aac')}"`,
    'audio mix'
  );
  console.log('  ✅ audio_mix.aac');
}

// Step 4: Burn captions + kinetic text
function addCaptions() {
  console.log('\n💬 Burning kinetic captions...');
  const font = 'C\\:/Windows/Fonts/arialbd.ttf';

  // Timeline (cumulative seconds):
  // s1: 0.0–3.5 | s2: 3.5–8.0 | s3: 8.0–14.0 | s4: 14.0–19.0 | s5: 19.0–23.0 | s6: 23.0–27.0

  const captions = [
    // Scene 1
    { t: "Still sending boring birthday texts?", st: 0.3, en: 2.5, y: 80, sz: 54, col: 'white' },
    { t: "Ye sab outdated hai yaar!", st: 1.5, en: 3.3, y: 148, sz: 40, col: '#ff9999' },
    // Scene 2
    { t: "Banao unke liye ek SURPRISE WEBSITE", st: 3.7, en: 7.0, y: 80, sz: 48, col: 'white' },
    { t: "Sirf 60 seconds mein! ✨", st: 5.0, en: 7.8, y: 148, sz: 40, col: '#ffe0e8' },
    // Scene 3
    { t: "Phone simulator: live preview dekho!", st: 8.3, en: 11.5, y: 80, sz: 46, col: 'white' },
    { t: "Add photo + letter + song 🎵", st: 9.5, en: 13.8, y: 148, sz: 40, col: '#e8f4ff' },
    // Scene 4
    { t: "Wax seal + Interactive envelope! 💌", st: 14.2, en: 17.0, y: 80, sz: 48, col: 'white' },
    { t: "Confetti blast guaranteed! 🎉", st: 15.5, en: 18.8, y: 148, sz: 42, col: '#ffd700' },
    // Scene 5
    { t: "Share via WhatsApp ya QR Code 📲", st: 19.2, en: 22.0, y: 80, sz: 48, col: 'white' },
    { t: "100% FREE — no signup needed!", st: 20.2, en: 22.8, y: 148, sz: 40, col: '#90ee90' },
    // Scene 6
    { t: "Unka din unforgettable bana do! ✨", st: 23.3, en: 26.0, y: 1680, sz: 46, col: '#E8364E' },
    { t: "Create yours FREE at Wishly!", st: 24.2, en: 27.0, y: 1750, sz: 40, col: '#333333' },
  ];

  const drawFilters = captions.map(c => {
    const safe = c.t
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\u2019")
      .replace(/:/g, '\\:')
      .replace(/[^\x00-\x7F]/g, '?');
    const alpha = `if(between(t\\,${c.st}\\,${c.en})\\,min(1\\,(t-${c.st})*5)*min(1\\,(${c.en}-t)*5)\\,0)`;
    return `drawtext=fontfile='${font}':text='${safe}':fontsize=${c.sz}:fontcolor=${c.col}:x=(w-text_w)/2:y=${c.y}:alpha='${alpha}':shadowcolor=0x00000088:shadowx=2:shadowy=2`;
  }).join(',');

  ff(
    `-i "${path.join(OUTPUT, 'video_raw.mp4')}" ` +
    `-vf "${drawFilters}" ` +
    `-c:v libx264 -preset fast -crf 18 -an ` +
    `"${path.join(OUTPUT, 'video_cap.mp4')}"`,
    'add captions'
  );
  console.log('  ✅ video_cap.mp4');
}

// Step 5: Merge video + audio
function mergeFinalize() {
  console.log('\n🎬 Final merge...');
  ff(
    `-i "${path.join(OUTPUT, 'video_cap.mp4')}" ` +
    `-i "${path.join(OUTPUT, 'audio_mix.aac')}" ` +
    `-c:v libx264 -preset medium -crf 18 ` +
    `-c:a aac -b:a 192k ` +
    `-vf "fade=t=in:st=0:d=0.4,fade=t=out:st=26.2:d=0.8" ` +
    `-shortest -movflags +faststart -t 27 ` +
    `"${path.join(OUTPUT, 'wishly_reel_v2.mp4')}"`,
    'merge'
  );
  const stat = fs.statSync(path.join(OUTPUT, 'wishly_reel_v2.mp4'));
  console.log(`  ✅ wishly_reel_v2.mp4 — ${(stat.size/1024/1024).toFixed(1)} MB`);
}

// ── MAIN ──
console.log('🎬 Wishly Marketing Video v2 Composer');
ensureDir(OUTPUT);
checkScenes();
processScenes();
concatScenes();
mixAudio();
addCaptions();
mergeFinalize();
console.log(`\n🎉 DONE! → ${path.join(OUTPUT, 'wishly_reel_v2.mp4')}`);
