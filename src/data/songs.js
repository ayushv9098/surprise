export const SONGS = [
  {
    id: 'insta-acoustic-romance',
    title: 'Kesariya & Raataan Lambiyan (Acoustic Strings)',
    artist: 'Insta Reels Trending • Acoustic Strings',
    category: 'Acoustic Romance',
    emoji: '🌸',
    duration: '2:15',
    audioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    fallbackUrl: 'https://cdn.freesound.org/previews/568/568315_3908940-lq.mp3',
  },
  {
    id: 'bollywood-lofi-chill',
    title: 'Tum Hi Ho & Dil Diyan Gallan (Soulful Lofi)',
    artist: 'Bollywood Lofi Chills • Cozy Beats',
    category: 'Bollywood Lofi',
    emoji: '☕',
    duration: '2:40',
    audioUrl: 'https://cdn.freesound.org/previews/679/679023_14795591-lq.mp3',
    fallbackUrl: 'https://cdn.freesound.org/previews/757/757420_13645418-lq.mp3',
  },
  {
    id: 'upbeat-birthday-reel',
    title: 'Happy Birthday Celebration Dhun',
    artist: 'Party Beats • Birthday Anthem',
    category: 'Birthday Reel',
    emoji: '🎂',
    duration: '2:30',
    audioUrl: 'https://cdn.freesound.org/previews/541/541177_5479102-lq.mp3',
    fallbackUrl: 'https://cdn.freesound.org/previews/646/646123_5479102-lq.mp3',
  },
  {
    id: 'indie-acoustic-soul',
    title: 'Warm Sunset Acoustic Guitar',
    artist: 'Indie Aesthetic • Heartfelt Guitar',
    category: 'Indie Acoustic',
    emoji: '✨',
    duration: '2:05',
    audioUrl: 'https://cdn.freesound.org/previews/535/535105_11203376-lq.mp3',
    fallbackUrl: 'https://cdn.freesound.org/previews/546/546964_2019171-lq.mp3',
  },
  {
    id: 'romantic-piano-reels',
    title: 'Pehla Nasha & Soft Piano Melody',
    artist: 'Romantic Piano Chords • Emotional Melodies',
    category: 'Piano Romance',
    emoji: '🎹',
    duration: '2:50',
    audioUrl: 'https://cdn.freesound.org/previews/266/266449_3598127-lq.mp3',
    fallbackUrl: 'https://cdn.freesound.org/previews/515/515922_4772988-lq.mp3',
  },
  {
    id: 'celebration-party-beat',
    title: 'Upbeat Celebration Reel Anthem',
    artist: 'Dance & Celebration • Party Energy',
    category: 'Party Anthem',
    emoji: '🎉',
    duration: '3:10',
    audioUrl: 'https://cdn.freesound.org/previews/542/542415_8462944-lq.mp3',
    fallbackUrl: 'https://cdn.freesound.org/previews/555/555000_8462944-lq.mp3',
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

  // If user selected custom audio or uploaded file
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
      fallbackUrl: customUrl || SONGS[0].audioUrl,
    };
  }

  // Exact ID match in catalog
  if (id) {
    const found = SONGS.find((s) => s.id === id);
    if (found) return found;
  }

  // Unknown ID - if custom URL exists in formData, return custom descriptor
  if (formData?.customSongUrl || formData?.songUrl) {
    const customUrl = formData.customSongUrl || formData.songUrl;
    return {
      id: id || 'custom',
      title: formData?.customSongTitle || 'Custom Audio Track 🎵',
      artist: 'Custom Upload / Audio Stream',
      category: 'Custom Audio',
      emoji: '🎧',
      duration: 'Custom',
      audioUrl: customUrl,
      fallbackUrl: customUrl || SONGS[0].audioUrl,
    };
  }

  // Legacy mappings for backwards compatibility
  const legacyMap = {
    'romantic-acoustic': 'insta-acoustic-romance',
    'upbeat-birthday': 'upbeat-birthday-reel',
    'lofi-nostalgia': 'bollywood-lofi-chill',
    'soft-guitar': 'indie-acoustic-soul',
    'romantic-piano': 'romantic-piano-reels',
    'celebration': 'celebration-party-beat',
  };
  if (id && legacyMap[id]) {
    const mapped = SONGS.find((s) => s.id === legacyMap[id]);
    if (mapped) return mapped;
  }

  return SONGS[0];
};
