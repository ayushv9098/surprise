export const SAMPLE_PHOTOS = [
  {
    id: 'sample-1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    caption: 'Keep Rocking Always! 👑🔥',
    tag: 'Star Photo',
  },
  {
    id: 'sample-2',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    caption: 'Stay Wonderful Always! 🌸✨',
    tag: 'Sweet Memory',
  },
  {
    id: 'sample-3',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    caption: 'May All Your Wishes Sparkle! ✨💖',
    tag: 'Celebration',
  },
  {
    id: 'sample-4',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    caption: 'Brothers & Besties For Life! 📸⚡',
    tag: 'Unbreakable',
  },
];

export const TEMPLATE_PRESETS = {
  // ==========================================
  // --- BIRTHDAY PRESETS (BOY) ---
  // ==========================================
  'royal-sapphire': {
    name: 'Royal Sapphire',
    themeId: 'royal',
    category: 'birthday',
    gender: 'boy',
    recipientName: 'Rohan',
    senderName: 'Alex',
    occasion: 'Happy Birthday to the King! 👑',
    subtitle: 'I have a small surprise for you...',
    heroPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Keep Rocking Always! 👑🔥',
    photos: [
      {
        id: 'royal-p1',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        caption: 'Keep Rocking Always! 👑🔥',
        tag: 'The Star',
      },
    ],
    specialReasons: [
      {
        icon: '💪',
        title: 'Lucky to Have You',
        desc: 'So grateful to have a brother like you in my corner every day!',
      },
      {
        icon: '⭐',
        title: 'Always There',
        desc: 'Always standing by my side with endless laughs and genuine support!',
      },
      {
        icon: '👑',
        title: 'Irreplaceable',
        desc: 'No one can ever match your incredible spirit and heart. A true champion!',
      },
    ],
    letter: {
      title: 'A Little Note For You',
      content: `Happy Birthday Rohan!\n\nYou bring so much energy, strength, and genuine happiness into the lives of everyone around you. Thank you for being someone I can always look up to and trust unconditionally.\n\nMay this year bring you all the grand achievements, good health, and joyful moments you deserve. Keep shining like a king! 👑✨`,
      signOff: 'With all my love & respect,\nAlex 👑',
      sealEmoji: '👑',
      waxColor: '#1D4ED8',
    },
    songId: 'upbeat-birthday-reel',
  },

  'golden-birthday': {
    name: 'Golden Spark',
    themeId: 'gold',
    category: 'birthday',
    gender: 'boy',
    recipientName: 'Rohan',
    senderName: 'Alex',
    occasion: 'Happy Birthday, Shining Star! 🎂✨',
    subtitle: 'May your year shine brighter than pure gold.',
    heroPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Keep Shining Brighter Than Gold! 🎂✨',
    photos: [
      {
        id: 'gold-p1',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        caption: 'Golden sparkles and confetti for the birthday king! 🎉',
        tag: 'Golden Star',
      },
    ],
    specialReasons: [
      {
        icon: '🌟',
        title: 'Golden Heart',
        desc: 'Your radiant kindness and golden energy brightens every room you step into!',
      },
      {
        icon: '🥂',
        title: 'Endless Cheers',
        desc: 'Every memory together feels like a grand celebration full of laughter and victory!',
      },
      {
        icon: '⭐',
        title: 'Pure Excellence',
        desc: 'You inspire everyone with your dedication, talent, and unforgettable charisma!',
      },
    ],
    letter: {
      title: 'A Little Note For You',
      content: `Dear Rohan,\n\nOn your golden day, wishing you the richest blessings, boundless joy, and success that shines brighter than gold! 🎂✨\n\nThank you for bringing so much golden warmth and celebration into every moment we share. Here's to making this year your most unforgettable chapter yet! 🥂🌟`,
      signOff: 'With love & cheers,\nAlex 🎂✨',
      sealEmoji: '⭐',
      waxColor: '#D97706',
    },
    songId: 'upbeat-birthday-reel',
  },

  'polaroid-scrapbook': {
    name: 'Retro Polaroid',
    themeId: 'polaroid',
    category: 'birthday',
    gender: 'boy',
    recipientName: 'Rohan',
    senderName: 'Alex',
    occasion: 'Chapters of Brotherhood 📸⚡',
    subtitle: 'Taped forever into the scrapbook of our greatest memories.',
    heroPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Brothers & Besties For Life! 📸⚡',
    photos: [
      {
        id: 'pol-p1',
        url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
        caption: 'Brothers & Besties For Life! 📸⚡',
        tag: 'Chapter 1',
      },
    ],
    specialReasons: [
      {
        icon: '🤝',
        title: 'Loyal Brotherhood',
        desc: 'Standing together through every laugh, victory, and unforgettable chapter!',
      },
      {
        icon: '⚡',
        title: 'Unmatched Energy',
        desc: 'From crazy ideas to unstoppable adventures, our vibe is completely one of a kind!',
      },
      {
        icon: '📸',
        title: 'Timeless Memories',
        desc: 'Every road trip, late-night chat, and memory taped forever into our story!',
      },
    ],
    letter: {
      title: 'A Little Note For You',
      content: `Dear Rohan,\n\nLooking back at every snapshot, adventure, and late-night laugh, I'm so grateful for our brotherhood and all the memories we share. 📸⚡\n\nYou bring unmatched loyalty, real energy, and genuine warmth into every day. Wishing you the happiest and most unforgettable birthday! ❤️⚡`,
      signOff: 'Always your brother,\nAlex 📸⚡',
      sealEmoji: '⚡',
      waxColor: '#E11D48',
    },
    songId: 'bollywood-lofi-chill',
  },

  // ==========================================
  // --- BIRTHDAY PRESETS (GIRL) ---
  // ==========================================
  'blush-rose': {
    name: 'Blush Blossom',
    themeId: 'blush',
    category: 'birthday',
    gender: 'girl',
    recipientName: 'Sarah',
    senderName: 'Elena',
    occasion: 'Happy Birthday, Sunshine! 🌸',
    subtitle: 'I have a small surprise for you...',
    heroPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Stay Wonderful Always! 🌸✨',
    photos: [
      {
        id: 'blush-p1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        caption: 'Stay Wonderful Always! 🌸✨',
        tag: 'Birthday Star',
      },
    ],
    specialReasons: [
      {
        icon: '🌸',
        title: 'Pure Sunshine',
        desc: 'The effortless way you turn every ordinary moment into joy!',
      },
      {
        icon: '✨',
        title: 'Gentle Soul',
        desc: 'The quiet kindness and sparkling positivity you share with everyone!',
      },
      {
        icon: '💖',
        title: 'Irreplaceable',
        desc: 'A truly irreplaceable friend whose presence makes everything brighter!',
      },
    ],
    letter: {
      title: 'A Little Note For You',
      content: `My dearest Sarah,\n\nFrom the moment you entered my life, ordinary days became unforgettable adventures. Your kindness fills every room, and your laugh is honestly my favorite sound.\n\nThank you for holding my hand when things get chaotic and for always knowing how to make me smile with just one look. Happy Birthday my sweet friend — here is to a million more sunsets together.\n\nForever & always,\nElena 💖`,
      signOff: 'Forever & always,\nElena 🌸',
      sealEmoji: '🌸',
      waxColor: '#E11D48',
    },
    songId: 'insta-acoustic-romance',
  },

  'princess-peach': {
    name: 'Princess Peach',
    themeId: 'peach',
    category: 'birthday',
    gender: 'girl',
    recipientName: 'Sarah',
    senderName: 'Elena',
    occasion: 'Happy Birthday Princess! ✨👑',
    subtitle: 'May your day sparkle brighter than fairy dust and starlight!',
    heroPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'May All Your Wishes Sparkle! ✨💖',
    photos: [
      {
        id: 'peach-p1',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        caption: 'May All Your Wishes Sparkle! ✨💖',
        tag: 'Peach Glow',
      },
    ],
    specialReasons: [
      {
        icon: '✨',
        title: 'Magical Vibe',
        desc: 'You bring elegance, warmth, and sparkling wonder wherever you go.',
      },
      {
        icon: '👑',
        title: 'Grace & Poise',
        desc: 'A true princess at heart with boundless compassion for everyone.',
      },
      {
        icon: '🍑',
        title: 'Sweetest Smile',
        desc: 'Your smile radiates so much comfort and cheerful peach glow.',
      },
    ],
    letter: {
      title: 'A Little Note For You',
      content: `Dearest Sarah,\n\nToday is all about celebrating the royalty that you are! May this upcoming year grant you all the royal wishes of your heart, surround you with genuine warmth, and sprinkle magic into every morning.\n\nKeep shining your gorgeous sparkle!\n\nLove always,\nElena ✨👑`,
      signOff: 'With endless love,\nElena ✨',
      sealEmoji: '✨',
      waxColor: '#EA580C',
    },
    songId: 'insta-acoustic-romance',
  },

  'lavender-dream': {
    name: 'Lavender Dream',
    themeId: 'lavender',
    category: 'birthday',
    gender: 'girl',
    recipientName: 'Sarah',
    senderName: 'Elena',
    occasion: 'Happy Birthday, Lavender Dreamer! 💜',
    subtitle: 'Wishing you the gentlest magic, sweetest wishes, and endless happiness.',
    heroPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Never Stop Dreaming Beautiful Dreams! 💜🦋',
    photos: [
      {
        id: 'lavender-p1',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        caption: 'Never Stop Dreaming Beautiful Dreams! 💜🦋',
        tag: 'Lavender Bliss',
      },
    ],
    specialReasons: [
      {
        icon: '💜',
        title: 'Deep Empathy',
        desc: 'You listen with your whole heart and make everyone feel valued.',
      },
      {
        icon: '🦋',
        title: 'Free Spirit',
        desc: 'Your creative soul and gentle elegance make you truly one of a kind.',
      },
      {
        icon: '🕊️',
        title: 'Calming Presence',
        desc: 'Being around you feels like a peaceful sanctuary of love and warmth.',
      },
    ],
    letter: {
      title: 'A Little Note For You',
      content: `Sweet Sarah,\n\nYou have such a poetic, gentle soul that heals people just by being present. On your birthday, I pray that life returns all the kindness, love, and sweet dreams you give so freely to others.\n\nHave the most enchanting birthday celebration ever!\n\nWith all my love,\nElena 💜🦋`,
      signOff: 'With all my heart,\nElena 💜',
      sealEmoji: '💜',
      waxColor: '#7C3AED',
    },
    songId: 'indie-acoustic-soul',
  },

  // ==========================================
  // --- ROMANCE PRESETS (LOVE & ANNIVERSARY) ---
  // ==========================================
  'velvet-romance': {
    name: 'Velvet Rose',
    themeId: 'velvet-romance',
    category: 'romance',
    gender: 'boy',
    recipientName: 'Maya',
    senderName: 'Liam',
    occasion: 'Happy Anniversary, My Love! ❤️',
    subtitle: 'Every single second with you is my favorite memory.',
    heroPhoto: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Forever & Always With You! ❤️🌹',
    photos: [
      {
        id: 'vr-p1',
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
        caption: 'Forever & Always With You! ❤️🌹',
        tag: 'Our Beginning',
      },
      {
        id: 'vr-p2',
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
        caption: 'Every laugh is sweeter by your side 🌹',
        tag: 'Pure Love',
      },
    ],
    specialReasons: [
      {
        icon: '❤️',
        title: 'My Whole World',
        desc: 'The effortless way you make every single day feel warm, magical, and full of peace.',
      },
      {
        icon: '🌹',
        title: 'Unconditional Grace',
        desc: 'Your gentle heart and the endless kindness you share with everyone around you.',
      },
      {
        icon: '💍',
        title: 'Forever Partner',
        desc: 'Through every twist, journey, and victory, I choose you again and again every day.',
      },
    ],
    letter: {
      title: 'To My One & Only',
      content: `My Love,\n\nLooking back at our journey, every single second with you is my absolute favorite memory. You bring warmth, laughter, and an unspoken comfort into my life that nothing else could ever replace.\n\nThank you for choosing me, for holding my hand through everything, and for filling my heart with pure romance and peace. Here is to our forever.\n\nHappy Anniversary, my soulmate! ❤️🌹`,
      signOff: 'Forever yours,\nLiam ❤️',
      sealEmoji: '❤️',
      waxColor: '#E11D48',
    },
    songId: 'insta-acoustic-romance',
  },

  'sunset-romance': {
    name: 'Sunset Glow',
    themeId: 'sunset-romance',
    category: 'romance',
    gender: 'girl',
    recipientName: 'Chloe',
    senderName: 'Julian',
    occasion: 'You Are My Golden Hour 🌅✨',
    subtitle: 'From our very first hello to forever and beyond.',
    heroPhoto: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'My Sun, My Moon & All My Stars! 🌅✨',
    photos: [
      {
        id: 'sr-p1',
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
        caption: 'My Sun, My Moon & All My Stars! 🌅✨',
        tag: 'Golden Hour',
      },
    ],
    specialReasons: [
      {
        icon: '🌅',
        title: 'Golden Warmth',
        desc: 'Your radiant smile brings golden hour warmth into my life no matter the season.',
      },
      {
        icon: '✨',
        title: 'Guiding Star',
        desc: 'You are the calm in my storm and the brightest light guiding me forward.',
      },
      {
        icon: '🥂',
        title: 'Endless Cheers',
        desc: 'To all our sunset talks, stolen kisses, and the thousands of tomorrows waiting for us.',
      },
    ],
    letter: {
      title: 'To My Golden Horizon',
      content: `Dearest Chloe,\n\nFrom the moment you smiled at me, my world lit up like a breathtaking sunset. You are my calm sanctuary, my favorite adventure, and my golden hour every single day.\n\nThank you for being the sweetest part of my days and for filling our home with laughter and tenderness. I adore you beyond words.\n\nAlways & always, 🌅✨`,
      signOff: 'All my love,\nJulian 🌅✨',
      sealEmoji: '✨',
      waxColor: '#D97706',
    },
    songId: 'insta-acoustic-romance',
  },

  'celestial-love': {
    name: 'Celestial Indigo',
    themeId: 'celestial-love',
    category: 'romance',
    recipientName: 'Aria',
    senderName: 'Noah',
    occasion: 'Written in the Stars 🌌💫',
    subtitle: 'In a world of eight billion, it was always only you.',
    heroPhoto: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Our Love Across the Cosmos! 🌌💫',
    photos: [
      {
        id: 'cl-p1',
        url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
        caption: 'Our Love Across the Cosmos! 🌌💫',
        tag: 'Infinite Galaxy',
      },
    ],
    specialReasons: [
      {
        icon: '🌌',
        title: 'Cosmic Connection',
        desc: 'Our souls connected as if we had known each other across a thousand lifetimes.',
      },
      {
        icon: '🌙',
        title: 'Midnight Peace',
        desc: 'Whenever the world gets loud, being in your arms feels like stillness under the stars.',
      },
      {
        icon: '💫',
        title: 'Written Destiny',
        desc: 'Out of eight billion people on Earth, meeting you was my universe\'s greatest gift.',
      },
    ],
    letter: {
      title: 'Written in the Constellations',
      content: `My beloved Aria,\n\nThey say the odds of finding your true soulmate are one in a billion. But from the first second our eyes met, I knew our love was written in the stars long before we ever arrived.\n\nThank you for your infinite kindness, your breathtaking grace, and for loving me completely. May our love continue shining brighter than every constellation in the night sky. 🌌💫`,
      signOff: 'Across the stars forever,\nNoah 🌙',
      sealEmoji: '🌙',
      waxColor: '#4F46E5',
    },
    songId: 'indie-acoustic-soul',
  },

  // ==========================================
  // --- SCRAPBOOK PRESETS (MEMORY SCRAPBOOK) ---
  // ==========================================
  'vintage-kodak': {
    name: 'Vintage Kodak',
    themeId: 'vintage-kodak',
    category: 'scrapbook',
    recipientName: 'Kabir',
    senderName: 'Samir',
    occasion: 'Chapters of Our Timeless Journey 📸🎞️',
    subtitle: 'Taped forever into the scrapbook of our greatest adventures.',
    heroPhoto: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Moments Captured For Eternity! 📸🎞️',
    photos: [
      {
        id: 'vk-p1',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
        caption: 'Moments Captured For Eternity! 📸🎞️',
        tag: 'Timeless 35mm',
      },
    ],
    specialReasons: [
      {
        icon: '🎞️',
        title: 'Unfiltered Memories',
        desc: 'From candid road trips to hilarious mistakes, every memory with you is pure gold.',
      },
      {
        icon: '📸',
        title: 'Always in Focus',
        desc: 'No matter how much time passes, our friendship picks right back up without missing a beat.',
      },
      {
        icon: '⚡',
        title: 'Legendary Tales',
        desc: 'We have built a lifetime of stories that we will still be laughing about fifty years from now!',
      },
    ],
    letter: {
      title: 'A Scrapbook of Brotherhood',
      content: `Dear Kabir,\n\nFlipping through these snapshots and memories reminds me how lucky I am to have a brother like you. Through every wild road trip, late-night tea, and big milestone, you have been a constant rock.\n\nThank you for being genuine, hilarious, and always having my back. Here is to preserving all our timeless chapters and building a hundred more! 📸🎞️`,
      signOff: 'Brothers for life,\nSamir ⚡',
      sealEmoji: '⚡',
      waxColor: '#B45309',
    },
    songId: 'bollywood-lofi-chill',
  },

  'neon-nostalgia': {
    name: 'Electric Vibes',
    themeId: 'neon-nostalgia',
    category: 'scrapbook',
    recipientName: 'Arjun',
    senderName: 'Dev',
    occasion: 'Brothers & Partners in Crime ⚡🔥',
    subtitle: 'To the crazy stories and legendary adventures we share.',
    heroPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Unstoppable Energy & Brotherhood! ⚡🤙',
    photos: [
      {
        id: 'nn-p1',
        url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
        caption: 'Unstoppable Energy & Brotherhood! ⚡🤙',
        tag: 'Partner in Crime',
      },
    ],
    specialReasons: [
      {
        icon: '⚡',
        title: 'Electric Energy',
        desc: 'Whenever we team up, there is zero hesitation and 100% unstoppable momentum!',
      },
      {
        icon: '🔥',
        title: 'Wildest Adventures',
        desc: 'From midnight drives to spontaneous plans, you make life ten times more exciting!',
      },
      {
        icon: '🤙',
        title: 'Loyal to the Core',
        desc: 'A real brother who shows up without questions whenever it counts most.',
      },
    ],
    letter: {
      title: 'To My Partner in Crime',
      content: `Yo Arjun!\n\nLife is never boring when you are around. From our craziest ideas to the unforgettable wins, our brotherhood has been nothing short of electric. ⚡🔥\n\nThanks for keeping the energy high, laughing off the chaos, and being the most reliable brother anyone could ask for. Let's keep making legendary memories!\n\nStay electric! 🤙⚡`,
      signOff: 'Unstoppable always,\nDev ⚡🔥',
      sealEmoji: '🔥',
      waxColor: '#0F766E',
    },
    songId: 'bollywood-lofi-chill',
  },

  'cozy-memories': {
    name: 'Cozy Sunset',
    themeId: 'cozy-memories',
    category: 'scrapbook',
    recipientName: 'Tara',
    senderName: 'Meera',
    occasion: 'Grateful For Every Memory 🌻☕',
    subtitle: 'Some friendships don\'t fade, they only turn into gold.',
    heroPhoto: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Laughter, Coffee & Timeless Talks! ☕🌻',
    photos: [
      {
        id: 'cm-p1',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
        caption: 'Laughter, Coffee & Timeless Talks! ☕🌻',
        tag: 'Cozy Moments',
      },
    ],
    specialReasons: [
      {
        icon: '☕',
        title: 'Comforting Warmth',
        desc: 'Sitting with you over coffee feels like a warm hug for the soul every single time.',
      },
      {
        icon: '🌻',
        title: 'Golden Kindness',
        desc: 'You nurture everyone around you with gentle empathy and radiant encouragement.',
      },
      {
        icon: '🍂',
        title: 'Timeless Connection',
        desc: 'Seasons come and go, but the bond we share only grows richer and warmer with time.',
      },
    ],
    letter: {
      title: 'A Cup of Warm Gratitude',
      content: `Dearest Tara,\n\nSome friendships are like a warm cup of coffee on a crisp morning — comforting, grounding, and pure bliss. That is exactly what your friendship means to me.\n\nThank you for every deep conversation, every burst of spontaneous laughter, and for being someone I can share both my dreams and silence with. Grateful for you today and always! 🌻☕`,
      signOff: 'Warmest hugs,\nMeera 🌻',
      sealEmoji: '🌻',
      waxColor: '#C2410C',
    },
    songId: 'indie-acoustic-soul',
  },

  // ==========================================
  // --- APOLOGY PRESETS (HEARTFELT APOLOGY) ---
  // ==========================================
  'gentle-peace': {
    name: 'Olive Peace',
    themeId: 'gentle-peace',
    category: 'apology',
    recipientName: 'Nisha',
    senderName: 'Rohan',
    occasion: 'Can We Make Up? Truly Sorry 🕊️🤍',
    subtitle: 'I made a mistake, and your happiness means everything to me.',
    heroPhoto: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Our Bond Means Everything to Me! 🕊️🤍',
    photos: [
      {
        id: 'gp-p1',
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
        caption: 'Our Bond Means Everything to Me! 🕊️🤍',
        tag: 'Peace Treaty',
      },
    ],
    specialReasons: [
      {
        icon: '🕊️',
        title: 'Honest Heart',
        desc: 'I acknowledge my mistake completely, without excuses, because you deserve honesty.',
      },
      {
        icon: '🤍',
        title: 'Cherished Bond',
        desc: 'Our friendship is too precious to ever let misunderstanding or ego stand in the way.',
      },
      {
        icon: '🌿',
        title: 'Promise of Care',
        desc: 'I promise to listen more attentively and protect your peace and trust with all my heart.',
      },
    ],
    letter: {
      title: 'A Sincere Peace Offering',
      content: `Dear Nisha,\n\nI want to apologize from the bottom of my heart. I made a mistake, and knowing that I caused you hurt or disappointment weighs heavily on me.\n\nYour happiness and our bond mean far more to me than being right. I truly value everything we have built, and I hope you can find it in your heart to forgive me. Whenever you are ready, I would love to talk and make things right.\n\nWith sincere remorse and love, 🕊️🤍`,
      signOff: 'Truly sorry,\nRohan 🕊️',
      sealEmoji: '🕊️',
      waxColor: '#15803D',
    },
    songId: 'indie-acoustic-soul',
  },

  'sweet-forgive': {
    name: 'Sweet Hugs',
    themeId: 'sweet-forgive',
    category: 'apology',
    recipientName: 'Ananya',
    senderName: 'Kabir',
    occasion: 'Forgive Me Please? Infinite Hugs 🥺💜',
    subtitle: 'I miss your smile so much. Please let me make things right.',
    heroPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Infinite Hugs & A Truly Sorry Heart! 🥺💜',
    photos: [
      {
        id: 'sf-p1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        caption: 'Infinite Hugs & A Truly Sorry Heart! 🥺💜',
        tag: 'Infinite Hugs',
      },
    ],
    specialReasons: [
      {
        icon: '🥺',
        title: 'Missing Your Smile',
        desc: 'My days feel so incomplete without your cheerful laughter and sweet jokes.',
      },
      {
        icon: '💜',
        title: 'Truly Regretful',
        desc: 'I never meant to hurt you, and I am genuinely sorry for my thoughtlessness.',
      },
      {
        icon: '🧸',
        title: 'Infinite Hugs',
        desc: 'Sending you the biggest, warmest teddy bear hugs until we can laugh together again.',
      },
    ],
    letter: {
      title: 'An Apology With Infinite Hugs',
      content: `Dearest Ananya,\n\nI am so truly sorry for messing up. Seeing you upset is the last thing I would ever want, and not talking to you normally feels awful.\n\nYou bring so much sweetness and light into my world, and I promise to be much more mindful and caring. Please forgive me? Here is an infinite coupon for warm hugs, favorite treats, and whatever it takes to bring that beautiful smile back! 🥺💜`,
      signOff: 'With endless sorry hugs,\nKabir 💜',
      sealEmoji: '💜',
      waxColor: '#7C3AED',
    },
    songId: 'indie-acoustic-soul',
  },

  'fresh-start': {
    name: 'Sunrise Renewal',
    themeId: 'fresh-start',
    category: 'apology',
    recipientName: 'Aryan',
    senderName: 'Sameer',
    occasion: 'A Fresh Chapter Together 🌤️💛',
    subtitle: 'Nothing is worth losing the beautiful bond we have built.',
    heroPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    photoCaption: 'Turning the Page with Warmth & Love! 🌤️💛',
    photos: [
      {
        id: 'fs-p1',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        caption: 'Turning the Page with Warmth & Love! 🌤️💛',
        tag: 'New Beginning',
      },
    ],
    specialReasons: [
      {
        icon: '🌤️',
        title: 'Sunrise Renewal',
        desc: 'Every sunrise offers a chance to wipe the slate clean and start anew with fresh warmth.',
      },
      {
        icon: '💛',
        title: 'Golden Brotherhood',
        desc: 'The years of loyalty and respect we share are way too valuable to lose over friction.',
      },
      {
        icon: '🌱',
        title: 'Growing Stronger',
        desc: 'True bonds don\'t break under strain — they heal, grow deeper, and become unbreakable.',
      },
    ],
    letter: {
      title: 'Turning the Page',
      content: `Dear Aryan,\n\nI've been reflecting on everything, and I wanted to reach out with an open heart. We've built too much genuine respect and shared history to let misunderstanding linger between us.\n\nI take full responsibility for my part, and I want nothing more than to clear the air, put this behind us, and turn the page together. Let's start fresh like the morning sunrise.\n\nAlways your brother, 🌤️💛`,
      signOff: 'With warmth & respect,\nSameer 🌤️',
      sealEmoji: '🌤️',
      waxColor: '#D97706',
    },
    songId: 'indie-acoustic-soul',
  },
};

// ==========================================
// --- ALIASES FOR LEGACY PRESETS & THEME IDS ---
// ==========================================
TEMPLATE_PRESETS['blush-romance'] = TEMPLATE_PRESETS['velvet-romance'];
TEMPLATE_PRESETS['heartfelt-apology'] = TEMPLATE_PRESETS['gentle-peace'];
TEMPLATE_PRESETS['royal'] = TEMPLATE_PRESETS['royal-sapphire'];
TEMPLATE_PRESETS['gold'] = TEMPLATE_PRESETS['golden-birthday'];
TEMPLATE_PRESETS['polaroid'] = TEMPLATE_PRESETS['polaroid-scrapbook'];
TEMPLATE_PRESETS['blush'] = TEMPLATE_PRESETS['blush-rose'];
TEMPLATE_PRESETS['peach'] = TEMPLATE_PRESETS['princess-peach'];
TEMPLATE_PRESETS['lavender'] = TEMPLATE_PRESETS['lavender-dream'];

// Romance Aliases
TEMPLATE_PRESETS['velvet'] = TEMPLATE_PRESETS['velvet-romance'];
TEMPLATE_PRESETS['sunset'] = TEMPLATE_PRESETS['sunset-romance'];
TEMPLATE_PRESETS['celestial'] = TEMPLATE_PRESETS['celestial-love'];

// Scrapbook Aliases
TEMPLATE_PRESETS['vintage'] = TEMPLATE_PRESETS['vintage-kodak'];
TEMPLATE_PRESETS['neon'] = TEMPLATE_PRESETS['neon-nostalgia'];
TEMPLATE_PRESETS['cozy'] = TEMPLATE_PRESETS['cozy-memories'];

// Apology Aliases
TEMPLATE_PRESETS['olive'] = TEMPLATE_PRESETS['gentle-peace'];
TEMPLATE_PRESETS['peace'] = TEMPLATE_PRESETS['gentle-peace'];
TEMPLATE_PRESETS['forgive'] = TEMPLATE_PRESETS['sweet-forgive'];
TEMPLATE_PRESETS['sunrise'] = TEMPLATE_PRESETS['fresh-start'];

export const getPresetForTemplate = (templateId) => {
  return TEMPLATE_PRESETS[templateId] || TEMPLATE_PRESETS['royal-sapphire'];
};
