import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Play,
  Pause,
  Trash2,
  Check,
  Link as LinkIcon,
  Music,
} from 'lucide-react';
import { SONGS } from '../../data/songs';
import { getTemplateById } from '../../data/templates';
import { compressImageFile } from '../../utils/storage';
import AppleEmoji from '../common/AppleEmoji';

export default function StepMedia({ formData, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [playingSongId, setPlayingSongId] = useState(null);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioFileInputRef = useRef(null);

  // Custom audio states
  const hasCustomAudio = formData.songId === 'custom' || Boolean(formData.customSongUrl);
  const [audioTab, setAudioTab] = useState(hasCustomAudio ? 'custom' : 'trending');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [audioError, setAudioError] = useState('');
  const [isAudioUploading, setIsAudioUploading] = useState(false);

  const template = getTemplateById(formData.templateId);
  const isBoy = formData.gender === 'boy';
  const selectedSongId = formData.songId || template.recommendedSongId || 'upbeat-birthday-reel';

  // Hero photo can come from formData.heroPhoto or formData.photos[0]?.url
  const heroPhotoUrl = formData.heroPhoto || formData.photos?.[0]?.url || template.samplePhoto || '';
  const photoCaption = formData.photoCaption || (isBoy ? 'Keep Rocking Always! 👑' : 'Stay Wonderful Always! 🌸');

  // Cleanup audio preview on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Toggle live music preview for curated songs
  const handleTogglePlaySong = (song) => {
    if (!song.audioUrl) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingSongId(null);
      handleSelectSong(song);
      return;
    }

    if (playingSongId === song.id) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingSongId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(song.audioUrl);
      audio.volume = 0.6;
      audio.onended = () => setPlayingSongId(null);
      audio.onerror = () => {
        if (song.fallbackUrl) {
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

  const handleSelectSong = (song) => {
    setAudioError('');
    onChange({
      songId: song.id,
      songUrl: song.audioUrl,
      customSongUrl: '',
      customSongTitle: '',
    });
  };

  // Custom audio handlers
  const handleAudioFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioError('');
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setAudioError('File size is larger than 5MB. Please choose a smaller audio clip (< 3MB recommended) for faster loading.');
      return;
    }

    setIsAudioUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        const fileName = file.name || 'My Custom Audio';
        const customTitle = `Custom: ${fileName}`;
        if (audioRef.current) {
          audioRef.current.pause();
          setPlayingSongId(null);
        }
        onChange({
          songId: 'custom',
          songUrl: dataUrl,
          customSongUrl: dataUrl,
          customSongTitle: customTitle,
        });
      }
      setIsAudioUploading(false);
    };
    reader.onerror = () => {
      setAudioError('Could not process this audio file. Please try another format (MP3, WAV, M4A) or paste a link.');
      setIsAudioUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyCustomAudioUrl = () => {
    const url = customUrlInput.trim();
    if (!url) return;

    setAudioError('');
    const rawFileName = url.split('/').pop()?.split('?')[0] || 'Audio Stream';
    const customTitle = `Link: ${rawFileName.slice(0, 30)}`;

    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingSongId(null);
    }

    onChange({
      songId: 'custom',
      songUrl: url,
      customSongUrl: url,
      customSongTitle: customTitle,
    });
    setCustomUrlInput('');
  };

  const handleRemoveCustomAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingSongId(null);
    }
    const defaultSong = SONGS[0];
    onChange({
      songId: defaultSong.id,
      songUrl: defaultSong.audioUrl,
      customSongUrl: '',
      customSongTitle: '',
    });
    setAudioTab('trending');
  };

  const handleTogglePlayCustom = () => {
    const customAudioUrl = formData.customSongUrl || formData.songUrl;
    if (!customAudioUrl) return;

    if (playingSongId === 'custom') {
      if (audioRef.current) audioRef.current.pause();
      setPlayingSongId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(customAudioUrl);
      audio.volume = 0.65;
      audio.onended = () => setPlayingSongId(null);
      audio.onerror = () => {
        setAudioError('Unable to play this custom audio track. Please check file format or URL access.');
        setPlayingSongId(null);
      };
      audio.play().then(() => {
        setPlayingSongId('custom');
      }).catch(() => {
        setAudioError('Audio playback was prevented by the browser. Click play again to start.');
        setPlayingSongId(null);
      });
      audioRef.current = audio;
    }
  };

  // Upload hero photo file
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const file = files[0];
      if (!file.type.startsWith('image/')) return;
      const compressedDataUrl = await compressImageFile(file, 600, 600, 0.72);

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
      setIsProcessing(false);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange({
      heroPhoto: urlInput.trim(),
      photos: [
        {
          id: `hero-${Date.now()}`,
          url: urlInput.trim(),
          caption: photoCaption,
          tag: 'Star Photo',
        },
      ],
    });
    setUrlInput('');
    setShowUrlField(false);
  };

  const handleUseSamplePhoto = () => {
    const sampleUrl = template.samplePhoto || (isBoy
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
    onChange({
      photoCaption: val,
      photos: formData.photos?.length
        ? formData.photos.map((p, idx) => (idx === 0 ? { ...p, caption: val } : p))
        : [{ id: 'hero', url: heroPhotoUrl, caption: val, tag: 'The Star' }],
    });
  };

  const handleRemovePhoto = () => {
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
        onChange={(e) => handleFiles(e.target.files)}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden File Input for custom audio uploads */}
      <input
        type="file"
        ref={audioFileInputRef}
        onChange={handleAudioFileUpload}
        accept="audio/*"
        className="hidden"
      />

      {/* SECTION 1: HERO PHOTO */}
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
          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 sm:gap-4">
            {/* Thumbnail */}
            <div className="w-14 h-16 sm:w-18 sm:h-22 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0 shadow-xs">
              <img
                src={heroPhotoUrl}
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right side */}
            <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">
                  Photo Added
                </span>
                <span className="text-emerald-500 font-bold text-xs">✓</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5">
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
              setIsDragging(false);
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-3.5 sm:p-4 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-rose-500 bg-rose-50/50'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-slate-400 border border-slate-200">
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="w-4.5 h-4.5 text-rose-500" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  {isProcessing ? 'Optimizing photo...' : 'Click or drag hero photo here'}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WEBP • Auto-centered
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Alternate URL Input Toggle */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <button
            type="button"
            onClick={() => setShowUrlField(!showUrlField)}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{showUrlField ? 'Hide URL input' : 'Or paste an image URL'}</span>
          </button>
        </div>

        {showUrlField && (
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-white">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-1.5 text-xs text-slate-800 bg-transparent focus:outline-hidden"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
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
            onChange={(e) => handleCaptionChange(e.target.value)}
            placeholder={isBoy ? 'Keep Rocking Always! 👑' : 'Stay Wonderful Always! 🌸'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* SECTION 2: BACKGROUND MUSIC */}
      <div className="space-y-3.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 pb-0.5">
          <h2 className="text-xs sm:text-base font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <span>3. Background Melody</span>
            <AppleEmoji emoji="🎵" size={15} />
          </h2>
          <span className="text-[10px] sm:text-xs font-medium text-slate-500 shrink-0">
            {hasCustomAudio ? 'Custom Active' : 'Auto-plays 🎧'}
          </span>
        </div>

        {/* Tab switcher: Trending Reels vs Custom Upload */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200/90 shadow-2xs gap-1">
          <button
            type="button"
            onClick={() => {
              setAudioTab('trending');
              setAudioError('');
            }}
            className={`py-2 px-1 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1 select-none min-w-0 ${
              audioTab === 'trending'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <span className="truncate">
              <span className="sm:hidden">Trending Reels</span>
              <span className="hidden sm:inline">Trending Insta Reels</span>
            </span>
            <span className="shrink-0">
              <AppleEmoji emoji="🎵" size={13} />
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAudioTab('custom');
              setAudioError('');
            }}
            className={`py-2 px-1 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1 select-none min-w-0 ${
              audioTab === 'custom'
                ? 'bg-white text-rose-600 shadow-xs border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <span className="truncate">
              <span className="sm:hidden">Upload Song</span>
              <span className="hidden sm:inline">Upload Your Song / MP3</span>
            </span>
            <span className="shrink-0">
              <AppleEmoji emoji="🎧" size={13} />
            </span>
          </button>
        </div>

        {/* Error notification if any */}
        {audioError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-xs text-amber-800 flex items-start gap-2 shadow-2xs">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <p className="flex-1 font-medium">{audioError}</p>
          </div>
        )}

        {/* TAB 1: TRENDING INSTA REELS */}
        {audioTab === 'trending' && (
          <div className="space-y-2.5">
            {hasCustomAudio && (
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between text-xs text-amber-900">
                <span className="flex items-center gap-1.5 font-medium">
                  <AppleEmoji emoji="🎧" size={13} />
                  <span>Custom track currently active. Select any reel below to switch.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAudioTab('custom')}
                  className="font-bold underline text-amber-900 hover:text-amber-950 cursor-pointer"
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
                        ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500/20 shadow-2xs'
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
          </div>
        )}

        {/* TAB 2: UPLOAD YOUR SONG / MP3 */}
        {audioTab === 'custom' && (
          <div className="space-y-3.5">
            {hasCustomAudio ? (
              /* Sleek card when custom audio is loaded */
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/70 via-white to-pink-50/40 border border-rose-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                      <span>✓</span>
                      <span>Custom Audio Active</span>
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline">Will play for recipient</span>
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

                <div className="flex items-center gap-2.5 sm:gap-3 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-2xs">
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
                      <span className="truncate">{playingSongId === 'custom' ? 'Playing live preview now' : 'Ready to delight your person'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => audioFileInputRef.current?.click()}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="hidden sm:inline">Change Track</span>
                      <span className="sm:hidden">Change</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* When no custom audio yet, show upload & URL options */
              <div className="space-y-3">
                <div
                  onClick={() => audioFileInputRef.current?.click()}
                  className="border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/30 hover:bg-rose-50/70 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group shadow-2xs"
                >
                  <div className="w-11 h-11 rounded-full bg-white shadow-xs border border-rose-200 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                    {isAudioUploading ? (
                      <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UploadCloud className="w-5 h-5 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {isAudioUploading ? 'Processing audio track...' : 'Upload Custom MP3 / Audio File'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports MP3, WAV, M4A, AAC • Recommended &lt; 3MB for fastest streaming
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Or paste direct MP3 / Audio Stream URL</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://cdn.pixabay.com/download/audio/track.mp3"
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomAudioUrl}
                      disabled={!customUrlInput.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 shadow-2xs"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
