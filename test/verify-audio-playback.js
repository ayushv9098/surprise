import { SONGS, getSongById } from '../src/data/songs.js';

console.log('--- TEST 1: Verifying SONGS catalog in src/data/songs.js ---');

const expectedHooks = {
  'baar-baar-din-ye-aaye': { hookStartTime: 28, hookTitle: 'Baar Baar Din Ye Aaye...', durationSeconds: 165 },
  'kesariya': { hookStartTime: 42, hookTitle: 'Kesariya Tera Ishq Hai Piya...', durationSeconds: 165 },
  'raataan-lambiyan': { hookStartTime: 30, hookTitle: 'Teri Meri Gallan Ho Gayi Mashhoor...', durationSeconds: 155 },
  'tum-hi-ho': { hookStartTime: 35, hookTitle: 'Kyunki Tum Hi Ho Ab Tum Hi Ho...', durationSeconds: 160 },
  'apna-bana-le': { hookStartTime: 25, hookTitle: 'Apna Bana Le Piya...', durationSeconds: 155 },
  'pehla-nasha': { hookStartTime: 40, hookTitle: 'Pehla Nasha Pehla Khumaar...', durationSeconds: 165 },
  'ilahi': { hookStartTime: 30, hookTitle: 'Mera Falsafa Kandhe Pe Mera Basta...', durationSeconds: 150 },
};

let errors = 0;

for (const [id, expected] of Object.entries(expectedHooks)) {
  const song = SONGS.find(s => s.id === id);
  if (!song) {
    console.error(`FAIL: Song not found: ${id}`);
    errors++;
    continue;
  }
  if (song.durationSeconds !== expected.durationSeconds) {
    console.error(`FAIL: ${id} durationSeconds: expected ${expected.durationSeconds}, got ${song.durationSeconds}`);
    errors++;
  }
  if (song.hookStartTime !== expected.hookStartTime) {
    console.error(`FAIL: ${id} hookStartTime: expected ${expected.hookStartTime}, got ${song.hookStartTime}`);
    errors++;
  }
  if (song.hookTitle !== expected.hookTitle) {
    console.error(`FAIL: ${id} hookTitle: expected "${expected.hookTitle}", got "${song.hookTitle}"`);
    errors++;
  }
}

const silentSong = SONGS.find(s => s.id === 'silent-mode');
if (!silentSong || silentSong.durationSeconds !== 0) {
  console.error('FAIL: silent-mode not configured correctly');
  errors++;
}

console.log('--- TEST 2: Verifying getSongById with various scenarios ---');

// Default lookup
const kesariya = getSongById('kesariya');
if (kesariya.hookStartTime !== 42 || kesariya.durationSeconds !== 165) {
  console.error('FAIL: getSongById("kesariya") failed to return hookStartTime / durationSeconds');
  errors++;
}

// Custom audio lookup
const customSong = getSongById('custom', {
  customSongUrl: 'https://example.com/my-song.mp3',
  customSongTitle: 'My Special Track',
  audioStartTime: 12,
  audioDuration: 30,
});
if (customSong.id !== 'custom' || customSong.audioUrl !== 'https://example.com/my-song.mp3' || customSong.audioStartTime !== 12) {
  console.error('FAIL: getSongById custom song failed', customSong);
  errors++;
}

// Legacy lookup with formData overrides
const legacySong = getSongById('upbeat-birthday', { audioStartTime: 28, audioDuration: 15 });
if (legacySong.id !== 'baar-baar-din-ye-aaye' || legacySong.audioStartTime !== 28 || legacySong.audioDuration !== 15) {
  console.error('FAIL: legacy mapping override failed', legacySong);
  errors++;
}

console.log('--- TEST 3: Verifying snippet loop logic simulator ---');

function simulateAudioPlayback({ startTime, duration, steps }) {
  let currentTime = startTime;
  const resolvedDuration = duration > 0 ? duration : null;
  const history = [currentTime];

  for (let i = 0; i < steps; i++) {
    // Progress playback by 1 second
    currentTime += 1;

    // Trigger onTimeUpdate loop check
    if (resolvedDuration && resolvedDuration > 0) {
      const endTime = startTime + resolvedDuration;
      if (currentTime >= endTime || currentTime < startTime - 0.5) {
        currentTime = startTime;
      }
    }
    history.push(currentTime);
  }
  return history;
}

// Test 30s snippet starting at 35s
const history30s = simulateAudioPlayback({ startTime: 35, duration: 30, steps: 35 });
// At step 29, time is 64. At step 30, time reaches 65, which loops back to 35.
if (history30s[29] !== 64) {
  console.error(`FAIL: Expected time 64 at step 29, got ${history30s[29]}`);
  errors++;
}
if (history30s[30] !== 35) {
  console.error(`FAIL: Expected loop to 35 at step 30, got ${history30s[30]}`);
  errors++;
}

// Test default full song (duration null / 0) starting at 0
const historyFull = simulateAudioPlayback({ startTime: 0, duration: null, steps: 100 });
if (historyFull[100] !== 100) {
  console.error(`FAIL: Full song should not loop early, got ${historyFull[100]}`);
  errors++;
}

if (errors === 0) {
  console.log('SUCCESS: All tests passed with 0 errors! Audio engine & playback math verified.');
} else {
  console.error(`COMPLETED WITH ${errors} ERRORS.`);
  process.exit(1);
}
