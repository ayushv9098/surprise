import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Sparkles,
  Music,
  Play,
  Pause,
  Trash2,
  Image as ImageIcon,
  Check,
  Plus,
  Volume2,
} from 'lucide-react';
import { SONGS } from '../../data/songs';
import { SAMPLE_PHOTOS } from '../../data/samplePresets';
import { compressImageFile } from '../../utils/storage';

export default function StepMedia({ formData, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingSongId, setPlayingSongId] = useState(null);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const photos = formData.photos || [];
  const selectedSongId = formData.songId || 'romantic-acoustic';

  // Toggle live music preview
  const handleTogglePlaySong = (song) => {
    if (!song.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingSongId(null);
      onChange({ songId: song.id });
      return;
    }

    if (playingSongId === song.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingSongId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(song.audioUrl);
      audio.volume = 0.6;
      audio.onended = () => setPlayingSongId(null);
      audio.onerror = () => {
        // Fallback url
        if (song.fallbackUrl) {
          audio.src = song.fallbackUrl;
          audio.play().catch(() => setPlayingSongId(null));
        } else {
          setPlayingSongId(null);
        }
      };
      audio.play().catch((err) => {
        console.warn('Audio play prevented or blocked:', err);
        setPlayingSongId(null);
      });
      audioRef.current = audio;
      setPlayingSongId(song.id);
    }
  };

  const handleSelectSong = (songId) => {
    onChange({ songId });
  };

  // Handle uploaded files
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const newPhotos = [...photos];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        if (newPhotos.length >= 8) break; // max limit

        try {
          const compressedDataUrl = await compressImageFile(file, 800, 800, 0.75);
          newPhotos.push({
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            url: compressedDataUrl,
            caption: 'A moment I will never forget ✨',
            tag: 'Memory',
          });
        } catch (err) {
          console.error('Failed to compress image file:', err);
        }
      }
      onChange({ photos: newPhotos });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemovePhoto = (photoId) => {
    const updated = photos.filter((p) => p.id !== photoId);
    onChange({ photos: updated });
  };

  const handleUpdateCaption = (photoId, caption) => {
    const updated = photos.map((p) => (p.id === photoId ? { ...p, caption } : p));
    onChange({ photos: updated });
  };

  const handleUpdateTag = (photoId, tag) => {
    const updated = photos.map((p) => (p.id === photoId ? { ...p, tag } : p));
    onChange({ photos: updated });
  };

  const handleUseSamplePhotos = () => {
    onChange({ photos: [...SAMPLE_PHOTOS] });
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="border-b border-rose-100/80 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 2: Visuals & Mood</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-800">
          Add Cherished Photos & Soundtrack
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Upload sweet photos from your camera roll, or choose our aesthetic sample set with 1 click.
        </p>
      </div>

      {/* PHOTO UPLOADER SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-rose-500" />
            <span>Memories & Moments ({photos.length} / 8 photos)</span>
          </label>
          <button
            type="button"
            onClick={handleUseSamplePhotos}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Load Aesthetic Sample Photos (1-Click)</span>
          </button>
        </div>

        {/* Drag & Drop Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-rose-500 bg-rose-50/80 scale-[1.01]'
              : 'border-rose-200/90 bg-rose-50/30 hover:border-rose-300 hover:bg-rose-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-rose-500 border border-rose-100">
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6 animate-bounce" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {isProcessing ? 'Optimizing images...' : 'Click to upload photos or drag & drop'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                PNG, JPG, WEBP • Automatically compressed for instant, blazing-fast sharing
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Photos Gallery Cards */}
        {photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {photos.map((photo, index) => (
              <div
                key={photo.id || index}
                className="flex gap-3 p-2.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition-shadow relative group"
              >
                {/* Photo Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Photo'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Photo Captions & Tag */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    type="text"
                    value={photo.tag || ''}
                    onChange={(e) => handleUpdateTag(photo.id, e.target.value)}
                    placeholder="Memory tag (e.g. Goa Trip, First Date)"
                    className="w-full text-xs font-semibold text-rose-600 placeholder-rose-300 bg-transparent border-b border-dashed border-rose-200 focus:border-rose-400 focus:outline-none pb-0.5"
                  />
                  <input
                    type="text"
                    value={photo.caption || ''}
                    onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                    placeholder="Add a sweet memory caption..."
                    className="w-full text-xs text-slate-700 placeholder-slate-400 bg-transparent border-b border-transparent focus:border-slate-300 focus:outline-none pb-0.5"
                  />
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  title="Remove photo"
                  className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 self-start transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MUSIC PICKER SECTION */}
      <div className="space-y-4 pt-2 border-t border-rose-100/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Music className="w-4 h-4 text-rose-500" />
            <span>Background Soundtrack</span>
          </label>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-rose-400" /> Auto-plays softly when opened
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SONGS.map((song) => {
            const isSelected = selectedSongId === song.id;
            const isPlaying = playingSongId === song.id;

            return (
              <div
                key={song.id}
                onClick={() => handleSelectSong(song.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/70 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-rose-200 hover:bg-rose-50/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlaySong(song);
                    }}
                    title={isPlaying ? 'Pause Preview' : 'Play Preview'}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105 cursor-pointer ${
                      isPlaying
                        ? 'bg-rose-600 text-white shadow-md animate-pulse'
                        : isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-600'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {song.title}
                      </span>
                      <span>{song.emoji}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {song.artist} • <span className="text-rose-500/80">{song.category}</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">{song.duration}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
