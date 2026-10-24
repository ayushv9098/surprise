import { TEMPLATES } from '../src/data/templates.js';

console.log(TEMPLATES.map(t => ({
  id: t.id,
  category: t.category,
  gradientBg: t.gradientBg
})));
