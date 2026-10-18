import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Play,
  Pause,
  Trash2,
  Check,
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
        if (newPhotos.length >= 8) break;

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
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Photos & Music
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Upload cherished photos and pick a background song.
        </p>
      </div>

      {/* PHOTO UPLOADER SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">
            Photos ({photos.length} / 8)
          </label>
          <button
            type="button"
            onClick={handleUseSamplePhotos}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors cursor-pointer"
          >
            Use Sample Photos
          </button>
        </div>

        {/* Drag & Drop Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-rose-500 bg-rose-50/50'
              : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'
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
            <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-500 border border-gray-100">
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isProcessing ? 'Optimizing photos...' : 'Click or drag photos here'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                PNG, JPG, WEBP • Automatically compressed
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Photos Cards */}
        {photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {photos.map((photo, index) => (
              <div
                key={photo.id || index}
                className="flex gap-3 p-2.5 rounded-xl border border-gray-200 bg-white relative group"
              >
                {/* Photo Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Photo'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Photo Captions & Tag */}
                <div className="flex-1 min-w-0 space-y-1">
                  <input
                    type="text"
                    value={photo.tag || ''}
                    onChange={(e) => handleUpdateTag(photo.id, e.target.value)}
                    placeholder="Memory tag (e.g. First Date)"
                    className="w-full text-xs font-medium text-rose-600 placeholder-rose-300 bg-transparent border-b border-gray-100 focus:border-rose-400 focus:outline-hidden pb-0.5"
                  />
                  <input
                    type="text"
                    value={photo.caption || ''}
                    onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                    placeholder="Add a sweet memory caption..."
                    className="w-full text-xs text-gray-700 placeholder-gray-400 bg-transparent focus:outline-hidden pb-0.5"
                  />
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  title="Remove photo"
                  className="p-1 rounded-md text-gray-300 hover:text-rose-500 self-start transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MUSIC PICKER SECTION */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <label className="block text-xs font-medium text-gray-700">
          Background Soundtrack
        </label>

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
                    ? 'border-rose-500 bg-rose-50/30'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlaySong(song);
                    }}
                    title={isPlaying ? 'Pause' : 'Play Preview'}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform cursor-pointer ${
                      isPlaying
                        ? 'bg-rose-500 text-white'
                        : isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-900 truncate">
                        {song.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
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
