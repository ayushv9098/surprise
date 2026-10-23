import fs from 'fs';
import https from 'https';

if (!fs.existsSync('public/previews/photos')) {
  fs.mkdirSync('public/previews/photos', { recursive: true });
}

const photos = [
  // Romance
  { name: 'velvet-romance', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=360&q=75' },
  { name: 'sunset-romance', url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=360&q=75' },
  { name: 'celestial-love', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=360&q=75' },

  // Scrapbook
  { name: 'vintage-kodak', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=360&q=75' },
  { name: 'cozy-memories', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=360&q=75' },
  { name: 'neon-nostalgia', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=360&q=75' },

  // Apology
  { name: 'gentle-peace', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=360&q=75' },
  { name: 'sweet-forgive', url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=360&q=75' },
  { name: 'fresh-start', url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=360&q=75' }
];

function fetchUrl(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchUrl(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  const base64Map = {};
  for (const p of photos) {
    const dest = `public/previews/photos/${p.name}.jpg`;
    console.log(`Downloading ${p.name}...`);
    await fetchUrl(p.url, dest);
    const buf = fs.readFileSync(dest);
    console.log(`Saved ${dest} (${buf.length} bytes)`);
    base64Map[p.name] = `data:image/jpeg;base64,${buf.toString('base64')}`;
  }
  fs.writeFileSync('public/previews/photos/base64-map.json', JSON.stringify(base64Map, null, 2));
  console.log('Saved base64-map.json successfully!');
}

run().catch(console.error);
