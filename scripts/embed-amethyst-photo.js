import fs from 'fs';

const celestial = fs.readFileSync('public/previews/celestial-love.svg', 'utf8');
const match = celestial.match(/href="(data:image\/[^"']+)"/);
if (match) {
  const base64 = match[1];
  let amethyst = fs.readFileSync('public/previews/amethyst-romance.svg', 'utf8');
  amethyst = amethyst.replace(/href="https:\/\/[^"]+"/, `href="${base64}"`);
  amethyst = amethyst.replace(/xlink:href="https:\/\/[^"]+"/, `xlink:href="${base64}"`);
  fs.writeFileSync('public/previews/amethyst-romance.svg', amethyst, 'utf8');
  console.log('Successfully updated amethyst-romance.svg with base64 embedded photo!');
} else {
  console.error('Base64 photo match not found in celestial-love.svg');
}
