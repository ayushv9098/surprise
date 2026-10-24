/**
 * Wishly SFX Generator — creates simple sound effects using Node.js buffers
 * Generates WAV files for: whoosh, sparkle-pop, confetti-burst, chime
 * Output: media/marketing-video/audio/
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'media', 'marketing-video', 'audio');

const SAMPLE_RATE = 44100;
const CHANNELS = 1;
const BIT_DEPTH = 16;

function writeWAV(filename, samples) {
  const dataSize = samples.length * 2; // 16-bit = 2 bytes per sample
  const buf = Buffer.alloc(44 + dataSize);

  // RIFF header
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);         // Subchunk1Size
  buf.writeUInt16LE(1, 20);          // PCM
  buf.writeUInt16LE(CHANNELS, 22);
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * CHANNELS * 2, 28); // ByteRate
  buf.writeUInt16LE(CHANNELS * 2, 32); // BlockAlign
  buf.writeUInt16LE(BIT_DEPTH, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const val = Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767)));
    buf.writeInt16LE(val, 44 + i * 2);
  }

  fs.writeFileSync(path.join(AUDIO_DIR, filename), buf);
  console.log(`  ✅ ${filename} (${(dataSize / 1024).toFixed(1)} KB)`);
}

// 1) Whoosh — descending frequency sweep
function genWhoosh(durationSec = 0.4) {
  const n = Math.ceil(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / durationSec;
    const freq = 1200 - 900 * progress;
    const env = Math.sin(Math.PI * progress) * (1 - progress * 0.3);
    // Add white noise layer
    const noise = (Math.random() * 2 - 1) * 0.15 * (1 - progress);
    samples[i] = (Math.sin(2 * Math.PI * freq * t) * 0.4 + noise) * env;
  }
  return samples;
}

// 2) Sparkle Pop — short high-pitched decaying tone cluster
function genSparklePop(durationSec = 0.35) {
  const n = Math.ceil(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(n);
  const tones = [1800, 2200, 2800, 3200];
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 12);
    let s = 0;
    for (const f of tones) {
      s += Math.sin(2 * Math.PI * f * t) * 0.22;
    }
    samples[i] = s * env;
  }
  return samples;
}

// 3) Confetti Burst — multi-pop layered
function genConffettiBurst(durationSec = 0.6) {
  const n = Math.ceil(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(n);
  // Two layered pop transients
  const pops = [0, 0.08, 0.15, 0.22];
  for (const delay of pops) {
    const startSample = Math.floor(delay * SAMPLE_RATE);
    const popDurSamples = Math.ceil(0.18 * SAMPLE_RATE);
    for (let i = 0; i < popDurSamples && (startSample + i) < n; i++) {
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-t * 25);
      const noise = (Math.random() * 2 - 1) * 0.6;
      const tone = Math.sin(2 * Math.PI * 280 * t) * 0.3;
      samples[startSample + i] = (noise + tone) * env * 0.7;
    }
  }
  return samples;
}

// 4) Chime — warm ending bell chord
function genChime(durationSec = 1.2) {
  const n = Math.ceil(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(n);
  const tones = [
    { freq: 523.25, amp: 0.35, decay: 4 },   // C5
    { freq: 659.25, amp: 0.28, decay: 5 },   // E5
    { freq: 783.99, amp: 0.22, decay: 4.5 }, // G5
    { freq: 1046.5, amp: 0.18, decay: 6 },   // C6
  ];
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;
    for (const tone of tones) {
      s += Math.sin(2 * Math.PI * tone.freq * t) * tone.amp * Math.exp(-t * tone.decay);
    }
    samples[i] = s;
  }
  return samples;
}

// 5) Record Scratch — for the hook
function genRecordScratch(durationSec = 0.5) {
  const n = Math.ceil(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / durationSec;
    const freq = 300 + Math.sin(t * 30) * 150;
    const env = Math.exp(-progress * 4);
    const noise = (Math.random() * 2 - 1) * 0.5;
    samples[i] = (Math.sin(2 * Math.PI * freq * t) * 0.3 + noise * 0.4) * env;
  }
  return samples;
}

// 6) Soft "dull beep" (boring notification sound)
function genDullBeep(durationSec = 0.8) {
  const n = Math.ceil(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env = t < 0.05 ? t / 0.05 : t > 0.7 ? (0.8 - t) / 0.1 : 1.0;
    samples[i] = Math.sin(2 * Math.PI * 440 * t) * 0.25 * Math.max(0, env);
  }
  return samples;
}

console.log('🎵 Generating SFX...');
writeWAV('sfx_whoosh.wav', genWhoosh(0.4));
writeWAV('sfx_sparkle_pop.wav', genSparklePop(0.35));
writeWAV('sfx_confetti_burst.wav', genConffettiBurst(0.6));
writeWAV('sfx_chime.wav', genChime(1.2));
writeWAV('sfx_record_scratch.wav', genRecordScratch(0.5));
writeWAV('sfx_dull_beep.wav', genDullBeep(0.8));
console.log('✅ All SFX generated!');
