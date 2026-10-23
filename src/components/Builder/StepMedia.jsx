import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  Play,
  Pause,
  Trash2,
  Check,
  Link as LinkIcon,
  Music,
  Volume2,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  FileAudio,
  ArrowRight,
} from 'lucide-react';
import { SONGS } from '../../data/songs';
import { getTemplateById } from '../../data/templates';
import { compressImageFile } from '../../utils/storage';
import AppleEmoji from '../common/AppleEmoji';

// Curated romantic polaroids for fallback & multi-photo memory deck
const DEFAULT_ROMANCE_PHOTOS = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    caption: 'Forever & Always With You!❤️🌹',
    tag: 'OUR BEGINNING 🌸',
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    caption: 'Nazrein hataana thoda mushkil hai yahan 😉✨',
    tag: 'Nazar Na Lage 🧿',
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    caption: 'Never a dull moment around you 🕶️💫',
    tag: 'Memories 📸',
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    caption: "Some moments don't need words 💫",
    tag: 'Holding Hands 🤝',
  },
];

/**
 * Smart URL Intelligence: detects Instagram, YouTube, Spotify, Google Drive, Dropbox,
 * and converts or advises the user with zero-friction solutions.
 */
const detectUrlType = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return { type: 'empty' };
  const url = rawUrl.trim();

  // Instagram: /reel/, /p/, /reels/audio/, /stories/
  if (/(instagram\.com|instagr\.am)\/(reel|reels|p|stories|tv)\//i.test(url) || /instagram\.com\/reels\/audio\//i.test(url)) {
    return {
      type: 'instagram',
      url,
      message: "Instagram Reel links cannot be played directly due to Instagram's CORS and privacy restrictions. To use your favorite music with zero hassle:",
    };
  }

  // YouTube / YouTube Music
  if (/(youtube\.com|youtu\.be)\//i.test(url)) {
    return {
      type: 'youtube',
      url,
      message: "YouTube links are video web pages, not direct audio stream files. Browsers cannot stream them as background music.",
    };
  }

  // Spotify
  if (/spotify\.com\//i.test(url)) {
    return {
      type: 'spotify',
      url,
      message: "Spotify web links cannot be streamed by web browsers due to digital rights restrictions.",
    };
  }

  // Google Drive
  const gdriveMatch = url.match(/drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+)|uc\?.*id=([a-zA-Z0-9_-]+))/i);
  if (gdriveMatch) {
    const fileId = gdriveMatch[1] || gdriveMatch[2] || gdriveMatch[3];
    const convertedUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    return {
      type: 'gdrive',
      originalUrl: url,
      convertedUrl,
      fileId,
      message: 'Google Drive link detected! Converted to direct audio stream URL automatically.',
    };
  }

  // Dropbox
  if (/dropbox\.com\//i.test(url)) {
    let convertedUrl = url;
    if (convertedUrl.includes('dl=0')) {
      convertedUrl = convertedUrl.replace('dl=0', 'raw=1');
    } else if (convertedUrl.includes('dl=1')) {
      convertedUrl = convertedUrl.replace('dl=1', 'raw=1');
    } else if (!convertedUrl.includes('raw=1')) {
      convertedUrl += (convertedUrl.includes('?') ? '&' : '?') + 'raw=1';
    }
    return {
      type: 'dropbox',
      originalUrl: url,
      convertedUrl,
      message: 'Dropbox link detected! Converted to direct raw audio stream URL automatically.',
    };
  }

  return {
    type: 'direct',
    convertedUrl: url,
  };
};

/**
 * Real-time Audio Stream Prober
 * Verifies whether a given URL can actually be streamed as audio by the browser.
 */
const probeAudioUrl = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('Please enter a valid audio URL.'));
      return;
    }
    const audio = new Audio();
    // Do NOT set audio.crossOrigin = 'anonymous' to prevent browser network stalls on third-party servers
    let settled = false;

    const cleanup = () => {
      audio.oncanplaythrough = null;
      audio.onloadeddata = null;
      audio.onerror = null;
      try {
        audio.pause();
        audio.removeAttribute('src');
        audio.src = '';
        audio.load();
      } catch {
        // Safe cleanup
      }
    };

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        reject(new Error('Audio stream test timed out. The server may be blocking streaming or slow to respond.'));
      }
    }, 2500);

    audio.oncanplaythrough = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        cleanup();
        resolve(true);
      }
    };

    audio.onloadeddata = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        cleanup();
        resolve(true);
      }
    };

    audio.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        cleanup();
        reject(new Error('This link is not a playable direct audio stream (MP3/WAV) or is blocked by CORS.'));
      }
    };

    try {
      audio.src = url;
      audio.load();
    } catch {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        cleanup();
        reject(new Error('Invalid audio URL format.'));
      }
    }
  });
};

export default function StepMedia({ formData, onChange, onFocusField }) {
  // Hero Photo states (Single photo / Birthday)
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [showPhotoUrlField, setShowPhotoUrlField] = useState(false);
  const fileInputRef = useRef(null);

  // Multi-Photo states (Romance / Scrapbook memory deck)
  const [activeUploadIndex, setActiveUploadIndex] = useState(null);
  const multiFileInputRef = useRef(null);

  // Audio Playback & Ref states
  const [playingSongId, setPlayingSongId] = useState(null);
  const audioRef = useRef(null);
  const audioFileInputRef = useRef(null);

  // Custom Audio & Smart URL states
  const hasCustomAudio = formData.songId === 'custom' || Boolean(formData.customSongUrl);
  const [audioTab, setAudioTab] = useState(hasCustomAudio ? 'custom' : 'trending');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isAudioDragging, setIsAudioDragging] = useState(false);
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [urlFeedback, setUrlFeedback] = useState(null); // { type, message, convertedUrl }

  const template = getTemplateById(formData.templateId);
  const isBoy = formData.gender === 'boy';
  const occasionCategory = formData.category || template?.category || 'birthday';
  const isRomance =
    occasionCategory === 'romance' ||
    ['velvet-romance', 'sunset-romance', 'celestial-love', 'blush-romance'].includes(formData.templateId) ||
    Boolean(
      formData.templateId && (
        formData.templateId.includes('romance') ||
        formData.templateId.includes('velvet') ||
        formData.templateId.includes('sunset') ||
        formData.templateId.includes('celestial')
      )
    );
  const isScrapbook = !isRomance && (occasionCategory === 'scrapbook' || ['vintage-kodak', 'neon-nostalgia', 'cozy-memories'].includes(formData.templateId));
  const isApology = !isRomance && !isScrapbook && (occasionCategory === 'apology' || ['gentle-peace', 'sweet-forgive', 'fresh-start'].includes(formData.templateId));
  const isMultiPhoto = isRomance || isScrapbook;

  const defaultPhotoCaption = isRomance
    ? 'Forever & Always With You! ❤️🌹'
    : isScrapbook
    ? 'Moments Captured For Eternity! 📸⚡'
    : isApology
    ? 'Our Bond Means Everything to Me! 🕊️🤍'
    : (isBoy ? 'Keep Rocking Always! 👑' : 'Stay Wonderful Always! 🌸');

  const selectedSongId = formData.songId || template?.recommendedSongId || 'upbeat-birthday-reel';

  // Hero photo can come from formData.heroPhoto or formData.photos[0]?.url
  const heroPhotoUrl = formData.heroPhoto || formData.photos?.[0]?.url || template?.samplePhoto || '';
  const photoCaption = formData.photoCaption !== undefined ? formData.photoCaption : defaultPhotoCaption;

  // Resolve romance/scrapbook memory deck photos (up to 4 items)
  const romancePhotos = React.useMemo(() => {
    if (formData.photos && formData.photos.length > 0) {
      return formData.photos.map((p, idx) => ({
        id: p.id || `photo-${idx + 1}`,
        url: typeof p === 'string' ? p : (p.url || ''),
        caption: (typeof p === 'object' && p.caption)
          ? p.caption
          : (idx === 0 ? (formData.photoCaption || DEFAULT_ROMANCE_PHOTOS[0].caption) : (DEFAULT_ROMANCE_PHOTOS[idx]?.caption || 'Special Memory ✨')),
        tag: (typeof p === 'object' && p.tag)
          ? p.tag
          : (DEFAULT_ROMANCE_PHOTOS[idx]?.tag || `Memory ${idx + 1}`),
      }));
    }
    if (formData.heroPhoto) {
      return [
        {
          id: 'photo-1',
          url: formData.heroPhoto,
          caption: formData.photoCaption || DEFAULT_ROMANCE_PHOTOS[0].caption,
          tag: DEFAULT_ROMANCE_PHOTOS[0].tag,
        },
        ...DEFAULT_ROMANCE_PHOTOS.slice(1),
      ];
    }
    return DEFAULT_ROMANCE_PHOTOS;
  }, [formData.photos, formData.heroPhoto, formData.photoCaption]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Stop currently playing audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingSongId(null);
  }, []);

  // 1-Click Toggle live music preview for curated songs
  const handleTogglePlaySong = (song) => {
    if (!song.audioUrl) {
      stopAudio();
      handleSelectSong(song);
      return;
    }

    if (playingSongId === song.id) {
      stopAudio();
    } else {
      stopAudio();
      const primaryUrl = song.audioUrl || song.fallbackUrl;
      const audio = new Audio(primaryUrl);
      audio.volume = 0.65;
      audio.onended = () => setPlayingSongId(null);
      audio.onerror = () => {
        if (song.fallbackUrl && song.fallbackUrl !== primaryUrl) {
          audio.src = song.fallbackUrl;
          audio.play().catch(() => setPlayingSongId(null));
        } else {
          setPlayingSongId(null);
        }
      };
      audio.play().catch(() => setPlayingSongId(null));
      audioRef.current = audio;
      setPlayingSongId(song.id);
    }
  };

  // 1-Click Select Trending Song
  const handleSelectSong = (song) => {
    onFocusField?.('songId');
    setAudioError('');
    setUrlFeedback(null);
    if (formData.customSongUrl && typeof formData.customSongUrl === 'string' && formData.customSongUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(formData.customSongUrl);
      } catch {
        // ignore
      }
    }
    onChange({
      songId: song.id,
      songUrl: song.audioUrl || song.fallbackUrl,
      customSongUrl: '',
      customSongTitle: '',
      customAudioBlob: null,
    });
  };

  // Toggle live music preview for custom audio
  const handleTogglePlayCustom = () => {
    const customAudioUrl = formData.customSongUrl || formData.songUrl;
    if (!customAudioUrl) return;

    if (playingSongId === 'custom') {
      stopAudio();
    } else {
      stopAudio();
      const audio = new Audio(customAudioUrl);
      audio.volume = 0.7;
      audio.onended = () => setPlayingSongId(null);
      audio.onerror = () => {
        setAudioError('Unable to stream this audio track. Check the file or URL access.');
        setPlayingSongId(null);
      };
      audio.play().then(() => {
        setPlayingSongId('custom');
      }).catch(() => {
        setAudioError('Playback paused by browser policy. Click play once more to listen.');
        setPlayingSongId(null);
      });
      audioRef.current = audio;
    }
  };

  // Process custom audio file (from drop or file picker)
  const processAudioFile = (file) => {
    if (!file) return;
    setAudioError('');
    setUrlFeedback(null);

    const maxBytes = 15 * 1024 * 1024; // 15MB
    if (file.size > maxBytes) {
      setAudioError('Audio file is larger than 15MB. Please pick a smaller clip (< 5MB recommended) for faster loading.');
      return;
    }

    try {
      setIsAudioUploading(true);
      const rawName = file.name ? file.name.replace(/\.[^/.]+$/, '') : 'Custom Audio';
      const cleanTitle = rawName.length > 32 ? rawName.slice(0, 30) + '...' : rawName;
      stopAudio();

      // Revoke prior blob URL to avoid memory leaks
      if (formData.customSongUrl && typeof formData.customSongUrl === 'string' && formData.customSongUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(formData.customSongUrl);
        } catch {
          // ignore
        }
      }

      // Use URL.createObjectURL instead of multi-megabyte base64 data URLs to prevent UI freeze
      const blobUrl = URL.createObjectURL(file);

      onChange({
        songId: 'custom',
        songUrl: blobUrl,
        customSongUrl: blobUrl,
        customSongTitle: `Audio: ${cleanTitle}`,
        customAudioBlob: file, // Keep file reference for upload if needed
      });

      setUrlFeedback({
        type: 'success',
        message: '✓ Custom audio file ready to play!',
      });
    } catch (err) {
      console.error('Audio processing error:', err);
      setAudioError('Could not process this audio file. Please try another format (MP3, WAV, M4A).');
    } finally {
      setIsAudioUploading(false);
    }
  };

  const handleAudioFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processAudioFile(file);
    e.target.value = '';
  };

  // Real-time URL input changes with instant intelligence detection
  const handleCustomUrlChange = (val) => {
    setCustomUrlInput(val);
    setAudioError('');

    if (!val.trim()) {
      setUrlFeedback(null);
      return;
    }

    const detected = detectUrlType(val);
    if (['instagram', 'youtube', 'spotify', 'gdrive', 'dropbox'].includes(detected.type)) {
      setUrlFeedback({
        type: detected.type,
        message: detected.message,
        convertedUrl: detected.convertedUrl,
      });
    } else if (urlFeedback && ['instagram', 'youtube', 'spotify'].includes(urlFeedback.type)) {
      setUrlFeedback(null);
    }
  };

  // Test and apply audio URL with real-time stream probe
  const handleTestAndApplyAudioUrl = async () => {
    const rawUrl = customUrlInput.trim();
    if (!rawUrl) return;

    const detected = detectUrlType(rawUrl);

    // If Instagram, YouTube, or Spotify, show friendly guidance
    if (detected.type === 'instagram' || detected.type === 'youtube' || detected.type === 'spotify') {
      setUrlFeedback({
        type: detected.type,
        message: detected.message,
      });
      return;
    }

    const finalUrl = detected.convertedUrl || rawUrl;
    setIsTestingAudio(true);
    setAudioError('');
    setUrlFeedback({
      type: 'testing',
      message: 'Testing audio stream in real-time...',
    });

    try {
      await probeAudioUrl(finalUrl);

      // Successfully probed!
      const rawFileName = finalUrl.split('/').pop()?.split('?')[0] || 'Web Audio';
      const cleanFileName = rawFileName.length > 30 ? rawFileName.slice(0, 28) + '...' : rawFileName;
      const customTitle = detected.type === 'gdrive'
        ? 'Google Drive Audio Stream'
        : detected.type === 'dropbox'
        ? 'Dropbox Audio Stream'
        : `Stream: ${cleanFileName}`;

      stopAudio();
      onChange({
        songId: 'custom',
        songUrl: finalUrl,
        customSongUrl: finalUrl,
        customSongTitle: customTitle,
      });

      setUrlFeedback({
        type: 'success',
        message: '✓ Audio link tested and ready to play!',
      });
      setCustomUrlInput('');
    } catch (err) {
      setUrlFeedback({
        type: 'failed',
        message: err.message || 'Unable to stream audio from this link. It might be blocked by CORS or not a direct MP3 stream.',
      });
    } finally {
      setIsTestingAudio(false);
    }
  };

  // Remove custom audio and revert to default trending reel
  const handleRemoveCustomAudio = () => {
    stopAudio();
    if (formData.customSongUrl && typeof formData.customSongUrl === 'string' && formData.customSongUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(formData.customSongUrl);
      } catch {
        // ignore
      }
    }
    const defaultSong = SONGS[0];
    onChange({
      songId: defaultSong.id,
      songUrl: defaultSong.audioUrl || defaultSong.fallbackUrl,
      customSongUrl: '',
      customSongTitle: '',
      customAudioBlob: null,
    });
    setAudioTab('trending');
    setUrlFeedback(null);
    setAudioError('');
  };

  // Instant fallback to trending reels library
  const handleFallbackToTrending = () => {
    stopAudio();
    const recommendedSong = SONGS[0];
    handleSelectSong(recommendedSong);
    setAudioTab('trending');
    setUrlFeedback(null);
    setAudioError('');
    setCustomUrlInput('');
  };

  // Hero Photo file processing
  const handlePhotoFiles = async (files) => {
    if (!files || files.length === 0) return;
    onFocusField?.('heroPhoto');
    setIsPhotoProcessing(true);

    try {
      const file = files[0];
      if (!file.type.startsWith('image/')) return;
      const compressedDataUrl = await compressImageFile(file, 1400, 1400, 0.88);

      onChange({
        heroPhoto: compressedDataUrl,
        photos: [
          {
            id: `hero-${Date.now()}`,
            url: compressedDataUrl,
            caption: photoCaption,
            tag: 'Star Photo',
          },
        ],
      });
    } catch (err) {
      console.error('Failed to compress hero photo:', err);
    } finally {
      setIsPhotoProcessing(false);
    }
  };

  const handleApplyPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    onFocusField?.('heroPhoto');
    onChange({
      heroPhoto: photoUrlInput.trim(),
      photos: [
        {
          id: `hero-${Date.now()}`,
          url: photoUrlInput.trim(),
          caption: photoCaption,
          tag: 'Star Photo',
        },
      ],
    });
    setPhotoUrlInput('');
    setShowPhotoUrlField(false);
  };

  const handleCaptionChange = (val) => {
    onFocusField?.('photoCaption');
    onChange({
      photoCaption: val,
      photos: formData.photos?.length
        ? formData.photos.map((p, idx) => (idx === 0 ? { ...p, caption: val } : p))
        : [{ id: 'hero', url: heroPhotoUrl, caption: val, tag: 'The Star' }],
    });
  };

  const handleRemovePhoto = () => {
    onFocusField?.('heroPhoto');
    onChange({
      heroPhoto: '',
      photos: [],
    });
  };

  // Multi-photo deck actions for Romance & Scrapbook
  const updateMultiPhotos = (newPhotos) => {
    onFocusField?.('photos');
    onChange({
      photos: newPhotos,
      heroPhoto: newPhotos[0]?.url || '',
      photoCaption: newPhotos[0]?.caption || '',
    });
  };

  const handleTriggerUpload = (index) => {
    setActiveUploadIndex(index);
    if (multiFileInputRef.current) {
      multiFileInputRef.current.value = '';
      multiFileInputRef.current.click();
    }
  };

  const handleMultiFileInputChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || activeUploadIndex === null) return;
    if (!file.type.startsWith('image/')) return;
    setIsPhotoProcessing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1400, 1400, 0.88);
      const newPhotos = romancePhotos.map((p, idx) =>
        idx === activeUploadIndex ? { ...p, url: compressedDataUrl } : p
      );
      updateMultiPhotos(newPhotos);
    } catch (err) {
      console.error('Failed to compress image:', err);
    } finally {
      setIsPhotoProcessing(false);
      setActiveUploadIndex(null);
    }
  };

  const handleCardDrop = async (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setIsPhotoProcessing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1400, 1400, 0.88);
      const newPhotos = romancePhotos.map((p, idx) =>
        idx === index ? { ...p, url: compressedDataUrl } : p
      );
      updateMultiPhotos(newPhotos);
    } catch (err) {
      console.error('Failed to drop-load image:', err);
    } finally {
      setIsPhotoProcessing(false);
    }
  };

  const handleDeletePhoto = (index) => {
    if (romancePhotos.length <= 1) return;
    const newPhotos = romancePhotos.filter((_, idx) => idx !== index);
    updateMultiPhotos(newPhotos);
  };

  const handleAddMemoryPhoto = () => {
    if (romancePhotos.length >= 4) return;
    const nextIdx = romancePhotos.length;
    const defaultSample = DEFAULT_ROMANCE_PHOTOS[nextIdx] || {
      id: `photo-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
      caption: 'Cherished Moments Together! 💖',
      tag: 'Special Memory ✨',
    };
    const newPhotos = [
      ...romancePhotos,
      {
        id: `photo-${Date.now()}-${nextIdx}`,
        url: defaultSample.url,
        caption: defaultSample.caption,
        tag: defaultSample.tag,
      },
    ];
    updateMultiPhotos(newPhotos);
  };

  const handleUpdateTag = (index, tag) => {
    const newPhotos = romancePhotos.map((p, idx) =>
      idx === index ? { ...p, tag } : p
    );
    updateMultiPhotos(newPhotos);
  };

  const handleUpdateCaption = (index, caption) => {
    const newPhotos = romancePhotos.map((p, idx) =>
      idx === index ? { ...p, caption } : p
    );
    updateMultiPhotos(newPhotos);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for single photo uploads (Birthday) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handlePhotoFiles(e.target.files)}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for multi-photo deck uploads (Romance/Scrapbook) */}
      <input
        type="file"
        ref={multiFileInputRef}
        onChange={handleMultiFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for custom audio uploads */}
      <input
        type="file"
        ref={audioFileInputRef}
        onChange={handleAudioFileInputChange}
        accept="audio/*"
        className="hidden"
      />

      {/* SECTION 1: PHOTO(S) */}
      <div className="space-y-4">
        {/* Header */}
        <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between gap-2">
          <h2 className="text-xs sm:text-base font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <span>{isMultiPhoto ? '2. Romantic Memory Deck (Up to 4 Photos)' : '2. Star Photo'}</span>
            <AppleEmoji emoji="📸" size={15} />
          </h2>
        </div>

        {isMultiPhoto ? (
          /* Multi-Photo Manager */
          <div className="space-y-3">
            <div className="space-y-3">
              {romancePhotos.map((photo, index) => (
                <div
                  key={photo.id || index}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 transition-all hover:border-slate-300"
                >
                  {/* Header row: Card # / Label + Cover Badge + Delete button */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {index === 0 ? 'Memory 1 (Cover Polaroid)' : `Memory ${index + 1}`}
                      </span>
                      {index === 0 && (
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Cover Card 🌸
                        </span>
                      )}
                    </div>
                    {romancePhotos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(index)}
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete this photo card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">Delete</span>
                      </button>
                    )}
                  </div>

                  {/* Main body: Left thumbnail, right fields */}
                  <div className="flex flex-col sm:flex-row items-start gap-3.5">
                    {/* Polaroid Thumbnail + Single Upload Button */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-32">
                      <div
                        onClick={() => handleTriggerUpload(index)}
                        onDrop={(e) => handleCardDrop(e, index)}
                        onDragOver={(e) => e.preventDefault()}
                        className="w-20 h-24 sm:w-32 sm:h-32 rounded-xl border-2 border-slate-200 bg-slate-100 overflow-hidden shrink-0 shadow-xs relative group flex items-center justify-center cursor-pointer hover:border-rose-300 transition-colors"
                        title="Click to upload photo"
                      >
                        {photo.url ? (
                          <img
                            src={photo.url}
                            alt={photo.tag || `Memory ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">No Image</span>
                        )}
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <UploadCloud className="w-5 h-5 text-white drop-shadow" />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(index)}
                        className="w-full min-w-0 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs whitespace-nowrap"
                      >
                        <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">
                          {photo.url && (photo.url.startsWith('data:') || photo.url.startsWith('blob:'))
                            ? 'Change Photo'
                            : 'Upload Photo'}
                        </span>
                      </button>
                    </div>

                    {/* Form Inputs (Tag, Caption) */}
                    <div className="flex-1 min-w-0 space-y-2.5 w-full">
                      {/* Tag input */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <span>Polaroid Tag / Badge</span>
                          <AppleEmoji emoji="🏷️" size={12} />
                        </label>
                        <input
                          type="text"
                          value={photo.tag || ''}
                          onFocus={() => onFocusField?.('photos')}
                          onChange={(e) => handleUpdateTag(index, e.target.value)}
                          placeholder="e.g. OUR BEGINNING 🌸"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white focus:bg-white text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        />
                      </div>

                      {/* Caption input */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <span>Handwritten Polaroid Caption</span>
                          <AppleEmoji emoji="✍️" size={12} />
                        </label>
                        <input
                          type="text"
                          value={photo.caption || ''}
                          onFocus={() => onFocusField?.('photos')}
                          onChange={(e) => handleUpdateCaption(index, e.target.value)}
                          placeholder="e.g. Forever & Always With You! ❤️🌹"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* + Add Memory Photo button if < 4 */}
            {romancePhotos.length < 4 && (
              <button
                type="button"
                onClick={handleAddMemoryPhoto}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl border border-rose-200/90 hover:border-rose-400 bg-white hover:bg-rose-50/60 shadow-2xs hover:shadow-xs text-rose-600 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <span className="w-5 h-5 rounded-full bg-rose-100 group-hover:bg-rose-200 text-rose-600 flex items-center justify-center text-xs font-bold transition-colors">
                  +
                </span>
                <span>Add Memory Photo ({romancePhotos.length}/4)</span>
              </button>
            )}
          </div>
        ) : (
          /* Single Hero Photo (Birthday) */
          <>

        {/* Hero Photo Preview or Dropzone */}
        {heroPhotoUrl ? (
          <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3 sm:gap-4 transition-all">
            {/* Thumbnail */}
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0 shadow-xs relative group">
              <img
                src={heroPhotoUrl}
                alt="Star"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            {/* Right side actions */}
            <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Photo Added
                </span>
                <span className="text-emerald-500 font-bold text-xs">✓</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Centered automatically for the reveal animation
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDrop={(e) => {
              e.preventDefault();
              setIsPhotoDragging(false);
              if (e.dataTransfer.files) handlePhotoFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsPhotoDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsPhotoDragging(false);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition-all cursor-pointer ${
              isPhotoDragging
                ? 'border-rose-500 bg-rose-50/50 scale-[0.99]'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-rose-500 border border-slate-200">
                {isPhotoProcessing ? (
                  <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  {isPhotoProcessing ? 'Optimizing photo...' : 'Click or drag hero photo here'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WEBP • Auto-centered & optimized
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Alternate Photo URL Input Toggle */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <button
            type="button"
            onClick={() => setShowPhotoUrlField(!showPhotoUrlField)}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{showPhotoUrlField ? 'Hide URL input' : 'Or paste an image URL'}</span>
          </button>
        </div>

        {showPhotoUrlField && (
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-white">
            <input
              type="url"
              value={photoUrlInput}
              onFocus={() => onFocusField?.('heroPhoto')}
              onChange={(e) => setPhotoUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-1.5 text-xs text-slate-800 bg-transparent focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleApplyPhotoUrl}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer shrink-0"
            >
              Apply
            </button>
          </div>
        )}

        {/* Photo Caption Field */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <span>Polaroid Handwritten Caption</span>
            <AppleEmoji emoji="✍️" size={13} />
          </label>
          <input
            type="text"
            value={photoCaption}
            onFocus={() => onFocusField?.('photoCaption')}
            onChange={(e) => handleCaptionChange(e.target.value)}
            placeholder={defaultPhotoCaption}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
          />
        </div>
        </>
        )}
      </div>

      {/* SECTION 2: BACKGROUND MUSIC & SMART AUDIO HANDLER */}
      <div className="space-y-3.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 pb-0.5">
          <h2 className="text-xs sm:text-base font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <span>3. Background Melody</span>
            <AppleEmoji emoji="🎵" size={15} />
          </h2>
          <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-rose-500" />
            <span>{hasCustomAudio ? 'Custom Track Active' : 'Auto-plays on Reveal'}</span>
          </span>
        </div>

        {/* Clear, Zero-Friction Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200/90 shadow-2xs gap-1">
          <button
            type="button"
            onClick={() => {
              setAudioTab('trending');
              setAudioError('');
            }}
            className={`py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none min-w-0 ${
              audioTab === 'trending'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <AppleEmoji emoji="🎵" size={14} />
            <span className="truncate">
              <span className="sm:hidden">Trending Reels</span>
              <span className="hidden sm:inline">Trending Insta Reels</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAudioTab('custom');
              setAudioError('');
            }}
            className={`py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none min-w-0 ${
              audioTab === 'custom'
                ? 'bg-white text-rose-600 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <AppleEmoji emoji="🎧" size={14} />
            <span className="truncate">
              <span className="sm:hidden">Upload / Custom</span>
              <span className="hidden sm:inline">Upload Song / MP3</span>
            </span>
          </button>
        </div>

        {/* Error notification if any */}
        {audioError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-xs text-amber-800 flex items-start gap-2 shadow-2xs animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="flex-1 font-medium">{audioError}</p>
          </div>
        )}

        {/* TAB 1: TRENDING INSTA REELS */}
        {audioTab === 'trending' && (
          <div className="space-y-2.5">
            {hasCustomAudio && (
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
                <span className="flex items-center gap-1.5 font-medium truncate">
                  <AppleEmoji emoji="🎧" size={13} />
                  <span className="truncate">Your custom audio track is currently active.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAudioTab('custom')}
                  className="font-bold underline text-amber-900 hover:text-amber-950 cursor-pointer shrink-0 ml-2"
                >
                  View Custom
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {SONGS.map((song) => {
                const isSelected = selectedSongId === song.id && !hasCustomAudio;
                const isPlaying = playingSongId === song.id;

                return (
                  <div
                    key={song.id}
                    onClick={() => handleSelectSong(song)}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer min-w-0 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500/30 shadow-2xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePlaySong(song);
                        }}
                        title={isPlaying ? 'Pause Preview' : 'Play Preview'}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-rose-500 text-white scale-105 shadow-sm'
                            : isSelected
                            ? 'bg-rose-500 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isPlaying ? (
                          <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        ) : (
                          <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {song.title}
                          </span>
                          {isPlaying && (
                            <span className="inline-flex items-center animate-pulse shrink-0">
                              <AppleEmoji emoji="🎶" size={11} />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 truncate max-w-full">
                            <AppleEmoji emoji={song.emoji} size={10} />
                            <span className="truncate">{song.category}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-1.5 sm:ml-2">
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Switcher callout */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Looking for your own song or reel audio?</span>
              <button
                type="button"
                onClick={() => setAudioTab('custom')}
                className="font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Upload Song</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD YOUR SONG / SMART AUDIO HANDLER */}
        {audioTab === 'custom' && (
          <div className="space-y-3.5">
            {/* If custom audio is already selected/active */}
            {hasCustomAudio && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/70 via-white to-pink-50/40 border border-rose-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Custom Audio Active</span>
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline">• Plays for recipient</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveCustomAudio}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-700 px-2 sm:px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove<span className="hidden sm:inline"> Custom Audio</span></span>
                  </button>
                </div>

                {/* Player card */}
                <div className="flex items-center gap-2.5 sm:gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={handleTogglePlayCustom}
                    title={playingSongId === 'custom' ? 'Pause Preview' : 'Play Preview'}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs ${
                      playingSongId === 'custom'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-rose-500 hover:bg-rose-600 text-white'
                    }`}
                  >
                    {playingSongId === 'custom' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {formData.customSongTitle || 'Custom Audio Track 🎵'}
                      </p>
                      {playingSongId === 'custom' && (
                        <span className="inline-flex items-center animate-pulse shrink-0">
                          <AppleEmoji emoji="🎶" size={13} />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                      <Music className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">
                        {playingSongId === 'custom' ? 'Playing live audio preview now' : 'Ready to play in surprise reveal'}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => audioFileInputRef.current?.click()}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="hidden sm:inline">Change File</span>
                      <span className="sm:hidden">Change</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Zero-friction upload & smart URL input */}
            <div className="space-y-3">
              {/* Prominent File Dropzone */}
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  setIsAudioDragging(false);
                  if (e.dataTransfer.files?.[0]) processAudioFile(e.dataTransfer.files[0]);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsAudioDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsAudioDragging(false);
                }}
                onClick={() => {
                  onFocusField?.('songId');
                  audioFileInputRef.current?.click();
                }}
                className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group shadow-2xs ${
                  isAudioDragging
                    ? 'border-rose-500 bg-rose-50/70 scale-[0.99]'
                    : 'border-rose-200/90 hover:border-rose-400 bg-rose-50/30 hover:bg-rose-50/60'
                }`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-xs border border-rose-200 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
                  {isAudioUploading ? (
                    <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FileAudio className="w-5 h-5 text-rose-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {isAudioUploading ? 'Processing audio track...' : 'Upload Audio from Phone / Laptop (MP3, M4A, WAV)'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select any song, voice note, or downloaded reel audio • Instant playback
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  OR PASTE DIRECT LINK
                </span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* Smart Audio URL Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Paste Audio Stream, Drive, or Reel Link</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Tested before saving</span>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onFocus={() => onFocusField?.('songId')}
                    onChange={(e) => handleCustomUrlChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTestAndApplyAudioUrl();
                      }
                    }}
                    placeholder="Paste link (Instagram reel, Drive, Dropbox, MP3)..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleTestAndApplyAudioUrl}
                    disabled={!customUrlInput.trim() || isTestingAudio}
                    className="px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 shadow-2xs flex items-center gap-1.5"
                  >
                    {isTestingAudio ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline">Testing...</span>
                      </>
                    ) : (
                      <>
                        <span>Test & Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SMART URL INTELLIGENCE HELPER BOX */}
              {urlFeedback && (
                <div className="transition-all animate-fadeIn">
                  {/* Case 1: Instagram Reel Detected */}
                  {urlFeedback.type === 'instagram' && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border border-pink-200 text-xs shadow-xs space-y-2.5">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          <Music className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900">
                            Instagram Reel Link Detected
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                            Instagram Reel links cannot be played directly due to Instagram's CORS and privacy restrictions. To use your favorite music with zero hassle:
                          </p>
                        </div>
                      </div>

                      {/* Instant Solution Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleFallbackToTrending}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-200 hover:bg-rose-50/80 transition-all shadow-2xs cursor-pointer text-center"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">Choose from Trending Reels Library (Works 100%)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => audioFileInputRef.current?.click()}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-2xs cursor-pointer text-center"
                        >
                          <FileAudio className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Upload MP3 File from Phone or PC</span>
                        </button>
                      </div>

                      <p className="text-[10px] sm:text-[11px] text-slate-500 italic pt-0.5">
                        💡 Tip: If you want this exact reel's sound, download its audio with any free reel audio downloader on your phone, then tap "Upload MP3 File"!
                      </p>
                    </div>
                  )}

                  {/* Case 2: YouTube or Spotify Detected */}
                  {(urlFeedback.type === 'youtube' || urlFeedback.type === 'spotify') && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs shadow-xs space-y-2.5">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-amber-950 capitalize">
                            {urlFeedback.type} Link Detected
                          </h4>
                          <p className="text-[11px] sm:text-xs text-amber-900 mt-0.5 leading-relaxed">
                            {urlFeedback.message}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleFallbackToTrending}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-amber-200 hover:bg-amber-100/50 transition-all shadow-2xs cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>Choose from Trending Reels</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => audioFileInputRef.current?.click()}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-2xs cursor-pointer"
                        >
                          <FileAudio className="w-3.5 h-3.5 shrink-0" />
                          <span>Upload MP3 File from Phone or PC</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Case 3: Google Drive / Dropbox auto-conversion */}
                  {(urlFeedback.type === 'gdrive' || urlFeedback.type === 'dropbox') && (
                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-2 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold">{urlFeedback.message}</p>
                        <p className="text-[11px] text-sky-700 mt-0.5">
                          Click "Test & Apply" to verify that file sharing permissions are public.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Case 4: Testing State */}
                  {urlFeedback.type === 'testing' && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2 shadow-2xs">
                      <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                      <p className="font-semibold">{urlFeedback.message}</p>
                    </div>
                  )}

                  {/* Case 5: Success state */}
                  {urlFeedback.type === 'success' && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <p className="font-bold flex-1">{urlFeedback.message}</p>
                    </div>
                  )}

                  {/* Case 6: Stream Probe Failed */}
                  {urlFeedback.type === 'failed' && (
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs shadow-xs space-y-2.5">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-rose-950">
                            Audio Stream Test Failed
                          </h4>
                          <p className="text-[11px] sm:text-xs text-rose-800 mt-0.5 leading-relaxed">
                            {urlFeedback.message}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleFallbackToTrending}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-300 hover:bg-rose-100/50 transition-all shadow-2xs cursor-pointer text-center"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">Use Trending Reel Instead (Guaranteed)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => audioFileInputRef.current?.click()}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-2xs cursor-pointer text-center"
                        >
                          <FileAudio className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Upload MP3 from Phone</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
