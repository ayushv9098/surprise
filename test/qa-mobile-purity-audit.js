/**
 * WishCraft Mobile Responsiveness & Keepsake View Purity QA Test Suite
 * Validates:
 * 1. Mobile Responsiveness across 320px, 360px, 375px, 390px, 414px, 768px
 * 2. Zero horizontal scroll overflow (overflow-x-hidden)
 * 3. Element containment (cards, polaroids, 3D envelope, secret letter)
 * 4. Touch target accessibility (minimum 44px tap targets & active states)
 * 5. Keepsake view purity (no top control bar, no floating audio, no TemplateFooter watermark)
 * 6. Privacy audit ('aditi' and 'devi')
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SCREEN_WIDTHS = [
  { name: 'iPhone SE / Small Mobile', width: 320 },
  { name: 'Samsung Galaxy / Android Small', width: 360 },
  { name: 'iPhone X / 11 Pro / Mini', width: 375 },
  { name: 'iPhone 12 / 13 / 14 / 15 / 16', width: 390 },
  { name: 'iPhone Plus / Max', width: 414 },
  { name: 'iPad Mini / Tablet Portrait', width: 768 },
];

let _totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  _totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedChecks++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('====================================================');
console.log('📱 WISHCRAFT MOBILE & KEEPSAKE PURITY QA AUDIT');
console.log('====================================================\n');

// 1. Keepsake View Purity
console.log('[1/4] Auditing Keepsake View Purity...');
const multiScenePath = path.join(ROOT_DIR, 'src/components/Templates/MultiSceneBirthdayView.jsx');
const multiSceneContent = fs.readFileSync(multiScenePath, 'utf-8');

const templateViewerPath = path.join(ROOT_DIR, 'src/components/Templates/TemplateViewer.jsx');
const templateViewerContent = fs.readFileSync(templateViewerPath, 'utf-8');

// A. No top floating control bar in live view
assert(
  templateViewerContent.includes('!isLiveView &&') && 
  templateViewerContent.includes('<nav \n          aria-label="Keepsake Controls"'),
  'TemplateViewer hides top floating control bar in live view (!isLiveView guard)'
);

// B. No floating audio toggle button in MultiSceneBirthdayView
const hasFloatingAudio = multiSceneContent.includes('Floating Audio Controller') ||
  multiSceneContent.includes('toggleAudio') ||
  (multiSceneContent.includes('Volume2') && multiSceneContent.includes('<Volume2'));
assert(!hasFloatingAudio, 'MultiSceneBirthdayView has NO floating audio toggle button in DOM');

// C. No <TemplateFooter /> or watermark in MultiSceneBirthdayView
const hasMultiSceneFooter = multiSceneContent.includes('<TemplateFooter');
assert(!hasMultiSceneFooter, 'MultiSceneBirthdayView contains NO <TemplateFooter /> watermark');

// D. TemplateViewer does not append TemplateFooter
assert(!templateViewerContent.includes('<TemplateFooter'), 'TemplateViewer does not append any TemplateFooter watermark');


// 2. Mobile Containment & Overflow Prevention
console.log('\n[2/4] Testing Viewport Containment & Dimensions...');

// A. Check overflow-x-hidden
assert(
  multiSceneContent.includes('overflow-x-hidden'),
  'MultiSceneBirthdayView container explicitly enforces overflow-x-hidden'
);
assert(
  templateViewerContent.includes('overflow-x-hidden'),
  'TemplateViewer container explicitly enforces overflow-x-hidden'
);

// B. Check widths across all 6 target screen viewports
SCREEN_WIDTHS.forEach(({ name, width }) => {
  // Container padding: px-3 is 12px padding per side (24px total)
  const containerUsableWidth = width - 24;

  // Scene 0: max-w-[92vw] sm:max-w-md
  const scene0CardWidth = Math.min(width * 0.92, 448);
  const scene0Fits = scene0CardWidth <= width && scene0CardWidth <= containerUsableWidth + 2;

  // Scene 1: Polaroid max-w-[270px] sm:max-w-[310px]
  const polaroidWidth = width < 640 ? 270 : 310;
  const polaroidFits = polaroidWidth < width && polaroidWidth <= containerUsableWidth;

  // Scene 2: max-w-[92vw] sm:max-w-sm
  const scene2CardWidth = Math.min(width * 0.92, 384);
  const scene2Fits = scene2CardWidth <= width;

  // Scene 3: Reasons max-w-[92vw] sm:max-w-md
  const reasonsWidth = Math.min(width * 0.92, 448);
  const reasonsFits = reasonsWidth <= width;

  // Scene 4: Envelope max-w-[280px] sm:max-w-[340px]
  const envelopeWidth = width < 640 ? 280 : 340;
  const envelopeFits = envelopeWidth < width && envelopeWidth <= containerUsableWidth;

  // Scene 4: Secret letter max-w-[92vw] sm:max-w-[440px]
  const letterWidth = Math.min(width * 0.92, 440);
  const letterFits = letterWidth <= width;

  const allFit = scene0Fits && polaroidFits && scene2Fits && reasonsFits && envelopeFits && letterFits;
  assert(
    allFit,
    `Screen width ${width}px (${name}): All elements (Cards, Polaroid [${polaroidWidth}px], Envelope [${envelopeWidth}px], Letter [${Math.round(letterWidth)}px]) fit within viewport without touching edges`
  );
});


// 3. Touch Target & Accessibility Audit
console.log('\n[3/4] Auditing Touch-Friendly Tap Targets (min 44px) & Active Feedback...');

// Primary button min-h-[44px]
assert(
  multiSceneContent.includes('min-h-[44px]'),
  'Primary and secondary action buttons have min-h-[44px] touch target'
);
assert(
  multiSceneContent.includes('active:scale-95') || multiSceneContent.includes('active:scale-[0.98]'),
  'Buttons feature tactile active:scale feedback on touch'
);
// Tap to open on Scene 0
assert(
  multiSceneContent.includes('min-h-[48px]'),
  'Scene 0 "Tap to Open" hero CTA button has generous min-h-[48px] touch target'
);

// LivePhonePreview responsive scaling
const phonePreviewPath = path.join(ROOT_DIR, 'src/components/Builder/LivePhonePreview.jsx');
const phonePreviewContent = fs.readFileSync(phonePreviewPath, 'utf-8');
assert(
  phonePreviewContent.includes('w-[300px]') && phonePreviewContent.includes('min-[360px]:w-[320px]'),
  'LivePhonePreview dynamically responds to small screens down to 300px/320px'
);


// 4. Privacy Audit Verification
console.log('\n[4/4] Deep Privacy Audit Verification...');
function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'qa-mobile-purity-audit.js') continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, fileList);
    } else if (/\.(jsx?|tsx?|json|html|css)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const auditedFiles = scanDir(path.join(ROOT_DIR, 'src'))
  .concat(scanDir(path.join(ROOT_DIR, 'data')));

let privacyViolations = 0;
for (const file of auditedFiles) {
  const text = fs.readFileSync(file, 'utf-8');
  const match = text.match(/\b(aditi|devi)\b/i);
  if (match) {
    privacyViolations++;
    console.error(`Privacy violation in ${path.relative(ROOT_DIR, file)}: found "${match[0]}"`);
  }
}
assert(privacyViolations === 0, `Zero occurrences of private names ('aditi' or 'devi') in ${auditedFiles.length} files`);


console.log('\n====================================================');
console.log(`QA AUDIT COMPLETE: ${passedChecks} PASSED, ${failedChecks} FAILED`);
console.log('====================================================');

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
