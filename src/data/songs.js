export const SONGS = [
  {
    id: 'romantic-acoustic',
    title: 'Acoustic Whispers',
    artist: 'Sweet Moments Studio',
    category: 'Romantic & Warm',
    emoji: '🌸',
    duration: '2:15',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=acoustic-guitar-love-story-112345.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'upbeat-birthday',
    title: 'Golden Celebration Joy',
    artist: 'Sunny Sunshine Band',
    category: 'Celebration & Upbeat',
    emoji: '🎂',
    duration: '2:30',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_7314a3832c.mp3?filename=happy-day-celebration-9080.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'lofi-nostalgia',
    title: 'Warm Memories & Coffee',
    artist: 'Lofi Cozy Room',
    category: 'Lofi & Nostalgia',
    emoji: '☕',
    duration: '2:40',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cozy-lofi-chill-study-14032.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'soft-guitar',
    title: 'Gentle Forgiveness',
    artist: 'Serenity Strings',
    category: 'Soft & Heartfelt',
    emoji: '🕊️',
    duration: '2:05',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=gentle-acoustic-guitar-peace-10334.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
  {
    id: 'silent-mode',
    title: 'No Background Music (Gentle Chimes Only)',
    artist: 'Natural Ambience',
    category: 'Ambient',
    emoji: '🤫',
    duration: 'Silent',
    audioUrl: '',
    fallbackUrl: '',
  },
];

export const getSongById = (id) => {
  return SONGS.find((s) => s.id === id) || SONGS[0];
};
