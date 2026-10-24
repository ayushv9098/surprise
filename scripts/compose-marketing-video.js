#!/usr/bin/env node
/**
 * Wishly Marketing Video Composer
 * 
 * Assembles all scene MP4s + audio (BGM + SFX) + kinetic text captions
 * into a final 1080x1920 vertical reel marketing video.
 * 
 * Timeline:
 *   Scene 1: 0.0 – 3.5s  (3.5s)  — Hook: Boring texts
 *   Scene 2: 3.5 – 7.5s  (4.0s)  — Wishly Landing
 *   Scene 3: 7.5 – 12.0s (4.5s)  — Builder Studio
 *   Scene 4: 12.0 – 16.5s(4.5s)  — Keepsake Unboxing
 *   Scene 5: 16.5 – 20.0s(3.5s)  — Sharing / QR
 *   Scene 6: 20.0 – 24.0s(4.0s)  — Outro CTA
 *   TOTAL: 24 seconds
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
const OUTPUT = path.join(ROOT, 'media', 'marketing-video', 'output');
const W = 1080, H = 1920, FPS = 24;

function ff(...args) {
  console.log(`  [ffmpeg] ${args.slice(0, 6).join(' ')}...`);
  const result = spawnSync(FFMPEG, ['-y', ...args], { stdio: 'inherit', maxBuffer: 200 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`FFmpeg failed: ${args.join(' ')}`);
}

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

// Check that all scene MP4s exist
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

// Step 1: Normalize all scenes to same resolution/fps
function normalizeScenes() {
  console.log('\n📐 Normalizing scenes...');
  for (let i = 1; i <= 6; i++) {
    const input = path.join(SCENES, `scene${i}.mp4`);
    const output = path.join(OUTPUT, `scene${i}_norm.mp4`);
    ff(
      '-i', input,
      '-vf', `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:black,fps=${FPS}`,
      '-c:v', 'libx264', '-preset', 'fast', '-crf', '20',
      '-an', output
    );
    console.log(`  ✅ scene${i}_norm.mp4`);
  }
}

// Step 2: Concat all scene videos
function concatScenes() {
  console.log('\n🔗 Concatenating scenes...');
  const listFile = path.join(OUTPUT, 'concat_list.txt');
  const lines = [];
  for (let i = 1; i <= 6; i++) {
    lines.push(`file '${path.join(OUTPUT, `scene${i}_norm.mp4`).replace(/\\/g, '/')}'`);
  }
  fs.writeFileSync(listFile, lines.join('\n'));
  ff(
    '-f', 'concat', '-safe', '0', '-i', listFile,
    '-c:v', 'copy',
    path.join(OUTPUT, 'video_raw.mp4')
  );
  console.log('  ✅ video_raw.mp4');
}

// Step 3: Mix audio track (BGM + SFX with timing)
function mixAudio() {
  console.log('\n🎵 Mixing audio...');
  const bgm = path.join(AUDIO, 'bgm.mp3');
  const sfxScratch = path.join(AUDIO, 'sfx_record_scratch.wav');
  const sfxWhoosh1 = path.join(AUDIO, 'sfx_whoosh.wav');
  const sfxWhoosh2 = path.join(AUDIO, 'sfx_whoosh.wav');
  const sfxWhoosh3 = path.join(AUDIO, 'sfx_whoosh.wav');
  const sfxSparkle = path.join(AUDIO, 'sfx_sparkle_pop.wav');
  const sfxConfetti = path.join(AUDIO, 'sfx_confetti_burst.wav');
  const sfxChime = path.join(AUDIO, 'sfx_chime.wav');
  const sfxBeep = path.join(AUDIO, 'sfx_dull_beep.wav');

  // Total duration = 24s
  // BGM: full 24s at lower volume, fades in from 0.5s
  // SFX timeline:
  //   0.0s  - dull_beep (hook boring texts)
  //   2.5s  - record_scratch (transition)
  //   3.5s  - whoosh (scene 2 transition)
  //   7.2s  - whoosh (scene 3 transition)
  //   7.5s  - sparkle_pop (builder loads)
  //   11.8s - whoosh (scene 4 transition)
  //   12.2s - confetti_burst (envelope opens)
  //   16.3s - whoosh (scene 5)
  //   20.0s - chime (outro)

  ff(
    // BGM input (trimmed to 24s)
    '-i', bgm,
    // SFX inputs
    '-i', sfxBeep,      // 1
    '-i', sfxScratch,   // 2
    '-i', sfxWhoosh1,   // 3
    '-i', sfxWhoosh2,   // 4
    '-i', sfxSparkle,   // 5
    '-i', sfxWhoosh3,   // 6
    '-i', sfxConfetti,  // 7
    '-i', sfxWhoosh1,   // 8
    '-i', sfxChime,     // 9
    '-filter_complex',
    // Trim & volume BGM: lower volume, fade in 0.5s, fade out last 1s
    '[0:a]atrim=0:24,asetpts=PTS-STARTPTS,volume=0.25,afade=t=in:st=0:d=0.5,afade=t=out:st=23:d=1[bgm];' +
    // SFX timing delays
    '[1:a]adelay=0|0[s_beep];' +
    '[2:a]adelay=2500|2500[s_scratch];' +
    '[3:a]adelay=3400|3400[s_w1];' +
    '[4:a]adelay=7100|7100[s_w2];' +
    '[5:a]adelay=7500|7500[s_sp];' +
    '[6:a]adelay=11700|11700[s_w3];' +
    '[7:a]adelay=12100|12100[s_conf];' +
    '[8:a]adelay=16200|16200[s_w4];' +
    '[9:a]adelay=20000|20000[s_chime];' +
    // Mix all together
    '[bgm][s_beep][s_scratch][s_w1][s_w2][s_sp][s_w3][s_conf][s_w4][s_chime]amix=inputs=10:duration=first:normalize=0[mix];' +
    '[mix]atrim=0:24,asetpts=PTS-STARTPTS[audio_out]',
    '-map', '[audio_out]',
    '-t', '24',
    '-ar', '44100', '-ac', '2', '-ab', '192k',
    path.join(OUTPUT, 'audio_mix.aac')
  );
  console.log('  ✅ audio_mix.aac');
}

// Step 4: Add kinetic text captions on video
function addCaptions() {
  console.log('\n💬 Adding kinetic captions...');

  // We'll use ffmpeg drawtext filter for each caption
  // Font: Arial (Windows built-in)
  const fontFile = 'C\\:/Windows/Fonts/arialbd.ttf';

  const captions = [
    // Scene 1: Hook
    { text: 'Boring birthday texts...',       start: 0.2,  end: 2.0,  x: 'w/2', y: 'h*0.08',  size: 52, color: 'white',   shadow: '0x00000099' },
    { text: '❌ So cringe!',                   start: 1.5,  end: 3.4,  x: 'w/2', y: 'h*0.14',  size: 44, color: '#FFE5E8', shadow: '0x00000099' },
    // Scene 2: Wishly
    { text: 'Make them a SURPRISE WEBSITE ✨', start: 3.6,  end: 6.5,  x: 'w/2', y: 'h*0.06',  size: 48, color: 'white',   shadow: '0xE8364E99' },
    { text: 'In just 60 seconds!',             start: 4.5,  end: 7.3,  x: 'w/2', y: 'h*0.13',  size: 40, color: '#FFF0F3', shadow: '0x00000099' },
    // Scene 3: Builder
    { text: 'Add photos 📸  letter 💌  music 🎵', start: 7.6, end: 11.5, x: 'w/2', y: 'h*0.06', size: 44, color: 'white',  shadow: '0x00000099' },
    { text: 'Personalize in seconds!',          start: 8.5,  end: 11.8, x: 'w/2', y: 'h*0.13',  size: 38, color: '#FFF0F3', shadow: '0x00000099' },
    // Scene 4: Envelope
    { text: 'Interactive wax seal 💌',          start: 12.1, end: 14.5, x: 'w/2', y: 'h*0.06',  size: 48, color: 'white',   shadow: '0x00000099' },
    { text: '+ Confetti explosion! 🎉',         start: 13.0, end: 16.3, x: 'w/2', y: 'h*0.13',  size: 44, color: '#FFD700', shadow: '0x00000099' },
    // Scene 5: Sharing
    { text: 'Share via WhatsApp 📲',            start: 16.6, end: 18.8, x: 'w/2', y: 'h*0.06',  size: 48, color: 'white',   shadow: '0x00000099' },
    { text: 'or QR Code — 100% FREE!',          start: 17.5, end: 19.8, x: 'w/2', y: 'h*0.13',  size: 40, color: '#90EE90', shadow: '0x00000099' },
    // Scene 6: Outro
    { text: 'Make their day unforgettable ✨',  start: 20.1, end: 22.5, x: 'w/2', y: 'h*0.88',  size: 46, color: '#E8364E', shadow: '0x00000099' },
    { text: 'Create yours FREE at Wishly!',     start: 21.0, end: 24.0, x: 'w/2', y: 'h*0.94',  size: 38, color: '#1a1a1a', shadow: '0xffffff99' },
  ];

  // Build drawtext filter chain
  const drawtexts = captions.map(c => {
    const escaped = c.text.replace(/'/g, "\\'").replace(/:/g, '\\:').replace(/[^\x00-\x7F]/g, '?');
    const alpha = `if(between(t\\,${c.start}\\,${c.end})\\,min(1\\,(t-${c.start})*4)*min(1\\,(${c.end}-t)*4)\\,0)`;
    const xExpr = `(w-text_w)/2`;
    const yExpr = c.x === 'w/2' ? `h*${parseFloat(c.y.replace('h*', '').replace('h/', '1/'))}` : c.y;
    return `drawtext=fontfile='${fontFile}':text='${escaped}':fontsize=${c.size}:fontcolor=${c.color}:x=(w-text_w)/2:y=${c.y.replace('h*', 'h*').replace('w/2', '(w-text_w)/2')}:alpha='${alpha}':shadowcolor=${c.shadow}:shadowx=2:shadowy=2:box=0`;
  }).join(',');

  ff(
    '-i', path.join(OUTPUT, 'video_raw.mp4'),
    '-vf', drawtexts,
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20',
    '-an',
    path.join(OUTPUT, 'video_captions.mp4')
  );
  console.log('  ✅ video_captions.mp4');
}

// Step 5: Merge video + audio, add intro/outro fade
function mergeAndFinalize() {
  console.log('\n🎬 Merging video + audio...');
  ff(
    '-i', path.join(OUTPUT, 'video_captions.mp4'),
    '-i', path.join(OUTPUT, 'audio_mix.aac'),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-c:a', 'aac', '-b:a', '192k',
    '-vf', `fade=t=in:st=0:d=0.4,fade=t=out:st=23.2:d=0.8`,
    '-shortest',
    '-movflags', '+faststart',
    '-t', '24',
    path.join(OUTPUT, 'wishly_marketing_reel.mp4')
  );
  console.log('  ✅ wishly_marketing_reel.mp4');

  // Check file size
  const stat = fs.statSync(path.join(OUTPUT, 'wishly_marketing_reel.mp4'));
  console.log(`  📦 Final size: ${(stat.size / (1024 * 1024)).toFixed(1)} MB`);
}

// ========================
// MAIN
// ========================
console.log('🎬 Wishly Marketing Video Composer Starting...');
console.log(`   Output: ${OUTPUT}`);
ensureDir(OUTPUT);

checkScenes();
normalizeScenes();
concatScenes();
mixAudio();
addCaptions();
mergeAndFinalize();

console.log(`\n🎉 DONE! Final video: ${path.join(OUTPUT, 'wishly_marketing_reel.mp4')}`);
