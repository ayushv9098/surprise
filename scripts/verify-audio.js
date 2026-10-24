// scripts/verify-audio.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const audioDir = path.resolve('D:/avprojects/surprise-builder/public/audio');
const files = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'));

console.log(`Checking ${files.length} audio files in ${audioDir}...\n`);

let allValid = true;

for (const file of files) {
  const filePath = path.join(audioDir, file);
  try {
    const probe = execSync(
      `ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,channels,sample_rate,duration -of json "${filePath}"`,
      { encoding: 'utf8' }
    );
    const data = JSON.parse(probe);
    const stream = data.streams?.[0];
    const stats = fs.statSync(filePath);

    if (stream && stream.codec_name === 'mp3' && Number(stream.duration) > 60) {
      console.log(`✅ ${file}:`);
      console.log(`   Format: ${stream.codec_name}, Channels: ${stream.channels}, Rate: ${stream.sample_rate}Hz`);
      console.log(`   Duration: ${Number(stream.duration).toFixed(1)}s, Size: ${(stats.size / 1024).toFixed(1)} KB\n`);
    } else {
      console.error(`❌ ${file} failed validation:`, stream);
      allValid = false;
    }
  } catch (err) {
    console.error(`❌ Error probing ${file}:`, err.message);
    allValid = false;
  }
}

if (allValid) {
  console.log('🎉 ALL AUDIO FILES ARE 100% VALID AND READY!');
} else {
  console.log('⚠️ Some files failed verification.');
  process.exit(1);
}
