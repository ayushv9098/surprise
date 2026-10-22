import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Disc3 } from 'lucide-react';

// Curated royalty-free romantic & celebratory background streams (gentle, warm, non-intrusive)
const DEFAULT_TRACKS = {
  romantic: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3', // Gentle acoustic strings (107 KB)
  birthday: 'https://cdn.freesound.org/previews/541/541177_5479102-lq.mp3', // Uplifting cheerful celebration melody (222 KB)
  scrapbook: 'https://cdn.freesound.org/previews/535/535105_11203376-lq.mp3', // Nostalgic acoustic guitar (167 KB)
  apology: 'https://cdn.freesound.org/previews/266/266449_3598127-lq.mp3', // Soft calming piano (149 KB)
};

export default function AudioPlayer({ 
  audioUrl, 
  title = "Our Keepsake Melody", 
  theme = "romantic",
  accentColor = "from-rose-500 to-pink-500" 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const audioRef = useRef(null);
  const hasRetriedRef = useRef(false);

  const defaultTrack = DEFAULT_TRACKS[theme] || DEFAULT_TRACKS.romantic;
  const isSilent = audioUrl === '';

  const [hasFallenBack, setHasFallenBack] = useState(false);
  const [prevPropUrl, setPrevPropUrl] = useState(audioUrl);

  // If audioUrl prop changes externally, reset fallback
  if (audioUrl !== prevPropUrl) {
    setPrevPropUrl(audioUrl);
    setHasFallenBack(false);
  }

  useEffect(() => {
    hasRetriedRef.current = false;
  }, [audioUrl]);

  const currentSrc = isSilent ? '' : (hasFallenBack ? defaultTrack : (audioUrl || defaultTrack));

  // Gracefully fall back to default theme track if audio fails to load or play (at most once)
  const handleAudioError = () => {
    if (!hasRetriedRef.current && !hasFallenBack && defaultTrack && currentSrc !== defaultTrack) {
      hasRetriedRef.current = true;
      console.warn('Custom audio track failed to load, falling back to default theme track:', currentSrc);
      setHasFallenBack(true);
      if (audioRef.current && audioRef.current.src !== defaultTrack) {
        audioRef.current.src = defaultTrack;
        audioRef.current.load();
        if (isPlaying || hasInteracted) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      }
    } else {
      hasRetriedRef.current = true;
      setIsPlaying(false);
    }
  };

  // Attempt auto-play on first user interaction anywhere on the window
  useEffect(() => {
    const handleFirstUserTap = () => {
      if (!hasInteracted && audioRef.current && currentSrc) {
        setHasInteracted(true);
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setShowPrompt(false);
          })
          .catch(() => {
            // Autoplay may still be waiting
          });
      }
    };

    window.addEventListener('click', handleFirstUserTap, { once: true });
    window.addEventListener('touchstart', handleFirstUserTap, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstUserTap);
      window.removeEventListener('touchstart', handleFirstUserTap);
    };
  }, [hasInteracted, currentSrc]);

  const togglePlay = (e) => {
    e.stopPropagation();
    setShowPrompt(false);
    if (!audioRef.current || !currentSrc) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log('Audio playback waiting:', err);
          setIsPlaying(false);
        });
    }
  };

  if (isSilent || !currentSrc) {
    return null;
  }

  const displayTitle = hasFallenBack ? "Our Keepsake Melody" : title;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentSrc}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleAudioError}
      />

      {/* Gentle floating tooltip prompt */}
      {showPrompt && !isPlaying && (
        <div 
          onClick={togglePlay}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-medium text-slate-700 shadow-md border border-rose-100 animate-bounce cursor-pointer"
        >
          <Music className="w-3.5 h-3.5 text-rose-500" />
          <span>Tap for music 🎵</span>
        </div>
      )}

      {/* Floating Audio Button */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        className={`relative group flex items-center gap-2 p-3.5 sm:px-4 sm:py-3 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-white/80 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          isPlaying ? 'shadow-rose-300/50 ring-2 ring-rose-300/60' : 'shadow-slate-200'
        }`}
      >
        {/* Glow pulse when playing */}
        {isPlaying && (
          <span className={`absolute -inset-1 rounded-full bg-gradient-to-r ${accentColor} opacity-40 blur-sm animate-pulse-glow pointer-events-none`} />
        )}

        {/* Disc / Music icon with spin */}
        <div className={`relative w-6 h-6 flex items-center justify-center text-rose-500 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
          <Disc3 className="w-5 h-5" />
        </div>

        {/* Title and Animated Audio Bars (hidden on tiny screens) */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[11px] font-semibold text-slate-800 max-w-[120px] truncate leading-tight">
            {displayTitle}
          </span>
          <span className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
            {isPlaying ? 'Playing melody' : 'Click to play'}
          </span>
        </div>

        {/* Animated equalizer bars */}
        <div className="flex items-end gap-0.5 h-3 ml-1">
          <span className={`w-0.5 bg-rose-500 rounded-full transition-all ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
          <span className={`w-0.5 bg-pink-500 rounded-full transition-all ${isPlaying ? 'h-2 animate-pulse' : 'h-1'}`} style={{ animationDelay: '0.15s' }} />
          <span className={`w-0.5 bg-rose-400 rounded-full transition-all ${isPlaying ? 'h-3.5 animate-pulse' : 'h-1'}`} style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Volume icon indicator */}
        <div className="text-slate-500 group-hover:text-rose-500 transition-colors">
          {isPlaying ? <Volume2 className="w-4 h-4 text-rose-500" /> : <VolumeX className="w-4 h-4" />}
        </div>
      </button>
    </div>
  );
}
