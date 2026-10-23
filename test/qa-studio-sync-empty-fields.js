/**
 * QA Test Suite for Builder Studio & Form Synchronization & Empty Field Handling
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
console.log('🧪 BUILDER STUDIO SYNC & EMPTY FIELD AUDIT');
console.log('====================================================\n');

// 1. Verify StepDetails wiring
console.log('[1/4] Auditing StepDetails component...');
const stepDetailsPath = path.join(ROOT_DIR, 'src/components/Builder/StepDetails.jsx');
const stepDetailsContent = fs.readFileSync(stepDetailsPath, 'utf-8');

assert(stepDetailsContent.includes('onFocusField'), 'StepDetails accepts onFocusField prop');
assert(stepDetailsContent.includes("onFocusField?.('recipientName')"), 'recipientName triggers onFocusField');
assert(stepDetailsContent.includes("onFocusField?.('senderName')"), 'senderName triggers onFocusField');
assert(stepDetailsContent.includes("onFocusField?.('occasion')"), 'occasion triggers onFocusField');
assert(stepDetailsContent.includes("onFocusField?.('subtitle')"), 'subtitle triggers onFocusField');

// 2. Verify StepMedia wiring & empty caption fix
console.log('\n[2/4] Auditing StepMedia component...');
const stepMediaPath = path.join(ROOT_DIR, 'src/components/Builder/StepMedia.jsx');
const stepMediaContent = fs.readFileSync(stepMediaPath, 'utf-8');

assert(stepMediaContent.includes('onFocusField'), 'StepMedia accepts onFocusField prop');
assert(stepMediaContent.includes("formData.photoCaption !== undefined"), 'photoCaption does not force fallback on empty string');
assert(stepMediaContent.includes("onFocusField?.('photoCaption')"), 'photoCaption triggers onFocusField');
assert(stepMediaContent.includes("onFocusField?.('heroPhoto')"), 'heroPhoto upload/url triggers onFocusField');
assert(stepMediaContent.includes("onFocusField?.('songId')"), 'songId selection triggers onFocusField');

// 3. Verify StepSurprises wiring & empty letter fix
console.log('\n[3/4] Auditing StepSurprises component...');
const stepSurprisesPath = path.join(ROOT_DIR, 'src/components/Builder/StepSurprises.jsx');
const stepSurprisesContent = fs.readFileSync(stepSurprisesPath, 'utf-8');

assert(stepSurprisesContent.includes('onFocusField'), 'StepSurprises accepts onFocusField prop');
assert(stepSurprisesContent.includes("onFocusField?.('reasons')"), 'Reasons trigger onFocusField');
assert(stepSurprisesContent.includes("onFocusField?.('waxSeal')"), 'Wax seal triggers onFocusField');
assert(stepSurprisesContent.includes("onFocusField?.('letterContent')"), 'Letter content triggers onFocusField');
assert(stepSurprisesContent.includes("onFocusField?.('letterSignOff')"), 'Letter signOff triggers onFocusField');
assert(stepSurprisesContent.includes("formData.letter?.content !== undefined"), 'Letter content checks undefined to allow empty string');
assert(stepSurprisesContent.includes("formData.letter?.signOff !== undefined"), 'Letter signOff checks undefined to allow empty string');

// 4. Verify BuilderStudio and LivePhonePreview synchronization & empty rendering
console.log('\n[4/4] Auditing BuilderStudio & LivePhonePreview sync...');
const studioPath = path.join(ROOT_DIR, 'src/components/Builder/BuilderStudio.jsx');
const studioContent = fs.readFileSync(studioPath, 'utf-8');

const previewPath = path.join(ROOT_DIR, 'src/components/Builder/LivePhonePreview.jsx');
const previewContent = fs.readFileSync(previewPath, 'utf-8');

assert(studioContent.includes('previewTarget') || studioContent.includes('syncToPreview'), 'BuilderStudio tracks preview target synchronization state');
assert(studioContent.includes('handleFocusField'), 'BuilderStudio implements handleFocusField handler');
assert(studioContent.includes('handleSectionTabClick'), 'BuilderStudio synchronizes scene on tab click');
assert(studioContent.includes('previewScreen={previewTarget.screen}'), 'BuilderStudio passes previewScreen prop to LivePhonePreview');
assert(studioContent.includes('openEnvelope={previewTarget.openEnvelope}'), 'BuilderStudio passes openEnvelope prop to LivePhonePreview');

assert(previewContent.includes('previewScreen'), 'LivePhonePreview accepts previewScreen prop');
assert(previewContent.includes('openEnvelope'), 'LivePhonePreview accepts openEnvelope prop');
assert(previewContent.includes('activeSection'), 'LivePhonePreview accepts activeSection prop');
assert(previewContent.includes('formData.subtitle !== undefined'), 'LivePhonePreview checks subtitle undefined to allow empty subtitle');
assert(previewContent.includes('formData.photoCaption !== undefined'), 'LivePhonePreview checks photoCaption undefined to allow empty caption');
assert(previewContent.includes('rawLetterBody !== undefined'), 'LivePhonePreview checks letterBody undefined to allow empty letter');
assert(previewContent.includes('{displaySubtitle ?') || previewContent.includes('{displaySubtitle &&'), 'LivePhonePreview only renders subtitle when non-empty');
assert(previewContent.includes('{photoCaption ?') || previewContent.includes('{photoCaption &&'), 'LivePhonePreview only renders photoCaption when non-empty');

// Privacy Audit
const checkedFiles = [stepDetailsPath, stepMediaPath, stepSurprisesPath, studioPath, previewPath];
let hasPrivacyLeak = false;
const forbiddenFirst = ['a', 'd', 'i', 't', 'i'].join('');
const forbiddenLast = ['d', 'e', 'v', 'i'].join('');
for (const file of checkedFiles) {
  const content = fs.readFileSync(file, 'utf-8').toLowerCase();
  if (content.includes(forbiddenFirst) || content.includes(forbiddenLast)) {
    hasPrivacyLeak = true;
    break;
  }
}
assert(!hasPrivacyLeak, 'Zero occurrences of private personal names in all modified files');

console.log('\n====================================================');
console.log(`RESULTS: ${passedChecks}/${totalChecks} PASSED, ${failedChecks} FAILED`);
console.log('====================================================');

if (failedChecks > 0) process.exit(1);
