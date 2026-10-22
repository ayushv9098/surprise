import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { soundEffects } from './common/SoundEffects';
import { getSongById } from '../../data/songs';
import './common/blush-romance.css';

// Curated romantic Unsplash memories for fallback (strictly whitelisted domain)
const DEFAULT_ROMANCE_PHOTOS = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    caption: 'The prettiest smile in the world ✨',
    tag: 'Favorite Smile 🌸'
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    caption: 'Nazrein hataana thoda mushkil hai yahan 😉✨',
    tag: 'Nazar Na Lage 🧿'
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    caption: 'Never a dull moment around you 🕶️💫',
    tag: 'Memories 📸'
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    caption: "Some moments don't need words 💫",
    tag: 'Holding Hands 🤝'
  }
];

// Cycling positions and hilarious taunts for the Runaway "No" button
const RUNAWAY_POSITIONS = ['5%', '60%', '20%', '55%', '35%', '10%'];
const NO_MESSAGES = [
  'No',
  'Think again! 😉',
  'Are you sure? 🥺',
  'Wrong button! 😂',
  'Try the other one! 💖',
  'You have no escape! 🥰'
];

/**
 * Lovable Heart Graphic SVG with glossy 3D shine and twinkling sparkles
 */
function LovableHeartGraphic() {
  return (
    <div className="lovable-graphic-container" aria-hidden="true">
      <svg className="lovable-heart-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="heart3DGrad" cx="40%" cy="35%" r="65%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#FFAEC2" />
            <stop offset="40%" stopColor="#FF7E9F" />
            <stop offset="85%" stopColor="#F45B82" />
            <stop offset="100%" stopColor="#D93C68" />
          </radialGradient>
          <linearGradient id="glossHighlight" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="100%" stopColor="#FFC837" />
          </linearGradient>
        </defs>

        {/* Glow & Base Body */}
        <path
          d="M60 98 C35 78 14 60 14 38 C14 22 26 12 40 12 C49 12 56 17 60 23 C64 17 71 12 80 12 C94 12 106 22 106 38 C106 60 85 78 60 98 Z"
          fill="#F45B82"
          opacity="0.3"
          style={{ filter: 'blur(8px)' }}
        />
        <path
          d="M60 96 C36 77 16 59 16 38 C16 23 27 13 41 13 C49.5 13 56.5 17.5 60 23.5 C63.5 17.5 70.5 13 79 13 C93 13 104 23 104 38 C104 59 84 77 60 96 Z"
          fill="url(#heart3DGrad)"
        />

        {/* Gloss Reflections */}
        <path
          d="M33 17 C23 21 19 31 20 42 C20 31 27 20 39 17 C42 16.5 36 16.5 33 17 Z"
          fill="url(#glossHighlight)"
        />
        <ellipse cx="38" cy="25" rx="10" ry="5" transform="rotate(-30 38 25)" fill="#FFFFFF" opacity="0.55" />

        {/* Happy Face */}
        <path d="M42 45 Q46 41 50 45" stroke="#4A1E2B" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M70 45 Q74 41 78 45" stroke="#4A1E2B" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="52" rx="5" ry="3" fill="#FF4F7A" opacity="0.6" />
        <ellipse cx="82" cy="52" rx="5" ry="3" fill="#FF4F7A" opacity="0.6" />
        <path d="M56 53 Q60 58 64 53" stroke="#4A1E2B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Twinkling Floating Sparkles & Mini Heart */}
        <path
          className="floating-sparkle sparkle-top"
          d="M98 16 Q100 22 106 24 Q100 26 98 32 Q96 26 90 24 Q96 22 98 16 Z"
          fill="url(#sparkleGrad)"
        />
        <path
          className="floating-sparkle sparkle-left"
          d="M12 55 Q13.5 59 17 60 Q13.5 61 12 65 Q10.5 61 7 60 Q10.5 59 12 55 Z"
          fill="url(#sparkleGrad)"
        />
        <path
          className="floating-mini-heart"
          d="M104 60 C101 57 97 59 97 62 C97 65 101 68 104 71 C107 68 111 65 111 62 C111 59 107 57 104 60 Z"
          fill="#FFAEC2"
        />
      </svg>
    </div>
  );
}

/**
 * Fullscreen Interactive Photo Lightbox with Pinch/Drag Zoom Support
 */
function PhotoLightboxModal({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const isPointerDown = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startPan = useRef({ x: 0, y: 0 });
  const deltaPan = useRef({ x: 0, y: 0 });
  const lastTapTime = useRef(0);
  const lastTapPos = useRef({ x: 0, y: 0 });

  const totalPhotos = photos.length;
  const currentPhoto = photos[(currentIndex % totalPhotos + totalPhotos) % totalPhotos] || photos[0];

  const [prevIndex, setPrevIndex] = useState(currentIndex);
  if (prevIndex !== currentIndex) {
    setPrevIndex(currentIndex);
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  }

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        soundEffects.playPop();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
        soundEffects.playPop();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
        soundEffects.playPop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  const toggleZoom = useCallback(() => {
    soundEffects.playPop();
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setPanPos({ x: 0, y: 0 });
    } else {
      setZoomLevel(2.2);
      setPanPos({ x: 0, y: 0 });
    }
  }, [zoomLevel]);

  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const now = Date.now();
    const timeDiff = now - lastTapTime.current;
    const dist = Math.hypot(e.clientX - lastTapPos.current.x, e.clientY - lastTapPos.current.y);

    if (timeDiff < 320 && dist < 28) {
      lastTapTime.current = 0;
      toggleZoom();
      isPointerDown.current = false;
      setIsDragging(false);
    } else {
      lastTapTime.current = now;
      lastTapPos.current = { x: e.clientX, y: e.clientY };
      dragStart.current = { x: e.clientX, y: e.clientY };
      startPan.current = { ...panPos };
      deltaPan.current = { x: 0, y: 0 };
      isPointerDown.current = true;
      setIsDragging(true);
    }
  };

  const handlePointerMove = (e) => {
    if (!isPointerDown.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    deltaPan.current = { x: dx, y: dy };

    if (zoomLevel > 1) {
      const maxX = Math.max(100, window.innerWidth * (zoomLevel - 1) / 1.7);
      const maxY = Math.max(100, window.innerHeight * (zoomLevel - 1) / 1.7);
      const newX = Math.max(-maxX, Math.min(maxX, startPan.current.x + dx));
      const newY = Math.max(-maxY, Math.min(maxY, startPan.current.y + dy));
      setPanPos({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (isPointerDown.current) {
      isPointerDown.current = false;
      setIsDragging(false);

      if (zoomLevel === 1) {
        const { x: dx, y: dy } = deltaPan.current;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          if (dx < 0) onNext();
          else onPrev();
          soundEffects.playPop();
        } else if (dy > 80 && dy > Math.abs(dx) * 1.5) {
          onClose();
          soundEffects.playPop();
        }
      }
      deltaPan.current = { x: 0, y: 0 };
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === containerRef.current || e.target === stageRef.current) {
      onClose();
      soundEffects.playPop();
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  const isZoomed = zoomLevel > 1;

  return createPortal(
    <div
      className="photo-lightbox-overlay"
      ref={containerRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen photo viewer"
    >
      {/* Lightbox Topbar */}
      <header className="lightbox-topbar">
        <div className="lightbox-topbar-left">
          <div className="lightbox-counter-pill" aria-live="polite">
            <span>{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="opacity-40">/</span>
            <span>{String(totalPhotos).padStart(2, '0')}</span>
          </div>
          <span className="lightbox-brand-pill">
            <AppleEmoji emoji="🌸" size={14} />
            <span>Keepsake</span>
          </span>
        </div>

        <div className="lightbox-topbar-right">
          <button
            className={`lightbox-action-btn ${isZoomed ? 'active-zoom' : ''}`}
            onClick={toggleZoom}
            type="button"
            title={isZoomed ? 'Reset Zoom (1.0x)' : 'Zoom In (2.2x)'}
            aria-label={isZoomed ? 'Reset zoom to 1.0x' : 'Zoom in to 2.2x'}
          >
            <span>{isZoomed ? '1.0x' : '2.2x'}</span>
          </button>
          <button
            className="lightbox-action-btn lightbox-close-btn"
            onClick={() => {
              onClose();
              soundEffects.playPop();
            }}
            type="button"
            title="Close viewer (Esc)"
            aria-label="Close fullscreen view"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Image Stage */}
      <div className="lightbox-stage" ref={stageRef} onClick={handleBackdropClick}>
        <button
          className="lightbox-nav-btn lightbox-prev-btn"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
            soundEffects.playPop();
          }}
          type="button"
          aria-label="Previous photo"
          title="Previous photo (←)"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          className="lightbox-nav-btn lightbox-next-btn"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
            soundEffects.playPop();
          }}
          type="button"
          aria-label="Next photo"
          title="Next photo (→)"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div
          className="lightbox-img-wrapper"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            transform: `translate3d(${panPos.x}px, ${panPos.y}px, 0) scale(${zoomLevel})`,
            transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.2, 0.8, 0.25, 1)',
            cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
          }}
        >
          <img
            key={currentPhoto.id}
            src={currentPhoto.url}
            alt={currentPhoto.caption || 'Romantic memory'}
            className="lightbox-img"
            draggable={false}
          />
        </div>
      </div>

      {/* Lightbox Footer */}
      <footer className="lightbox-footer">
        {currentPhoto.tag && (
          <span className="lightbox-tag-chip">
            {currentPhoto.tag.toUpperCase()}
          </span>
        )}
        <p className="lightbox-caption">
          “{renderAppleText(currentPhoto.caption || 'Special Memory', 17)}”
        </p>
        <div className="lightbox-hint-row">
          <span className="lightbox-hint-text">
            {isZoomed ? 'Drag to pan details • Tap 1.0x or double-tap to reset' : 'Double-tap or tap 2.2x to zoom • Swipe to browse'}
          </span>
        </div>
      </footer>
    </div>,
    document.body
  );
}

/**
 * BlushRomanceView — Modern Romantic Keepsake Experience
 * Replicates the exact UI/UX, aesthetic, and interactive features of curated keepsakes
 */
export default function BlushRomanceView({
  siteData = {},
  _onNavigateCreate,
  hideAudioPlayer = false,
  _isLiveView = false
}) {
  const rawTheme = (
    siteData.templateId || 
    siteData.themeId || 
    siteData.theme || 
    siteData.type || 
    ''
  ).toLowerCase();

  const isSunset = rawTheme.includes('sunset');
  const isCelestial = rawTheme.includes('celestial');
  const themeClass = isCelestial 
    ? 'blush-theme-celestial' 
    : (isSunset ? 'blush-theme-sunset' : 'blush-theme-velvet');

  const recipientName = (siteData.recipientName || 'My Love').trim();
  const senderName = (siteData.senderName || 'Your Favorite Person').trim();

  // 1. Photos Resolution
  const rawPhotos = (siteData.photos && siteData.photos.length > 0)
    ? siteData.photos
    : (siteData.heroPhoto
        ? [{
            url: siteData.heroPhoto,
            caption: siteData.photoCaption || 'Our Favorite Memory ❤️',
            tag: 'Forever & Always 🌸'
          }]
        : DEFAULT_ROMANCE_PHOTOS);

  const photos = rawPhotos.map((p, idx) => ({
    id: p.id || `photo-${idx + 1}`,
    url: typeof p === 'string' ? p : p.url,
    caption: (typeof p === 'object' && p.caption) ? p.caption : 'Special Moments ✨',
    tag: (typeof p === 'object' && p.tag) ? p.tag : 'Cherished Memory 🌸'
  }));

  // 2. Letter Resolution
  const defaultLetterText = `Dear ${recipientName} 🌸,

Mere paas likhne ke liye kuch bhi nahi hai,
tu hi bata mujhe is khat me kya likhu main... 😉

(Har pal jo tere saath bitata hoon, woh mere dil ke sabse kareeb rehta hai 💖)

— With all my love, always ${senderName} 💖`;

  const letterContent = (typeof siteData.letter === 'object' ? siteData.letter?.content : siteData.letter)
    || siteData.letterBody
    || defaultLetterText;

  // 3. Audio & Music Player
  const resolvedSong = siteData.songId ? getSongById(siteData.songId, siteData) : null;
  const audioUrl = siteData.songUrl 
    || siteData.customSongUrl 
    || siteData.music?.audioUrl 
    || siteData.audioUrl 
    || resolvedSong?.audioUrl 
    || 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3';

  const audioTitle = siteData.customSongTitle 
    || siteData.music?.title 
    || resolvedSong?.title 
    || (siteData.songTitle || `${recipientName}'s Keepsake Melody 🎵`);

  // Interactive States
  const [showIntro, setShowIntro] = useState(true);
  const [isFadingIntro, setIsFadingIntro] = useState(false);
  const [isIntroCelebrating, setIsIntroCelebrating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'letter' | 'game'

  // Tab 1: Photos State
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState({});
  const [showPhotoLikePop, setShowPhotoLikePop] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDeltaX = useRef(0);
  const touchDeltaY = useRef(0);
  const isSwipeNavigating = useRef(false);

  // Tab 2: Letter State
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  // Tab 3: Quiz State (Runaway "No" Button Game!)
  const [gameVictory, setGameVictory] = useState(false);
  const [noRunawayStep, setNoRunawayStep] = useState(0);
  const [noAttempts, setNoAttempts] = useState(0);
  const [yesScale, setYesScale] = useState(1);

  // Audio and Particle Canvas Refs
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  // Web Audio celebration chime
  const playCelebrationChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [
        { freq: 523.25, time: 0 },
        { freq: 659.25, time: 0.07 },
        { freq: 783.99, time: 0.14 },
        { freq: 1046.5, time: 0.22 }
      ];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
      masterGain.connect(ctx.destination);

      notes.forEach(({ freq, time }) => {
        const startTime = ctx.currentTime + time;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, startTime);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, startTime);

        gain1.gain.setValueAtTime(0.0001, startTime);
        gain1.gain.exponentialRampToValueAtTime(0.48, startTime + 0.012);
        gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.75);

        gain2.gain.setValueAtTime(0.0001, startTime);
        gain2.gain.exponentialRampToValueAtTime(0.16, startTime + 0.01);
        gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

        osc1.connect(gain1);
        gain1.connect(masterGain);
        osc2.connect(gain2);
        gain2.connect(masterGain);

        osc1.start(startTime);
        osc1.stop(startTime + 0.8);
        osc2.start(startTime);
        osc2.stop(startTime + 0.5);
      });
    } catch {
      soundEffects.playCelebration();
    }
  }, []);

  // Multi-directional confetti burst
  const triggerConfettiExplosion = useCallback((xRatio = 0.5, yRatio = 0.5) => {
    try {
      confetti({
        particleCount: 85,
        spread: 90,
        origin: { x: Math.max(0.1, Math.min(0.9, xRatio)), y: Math.max(0.1, Math.min(0.9, yRatio)) },
        colors: isCelestial 
          ? ['#818CF8', '#A855F7', '#60A5FA', '#F472B6', '#38BDF8']
          : (isSunset 
              ? ['#F59E0B', '#FBBF24', '#FB7185', '#F97316', '#F43F5E']
              : ['#FF1493', '#FF69B4', '#FFB6C1', '#FF6B81', '#FFFFFF']),
        scalar: 1.25,
        startVelocity: 26
      });
    } catch {}
  }, [isCelestial, isSunset]);

  const triggerGrandCelebration = useCallback(() => {
    try {
      const colors = isCelestial
        ? ['#818CF8', '#A855F7', '#60A5FA', '#F472B6']
        : ['#FF1493', '#FF69B4', '#FFB6C1', '#FFFFFF', '#FFAEC2'];

      confetti({
        particleCount: 110,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.8 },
        colors,
        scalar: 1.2
      });
      confetti({
        particleCount: 110,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.8 },
        colors,
        scalar: 1.2
      });
    } catch {}
  }, [isCelestial]);

  // Audio Play / Pause toggle
  const toggleAudio = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    soundEffects.playPop();

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingAudio) {
      audio.pause();
      setIsPlayingAudio(false);
    } else {
      if (audio.volume < 0.2) audio.volume = 0.7;
      audio.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((err) => {
        console.warn('Audio play notice:', err);
        setIsPlayingAudio(false);
      });
    }
  }, [isPlayingAudio]);

  // Intro "Tap to Open Surprise 🌸" handler
  const handleOpenSurprise = (e) => {
    if (isFadingIntro || isIntroCelebrating) return;

    let clickX = 0.5;
    let clickY = 0.5;
    if (e) {
      const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
      if (touch) {
        clickX = touch.clientX / window.innerWidth;
        clickY = touch.clientY / window.innerHeight;
      } else if (typeof e.clientX === 'number' && e.clientX > 0) {
        clickX = e.clientX / window.innerWidth;
        clickY = e.clientY / window.innerHeight;
      }
    }

    soundEffects.playSealBreak();
    playCelebrationChime();
    triggerConfettiExplosion(clickX, clickY);
    setIsIntroCelebrating(true);

    // Fade-in music smoothly
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.volume = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlayingAudio(true);
            let currentVol = 0;
            const targetVol = 0.7;
            const volInterval = setInterval(() => {
              if (audio) {
                currentVol = Math.min(targetVol, currentVol + 0.05);
                audio.volume = Number(currentVol.toFixed(2));
                if (currentVol >= targetVol) clearInterval(volInterval);
              } else {
                clearInterval(volInterval);
              }
            }, 60);
          }).catch(() => {
            setIsPlayingAudio(false);
          });
        }
      } catch {}
    }

    setTimeout(() => {
      setIsFadingIntro(true);
    }, 200);

    setTimeout(() => {
      setShowIntro(false);
      triggerGrandCelebration();
    }, 550);
  };

  // Canvas floating ambient flower/sparkle particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.6 + 1.2,
      alpha: Math.random() * 0.45 + 0.15,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.35 + 0.1),
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
      color: isCelestial
        ? (Math.random() > 0.5 ? '165, 180, 252' : '192, 132, 252')
        : (isSunset
            ? (Math.random() > 0.5 ? '254, 215, 170' : '253, 186, 116')
            : (Math.random() > 0.5 ? '255, 182, 193' : '255, 214, 224'))
    });

    const init = () => {
      resize();
      const count = Math.min(35, Math.floor(width / 14));
      particles = Array.from({ length: count }, createParticle);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.phase += p.speed;
        p.x += p.vx + Math.sin(p.phase) * 0.3;
        p.y += p.vy;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };

    init();
    render();
    window.addEventListener('resize', resize);
    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isCelestial, isSunset]);

  // Tab 1: Photos Navigation
  const totalPhotosCount = photos.length;
  const activePhoto = photos[(currentPhotoIdx % totalPhotosCount + totalPhotosCount) % totalPhotosCount] || photos[0];
  const nextPhoto1 = photos[((currentPhotoIdx + 1) % totalPhotosCount + totalPhotosCount) % totalPhotosCount] || photos[0];
  const nextPhoto2 = photos[((currentPhotoIdx + 2) % totalPhotosCount + totalPhotosCount) % totalPhotosCount] || photos[0];
  const isCurrentPhotoLiked = !!likedPhotos[activePhoto.id];

  const handleNextPhoto = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    soundEffects.playPop();
    setCurrentPhotoIdx((prev) => (prev + 1) % totalPhotosCount);
  };

  const handlePrevPhoto = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    soundEffects.playPop();
    setCurrentPhotoIdx((prev) => (prev - 1 + totalPhotosCount) % totalPhotosCount);
  };

  const togglePhotoLike = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    soundEffects.playPop();
    const nextVal = !isCurrentPhotoLiked;
    setLikedPhotos((prev) => ({ ...prev, [activePhoto.id]: nextVal }));

    if (nextVal) {
      setShowPhotoLikePop(true);
      setTimeout(() => setShowPhotoLikePop(false), 900);
      triggerConfettiExplosion(0.5, 0.4);
    }
  };

  // Touch Swipe Handlers for Photos
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchDeltaX.current = 0;
      touchDeltaY.current = 0;
      isSwipeNavigating.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
      touchDeltaY.current = e.touches[0].clientY - touchStartY.current;
    }
  };

  const handleTouchEnd = (e) => {
    const dx = touchDeltaX.current;
    const dy = touchDeltaY.current;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      isSwipeNavigating.current = true;
      if (dx < -40) handleNextPhoto(e);
      else handlePrevPhoto(e);
      setTimeout(() => {
        isSwipeNavigating.current = false;
      }, 350);
    }
    touchDeltaX.current = 0;
    touchDeltaY.current = 0;
  };

  // Tab 3: Runaway "No" Button Game logic
  const handleNoRunaway = (e) => {
    if (e && e.cancelable) e.preventDefault();
    soundEffects.playPop();
    setNoRunawayStep((prev) => (prev + 1) % RUNAWAY_POSITIONS.length);
    setNoAttempts((prev) => prev + 1);
    setYesScale((prev) => Math.min(prev + 0.15, 1.85)); // Grows 1.15x each attempt!
    triggerConfettiExplosion(0.5, 0.6);
  };

  const handleYesVictory = () => {
    setGameVictory(true);
    playCelebrationChime();
    triggerGrandCelebration();
    triggerConfettiExplosion(0.5, 0.5);
  };

  const handleResetGame = () => {
    soundEffects.playPop();
    setGameVictory(false);
    setNoAttempts(0);
    setNoRunawayStep(0);
    setYesScale(1);
  };

  const currentNoPos = RUNAWAY_POSITIONS[noRunawayStep % RUNAWAY_POSITIONS.length];
  const currentNoMsg = NO_MESSAGES[noAttempts % NO_MESSAGES.length];

  return (
    <div className={`soft-app ${themeClass}`}>
      {/* Background Animated Particle Canvas */}
      <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
        onPlay={() => setIsPlayingAudio(true)}
        onPause={() => setIsPlayingAudio(false)}
      />

      {/* Floating Rotating Vinyl Music Player */}
      {!hideAudioPlayer && (
        <aside
          className={`soft-music-pill ${isPlayingAudio ? 'is-playing' : 'is-paused'} ${showIntro ? 'pill-hidden' : 'pill-visible'}`}
          onClick={toggleAudio}
          role="button"
          tabIndex={0}
          aria-label={isPlayingAudio ? `Pause song ${audioTitle}` : `Play song ${audioTitle}`}
          title={isPlayingAudio ? `Pause melody` : `Play melody`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleAudio(e);
            }
          }}
        >
          {/* Rotating Vinyl Disc */}
          <div className="music-disc" aria-hidden="true">
            <div className="music-disc-inner">
              <span className="music-disc-center" />
            </div>
          </div>

          {/* Song Info */}
          <div className="music-info">
            <span className="music-title">{audioTitle}</span>
          </div>

          {/* Mini 3-bar Audio Equalizer */}
          <div className="music-equalizer" aria-hidden="true">
            <span className="eq-bar eq-bar-1" />
            <span className="eq-bar eq-bar-2" />
            <span className="eq-bar eq-bar-3" />
          </div>

          {/* Play/Pause Button */}
          <button
            type="button"
            className="music-toggle-btn"
            onClick={toggleAudio}
            aria-label={isPlayingAudio ? 'Pause music' : 'Play music'}
            tabIndex={-1}
          >
            {isPlayingAudio ? (
              <svg viewBox="0 0 24 24" className="music-toggle-icon" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1.5" />
                <rect x="14" y="4" width="4" height="16" rx="1.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="music-toggle-icon" fill="currentColor">
                <polygon points="7,4 20,12 7,20" />
              </svg>
            )}
          </button>
        </aside>
      )}

      {/* Intro Landing Overlay ("Tap to Open Surprise 🌸") */}
      {showIntro && (
        <div className={`soft-intro-overlay ${isFadingIntro ? 'fade-away' : ''}`}>
          {/* Celebratory Light Flash */}
          <div className={`screen-light-flash ${isIntroCelebrating ? 'flash-active' : ''}`} />

          {/* Center Card Content */}
          <div className="intro-card-inner">
            <LovableHeartGraphic />

            <h2 className="intro-cursive-text">
              Something special, just for you...
            </h2>

            <p className="intro-sub-text">
              <span>Made to make you smile</span>
              <AppleEmoji emoji="🌸" size={15} />
              <AppleEmoji emoji="✨" size={15} />
            </p>

            {/* Tactile Primary Button */}
            <button
              className={`tactile-btn tactile-btn-primary intro-enter-btn ${isIntroCelebrating ? 'is-pressed' : ''}`}
              onClick={handleOpenSurprise}
              aria-label="Tap to Open Surprise"
              type="button"
            >
              <span className="tactile-btn-shine" />
              <span className="tactile-btn-content">
                <span>Tap to Open Surprise</span>
                <AppleEmoji emoji="🌸" size={20} />
              </span>
            </button>
          </div>

          {/* Bottom Hint & Signature */}
          <div className="intro-bottom-decor">
            <p className="intro-bottom-hint">
              <span>Take a soft breath & tap when you're ready</span>
              <AppleEmoji emoji="🕊️" size={13} />
            </p>
            <span className="intro-bottom-signature">
              <span>Made to make you smile</span>
              <AppleEmoji emoji="🌸" size={12} />
            </span>
          </div>
        </div>
      )}

      {/* Main Experience Container */}
      <main className="soft-main-container">
        {/* Hero Section */}
        <section className="soft-hero">
          <h1 className="soft-title">
            <span>Hey {renderAppleText(recipientName)}</span>
            <AppleEmoji emoji="🌸" size={32} />
          </h1>
          <p className="soft-subtitle">
            A little corner made just to bring a smile to your face
            {' '}
            <AppleEmoji emoji="🌸" size={16} />
            <AppleEmoji emoji="✨" size={16} />
          </p>
        </section>

        {/* 3 Iconic Segmented Nav Pills */}
        <nav className="soft-nav-pills" role="tablist" aria-label="Surprise sections">
          <button
            className={`nav-pill ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => {
              soundEffects.playPop();
              setActiveTab('photos');
            }}
            role="tab"
            aria-selected={activeTab === 'photos'}
            type="button"
          >
            <AppleEmoji emoji="📸" size={14} />
            <span>Photos</span>
          </button>

          <button
            className={`nav-pill ${activeTab === 'letter' ? 'active' : ''}`}
            onClick={() => {
              soundEffects.playPop();
              setActiveTab('letter');
            }}
            role="tab"
            aria-selected={activeTab === 'letter'}
            type="button"
          >
            <AppleEmoji emoji="💌" size={14} />
            <span>Letter</span>
          </button>

          <button
            className={`nav-pill ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => {
              soundEffects.playPop();
              setActiveTab('game');
            }}
            role="tab"
            aria-selected={activeTab === 'game'}
            type="button"
          >
            <AppleEmoji emoji="🙈" size={14} />
            <span>Quiz</span>
          </button>
        </nav>

        {/* ============================================================
            TAB 1: PHOTOS
            ============================================================ */}
        {activeTab === 'photos' && (
          <article className="soft-card photo-card-wrapper">
            <div className="memory-deck-wrapper">
              <div className="memory-deck-stage">
                {/* Behind Card 2 */}
                {totalPhotosCount > 2 && (
                  <div className="memory-card card-behind-2" onClick={handleNextPhoto} aria-hidden="true">
                    <div className="washi-tape-strip" />
                    <div className="memory-card-image-box">
                      <img src={nextPhoto2.url} alt="" className="memory-card-bg-blur" />
                      <img src={nextPhoto2.url} alt="" className="memory-card-img" loading="lazy" />
                    </div>
                    <div className="memory-card-body opacity-35">
                      <span className="memory-card-tag">✨ MEMORY</span>
                      <p className="memory-card-caption">...</p>
                    </div>
                  </div>
                )}

                {/* Behind Card 1 */}
                {totalPhotosCount > 1 && (
                  <div
                    className="memory-card card-behind-1"
                    onClick={handleNextPhoto}
                    role="button"
                    tabIndex={0}
                    aria-label="Next memory preview"
                  >
                    <div className="washi-tape-strip" />
                    <div className="memory-card-image-box">
                      <img src={nextPhoto1.url} alt="" className="memory-card-bg-blur" />
                      <img src={nextPhoto1.url} alt="" className="memory-card-img" loading="lazy" />
                    </div>
                    <div className="memory-card-body opacity-55">
                      <span className="memory-card-tag">✨ NEXT MEMORY</span>
                      <p className="memory-card-caption">Tap to peek 🌸</p>
                    </div>
                  </div>
                )}

                {/* Active Foreground Polaroid Card */}
                <div
                  className="memory-card card-active"
                  onClick={() => {
                    if (!isSwipeNavigating.current) {
                      soundEffects.playPop();
                      setIsLightboxOpen(true);
                    }
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  role="button"
                  tabIndex={0}
                  aria-label="Tap photo to zoom in fullscreen, or swipe to browse"
                >
                  <div className="washi-tape-strip" />

                  <div className="memory-card-image-box">
                    {/* Zoom Button */}
                    <button
                      className="photo-card-zoom-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEffects.playPop();
                        setIsLightboxOpen(true);
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      type="button"
                      aria-label="Zoom photo fullscreen"
                      title="Zoom & Fullscreen Lightbox"
                    >
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </button>

                    {/* Like Button */}
                    <button
                      className={`polaroid-like-btn ${isCurrentPhotoLiked ? 'is-liked' : ''}`}
                      onClick={togglePhotoLike}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      type="button"
                      aria-label={isCurrentPhotoLiked ? 'Unlike photo' : 'Like photo'}
                      title={isCurrentPhotoLiked ? 'Liked!' : 'Like this memory'}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill={isCurrentPhotoLiked ? '#FF2E63' : 'rgba(255, 46, 99, 0.12)'}
                        stroke="#FF2E63"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>

                      {showPhotoLikePop && (
                        <span className="like-mini-hearts-burst" aria-hidden="true">
                          <span className="mini-heart-pop p1">💖</span>
                          <span className="mini-heart-pop p2">✨</span>
                          <span className="mini-heart-pop p3">💕</span>
                        </span>
                      )}
                    </button>

                    {/* Swipe Guide Pill */}
                    <div
                      className="photo-swipe-guide-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextPhoto(e);
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      role="button"
                      tabIndex={0}
                      aria-label="Swipe or tap to see next photo"
                    >
                      <span>{currentPhotoIdx < totalPhotosCount - 1 ? 'Swipe for more' : 'Swipe to replay'}</span>
                      <span className="opacity-40">•</span>
                      <span>{currentPhotoIdx + 1}/{totalPhotosCount}</span>
                    </div>

                    {/* Blurred BG and Main Image */}
                    <img src={activePhoto.url} alt="" className="memory-card-bg-blur" aria-hidden="true" />
                    <img
                      src={activePhoto.url}
                      alt={activePhoto.caption || 'Memory'}
                      className="memory-card-img photo-animated"
                      loading="eager"
                    />
                  </div>

                  {/* Polaroid Card Caption */}
                  <div className="memory-card-body">
                    <span className="memory-card-tag">
                      ✨ {activePhoto.tag}
                    </span>
                    <p className="memory-card-caption">
                      “{renderAppleText(activePhoto.caption, 16)}”
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tactile Controls: Prev, [ X / Y ], Next */}
            <div className="photo-controls-row">
              <button
                className="tactile-btn tactile-btn-secondary photo-nav-btn"
                onClick={handlePrevPhoto}
                aria-label="Previous photo"
                type="button"
              >
                <span className="tactile-btn-shine" />
                <span className="tactile-btn-content">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  <span>Prev</span>
                </span>
              </button>

              <div className="photo-counter-pill" aria-live="polite">
                <span>{currentPhotoIdx + 1}</span>
                <span className="opacity-40">/</span>
                <span>{totalPhotosCount}</span>
              </div>

              <button
                className="tactile-btn tactile-btn-secondary photo-nav-btn"
                onClick={handleNextPhoto}
                aria-label="Next photo"
                type="button"
              >
                <span className="tactile-btn-shine" />
                <span className="tactile-btn-content">
                  <span>Next</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </button>
            </div>
          </article>
        )}

        {/* Lightbox Zoom Portal Modal */}
        <PhotoLightboxModal
          isOpen={isLightboxOpen}
          photos={photos}
          currentIndex={currentPhotoIdx}
          onClose={() => setIsLightboxOpen(false)}
          onNext={() => setCurrentPhotoIdx((prev) => (prev + 1) % totalPhotosCount)}
          onPrev={() => setCurrentPhotoIdx((prev) => (prev - 1 + totalPhotosCount) % totalPhotosCount)}
        />

        {/* ============================================================
            TAB 2: LETTER
            ============================================================ */}
        {activeTab === 'letter' && (
          <article className="soft-card letter-card-wrapper">
            <div className="letter-header">
              <div className="card-badge-icon">
                <AppleEmoji emoji="💌" size={26} />
              </div>
              <h2 className="letter-heading">A Piece of My Heart</h2>
              <p className="letter-subtitle">
                <span>A secret message written just for you</span>
                <AppleEmoji emoji="🌸" size={15} />
              </p>
            </div>

            {/* Opened Handwritten Khat */}
            {isLetterOpen ? (
              <div className="khat-letter">
                <div className="khat-letter-crest">
                  <span>✦ FOR MY FAVORITE PERSON ✦</span>
                </div>

                <div className="khat-letter-body">
                  {letterContent.split('\n').map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) {
                      return <div key={idx} className="khat-line-gap" />;
                    }
                    if (trimmed.startsWith('—')) {
                      return (
                        <div key={idx} className="khat-signature">
                          {renderAppleText(line, 18)}
                        </div>
                      );
                    }
                    return (
                      <p key={idx} className="khat-line">
                        {renderAppleText(line, 16)}
                      </p>
                    );
                  })}
                </div>

                <div className="khat-actions">
                  <button
                    className="tactile-btn tactile-btn-secondary"
                    onClick={(e) => {
                      if (e && e.stopPropagation) e.stopPropagation();
                      soundEffects.playPop();
                      setIsLetterOpen(false);
                    }}
                    type="button"
                  >
                    <span className="tactile-btn-shine" />
                    <span className="tactile-btn-content">
                      <span>Fold Back</span>
                      <AppleEmoji emoji="🌸" size={14} />
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* Closed Vintage Envelope */
              <div
                className="khat-envelope"
                onClick={(e) => {
                  if (e && e.stopPropagation) e.stopPropagation();
                  soundEffects.playSealBreak();
                  playCelebrationChime();
                  triggerConfettiExplosion(0.5, 0.45);
                  setIsLetterOpen(true);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Tap to open sealed letter for ${recipientName}`}
              >
                {/* Postage Stamp */}
                <div className="khat-postage-stamp" aria-hidden="true">
                  <span className="stamp-symbol">🌹</span>
                  <span className="stamp-text">SPECIAL</span>
                </div>

                {/* Diagonal Crease Lines */}
                <svg className="khat-crease-lines" viewBox="0 0 320 220" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0,0 L160,110 L320,0" fill="none" stroke="rgba(255, 160, 180, 0.45)" strokeWidth="1.5" strokeDasharray="5 3" />
                  <path d="M0,220 L115,105" fill="none" stroke="rgba(255, 180, 195, 0.28)" strokeWidth="1" />
                  <path d="M320,220 L205,105" fill="none" stroke="rgba(255, 180, 195, 0.28)" strokeWidth="1" />
                </svg>

                {/* Wax Seal with Satin Ribbons */}
                <div className="khat-seal-wrapper">
                  <div className="khat-seal-ribbon ribbon-left" aria-hidden="true" />
                  <div className="khat-seal-ribbon ribbon-right" aria-hidden="true" />
                  <div className="khat-wax-seal">
                    <AppleEmoji emoji="💌" size={28} />
                  </div>
                </div>

                {/* Recipient Crest Line */}
                <p className="khat-recipient">
                  <span>To: {recipientName}</span>
                  <AppleEmoji emoji="💌" size={15} />
                </p>

                {/* Interactive Tap Hint */}
                <span className="khat-tap-hint">
                  <span>Tap to open sealed letter</span>
                  <AppleEmoji emoji="🌸" size={13} />
                </span>
              </div>
            )}
          </article>
        )}

        {/* ============================================================
            TAB 3: QUIZ (The Runaway "No" Button Game!)
            ============================================================ */}
        {activeTab === 'game' && (
          <article className="soft-card quiz-card-wrapper">
            {gameVictory ? (
              /* Victory State */
              <div className="game-victory-box">
                <div className="victory-celebration-header">
                  <div className="victory-sparkle-ribbon">
                    <AppleEmoji emoji="🎉" size={28} />
                    <AppleEmoji emoji="💖" size={32} />
                    <AppleEmoji emoji="✨" size={28} />
                  </div>
                  <div className="victory-badge-pill">
                    <span>✦ TREAT UNLOCKED ✦</span>
                  </div>
                </div>

                <h3 className="victory-title">
                  <span>Haha, Knew It!</span>
                  <AppleEmoji emoji="😄" size={26} />
                </h3>

                <div className="victory-love-note">
                  <p className="victory-desc">
                    That means one chocolate / sweet treat is officially pending from my side anytime you want! 🍫😋
                  </p>
                </div>

                {/* ★ SPECIAL DESSERT VOUCHER ★ Ticket Card */}
                <div className="chocolate-ticket-card">
                  <div className="ticket-top-tag">
                    <span>★ SPECIAL DESSERT VOUCHER ★</span>
                  </div>
                  <div className="ticket-main-title">
                    <AppleEmoji emoji="🍫" size={22} />
                    <span>Dairy Milk Silk</span>
                  </div>
                  <p className="ticket-subtext">
                    Reserved exclusively for <strong>{recipientName}</strong> 🌸
                  </p>
                  <div className="ticket-bottom-bar">
                    <span className="ticket-barcode">||| |||| || ||||| ||</span>
                    <span className="ticket-validity">Redeemable Anytime For A Sweet Treat ✨</span>
                  </div>
                </div>

                {/* Play Again Button */}
                <button
                  className="tactile-btn tactile-btn-secondary victory-replay-btn"
                  onClick={handleResetGame}
                  type="button"
                >
                  <span className="tactile-btn-shine" />
                  <span className="tactile-btn-content">
                    <span>Play Again</span>
                    <AppleEmoji emoji="🔄" size={14} />
                  </span>
                </button>
              </div>
            ) : (
              /* Game Arena */
              <>
                <div className="card-badge-icon">
                  <AppleEmoji emoji="🌸" size={26} />
                </div>
                <h2 className="quiz-heading">Tell Me Truthfully...</h2>
                <p className="quiz-subtitle">
                  <span>There is only one honest answer, so think carefully!</span>
                  <AppleEmoji emoji="💖" size={14} />
                </p>

                <div className="game-container">
                  <p className="game-question">
                    “Do you like spending time with me?”
                    {' '}
                    <AppleEmoji emoji="🌸" size={20} />
                  </p>

                  <div className="game-action-arena">
                    {noAttempts === 0 ? (
                      /* Initial Side-by-Side Row */
                      <div className="game-buttons-row">
                        <div className="yes-button-anchor" style={{ transform: `scale(${yesScale})` }}>
                          <button
                            className="tactile-btn tactile-btn-primary game-yes-btn"
                            onClick={handleYesVictory}
                            type="button"
                          >
                            <span className="tactile-btn-shine" />
                            <span className="tactile-btn-content">
                              <span>YES, VERY MUCH!</span>
                              <AppleEmoji emoji="🥰" size={18} />
                            </span>
                          </button>
                        </div>

                        <div className="no-button-anchor">
                          <button
                            className="tactile-btn tactile-btn-secondary game-no-btn"
                            onMouseEnter={handleNoRunaway}
                            onTouchStart={handleNoRunaway}
                            onClick={handleNoRunaway}
                            type="button"
                          >
                            <span className="tactile-btn-shine" />
                            <span className="tactile-btn-content">
                              <span>{NO_MESSAGES[0]}</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Runaway Track Arena */
                      <div className="game-runaway-arena">
                        <div className="yes-button-anchor is-centered" style={{ transform: `scale(${yesScale})` }}>
                          <button
                            className="tactile-btn tactile-btn-primary game-yes-btn"
                            onClick={handleYesVictory}
                            type="button"
                          >
                            <span className="tactile-btn-shine" />
                            <span className="tactile-btn-content">
                              <span>YES, VERY MUCH!</span>
                              <AppleEmoji emoji="🥰" size={18} />
                            </span>
                          </button>
                        </div>

                        <div className="no-runaway-track">
                          <div
                            className="no-runaway-mover"
                            style={{ left: currentNoPos }}
                            onMouseEnter={handleNoRunaway}
                            onTouchStart={handleNoRunaway}
                            onClick={handleNoRunaway}
                          >
                            <button
                              className="tactile-btn tactile-btn-secondary game-no-btn"
                              type="button"
                            >
                              <span className="tactile-btn-shine" />
                              <span className="tactile-btn-content">
                                <span>{currentNoMsg}</span>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="game-hint">
                    (Look, the 'No' button runs away before you can even touch it 😉)
                  </p>
                </div>
              </>
            )}
          </article>
        )}
      </main>

    </div>
  );
}
