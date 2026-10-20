import { TEMPLATES } from '../src/data/templates.js';
import fs from 'fs';
import path from 'path';

const previewFilePath = path.resolve('./src/components/Builder/LivePhonePreview.jsx');
const content = fs.readFileSync(previewFilePath, 'utf8');

console.log('Auditing LivePhonePreview.jsx for all 6 template themes:');

TEMPLATES.forEach((tmpl) => {
  const hasThemeKey = content.includes(`'${tmpl.id}': {`);
  console.log(`- Theme ${tmpl.id} integrated: ${hasThemeKey ? '✓ YES' : '✗ NO'}`);
  if (!hasThemeKey) {
    throw new Error(`Theme ${tmpl.id} missing in LivePhonePreview.jsx!`);
  }
});

console.log('\nChecking font family classes support in LivePhonePreview:');
const fonts = ['font-cursive', 'font-serif', 'font-handwriting'];
fonts.forEach((f) => {
  const hasFont = content.includes(f);
  console.log(`- Font class ${f}: ${hasFont ? '✓ YES' : '✗ NO'}`);
  if (!hasFont) {
    throw new Error(`Font class ${f} missing in LivePhonePreview.jsx!`);
  }
});

console.log('\nAll 6 template themes verified in LivePhonePreview!');
