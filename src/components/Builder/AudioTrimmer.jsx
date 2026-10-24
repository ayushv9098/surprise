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
    const height = Math.min(92, Math.max(24, Math.round(raw * 100)));
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

// Snippet duration options: 15s, 30s (default), 60s, Full Song (null)
const DURATION_OPTIONS = [
  { value: 15, label: '15s', display: '15' },
  { value: 30, label: '30s', display: '30', badge: 'Default' },
  { value: 60, label: '60s', display: '60' },
  { value: null, label: 'Full', display: '∞' },
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

  // Generate unique wave bars for current song (48 bars)
  const waveBars = useMemo(() => generateWaveHeights(song.id || song.title || 'default'), [song.id, song.title]);

  // Hook / Chorus metadata
  const resolvedHookStartTime = song?.hookStartTime ?? DEFAULT_HOOKS[song?.id]?.hookStartTime;
  const resolvedHookTitle = song?.hookTitle || DEFAULT_HOOKS[song?.id]?.hookTitle;
  const hasHook = resolvedHookStartTime !== undefined && resolvedHookStartTime !== null && Boolean(resolvedHookTitle);
  const isAtHook = hasHook && Math.abs(startTime - resolvedHookStartTime) <= 1;

  // Hook position on global timeline & waveform bars
  const hookPercent = totalDuration > 0 && hasHook ? (resolvedHookStartTime / totalDuration) * 100 : 0;
  const hookBarIndex = hasHook && totalDuration > 0 ? Math.round((resolvedHookStartTime / totalDuration) * (waveBars.length - 1)) : -1;

  // Waveform track scrubbing & dragging state
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef({
    pointerX: 0,
    initialStartTime: 0,
    rectWidth: 1,
    boxWidthPx: 0,
    availableSlidePx: 1,
  });

  // Top overview track scrubbing state
  const topTrackRef = useRef(null);
  const [isTopDragging, setIsTopDragging] = useState(false);
  const topDragInfoRef = useRef({ pointerX: 0, initialStartTime: 0, rectWidth: 1 });

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
        audio.volume = 0.8;
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

  // Change duration
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

  // Tap left circular duration badge to cycle (15s -> 30s -> 60s -> Full -> 15s)
  const handleCycleDuration = () => {
    let nextVal;
    if (isFullSong) {
      nextVal = 15;
    } else if (effectiveDuration === 15) {
      nextVal = 30;
    } else if (effectiveDuration === 30) {
      nextVal = 60;
    } else {
      nextVal = null; // Full Song
    }
    handleSelectDuration(nextVal);
  };

  // 1-Click Jump to Chorus / Hook
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
      audio.volume = 0.8;
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

  // Geometry calculations for Top Overview Line
  const topStartPercent = totalDuration > 0 ? (startTime / totalDuration) * 100 : 0;
  const topWidthPercent = isFullSong ? 100 : totalDuration > 0 ? (effectiveDuration / totalDuration) * 100 : 100;

  // Geometry calculations for Bottom Waveform Floating White Box
  const windowWidthPercent = isFullSong
    ? 100
    : Math.max(22, Math.min(75, (effectiveDuration / totalDuration) * 100));
  const availableSlidePercent = 100 - windowWidthPercent;
  const visualStartPercent = maxStartTime > 0 ? (startTime / maxStartTime) * availableSlidePercent : 0;

  // Playhead progress within snippet (0% to 100%)
  const playheadProgress =
    isPlaying && effectiveDuration > 0
      ? Math.max(0, Math.min(1, (playheadTime - startTime) / effectiveDuration))
      : 0;

  // Waveform Pointer Drag Handlers
  const handlePointerDown = (e) => {
    if (e.button !== 0 || !trackRef.current || isFullSong || maxStartTime <= 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pointerX = e.clientX;
    const clickX = pointerX - rect.left;
    const boxWidthPx = (windowWidthPercent / 100) * rect.width;
    const availableSlidePx = rect.width - boxWidthPx;
    const currentBoxLeftPx = (visualStartPercent / 100) * rect.width;

    const isInsideBox = clickX >= currentBoxLeftPx && clickX <= currentBoxLeftPx + boxWidthPx;

    let initialStart = startTime;

    if (!isInsideBox) {
      // Clicked outside box: center the white box at the clicked position
      const desiredLeftPx = clickX - boxWidthPx / 2;
      const clampedLeftPx = Math.max(0, Math.min(availableSlidePx, desiredLeftPx));
      const newStart = availableSlidePx > 0 ? Math.round((clampedLeftPx / availableSlidePx) * maxStartTime) : 0;
      commitStartTime(newStart);
      initialStart = newStart;
    }

    dragInfoRef.current = {
      pointerX,
      initialStartTime: initialStart,
      rectWidth: rect.width,
      boxWidthPx,
      availableSlidePx,
    };

    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !trackRef.current || isFullSong || maxStartTime <= 0) return;
    const deltaX = e.clientX - dragInfoRef.current.pointerX;
    const availableSlidePx = dragInfoRef.current.availableSlidePx;
    if (availableSlidePx <= 0) return;

    const deltaTime = (deltaX / availableSlidePx) * maxStartTime;
    const newStart = Math.min(
      maxStartTime,
      Math.max(0, Math.round(dragInfoRef.current.initialStartTime + deltaTime))
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

  // Top Overview Track Pointer Handlers
  const handleTopPointerDown = (e) => {
    if (e.button !== 0 || !topTrackRef.current || isFullSong || maxStartTime <= 0) return;
    const rect = topTrackRef.current.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetCenterTime = clickRatio * totalDuration;
    const targetStart = Math.min(maxStartTime, Math.max(0, Math.round(targetCenterTime - effectiveDuration / 2)));

    commitStartTime(targetStart);
    topDragInfoRef.current = {
      pointerX: e.clientX,
      initialStartTime: targetStart,
      rectWidth: rect.width,
    };
    setIsTopDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleTopPointerMove = (e) => {
    if (!isTopDragging || !topTrackRef.current || isFullSong || maxStartTime <= 0) return;
    const deltaX = e.clientX - topDragInfoRef.current.pointerX;
    const deltaTime = (deltaX / topDragInfoRef.current.rectWidth) * totalDuration;
    const newStart = Math.min(
      maxStartTime,
      Math.max(0, Math.round(topDragInfoRef.current.initialStartTime + deltaTime))
    );
    commitStartTime(newStart);
  };

  const handleTopPointerUp = (e) => {
    if (isTopDragging) {
      setIsTopDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // Duration label displayed in badge
  const currentDurationLabel = isFullSong ? '∞' : effectiveDuration;

  return (
    <div className="rounded-2xl bg-[#16181d] sm:bg-[#121316] text-white border border-white/10 p-3.5 sm:p-4 shadow-xl select-none space-y-3.5 transition-all animate-fadeIn">
      {/* Visual Sub-header / Song Context */}
      <div className="flex items-center justify-between text-xs text-white/60 px-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shrink-0">
            <Music className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-white/90 text-xs truncate">
            {song?.title ? `${song.title}${song.artist ? ` • ${song.artist}` : ''}` : 'Song Snippet'}
          </span>
        </div>
        <div className="text-[11px] text-white/50 shrink-0 font-medium">
          Instagram Story Cropper
        </div>
      </div>

      {/* TOP ROW: Duration Badge, Mini Timeline Track, Play Button */}
      <div className="flex items-center justify-between gap-2.5 sm:gap-3">
        {/* Left: Circle Duration Badge / Button (Tapping cycles: 15s -> 30s -> 60s -> Full -> 15s) */}
        <button
          type="button"
          onClick={handleCycleDuration}
          title={`Snippet Duration: ${isFullSong ? 'Full Song' : `${effectiveDuration}s`} (Tap to cycle: 15s → 30s → 60s → Full)`}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/60 hover:border-white text-white text-xs font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 bg-transparent hover:bg-white/10"
        >
          {isFullSong ? (
            <span className="text-base leading-none">∞</span>
          ) : (
            <span>{currentDurationLabel}</span>
          )}
        </button>

        {/* Center: Thin Horizontal Timeline Track across Whole Song */}
        <div
          ref={topTrackRef}
          onPointerDown={handleTopPointerDown}
          onPointerMove={handleTopPointerMove}
          onPointerUp={handleTopPointerUp}
          onPointerCancel={handleTopPointerUp}
          title="Overview timeline (Click or drag to position clip)"
          className="h-[2px] sm:h-[3px] bg-white/20 rounded-full relative flex-1 mx-3 sm:mx-4 flex items-center cursor-pointer select-none touch-none"
        >
          {/* Highlighted White Segment representing Selected Clip Window */}
          <div
            style={{
              left: `${topStartPercent}%`,
              width: `${topWidthPercent}%`,
            }}
            className="h-full bg-white rounded-full pointer-events-none transition-all duration-75"
          />

          {/* Pink/Magenta Beat/Hook Dot Marker */}
          {hasHook && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleJumpToHook();
              }}
              style={{ left: `${Math.min(98, Math.max(2, hookPercent))}%` }}
              title={`✨ Jump to Chorus: "${resolvedHookTitle}" (${formatTime(resolvedHookStartTime)})`}
              className="absolute -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 border border-white shadow-xs cursor-pointer hover:scale-125 transition-transform z-20 group"
            >
              <span className="sr-only">Jump to Chorus</span>
            </button>
          )}

          {/* Playhead dot on top track when preview is active */}
          {isPlaying && (
            <div
              style={{ left: `${(playheadTime / totalDuration) * 100}%` }}
              className="absolute -translate-x-1/2 w-2 h-2 rounded-full bg-white ring-2 ring-white/50 pointer-events-none z-30 transition-none"
            />
          )}
        </div>

        {/* Right: Solid White Circular Play Button */}
        <button
          type="button"
          onClick={togglePlayPreview}
          title={isPlaying ? 'Pause snippet preview' : 'Play cropped snippet preview'}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-black flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-black text-black" />
          ) : (
            <Play className="w-4 h-4 fill-black text-black ml-0.5" />
          )}
        </button>
      </div>

      {/* BOTTOM ROW: Audio Waveform Ruler & Floating White Box */}
      <div className="relative">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative h-18 sm:h-20 w-full rounded-2xl bg-black/40 border border-white/5 overflow-hidden select-none touch-none flex items-center px-2 cursor-ew-resize group transition-all ${
            isDragging ? 'ring-1 ring-white/30' : 'hover:border-white/15'
          }`}
          title={isFullSong ? 'Full song active' : 'Drag white card or tap waveform tape to adjust clip start'}
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-radial from-rose-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Background Waveform Bars Tape (Outside active window: muted translucent white/gray) */}
          <div className="relative w-full h-full flex items-center justify-between gap-[2px] sm:gap-1 px-1 z-0 pointer-events-none">
            {waveBars.map((height, i) => {
              const isHookBar = hasHook && i === hookBarIndex;
              return (
                <div key={i} className="flex-1 flex items-center justify-center h-full min-w-[2px]">
                  <div
                    style={{ height: `${height}%` }}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isHookBar
                        ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]'
                        : 'bg-white/25 sm:bg-white/30'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* The Iconic Instagram Story Floating White Box */}
          <div
            style={{
              left: `${visualStartPercent}%`,
              width: `${windowWidthPercent}%`,
            }}
            className="absolute top-1.5 bottom-1.5 z-10 select-none cursor-grab active:cursor-grabbing transition-none"
          >
            {/* White Rounded Rectangular Card */}
            <div className="w-full h-full bg-white rounded-xl shadow-lg border border-white/90 relative overflow-hidden flex items-center">
              {/* Inside White Box: Waveform Bars (medium/light gray, aligned with background) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `-${(visualStartPercent / windowWidthPercent) * 100}%`,
                  width: `${(100 / windowWidthPercent) * 100}%`,
                }}
                className="h-full flex items-center justify-between gap-[2px] sm:gap-1 px-1 pointer-events-none"
              >
                {waveBars.map((height, i) => {
                  const isHookBar = hasHook && i === hookBarIndex;
                  return (
                    <div key={i} className="flex-1 flex items-center justify-center h-full min-w-[2px]">
                      <div
                        style={{ height: `${height}%` }}
                        className={`w-1 rounded-full ${
                          isHookBar ? 'bg-rose-500 shadow-xs' : 'bg-neutral-300 sm:bg-slate-400'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Playhead Progress Line inside White Box when Audio is Previewing */}
              {isPlaying && (
                <div
                  style={{ left: `${playheadProgress * 100}%` }}
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] z-20 pointer-events-none"
                >
                  <div className="absolute -top-0.5 -left-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shadow-xs" />
                </div>
              )}
            </div>

            {/* Left Handle Notch */}
            <div className="w-1 h-3.5 bg-neutral-300 border border-white/80 rounded-full absolute -left-1 top-1/2 -translate-y-1/2 shadow-xs pointer-events-none z-20" />

            {/* Right Handle Notch */}
            <div className="w-1 h-3.5 bg-neutral-300 border border-white/80 rounded-full absolute -right-1 top-1/2 -translate-y-1/2 shadow-xs pointer-events-none z-20" />
          </div>
        </div>
      </div>

      {/* MINIMALIST DETAILS: Timestamps, Chorus Quick Jump, and Duration Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-white/70 select-none">
        {/* Left: Timestamp indicator */}
        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-white font-semibold">
            {formatTime(startTime)} - {formatTime(endTime)}
          </span>
          <span className="text-white/30">•</span>
          <span className="text-white/60">
            {isFullSong ? 'Full Song' : `${effectiveDuration}s clip`}
          </span>

          {startTime > 0 && (
            <button
              type="button"
              onClick={handleResetToStart}
              title="Reset start time to 0:00"
              className="ml-1 inline-flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Center / Right: 1-Click Chorus / Hook Jump */}
        {hasHook && (
          <button
            type="button"
            onClick={handleJumpToHook}
            title={`Jump directly to Chorus: "${resolvedHookTitle}" (${formatTime(resolvedHookStartTime)})`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer active:scale-95 ${
              isAtHook
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 shadow-xs animate-pulse" />
            <span className="truncate max-w-[130px] sm:max-w-[180px]">
              Chorus: "{resolvedHookTitle}"
            </span>
            <span className="text-white/40 font-mono text-[10px]">
              {formatTime(resolvedHookStartTime)}
            </span>
            {isAtHook && <Check className="w-3 h-3 text-rose-400 stroke-[3]" />}
          </button>
        )}

        {/* Right: Quick Duration Chips */}
        <div className="flex items-center gap-1 ml-auto sm:ml-0">
          <span className="text-[10px] text-white/40 mr-1 hidden sm:inline">Clip:</span>
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
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-white text-black shadow-xs font-black'
                    : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
