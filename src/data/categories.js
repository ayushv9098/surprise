export const CATEGORIES = [
  {
    id: 'birthday',
    name: 'Birthday Celebration',
    emoji: '🎂',
    description: 'Milestones, cake, confetti & keepsake surprises',
    hasGender: true,
    defaultTemplates: {
      boy: 'royal-sapphire',
      girl: 'blush-rose',
    },
    accent: '#E8364E',
    tag: 'Popular',
  },
  {
    id: 'romance',
    name: 'Love & Anniversary',
    emoji: '🌸',
    description: 'Anniversaries, crush keepsakes & sweet sealed letters',
    hasGender: true,
    defaultTemplates: {
      boy: 'royal-sapphire',
      girl: 'blush-rose',
    },
    accent: '#F43F5E',
    tag: 'Romantic',
  },
  {
    id: 'scrapbook',
    name: 'Memory Scrapbook',
    emoji: '📸',
    description: 'Cherished memories, trips & friendship nostalgia',
    hasGender: false,
    defaultTemplate: 'polaroid-scrapbook',
    accent: '#059669',
    tag: 'Memories',
  },
  {
    id: 'apology',
    name: 'Heartfelt Apology',
    emoji: '🥺',
    description: 'Peace treaties, sweet apologies & forgive-me surprises',
    hasGender: false,
    defaultTemplate: 'lavender-dream',
    accent: '#8B5CF6',
    tag: 'Heartfelt',
  },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find((cat) => cat.id === id) || CATEGORIES[0];
};

export default CATEGORIES;
