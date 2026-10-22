import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { soundEffects } from '../Templates/common/SoundEffects';
import { getSongById } from '../../data/songs';
import '../Templates/common/blush-romance.css';

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

// Cycling positions and playful taunts for the Runaway "No" button
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
          <radialGradient id="phoneHeart3DGrad" cx="40%" cy="35%" r="65%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#FFAEC2" />
            <stop offset="40%" stopColor="#FF7E9F" />
            <stop offset="85%" stopColor="#F45B82" />
            <stop offset="100%" stopColor="#D93C68" />
          </radialGradient>
          <linearGradient id="phoneGlossHighlight" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="phoneSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
          fill="url(#phoneHeart3DGrad)"
        />

        {/* Gloss Reflections */}
        <path
          d="M33 17 C23 21 19 31 20 42 C20 31 27 20 39 17 C42 16.5 36 16.5 33 17 Z"
          fill="url(#phoneGlossHighlight)"
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
          fill="url(#phoneSparkleGrad)"
        />
        <path
          className="floating-sparkle sparkle-left"
          d="M12 55 Q13.5 59 17 60 Q13.5 61 12 65 Q10.5 61 7 60 Q10.5 59 12 55 Z"
          fill="url(#phoneSparkleGrad)"
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
 * Phone-Scoped Photo Lightbox Modal
 * Contained strictly within the phone screen frame
 */
function PhonePhotoLightboxModal({
  isOpen,
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const totalPhotos = photos.length;
  const currentPhoto = photos[(currentIndex % totalPhotos + totalPhotos) % totalPhotos] || photos[0];

  const [prevIndex, setPrevIndex] = useState(currentIndex);
  if (prevIndex !== currentIndex) {
    setPrevIndex(currentIndex);
    setZoomLevel(1);
  }

  if (!isOpen) return null;

  const toggleZoom = () => {
    soundEffects.playPop();
    setZoomLevel(prev => (prev > 1 ? 1 : 2.2));
  };

  return (
    <div
      className="photo-lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen photo viewer"
    >
      <header className="lightbox-topbar">
        <div className="lightbox-topbar-left">
          <div className="lightbox-counter-pill" aria-live="polite">
            <span>{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="opacity-40">/</span>
            <span>{String(totalPhotos).padStart(2, '0')}</span>
          </div>
          <span className="lightbox-brand-pill">
            <AppleEmoji emoji="🌸" size={12} />
            <span>Keepsake</span>
          </span>
        </div>

        <div className="lightbox-topbar-right">
          <button
            className={`lightbox-action-btn ${zoomLevel > 1 ? 'active-zoom' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom();
            }}
            type="button"
          >
            <span>{zoomLevel > 1 ? '1.0x' : '2.2x'}</span>
          </button>
          <button
            className="lightbox-action-btn lightbox-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.playPop();
              onClose();
            }}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <button
          className="lightbox-nav-btn lightbox-prev-btn"
          onClick={(e) => {
            e.stopPropagation();
            soundEffects.playPop();
            onPrev();
          }}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          className="lightbox-nav-btn lightbox-next-btn"
          onClick={(e) => {
            e.stopPropagation();
            soundEffects.playPop();
            onNext();
          }}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div
          className="lightbox-img-wrapper"
          style={{
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.28s cubic-bezier(0.2, 0.8, 0.25, 1)'
          }}
          onClick={toggleZoom}
        >
          <img
            key={currentPhoto.id}
            src={currentPhoto.url}
            alt={currentPhoto.caption || 'Memory'}
            className="lightbox-img"
            draggable={false}
          />
        </div>
      </div>

      <footer className="lightbox-footer">
        {currentPhoto.tag && (
          <span className="lightbox-tag-chip">
            {currentPhoto.tag.toUpperCase()}
          </span>
        )}
        <p className="lightbox-caption">
          “{renderAppleText(currentPhoto.caption || 'Special Memory', 14)}”
        </p>
      </footer>
    </div>
  );
}

/**
 * RomancePhoneView — Buttery-Smooth Romantic Phone Simulator
 * Faithfully matches BlushRomanceView and the curated keepsake aesthetic
 */
export default function RomancePhoneView({
  formData = {},
  theme = {},
  triggerConfetti: parentTriggerConfetti,
  onReset: _parentOnReset,
  activeTab: controlledTab,
  onTabChange,
  openEnvelope: controlledOpenEnvelope,
  resetNonce = 0
}) {
  const templateId = (
    formData.templateId ||
    theme.id ||
    formData.themeId ||
    formData.theme ||
    formData.category ||
    ''
  ).toLowerCase();

  const isSunset = templateId.includes('sunset');
  const isCelestial = templateId.includes('celestial');
  const themeClass = isCelestial 
    ? 'blush-theme-celestial' 
    : (isSunset ? 'blush-theme-sunset' : 'blush-theme-velvet');

  const isGirl = theme.gender === 'girl';
  const recipientName = (formData.recipientName || '').trim() || (isGirl ? 'Sarah' : 'Rohan');
  const senderName = (formData.senderName || '').trim() || (isGirl ? 'Elena' : 'Alex');

  // 1. Photos Resolution
  const rawPhotos = (formData.photos && formData.photos.length > 0)
    ? formData.photos
    : (formData.heroPhoto
        ? [{
            url: formData.heroPhoto,
            caption: formData.photoCaption !== undefined ? formData.photoCaption : 'Our Favorite Memory ❤️',
            tag: 'Forever & Always 🌸'
          }]
        : DEFAULT_ROMANCE_PHOTOS);

  const photos = rawPhotos.map((p, idx) => ({
    id: p.id || `photo-${idx + 1}`,
    url: typeof p === 'string' ? p : p.url,
    caption: (typeof p === 'object' && p.caption !== undefined) 
      ? p.caption 
      : (formData.photoCaption !== undefined ? formData.photoCaption : 'Special Moments ✨'),
    tag: (typeof p === 'object' && p.tag) ? p.tag : 'Cherished Memory 🌸'
  }));

  // 2. Letter Resolution
  const defaultLetterText = `Dear ${recipientName} 🌸,

Mere paas likhne ke liye kuch bhi nahi hai,
tu hi bata mujhe is khat me kya likhu main... 😉

(Har pal jo tere saath bitata hoon, woh mere dil ke sabse kareeb rehta hai 💖)

— With all my love, always ${senderName} 💖`;

  const rawLetter = typeof formData.letter === 'object' && formData.letter !== null && formData.letter.content !== undefined
    ? formData.letter.content
    : (typeof formData.letter === 'string' ? formData.letter : formData.letterBody);

  const letterContent = rawLetter !== undefined ? rawLetter : defaultLetterText;

  // 3. Audio & Music Player
  const resolvedSong = formData.songId ? getSongById(formData.songId, formData) : null;
  const audioUrl = formData.songUrl 
    || formData.customSongUrl 
    || formData.music?.audioUrl 
    || formData.audioUrl 
    || resolvedSong?.audioUrl 
    || 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3';

  const audioTitle = formData.customSongTitle 
    || formData.music?.title 
    || resolvedSong?.title 
    || (formData.songTitle || `${recipientName}'s Keepsake Melody 🎵`);

  // Interactive States
  const [showIntro, setShowIntro] = useState(true);
  const [isFadingIntro, setIsFadingIntro] = useState(false);
  const [isIntroCelebrating, setIsIntroCelebrating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Tab State: 'photos' | 'letter' | 'quiz' (or 'game')
  const [internalTab, setInternalTab] = useState('photos');
  const activeTabRaw = controlledTab !== undefined ? controlledTab : internalTab;
  const activeTab = activeTabRaw === 'game' ? 'quiz' : activeTabRaw;

  const handleSelectTab = (tabKey) => {
    soundEffects.playPop();
    const mapped = tabKey === 'quiz' ? 'quiz' : tabKey;
    if (onTabChange) {
      onTabChange(mapped);
    } else {
      setInternalTab(mapped);
    }
  };

  // Tab 1: Photos State
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState({});
  const [showPhotoLikePop, setShowPhotoLikePop] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Tab 2: Letter State
  const [internalLetterOpen, setInternalLetterOpen] = useState(false);
  const isLetterOpen = controlledOpenEnvelope !== undefined ? controlledOpenEnvelope : internalLetterOpen;

  // Tab 3: Quiz State (Runaway "No" Button Game!)
  const [gameVictory, setGameVictory] = useState(false);
  const [noRunawayStep, setNoRunawayStep] = useState(0);
  const [noAttempts, setNoAttempts] = useState(0);
  const [yesScale, setYesScale] = useState(1);

  // Audio and Particle Canvas Refs
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  // When resetNonce changes (e.g. reload clicked in Safari bar), reset simulator intro
  useEffect(() => {
    setShowIntro(true);
    setIsFadingIntro(false);
    setIsIntroCelebrating(false);
    setGameVictory(false);
    setNoAttempts(0);
    setNoRunawayStep(0);
    setYesScale(1);
  }, [resetNonce]);

  // If parent specifically requested letter opening, skip intro so user can edit letter
  useEffect(() => {
    if (controlledOpenEnvelope) {
      setShowIntro(false);
      setInternalLetterOpen(true);
    }
  }, [controlledOpenEnvelope]);

  // Audio celebration chime
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

  const triggerLocalConfetti = useCallback(() => {
    if (parentTriggerConfetti) {
      parentTriggerConfetti();
    } else {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { x: 0.5, y: 0.5 },
          colors: isCelestial
            ? ['#818CF8', '#A855F7', '#60A5FA', '#F472B6']
            : ['#FF1493', '#FF69B4', '#FFB6C1', '#FFFFFF', '#FFAEC2']
        });
      } catch {}
    }
  }, [parentTriggerConfetti, isCelestial]);

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
      audio.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(() => {
        setIsPlayingAudio(false);
      });
    }
  }, [isPlayingAudio]);

  // Intro "Tap to Open Surprise 🌸" handler
  const handleOpenSurprise = () => {
    if (isFadingIntro || isIntroCelebrating) return;

    soundEffects.playSealBreak();
    playCelebrationChime();
    triggerLocalConfetti();
    setIsIntroCelebrating(true);

    const audio = audioRef.current;
    if (audio) {
      try {
        audio.play().then(() => {
          setIsPlayingAudio(true);
        }).catch(() => {});
      } catch {}
    }

    setTimeout(() => {
      setIsFadingIntro(true);
    }, 200);

    setTimeout(() => {
      setShowIntro(false);
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
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 340;
      height = canvas.height = canvas.offsetHeight || 600;
    };

    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 1,
      alpha: Math.random() * 0.45 + 0.15,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.3 + 0.1),
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
      particles = Array.from({ length: 18 }, createParticle);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.phase += p.speed;
        p.x += p.vx + Math.sin(p.phase) * 0.25;
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
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isCelestial, isSunset]);

  // Tab 1: Photos Navigation
  const totalPhotosCount = photos.length;
  const activePhoto = photos[(currentPhotoIdx % totalPhotosCount + totalPhotosCount) % totalPhotosCount] || photos[0];
  const nextPhoto1 = photos[((currentPhotoIdx + 1) % totalPhotosCount + totalPhotosCount) % totalPhotosCount] || photos[0];
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
      triggerLocalConfetti();
    }
  };

  // Tab 3: Runaway "No" Button Game logic
  const handleNoRunaway = (e) => {
    if (e && e.cancelable) e.preventDefault();
    soundEffects.playPop();
    setNoRunawayStep((prev) => (prev + 1) % RUNAWAY_POSITIONS.length);
    setNoAttempts((prev) => prev + 1);
    setYesScale((prev) => Math.min(prev + 0.15, 1.75));
    triggerLocalConfetti();
  };

  const handleYesVictory = () => {
    setGameVictory(true);
    playCelebrationChime();
    triggerLocalConfetti();
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
    <div className={`romance-phone-simulator soft-app ${themeClass}`}>
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
      <aside
        className={`soft-music-pill ${isPlayingAudio ? 'is-playing' : 'is-paused'} ${showIntro ? 'pill-hidden' : 'pill-visible'}`}
        onClick={toggleAudio}
        role="button"
        tabIndex={0}
        aria-label={isPlayingAudio ? `Pause melody` : `Play melody`}
        title={isPlayingAudio ? `Pause melody` : `Play melody`}
      >
        {/* Rotating Vinyl Disc */}
        <div className="music-disc" aria-hidden="true">
          <div className="music-disc-inner">
            <span className="music-disc-center" />
          </div>
        </div>

        {/* Song Info */}
        <div className="music-info max-w-[110px] overflow-hidden">
          <span className="music-title truncate">{audioTitle}</span>
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

      {/* Intro Landing Overlay ("Tap to Open Surprise 🌸") */}
      {showIntro && (
        <div className={`soft-intro-overlay ${isFadingIntro ? 'fade-away' : ''}`}>
          {/* Celebratory Light Flash */}
          <div className={`screen-light-flash ${isIntroCelebrating ? 'flash-active' : ''}`} />

          {/* Center Card Content */}
          <div className="intro-card-inner">
            <LovableHeartGraphic />

            <h2 className="intro-cursive-text text-center text-lg sm:text-xl font-bold">
              Something special, just for you...
            </h2>

            <p className="intro-sub-text text-xs flex items-center justify-center gap-1">
              <span>Made to make you smile</span>
              <AppleEmoji emoji="🌸" size={14} />
              <AppleEmoji emoji="✨" size={14} />
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
                <AppleEmoji emoji="🌸" size={18} />
              </span>
            </button>
          </div>

          {/* Bottom Hint */}
          <div className="intro-bottom-decor">
            <p className="intro-bottom-hint text-[11px]">
              <span>Take a soft breath & tap when you're ready</span>
              <AppleEmoji emoji="🕊️" size={12} />
            </p>
          </div>
        </div>
      )}

      {/* Main Experience Container */}
      <main className="soft-main-container">
        {/* Hero Section */}
        <section className="soft-hero">
          <h1 className="soft-title text-xl font-bold flex items-center justify-center gap-1.5">
            <span>Hey {renderAppleText(recipientName)}</span>
            <AppleEmoji emoji="🌸" size={24} />
          </h1>
          <p className="soft-subtitle text-xs text-center">
            A little corner made just to bring a smile to your face
            {' '}
            <AppleEmoji emoji="🌸" size={13} />
            <AppleEmoji emoji="✨" size={13} />
          </p>
        </section>

        {/* 3 Segmented Nav Pills */}
        <nav className="soft-nav-pills" role="tablist" aria-label="Surprise sections">
          <button
            className={`nav-pill ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => handleSelectTab('photos')}
            role="tab"
            aria-selected={activeTab === 'photos'}
            type="button"
          >
            <AppleEmoji emoji="📸" size={13} />
            <span>Photos</span>
          </button>

          <button
            className={`nav-pill ${activeTab === 'letter' ? 'active' : ''}`}
            onClick={() => handleSelectTab('letter')}
            role="tab"
            aria-selected={activeTab === 'letter'}
            type="button"
          >
            <AppleEmoji emoji="💌" size={13} />
            <span>Letter</span>
          </button>

          <button
            className={`nav-pill ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => handleSelectTab('quiz')}
            role="tab"
            aria-selected={activeTab === 'quiz'}
            type="button"
          >
            <AppleEmoji emoji="🙈" size={13} />
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
                {/* Behind Card */}
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
                    soundEffects.playPop();
                    setIsLightboxOpen(true);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Tap photo to zoom in fullscreen"
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
                      type="button"
                      aria-label="Zoom photo fullscreen"
                      title="Zoom photo"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
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
                      type="button"
                      aria-label={isCurrentPhotoLiked ? 'Unlike photo' : 'Like photo'}
                      title={isCurrentPhotoLiked ? 'Liked!' : 'Like memory'}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
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
                      “{renderAppleText(activePhoto.caption, 13)}”
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </button>
            </div>
          </article>
        )}

        {/* Lightbox Zoom Modal (Scoped to phone simulator) */}
        <PhonePhotoLightboxModal
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
                <AppleEmoji emoji="💌" size={22} />
              </div>
              <h2 className="letter-heading text-base font-bold">A Piece of My Heart</h2>
              <p className="letter-subtitle text-xs flex items-center justify-center gap-1">
                <span>A secret message written just for you</span>
                <AppleEmoji emoji="🌸" size={13} />
              </p>
            </div>

            {/* Opened Handwritten Khat */}
            {isLetterOpen ? (
              <div className="khat-letter">
                <div className="khat-letter-crest text-[10px] tracking-wider mb-2">
                  <span>✦ FOR MY FAVORITE PERSON ✦</span>
                </div>

                <div className="khat-letter-body text-xs text-left leading-relaxed">
                  {letterContent.split('\n').map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) {
                      return <div key={idx} className="khat-line-gap h-2" />;
                    }
                    if (trimmed.startsWith('—')) {
                      return (
                        <div key={idx} className="khat-signature mt-3 text-right font-serif italic font-bold">
                          {renderAppleText(line, 14)}
                        </div>
                      );
                    }
                    return (
                      <p key={idx} className="khat-line my-1">
                        {renderAppleText(line, 13)}
                      </p>
                    );
                  })}
                </div>

                <div className="khat-actions mt-3">
                  <button
                    className="tactile-btn tactile-btn-secondary"
                    onClick={(e) => {
                      if (e && e.stopPropagation) e.stopPropagation();
                      soundEffects.playPop();
                      setInternalLetterOpen(false);
                    }}
                    type="button"
                  >
                    <span className="tactile-btn-shine" />
                    <span className="tactile-btn-content text-xs">
                      <span>Fold Back</span>
                      <AppleEmoji emoji="🌸" size={13} />
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* Closed Vintage Envelope */
              <div
                className="khat-envelope cursor-pointer"
                onClick={(e) => {
                  if (e && e.stopPropagation) e.stopPropagation();
                  soundEffects.playSealBreak();
                  playCelebrationChime();
                  triggerLocalConfetti();
                  setInternalLetterOpen(true);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Tap to open sealed letter for ${recipientName}`}
              >
                {/* Postage Stamp */}
                <div className="khat-postage-stamp" aria-hidden="true">
                  <span className="stamp-symbol text-xs">🌹</span>
                  <span className="stamp-text text-[8px]">SPECIAL</span>
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
                    <AppleEmoji emoji="💌" size={24} />
                  </div>
                </div>

                {/* Recipient Crest Line */}
                <p className="khat-recipient text-xs flex items-center justify-center gap-1 font-serif">
                  <span>To: {recipientName}</span>
                  <AppleEmoji emoji="💌" size={13} />
                </p>

                {/* Interactive Tap Hint */}
                <span className="khat-tap-hint text-[10px] flex items-center justify-center gap-1">
                  <span>Tap to open sealed letter</span>
                  <AppleEmoji emoji="🌸" size={12} />
                </span>
              </div>
            )}
          </article>
        )}

        {/* ============================================================
            TAB 3: QUIZ (The Runaway "No" Button Game!)
            ============================================================ */}
        {activeTab === 'quiz' && (
          <article className="soft-card quiz-card-wrapper">
            {gameVictory ? (
              /* Victory State */
              <div className="game-victory-box">
                <div className="victory-celebration-header">
                  <div className="victory-sparkle-ribbon flex items-center justify-center gap-1">
                    <AppleEmoji emoji="🎉" size={22} />
                    <AppleEmoji emoji="💖" size={26} />
                    <AppleEmoji emoji="✨" size={22} />
                  </div>
                  <div className="victory-badge-pill text-[10px]">
                    <span>✦ TREAT UNLOCKED ✦</span>
                  </div>
                </div>

                <h3 className="victory-title text-base font-bold flex items-center justify-center gap-1">
                  <span>Haha, Knew It!</span>
                  <AppleEmoji emoji="😄" size={20} />
                </h3>

                <div className="victory-love-note">
                  <p className="victory-desc text-xs text-center leading-relaxed">
                    That means one Dairy Milk Silk is officially pending from my side anytime you want! 🍫😋
                  </p>
                </div>

                {/* ★ SPECIAL DESSERT VOUCHER ★ Ticket Card */}
                <div className="chocolate-ticket-card">
                  <div className="ticket-top-tag text-[9px]">
                    <span>★ SPECIAL DESSERT VOUCHER ★</span>
                  </div>
                  <div className="ticket-main-title text-sm font-bold flex items-center justify-center gap-1">
                    <AppleEmoji emoji="🍫" size={18} />
                    <span>Dairy Milk Silk</span>
                  </div>
                  <p className="ticket-subtext text-[11px] text-center">
                    Reserved exclusively for <strong>{recipientName}</strong> 🌸
                  </p>
                  <div className="ticket-bottom-bar text-[9px]">
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
                  <span className="tactile-btn-content text-xs">
                    <span>Play Again</span>
                    <AppleEmoji emoji="🔄" size={12} />
                  </span>
                </button>
              </div>
            ) : (
              /* Game Arena */
              <>
                <div className="card-badge-icon">
                  <AppleEmoji emoji="🌸" size={22} />
                </div>
                <h2 className="quiz-heading text-base font-bold">Tell Me Truthfully...</h2>
                <p className="quiz-subtitle text-xs flex items-center justify-center gap-1">
                  <span>There is only one honest answer, so think carefully!</span>
                  <AppleEmoji emoji="💖" size={12} />
                </p>

                <div className="game-container w-full">
                  <p className="game-question text-sm font-semibold flex items-center justify-center gap-1 text-center">
                    “Do you like spending time with me?”
                    {' '}
                    <AppleEmoji emoji="🌸" size={16} />
                  </p>

                  <div className="game-action-arena">
                    {noAttempts === 0 ? (
                      /* Initial Side-by-Side Row */
                      <div className="game-buttons-row flex items-center justify-center gap-3">
                        <div className="yes-button-anchor" style={{ transform: `scale(${yesScale})` }}>
                          <button
                            className="tactile-btn tactile-btn-primary game-yes-btn"
                            onClick={handleYesVictory}
                            type="button"
                          >
                            <span className="tactile-btn-shine" />
                            <span className="tactile-btn-content text-xs font-bold">
                              <span>YES, VERY MUCH!</span>
                              <AppleEmoji emoji="🥰" size={15} />
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
                            <span className="tactile-btn-content text-xs font-bold">
                              <span>{NO_MESSAGES[0]}</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Runaway Track Arena */
                      <div className="game-runaway-arena flex flex-col items-center gap-3">
                        <div className="yes-button-anchor is-centered" style={{ transform: `scale(${yesScale})` }}>
                          <button
                            className="tactile-btn tactile-btn-primary game-yes-btn"
                            onClick={handleYesVictory}
                            type="button"
                          >
                            <span className="tactile-btn-shine" />
                            <span className="tactile-btn-content text-xs font-bold">
                              <span>YES, VERY MUCH!</span>
                              <AppleEmoji emoji="🥰" size={15} />
                            </span>
                          </button>
                        </div>

                        <div className="no-runaway-track relative w-full h-11">
                          <div
                            className="no-runaway-mover absolute transition-all duration-200"
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
                              <span className="tactile-btn-content text-xs font-bold whitespace-nowrap">
                                <span>{currentNoMsg}</span>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="game-hint text-[10px] text-center text-slate-500 mt-2">
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
