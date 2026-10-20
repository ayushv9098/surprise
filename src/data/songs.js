export const SONGS = [
  {
    id: 'insta-acoustic-romance',
    title: 'Kesariya & Raataan Lambiyan (Acoustic)',
    artist: 'Insta Reels Trending • Acoustic Strings',
    category: 'Acoustic Reel',
    emoji: '🌸',
    duration: '2:15',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=acoustic-guitar-love-story-112345.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'bollywood-lofi-chill',
    title: 'Tum Hi Ho & Dil Diyan Gallan (Soulful Lofi)',
    artist: 'Bollywood Lofi Chills • Cozy Beats',
    category: 'Bollywood Lofi',
    emoji: '☕',
    duration: '2:40',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=romantic-acoustic-guitar-116492.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'upbeat-birthday-reel',
    title: 'Happy Birthday Party Dhun (Celebration)',
    artist: 'Party Beats • Birthday Anthem',
    category: 'Celebration Beat',
    emoji: '🎂',
    duration: '2:30',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'indie-acoustic-soul',
    title: 'Anuv & Prateek Vibes (Warm Sunset)',
    artist: 'Indie Aesthetic • Heartfelt Guitar',
    category: 'Indie Acoustic',
    emoji: '✨',
    duration: '2:05',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=gentle-acoustic-guitar-peace-10334.mp3',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
  {
    id: 'silent-mode',
    title: 'No Background Music (Sound Effects Only)',
    artist: 'Silent Ambience',
    category: 'Silent',
    emoji: '🤫',
    duration: 'Silent',
    audioUrl: '',
    fallbackUrl: '',
  },
];

export const getSongById = (idOrData, maybeFormData = null) => {
  const id = typeof idOrData === 'string' ? idOrData : idOrData?.songId;
  const formData = maybeFormData || (typeof idOrData === 'object' ? idOrData : null);

  if (id === 'custom') {
    const customUrl = formData?.customSongUrl || formData?.songUrl || '';
    const customTitle = formData?.customSongTitle || 'Custom Audio Track 🎵';
    return {
      id: 'custom',
      title: customTitle,
      artist: 'Custom Upload / Audio Stream',
      category: 'Custom Audio',
      emoji: '🎧',
      duration: 'Custom',
      audioUrl: customUrl,
      fallbackUrl: customUrl,
    };
  }

  const found = SONGS.find((s) => s.id === id);
  if (found) return found;

  // Unknown ID - if custom URL exists in formData, return custom descriptor
  if (formData?.customSongUrl || formData?.songUrl) {
    return {
      id: id || 'custom',
      title: formData?.customSongTitle || 'Custom Audio Track 🎵',
      artist: 'Custom Upload / Audio Stream',
      category: 'Custom Audio',
      emoji: '🎧',
      duration: 'Custom',
      audioUrl: formData.customSongUrl || formData.songUrl,
      fallbackUrl: formData.customSongUrl || formData.songUrl,
    };
  }

  // Legacy mappings for backwards compatibility
  const legacyMap = {
    'romantic-acoustic': 'insta-acoustic-romance',
    'upbeat-birthday': 'upbeat-birthday-reel',
    'lofi-nostalgia': 'bollywood-lofi-chill',
    'soft-guitar': 'indie-acoustic-soul',
  };
  if (id && legacyMap[id]) {
    const mapped = SONGS.find((s) => s.id === legacyMap[id]);
    if (mapped) return mapped;
  }

  return SONGS[0];
};
