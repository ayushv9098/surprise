export const SAMPLE_PHOTOS = [
  {
    id: 'sample-1',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80',
    caption: 'The day we walked by the blooming garden 🌸',
    tag: 'Favorite Memory',
  },
  {
    id: 'sample-2',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
    caption: 'Chasing sunset hues by the shoreline 🌊',
    tag: 'Golden Hour',
  },
  {
    id: 'sample-3',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=700&q=80',
    caption: 'Our cozy corner cafe with two warm lattes ☕',
    tag: 'Weekend Dates',
  },
  {
    id: 'sample-4',
    url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=700&q=80',
    caption: 'That birthday cake celebration we laughed till 2 AM 🎂',
    tag: 'Pure Joy',
  },
];

export const TEMPLATE_PRESETS = {
  'blush-romance': {
    recipientName: 'Sarah',
    senderName: 'Alex',
    occasion: 'Happy 2nd Anniversary, My Love! 🌸',
    subtitle: '730 days of falling in love with your smile, over and over again.',
    photos: [
      {
        id: 'blush-p1',
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
        caption: 'The moment you smiled at me across the little café ✨',
        tag: 'First Spark',
      },
      {
        id: 'blush-p2',
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
        caption: 'Walking hand in hand through the garden blossoms 🌷',
        tag: 'Eternal Spring',
      },
      {
        id: 'blush-p3',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        caption: 'My favorite photo of you — effortlessly radiant 💖',
        tag: 'My World',
      },
    ],
    letter: {
      title: 'A note sealed with my entire heart...',
      content: `My dearest Sarah,\n\nFrom the moment you entered my life, ordinary Tuesdays became unforgettable adventures. Your kindness fills every corner of my heart, and your laugh is honestly my favorite song.\n\nThank you for holding my hand when things get chaotic and for always knowing how to make me smile with just one look. Happy Anniversary my love — here is to a million more sunsets together.\n\nForever & always,\nAlex ❤️`,
      sealEmoji: '💌',
      waxColor: '#E11D48',
    },
    quiz: {
      enabled: true,
      question: 'What is my absolute favorite thing about you?',
      options: [
        'The way your eyes crinkle when you laugh',
        'How passionately you talk about your dreams',
        'How you steal all the French fries',
        'All of the above & everything you are ❤️',
      ],
      correctIndex: 3,
      rewardTitle: 'Sweet Treat Unlocked! 🍫✨',
      rewardMessage: 'Show this secret screen to claim your favorite chocolate bar + warm bear hug tonight!',
    },
    scratchCard: {
      enabled: true,
      title: 'Scratch to reveal my secret promise ✨',
      hiddenSecret: 'Coupon for 1 spontaneous midnight ice-cream drive + unlimited forehead kisses whenever you want! Valid forever.',
    },
  },

  'golden-birthday': {
    recipientName: 'Kavya',
    senderName: 'Your Besties Club',
    occasion: 'Happy 24th Birthday Kavya! 🎂✨',
    subtitle: 'May this year shower you with endless adventures, golden memories, and zero bad hair days!',
    photos: [
      {
        id: 'gold-p1',
        url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        caption: 'Golden sparkles and confetti for the birthday queen! 🎉',
        tag: 'Birthday Vibes',
      },
      {
        id: 'gold-p2',
        url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
        caption: 'Delicious berry cake and endless giggles 🍰',
        tag: 'Sweet Moments',
      },
      {
        id: 'gold-p3',
        url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
        caption: 'Dancing into your happiest chapter yet 🎈',
        tag: 'Golden Year',
      },
    ],
    letter: {
      title: 'A golden wish for your special day...',
      content: `Dearest Kavya,\n\nYou bring so much sunshine, crazy laughter, and good energy wherever you go! On your 24th birthday, we just wanted to remind you how genuinely loved and cherished you are.\n\nKeep dreaming big, eating all the cake without counting calories, and shining brighter than everyone else in the room.\n\nLove always,\nYour forever cheerleaders 🥳💛`,
      sealEmoji: '🎂',
      waxColor: '#D97706',
    },
    quiz: {
      enabled: true,
      question: 'What is the birthday girl\'s ultimate superpower?',
      options: [
        'Finding the best food in any city',
        'Being the funniest storyteller in the group',
        'Lighting up any room in 3 seconds',
        'All of the above — she is unmatched! 👑',
      ],
      correctIndex: 3,
      rewardTitle: 'Birthday Treat Unlocked! 🍰🎁',
      rewardMessage: 'You unlocked a free Starbucks caramel macchiato paid by your crew this weekend!',
    },
    scratchCard: {
      enabled: true,
      title: 'Scratch for your birthday surprise 🎁',
      hiddenSecret: 'Your birthday gift is waiting for you in the living room closet behind the coats! Go unwrap it now! 🎁🎈',
    },
  },

  'polaroid-scrapbook': {
    recipientName: 'Rohan',
    senderName: 'Sneha',
    occasion: 'Chapters of Us: 5 Years of Brotherhood 📸',
    subtitle: 'From late-night college tea stalls to conquering life side by side.',
    photos: [
      {
        id: 'pol-p1',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
        caption: 'That unforgettable road trip through the misty hills 🚙',
        tag: 'Roadtrip 2023',
      },
      {
        id: 'pol-p2',
        url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
        caption: '3 AM project debugging fueled by cutting chai ☕',
        tag: 'College Days',
      },
      {
        id: 'pol-p3',
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
        caption: 'Laughing at jokes only the two of us understand ⚡',
        tag: 'Brothers for Life',
      },
    ],
    letter: {
      title: 'Memories penned down in ink...',
      content: `Hey brother,\n\nLooking back at these old polaroids reminded me how lucky I am to have a best friend who never gave up on me. Through all the goofy ideas, late-night talks, and career milestones, you\'ve always had my back.\n\nHere\'s to staying the same crazy dreamers even when we\'re old and gray.\n\nCheers,\nSneha 📸`,
      sealEmoji: '🎞️',
      waxColor: '#B45309',
    },
    quiz: {
      enabled: true,
      question: 'Which memorable trip was our biggest adventure?',
      options: [
        'The foggy hill station roadtrip',
        'The beach camp with burnt marshmallows',
        'The spontaneous 2 AM highway drive',
        'Every single time we hang out!',
      ],
      correctIndex: 3,
      rewardTitle: 'Bro-Code Reward Unlocked! 🍕🍻',
      rewardMessage: 'Dinner and unlimited peri-peri pizzas on me next Friday night!',
    },
    scratchCard: {
      enabled: true,
      title: 'Scratch for an insider memory 📸',
      hiddenSecret: 'Remember when we got completely drenched in the monsoon rain and still bought ice cream? Best memory ever.',
    },
  },

  'heartfelt-apology': {
    recipientName: 'Priya',
    senderName: 'Arjun',
    occasion: 'I am Truly Sorry, My Sweetheart 🥺',
    subtitle: 'You mean the absolute world to me, and hurting your feelings broke my heart.',
    photos: [
      {
        id: 'apology-p1',
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
        caption: 'I promise to always bring this warm smile back to your face 💜',
        tag: 'My Comfort',
      },
      {
        id: 'apology-p2',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        caption: 'Remember our peaceful beach walk? I want only peace for us 🌊',
        tag: 'Serenity',
      },
      {
        id: 'apology-p3',
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
        caption: 'No ego, no excuses — just you and me against the world 🤝',
        tag: 'Unbreakable',
      },
    ],
    letter: {
      title: 'From the deepest corner of my heart...',
      content: `Priya,\n\nI was careless with my words, and I hate knowing that I caused you pain or disappointment. You give me so much kindness, patience, and love every single day, and you deserve nothing less than complete respect and care.\n\nI am genuinely sorry. I listen, I understand, and I promise to be better. Please give this dummy one more chance to hug you tightly.\n\nWith all my love and regret,\nArjun 🥺💜`,
      sealEmoji: '🕊️',
      waxColor: '#7C3AED',
    },
    quiz: {
      enabled: true,
      question: 'Will you please forgive me and let me make it up to you?',
      options: [
        'Yes, because I love you!',
        'Yes, but you owe me sweet treats!',
        'Yes, come give me a tight hug right now!',
        'All of the above — you\'re forgiven! 🫂',
      ],
      correctIndex: 3,
      rewardTitle: 'Forgiveness Unlocked! 🫂✨',
      rewardMessage: 'Arjun owes Priya a warm bear hug + favorite dessert + a whole day of listening to her favorite playlist!',
    },
    scratchCard: {
      enabled: true,
      title: 'Scratch to reveal my earnest promise 🕊️',
      hiddenSecret: 'Promise: Whenever we disagree, I will pause, hold your hand, listen first, and never go to bed upset with you.',
    },
  },
};

export const getPresetForTemplate = (templateId) => {
  return TEMPLATE_PRESETS[templateId] || TEMPLATE_PRESETS['blush-romance'];
};
