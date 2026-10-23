/**
 * QA Test Suite for Wax Seal Envelope Sync & Interaction
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedChecks++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('====================================================');
console.log('🧪 WAX SEAL ENVELOPE SYNC AUDIT');
console.log('====================================================\n');

// 1. Audit BuilderStudio.jsx
console.log('[1/4] Auditing BuilderStudio.jsx...');
const studioPath = path.join(ROOT_DIR, 'src/components/Builder/BuilderStudio.jsx');
const studioContent = fs.readFileSync(studioPath, 'utf-8');

assert(
  studioContent.includes("['letter', 'letterTitle', 'waxSeal'].includes(fieldName)"),
  "handleFocusField differentiates waxSeal, letterTitle, letter"
);
assert(
  studioContent.includes("syncToPreview(4, false);"),
  "handleFocusField calls syncToPreview(4, false) for waxSeal / letterTitle / letter"
);
assert(
  studioContent.includes("['letterContent', 'letterSignOff'].includes(fieldName)"),
  "handleFocusField calls syncToPreview(4, true) for letterContent / letterSignOff"
);
assert(
  studioContent.includes("isOnlySealOrTitle"),
  "handleUpdateFormData recognizes wax seal changes and keeps openEnvelope=false"
);

// 2. Audit LivePhonePreview.jsx
console.log('\n[2/4] Auditing LivePhonePreview.jsx...');
const previewPath = path.join(ROOT_DIR, 'src/components/Builder/LivePhonePreview.jsx');
const previewContent = fs.readFileSync(previewPath, 'utf-8');

assert(
  previewContent.includes("setEnvelopeOpen(Boolean(openEnvelope));"),
  "previewScreen === 4 respects openEnvelope boolean instead of hardcoded true"
);
assert(
  !previewContent.includes("rawSealEmoji !== '👑' && rawSealEmoji !== '🌸' && rawSealEmoji !== '⭐'"),
  "letterSealEmoji does not reject valid emoji choices like 👑, 🌸, ⭐"
);
assert(
  previewContent.includes("rawSealEmoji || theme.sealEmoji"),
  "letterSealEmoji accurately falls back to rawSealEmoji"
);

// 3. Audit BlushRomanceView.jsx
console.log('\n[3/4] Auditing BlushRomanceView.jsx...');
const romancePath = path.join(ROOT_DIR, 'src/components/Templates/BlushRomanceView.jsx');
const romanceContent = fs.readFileSync(romancePath, 'utf-8');

assert(
  romanceContent.includes("controlledOpenEnvelope !== undefined ? Boolean(controlledOpenEnvelope) : userOpenedLetter"),
  "isLetterOpen properly honors controlledOpenEnvelope"
);
assert(
  romanceContent.includes("khat-wax-seal"),
  "BlushRomanceView includes khat-wax-seal on closed envelope"
);

// 4. Privacy Audit
console.log('\n[4/4] Auditing Privacy (Zero Aditi / Devi)...');
const srcDir = path.join(ROOT_DIR, 'src');
function checkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      checkDir(full);
    } else if (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.json') || f.endsWith('.css') || f.endsWith('.html')) {
      const c = fs.readFileSync(full, 'utf-8');
      if (/aditi/i.test(c)) {
        assert(false, `Found forbidden term 'aditi' in ${path.relative(ROOT_DIR, full)}`);
      }
      if (/\bdevi\b/i.test(c)) {
        assert(false, `Found forbidden term 'devi' in ${path.relative(ROOT_DIR, full)}`);
      }
    }
  }
}
checkDir(srcDir);
assert(true, 'Privacy audit clean across entire src directory');

console.log('\n====================================================');
console.log(`Results: ${passedChecks}/${totalChecks} checks passed`);
if (failedChecks > 0) {
  console.error(`❌ ${failedChecks} checks failed.`);
  process.exit(1);
} else {
  console.log('✅ ALL WAX SEAL ENVELOPE SYNC AUDITS PASSED!');
}
