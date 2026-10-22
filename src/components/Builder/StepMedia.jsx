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
  // Hero Photo states
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [showPhotoUrlField, setShowPhotoUrlField] = useState(false);
  const fileInputRef = useRef(null);

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
  const selectedSongId = formData.songId || template?.recommendedSongId || 'upbeat-birthday-reel';

  // Hero photo can come from formData.heroPhoto or formData.photos[0]?.url
  const heroPhotoUrl = formData.heroPhoto || formData.photos?.[0]?.url || template?.samplePhoto || '';
  const photoCaption = formData.photoCaption !== undefined ? formData.photoCaption : (isBoy ? 'Keep Rocking Always! 👑' : 'Stay Wonderful Always! 🌸');

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

  const handleUseSamplePhoto = () => {
    onFocusField?.('heroPhoto');
    const sampleUrl = template?.samplePhoto || (isBoy
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80');

    const sampleCap = isBoy ? 'Keep Rocking Always! 👑' : 'Stay Wonderful Always! 🌸';

    onChange({
      heroPhoto: sampleUrl,
      photoCaption: sampleCap,
      photos: [
        {
          id: `sample-${Date.now()}`,
          url: sampleUrl,
          caption: sampleCap,
          tag: 'The Star',
        },
      ],
    });
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

  return (
    <div className="space-y-6">
      {/* Hidden File Input for photo uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handlePhotoFiles(e.target.files)}
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

      {/* SECTION 1: HERO STAR PHOTO */}
      <div className="space-y-4">
        {/* Header */}
        <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between gap-2">
          <h2 className="text-xs sm:text-base font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <span>2. Star Photo</span>
            <AppleEmoji emoji="📸" size={15} />
          </h2>

          <button
            type="button"
            onClick={handleUseSamplePhoto}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <AppleEmoji emoji="✨" size={12} />
            <span>Sample Photo</span>
          </button>
        </div>

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
            placeholder={isBoy ? 'Keep Rocking Always! 👑' : 'Stay Wonderful Always! 🌸'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
          />
        </div>
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
