import fs from 'fs';

const files = [
  'velvet-romance.svg',
  'sunset-romance.svg',
  'celestial-love.svg',
  'vintage-kodak.svg',
  'cozy-memories.svg',
  'neon-nostalgia.svg',
  'gentle-peace.svg',
  'sweet-forgive.svg',
  'fresh-start.svg'
];

let totalErrors = 0;

for (const f of files) {
  const path = `public/previews/${f}`;
  if (!fs.existsSync(path)) {
    console.error(`ERROR: ${path} does not exist`);
    totalErrors++;
    continue;
  }

  const content = fs.readFileSync(path, 'utf8');

  // 1. Basic XML structure
  if (!content.trim().startsWith('<svg') || !content.trim().endsWith('</svg>')) {
    console.error(`ERROR: ${f} invalid root tags`);
    totalErrors++;
  }

  // 2. ViewBox
  if (!content.includes('viewBox="0 0 400 300"')) {
    console.error(`ERROR: ${f} missing viewBox 0 0 400 300`);
    totalErrors++;
  }

  // 3. Image tag
  if (!content.includes('<image')) {
    console.error(`ERROR: ${f} missing <image> tag`);
    totalErrors++;
  }

  // 4. Data URI
  if (!content.includes('data:image/jpeg;base64,')) {
    console.error(`ERROR: ${f} missing base64 photo data`);
    totalErrors++;
  }

  // 5. Fonts
  if (!content.includes('Dancing Script') || !content.includes('Plus Jakarta Sans')) {
    console.error(`ERROR: ${f} missing expected Google Fonts`);
    totalErrors++;
  }

  // 6. Privacy check: zero occurrences of 'aditi' or '\bdevi\b'
  const lower = content.toLowerCase();
  if (lower.includes('aditi') || /\bdevi\b/i.test(content)) {
    console.error(`ERROR: ${f} contains restricted privacy strings!`);
    totalErrors++;
  }

  // 7. Check unescaped ampersands outside of entities
  // In XML, any & not followed by amp; lt; gt; quot; apos; or #...; is invalid
  const invalidAmpRegex = /&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g;
  const badAmps = content.match(invalidAmpRegex);
  if (badAmps) {
    console.error(`ERROR: ${f} contains unescaped ampersand! Count: ${badAmps.length}`);
    totalErrors++;
  }

  console.log(`✓ ${f} verified! (Size: ${(content.length / 1024).toFixed(1)} KB)`);
}

if (totalErrors === 0) {
  console.log('\n🎉 ALL 9 SVGs PASSED ALL VALIDATION CHECKS WITH ZERO ERRORS!');
} else {
  console.error(`\n❌ Failed with ${totalErrors} errors.`);
  process.exit(1);
}
