import fs from 'fs';
import path from 'path';

const base64Map = JSON.parse(fs.readFileSync('D:/avprojects/surprise-builder/public/previews/photos/base64-map.json', 'utf8'));

const configs = [
  // ==========================================
  // --- 1. ROYAL SAPPHIRE (Birthday Boy / King) ---
  // ==========================================
  {
    id: 'royal-sapphire',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#f8fbff' },
        { offset: '35%', color: '#e8f2fe' },
        { offset: '70%', color: '#deecff' },
        { offset: '100%', color: '#eff6ff' }
      ]
    },
    canvasGlow: { color: '#93c5fd', opacity: '0.45' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#f8fbff', opacity: '0.95' }
      ]
    },
    cardBorder: '#bfdbfe',
    cardShadowColor: '#1e3a8a',
    dots: ['#93c5fd', '#60a5fa', '#3b82f6'],
    badge: {
      bg: '#ffffff',
      border: '#bfdbfe',
      text: 'ROYAL SAPPHIRE EDITION 👑',
      color: '#1e40af'
    },
    dividerColor: '#dbeafe',
    polaroid: {
      bg: '#ffffff',
      border: '#bfdbfe',
      shadowColor: '#1e3a8a',
      tapeColor: '#60a5fa',
      overlayColor: '#1d4ed8',
      overlayOpacity: '0.06',
      caption: 'King Rohan 👑',
      captionColor: '#1e3a8a',
      subCaption: 'ROYAL CHAPTER',
      subCaptionColor: '#3b82f6'
    },
    tag: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      text: 'CELEBRATION MOMENT ⭐',
      color: '#1d4ed8'
    },
    headline1: 'Happy Birthday,',
    headline1Color: '#1e3a8a',
    headline2: 'Rohan! 👑🎉',
    headline2Color: '#2563eb',
    sub1: 'Today we celebrate the king,',
    sub2: 'the legend, the shining star!',
    subColor: '#334155',
    dividerLine: '#bfdbfe',
    dividerKnot: '#2563eb',
    btn: {
      grad: [
        { offset: '0%', color: '#3b82f6' },
        { offset: '50%', color: '#2563eb' },
        { offset: '100%', color: '#1d4ed8' }
      ],
      glowColor: '#2563eb',
      text: 'Tap to Open 🎁'
    },
    footerNote: '👑 Specially Crafted for King Rohan',
    footerColor: '#1e40af',
    seal: {
      grad: [
        { offset: '0%', color: '#60a5fa' },
        { offset: '50%', color: '#2563eb' },
        { offset: '100%', color: '#1e3a8a' }
      ],
      border: '#bfdbfe',
      emoji: '👑'
    },
    ambient: [
      { type: 'circle', cx: 30, cy: 35, r: 2.5, fill: '#3b82f6', opacity: 0.65 },
      { type: 'circle', cx: 370, cy: 45, r: 3, fill: '#f59e0b', opacity: 0.7 },
      { type: 'circle', cx: 20, cy: 245, r: 2, fill: '#2563eb', opacity: 0.6 },
      { type: 'circle', cx: 380, cy: 235, r: 2.5, fill: '#fbbf24', opacity: 0.7 },
      { type: 'text', x: 22, y: 155, text: '⭐', size: 14, opacity: 0.85 },
      { type: 'text', x: 366, y: 120, text: '👑', size: 15, opacity: 0.9 },
      { type: 'text', x: 364, y: 270, text: '✨', size: 15, opacity: 0.85 }
    ]
  },

  // ==========================================
  // --- 2. GOLDEN BIRTHDAY (Birthday Spark / Luxury) ---
  // ==========================================
  {
    id: 'golden-birthday',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#fffbeb' },
        { offset: '35%', color: '#fef3c7' },
        { offset: '75%', color: '#fed7aa' },
        { offset: '100%', color: '#fde68a' }
      ]
    },
    canvasGlow: { color: '#f59e0b', opacity: '0.3' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#fffdfa', opacity: '0.94' }
      ]
    },
    cardBorder: '#fde68a',
    cardShadowColor: '#78350f',
    dots: ['#fde68a', '#f59e0b', '#d97706'],
    badge: {
      bg: '#ffffff',
      border: '#fde68a',
      text: 'GOLDEN SPARK CELEBRATION ✨',
      color: '#b45309'
    },
    dividerColor: '#fef3c7',
    polaroid: {
      bg: '#ffffff',
      border: '#fef3c7',
      shadowColor: '#451a03',
      tapeColor: '#fbbf24',
      overlayColor: '#f59e0b',
      overlayOpacity: '0.06',
      caption: 'Golden Star 🌟',
      captionColor: '#78350f',
      subCaption: 'SPECIAL EDITION',
      subCaptionColor: '#d97706'
    },
    tag: {
      bg: '#fefce8',
      border: '#fef08a',
      text: 'PURE LUXURY MOMENT 🥂',
      color: '#ca8a04'
    },
    headline1: 'Happy Birthday,',
    headline1Color: '#78350f',
    headline2: 'Shining Star! 🎂✨',
    headline2Color: '#d97706',
    sub1: 'May your special year shine brighter',
    sub2: 'than all the stars in the sky!',
    subColor: '#713f12',
    dividerLine: '#fde68a',
    dividerKnot: '#d97706',
    btn: {
      grad: [
        { offset: '0%', color: '#fbbf24' },
        { offset: '50%', color: '#f59e0b' },
        { offset: '100%', color: '#d97706' }
      ],
      glowColor: '#f59e0b',
      text: 'Open Celebration 🍾'
    },
    footerNote: '✨ 24K Sparkles &amp; Birthday Joy',
    footerColor: '#b45309',
    seal: {
      grad: [
        { offset: '0%', color: '#fef08a' },
        { offset: '50%', color: '#f59e0b' },
        { offset: '100%', color: '#b45309' }
      ],
      border: '#fef08a',
      emoji: '✨'
    },
    ambient: [
      { type: 'circle', cx: 28, cy: 38, r: 2.5, fill: '#fbbf24', opacity: 0.7 },
      { type: 'circle', cx: 372, cy: 42, r: 3, fill: '#f59e0b', opacity: 0.65 },
      { type: 'circle', cx: 24, cy: 240, r: 2, fill: '#fde68a', opacity: 0.65 },
      { type: 'circle', cx: 378, cy: 238, r: 2.5, fill: '#fbbf24', opacity: 0.7 },
      { type: 'text', x: 20, y: 150, text: '🌟', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '🥂', size: 14, opacity: 0.8 },
      { type: 'text', x: 365, y: 268, text: '🎂', size: 15, opacity: 0.85 }
    ]
  },

  // ==========================================
  // --- 3. POLAROID SCRAPBOOK (Retro Polaroid 📸⚡) ---
  // ==========================================
  {
    id: 'polaroid-scrapbook',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#450a0a' },
        { offset: '40%', color: '#7f1d1d' },
        { offset: '80%', color: '#991b1b' },
        { offset: '100%', color: '#b91c1c' }
      ]
    },
    canvasGlow: { color: '#ef4444', opacity: '0.3' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#fff5f5', opacity: '0.94' }
      ]
    },
    cardBorder: '#fecaca',
    cardShadowColor: '#450a0a',
    dots: ['#fca5a5', '#f87171', '#ef4444'],
    badge: {
      bg: '#ffffff',
      border: '#fecaca',
      text: 'RETRO POLAROID SNAPSHOTS 📸',
      color: '#b91c1c'
    },
    dividerColor: '#fee2e2',
    polaroid: {
      bg: '#ffffff',
      border: '#fee2e2',
      shadowColor: '#450a0a',
      tapeColor: '#f87171',
      overlayColor: '#dc2626',
      overlayOpacity: '0.06',
      caption: 'Best Memories ⚡',
      captionColor: '#7f1d1d',
      subCaption: 'BROTHERHOOD &amp; JOY',
      subCaptionColor: '#ef4444'
    },
    tag: {
      bg: '#fef2f2',
      border: '#fecaca',
      text: 'VINTAGE MEMORY FILM 🎞️',
      color: '#dc2626'
    },
    headline1: 'Cheers to You,',
    headline1Color: '#7f1d1d',
    headline2: 'My Brother! ⚡🎉',
    headline2Color: '#dc2626',
    sub1: 'Through crazy adventures &amp; laughs,',
    sub2: 'another year stronger together!',
    subColor: '#991b1b',
    dividerLine: '#fecaca',
    dividerKnot: '#dc2626',
    btn: {
      grad: [
        { offset: '0%', color: '#f87171' },
        { offset: '50%', color: '#ef4444' },
        { offset: '100%', color: '#dc2626' }
      ],
      glowColor: '#ef4444',
      text: 'View All Snaps 📸'
    },
    footerNote: '⚡ Real Polaroids &amp; Timeless Memories',
    footerColor: '#b91c1c',
    seal: {
      grad: [
        { offset: '0%', color: '#fca5a5' },
        { offset: '50%', color: '#ef4444' },
        { offset: '100%', color: '#7f1d1d' }
      ],
      border: '#fecaca',
      emoji: '📸'
    },
    ambient: [
      { type: 'circle', cx: 32, cy: 38, r: 2.5, fill: '#f87171', opacity: 0.65 },
      { type: 'circle', cx: 374, cy: 46, r: 3, fill: '#ef4444', opacity: 0.65 },
      { type: 'circle', cx: 22, cy: 242, r: 2, fill: '#fca5a5', opacity: 0.65 },
      { type: 'circle', cx: 380, cy: 236, r: 2.5, fill: '#f87171', opacity: 0.65 },
      { type: 'text', x: 20, y: 152, text: '⚡', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 122, text: '📸', size: 14, opacity: 0.85 },
      { type: 'text', x: 364, y: 268, text: '🔥', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 4. BLUSH ROSE (Birthday Girl / Blossom) ---
  // ==========================================
  {
    id: 'blush-rose',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#fdf2f8' },
        { offset: '35%', color: '#fce7f3' },
        { offset: '75%', color: '#fbcfe8' },
        { offset: '100%', color: '#f472b6' }
      ]
    },
    canvasGlow: { color: '#ec4899', opacity: '0.25' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#fff5f9', opacity: '0.94' }
      ]
    },
    cardBorder: '#fbcfe8',
    cardShadowColor: '#831843',
    dots: ['#f472b6', '#ec4899', '#db2777'],
    badge: {
      bg: '#ffffff',
      border: '#fbcfe8',
      text: 'BLUSH BLOSSOM CELEBRATION 🌸',
      color: '#be185d'
    },
    dividerColor: '#fce7f3',
    polaroid: {
      bg: '#ffffff',
      border: '#fce7f3',
      shadowColor: '#500724',
      tapeColor: '#f472b6',
      overlayColor: '#db2777',
      overlayOpacity: '0.06',
      caption: 'Birthday Queen 🌸',
      captionColor: '#831843',
      subCaption: 'BLOSSOM CHAPTER',
      subCaptionColor: '#ec4899'
    },
    tag: {
      bg: '#fdf2f8',
      border: '#fbcfe8',
      text: 'ELEGANT BLOSSOMS ✨',
      color: '#db2777'
    },
    headline1: 'Happy Birthday,',
    headline1Color: '#831843',
    headline2: 'Beautiful Soul! 🌸💖',
    headline2Color: '#db2777',
    sub1: 'May your day bloom with endless',
    sub2: 'laughter, sweet love &amp; sunshine!',
    subColor: '#9d174d',
    dividerLine: '#fbcfe8',
    dividerKnot: '#db2777',
    btn: {
      grad: [
        { offset: '0%', color: '#f472b6' },
        { offset: '50%', color: '#ec4899' },
        { offset: '100%', color: '#db2777' }
      ],
      glowColor: '#ec4899',
      text: 'Open Bloom 🌷'
    },
    footerNote: '🌸 Fresh Petals &amp; Birthday Magic',
    footerColor: '#be185d',
    seal: {
      grad: [
        { offset: '0%', color: '#fbcfe8' },
        { offset: '50%', color: '#ec4899' },
        { offset: '100%', color: '#831843' }
      ],
      border: '#fbcfe8',
      emoji: '🌸'
    },
    ambient: [
      { type: 'circle', cx: 28, cy: 36, r: 2.5, fill: '#f472b6', opacity: 0.65 },
      { type: 'circle', cx: 372, cy: 44, r: 3, fill: '#ec4899', opacity: 0.65 },
      { type: 'circle', cx: 22, cy: 242, r: 2, fill: '#fbcfe8', opacity: 0.65 },
      { type: 'circle', cx: 378, cy: 238, r: 2.5, fill: '#f472b6', opacity: 0.65 },
      { type: 'text', x: 20, y: 150, text: '🌸', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '💖', size: 14, opacity: 0.85 },
      { type: 'text', x: 365, y: 268, text: '✨', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 5. PRINCESS PEACH (Birthday Peach / Joy) ---
  // ==========================================
  {
    id: 'princess-peach',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#fff7ed' },
        { offset: '35%', color: '#ffedd5' },
        { offset: '75%', color: '#fed7aa' },
        { offset: '100%', color: '#fb923c' }
      ]
    },
    canvasGlow: { color: '#f97316', opacity: '0.25' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#fffaf5', opacity: '0.94' }
      ]
    },
    cardBorder: '#fed7aa',
    cardShadowColor: '#7c2d12',
    dots: ['#fdba74', '#fb923c', '#f97316'],
    badge: {
      bg: '#ffffff',
      border: '#fed7aa',
      text: 'PRINCESS PEACH DREAMS 🍑',
      color: '#c2410c'
    },
    dividerColor: '#ffedd5',
    polaroid: {
      bg: '#ffffff',
      border: '#ffedd5',
      shadowColor: '#431407',
      tapeColor: '#fb923c',
      overlayColor: '#ea580c',
      overlayOpacity: '0.06',
      caption: 'Sweetest Smile ✨',
      captionColor: '#7c2d12',
      subCaption: 'PEACH ROYALE',
      subCaptionColor: '#f97316'
    },
    tag: {
      bg: '#fff7ed',
      border: '#fed7aa',
      text: 'SWEET &amp; RADIANT 👑',
      color: '#ea580c'
    },
    headline1: 'Happy Birthday,',
    headline1Color: '#7c2d12',
    headline2: 'Little Princess! 🍑✨',
    headline2Color: '#ea580c',
    sub1: 'Filled with sweetest warmth,',
    sub2: 'hugs, and magical surprise moments!',
    subColor: '#9a3412',
    dividerLine: '#fed7aa',
    dividerKnot: '#ea580c',
    btn: {
      grad: [
        { offset: '0%', color: '#fb923c' },
        { offset: '50%', color: '#f97316' },
        { offset: '100%', color: '#ea580c' }
      ],
      glowColor: '#f97316',
      text: 'Claim Your Crown 👑'
    },
    footerNote: '🍑 Pure Peach Elegance &amp; Royalty',
    footerColor: '#c2410c',
    seal: {
      grad: [
        { offset: '0%', color: '#fed7aa' },
        { offset: '50%', color: '#f97316' },
        { offset: '100%', color: '#7c2d12' }
      ],
      border: '#fed7aa',
      emoji: '👑'
    },
    ambient: [
      { type: 'circle', cx: 30, cy: 38, r: 2.5, fill: '#fb923c', opacity: 0.65 },
      { type: 'circle', cx: 372, cy: 44, r: 3, fill: '#f97316', opacity: 0.65 },
      { type: 'circle', cx: 22, cy: 242, r: 2, fill: '#fed7aa', opacity: 0.65 },
      { type: 'circle', cx: 378, cy: 238, r: 2.5, fill: '#fb923c', opacity: 0.65 },
      { type: 'text', x: 20, y: 150, text: '🍑', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '✨', size: 14, opacity: 0.85 },
      { type: 'text', x: 365, y: 268, text: '👑', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 6. LAVENDER DREAM (Birthday Serenity / Dream) ---
  // ==========================================
  {
    id: 'lavender-dream',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#faf5ff' },
        { offset: '35%', color: '#f3e8ff' },
        { offset: '75%', color: '#e9d5ff' },
        { offset: '100%', color: '#c084fc' }
      ]
    },
    canvasGlow: { color: '#a855f7', opacity: '0.25' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#faf7ff', opacity: '0.94' }
      ]
    },
    cardBorder: '#e9d5ff',
    cardShadowColor: '#581c87',
    dots: ['#d8b4fe', '#c084fc', '#a855f7'],
    badge: {
      bg: '#ffffff',
      border: '#e9d5ff',
      text: 'LAVENDER DREAMS &amp; WISHES 💜',
      color: '#7e22ce'
    },
    dividerColor: '#f3e8ff',
    polaroid: {
      bg: '#ffffff',
      border: '#f3e8ff',
      shadowColor: '#3b0764',
      tapeColor: '#c084fc',
      overlayColor: '#9333ea',
      overlayOpacity: '0.06',
      caption: 'Dreaming High 💜',
      captionColor: '#581c87',
      subCaption: 'LAVENDER CHAPTER',
      subCaptionColor: '#a855f7'
    },
    tag: {
      bg: '#faf5ff',
      border: '#e9d5ff',
      text: 'CELESTIAL SERENITY ✨',
      color: '#9333ea'
    },
    headline1: 'Happy Birthday,',
    headline1Color: '#581c87',
    headline2: 'Dreamer! 💜✨',
    headline2Color: '#9333ea',
    sub1: 'May peace, joy, and starlight',
    sub2: 'guide your brightest wishes today!',
    subColor: '#6b21a8',
    dividerLine: '#e9d5ff',
    dividerKnot: '#9333ea',
    btn: {
      grad: [
        { offset: '0%', color: '#c084fc' },
        { offset: '50%', color: '#a855f7' },
        { offset: '100%', color: '#9333ea' }
      ],
      glowColor: '#a855f7',
      text: 'Make a Wish 💫'
    },
    footerNote: '💜 Wrapped in Lavender Whispers',
    footerColor: '#7e22ce',
    seal: {
      grad: [
        { offset: '0%', color: '#e9d5ff' },
        { offset: '50%', color: '#a855f7' },
        { offset: '100%', color: '#581c87' }
      ],
      border: '#e9d5ff',
      emoji: '💜'
    },
    ambient: [
      { type: 'circle', cx: 30, cy: 38, r: 2.5, fill: '#c084fc', opacity: 0.65 },
      { type: 'circle', cx: 372, cy: 44, r: 3, fill: '#a855f7', opacity: 0.65 },
      { type: 'circle', cx: 22, cy: 242, r: 2, fill: '#e9d5ff', opacity: 0.65 },
      { type: 'circle', cx: 378, cy: 238, r: 2.5, fill: '#c084fc', opacity: 0.65 },
      { type: 'text', x: 20, y: 150, text: '💜', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '💫', size: 14, opacity: 0.85 },
      { type: 'text', x: 365, y: 268, text: '✨', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 7. VELVET ROMANCE (Romance) ---
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
  // --- 8. SUNSET ROMANCE (Romance) ---
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
    dots: ['#fbbf24', '#f59e0b', '#d97706'],
    badge: {
      bg: '#ffffff',
      border: '#fde68a',
      text: 'GOLDEN HOUR GLOW 🌅',
      color: '#b45309'
    },
    dividerColor: '#fef3c7',
    polaroid: {
      bg: '#ffffff',
      border: '#fef3c7',
      shadowColor: '#78350f',
      tapeColor: '#f59e0b',
      overlayColor: '#d97706',
      overlayOpacity: '0.07',
      caption: 'Golden Hour Smile 🌅',
      captionColor: '#92400e',
      subCaption: 'WARMTH &amp; AFFECTION',
      subCaptionColor: '#d97706'
    },
    tag: {
      bg: '#fffbeb',
      border: '#fde68a',
      text: 'ENDLESS HORIZON ☀️',
      color: '#d97706'
    },
    headline1: 'You are my',
    headline1Color: '#78350f',
    headline2: 'Golden Horizon! 🌅💛',
    headline2Color: '#d97706',
    sub1: 'Every sunset is sweeter with you,',
    sub2: 'my warmest safe haven.',
    subColor: '#92400e',
    dividerLine: '#fde68a',
    dividerKnot: '#d97706',
    btn: {
      grad: [
        { offset: '0%', color: '#f59e0b' },
        { offset: '50%', color: '#ea580c' },
        { offset: '100%', color: '#c2410c' }
      ],
      glowColor: '#ea580c',
      text: 'Open Golden Hour 🌅'
    },
    footerNote: '🌅 Stored in Warm Amber Radiance',
    footerColor: '#b45309',
    seal: {
      grad: [
        { offset: '0%', color: '#fef3c7' },
        { offset: '50%', color: '#f59e0b' },
        { offset: '100%', color: '#92400e' }
      ],
      border: '#fde68a',
      emoji: '🌅'
    },
    ambient: [
      { type: 'circle', cx: 30, cy: 35, r: 2.5, fill: '#f59e0b', opacity: 0.7 },
      { type: 'circle', cx: 368, cy: 45, r: 3, fill: '#fbbf24', opacity: 0.65 },
      { type: 'circle', cx: 18, cy: 240, r: 2, fill: '#fed7aa', opacity: 0.7 },
      { type: 'circle', cx: 380, cy: 235, r: 2.5, fill: '#f59e0b', opacity: 0.7 },
      { type: 'text', x: 22, y: 150, text: '☀️', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '✨', size: 14, opacity: 0.8 },
      { type: 'text', x: 365, y: 270, text: '🧡', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 9. CELESTIAL LOVE (Romance) ---
  // ==========================================
  {
    id: 'celestial-love',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#090d16' },
        { offset: '40%', color: '#0f172a' },
        { offset: '80%', color: '#1e1b4b' },
        { offset: '100%', color: '#312e81' }
      ]
    },
    canvasGlow: { color: '#6366f1', opacity: '0.35' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#f5f3ff', opacity: '0.94' }
      ]
    },
    cardBorder: '#c7d2fe',
    cardShadowColor: '#1e1b4b',
    dots: ['#a5b4fc', '#818cf8', '#6366f1'],
    badge: {
      bg: '#ffffff',
      border: '#c7d2fe',
      text: 'CELESTIAL INDIGO &amp; STARS 🌌',
      color: '#4338ca'
    },
    dividerColor: '#e0e7ff',
    polaroid: {
      bg: '#ffffff',
      border: '#e0e7ff',
      shadowColor: '#1e1b4b',
      tapeColor: '#818cf8',
      overlayColor: '#4338ca',
      overlayOpacity: '0.07',
      caption: 'Written in the Stars ✨',
      captionColor: '#312e81',
      subCaption: 'STARS &amp; INFINITY',
      subCaptionColor: '#6366f1'
    },
    tag: {
      bg: '#eef2ff',
      border: '#c7d2fe',
      text: 'COSMIC ROMANCE 🪐',
      color: '#4f46e5'
    },
    headline1: 'Written across',
    headline1Color: '#312e81',
    headline2: 'The Constellations! ✨🌌',
    headline2Color: '#4f46e5',
    sub1: 'Across galaxies and lifetimes,',
    sub2: 'my soul finds home in yours.',
    subColor: '#3730a3',
    dividerLine: '#c7d2fe',
    dividerKnot: '#4f46e5',
    btn: {
      grad: [
        { offset: '0%', color: '#818cf8' },
        { offset: '50%', color: '#6366f1' },
        { offset: '100%', color: '#4338ca' }
      ],
      glowColor: '#6366f1',
      text: 'Explore the Stars ✨'
    },
    footerNote: '🪐 Bound by Cosmic Destiny',
    footerColor: '#4338ca',
    seal: {
      grad: [
        { offset: '0%', color: '#c7d2fe' },
        { offset: '50%', color: '#6366f1' },
        { offset: '100%', color: '#312e81' }
      ],
      border: '#c7d2fe',
      emoji: '✨'
    },
    ambient: [
      { type: 'circle', cx: 32, cy: 35, r: 2.5, fill: '#818cf8', opacity: 0.75 },
      { type: 'circle', cx: 372, cy: 45, r: 3, fill: '#a5b4fc', opacity: 0.7 },
      { type: 'circle', cx: 20, cy: 242, r: 2, fill: '#6366f1', opacity: 0.7 },
      { type: 'circle', cx: 382, cy: 236, r: 2.5, fill: '#a5b4fc', opacity: 0.75 },
      { type: 'text', x: 20, y: 150, text: '⭐', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '🌌', size: 14, opacity: 0.8 },
      { type: 'text', x: 364, y: 270, text: '✨', size: 15, opacity: 0.85 }
    ]
  },

  // ==========================================
  // --- 10. VINTAGE KODAK (Scrapbook) ---
  // ==========================================
  {
    id: 'vintage-kodak',
    sprockets: true,
    canvasBg: {
      stops: [
        { offset: '0%', color: '#1c1917' },
        { offset: '40%', color: '#292524' },
        { offset: '80%', color: '#44403c' },
        { offset: '100%', color: '#1c1917' }
      ]
    },
    canvasGlow: { color: '#eab308', opacity: '0.28' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#fefce8', opacity: '0.94' }
      ]
    },
    cardBorder: '#fef08a',
    cardShadowColor: '#0c0a09',
    dots: ['#facc15', '#eab308', '#ca8a04'],
    badge: {
      bg: '#ffffff',
      border: '#fef08a',
      text: '35MM KODAK RETRO FILM 📸',
      color: '#a16207'
    },
    dividerColor: '#fef9c3',
    polaroid: {
      bg: '#ffffff',
      border: '#fef08a',
      shadowColor: '#1c1917',
      tapeColor: '#facc15',
      overlayColor: '#eab308',
      overlayOpacity: '0.07',
      caption: 'Roll #94: Moments 📸',
      captionColor: '#713f12',
      subCaption: '35MM ANALOG MEMORY',
      subCaptionColor: '#a16207'
    },
    tag: {
      bg: '#fefce8',
      border: '#fef08a',
      text: 'RETRO ARCHIVE 🎞️',
      color: '#a16207'
    },
    headline1: 'Captured forever on',
    headline1Color: '#713f12',
    headline2: 'Analog 35mm Gold! 📸💛',
    headline2Color: '#ca8a04',
    sub1: 'Grainy film and timeless smiles,',
    sub2: 'our memories never fade.',
    subColor: '#854d0e',
    dividerLine: '#fef08a',
    dividerKnot: '#ca8a04',
    btn: {
      grad: [
        { offset: '0%', color: '#facc15' },
        { offset: '50%', color: '#eab308' },
        { offset: '100%', color: '#ca8a04' }
      ],
      glowColor: '#eab308',
      text: 'Open Scrapbook 📸'
    },
    footerNote: '🎞️ ISO 400 • Authentic Warmth',
    footerColor: '#a16207',
    seal: {
      grad: [
        { offset: '0%', color: '#fef08a' },
        { offset: '50%', color: '#eab308' },
        { offset: '100%', color: '#713f12' }
      ],
      border: '#fef08a',
      emoji: '📸'
    },
    ambient: [
      { type: 'circle', cx: 32, cy: 35, r: 2.5, fill: '#facc15', opacity: 0.75 },
      { type: 'circle', cx: 372, cy: 45, r: 3, fill: '#fef08a', opacity: 0.7 },
      { type: 'circle', cx: 20, cy: 242, r: 2, fill: '#eab308', opacity: 0.7 },
      { type: 'circle', cx: 382, cy: 236, r: 2.5, fill: '#facc15', opacity: 0.75 },
      { type: 'text', x: 20, y: 150, text: '🎞️', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '📸', size: 14, opacity: 0.85 },
      { type: 'text', x: 364, y: 270, text: '✨', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 11. COZY MEMORIES (Scrapbook) ---
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
    canvasGlow: { color: '#ea580c', opacity: '0.22' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#fffaf5', opacity: '0.94' }
      ]
    },
    cardBorder: '#fed7aa',
    cardShadowColor: '#7c2d12',
    dots: ['#fb923c', '#f97316', '#ea580c'],
    badge: {
      bg: '#ffffff',
      border: '#fed7aa',
      text: 'COZY CAFE SUNSET ☕',
      color: '#c2410c'
    },
    dividerColor: '#ffedd5',
    polaroid: {
      bg: '#ffffff',
      border: '#fed7aa',
      shadowColor: '#431407',
      tapeColor: '#fb923c',
      overlayColor: '#ea580c',
      overlayOpacity: '0.06',
      caption: 'Warm Latte &amp; Chats ☕',
      captionColor: '#7c2d12',
      subCaption: 'COZY CHAPTER',
      subCaptionColor: '#c2410c'
    },
    tag: {
      bg: '#fff7ed',
      border: '#fed7aa',
      text: 'WARMTH &amp; WHISPERS 🍂',
      color: '#ea580c'
    },
    headline1: 'A quiet afternoon of',
    headline1Color: '#7c2d12',
    headline2: 'Warmth &amp; Memories ☕🍂',
    headline2Color: '#ea580c',
    sub1: 'Favorite sweaters, steam from mugs,',
    sub2: 'and heartfelt conversations.',
    subColor: '#9a3412',
    dividerLine: '#fed7aa',
    dividerKnot: '#ea580c',
    btn: {
      grad: [
        { offset: '0%', color: '#fb923c' },
        { offset: '50%', color: '#f97316' },
        { offset: '100%', color: '#ea580c' }
      ],
      glowColor: '#f97316',
      text: 'Open Memory Book 🌻'
    },
    footerNote: '☕ Hand-Poured Warmth &amp; Keepsakes',
    footerColor: '#c2410c',
    seal: {
      grad: [
        { offset: '0%', color: '#ffedd5' },
        { offset: '50%', color: '#ea580c' },
        { offset: '100%', color: '#7c2d12' }
      ],
      border: '#fed7aa',
      emoji: '☕'
    },
    ambient: [
      { type: 'circle', cx: 28, cy: 38, r: 2.5, fill: '#fb923c', opacity: 0.7 },
      { type: 'circle', cx: 372, cy: 44, r: 3, fill: '#f97316', opacity: 0.65 },
      { type: 'circle', cx: 22, cy: 242, r: 2, fill: '#fed7aa', opacity: 0.65 },
      { type: 'circle', cx: 378, cy: 238, r: 2.5, fill: '#fb923c', opacity: 0.7 },
      { type: 'text', x: 20, y: 150, text: '🍂', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '☕', size: 14, opacity: 0.85 },
      { type: 'text', x: 365, y: 268, text: '🌻', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 12. NEON NOSTALGIA (Scrapbook) ---
  // ==========================================
  {
    id: 'neon-nostalgia',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#030712' },
        { offset: '40%', color: '#0f172a' },
        { offset: '80%', color: '#134e4a' },
        { offset: '100%', color: '#042f2e' }
      ]
    },
    canvasGlow: { color: '#06b6d4', opacity: '0.35' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#f0fdfa', opacity: '0.94' }
      ]
    },
    cardBorder: '#99f6e4',
    cardShadowColor: '#042f2e',
    dots: ['#2dd4bf', '#14b8a6', '#0d9488'],
    badge: {
      bg: '#ffffff',
      border: '#99f6e4',
      text: 'ELECTRIC NOSTALGIA &amp; FLASH ⚡',
      color: '#0f766e'
    },
    dividerColor: '#ccfbf1',
    polaroid: {
      bg: '#ffffff',
      border: '#99f6e4',
      shadowColor: '#042f2e',
      tapeColor: '#2dd4bf',
      overlayColor: '#0d9488',
      overlayOpacity: '0.07',
      caption: 'City Nights &amp; Flash ⚡',
      captionColor: '#115e59',
      subCaption: 'CYBER ENERGY',
      subCaptionColor: '#0d9488'
    },
    tag: {
      bg: '#f0fdf4',
      border: '#99f6e4',
      text: 'NEON WAVE ⚡',
      color: '#0d9488'
    },
    headline1: 'Fast nights, loud laughs,',
    headline1Color: '#115e59',
    headline2: 'Pure Neon Energy! ⚡🌊',
    headline2Color: '#0d9488',
    sub1: 'Skateboards, streetlights, and',
    sub2: 'memories we will never forget.',
    subColor: '#134e4a',
    dividerLine: '#99f6e4',
    dividerKnot: '#0d9488',
    btn: {
      grad: [
        { offset: '0%', color: '#2dd4bf' },
        { offset: '50%', color: '#14b8a6' },
        { offset: '100%', color: '#0f766e' }
      ],
      glowColor: '#14b8a6',
      text: 'Play Memories ⚡'
    },
    footerNote: '⚡ Retro Flash &amp; Cyber Waves',
    footerColor: '#0f766e',
    seal: {
      grad: [
        { offset: '0%', color: '#99f6e4' },
        { offset: '50%', color: '#14b8a6' },
        { offset: '100%', color: '#042f2e' }
      ],
      border: '#99f6e4',
      emoji: '⚡'
    },
    ambient: [
      { type: 'circle', cx: 30, cy: 35, r: 2.5, fill: '#2dd4bf', opacity: 0.75 },
      { type: 'circle', cx: 372, cy: 45, r: 3, fill: '#99f6e4', opacity: 0.7 },
      { type: 'circle', cx: 20, cy: 242, r: 2, fill: '#14b8a6', opacity: 0.7 },
      { type: 'circle', cx: 382, cy: 236, r: 2.5, fill: '#2dd4bf', opacity: 0.75 },
      { type: 'text', x: 20, y: 150, text: '⚡', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '🌊', size: 14, opacity: 0.85 },
      { type: 'text', x: 364, y: 270, text: '🔥', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 13. GENTLE PEACE (Apology) ---
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
    canvasGlow: { color: '#22c55e', opacity: '0.2' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#f7fee7', opacity: '0.94' }
      ]
    },
    cardBorder: '#bbf7d0',
    cardShadowColor: '#14532d',
    dots: ['#86efac', '#4ade80', '#22c55e'],
    badge: {
      bg: '#ffffff',
      border: '#bbf7d0',
      text: 'OLIVE PEACE OFFERING 🕊️',
      color: '#15803d'
    },
    dividerColor: '#dcfce7',
    polaroid: {
      bg: '#ffffff',
      border: '#bbf7d0',
      shadowColor: '#14532d',
      tapeColor: '#86efac',
      overlayColor: '#16a34a',
      overlayOpacity: '0.06',
      caption: 'Heartfelt Peace 🕊️',
      captionColor: '#166534',
      subCaption: 'GENTLE EMBRACE',
      subCaptionColor: '#15803d'
    },
    tag: {
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: 'TRUTH &amp; CALM 🌿',
      color: '#16a34a'
    },
    headline1: 'From the bottom of',
    headline1Color: '#166534',
    headline2: 'My Open Heart 🕊️🌿',
    headline2Color: '#16a34a',
    sub1: 'I am truly sorry for my words,',
    sub2: 'you mean everything to me.',
    subColor: '#14532d',
    dividerLine: '#bbf7d0',
    dividerKnot: '#16a34a',
    btn: {
      grad: [
        { offset: '0%', color: '#86efac' },
        { offset: '50%', color: '#4ade80' },
        { offset: '100%', color: '#16a34a' }
      ],
      glowColor: '#22c55e',
      text: 'Read My Heart 🕊️'
    },
    footerNote: '🕊️ Offered with Humility &amp; Care',
    footerColor: '#15803d',
    seal: {
      grad: [
        { offset: '0%', color: '#dcfce7' },
        { offset: '50%', color: '#22c55e' },
        { offset: '100%', color: '#14532d' }
      ],
      border: '#bbf7d0',
      emoji: '🕊️'
    },
    ambient: [
      { type: 'circle', cx: 30, cy: 38, r: 2.5, fill: '#86efac', opacity: 0.65 },
      { type: 'circle', cx: 372, cy: 44, r: 3, fill: '#4ade80', opacity: 0.65 },
      { type: 'circle', cx: 22, cy: 242, r: 2, fill: '#bbf7d0', opacity: 0.65 },
      { type: 'circle', cx: 378, cy: 238, r: 2.5, fill: '#86efac', opacity: 0.65 },
      { type: 'text', x: 20, y: 150, text: '🌿', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '🕊️', size: 14, opacity: 0.85 },
      { type: 'text', x: 365, y: 268, text: '🌱', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 14. SWEET FORGIVE (Apology) ---
  // ==========================================
  {
    id: 'sweet-forgive',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#faf5ff' },
        { offset: '40%', color: '#f3e8ff' },
        { offset: '80%', color: '#e9d5ff' },
        { offset: '100%', color: '#d8b4fe' }
      ]
    },
    canvasGlow: { color: '#a855f7', opacity: '0.22' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#faf5ff', opacity: '0.94' }
      ]
    },
    cardBorder: '#e9d5ff',
    cardShadowColor: '#581c87',
    dots: ['#d8b4fe', '#c084fc', '#a855f7'],
    badge: {
      bg: '#ffffff',
      border: '#e9d5ff',
      text: 'SWEET HUGS &amp; UNDERSTANDING 🥺',
      color: '#7e22ce'
    },
    dividerColor: '#f3e8ff',
    polaroid: {
      bg: '#ffffff',
      border: '#e9d5ff',
      shadowColor: '#3b0764',
      tapeColor: '#c084fc',
      overlayColor: '#9333ea',
      overlayOpacity: '0.06',
      caption: 'Warmest Hugs 🥺',
      captionColor: '#581c87',
      subCaption: 'SOFTEST APOLOGY',
      subCaptionColor: '#7e22ce'
    },
    tag: {
      bg: '#faf5ff',
      border: '#e9d5ff',
      text: 'UNCONDITIONAL LOVE 💜',
      color: '#9333ea'
    },
    headline1: 'Can I wrap you in',
    headline1Color: '#581c87',
    headline2: 'The Warmest Hug? 🥺💜',
    headline2Color: '#9333ea',
    sub1: 'I never wanted to cause you pain,',
    sub2: 'you are my most precious person.',
    subColor: '#6b21a8',
    dividerLine: '#e9d5ff',
    dividerKnot: '#9333ea',
    btn: {
      grad: [
        { offset: '0%', color: '#c084fc' },
        { offset: '50%', color: '#a855f7' },
        { offset: '100%', color: '#7e22ce' }
      ],
      glowColor: '#a855f7',
      text: 'Open With Hugs 🥺'
    },
    footerNote: '💜 Teddy Hugs &amp; Honest Care',
    footerColor: '#7e22ce',
    seal: {
      grad: [
        { offset: '0%', color: '#f3e8ff' },
        { offset: '50%', color: '#a855f7' },
        { offset: '100%', color: '#581c87' }
      ],
      border: '#e9d5ff',
      emoji: '🥺'
    },
    ambient: [
      { type: 'circle', cx: 30, cy: 38, r: 2.5, fill: '#c084fc', opacity: 0.65 },
      { type: 'circle', cx: 372, cy: 44, r: 3, fill: '#a855f7', opacity: 0.65 },
      { type: 'circle', cx: 22, cy: 242, r: 2, fill: '#e9d5ff', opacity: 0.65 },
      { type: 'circle', cx: 378, cy: 238, r: 2.5, fill: '#c084fc', opacity: 0.65 },
      { type: 'text', x: 20, y: 150, text: '💜', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '🥺', size: 14, opacity: 0.85 },
      { type: 'text', x: 365, y: 268, text: '🧸', size: 15, opacity: 0.8 }
    ]
  },

  // ==========================================
  // --- 15. FRESH START (Apology) ---
  // ==========================================
  {
    id: 'fresh-start',
    canvasBg: {
      stops: [
        { offset: '0%', color: '#f0fdfa' },
        { offset: '40%', color: '#ccfbf1' },
        { offset: '80%', color: '#99f6e4' },
        { offset: '100%', color: '#5eead4' }
      ]
    },
    canvasGlow: { color: '#14b8a6', opacity: '0.22' },
    cardBg: {
      stops: [
        { offset: '0%', color: '#ffffff', opacity: '0.98' },
        { offset: '100%', color: '#f0fdfa', opacity: '0.94' }
      ]
    },
    cardBorder: '#99f6e4',
    cardShadowColor: '#134e4a',
    dots: ['#5eead4', '#2dd4bf', '#14b8a6'],
    badge: {
      bg: '#ffffff',
      border: '#99f6e4',
      text: 'SUNRISE RENEWAL &amp; HOPE 🌤️',
      color: '#0f766e'
    },
    dividerColor: '#ccfbf1',
    polaroid: {
      bg: '#ffffff',
      border: '#99f6e4',
      shadowColor: '#134e4a',
      tapeColor: '#2dd4bf',
      overlayColor: '#0f766e',
      overlayOpacity: '0.06',
      caption: 'A Fresh Dawn 🌤️',
      captionColor: '#115e59',
      subCaption: 'NEW HORIZON',
      subCaptionColor: '#0f766e'
    },
    tag: {
      bg: '#f0fdfa',
      border: '#99f6e4',
      text: 'BRIGHTER TOMORROW 🌅',
      color: '#0d9488'
    },
    headline1: 'Turning the page to',
    headline1Color: '#115e59',
    headline2: 'A Brand New Dawn! 🌤️🌱',
    headline2Color: '#0d9488',
    sub1: 'Let us leave yesterday behind and',
    sub2: 'grow something beautiful today.',
    subColor: '#134e4a',
    dividerLine: '#99f6e4',
    dividerKnot: '#0d9488',
    btn: {
      grad: [
        { offset: '0%', color: '#2dd4bf' },
        { offset: '50%', color: '#14b8a6' },
        { offset: '100%', color: '#0f766e' }
      ],
      glowColor: '#14b8a6',
      text: 'Begin Fresh Chapter 🌤️'
    },
    footerNote: '🌤️ Clean Slate &amp; Golden Sunlight',
    footerColor: '#0f766e',
    seal: {
      grad: [
        { offset: '0%', color: '#ccfbf1' },
        { offset: '50%', color: '#14b8a6' },
        { offset: '100%', color: '#134e4a' }
      ],
      border: '#99f6e4',
      emoji: '🌤️'
    },
    ambient: [
      { type: 'circle', cx: 30, cy: 38, r: 2.5, fill: '#2dd4bf', opacity: 0.65 },
      { type: 'circle', cx: 372, cy: 44, r: 3, fill: '#14b8a6', opacity: 0.65 },
      { type: 'circle', cx: 22, cy: 242, r: 2, fill: '#99f6e4', opacity: 0.65 },
      { type: 'circle', cx: 378, cy: 238, r: 2.5, fill: '#2dd4bf', opacity: 0.65 },
      { type: 'text', x: 20, y: 150, text: '🌱', size: 14, opacity: 0.8 },
      { type: 'text', x: 366, y: 120, text: '🌤️', size: 14, opacity: 0.85 },
      { type: 'text', x: 365, y: 268, text: '✨', size: 15, opacity: 0.8 }
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
  <g fill="#ffffff" opacity="0.18">
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

    <!-- Keepsake Button Gradient -->
    <linearGradient id="${cfg.id}-btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
${btnStops}
    </linearGradient>

    <!-- Wax Seal Gradient -->
    <linearGradient id="${cfg.id}-sealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
${sealStops}
    </linearGradient>

    <!-- Realistic Shadows -->
    <filter id="${cfg.id}-cardShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="${cfg.cardShadowColor}" flood-opacity="0.18"/>
    </filter>

    <filter id="${cfg.id}-polaroidShadow" x="-15%" y="-15%" width="130%" height="135%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="${cfg.polaroid.shadowColor}" flood-opacity="0.25"/>
    </filter>

    <filter id="${cfg.id}-btnGlow" x="-20%" y="-20%" width="140%" height="145%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="${cfg.btn.glowColor}" flood-opacity="0.45"/>
    </filter>

    <!-- Photo Clip Path with subtle rounded corners -->
    <clipPath id="${cfg.id}-photoClip">
      <rect width="118" height="126" rx="6"/>
    </clipPath>
  </defs>

  <!-- Canvas Surface Background -->
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
        <rect width="50" height="13" rx="2" fill="${cfg.polaroid.tapeColor}" opacity="0.88"/>
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
        <rect width="112" height="17" rx="8.5" fill="${cfg.tag.bg}" stroke="${cfg.tag.border}" stroke-width="1"/>
        <text x="56" y="11.5" class="font-sans" font-size="8" font-weight="700" fill="${cfg.tag.color}" text-anchor="middle" letter-spacing="0.4">${cfg.tag.text}</text>
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

const outDir = 'D:/avprojects/surprise-builder/public/previews';

for (const cfg of configs) {
  const svg = generateSvg(cfg);
  const outPath = path.join(outDir, `${cfg.id}.svg`);
  fs.writeFileSync(outPath, svg, 'utf8');
  console.log(`Generated ${cfg.id}.svg (${Buffer.byteLength(svg)} bytes)`);
}

console.log('All 15 SVGs generated successfully!');
