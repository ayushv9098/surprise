import fs from 'fs';
import path from 'path';

const multiScenePath = path.resolve('./src/components/Templates/MultiSceneBirthdayView.jsx');
const content = fs.readFileSync(multiScenePath, 'utf8');

console.log('Auditing MultiSceneBirthdayView.jsx for theme support:');

const themes = ['isPeach', 'isLavender', 'isGold', 'isPolaroid', 'isBlush', 'isRoyal'];
themes.forEach((th) => {
  const present = content.includes(th);
  console.log(`- Flag ${th}: ${present ? '✓ YES' : '✗ NO'}`);
  if (!present) throw new Error(`Missing theme flag ${th}!`);
});

const fontClasses = ['font-cursive', 'font-serif', 'font-handwriting'];
fontClasses.forEach((fc) => {
  const present = content.includes(fc);
  console.log(`- Font class ${fc}: ${present ? '✓ YES' : '✗ NO'}`);
  if (!present) throw new Error(`Missing font class ${fc}!`);
});

console.log('All theme variables and fonts verified in MultiSceneBirthdayView!');
