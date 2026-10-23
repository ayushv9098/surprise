import fs from 'fs';

const base64Map = JSON.parse(fs.readFileSync('public/previews/photos/base64-map.json', 'utf8'));

const configs = [
  // ==========================================
  // --- 1. VELVET ROMANCE (Romance) ---
  // ==========================================
  {
    id: 'velvet-romance',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#fff1f2' },
        { offset: '45%', color: '#ffe4e6' },
        { offset: '90%', color: '#fecdd3' },
        { offset: '100%', color: '#fda4af' }
      ]
    },
    canvasGlow: { color: '#f43f5e', opacity: '0.22' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.96' },
        { offset: '100%', color: '#fff5f6', opacity: '0.92' }
      ]
    },
    cardBorder: '#fecdd3',
    cardShadowColor: '#881337',
    dots: ['#fb7185', '#fda4af', '#fecdd3'],
    badge: {
      bg: '#ffffff',
      border: '#fecdd3',
      text: 'VELVET CRIMSON &amp; HEARTS ❤️',
      color: '#be123c'
    },
    dividerColor: '#ffe4e6',
    polaroid: {
      bg: '#ffffff',
      border: '#ffe4e6',
      shadowColor: '#4c0519',
      tapeColor: '#fb7185',
      overlayColor: '#be123c',
      overlayOpacity: '0.08',
      caption: 'Forever &amp; Always ❤️',
      captionColor: '#881337',
      subCaption: 'ANNIVERSARY CHAPTER',
      subCaptionColor: '#fb7185'
    },
    tag: {
      bg: '#fff1f2',
      border: '#fecdd3',
      text: 'TIMELESS ROMANCE ✨',
      color: '#e11d48'
    },
    headline1: 'Happy Anniversary,',
    headline1Color: '#881337',
    headline2: 'My Love! ❤️🌹',
    headline2Color: '#e11d48',
    sub1: 'Every single second with you',
    sub2: 'is my favorite memory...',
    subColor: '#9f1239',
    dividerLine: '#fecdd3',
    dividerKnot: '#e11d48',
    btn: {
      grad: [
        { offset: '0%', color: '#fb7185' },
        { offset: '45%', color: '#e11d48' },
        { offset: '100%', color: '#be123c' }
      ],
      glowColor: '#e11d48',
      text: 'Tap to Open ❤️'
    },
    footerNote: '🔒 Sealed with Heart Wax &amp; Love',
    footerColor: '#be123c',
    seal: {
      grad: [
        { offset: '0%', color: '#fb7185' },
        { offset: '50%', color: '#e11d48' },
        { offset: '100%', color: '#881337' }
      ],
      border: '#fecdd3',
      emoji: '❤️'
    },
    ambient: [
      { type: 'circle', cx: 24, cy: 40, r: 2.5, fill: '#f43f5e', opacity: 0.65 },
      { type: 'circle', cx: 376, cy: 48, r: 3, fill: '#fb7185', opacity: 0.65 },
      { type: 'circle', cx: 16, cy: 235, r: 2, fill: '#fda4af', opacity: 0.65 },
      { type: 'circle', cx: 382, cy: 240, r: 2.5, fill: '#f43f5e', opacity: 0.65 },
      { type: 'text', x: 18, y: 145, text: '✨', size: 14, opacity: 0.75 },
      { type: 'text', x: 368, y: 115, text: '🌹', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 275, text: '💌', size: 15, opacity: 0.75 }
    ]
  },

  // ==========================================
  // --- 2. SUNSET ROMANCE (Romance) ---
  // ==========================================
  {
    id: 'sunset-romance',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#fffbeb' },
        { offset: '40%', color: '#fef3c7' },
        { offset: '80%', color: '#fed7aa' },
        { offset: '100%', color: '#ffedd5' }
      ]
    },
    canvasGlow: { color: '#f59e0b', opacity: '0.25' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.97' },
        { offset: '100%', color: '#fffaf0', opacity: '0.94' }
      ]
    },
    cardBorder: '#fde68a',
    cardShadowColor: '#b45309',
    dots: ['#f59e0b', '#fbbf24', '#fde68a'],
    badge: {
      bg: '#ffffff',
      border: '#fde68a',
      text: 'WARM AMBER &amp; ROSE GOLD 🌅✨',
      color: '#b45309'
    },
    dividerColor: '#fef3c7',
    polaroid: {
      bg: '#ffffff',
      border: '#fef3c7',
      shadowColor: '#78350f',
      tapeColor: '#fbbf24',
      overlayColor: '#f59e0b',
      overlayOpacity: '0.10',
      caption: 'Golden Hour 🌅✨',
      captionColor: '#78350f',
      subCaption: 'SUNSET PROMISE',
      subCaptionColor: '#d97706'
    },
    tag: {
      bg: '#fffbeb',
      border: '#fde68a',
      text: 'GOLDEN MOMENTS 🌅',
      color: '#b45309'
    },
    headline1: 'You Are My Golden Hour,',
    headline1Color: '#78350f',
    headline2: 'Forever &amp; Beyond 🌅',
    headline2Color: '#d97706',
    sub1: 'From our very first hello',
    sub2: 'to forever and beyond...',
    subColor: '#92400e',
    dividerLine: '#fde68a',
    dividerKnot: '#f59e0b',
    btn: {
      grad: [
        { offset: '0%', color: '#fbbf24' },
        { offset: '45%', color: '#f59e0b' },
        { offset: '100%', color: '#d97706' }
      ],
      glowColor: '#f59e0b',
      text: 'Open Golden Hour 🌅'
    },
    footerNote: '🔒 Amber Wax Seal &amp; Romantic Chimes',
    footerColor: '#b45309',
    seal: {
      grad: [
        { offset: '0%', color: '#fde68a' },
        { offset: '50%', color: '#f59e0b' },
        { offset: '100%', color: '#b45309' }
      ],
      border: '#fef3c7',
      emoji: '✨'
    },
    ambient: [
      { type: 'circle', cx: 28, cy: 38, r: 2.5, fill: '#f59e0b', opacity: 0.7 },
      { type: 'circle', cx: 372, cy: 45, r: 3, fill: '#fbbf24', opacity: 0.7 },
      { type: 'circle', cx: 18, cy: 240, r: 2, fill: '#d97706', opacity: 0.7 },
      { type: 'circle', cx: 380, cy: 235, r: 2.5, fill: '#f59e0b', opacity: 0.7 },
      { type: 'text', x: 18, y: 150, text: '✨', size: 14, opacity: 0.8 },
      { type: 'text', x: 368, y: 110, text: '🌅', size: 14, opacity: 0.85 },
      { type: 'text', x: 366, y: 275, text: '🥂', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 3. CELESTIAL LOVE (Romance) ---
  // ==========================================
  {
    id: 'celestial-love',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#020617' },
        { offset: '40%', color: '#0f172a' },
        { offset: '80%', color: '#1e1b4b' },
        { offset: '100%', color: '#2e1065' }
      ]
    },
    canvasGlow: { color: '#6366f1', opacity: '0.32' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#0f172a', opacity: '0.94' },
        { offset: '100%', color: '#1e1b4b', opacity: '0.90' }
      ]
    },
    cardBorder: '#4338ca',
    cardShadowColor: '#020617',
    dots: ['#818cf8', '#6366f1', '#4f46e5'],
    badge: {
      bg: '#1e1b4b',
      border: '#6366f1',
      text: 'MIDNIGHT STARS &amp; STARLIGHT 🌌✨',
      color: '#c7d2fe'
    },
    dividerColor: '#312e81',
    polaroid: {
      bg: '#0f172a',
      border: '#4338ca',
      shadowColor: '#000000',
      tapeColor: '#6366f1',
      overlayColor: '#4f46e5',
      overlayOpacity: '0.12',
      caption: 'Written in Stars ✨',
      captionColor: '#e0e7ff',
      subCaption: 'COSMIC LOVE EDITION',
      subCaptionColor: '#a5b4fc'
    },
    tag: {
      bg: '#1e1b4b',
      border: '#6366f1',
      text: 'CELESTIAL LOVE 💫',
      color: '#c7d2fe'
    },
    headline1: 'Written in the Stars,',
    headline1Color: '#e0e7ff',
    headline2: 'Across the Cosmos 💫',
    headline2Color: '#a5b4fc',
    sub1: 'In a world of eight billion,',
    sub2: 'my soul only searches for you...',
    subColor: '#cbd5e1',
    dividerLine: '#3730a3',
    dividerKnot: '#6366f1',
    btn: {
      grad: [
        { offset: '0%', color: '#818cf8' },
        { offset: '45%', color: '#6366f1' },
        { offset: '100%', color: '#4338ca' }
      ],
      glowColor: '#6366f1',
      text: 'Explore the Stars ✨'
    },
    footerNote: '🔒 Silver Moon Seal &amp; Cosmic Melodies',
    footerColor: '#818cf8',
    seal: {
      grad: [
        { offset: '0%', color: '#c7d2fe' },
        { offset: '50%', color: '#6366f1' },
        { offset: '100%', color: '#1e1b4b' }
      ],
      border: '#a5b4fc',
      emoji: '🌙'
    },
    ambient: [
      { type: 'circle', cx: 28, cy: 38, r: 1.5, fill: '#e0e7ff', opacity: 0.8 },
      { type: 'circle', cx: 372, cy: 42, r: 1.8, fill: '#e0e7ff', opacity: 0.8 },
      { type: 'circle', cx: 18, cy: 245, r: 1.5, fill: '#c7d2fe', opacity: 0.8 },
      { type: 'circle', cx: 380, cy: 235, r: 1.8, fill: '#e0e7ff', opacity: 0.8 },
      { type: 'text', x: 16, y: 125, text: '✨', size: 14, opacity: 0.85 },
      { type: 'text', x: 368, y: 110, text: '🌙', size: 14, opacity: 0.85 },
      { type: 'text', x: 366, y: 275, text: '💫', size: 15, opacity: 0.85 }
    ]
  },

  // ==========================================
  // --- 4. VINTAGE KODAK (Scrapbook) ---
  // ==========================================
  {
    id: 'vintage-kodak',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#fffdf5' },
        { offset: '35%', color: '#fef9c3' },
        { offset: '75%', color: '#fde68a' },
        { offset: '100%', color: '#fef08a' }
      ]
    },
    canvasGlow: { color: '#d97706', opacity: '0.22' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.97' },
        { offset: '100%', color: '#fffdf5', opacity: '0.93' }
      ]
    },
    cardBorder: '#fde68a',
    cardShadowColor: '#78350f',
    dots: ['#ea580c', '#f59e0b', '#ca8a04'],
    badge: {
      bg: '#ffffff',
      border: '#fde68a',
      text: 'RETRO KODAK &amp; 35MM FILM 🎞️📸',
      color: '#92400e'
    },
    dividerColor: '#fef08a',
    polaroid: {
      bg: '#fefdf8',
      border: '#fef08a',
      shadowColor: '#451a03',
      tapeColor: '#f59e0b',
      overlayColor: '#f59e0b',
      overlayOpacity: '0.08',
      caption: 'Unforgettable Days 🎞️',
      captionColor: '#78350f',
      subCaption: 'KODAK 400 • 36 EXP',
      subCaptionColor: '#b45309'
    },
    tag: {
      bg: '#fefce8',
      border: '#fde68a',
      text: 'SCRAPBOOK VAULT 📸',
      color: '#b45309'
    },
    headline1: 'Chapters of Our Journey,',
    headline1Color: '#78350f',
    headline2: 'Captured Forever 🎞️📸',
    headline2Color: '#b45309',
    sub1: 'Preserved in the scrapbook',
    sub2: 'of our greatest adventures...',
    subColor: '#92400e',
    dividerLine: '#fde68a',
    dividerKnot: '#d97706',
    btn: {
      grad: [
        { offset: '0%', color: '#f59e0b' },
        { offset: '50%', color: '#d97706' },
        { offset: '100%', color: '#92400e' }
      ],
      glowColor: '#d97706',
      text: 'Open Scrapbook 📸'
    },
    footerNote: '🔒 Amber Wax Seal &amp; 35mm Time Capsule',
    footerColor: '#92400e',
    seal: {
      grad: [
        { offset: '0%', color: '#fef08a' },
        { offset: '50%', color: '#d97706' },
        { offset: '100%', color: '#78350f' }
      ],
      border: '#fef08a',
      emoji: '⚡'
    },
    ambient: [
      { type: 'text', x: 14, y: 145, text: '⚡', size: 14, opacity: 0.8 },
      { type: 'text', x: 368, y: 110, text: '🎞️', size: 14, opacity: 0.85 },
      { type: 'text', x: 366, y: 275, text: '📸', size: 15, opacity: 0.8 }
    ],
    sprockets: true
  },

  // ==========================================
  // --- 5. COZY MEMORIES (Scrapbook) ---
  // ==========================================
  {
    id: 'cozy-memories',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#fff7ed' },
        { offset: '40%', color: '#ffedd5' },
        { offset: '80%', color: '#fed7aa' },
        { offset: '100%', color: '#fdba74' }
      ]
    },
    canvasGlow: { color: '#c2410c', opacity: '0.22' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.97' },
        { offset: '100%', color: '#fffbf5', opacity: '0.94' }
      ]
    },
    cardBorder: '#fed7aa',
    cardShadowColor: '#9a3412',
    dots: ['#f97316', '#fb923c', '#fdba74'],
    badge: {
      bg: '#ffffff',
      border: '#fed7aa',
      text: 'WARM TERRACOTTA &amp; CAFÉ ☕🌻',
      color: '#9a3412'
    },
    dividerColor: '#ffedd5',
    polaroid: {
      bg: '#ffffff',
      border: '#fed7aa',
      shadowColor: '#7c2d12',
      tapeColor: '#ea580c',
      overlayColor: '#c2410c',
      overlayOpacity: '0.08',
      caption: 'Café Conversations ☕',
      captionColor: '#7c2d12',
      subCaption: 'COZY SCRAPBOOK',
      subCaptionColor: '#ea580c'
    },
    tag: {
      bg: '#fff7ed',
      border: '#fed7aa',
      text: 'COZY MEMORIES 🌻',
      color: '#c2410c'
    },
    headline1: 'Grateful For Every Memory,',
    headline1Color: '#7c2d12',
    headline2: 'Warm Coffee &amp; Laughs ☕',
    headline2Color: '#c2410c',
    sub1: 'Friendships like this turn',
    sub2: 'ordinary moments to pure gold...',
    subColor: '#9a3412',
    dividerLine: '#fed7aa',
    dividerKnot: '#ea580c',
    btn: {
      grad: [
        { offset: '0%', color: '#fb923c' },
        { offset: '45%', color: '#ea580c' },
        { offset: '100%', color: '#c2410c' }
      ],
      glowColor: '#ea580c',
      text: 'Open Memory Book 🌻'
    },
    footerNote: '🔒 Sunflower Wax Seal &amp; Acoustic Soul',
    footerColor: '#9a3412',
    seal: {
      grad: [
        { offset: '0%', color: '#fed7aa' },
        { offset: '50%', color: '#ea580c' },
        { offset: '100%', color: '#7c2d12' }
      ],
      border: '#ffedd5',
      emoji: '🌻'
    },
    ambient: [
      { type: 'circle', cx: 28, cy: 38, r: 2.5, fill: '#ea580c', opacity: 0.7 },
      { type: 'circle', cx: 372, cy: 45, r: 3, fill: '#fb923c', opacity: 0.7 },
      { type: 'circle', cx: 18, cy: 240, r: 2, fill: '#c2410c', opacity: 0.7 },
      { type: 'circle', cx: 380, cy: 235, r: 2.5, fill: '#ea580c', opacity: 0.7 },
      { type: 'text', x: 16, y: 145, text: '🍂', size: 14, opacity: 0.8 },
      { type: 'text', x: 368, y: 110, text: '☕', size: 14, opacity: 0.85 },
      { type: 'text', x: 366, y: 275, text: '🌻', size: 15, opacity: 0.85 }
    ]
  },

  // ==========================================
  // --- 6. NEON NOSTALGIA (Scrapbook) ---
  // ==========================================
  {
    id: 'neon-nostalgia',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#022c22' },
        { offset: '35%', color: '#0f172a' },
        { offset: '75%', color: '#134e4a' },
        { offset: '100%', color: '#064e3b' }
      ]
    },
    canvasGlow: { color: '#0d9488', opacity: '0.35' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#061a19', opacity: '0.95' },
        { offset: '100%', color: '#0f2928', opacity: '0.90' }
      ]
    },
    cardBorder: '#0d9488',
    cardShadowColor: '#022c22',
    dots: ['#2dd4bf', '#14b8a6', '#0d9488'],
    badge: {
      bg: '#042f2e',
      border: '#0d9488',
      text: 'ELECTRIC TEAL &amp; BROTHERHOOD ⚡🔥',
      color: '#a7f3d0'
    },
    dividerColor: '#134e4a',
    polaroid: {
      bg: '#042f2e',
      border: '#0d9488',
      shadowColor: '#000000',
      tapeColor: '#2dd4bf',
      overlayColor: '#0d9488',
      overlayOpacity: '0.12',
      caption: 'Partner in Crime ⚡',
      captionColor: '#a7f3d0',
      subCaption: 'ELECTRIC NOSTALGIA',
      subCaptionColor: '#2dd4bf'
    },
    tag: {
      bg: '#042f2e',
      border: '#0d9488',
      text: 'ELECTRIC VIBES ⚡',
      color: '#2dd4bf'
    },
    headline1: 'Brothers &amp; Besties,',
    headline1Color: '#a7f3d0',
    headline2: 'Partners in Crime ⚡🔥',
    headline2Color: '#2dd4bf',
    sub1: 'To the wild stories, loud laughs,',
    sub2: 'and legendary brotherhood...',
    subColor: '#cbd5e1',
    dividerLine: '#115e59',
    dividerKnot: '#2dd4bf',
    btn: {
      grad: [
        { offset: '0%', color: '#2dd4bf' },
        { offset: '45%', color: '#0d9488' },
        { offset: '100%', color: '#0f766e' }
      ],
      glowColor: '#2dd4bf',
      text: 'Play Memories ⚡'
    },
    footerNote: '🔒 Lightning Bolt Seal &amp; Wild Energy',
    footerColor: '#2dd4bf',
    seal: {
      grad: [
        { offset: '0%', color: '#a7f3d0' },
        { offset: '50%', color: '#0d9488' },
        { offset: '100%', color: '#042f2e' }
      ],
      border: '#2dd4bf',
      emoji: '🔥'
    },
    ambient: [
      { type: 'circle', cx: 28, cy: 38, r: 1.5, fill: '#2dd4bf', opacity: 0.8 },
      { type: 'circle', cx: 372, cy: 42, r: 1.8, fill: '#5eead4', opacity: 0.8 },
      { type: 'circle', cx: 18, cy: 245, r: 1.5, fill: '#2dd4bf', opacity: 0.8 },
      { type: 'circle', cx: 380, cy: 235, r: 1.8, fill: '#5eead4', opacity: 0.8 },
      { type: 'text', x: 16, y: 125, text: '⚡', size: 14, opacity: 0.85 },
      { type: 'text', x: 368, y: 110, text: '🤙', size: 14, opacity: 0.85 },
      { type: 'text', x: 366, y: 275, text: '🛹', size: 15, opacity: 0.85 }
    ]
  },

  // ==========================================
  // --- 7. GENTLE PEACE (Apology) ---
  // ==========================================
  {
    id: 'gentle-peace',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#f0fdf4' },
        { offset: '40%', color: '#dcfce7' },
        { offset: '80%', color: '#bbf7d0' },
        { offset: '100%', color: '#86efac' }
      ]
    },
    canvasGlow: { color: '#15803d', opacity: '0.22' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.97' },
        { offset: '100%', color: '#f0fdf4', opacity: '0.94' }
      ]
    },
    cardBorder: '#86efac',
    cardShadowColor: '#14532d',
    dots: ['#4ade80', '#22c55e', '#16a34a'],
    badge: {
      bg: '#ffffff',
      border: '#86efac',
      text: 'GENTLE OLIVE &amp; WHITE PEACE 🕊️🤍',
      color: '#15803d'
    },
    dividerColor: '#dcfce7',
    polaroid: {
      bg: '#ffffff',
      border: '#dcfce7',
      shadowColor: '#14532d',
      tapeColor: '#22c55e',
      overlayColor: '#15803d',
      overlayOpacity: '0.08',
      caption: 'Truly Sincere 🕊️',
      captionColor: '#14532d',
      subCaption: 'PEACE OFFERING',
      subCaptionColor: '#16a34a'
    },
    tag: {
      bg: '#f0fdf4',
      border: '#86efac',
      text: 'SINCERE PEACE 🤍',
      color: '#15803d'
    },
    headline1: 'From the Bottom of My Heart,',
    headline1Color: '#14532d',
    headline2: "I'm Truly Sorry 🕊️🤍",
    headline2Color: '#15803d',
    sub1: 'I made a mistake, and your happiness',
    sub2: 'and our bond mean everything to me...',
    subColor: '#166534',
    dividerLine: '#bbf7d0',
    dividerKnot: '#16a34a',
    btn: {
      grad: [
        { offset: '0%', color: '#4ade80' },
        { offset: '45%', color: '#16a34a' },
        { offset: '100%', color: '#15803d' }
      ],
      glowColor: '#16a34a',
      text: 'Read My Heart 🕊️'
    },
    footerNote: '🔒 Dove Wax Seal &amp; Honest Care',
    footerColor: '#15803d',
    seal: {
      grad: [
        { offset: '0%', color: '#bbf7d0' },
        { offset: '50%', color: '#16a34a' },
        { offset: '100%', color: '#14532d' }
      ],
      border: '#dcfce7',
      emoji: '🕊️'
    },
    ambient: [
      { type: 'circle', cx: 28, cy: 38, r: 2.5, fill: '#16a34a', opacity: 0.65 },
      { type: 'circle', cx: 372, cy: 45, r: 3, fill: '#22c55e', opacity: 0.65 },
      { type: 'circle', cx: 18, cy: 240, r: 2, fill: '#15803d', opacity: 0.65 },
      { type: 'circle', cx: 380, cy: 235, r: 2.5, fill: '#16a34a', opacity: 0.65 },
      { type: 'text', x: 16, y: 145, text: '🌿', size: 14, opacity: 0.8 },
      { type: 'text', x: 368, y: 110, text: '🕊️', size: 14, opacity: 0.85 },
      { type: 'text', x: 366, y: 275, text: '🤍', size: 15, opacity: 0.85 }
    ]
  },

  // ==========================================
  // --- 8. SWEET FORGIVE (Apology) ---
  // ==========================================
  {
    id: 'sweet-forgive',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#f5f3ff' },
        { offset: '40%', color: '#ede9fe' },
        { offset: '80%', color: '#ddd6fe' },
        { offset: '100%', color: '#c4b5fd' }
      ]
    },
    canvasGlow: { color: '#8b5cf6', opacity: '0.22' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.97' },
        { offset: '100%', color: '#faf5ff', opacity: '0.94' }
      ]
    },
    cardBorder: '#c4b5fd',
    cardShadowColor: '#6b21a8',
    dots: ['#a78bfa', '#8b5cf6', '#7c3aed'],
    badge: {
      bg: '#ffffff',
      border: '#c4b5fd',
      text: 'PASTEL LILAC &amp; BIG HUGS 🥺💜',
      color: '#7c3aed'
    },
    dividerColor: '#ede9fe',
    polaroid: {
      bg: '#ffffff',
      border: '#ede9fe',
      shadowColor: '#581c87',
      tapeColor: '#8b5cf6',
      overlayColor: '#7c3aed',
      overlayOpacity: '0.08',
      caption: 'Infinite Hugs 🥺💜',
      captionColor: '#581c87',
      subCaption: 'HEARTFELT SINCERITY',
      subCaptionColor: '#7c3aed'
    },
    tag: {
      bg: '#f5f3ff',
      border: '#c4b5fd',
      text: 'WARM HUGS 🥺',
      color: '#7c3aed'
    },
    headline1: 'Please Forgive Me,',
    headline1Color: '#581c87',
    headline2: 'Infinite Hugs 🥺💜',
    headline2Color: '#7c3aed',
    sub1: 'I miss your smile so much,',
    sub2: 'please let me make things right...',
    subColor: '#6b21a8',
    dividerLine: '#ddd6fe',
    dividerKnot: '#8b5cf6',
    btn: {
      grad: [
        { offset: '0%', color: '#a78bfa' },
        { offset: '45%', color: '#8b5cf6' },
        { offset: '100%', color: '#6d28d9' }
      ],
      glowColor: '#8b5cf6',
      text: 'Open With Hugs 🥺'
    },
    footerNote: '🔒 Purple Heart Seal &amp; Honest Care',
    footerColor: '#7c3aed',
    seal: {
      grad: [
        { offset: '0%', color: '#ddd6fe' },
        { offset: '50%', color: '#8b5cf6' },
        { offset: '100%', color: '#581c87' }
      ],
      border: '#ede9fe',
      emoji: '💜'
    },
    ambient: [
      { type: 'circle', cx: 28, cy: 38, r: 2.5, fill: '#8b5cf6', opacity: 0.65 },
      { type: 'circle', cx: 372, cy: 45, r: 3, fill: '#a78bfa', opacity: 0.65 },
      { type: 'circle', cx: 18, cy: 240, r: 2, fill: '#7c3aed', opacity: 0.65 },
      { type: 'circle', cx: 380, cy: 235, r: 2.5, fill: '#8b5cf6', opacity: 0.65 },
      { type: 'text', x: 16, y: 145, text: '🧸', size: 14, opacity: 0.8 },
      { type: 'text', x: 368, y: 110, text: '🥺', size: 14, opacity: 0.85 },
      { type: 'text', x: 366, y: 275, text: '💜', size: 15, opacity: 0.85 }
    ]
  },

  // ==========================================
  // --- 9. FRESH START (Apology) ---
  // ==========================================
  {
    id: 'fresh-start',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#fffbeb' },
        { offset: '40%', color: '#fef3c7' },
        { offset: '75%', color: '#fed7aa' },
        { offset: '100%', color: '#dcfce7' }
      ]
    },
    canvasGlow: { color: '#d97706', opacity: '0.22' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.97' },
        { offset: '100%', color: '#fffdf7', opacity: '0.94' }
      ]
    },
    cardBorder: '#fde68a',
    cardShadowColor: '#92400e',
    dots: ['#fbbf24', '#f59e0b', '#22c55e'],
    badge: {
      bg: '#ffffff',
      border: '#fde68a',
      text: 'WARM SUNRISE &amp; FRESH CHAPTER 🌤️🌱',
      color: '#b45309'
    },
    dividerColor: '#fef3c7',
    polaroid: {
      bg: '#ffffff',
      border: '#fef3c7',
      shadowColor: '#78350f',
      tapeColor: '#22c55e',
      overlayColor: '#f59e0b',
      overlayOpacity: '0.08',
      caption: 'A Fresh Chapter 🌤️',
      captionColor: '#78350f',
      subCaption: 'TURNING THE PAGE',
      subCaptionColor: '#d97706'
    },
    tag: {
      bg: '#fffbeb',
      border: '#fde68a',
      text: 'NEW BEGINNING 🌱',
      color: '#b45309'
    },
    headline1: 'A Fresh Chapter Together,',
    headline1Color: '#78350f',
    headline2: 'Turning The Page 🌤️🌱',
    headline2Color: '#d97706',
    sub1: 'Nothing is worth losing the bond',
    sub2: 'and beautiful memories we built...',
    subColor: '#92400e',
    dividerLine: '#fde68a',
    dividerKnot: '#22c55e',
    btn: {
      grad: [
        { offset: '0%', color: '#fbbf24' },
        { offset: '45%', color: '#f59e0b' },
        { offset: '100%', color: '#d97706' }
      ],
      glowColor: '#f59e0b',
      text: 'Begin Fresh Chapter 🌤️'
    },
    footerNote: '🔒 Sunrise Seal &amp; Hopeful Tomorrow',
    footerColor: '#b45309',
    seal: {
      grad: [
        { offset: '0%', color: '#fef08a' },
        { offset: '50%', color: '#f59e0b' },
        { offset: '100%', color: '#16a34a' }
      ],
      border: '#fef3c7',
      emoji: '🌱'
    },
    ambient: [
      { type: 'circle', cx: 28, cy: 38, r: 2.5, fill: '#f59e0b', opacity: 0.65 },
      { type: 'circle', cx: 372, cy: 45, r: 3, fill: '#22c55e', opacity: 0.65 },
      { type: 'circle', cx: 18, cy: 240, r: 2, fill: '#d97706', opacity: 0.65 },
      { type: 'circle', cx: 380, cy: 235, r: 2.5, fill: '#f59e0b', opacity: 0.65 },
      { type: 'text', x: 16, y: 145, text: '🌱', size: 14, opacity: 0.8 },
      { type: 'text', x: 368, y: 110, text: '🌤️', size: 14, opacity: 0.85 },
      { type: 'text', x: 366, y: 275, text: '💛', size: 15, opacity: 0.85 }
    ]
  }
];

function generateSvg(cfg) {
  const photoDataUri = base64Map[cfg.id];
  if (!photoDataUri) {
    throw new Error(`Missing photo base64 data for ${cfg.id}`);
  }

  const canvasStops = cfg.canvasBg.stops
    .map(s => `      <stop offset="${s.offset}" stop-color="${s.color}"/>`)
    .join('\n');

  const cardStops = cfg.cardBg.stops
    .map(s => `      <stop offset="${s.offset}" stop-color="${s.color}" stop-opacity="${s.opacity || '1'}"/>`)
    .join('\n');

  const btnStops = cfg.btn.grad
    .map(s => `      <stop offset="${s.offset}" stop-color="${s.color}"/>`)
    .join('\n');

  const sealStops = cfg.seal.grad
    .map(s => `      <stop offset="${s.offset}" stop-color="${s.color}"/>`)
    .join('\n');

  let ambientElements = '';
  for (const item of cfg.ambient) {
    if (item.type === 'circle') {
      ambientElements += `    <circle cx="${item.cx}" cy="${item.cy}" r="${item.r}" fill="${item.fill}" opacity="${item.opacity}"/>\n`;
    } else if (item.type === 'text') {
      ambientElements += `    <text x="${item.x}" y="${item.y}" font-size="${item.size}" opacity="${item.opacity}">${item.text}</text>\n`;
    }
  }

  let sprocketsBlock = '';
  if (cfg.sprockets) {
    sprocketsBlock = `
  <!-- Film Sprocket Holes along canvas top and bottom -->
  <g fill="#78350f" opacity="0.18">
    <rect x="18" y="4" width="8" height="5" rx="1.5"/>
    <rect x="42" y="4" width="8" height="5" rx="1.5"/>
    <rect x="66" y="4" width="8" height="5" rx="1.5"/>
    <rect x="326" y="4" width="8" height="5" rx="1.5"/>
    <rect x="350" y="4" width="8" height="5" rx="1.5"/>
    <rect x="374" y="4" width="8" height="5" rx="1.5"/>
    <rect x="18" y="291" width="8" height="5" rx="1.5"/>
    <rect x="42" y="291" width="8" height="5" rx="1.5"/>
    <rect x="66" y="291" width="8" height="5" rx="1.5"/>
    <rect x="326" y="291" width="8" height="5" rx="1.5"/>
    <rect x="350" y="291" width="8" height="5" rx="1.5"/>
    <rect x="374" y="291" width="8" height="5" rx="1.5"/>
  </g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap');
      .font-cursive { font-family: 'Dancing Script', cursive, sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    </style>

    <!-- Canvas Background Gradient -->
    <linearGradient id="${cfg.id}-canvasBg" x1="0%" y1="0%" x2="100%" y2="100%">
${canvasStops}
    </linearGradient>

    <!-- Canvas Radial Glow -->
    <radialGradient id="${cfg.id}-canvasGlow" cx="50%" cy="30%" r="65%">
      <stop offset="0%" stop-color="${cfg.canvasGlow.color}" stop-opacity="${cfg.canvasGlow.opacity}"/>
      <stop offset="100%" stop-color="${cfg.canvasBg.stops[0].color}" stop-opacity="0"/>
    </radialGradient>

    <!-- Card Glass Background -->
    <linearGradient id="${cfg.id}-cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
${cardStops}
    </linearGradient>

    <!-- Button Gradient -->
    <linearGradient id="${cfg.id}-btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
${btnStops}
    </linearGradient>

    <!-- Wax Seal Gradient -->
    <radialGradient id="${cfg.id}-sealGrad" cx="35%" cy="35%" r="65%">
${sealStops}
    </radialGradient>

    <!-- Shadows -->
    <filter id="${cfg.id}-cardShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="${cfg.cardShadowColor}" flood-opacity="0.16"/>
    </filter>
    <filter id="${cfg.id}-polaroidShadow" x="-15%" y="-15%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="2" dy="8" stdDeviation="8" flood-color="${cfg.polaroid.shadowColor}" flood-opacity="0.25"/>
    </filter>
    <filter id="${cfg.id}-btnGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="${cfg.btn.glowColor}" flood-opacity="0.45"/>
    </filter>

    <!-- Photo Clip Path -->
    <clipPath id="${cfg.id}-photoClip">
      <rect x="0" y="0" width="118" height="126" rx="6"/>
    </clipPath>
  </defs>

  <!-- Canvas Background -->
  <rect width="400" height="300" fill="url(#${cfg.id}-canvasBg)"/>
  <rect width="400" height="300" fill="url(#${cfg.id}-canvasGlow)"/>
${sprocketsBlock}
  <!-- Ambient Floating Stickers &amp; Particles -->
  <g>
${ambientElements}  </g>

  <!-- Main Luxury Keepsake Hero Mockup Card -->
  <g filter="url(#${cfg.id}-cardShadow)">
    <rect x="20" y="16" width="360" height="268" rx="18" fill="url(#${cfg.id}-cardBg)" stroke="${cfg.cardBorder}" stroke-width="1.2"/>

    <!-- App Top Bar Micro Controls -->
    <g transform="translate(32, 28)">
      <circle cx="0" cy="4" r="3" fill="${cfg.dots[0]}" opacity="0.85"/>
      <circle cx="9" cy="4" r="3" fill="${cfg.dots[1]}" opacity="0.85"/>
      <circle cx="18" cy="4" r="3" fill="${cfg.dots[2]}" opacity="0.85"/>
    </g>

    <!-- Top Badge Pill -->
    <g transform="translate(115, 20)">
      <rect width="170" height="20" rx="10" fill="${cfg.badge.bg}" stroke="${cfg.badge.border}" stroke-width="1"/>
      <text x="85" y="14" class="font-sans" font-size="8.5" font-weight="700" fill="${cfg.badge.color}" text-anchor="middle" letter-spacing="0.5">${cfg.badge.text}</text>
    </g>

    <line x1="20" y1="46" x2="380" y2="46" stroke="${cfg.dividerColor}" stroke-width="0.8"/>

    <!-- Left Column: Photographic Polaroid with Embedded High-Fidelity Photo -->
    <g transform="translate(36, 56) rotate(-2.5)" filter="url(#${cfg.id}-polaroidShadow)">
      <!-- Polaroid Frame -->
      <rect width="134" height="172" rx="6" fill="${cfg.polaroid.bg}" stroke="${cfg.polaroid.border}" stroke-width="1"/>

      <!-- Photo Area -->
      <g transform="translate(8, 8)">
        <image href="${photoDataUri}"
               xlink:href="${photoDataUri}"
               x="0" y="0" width="118" height="126"
               preserveAspectRatio="xMidYMid slice"
               clip-path="url(#${cfg.id}-photoClip)"/>
        <!-- Soft Tint Overlay -->
        <rect width="118" height="126" rx="6" fill="${cfg.polaroid.overlayColor}" opacity="${cfg.polaroid.overlayOpacity}"/>
      </g>

      <!-- Washi Tape Pin Top -->
      <g transform="translate(42, -7) rotate(2)">
        <rect width="50" height="13" rx="2" fill="${cfg.polaroid.tapeColor}" opacity="0.9"/>
        <line x1="10" y1="0" x2="10" y2="13" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
        <line x1="25" y1="0" x2="25" y2="13" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
        <line x1="40" y1="0" x2="40" y2="13" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
      </g>

      <!-- Polaroid Handwritten Caption -->
      <text x="67" y="150" class="font-cursive" font-size="14" font-weight="700" fill="${cfg.polaroid.captionColor}" text-anchor="middle">${cfg.polaroid.caption}</text>
      <text x="67" y="163" class="font-sans" font-size="7.5" font-weight="700" fill="${cfg.polaroid.subCaptionColor}" text-anchor="middle" letter-spacing="0.4">${cfg.polaroid.subCaption}</text>
    </g>

    <!-- Right Column: Hero Typography &amp; Keepsake Action Button -->
    <g transform="translate(186, 60)">
      <!-- Occasion Tag -->
      <g>
        <rect width="105" height="17" rx="8.5" fill="${cfg.tag.bg}" stroke="${cfg.tag.border}" stroke-width="1"/>
        <text x="52.5" y="11.5" class="font-sans" font-size="8" font-weight="700" fill="${cfg.tag.color}" text-anchor="middle" letter-spacing="0.4">${cfg.tag.text}</text>
      </g>

      <!-- Emotional Headline -->
      <text x="0" y="44" class="font-cursive" font-size="22" font-weight="700" fill="${cfg.headline1Color}">${cfg.headline1}</text>
      <text x="0" y="67" class="font-sans" font-size="16.5" font-weight="800" fill="${cfg.headline2Color}" letter-spacing="-0.3">${cfg.headline2}</text>

      <!-- Poetic Subtitles -->
      <text x="0" y="91" class="font-sans" font-size="9" font-weight="600" fill="${cfg.subColor}">${cfg.sub1}</text>
      <text x="0" y="105" class="font-sans" font-size="9" font-weight="600" fill="${cfg.subColor}">${cfg.sub2}</text>

      <!-- Decorative Divider with Center Knot -->
      <g transform="translate(0, 118)">
        <line x1="0" y1="0" x2="160" y2="0" stroke="${cfg.dividerLine}" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="80" cy="0" r="3" fill="${cfg.dividerKnot}"/>
        <circle cx="80" cy="0" r="1.5" fill="#ffffff"/>
      </g>

      <!-- Glowing Keepsake Action Button -->
      <g transform="translate(0, 134)" filter="url(#${cfg.id}-btnGlow)">
        <rect width="168" height="38" rx="19" fill="url(#${cfg.id}-btnGrad)"/>
        <!-- Specular Highlight Curve -->
        <rect x="2" y="2" width="164" height="17" rx="8.5" fill="#ffffff" opacity="0.25"/>
        <text x="84" y="24" class="font-sans" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="0.4">${cfg.btn.text}</text>
      </g>

      <!-- Footer Micro Caption -->
      <g transform="translate(0, 192)">
        <text x="0" y="9" class="font-sans" font-size="8" font-weight="600" fill="${cfg.footerColor}" opacity="0.85">${cfg.footerNote}</text>
      </g>
    </g>

    <!-- Mini Wax Seal Accent (Top Right) -->
    <g transform="translate(346, 52) rotate(12)" filter="url(#${cfg.id}-polaroidShadow)">
      <circle cx="12" cy="12" r="13" fill="url(#${cfg.id}-sealGrad)"/>
      <circle cx="12" cy="12" r="10" fill="none" stroke="${cfg.seal.border}" stroke-width="0.8" stroke-dasharray="2 1.5"/>
      <text x="12" y="16" font-size="10" text-anchor="middle">${cfg.seal.emoji}</text>
    </g>
  </g>
</svg>
`;
}

for (const cfg of configs) {
  const svg = generateSvg(cfg);
  const outPath = `public/previews/${cfg.id}.svg`;
  fs.writeFileSync(outPath, svg, 'utf8');
  console.log(`Generated ${outPath} (${Buffer.byteLength(svg)} bytes)`);
}

console.log('All 9 SVGs generated successfully!');
