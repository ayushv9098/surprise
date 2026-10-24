export const SONGS = [
  {
    id: 'baar-baar-din-ye-aaye',
    title: 'Baar Baar Din Ye Aaye (Happy Birthday)',
    artist: 'Mohammed Rafi • Farz',
    category: 'Birthday Anthem',
    emoji: '🎂',
    duration: '2:45',
    durationSeconds: 165,
    hookStartTime: 28,
    hookTitle: 'Baar Baar Din Ye Aaye...',
    audioUrl: '/audio/baar-baar-din-ye-aaye.mp3',
    fallbackUrl: 'https://aac.saavncdn.com/279/bd63de6655d473ffbebcb7ef0134f6e0_sar_96.mp4',
  },
  {
    id: 'kesariya',
    title: 'Kesariya (Brahmastra)',
    artist: 'Arijit Singh • Pritam',
    category: 'Romantic Hit',
    emoji: '🧡',
    duration: '2:45',
    durationSeconds: 165,
    hookStartTime: 42,
    hookTitle: 'Kesariya Tera Ishq Hai Piya...',
    audioUrl: '/audio/kesariya.mp3',
    fallbackUrl: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_96.mp4',
  },
  {
    id: 'raataan-lambiyan',
    title: 'Raataan Lambiyan (Shershaah)',
    artist: 'Jubin Nautiyal & Asees Kaur • Tanishk Bagchi',
    category: 'Romantic Hit',
    emoji: '🌙',
    duration: '2:35',
    durationSeconds: 155,
    hookStartTime: 30,
    hookTitle: 'Teri Meri Gallan Ho Gayi Mashhoor...',
    audioUrl: '/audio/raataan-lambiyan.mp3',
    fallbackUrl: 'https://aac.saavncdn.com/238/35726d4394604604e961bf5b846870d0_96.mp4',
  },
  {
    id: 'tum-hi-ho',
    title: 'Tum Hi Ho (Aashiqui 2)',
    artist: 'Arijit Singh • Mithoon',
    category: 'Soulful Romance',
    emoji: '🌹',
    duration: '2:40',
    durationSeconds: 160,
    hookStartTime: 35,
    hookTitle: 'Kyunki Tum Hi Ho Ab Tum Hi Ho...',
    audioUrl: '/audio/tum-hi-ho.mp3',
    fallbackUrl: 'https://aac.saavncdn.com/430/5c5ea5cc00e3bff45616013226f376fe_96.mp4',
  },
  {
    id: 'apna-bana-le',
    title: 'Apna Bana Le (Bhediya)',
    artist: 'Arijit Singh • Sachin-Jigar',
    category: 'Acoustic Romance',
    emoji: '✨',
    duration: '2:35',
    durationSeconds: 155,
    hookStartTime: 25,
    hookTitle: 'Apna Bana Le Piya...',
    audioUrl: '/audio/apna-bana-le.mp3',
    fallbackUrl: 'https://aac.saavncdn.com/228/bed7fe5f8fe04ae6432bcb0717e2b74e_96.mp4',
  },
  {
    id: 'pehla-nasha',
    title: 'Pehla Nasha (Jo Jeeta Wohi Sikandar)',
    artist: 'Udit Narayan & Sadhana Sargam • Jatin-Lalit',
    category: 'Timeless Romance',
    emoji: '💖',
    duration: '2:45',
    durationSeconds: 165,
    hookStartTime: 40,
    hookTitle: 'Pehla Nasha Pehla Khumaar...',
    audioUrl: '/audio/pehla-nasha.mp3',
    fallbackUrl: 'https://aac.saavncdn.com/852/9d335ee08b26f171a3d65e11f8819d52_sar_96.mp4',
  },
  {
    id: 'ilahi',
    title: 'Ilahi (Yeh Jawaani Hai Deewani)',
    artist: 'Arijit Singh • Pritam',
    category: 'Bollywood Celebration',
    emoji: '🎉',
    duration: '2:30',
    durationSeconds: 150,
    hookStartTime: 30,
    hookTitle: 'Mera Falsafa Kandhe Pe Mera Basta...',
    audioUrl: '/audio/ilahi.mp3',
    fallbackUrl: 'https://aac.saavncdn.com/440/a784bdaf2e6e4faba7b8282b8612f829_96.mp4',
  },
  {
    id: 'silent-mode',
    title: 'No Background Music (Sound Effects Only)',
    artist: 'Silent Ambience',
    category: 'Silent',
    emoji: '🤫',
    duration: 'Silent',
    durationSeconds: 0,
    hookStartTime: 0,
    hookTitle: '',
    audioUrl: '',
    fallbackUrl: '',
  },
];

export const getSongById = (idOrData, maybeFormData = null) => {
  const rawId = typeof idOrData === 'string' ? idOrData : idOrData?.songId;
  const formData = maybeFormData || (typeof idOrData === 'object' ? idOrData : null);

  // Legacy mappings for backwards compatibility
  const legacyMap = {
    'upbeat-birthday-reel': 'baar-baar-din-ye-aaye',
    'upbeat-birthday': 'baar-baar-din-ye-aaye',
    'insta-acoustic-romance': 'kesariya',
    'romantic-acoustic': 'kesariya',
    'bollywood-lofi-chill': 'tum-hi-ho',
    'lofi-nostalgia': 'tum-hi-ho',
    'indie-acoustic-soul': 'apna-bana-le',
    'soft-guitar': 'apna-bana-le',
    'romantic-piano-reels': 'pehla-nasha',
    'romantic-piano': 'pehla-nasha',
    'celebration-party-beat': 'ilahi',
    'celebration': 'ilahi',
  };
  const id = (rawId && legacyMap[rawId]) ? legacyMap[rawId] : rawId;

  // Helper to merge formData overrides if present
  const withFormDataOverrides = (song) => {
    if (!song) return song;
    if (formData && (formData.audioStartTime !== undefined || formData.audioDuration !== undefined)) {
      return {
        ...song,
        audioStartTime: formData.audioStartTime,
        audioDuration: formData.audioDuration,
      };
    }
    return song;
  };

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
      durationSeconds: Number(formData?.customSongDurationSeconds || formData?.audioDuration || 180),
      hookStartTime: Number(formData?.audioStartTime || 0),
      hookTitle: 'Beginning',
      audioUrl: customUrl,
      fallbackUrl: customUrl || SONGS[0].audioUrl,
      audioStartTime: formData?.audioStartTime,
      audioDuration: formData?.audioDuration,
    };
  }

  // Exact ID match in catalog
  if (id) {
    const found = SONGS.find((s) => s.id === id);
    if (found) return withFormDataOverrides(found);
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
      durationSeconds: Number(formData?.customSongDurationSeconds || formData?.audioDuration || 180),
      hookStartTime: Number(formData?.audioStartTime || 0),
      hookTitle: 'Beginning',
      audioUrl: customUrl,
      fallbackUrl: customUrl || SONGS[0].audioUrl,
      audioStartTime: formData?.audioStartTime,
      audioDuration: formData?.audioDuration,
    };
  }

  return withFormDataOverrides(SONGS[0]);
};
