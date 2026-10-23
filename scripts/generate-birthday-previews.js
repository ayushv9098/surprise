import fs from 'fs';

const photos = {
  royalSapphire: fs.readFileSync('public/previews/photos/royal-sapphire.jpg').toString('base64'),
  goldenBirthday: fs.readFileSync('public/previews/photos/golden-birthday.jpg').toString('base64'),
  polaroidScrapbook: fs.readFileSync('public/previews/photos/polaroid-scrapbook.jpg').toString('base64'),
  blushRose: fs.readFileSync('public/previews/photos/blush-rose.jpg').toString('base64'),
  lavenderDream: fs.readFileSync('public/previews/photos/lavender-dream.jpg').toString('base64'),
  princessPeach: fs.readFileSync('public/previews/photos/princess-peach.jpg').toString('base64')
};

// 1. Royal Sapphire SVG
const royalSapphireSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap');
      .font-cursive { font-family: 'Dancing Script', cursive, sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    </style>
    
    <!-- Background Gradients -->
    <linearGradient id="royalBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1128"/>
      <stop offset="50%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <!-- Radial Glow for Ambiance -->
    <radialGradient id="blueGlow" cx="50%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0"/>
    </radialGradient>

    <!-- Card Shadow & Button Glow -->
    <filter id="royalShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#020617" flood-opacity="0.45"/>
    </filter>
    <filter id="btnGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#2563eb" flood-opacity="0.5"/>
    </filter>
    <filter id="polaroidShadow" x="-15%" y="-15%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#020617" flood-opacity="0.4"/>
    </filter>

    <!-- Button Gradient -->
    <linearGradient id="royalBtn" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>

    <!-- Gold Crown Gradient -->
    <linearGradient id="goldCrown" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>

    <!-- Glass Overlay Gradient -->
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#f8fafc" stop-opacity="0.94"/>
    </linearGradient>

    <!-- Polaroid Clip Path -->
    <clipPath id="royalPhotoClip">
      <rect x="6" y="6" width="70" height="74" rx="2" />
    </clipPath>
  </defs>

  <!-- Background Base -->
  <rect width="400" height="300" fill="url(#royalBg)"/>
  <rect width="400" height="300" fill="url(#blueGlow)"/>

  <!-- Ambient Floating Emojis / Stars -->
  <g opacity="0.6">
    <circle cx="45" cy="45" r="1.5" fill="#93c5fd" opacity="0.8"/>
    <circle cx="360" cy="55" r="2" fill="#fef08a" opacity="0.8"/>
    <circle cx="330" cy="245" r="1.5" fill="#60a5fa" opacity="0.8"/>
    <circle cx="70" cy="235" r="1.5" fill="#fef08a" opacity="0.8"/>
    <circle cx="370" cy="150" r="1" fill="#93c5fd" opacity="0.6"/>
  </g>

  <!-- Ambient Decorative Badges -->
  <text x="35" y="48" font-size="18" opacity="0.75">⭐</text>
  <text x="355" y="45" font-size="17" opacity="0.75">👑</text>
  <text x="362" y="195" font-size="16" opacity="0.7">💙</text>
  <text x="28" y="240" font-size="17" opacity="0.75">✨</text>
  <text x="350" y="265" font-size="16" opacity="0.65">🎉</text>

  <!-- Central Frosted White Luxury Card -->
  <g filter="url(#royalShadow)">
    <rect x="52" y="38" width="296" height="224" rx="20" fill="url(#glassGrad)" stroke="#bfdbfe" stroke-width="1.5"/>
    
    <!-- Top Decorative Badge Pill -->
    <rect x="134" y="22" width="132" height="30" rx="15" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5" filter="url(#royalShadow)"/>
    
    <!-- Crown inside badge -->
    <g transform="translate(145, 27) scale(0.85)">
      <path d="M4 17L1 6L9 11L14 3L19 11L27 6L24 17H4Z" fill="url(#goldCrown)"/>
      <circle cx="1" cy="5" r="1.8" fill="#fef08a"/>
      <circle cx="14" cy="2" r="2" fill="#fef08a"/>
      <circle cx="27" cy="5" r="1.8" fill="#fef08a"/>
      <circle cx="9" cy="10" r="1.5" fill="#fef08a"/>
      <circle cx="19" cy="10" r="1.5" fill="#fef08a"/>
    </g>
    <text x="175" y="42" class="font-sans" font-size="10.5" font-weight="700" fill="#1e40af" letter-spacing="0.5">ROYAL SPECIAL</text>

    <!-- Main Greeting Headline -->
    <text x="200" y="85" class="font-cursive" font-size="28" font-weight="700" fill="#0f172a" text-anchor="middle">Happy Birthday,</text>
    <text x="200" y="118" class="font-sans" font-size="24" font-weight="800" fill="#1d4ed8" text-anchor="middle" letter-spacing="-0.5">Rohan! 👑</text>

    <!-- Decorative Divider Line -->
    <path d="M140 133 Q 200 135 260 133" stroke="#e2e8f0" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="200" cy="133.5" r="3" fill="#3b82f6"/>

    <!-- Subtitle Text -->
    <text x="200" y="154" class="font-sans" font-size="11.5" font-weight="600" fill="#475569" text-anchor="middle">For the King of the Day</text>
    <text x="200" y="171" class="font-sans" font-size="10" font-weight="500" fill="#64748b" text-anchor="middle">A royal surprise crafted just for you...</text>

    <!-- Action Button (Pill with glowing shadow) -->
    <g transform="translate(125, 192)" filter="url(#btnGlow)">
      <rect width="150" height="38" rx="19" fill="url(#royalBtn)"/>
      <rect x="2" y="2" width="146" height="17" rx="9" fill="#ffffff" opacity="0.18"/>
      <text x="75" y="24" class="font-sans" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.3">Tap to Open 🎁</text>
    </g>
  </g>

  <!-- Authentic Keepsake Polaroid (Bottom Left) -->
  <g transform="translate(18, 142) rotate(-7)" filter="url(#polaroidShadow)">
    <rect width="82" height="102" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <!-- Photo Area with Real Portrait -->
    <rect x="6" y="6" width="70" height="74" rx="2" fill="#1e3a8a"/>
    <image href="data:image/jpeg;base64,${photos.royalSapphire}" xlink:href="data:image/jpeg;base64,${photos.royalSapphire}" x="6" y="6" width="70" height="74" preserveAspectRatio="xMidYMid slice" clip-path="url(#royalPhotoClip)"/>
    
    <!-- Realistic Washi Tape on Top -->
    <g transform="translate(24, -7) rotate(3)">
      <rect width="34" height="12" rx="2" fill="#fef08a" opacity="0.85"/>
      <line x1="2" y1="2" x2="32" y2="2" stroke="#ffffff" stroke-width="0.8" opacity="0.6"/>
    </g>
    <!-- Gold Star Sticker on corner -->
    <circle cx="70" cy="9" r="6.5" fill="#f59e0b"/>
    <text x="67.5" y="12" font-size="7.5">⭐</text>
    <!-- Handwritten style caption -->
    <text x="41" y="93" class="font-cursive" font-size="10" font-weight="700" fill="#1e293b" text-anchor="middle">King Rohan ⭐</text>
  </g>

  <!-- Floating Star Badge (Top Right) -->
  <g transform="translate(325, 105) rotate(12)" filter="url(#polaroidShadow)">
    <rect width="42" height="42" rx="10" fill="#ffffff" stroke="#93c5fd" stroke-width="1.2"/>
    <text x="21" y="27" font-size="18" text-anchor="middle">👑</text>
  </g>
</svg>`;

// 2. Golden Birthday SVG
const goldenBirthdaySvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap');
      .font-cursive { font-family: 'Dancing Script', cursive, sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    </style>

    <!-- Platinum Champagne Background Gradient -->
    <linearGradient id="goldBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#fffdf9"/>
      <stop offset="70%" stop-color="#fff8ec"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>

    <!-- Subtle Ambient Gold Glow -->
    <radialGradient id="sunGlow" cx="50%" cy="25%" r="60%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>

    <!-- Drop Shadows -->
    <filter id="goldCardShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#d97706" flood-opacity="0.15"/>
    </filter>
    <filter id="amberBtnGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#f59e0b" flood-opacity="0.4"/>
    </filter>

    <!-- Button Gradient -->
    <linearGradient id="amberBtn" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>

    <!-- Polaroid Clip Path -->
    <clipPath id="goldPhotoClip">
      <rect x="6" y="6" width="70" height="74" rx="2" />
    </clipPath>
  </defs>

  <!-- Background Base -->
  <rect width="400" height="300" fill="url(#goldBg)"/>
  <rect width="400" height="300" fill="url(#sunGlow)"/>

  <!-- Ambient Gold Confetti / Floating Elements -->
  <g opacity="0.75">
    <circle cx="28" cy="40" r="2.5" fill="#f59e0b"/>
    <circle cx="75" cy="22" r="1.5" fill="#d97706"/>
    <circle cx="365" cy="38" r="2" fill="#f59e0b"/>
    <circle cx="340" cy="90" r="1.5" fill="#fbbf24"/>
    <circle cx="35" cy="245" r="2" fill="#d97706"/>
    <circle cx="370" cy="235" r="2.5" fill="#f59e0b"/>
    <polygon points="45,110 48,118 40,115" fill="#f59e0b" opacity="0.6"/>
    <polygon points="360,165 365,172 356,170" fill="#f59e0b" opacity="0.6"/>
  </g>

  <!-- Ambient Emojis -->
  <text x="22" y="70" font-size="16" opacity="0.8">✨</text>
  <text x="350" y="65" font-size="16" opacity="0.85">💛</text>
  <text x="24" y="195" font-size="15" opacity="0.75">🥂</text>
  <text x="355" y="198" font-size="16" opacity="0.8">🎉</text>

  <!-- Header Badge: A Golden Birthday Celebration 🎂✨ -->
  <g transform="translate(100, 16)">
    <rect width="200" height="24" rx="12" fill="#fffbeb" stroke="#fde68a" stroke-width="1.2"/>
    <text x="100" y="16.5" class="font-sans" font-size="10" font-weight="700" fill="#b45309" text-anchor="middle" letter-spacing="0.4">A Golden Birthday Celebration 🎂✨</text>
  </g>

  <!-- Main Luxury Showcase Card -->
  <g filter="url(#goldCardShadow)">
    <rect x="46" y="44" width="308" height="206" rx="20" fill="#ffffff" fill-opacity="0.97" stroke="#f59e0b" stroke-opacity="0.35" stroke-width="1.2"/>

    <!-- Headline: Happy Birthday, Shining Star! in Dancing Script -->
    <text x="200" y="76" class="font-cursive" font-size="26" font-weight="700" fill="#0f172a" text-anchor="middle">Happy Birthday,</text>
    <text x="200" y="104" class="font-sans" font-size="21" font-weight="800" fill="#b45309" text-anchor="middle" letter-spacing="-0.5">Shining Star! 🎂✨</text>

    <!-- Decorative Divider Line -->
    <path d="M140 118 Q 200 120 260 118" stroke="#fef3c7" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="200" cy="118.5" r="3" fill="#f59e0b"/>

    <!-- Subtitle Text -->
    <text x="200" y="139" class="font-sans" font-size="11" font-weight="600" fill="#78350f" text-anchor="middle">May your year shine brighter than pure gold</text>
    <text x="200" y="156" class="font-sans" font-size="9.5" font-weight="500" fill="#b45309" text-anchor="middle" opacity="0.85">A sealed keepsake crafted with heartfelt love...</text>

    <!-- Big Amber Gradient CTA Button -->
    <g transform="translate(125, 186)" filter="url(#amberBtnGlow)">
      <rect width="150" height="38" rx="19" fill="url(#amberBtn)"/>
      <rect x="2" y="2" width="146" height="17" rx="9" fill="#ffffff" opacity="0.22"/>
      <text x="75" y="24" class="font-sans" font-size="11.5" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.4">Celebrate in Gold ✨</text>
    </g>
  </g>

  <!-- Authentic Warm Golden Polaroid (Bottom Left) -->
  <g transform="translate(16, 136) rotate(-7)" filter="url(#goldCardShadow)">
    <rect width="82" height="102" rx="4" fill="#ffffff" stroke="#fde68a" stroke-width="1.2"/>
    <!-- Photo Area with Real Portrait -->
    <rect x="6" y="6" width="70" height="74" rx="2" fill="#fef3c7"/>
    <image href="data:image/jpeg;base64,${photos.goldenBirthday}" xlink:href="data:image/jpeg;base64,${photos.goldenBirthday}" x="6" y="6" width="70" height="74" preserveAspectRatio="xMidYMid slice" clip-path="url(#goldPhotoClip)"/>
    
    <!-- Gold Washi Tape on Top -->
    <g transform="translate(24, -7) rotate(4)">
      <rect width="34" height="12" rx="2" fill="#fbbf24" opacity="0.9"/>
      <line x1="2" y1="2" x2="32" y2="2" stroke="#ffffff" stroke-width="0.8" opacity="0.6"/>
    </g>
    <!-- Champagne sticker on corner -->
    <circle cx="70" cy="9" r="6.5" fill="#fef3c7"/>
    <text x="66" y="12.5" font-size="7.5">🥂</text>
    <!-- Handwritten style caption -->
    <text x="41" y="93" class="font-cursive" font-size="10.5" font-weight="700" fill="#92400e" text-anchor="middle">Pure Joy 🥂✨</text>
  </g>

  <!-- Champagne Flutes / Confetti Badge (Right) -->
  <g transform="translate(324, 115) rotate(9)" filter="url(#goldCardShadow)">
    <rect width="48" height="52" rx="10" fill="#fffbeb" stroke="#fde68a" stroke-width="1.2"/>
    <text x="24" y="27" font-size="18" text-anchor="middle">🥂</text>
    <text x="24" y="43" class="font-sans" font-size="7.5" font-weight="700" fill="#b45309" text-anchor="middle">Make a Wish</text>
  </g>
</svg>`;

// 3. Retro Polaroid Scrapbook SVG
const polaroidScrapbookSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&amp;family=Plus+Jakarta+Sans:wght@600;700;800&amp;display=swap');
      .font-cursive { font-family: 'Dancing Script', cursive, sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    </style>

    <!-- Retro Sunset Ruby / Crimson Fire Background -->
    <linearGradient id="rubyBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#fff8f8"/>
      <stop offset="70%" stop-color="#fff1f2"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>

    <radialGradient id="rubyGlow" cx="50%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#e11d48" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>

    <!-- Polaroid Shadows -->
    <filter id="scrapShadow" x="-15%" y="-15%" width="130%" height="135%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="1" dy="5" stdDeviation="6" flood-color="#881337" flood-opacity="0.16"/>
    </filter>
    <filter id="polaroidPop" x="-20%" y="-20%" width="140%" height="145%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="2" dy="8" stdDeviation="8" flood-color="#881337" flood-opacity="0.22"/>
    </filter>

    <!-- Washi Tape Textures -->
    <pattern id="washiStripes" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" stroke-width="1.8" opacity="0.4"/>
    </pattern>

    <!-- Polaroid Photo Gradients (Fiery Sunset Crimson) -->
    <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="45%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#4c0519"/>
    </linearGradient>

    <!-- Scrapbook Photo Clip -->
    <clipPath id="scrapPhotoClip">
      <rect x="10" y="10" width="134" height="130" rx="2" />
    </clipPath>
  </defs>

  <!-- Paper Base -->
  <rect width="400" height="300" fill="url(#rubyBg)"/>
  <rect width="400" height="300" fill="url(#rubyGlow)"/>

  <!-- Vintage Dot/Grid Texture Overlay -->
  <g opacity="0.10" fill="#e11d48">
    <circle cx="20" cy="20" r="1"/><circle cx="60" cy="20" r="1"/><circle cx="100" cy="20" r="1"/><circle cx="140" cy="20" r="1"/><circle cx="180" cy="20" r="1"/><circle cx="220" cy="20" r="1"/><circle cx="260" cy="20" r="1"/><circle cx="300" cy="20" r="1"/><circle cx="340" cy="20" r="1"/><circle cx="380" cy="20" r="1"/>
    <circle cx="20" cy="60" r="1"/><circle cx="60" cy="60" r="1"/><circle cx="100" cy="60" r="1"/><circle cx="140" cy="60" r="1"/><circle cx="180" cy="60" r="1"/><circle cx="220" cy="60" r="1"/><circle cx="260" cy="60" r="1"/><circle cx="300" cy="60" r="1"/><circle cx="340" cy="60" r="1"/><circle cx="380" cy="60" r="1"/>
    <circle cx="20" cy="240" r="1"/><circle cx="60" cy="240" r="1"/><circle cx="100" cy="240" r="1"/><circle cx="140" cy="240" r="1"/><circle cx="180" cy="240" r="1"/><circle cx="220" cy="240" r="1"/><circle cx="260" cy="240" r="1"/><circle cx="300" cy="240" r="1"/><circle cx="340" cy="240" r="1"/><circle cx="380" cy="240" r="1"/>
    <circle cx="20" cy="280" r="1"/><circle cx="60" cy="280" r="1"/><circle cx="100" cy="280" r="1"/><circle cx="140" cy="280" r="1"/><circle cx="180" cy="280" r="1"/><circle cx="220" cy="280" r="1"/><circle cx="260" cy="280" r="1"/><circle cx="300" cy="280" r="1"/><circle cx="340" cy="280" r="1"/><circle cx="380" cy="280" r="1"/>
  </g>

  <!-- Ambient Scrapbook Stickers / Doodles -->
  <text x="24" y="55" font-size="16" opacity="0.9">⚡</text>
  <text x="360" y="52" font-size="16" opacity="0.9">🔥</text>
  <text x="355" y="270" font-size="17" opacity="0.85">❤️</text>
  <text x="26" y="275" font-size="16" opacity="0.85">📸</text>

  <!-- Header Section: Scrapbook Binder Header with Washi Tape and Stitched Border -->
  <g transform="translate(48, 14)" filter="url(#scrapShadow)">
    <rect width="304" height="66" rx="14" fill="#ffffff" stroke="#fecdd3" stroke-width="1.2"/>
    <!-- Stitched Inner Border -->
    <rect x="5" y="5" width="294" height="56" rx="10" fill="none" stroke="#f43f5e" stroke-opacity="0.6" stroke-width="1" stroke-dasharray="4 3"/>

    <!-- Top Washi Tape Strip (Sunset Rose) -->
    <g transform="translate(112, -7)">
      <rect width="80" height="15" rx="2" fill="#fb7185" opacity="0.9"/>
      <rect width="80" height="15" rx="2" fill="url(#washiStripes)"/>
    </g>

    <text x="152" y="24" class="font-sans" font-size="9" font-weight="700" fill="#e11d48" text-anchor="middle" letter-spacing="0.5">VINTAGE CRIMSON &amp; MEMORIES 📸⚡</text>
    <text x="152" y="49" class="font-cursive" font-size="24" font-weight="700" fill="#0f172a" text-anchor="middle">Chapters of Brotherhood 📸⚡</text>
  </g>

  <!-- Polaroid 2 (Underneath / Tilted +4 deg to Right) -->
  <g transform="translate(208, 92) rotate(4)" filter="url(#scrapShadow)">
    <rect width="144" height="174" rx="4" fill="#ffffff" stroke="#fecdd3" stroke-width="1"/>
    
    <!-- Photo Area -->
    <rect x="9" y="9" width="126" height="120" rx="2" fill="url(#sunsetGrad)"/>
    
    <!-- Silhouette Graphic -->
    <circle cx="72" cy="78" r="22" fill="#fde047" opacity="0.95"/>
    <polygon points="9,129 45,92 85,129" fill="#4c0519" opacity="0.85"/>
    <polygon points="55,129 95,85 135,129" fill="#881337" opacity="0.8"/>
    <polygon points="90,129 115,102 135,129" fill="#be123c" opacity="0.9"/>
    
    <!-- Top Washi Tape -->
    <g transform="translate(85, -8) rotate(12)">
      <rect width="52" height="16" rx="2" fill="#f43f5e" opacity="0.9"/>
      <rect width="52" height="16" rx="2" fill="url(#washiStripes)"/>
    </g>

    <!-- Polaroid Caption -->
    <text x="72" y="154" class="font-cursive" font-size="16" font-weight="700" fill="#0f172a" text-anchor="middle">Roadtrip Sunset 🚗🌅</text>
  </g>

  <!-- Polaroid 1 (Foreground / Tilted -4 deg to Left) with Real Brotherhood Photo -->
  <g transform="translate(42, 88) rotate(-4)" filter="url(#polaroidPop)">
    <rect width="154" height="186" rx="4" fill="#ffffff" stroke="#fecdd3" stroke-width="1"/>

    <!-- Photo Area with Real Snapshot -->
    <rect x="10" y="10" width="134" height="130" rx="2" fill="#ffe4e6"/>
    <image href="data:image/jpeg;base64,${photos.polaroidScrapbook}" xlink:href="data:image/jpeg;base64,${photos.polaroidScrapbook}" x="10" y="10" width="134" height="130" preserveAspectRatio="xMidYMid slice" clip-path="url(#scrapPhotoClip)"/>

    <!-- Top Washi Tape -->
    <g transform="translate(18, -8) rotate(-8)">
      <rect width="58" height="17" rx="2" fill="#fbbf24" opacity="0.9"/>
      <rect width="58" height="17" rx="2" fill="url(#washiStripes)"/>
    </g>

    <!-- Handwritten Caption in Dancing Script -->
    <text x="77" y="156" class="font-cursive" font-size="17" font-weight="700" fill="#0f172a" text-anchor="middle">Brothers &amp; Besties 📸⚡</text>
    <text x="77" y="172" class="font-sans" font-size="8" font-weight="700" fill="#e11d48" text-anchor="middle" letter-spacing="0.5">FOREVER &amp; ALWAYS</text>
  </g>

  <!-- Hand-drawn Arrow & Note -->
  <g transform="translate(202, 260)">
    <path d="M-6 0 C 15 12, 45 10, 68 -2" fill="none" stroke="#e11d48" stroke-width="1.4" stroke-dasharray="3 2"/>
    <path d="M68 -2 L 58 -5 M 68 -2 L 62 4" fill="none" stroke="#e11d48" stroke-width="1.4"/>
    <text x="30" y="24" class="font-cursive" font-size="17" font-weight="700" fill="#be123c" text-anchor="middle">Best Days of Our Lives 🔥⚡</text>
  </g>
</svg>`;

// 4. Blush Blossom SVG
const blushRoseSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap');
      .font-cursive { font-family: 'Dancing Script', cursive, sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    </style>

    <!-- Romantic Blush Pink Background Gradient -->
    <linearGradient id="blushBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff5f7"/>
      <stop offset="50%" stop-color="#fdf2f4"/>
      <stop offset="100%" stop-color="#fde2e8"/>
    </linearGradient>

    <!-- Soft Radial Glow -->
    <radialGradient id="pinkGlow" cx="50%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#fff5f7" stop-opacity="0"/>
    </radialGradient>

    <!-- Card Shadow & Button Glow -->
    <filter id="blushCardShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#fb7185" flood-opacity="0.22"/>
    </filter>
    <filter id="roseBtnGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#e11d48" flood-opacity="0.45"/>
    </filter>
    <filter id="blushPolaroidShadow" x="-15%" y="-15%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#be123c" flood-opacity="0.18"/>
    </filter>

    <!-- Rose Button Gradient -->
    <linearGradient id="roseBtn" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>

    <!-- Wax Seal Gradient -->
    <radialGradient id="waxSealGrad" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="50%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#881337"/>
    </radialGradient>

    <!-- Glass Overlay -->
    <linearGradient id="blushGlass" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#fff5f7" stop-opacity="0.94"/>
    </linearGradient>

    <!-- Polaroid Clip Path -->
    <clipPath id="blushPhotoClip">
      <rect x="6" y="6" width="70" height="74" rx="2" />
    </clipPath>
  </defs>

  <!-- Background Base -->
  <rect width="400" height="300" fill="url(#blushBg)"/>
  <rect width="400" height="300" fill="url(#pinkGlow)"/>

  <!-- Ambient Floating Petals & Emojis -->
  <g opacity="0.6">
    <path d="M 30 40 C 35 32, 45 35, 42 45 C 38 52, 28 48, 30 40 Z" fill="#fda4af" opacity="0.75"/>
    <path d="M 365 75 C 372 68, 380 72, 378 80 C 374 86, 365 82, 365 75 Z" fill="#f43f5e" opacity="0.6"/>
    <path d="M 40 240 C 45 232, 55 235, 52 245 C 48 252, 38 248, 40 240 Z" fill="#fda4af" opacity="0.7"/>
    <path d="M 350 250 C 356 244, 364 248, 362 255 C 358 260, 350 256, 350 250 Z" fill="#fb7185" opacity="0.65"/>
  </g>

  <!-- Floating Emojis -->
  <text x="32" y="70" font-size="16" opacity="0.8">🌸</text>
  <text x="355" y="48" font-size="16" opacity="0.8">💖</text>
  <text x="362" y="195" font-size="16" opacity="0.75">🦋</text>
  <text x="25" y="195" font-size="15" opacity="0.75">✨</text>
  <text x="350" y="270" font-size="15" opacity="0.75">🎀</text>

  <!-- Central Luxury Blossom Card -->
  <g filter="url(#blushCardShadow)">
    <rect x="52" y="38" width="296" height="224" rx="20" fill="url(#blushGlass)" stroke="#fecdd3" stroke-width="1.5"/>

    <!-- Top Decorative Blossom Badge Pill -->
    <rect x="134" y="22" width="132" height="30" rx="15" fill="#ffffff" stroke="#fecdd3" stroke-width="1.5" filter="url(#blushCardShadow)"/>
    <text x="150" y="42" font-size="15">🌸</text>
    <text x="175" y="42" class="font-sans" font-size="10.5" font-weight="700" fill="#e11d48" letter-spacing="0.5">BLUSH SPECIAL</text>

    <!-- Main Greeting Headline -->
    <text x="200" y="85" class="font-cursive" font-size="28" font-weight="700" fill="#881337" text-anchor="middle">Happy Birthday,</text>
    <text x="200" y="118" class="font-sans" font-size="24" font-weight="800" fill="#e11d48" text-anchor="middle" letter-spacing="-0.5">Sunshine! 🌸</text>

    <!-- Decorative Rose Ribbon / Divider -->
    <path d="M140 133 Q 200 135 260 133" stroke="#ffe4e6" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="200" cy="133.5" r="3" fill="#f43f5e"/>

    <!-- Subtitle Text -->
    <text x="200" y="154" class="font-sans" font-size="11.5" font-weight="600" fill="#9f1239" text-anchor="middle">Stay wonderful &amp; keep shining bright</text>
    <text x="200" y="171" class="font-sans" font-size="10" font-weight="500" fill="#be123c" text-anchor="middle" opacity="0.85">A special heartfelt surprise crafted for you...</text>

    <!-- Action Button (Rose Pill with Glowing Shadow) -->
    <g transform="translate(125, 192)" filter="url(#roseBtnGlow)">
      <rect width="150" height="38" rx="19" fill="url(#roseBtn)"/>
      <rect x="2" y="2" width="146" height="17" rx="9" fill="#ffffff" opacity="0.2"/>
      <text x="75" y="24" class="font-sans" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.3">Tap to Open 🎁</text>
    </g>
  </g>

  <!-- Authentic Keepsake Polaroid (Bottom Left) -->
  <g transform="translate(18, 142) rotate(-7)" filter="url(#blushPolaroidShadow)">
    <rect width="82" height="102" rx="4" fill="#ffffff" stroke="#fecdd3" stroke-width="1.2"/>
    <!-- Photo Area with Real Radiant Portrait -->
    <rect x="6" y="6" width="70" height="74" rx="2" fill="#ffe4e6"/>
    <image href="data:image/jpeg;base64,${photos.blushRose}" xlink:href="data:image/jpeg;base64,${photos.blushRose}" x="6" y="6" width="70" height="74" preserveAspectRatio="xMidYMid slice" clip-path="url(#blushPhotoClip)"/>
    
    <!-- Rose Sticker / Tape on Top -->
    <g transform="translate(24, -7) rotate(3)">
      <rect width="34" height="12" rx="2" fill="#fda4af" opacity="0.9"/>
      <line x1="2" y1="2" x2="32" y2="2" stroke="#ffffff" stroke-width="0.8" opacity="0.6"/>
    </g>
    <!-- Flower Sticker on corner -->
    <circle cx="70" cy="9" r="6.5" fill="#fff1f2"/>
    <text x="66" y="12.5" font-size="7.5">🌸</text>
    <!-- Handwritten style caption -->
    <text x="41" y="93" class="font-cursive" font-size="10" font-weight="700" fill="#9f1239" text-anchor="middle">Sunshine Girl 🌸</text>
  </g>

  <!-- Wax Seal Accent (Top Right) -->
  <g transform="translate(332, 108) rotate(8)" filter="url(#blushCardShadow)">
    <circle cx="20" cy="20" r="18" fill="url(#waxSealGrad)"/>
    <circle cx="20" cy="20" r="14" fill="none" stroke="#fecdd3" stroke-width="1" stroke-dasharray="2 1.5"/>
    <text x="20" y="25" font-size="12" text-anchor="middle">🌸</text>
  </g>
</svg>`;

// 5. Lavender Dream SVG
const lavenderDreamSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap');
      .font-cursive { font-family: 'Dancing Script', cursive, sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    </style>

    <!-- Dreamy Lilac Pastel Background Gradient -->
    <linearGradient id="lavenderBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#faf5ff"/>
      <stop offset="50%" stop-color="#f3e8ff"/>
      <stop offset="100%" stop-color="#ede9fe"/>
    </linearGradient>

    <!-- Whimsical Violet Radial Glow -->
    <radialGradient id="violetGlow" cx="50%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#faf5ff" stop-opacity="0"/>
    </radialGradient>

    <!-- Card Shadow & Purple Glow -->
    <filter id="lavCardShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#7c3aed" flood-opacity="0.18"/>
    </filter>
    <filter id="lavBtnGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#8b5cf6" flood-opacity="0.45"/>
    </filter>
    <filter id="lavAccentShadow" x="-15%" y="-15%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#4c1d95" flood-opacity="0.16"/>
    </filter>

    <!-- Purple Button Gradient -->
    <linearGradient id="lavBtn" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>

    <!-- Amethyst Wax Seal Gradient -->
    <radialGradient id="amethystSeal" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#4c1d95"/>
    </radialGradient>

    <!-- Frosted Glass Overlay -->
    <linearGradient id="lavGlass" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#faf5ff" stop-opacity="0.94"/>
    </linearGradient>

    <!-- Polaroid Clip Path -->
    <clipPath id="lavPhotoClip">
      <rect x="6" y="6" width="70" height="74" rx="2" />
    </clipPath>
  </defs>

  <!-- Background Base -->
  <rect width="400" height="300" fill="url(#lavenderBg)"/>
  <rect width="400" height="300" fill="url(#violetGlow)"/>

  <!-- Floating Whimsical Magic & Butterfly Elements -->
  <g opacity="0.6">
    <circle cx="36" cy="42" r="1.5" fill="#a855f7"/>
    <circle cx="362" cy="52" r="2" fill="#c084fc"/>
    <circle cx="370" cy="180" r="1.5" fill="#a855f7"/>
    <circle cx="30" cy="235" r="2" fill="#8b5cf6"/>
    <circle cx="70" cy="25" r="1.5" fill="#c084fc"/>
  </g>

  <!-- Floating Emojis -->
  <text x="25" y="72" font-size="16" opacity="0.85">🦋</text>
  <text x="355" y="50" font-size="16" opacity="0.85">💜</text>
  <text x="360" y="195" font-size="15" opacity="0.8">🌙</text>
  <text x="26" y="195" font-size="15" opacity="0.75">✨</text>
  <text x="348" y="265" font-size="16" opacity="0.8">🔮</text>

  <!-- Central Luxury Frosted Card -->
  <g filter="url(#lavCardShadow)">
    <rect x="52" y="38" width="296" height="224" rx="20" fill="url(#lavGlass)" stroke="#ddd6fe" stroke-width="1.5"/>

    <!-- Top Badge Pill -->
    <rect x="126" y="22" width="148" height="30" rx="15" fill="#ffffff" stroke="#ddd6fe" stroke-width="1.5" filter="url(#lavCardShadow)"/>
    <text x="142" y="42" font-size="15">💜</text>
    <text x="168" y="42" class="font-sans" font-size="10.5" font-weight="700" fill="#7c3aed" letter-spacing="0.5">LAVENDER DREAM</text>

    <!-- Main Headline in Enchanted Cursive -->
    <text x="200" y="85" class="font-cursive" font-size="28" font-weight="700" fill="#3b0764" text-anchor="middle">Happy Birthday,</text>
    <text x="200" y="118" class="font-sans" font-size="23" font-weight="800" fill="#7c3aed" text-anchor="middle" letter-spacing="-0.3">Lavender Dream 💜</text>

    <!-- Decorative Lilac Divider Line -->
    <path d="M140 133 Q 200 135 260 133" stroke="#ede9fe" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="200" cy="133.5" r="3" fill="#8b5cf6"/>

    <!-- Subtitle Text -->
    <text x="200" y="154" class="font-sans" font-size="11" font-weight="600" fill="#581c87" text-anchor="middle">Wishing you gentle magic &amp; endless sweet dreams</text>
    <text x="200" y="171" class="font-sans" font-size="9.5" font-weight="500" fill="#7e22ce" text-anchor="middle" opacity="0.85">A fairytale surprise sealed with care...</text>

    <!-- Action Button (Amethyst Pill with Glowing Shadow) -->
    <g transform="translate(116, 192)" filter="url(#lavBtnGlow)">
      <rect width="168" height="38" rx="19" fill="url(#lavBtn)"/>
      <rect x="2" y="2" width="164" height="17" rx="9" fill="#ffffff" opacity="0.22"/>
      <text x="84" y="24" class="font-sans" font-size="11.5" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.3">Break Seal to Open 💌</text>
    </g>
  </g>

  <!-- Corner Polaroid (Bottom Left) with Real Lilac Aesthetic Portrait -->
  <g transform="translate(18, 142) rotate(-7)" filter="url(#lavAccentShadow)">
    <rect width="82" height="102" rx="4" fill="#ffffff" stroke="#ddd6fe" stroke-width="1.2"/>
    <!-- Photo Area -->
    <rect x="6" y="6" width="70" height="74" rx="2" fill="#f3e8ff"/>
    <image href="data:image/jpeg;base64,${photos.lavenderDream}" xlink:href="data:image/jpeg;base64,${photos.lavenderDream}" x="6" y="6" width="70" height="74" preserveAspectRatio="xMidYMid slice" clip-path="url(#lavPhotoClip)"/>
    
    <!-- Lilac Washi Tape on Top -->
    <g transform="translate(24, -7) rotate(3)">
      <rect width="34" height="12" rx="2" fill="#c084fc" opacity="0.9"/>
      <line x1="2" y1="2" x2="32" y2="2" stroke="#ffffff" stroke-width="0.8" opacity="0.6"/>
    </g>
    <!-- Butterfly sticker on corner -->
    <circle cx="70" cy="9" r="6.5" fill="#faf5ff"/>
    <text x="66" y="12.5" font-size="7.5">🦋</text>
    <!-- Handwritten style caption -->
    <text x="41" y="93" class="font-cursive" font-size="10" font-weight="700" fill="#581c87" text-anchor="middle">Fairy Magic 💜</text>
  </g>

  <!-- Wax Seal Accent (Top Right) -->
  <g transform="translate(332, 108) rotate(8)" filter="url(#lavCardShadow)">
    <circle cx="20" cy="20" r="18" fill="url(#amethystSeal)"/>
    <circle cx="20" cy="20" r="14" fill="none" stroke="#e9d5ff" stroke-width="1" stroke-dasharray="2 1.5"/>
    <text x="20" y="25" font-size="12" text-anchor="middle">💜</text>
  </g>
</svg>`;

// 6. Princess Peach SVG
const princessPeachSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap');
      .font-cursive { font-family: 'Dancing Script', cursive, sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    </style>

    <!-- Warm Peach Sunset Glow Background -->
    <linearGradient id="peachBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffdfa"/>
      <stop offset="50%" stop-color="#fff1e6"/>
      <stop offset="100%" stop-color="#fed7aa"/>
    </linearGradient>

    <!-- Apricot Radial Glow -->
    <radialGradient id="apricotGlow" cx="50%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#fb923c" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#fffdfa" stop-opacity="0"/>
    </radialGradient>

    <!-- Card Shadow & Peach Glow -->
    <filter id="peachCardShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#ea580c" flood-opacity="0.18"/>
    </filter>
    <filter id="peachBtnGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#ea580c" flood-opacity="0.45"/>
    </filter>
    <filter id="peachAccentShadow" x="-15%" y="-15%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#9a3412" flood-opacity="0.16"/>
    </filter>

    <!-- Coral Peach Button Gradient -->
    <linearGradient id="peachBtn" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>

    <!-- Peach Wax Seal Gradient -->
    <radialGradient id="peachSeal" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fdba74"/>
      <stop offset="50%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#9a3412"/>
    </radialGradient>

    <!-- Frosted Glass Overlay -->
    <linearGradient id="peachGlass" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#fffaf5" stop-opacity="0.94"/>
    </linearGradient>

    <!-- Polaroid Clip Path -->
    <clipPath id="peachPhotoClip">
      <rect x="6" y="6" width="70" height="74" rx="2" />
    </clipPath>
  </defs>

  <!-- Background Base -->
  <rect width="400" height="300" fill="url(#peachBg)"/>
  <rect width="400" height="300" fill="url(#apricotGlow)"/>

  <!-- Fairy Starlight & Sparkles -->
  <g opacity="0.65">
    <circle cx="35" cy="40" r="1.5" fill="#f97316"/>
    <circle cx="360" cy="50" r="2" fill="#fb923c"/>
    <circle cx="370" cy="180" r="1.5" fill="#f97316"/>
    <circle cx="28" cy="230" r="2" fill="#ea580c"/>
    <polygon points="50,110 53,116 47,114" fill="#fb923c" opacity="0.7"/>
    <polygon points="350,140 354,146 346,144" fill="#f97316" opacity="0.7"/>
  </g>

  <!-- Floating Emojis -->
  <text x="25" y="72" font-size="16" opacity="0.85">✨</text>
  <text x="355" y="48" font-size="16" opacity="0.85">🍑</text>
  <text x="360" y="195" font-size="15" opacity="0.8">🌟</text>
  <text x="26" y="195" font-size="15" opacity="0.75">🧡</text>
  <text x="348" y="265" font-size="16" opacity="0.8">👑</text>

  <!-- Central Luxury Frosted Card -->
  <g filter="url(#peachCardShadow)">
    <rect x="52" y="38" width="296" height="224" rx="20" fill="url(#peachGlass)" stroke="#fed7aa" stroke-width="1.5"/>

    <!-- Top Badge Pill -->
    <rect x="130" y="22" width="140" height="30" rx="15" fill="#ffffff" stroke="#fed7aa" stroke-width="1.5" filter="url(#peachCardShadow)"/>
    <text x="146" y="42" font-size="15">🍑</text>
    <text x="172" y="42" class="font-sans" font-size="10.5" font-weight="700" fill="#c2410c" letter-spacing="0.5">PRINCESS GLOW</text>

    <!-- Main Headline in Luxury Display -->
    <text x="200" y="85" class="font-cursive" font-size="28" font-weight="700" fill="#7c2d12" text-anchor="middle">Happy Birthday,</text>
    <text x="200" y="118" class="font-sans" font-size="24" font-weight="800" fill="#ea580c" text-anchor="middle" letter-spacing="-0.3">Princess! ✨👑</text>

    <!-- Decorative Warm Divider Line -->
    <path d="M140 133 Q 200 135 260 133" stroke="#ffedd5" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="200" cy="133.5" r="3" fill="#f97316"/>

    <!-- Subtitle Text -->
    <text x="200" y="154" class="font-sans" font-size="11" font-weight="600" fill="#9a3412" text-anchor="middle">May your day sparkle with pure fairy dust</text>
    <text x="200" y="171" class="font-sans" font-size="9.5" font-weight="500" fill="#c2410c" text-anchor="middle" opacity="0.85">A royal celebration crafted just for you...</text>

    <!-- Action Button (Coral Peach Pill with Glowing Shadow) -->
    <g transform="translate(120, 192)" filter="url(#peachBtnGlow)">
      <rect width="160" height="38" rx="19" fill="url(#peachBtn)"/>
      <rect x="2" y="2" width="156" height="17" rx="9" fill="#ffffff" opacity="0.22"/>
      <text x="80" y="24" class="font-sans" font-size="11.5" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.3">Open Magic Note 💌</text>
    </g>
  </g>

  <!-- Corner Polaroid (Bottom Left) with Real Cheerful Portrait -->
  <g transform="translate(18, 142) rotate(-7)" filter="url(#peachAccentShadow)">
    <rect width="82" height="102" rx="4" fill="#ffffff" stroke="#fed7aa" stroke-width="1.2"/>
    <!-- Photo Area -->
    <rect x="6" y="6" width="70" height="74" rx="2" fill="#ffedd5"/>
    <image href="data:image/jpeg;base64,${photos.princessPeach}" xlink:href="data:image/jpeg;base64,${photos.princessPeach}" x="6" y="6" width="70" height="74" preserveAspectRatio="xMidYMid slice" clip-path="url(#peachPhotoClip)"/>
    
    <!-- Warm Peach Washi Tape on Top -->
    <g transform="translate(24, -7) rotate(3)">
      <rect width="34" height="12" rx="2" fill="#fdba74" opacity="0.9"/>
      <line x1="2" y1="2" x2="32" y2="2" stroke="#ffffff" stroke-width="0.8" opacity="0.6"/>
    </g>
    <!-- Crown sticker on corner -->
    <circle cx="70" cy="9" r="6.5" fill="#fff7ed"/>
    <text x="66" y="12.5" font-size="7.5">👑</text>
    <!-- Handwritten style caption -->
    <text x="41" y="93" class="font-cursive" font-size="10" font-weight="700" fill="#9a3412" text-anchor="middle">Princess 👑</text>
  </g>

  <!-- Wax Seal Accent (Top Right) -->
  <g transform="translate(332, 108) rotate(8)" filter="url(#peachCardShadow)">
    <circle cx="20" cy="20" r="18" fill="url(#peachSeal)"/>
    <circle cx="20" cy="20" r="14" fill="none" stroke="#fed7aa" stroke-width="1" stroke-dasharray="2 1.5"/>
    <text x="20" y="25" font-size="12" text-anchor="middle">✨</text>
  </g>
</svg>`;

const files = [
  { path: 'public/previews/royal-sapphire.svg', content: royalSapphireSvg },
  { path: 'public/previews/golden-birthday.svg', content: goldenBirthdaySvg },
  { path: 'public/previews/polaroid-scrapbook.svg', content: polaroidScrapbookSvg },
  { path: 'public/previews/blush-rose.svg', content: blushRoseSvg },
  { path: 'public/previews/lavender-dream.svg', content: lavenderDreamSvg },
  { path: 'public/previews/princess-peach.svg', content: princessPeachSvg }
];

// Privacy Validation and File Write
for (const f of files) {
  // 1. Strict Privacy Check
  if (/aditi|\bdevi\b/i.test(f.content)) {
    throw new Error(`Privacy violation detected in ${f.path}`);
  }

  // 2. Basic XML tag balance check
  const openSvg = (f.content.match(/<svg/g) || []).length;
  const closeSvg = (f.content.match(/<\/svg>/g) || []).length;
  if (openSvg !== 1 || closeSvg !== 1) {
    throw new Error(`Unbalanced svg tags in ${f.path}`);
  }

  // Write file
  fs.writeFileSync(f.path, f.content, 'utf8');
  const size = fs.statSync(f.path).size;
  console.log(`Validated & wrote ${f.path} (${size} bytes)`);
}

console.log('All 6 preview SVGs generated and written successfully!');
