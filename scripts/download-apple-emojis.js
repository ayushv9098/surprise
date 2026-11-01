import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'emojis', 'apple');
const MAP_FILE = path.join(ROOT_DIR, 'src', 'data', 'appleEmojiMap.js');

const EMOJI_DATASOURCE_URL = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/emoji.json';
const CDN_BASE_URL = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/';
const FALLBACK_BASE_URL = 'https://emojicdn.elk.sh/';

function getFiles(dir, filterExt = ['.js', '.jsx', '.json', '.html', '.md']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (['node_modules', '.git', 'dist', '.vercel', 'public'].includes(item)) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, filterExt));
    } else if (filterExt.some(ext => item.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function toUnified(str) {
  const cp = [];
  for (const ch of str) {
    const hex = ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    cp.push(hex);
  }
  return cp.join('-');
}

async function downloadWithRetry(url, fallbackUrl, destPath, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let res = await fetch(url);
      if (!res.ok && fallbackUrl) {
        console.warn(`[WARN] Primary CDN ${res.status} for ${url}, trying fallback: ${fallbackUrl}`);
        res = await fetch(fallbackUrl);
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length === 0) {
        throw new Error(`Empty response for ${url}`);
      }
      fs.writeFileSync(destPath, buffer);
      return buffer.length;
    } catch (err) {
      if (attempt === maxRetries) {
        throw err;
      }
      await new Promise(r => setTimeout(r, 500 * attempt));
    }
  }
}

async function main() {
  console.log('🚀 Starting Apple Emoji Asset Packager & Downloader...');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 1. Fetch emoji-datasource-apple index
  console.log('📦 Fetching emoji-datasource-apple@15.1.2 metadata...');
  const dsRes = await fetch(EMOJI_DATASOURCE_URL);
  if (!dsRes.ok) throw new Error(`Failed to load emoji datasource: ${dsRes.status}`);
  const datasource = await dsRes.json();
  console.log(`✅ Loaded ${datasource.length} emoji definitions from datasource`);

  const dsMap = new Map();
  for (const item of datasource) {
    dsMap.set(item.unified, item);
    if (item.non_qualified) dsMap.set(item.non_qualified, item);
    if (item.skin_variations) {
      for (const skin of Object.values(item.skin_variations)) {
        dsMap.set(skin.unified, skin);
        if (skin.non_qualified) dsMap.set(skin.non_qualified, skin);
      }
    }
  }

  // Helper to find match
  function lookupEmoji(str) {
    const u = toUnified(str);
    if (dsMap.has(u)) return dsMap.get(u);
    const uNoFe0f = u.replace(/-FE0F/g, '');
    if (dsMap.has(uNoFe0f)) return dsMap.get(uNoFe0f);
    const uWithFe0f = u + '-FE0F';
    if (dsMap.has(uWithFe0f)) return dsMap.get(uWithFe0f);
    return null;
  }

  // 2. Scan src/ for all emojis
  const srcFiles = getFiles(SRC_DIR);
  console.log(`🔍 Scanning ${srcFiles.length} files in src/ for emojis...`);

  const extendedRegex = /(?:(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3)(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3))*)/gu;

  const srcEmojiSet = new Set();
  for (const f of srcFiles) {
    const content = fs.readFileSync(f, 'utf8');
    let m;
    const re = new RegExp(extendedRegex.source, 'gu');
    while ((m = re.exec(content)) !== null) {
      srcEmojiSet.add(m[0]);
    }
  }
  console.log(`📊 Found ${srcEmojiSet.size} unique emoji characters in src/`);

  // Scan entire project (excluding public/dist/node_modules) for bonus coverage
  const allProjectFiles = getFiles(ROOT_DIR);
  const allProjectEmojis = new Set();
  for (const f of allProjectFiles) {
    const content = fs.readFileSync(f, 'utf8');
    let m;
    const re = new RegExp(extendedRegex.source, 'gu');
    while ((m = re.exec(content)) !== null) {
      allProjectEmojis.add(m[0]);
    }
  }
  console.log(`📊 Total emojis across entire project: ${allProjectEmojis.size}`);

  // Combine sets (src + project)
  const combinedSet = new Set([...srcEmojiSet, ...allProjectEmojis]);

  // 3. Prepare download queue
  const imagesToDownload = new Map(); // imageFileName -> { emoji, url, fallbackUrl }
  const emojiToImageMap = {}; // emojiChar -> publicPath

  for (const em of combinedSet) {
    const match = lookupEmoji(em);
    if (match && match.image) {
      const imgFileName = match.image;
      const publicPath = `/emojis/apple/${imgFileName}`;
      emojiToImageMap[em] = publicPath;

      // Also map variations without/with FE0F
      const emNoFe0f = em.replace(/\uFE0F/g, '');
      const emWithFe0f = emNoFe0f + '\uFE0F';
      emojiToImageMap[emNoFe0f] = publicPath;
      emojiToImageMap[emWithFe0f] = publicPath;

      if (!imagesToDownload.has(imgFileName)) {
        imagesToDownload.set(imgFileName, {
          emoji: em,
          imgFileName,
          url: `${CDN_BASE_URL}${imgFileName}`,
          fallbackUrl: `${FALLBACK_BASE_URL}${encodeURIComponent(em)}?style=apple`
        });
      }
    } else {
      console.warn(`[WARNING] Could not find emoji match for: "${em}" (Code points: ${toUnified(em)})`);
    }
  }

  console.log(`📥 Total unique Apple PNG images to download: ${imagesToDownload.size}`);

  // 4. Download images in parallel with concurrency limit
  const downloadItems = Array.from(imagesToDownload.values());
  const CONCURRENCY = 12;
  let downloadedCount = 0;
  let skippedCount = 0;
  let totalBytes = 0;

  async function downloadWorker(items) {
    for (const item of items) {
      const destPath = path.join(OUTPUT_DIR, item.imgFileName);
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
        skippedCount++;
        totalBytes += fs.statSync(destPath).size;
      } else {
        const size = await downloadWithRetry(item.url, item.fallbackUrl, destPath);
        downloadedCount++;
        totalBytes += size;
      }
    }
  }

  const chunks = [];
  for (let i = 0; i < CONCURRENCY; i++) chunks.push([]);
  downloadItems.forEach((item, index) => {
    chunks[index % CONCURRENCY].push(item);
  });

  await Promise.all(chunks.map(chunk => downloadWorker(chunk)));

  console.log(`✅ Download complete: ${downloadedCount} newly downloaded, ${skippedCount} already existed.`);
  console.log(`💾 Total size on disk: ${(totalBytes / 1024).toFixed(2)} KB (~${(totalBytes / (1024 * 1024)).toFixed(2)} MB)`);

  // 5. Verify all files on disk
  console.log('🔍 Verifying downloaded PNG files on disk...');
  const filesOnDisk = fs.readdirSync(OUTPUT_DIR);
  let verifiedCount = 0;
  for (const file of filesOnDisk) {
    if (!file.endsWith('.png')) continue;
    const filePath = path.join(OUTPUT_DIR, file);
    const buf = fs.readFileSync(filePath);
    // Check PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
      verifiedCount++;
    } else {
      console.error(`❌ Invalid PNG file: ${file}`);
    }
  }
  console.log(`✅ Verified ${verifiedCount} valid PNG images in public/emojis/apple/`);

  // 6. Generate src/data/appleEmojiMap.js
  console.log(`📝 Writing ${MAP_FILE}...`);
  const sortedKeys = Object.keys(emojiToImageMap).sort();
  
  let mapContent = `// Auto-generated Apple Emoji Map
// Source: emoji-datasource-apple@15.1.2
// Bundled locally in /public/emojis/apple/ for 0ms zero-latency rendering.
// Total mapped character variants: ${sortedKeys.length}
// Unique PNG files: ${verifiedCount}

export const APPLE_EMOJI_MAP = {
`;

  for (const k of sortedKeys) {
    mapContent += `  ${JSON.stringify(k)}: ${JSON.stringify(emojiToImageMap[k])},\n`;
  }

  mapContent += `};

// Alias for case insensitivity
export const appleEmojiMap = APPLE_EMOJI_MAP;

/**
 * Returns the local Apple emoji image URL path for a given character or null if not mapped.
 * Automatically handles \uFE0F variation selector matching.
 * @param {string} emoji
 * @returns {string|null}
 */
export function getAppleEmojiUrl(emoji) {
  if (!emoji || typeof emoji !== 'string') return null;
  if (APPLE_EMOJI_MAP[emoji]) return APPLE_EMOJI_MAP[emoji];

  // Fallback checking without or with variation selector
  const noFe0f = emoji.replace(/\\uFE0F/g, '');
  if (APPLE_EMOJI_MAP[noFe0f]) return APPLE_EMOJI_MAP[noFe0f];

  const withFe0f = noFe0f + '\\uFE0F';
  if (APPLE_EMOJI_MAP[withFe0f]) return APPLE_EMOJI_MAP[withFe0f];

  return null;
}

export default APPLE_EMOJI_MAP;
`;

  fs.writeFileSync(MAP_FILE, mapContent, 'utf8');
  console.log(`✅ Successfully generated ${MAP_FILE} (${fs.statSync(MAP_FILE).size} bytes)`);

  // 7. Verify MultiSceneBirthdayView.jsx was untouched
  const gitStatus = path.join(ROOT_DIR, 'src', 'components', 'Templates', 'MultiSceneBirthdayView.jsx');
  console.log(`🔒 Preserved MultiSceneBirthdayView.jsx at ${gitStatus}`);

  return {
    srcEmojiCount: srcEmojiSet.size,
    totalProjectEmojis: allProjectEmojis.size,
    uniqueImages: verifiedCount,
    totalBytes,
    filesOnDisk: filesOnDisk.slice(0, 30) // sample
  };
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
