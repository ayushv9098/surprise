export const TEMPLATES = [
  // --- BOY BIRTHDAY TEMPLATES ---
  {
    id: 'royal-sapphire',
    name: 'Royal Sapphire',
    gender: 'boy',
    tag: 'Royal Blue & Crown',
    emoji: '👑',
    headline: 'For the King of the Day',
    description: 'Multi-scene experience, royal blue palette, star of the day polaroid, mood check, 3 reasons, 3D animated envelope.',
    fontFamily: 'font-cursive',
    accentColor: '#1D4ED8',
    themeClass: 'theme-royal',
    themeId: 'royal',
    gradientBg: 'from-blue-900 via-blue-800 to-indigo-950',
    primaryColor: 'blue',
    previewImage: '/previews/royal-sapphire.svg',
    badges: ['Multi-Scene Hit', 'Royal Favorite'],
    defaultOccasion: 'Happy Birthday to the King! 👑',
    defaultSubtitle: 'I have a small surprise for you...',
    defaultCaption: 'Keep Rocking Always! 👑🔥',
    ambientEmojis: ['⭐', '🦋', '👑', '🌹', '💫', '🎉', '💙', '✨'],
    waxColor: '#1D4ED8',
    waxEmoji: '👑',
    features: ['Star of the Day Polaroid', 'Mood Check Interaction', '3 Why You\'re Special Reasons', '3D Animated Envelope'],
    recommendedSongId: 'upbeat-birthday-reel',
    samplePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'golden-birthday',
    name: 'Golden Spark',
    gender: 'boy',
    tag: 'Champagne Gold & Spark',
    emoji: '🎂',
    headline: 'Make their special birthday shine like gold',
    description: 'Champagne gold, balloons, cake candles blow, gift unbox.',
    fontFamily: 'font-serif',
    accentColor: '#D97706',
    themeClass: 'theme-gold',
    themeId: 'gold',
    gradientBg: 'from-amber-50 via-yellow-50 to-orange-50',
    primaryColor: 'amber',
    previewImage: '/previews/golden-birthday.svg',
    badges: ['Trending', 'Celebration Hit'],
    defaultOccasion: 'Happy Birthday, Shining Star! 🎂✨',
    defaultSubtitle: 'May your year shine brighter than pure gold.',
    defaultCaption: 'Keep Shining Brighter Than Gold! 🎂✨',
    ambientEmojis: ['🎂', '✨', '🥂', '💛', '⭐', '🎉', '🌟', '💫'],
    waxColor: '#D97706',
    waxEmoji: '⭐',
    features: ['Confetti Cannon Burst', 'Interactive Gift Unboxing', 'Floating Balloons', 'Upbeat Birthday Beat'],
    recommendedSongId: 'upbeat-birthday-reel',
    samplePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'polaroid-scrapbook',
    name: 'Retro Polaroid',
    gender: 'boy',
    tag: 'Vintage Scrapbook & Memories',
    emoji: '📸',
    headline: 'Preserve cherished moments in timeless warmth',
    description: 'Vintage memory scrap, washi tapes, nostalgic music.',
    fontFamily: 'font-handwriting',
    accentColor: '#92400E',
    themeClass: 'theme-polaroid',
    themeId: 'polaroid',
    gradientBg: 'from-stone-50 via-amber-50/50 to-orange-50/30',
    primaryColor: 'stone',
    previewImage: '/previews/polaroid-scrapbook.svg',
    badges: ['Staff Pick', 'Aesthetic Nostalgia'],
    defaultOccasion: 'Chapters of Brotherhood 📸⚡',
    defaultSubtitle: 'Taped forever into the scrapbook of our greatest memories.',
    defaultCaption: 'Brothers & Besties For Life! 📸⚡',
    ambientEmojis: ['📸', '⚡', '🎞️', '📜', '🤎', '⭐', '✨', '☕'],
    waxColor: '#78350F',
    waxEmoji: '⚡',
    features: ['Polaroid Memory Gallery', 'Washi Tape Stickers', 'Handwritten Captions', 'Cozy Lofi Track'],
    recommendedSongId: 'bollywood-lofi-chill',
    samplePhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
  },

  // --- GIRL BIRTHDAY TEMPLATES ---
  {
    id: 'blush-rose',
    name: 'Blush Blossom',
    gender: 'girl',
    tag: 'Soft Romantic Rose & Petals',
    emoji: '🌸',
    headline: 'For the one who brings sunshine everywhere',
    description: 'Multi-scene experience, soft romantic pink/rose, star of the day polaroid, mood check, 3 reasons, wax sealed letter.',
    fontFamily: 'font-cursive',
    accentColor: '#F43F5E',
    themeClass: 'theme-blush',
    themeId: 'blush',
    gradientBg: 'from-rose-50 via-pink-50 to-amber-50',
    primaryColor: 'rose',
    previewImage: '/previews/blush-rose.svg',
    badges: ['Multi-Scene Hit', 'Most Popular'],
    defaultOccasion: 'Happy Birthday, Sunshine! 🌸',
    defaultSubtitle: 'I have a small surprise for you...',
    defaultCaption: 'Stay Wonderful Always! 🌸✨',
    ambientEmojis: ['🌸', '🦋', '👑', '🌹', '💫', '🎉', '💖', '✨'],
    waxColor: '#E11D48',
    waxEmoji: '🌸',
    features: ['Star of the Day Polaroid', 'Mood Check Interaction', '3 Why You\'re Special Reasons', 'Wax Sealed Letter'],
    recommendedSongId: 'insta-acoustic-romance',
    samplePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'princess-peach',
    name: 'Princess Peach',
    gender: 'girl',
    tag: 'Warm Peach Glow & Starlight',
    emoji: '✨',
    headline: 'A sparkling celebration for the birthday princess',
    description: 'Warm peach glow, floating sparkles, memory gallery.',
    fontFamily: 'font-serif',
    accentColor: '#EA580C',
    themeClass: 'theme-peach',
    themeId: 'peach',
    gradientBg: 'from-orange-50 via-rose-50 to-amber-50',
    primaryColor: 'orange',
    previewImage: '/previews/princess-peach.svg',
    badges: ['Sparkle Glow', 'Princess Favorite'],
    defaultOccasion: 'Happy Birthday Princess! ✨👑',
    defaultSubtitle: 'May your day sparkle brighter than fairy dust and starlight!',
    defaultCaption: 'May All Your Wishes Sparkle! ✨💖',
    ambientEmojis: ['✨', '🍑', '🌟', '🧡', '👑', '🎉', '💫', '🌸'],
    waxColor: '#EA580C',
    waxEmoji: '✨',
    features: ['Warm Peach Glow', 'Floating Sparkles', 'Memory Gallery', 'Gentle Melody'],
    recommendedSongId: 'insta-acoustic-romance',
    samplePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    gender: 'girl',
    tag: 'Dreamy Lilac & Fairy Magic',
    emoji: '💜',
    headline: 'Dreamy lilac fairy chimes and endless magic',
    description: 'Lilac pastel, floating butterflies, emotional envelope.',
    fontFamily: 'font-cursive',
    accentColor: '#8B5CF6',
    themeClass: 'theme-lavender',
    themeId: 'lavender',
    gradientBg: 'from-violet-50 via-purple-50 to-sky-50',
    primaryColor: 'purple',
    previewImage: '/previews/lavender-dream.svg',
    badges: ['Fairy Aesthetic', 'Dreamy Tones'],
    defaultOccasion: 'Happy Birthday, Lavender Dreamer! 💜',
    defaultSubtitle: 'Wishing you the gentlest magic, sweetest wishes, and endless happiness.',
    defaultCaption: 'Never Stop Dreaming Beautiful Dreams! 💜🦋',
    ambientEmojis: ['💜', '🦋', '🌙', '✨', '🔮', '🎉', '💫', '🌸'],
    waxColor: '#7C3AED',
    waxEmoji: '💜',
    features: ['Floating Butterflies', 'Emotional Envelope', 'Lilac Pastel Glow', 'Soft Guitar Melodies'],
    recommendedSongId: 'indie-acoustic-soul',
    samplePhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  },
];

/**
 * Backward compatibility aliases for legacy template IDs and theme IDs
 */
export const TEMPLATE_ALIASES = {
  'blush-romance': 'blush-rose',
  'heartfelt-apology': 'lavender-dream',
  'royal': 'royal-sapphire',
  'gold': 'golden-birthday',
  'polaroid': 'polaroid-scrapbook',
  'blush': 'blush-rose',
  'peach': 'princess-peach',
  'lavender': 'lavender-dream',
};

/**
 * Returns the complete theme configuration object for any template ID or theme ID.
 * Falls back to 'royal-sapphire' if the template is not found.
 *
 * @param {string} templateId
 * @returns {object} Complete theme configuration object
 */
export const getThemeConfig = (templateId) => {
  if (!templateId) return TEMPLATES[0];
  const targetId = TEMPLATE_ALIASES[templateId] || templateId;
  return TEMPLATES.find((t) => t.id === targetId || t.themeId === targetId) || TEMPLATES[0];
};

export const getTemplateById = (id) => {
  return getThemeConfig(id);
};

export const getTemplatesByGender = (gender) => {
  if (!gender) return TEMPLATES;
  return TEMPLATES.filter((t) => t.gender === gender);
};
