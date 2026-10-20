import { TEMPLATES } from '../src/data/templates.js';

console.log('Testing ' + TEMPLATES.length + ' templates uniqueness:');
const names = new Set();
const fonts = new Set();
const accentColors = new Set();

TEMPLATES.forEach((t) => {
  console.log(`- ${t.id}: name="${t.name}", font=${t.fontFamily}, color=${t.accentColor}, emoji=${t.emoji}, wax=${t.waxColor}`);
  names.add(t.name);
  fonts.add(t.fontFamily);
  accentColors.add(t.accentColor);
});

if (names.size !== TEMPLATES.length) throw new Error('Duplicate template names found!');
if (accentColors.size !== TEMPLATES.length) throw new Error('Duplicate primary accent colors found!');
console.log(`Unique Names: ${names.size}/${TEMPLATES.length}`);
console.log(`Unique Accent Colors: ${accentColors.size}/${TEMPLATES.length}`);
console.log(`Font Families used: ${[...fonts].join(', ')}`);
console.log('ALL TEMPLATES ARE 100% DISTINCT AND UNIQUE!');
