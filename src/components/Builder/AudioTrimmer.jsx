import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Scissors,
  Play,
  Pause,
  Sparkles,
  RotateCcw,
  Volume2,
  Check,
  Music,
} from 'lucide-react';
import { getSongById } from '../../data/songs';
import AppleEmoji from '../common/AppleEmoji';

/**
 * Format seconds into mm:ss display
 */
const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) return '0:00';
  const totalSecs = Math.max(0, Math.round(seconds));
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/**
 * Deterministically generate 48 vertical waveform bar heights based on song title/id.
 * Produces an authentic rhythmic Instagram/Spotify story waveform signature.
 */
const generateWaveHeights = (seed = 'song') => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const bars = [];
  const count = 48;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    // Harmonic wave oscillation + pseudo-random peaks for musical energy
    const wave = Math.sin(t * Math.PI * 4) * 0.22 + Math.cos(t * Math.PI * 7) * 0.16;
    const pseudo = Math.abs(Math.sin(hash + i * 19.87));
    const raw = 0.38 + wave + pseudo * 0.44;
    const height = Math.min(96, Math.max(20, Math.round(raw * 100)));
    bars.push(height);
  }
  return bars;
};

// Default hook metadata fallbacks for popular Indian songs
const DEFAULT_HOOKS = {
  'baar-baar-din-ye-aaye': { hookStartTime: 28, hookTitle: 'Baar Baar Din Ye Aaye...' },
  'kesariya': { hookStartTime: 42, hookTitle: 'Kesariya Tera Ishq Hai Piya...' },
  'raataan-lambiyan': { hookStartTime: 30, hookTitle: 'Teri Meri Gallan Ho Gayi Mashhoor...' },
  'tum-hi-ho': { hookStartTime: 35, hookTitle: 'Kyunki Tum Hi Ho Ab Tum Hi Ho...' },
  'apna-bana-le': { hookStartTime: 25, hookTitle: 'Apna Bana Le Piya...' },
  'pehla-nasha': { hookStartTime: 40, hookTitle: 'Pehla Nasha Pehla Khumaar...' },
  'ilahi': { hookStartTime: 30, hookTitle: 'Mera Falsafa Kandhe Pe Mera Basta...' },
};

const DEFAULT_DURATIONS = {
  'baar-baar-din-ye-aaye': 165,
  'kesariya': 165,
  'raataan-lambiyan': 155,
  'tum-hi-ho': 160,
  'apna-bana-le': 155,
  'pehla-nasha': 165,
  'ilahi': 150,
};

// Snippet duration options: 15s, 30s (default/recommended), 60s, Full Song (null)
const DURATION_OPTIONS = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s', badge: 'Default' },
  { value: 60, label: '60s' },
  { value: null, label: 'Full Song' },
];

export default function AudioTrimmer({
  formData,
  onChange,
  onPreviewPlay,
  isParentPlaying = false,
}) {
  const song = useMemo(
    () => getSongById(formData.songId, formData),
    [formData.songId, formData.customSongUrl, formData.songUrl, formData.customSongTitle]
  );

  const audioUrl = song?.audioUrl || song?.fallbackUrl || formData?.customSongUrl || formData?.songUrl || '';

  // Track detected duration for custom uploaded audio files or dynamically loaded streams
  const [detectedDuration, setDetectedDuration] = useState(null);

  useEffect(() => {
    if (!audioUrl || audioUrl === '') return;
    const probe = new Audio();
    probe.preload = 'metadata';
    probe.src = audioUrl;

    const onMeta = () => {
      if (probe.duration && !isNaN(probe.duration) && isFinite(probe.duration)) {
        setDetectedDuration(Math.round(probe.duration));
      }
    };

    probe.addEventListener('loadedmetadata', onMeta);
    return () => {
      probe.removeEventListener('loadedmetadata', onMeta);
      probe.removeAttribute('src');
      probe.load();
    };
  }, [audioUrl]);

  // Total song length in seconds
  const totalDuration = useMemo(() => {
    if (detectedDuration && detectedDuration > 5) return detectedDuration;
    if (song?.durationSeconds && song.durationSeconds > 0) return song.durationSeconds;
    if (song?.id && DEFAULT_DURATIONS[song.id]) return DEFAULT_DURATIONS[song.id];
    return 165; // ~2m 45s standard pop track
  }, [detectedDuration, song?.durationSeconds, song?.id]);

  // Duration selection: null = full song, otherwise 15, 30, 60
  const rawDuration = formData.audioDuration !== undefined ? formData.audioDuration : 30;
  const isFullSong = rawDuration === null || rawDuration === 0 || rawDuration === 'full';
  const effectiveDuration = isFullSong ? totalDuration : Math.min(Number(rawDuration) || 30, totalDuration);

  // Maximum valid starting second so snippet never extends beyond the song end
  const maxStartTime = isFullSong ? 0 : Math.max(0, totalDuration - effectiveDuration);

  // Resolved start and end times
  const rawStartTime = Number(formData.audioStartTime || 0);
  const startTime = Math.min(Math.max(0, rawStartTime), maxStartTime);
  const endTime = isFullSong ? totalDuration : Math.min(totalDuration, startTime + effectiveDuration);

  // Generate unique wave bars for current song
  const waveBars = useMemo(() => generateWaveHeights(song.id || song.title || 'default'), [song.id, song.title]);

  // Interactive scrubbing & dragging state
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef({ pointerX: 0, initialStartTime: 0, rectWidth: 1 });

  // Audio preview playback state
  const audioPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadTime, setPlayheadTime] = useState(startTime);

  // Stop preview if parent plays song preview in song card
  useEffect(() => {
    if (isParentPlaying && isPlaying) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [isParentPlaying, isPlaying]);

  // Cleanup audio preview on unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  // Sync audio source when song changes
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.currentTime = startTime;
      setIsPlaying(false);
      setPlayheadTime(startTime);
    }
  }, [audioUrl]);

  // Hook up audio player event listeners for real-time playhead movement & loop
  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const cur = audio.currentTime;
      setPlayheadTime(cur);

      // Loop back to startTime when snippet finishes
      if (!isFullSong) {
        if (cur >= endTime || cur < startTime - 0.5) {
          audio.currentTime = startTime;
          audio.play().catch(() => {});
        }
      }
    };

    const handleEnded = () => {
      if (isFullSong) {
        setIsPlaying(false);
        setPlayheadTime(0);
      } else {
        audio.currentTime = startTime;
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [startTime, endTime, isFullSong]);

  // Update start time and notify parent
  const commitStartTime = useCallback(
    (newStart) => {
      const clamped = Math.min(Math.max(0, newStart), maxStartTime);
      onChange?.({
        audioStartTime: clamped,
        audioDuration: rawDuration,
      });

      if (audioPlayerRef.current) {
        audioPlayerRef.current.currentTime = clamped;
        setPlayheadTime(clamped);
      }
    },
    [maxStartTime, rawDuration, onChange]
  );

  // Toggle preview play / pause
  const togglePlayPreview = () => {
    if (!audioUrl) return;

    if (isPlaying) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      onPreviewPlay?.(); // Notify parent to stop any other song preview

      if (!audioPlayerRef.current) {
        const audio = new Audio(audioUrl);
        audio.volume = 0.75;
        audioPlayerRef.current = audio;
      }

      const audio = audioPlayerRef.current;
      audio.currentTime = startTime;
      setPlayheadTime(startTime);

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback error or waiting for interaction:', err);
          setIsPlaying(false);
        });
    }
  };

  // Change duration chip
  const handleSelectDuration = (val) => {
    const newEffectiveDuration = val === null ? totalDuration : Math.min(val, totalDuration);
    const newMaxStart = val === null ? 0 : Math.max(0, totalDuration - newEffectiveDuration);
    const clampedStart = Math.min(startTime, newMaxStart);

    onChange?.({
      audioStartTime: clampedStart,
      audioDuration: val,
    });

    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = clampedStart;
      setPlayheadTime(clampedStart);
    }
  };

  // 1-Click "✨ Jump to Chorus / Hook"
  const resolvedHookStartTime = song?.hookStartTime ?? DEFAULT_HOOKS[song?.id]?.hookStartTime;
  const resolvedHookTitle = song?.hookTitle || DEFAULT_HOOKS[song?.id]?.hookTitle;
  const hasHook = resolvedHookStartTime !== undefined && resolvedHookStartTime !== null && Boolean(resolvedHookTitle);
  const isAtHook = hasHook && Math.abs(startTime - resolvedHookStartTime) <= 1;

  const handleJumpToHook = () => {
    if (!hasHook) return;
    const targetStart = Math.min(resolvedHookStartTime, maxStartTime);

    onChange?.({
      audioStartTime: targetStart,
      audioDuration: rawDuration,
    });

    onPreviewPlay?.();

    if (!audioPlayerRef.current) {
      const audio = new Audio(audioUrl);
      audio.volume = 0.75;
      audioPlayerRef.current = audio;
    }

    const audio = audioPlayerRef.current;
    audio.currentTime = targetStart;
    setPlayheadTime(targetStart);

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  // Reset to 0:00
  const handleResetToStart = () => {
    commitStartTime(0);
  };

  // Dragging and scrubbing handlers on waveform track
  const handlePointerDown = (e) => {
    if (!trackRef.current || isFullSong) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pointerX = e.clientX;
    const clickRatio = Math.max(0, Math.min(1, (pointerX - rect.left) / rect.width));
    const clickedTime = clickRatio * totalDuration;

    const isInsideWindow = clickedTime >= startTime && clickedTime <= endTime;

    dragInfoRef.current = {
      pointerX,
      initialStartTime: isInsideWindow ? startTime : Math.min(clickedTime, maxStartTime),
      rectWidth: rect.width || 1,
    };

    // If clicked outside active window, center the snippet window around click point
    if (!isInsideWindow) {
      const centeredStart = Math.round(clickedTime - effectiveDuration / 2);
      const newStart = Math.min(Math.max(0, centeredStart), maxStartTime);
      commitStartTime(newStart);
      dragInfoRef.current.initialStartTime = newStart;
    }

    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !trackRef.current || isFullSong) return;
    const deltaX = e.clientX - dragInfoRef.current.pointerX;
    const deltaTime = (deltaX / dragInfoRef.current.rectWidth) * totalDuration;
    const newStart = Math.min(
      Math.max(0, Math.round(dragInfoRef.current.initialStartTime + deltaTime)),
      maxStartTime
    );
    commitStartTime(newStart);
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // Highlight Window geometry (% of track width)
  const windowStartPercent = totalDuration > 0 ? (startTime / totalDuration) * 100 : 0;
  const windowWidthPercent = isFullSong
    ? 100
    : totalDuration > 0
    ? (effectiveDuration / totalDuration) * 100
    : 100;

  // Playhead geometry within snippet window (0% to 100%)
  const playheadProgress =
    isPlaying && effectiveDuration > 0
      ? Math.max(0, Math.min(1, (playheadTime - startTime) / effectiveDuration))
      : 0;

  return (
    <div className="rounded-2xl border border-rose-200/90 bg-gradient-to-b from-white via-rose-50/25 to-pink-50/30 p-3.5 sm:p-4 shadow-2xs space-y-3.5 transition-all animate-fadeIn">
      {/* 1. Header with Instagram aesthetic badge and time indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
              <span>Trim Song Part (Instagram Story Style)</span>
              <AppleEmoji emoji="✂️" size={13} />
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500">
              Choose the exact part of the song that plays when your surprise opens
            </p>
          </div>
        </div>

        {/* Live Snippet Timestamp Range Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white text-rose-700 border border-rose-200/90 shadow-2xs">
            <Volume2 className="w-3 h-3 text-rose-500 shrink-0" />
            <span>
              {formatTime(startTime)} - {formatTime(endTime)}
            </span>
            <span className="text-[10px] font-semibold text-rose-400">
              ({isFullSong ? 'Full Song' : `${effectiveDuration}s clip`})
            </span>
          </span>
        </div>
      </div>

      {/* 2. 1-Click "✨ Jump to Chorus / Hook" (if song has hook metadata) */}
      {hasHook && (
        <button
          type="button"
          onClick={handleJumpToHook}
          title="Jump directly to the song's iconic chorus"
          className={`w-full p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group shadow-2xs ${
            isAtHook
              ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white border-transparent shadow-xs scale-[0.995]'
              : 'bg-white hover:bg-rose-50/80 border-rose-200/90 hover:border-rose-300 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isAtHook ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
            </span>
            <span className="truncate">
              <span className={`font-bold mr-1.5 ${isAtHook ? 'text-white' : 'text-rose-600'}`}>
                ✨ Jump to Chorus:
              </span>
              <span className={`italic ${isAtHook ? 'text-rose-100' : 'text-slate-700'}`}>
                "{resolvedHookTitle}"
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAtHook ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {formatTime(resolvedHookStartTime)}
            </span>
            {isAtHook && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
          </div>
        </button>
      )}

      {/* 3. Interactive Soundwave Scrubber / Waveform Selector */}
      <div className="space-y-1.5">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative h-20 sm:h-22 w-full rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden select-none touch-none shadow-inner flex items-center px-1.5 sm:px-2 cursor-ew-resize group transition-all ${
            isDragging ? 'ring-2 ring-rose-500/50 shadow-md' : 'hover:border-slate-700'
          }`}
          title={isFullSong ? 'Full Song selected' : 'Drag window or tap anywhere on waveform to crop song'}
        >
          {/* Subtle Ambient Glow inside Scrubber */}
          <div className="absolute inset-0 bg-radial from-rose-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Background Audio Waveform (48 Bars) */}
          <div className="relative w-full h-full flex items-center justify-between gap-[1px] sm:gap-1 px-1 z-0">
            {waveBars.map((height, i) => {
              // Bar timestamp based on index
              const barTime = (i / waveBars.length) * totalDuration;
              const isInWindow = isFullSong || (barTime >= startTime && barTime <= endTime);

              return (
                <div
                  key={i}
                  className="flex-1 flex items-center justify-center h-full min-w-[2px]"
                >
                  <div
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-full transition-all duration-150 ${
                      isInWindow
                        ? 'bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 shadow-[0_0_6px_rgba(251,113,133,0.4)]'
                        : 'bg-slate-700/50'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Highlight Selector Window (Instagram Story Style) */}
          <div
            style={{
              left: `${windowStartPercent}%`,
              width: `${windowWidthPercent}%`,
            }}
            className={`absolute top-1 bottom-1 z-10 rounded-xl border-2 border-rose-500 bg-rose-500/15 backdrop-blur-[1px] shadow-[0_0_15px_rgba(244,63,94,0.35)] transition-all pointer-events-none flex items-stretch justify-between ${
              isDragging ? 'border-pink-400 ring-2 ring-rose-400/40' : ''
            }`}
          >
            {/* Left Handle */}
            <div className="w-2.5 sm:w-3 bg-gradient-to-b from-rose-400 to-rose-600 rounded-l-[10px] flex items-center justify-center shrink-0 shadow-xs">
              <div className="w-0.5 h-4 bg-white/90 rounded-full" />
            </div>

            {/* Playhead Progress Line (Active when preview is playing) */}
            {isPlaying && (
              <div
                style={{
                  left: `${playheadProgress * 100}%`,
                }}
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_#ffffff] z-20 pointer-events-none transition-none"
              >
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-white shadow-xs border border-rose-500" />
              </div>
            )}

            {/* Floating Start Timestamp Tag */}
            <div className="absolute -top-2 left-1 transform -translate-y-full bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700 shadow-sm pointer-events-none whitespace-nowrap flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>{formatTime(startTime)}</span>
            </div>

            {/* Right Handle */}
            <div className="w-2.5 sm:w-3 bg-gradient-to-b from-rose-400 to-rose-600 rounded-r-[10px] flex items-center justify-center shrink-0 shadow-xs">
              <div className="w-0.5 h-4 bg-white/90 rounded-full" />
            </div>
          </div>
        </div>

        {/* Timeline Range Ticks */}
        <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 px-1 pt-0.5">
          <span>0:00</span>
          <span>{formatTime(totalDuration * 0.25)}</span>
          <span>{formatTime(totalDuration * 0.5)}</span>
          <span>{formatTime(totalDuration * 0.75)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>

        {/* Accessible Range Input Slider for fine 1-second keyboard adjustment */}
        {!isFullSong && maxStartTime > 0 && (
          <div className="pt-0.5">
            <input
              type="range"
              min={0}
              max={maxStartTime}
              step={1}
              value={startTime}
              onChange={(e) => commitStartTime(Number(e.target.value))}
              aria-label="Adjust start timestamp"
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        )}
      </div>

      {/* 4. Controls: Instant Preview Button & Duration Selector Chips */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Instant Preview Play / Pause */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={togglePlayPreview}
            title={isPlaying ? 'Pause snippet preview' : 'Play cropped snippet preview'}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-md transition-all cursor-pointer active:scale-95 ${
              isPlaying
                ? 'bg-rose-600 ring-4 ring-rose-400/30 animate-pulse'
                : 'bg-gradient-to-tr from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 hover:scale-105'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 text-white" />
            )}
          </button>

          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 leading-tight truncate">
              {isPlaying ? 'Playing Cropped Snippet' : 'Test Cropped Melody'}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              {isPlaying
                ? `Looping at ${formatTime(endTime)}`
                : `${formatTime(startTime)} - ${formatTime(endTime)} (${isFullSong ? 'Full Song' : `${effectiveDuration}s`})`}
            </p>
          </div>

          {startTime > 0 && (
            <button
              type="button"
              onClick={handleResetToStart}
              title="Reset start time to 0:00"
              className="ml-auto sm:ml-2 inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Snippet Duration Selector Chips */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 hidden sm:inline">
            Duration:
          </span>
          {DURATION_OPTIONS.map((opt) => {
            const isSelected =
              opt.value === null
                ? isFullSong
                : !isFullSong && Number(rawDuration) === opt.value;

            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleSelectDuration(opt.value)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative select-none ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-xs ring-2 ring-rose-300/60'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
                }`}
              >
                <span>{opt.label}</span>
                {opt.badge && !isSelected && (
                  <span className="ml-1 text-[9px] font-semibold text-rose-500 bg-rose-50 px-1 py-0.2 rounded">
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
