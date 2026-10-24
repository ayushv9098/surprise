// scripts/download-all-songs.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const songsToDownload = [
  {
    id: 'baar-baar-din-ye-aaye',
    filename: 'baar-baar-din-ye-aaye.mp3',
    url: 'https://aac.saavncdn.com/279/bd63de6655d473ffbebcb7ef0134f6e0_sar_96.mp4',
    startTime: 0,
    durationSec: 165, // 2m 45s
    fadeStart: 161,
  },
  {
    id: 'kesariya',
    filename: 'kesariya.mp3',
    url: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_96.mp4',
    startTime: 0,
    durationSec: 165, // 2m 45s
    fadeStart: 161,
  },
  {
    id: 'raataan-lambiyan',
    filename: 'raataan-lambiyan.mp3',
    url: 'https://aac.saavncdn.com/238/35726d4394604604e961bf5b846870d0_96.mp4',
    startTime: 0,
    durationSec: 155, // 2m 35s
    fadeStart: 151,
  },
  {
    id: 'tum-hi-ho',
    filename: 'tum-hi-ho.mp3',
    url: 'https://aac.saavncdn.com/430/5c5ea5cc00e3bff45616013226f376fe_96.mp4',
    startTime: 0,
    durationSec: 160, // 2m 40s
    fadeStart: 156,
  },
  {
    id: 'apna-bana-le',
    filename: 'apna-bana-le.mp3',
    url: 'https://aac.saavncdn.com/228/bed7fe5f8fe04ae6432bcb0717e2b74e_96.mp4',
    startTime: 0,
    durationSec: 155, // 2m 35s
    fadeStart: 151,
  },
  {
    id: 'pehla-nasha',
    filename: 'pehla-nasha.mp3',
    url: 'https://aac.saavncdn.com/852/9d335ee08b26f171a3d65e11f8819d52_sar_96.mp4',
    startTime: 0,
    durationSec: 165, // 2m 45s
    fadeStart: 161,
  },
  {
    id: 'ilahi',
    filename: 'ilahi.mp3',
    url: 'https://aac.saavncdn.com/440/a784bdaf2e6e4faba7b8282b8612f829_96.mp4',
    startTime: 0,
    durationSec: 150, // 2m 30s
    fadeStart: 146,
  },
];

const outputDir = path.resolve('D:/avprojects/surprise-builder/public/audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Starting download and conversion of ${songsToDownload.length} songs into ${outputDir}...\n`);

for (const song of songsToDownload) {
  const targetPath = path.join(outputDir, song.filename);
  console.log(`Processing [${song.id}] -> ${song.filename}...`);

  // Build ffmpeg command with 4s audio fadeout at the end
  const afFilter = `afade=t=out:st=${song.fadeStart}:d=4`;
  const cmd = `ffmpeg -ss ${song.startTime} -i "${song.url}" -t ${song.durationSec} -af "${afFilter}" -c:a libmp3lame -b:a 128k "${targetPath}" -y`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    const stats = fs.statSync(targetPath);
    console.log(`✅ Finished ${song.filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)\n`);
  } catch (err) {
    console.error(`❌ Failed downloading ${song.id}:`, err.message);
  }
}

console.log('All downloads finished! Verifying generated files:');
const files = fs.readdirSync(outputDir);
for (const file of files) {
  const fullPath = path.join(outputDir, file);
  const stats = fs.statSync(fullPath);
  console.log(` - ${file}: ${(stats.size / 1024).toFixed(1)} KB`);
}
