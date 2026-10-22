import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Heart, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  RotateCcw, 
  Wand2 
} from 'lucide-react';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { soundEffects } from '../Templates/common/SoundEffects';
import { getSongById } from '../../data/songs';

// Ambient floating romantic particles drifting gracefully across the phone simulator
const ROMANTIC_PARTICLES = [
  { left: '6%', top: '8%', duration: '8.5s', delay: '0s', size: 14 },
  { left: '88%', top: '12%', duration: '9.2s', delay: '1.4s', size: 15 },
  { left: '10%', top: '44%', duration: '10s', delay: '0.8s', size: 13 },
  { left: '86%', top: '50%', duration: '8.2s', delay: '2.2s', size: 14 },
  { left: '12%', top: '80%', duration: '9.6s', delay: '1.6s', size: 13 },
  { left: '82%', top: '82%', duration: '8.8s', delay: '0.5s', size: 15 },
];

export default function RomancePhoneView({
  formData = {},
  theme = {},
  triggerConfetti,
  onReset: _onReset,
  activeTab: controlledTab,
  onTabChange,
  loveCount: controlledLoveCount,
  onShowerLove: controlledShowerLove,
}) {
  // Tab state: 'letter' | 'moments' | 'adore' | 'scratch' | 'all'
  const [internalTab, setInternalTab] = useState('letter');
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabSelect = (tabKey) => {
    soundEffects.playPop();
    if (onTabChange) {
      onTabChange(tabKey);
    } else {
      setInternalTab(tabKey);
    }
  };

  // Internal interactive states
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [photoLiked, setPhotoLiked] = useState(false);
  const [internalLoveCount, setInternalLoveCount] = useState(0);
  const loveCount = controlledLoveCount !== undefined ? controlledLoveCount : internalLoveCount;
  const [loveToast, setLoveToast] = useState(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [isOpeningEnvelope, setIsOpeningEnvelope] = useState(false);
  const [likedReasons, setLikedReasons] = useState({});
  const [isScratched, setIsScratched] = useState(false);
  const [scratchCopied, setScratchCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);

  // Audio & interaction references
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastCheckTime = useRef(0);
  const lastPhotoTapRef = useRef(0);

  const templateId = (formData.templateId || theme.id || '').toLowerCase();
  const isSunset = templateId.includes('sunset');
  const isCelestial = templateId.includes('celestial');

  const isGirl = theme.gender === 'girl';
  const recipientName = (formData.recipientName || '').trim() || (isGirl ? 'Maya' : 'Liam');
  const senderName = (formData.senderName || '').trim() || (isGirl ? 'Liam' : 'Maya');

  // Resolved audio track
  const resolvedSong = getSongById(formData.songId || 'insta-acoustic-romance', formData);
  const audioUrl = formData.songUrl || formData.customSongUrl || formData.music?.audioUrl || resolvedSong?.audioUrl || '';
  const songTitle = formData.customSongTitle || formData.music?.title || resolvedSong?.title || 'Kesariya (Acoustic Romance)';

  // Audio playback toggle
  const toggleAudio = () => {
    soundEffects.playPop();
    const audioEl = audioRef.current;
    if (audioEl && audioUrl) {
      if (audioEl.paused) {
        audioEl.play().then(() => {
          setIsPlayingAudio(true);
        }).catch(() => {
          setIsPlayingAudio(true);
        });
      } else {
        audioEl.pause();
        setIsPlayingAudio(false);
      }
    } else {
      setIsPlayingAudio((prev) => !prev);
    }
  };

  useEffect(() => {
    const audioEl = audioRef.current;
    return () => {
      if (audioEl) {
        audioEl.pause();
      }
    };
  }, []);

  // Romantic theme configurations
  const themeConfig = (() => {
    if (isCelestial) {
      return {
        id: 'celestial-love',
        badgeText: 'Written in the Stars 🌌',
        badgeBg: 'bg-indigo-950/70 text-indigo-200 border-indigo-400/30 shadow-indigo-950/30',
        headerClass: 'text-white',
        headerGlow: 'drop-shadow-[0_2px_14px_rgba(99,102,241,0.5)]',
        accentColor: 'text-indigo-300',
        bgPill: 'bg-indigo-950/60 border-indigo-500/30 text-indigo-200',
        cardBg: 'bg-slate-900/90 border-indigo-500/30 text-slate-100 shadow-[0_8px_30px_rgba(79,70,229,0.15)]',
        activeTabGradient: 'from-indigo-600 via-purple-600 to-indigo-700',
        activeTabRing: 'ring-1 ring-indigo-400/40',
        buttonClass: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/30 shadow-md border border-indigo-400/40',
        sealEmoji: '🌙',
        waxSealBg: 'wax-seal-celestial border-2 border-indigo-200/50 text-indigo-100',
        envelopeBg: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-indigo-500/30',
        particleItems: ['🌌', '🌙', '⭐', '✨', '💫', '💙'],
        tapeClass: 'washi-tape-blue',
        scratchSecret: '1x Stargazing Drive + Midnight Conversations Under the Moon 🌙✨',
        scratchCode: 'STARS-FOREVER-2026',
        scratchGradColors: ['#e0e7ff', '#818cf8', '#4338ca', '#312e81'],
        loveWhispers: [
          'Written in the stars forever 🌌💫',
          'Across a thousand lifetimes, I choose you 🌙',
          'You are my universe ✨',
          'To infinity and beyond with you 💫',
          'Our souls were meant to meet 💙'
        ],
        defaultSubtitle: "In a universe of billions of galaxies, my heart was always destined to find you.",
        defaultReasons: [
          { title: "Cosmic Connection", desc: "Our souls connected as if we had known each other across a thousand lifetimes.", icon: "🌌" },
          { title: "Midnight Peace", desc: "Whenever the world gets loud, being in your arms feels like stillness under the stars.", icon: "🌙" },
          { title: "Written Destiny", desc: "Out of eight billion people on Earth, meeting you was my universe's greatest gift.", icon: "💫" },
        ],
        defaultLetter: `My beloved ${recipientName},\n\nThey say the odds of finding your true soulmate are one in a billion. But from the first second our eyes met, I knew our love was written in the stars long before we ever arrived.\n\nThank you for your infinite kindness, your breathtaking grace, and for loving me completely. May our love continue shining brighter than every constellation in the night sky.\n\nAcross the stars forever,\n${senderName} 🌙`,
      };
    }

    if (isSunset) {
      return {
        id: 'sunset-romance',
        badgeText: 'Golden Hour Keepsake 🌅',
        badgeBg: 'bg-amber-50/90 text-amber-800 border-amber-300/60 shadow-amber-900/5',
        headerClass: 'text-amber-950',
        headerGlow: 'drop-shadow-[0_2px_12px_rgba(245,158,11,0.3)]',
        accentColor: 'text-amber-600',
        bgPill: 'bg-amber-100/70 border-amber-300/60 text-amber-900',
        cardBg: 'bg-[#FFFDF9] border-amber-200/80 text-slate-800 shadow-[0_8px_30px_rgba(245,158,11,0.08)]',
        activeTabGradient: 'from-amber-500 via-orange-500 to-rose-500',
        activeTabRing: 'ring-1 ring-amber-400/40',
        buttonClass: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25 shadow-md border border-amber-300/40',
        sealEmoji: '✨',
        waxSealBg: 'wax-seal-gold border-2 border-amber-200/60 text-amber-100',
        envelopeBg: 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0] border-amber-200/80',
        particleItems: ['🌅', '✨', '🧡', '💛', '💫', '🥂'],
        tapeClass: 'washi-tape',
        scratchSecret: '1x Sunset Walk + Warm Coffee & Pastries on Me! ☕🌅',
        scratchCode: 'GOLDEN-HOUR-2026',
        scratchGradColors: ['#fef3c7', '#f59e0b', '#d97706', '#fbbf24'],
        loveWhispers: [
          'You are my golden hour! 🌅✨',
          'Every sunset is sweeter with you 🧡',
          'My brightest sunshine ☀️',
          'Forever warm beside you 🥂',
          'My favorite adventure partner 🌅'
        ],
        defaultSubtitle: "From our very first hello to forever and beyond, every sunset is brighter with you.",
        defaultReasons: [
          { title: "Golden Warmth", desc: "Your radiant smile brings golden hour warmth into my life no matter the season.", icon: "🌅" },
          { title: "Guiding Light", desc: "You are the calm in my storm and the brightest light guiding me forward.", icon: "✨" },
          { title: "Tender Promises", desc: "The quiet promises kept and the steady peace you bring to my heart every day.", icon: "🧡" },
        ],
        defaultLetter: `Dearest ${recipientName},\n\nFrom the moment you smiled at me, my world lit up like a breathtaking sunset. You are my calm sanctuary, my favorite adventure, and my golden hour every single day.\n\nThank you for being the sweetest part of my days and for filling our life with laughter and tenderness. I adore you beyond words.\n\nAlways & forever yours,\n${senderName} 🌅✨`,
      };
    }

    // Default: Velvet / Blush Luxury Romance
    return {
      id: 'velvet-romance',
      badgeText: 'Forever in My Heart ❤️',
      badgeBg: 'bg-rose-50/90 text-rose-800 border-rose-300/60 shadow-rose-900/5',
      headerClass: 'text-rose-950',
      headerGlow: 'drop-shadow-[0_2px_12px_rgba(225,29,72,0.3)]',
      accentColor: 'text-rose-600',
      bgPill: 'bg-rose-100/70 border-rose-300/60 text-rose-900',
      cardBg: 'bg-[#FFFDFD] border-rose-200/80 text-slate-800 shadow-[0_8px_30px_rgba(244,63,94,0.07)]',
      activeTabGradient: 'from-rose-500 via-rose-600 to-pink-600',
      activeTabRing: 'ring-1 ring-rose-400/40',
      buttonClass: 'bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-500/25 shadow-md border border-rose-300/40',
      sealEmoji: '❤️',
      waxSealBg: 'wax-seal border-2 border-rose-200/60 text-rose-100',
      envelopeBg: 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0] border-rose-200/80',
      particleItems: ['❤️', '🌹', '✨', '💖', '💌', '🌷'],
      tapeClass: 'washi-tape-pink',
      scratchSecret: 'Unlimited cuddles, late-night dessert runs & loving you forever! 🍨🌹',
      scratchCode: 'LOVE-FOREVER-2026',
      scratchGradColors: ['#ffe4e6', '#fb7185', '#e11d48', '#fbcfe8'],
      loveWhispers: [
        'You have my whole heart ❤️',
        'Loving you is effortless 🌹',
        'My favorite human in the world 🥰',
        'To all our tomorrows together 💕',
        'Every second with you is magic ✨',
        'Forever & always my soulmate 💍'
      ],
      defaultSubtitle: "In a world of billions of people, my happiest place will always be right beside you.",
      defaultReasons: [
        { title: "Your Radiant Smile", desc: "How it effortlessly turns even my most exhausting day into pure joy.", icon: "✨" },
        { title: "Your Gentle Soul", desc: "The quiet kindness and endless warmth you show to everyone around you.", icon: "🌸" },
        { title: "Our Inside Jokes", desc: "How a single glance from across the room can make us burst into giggles.", icon: "💫" },
      ],
      defaultLetter: `My Love,\n\nLooking back at our journey together, every single moment by your side has been a treasure. You bring warmth, laughter, and an unspoken comfort into my life that nothing else could ever replace.\n\nThank you for choosing me, for holding my hand through everything, and for filling my heart with peace and romance.\n\nI love you more than words could ever fit on this page, today and for all the tomorrows to come.\n\nForever yours,\n${senderName} ❤️`,
    };
  })();

  // Shower Love reaction handler
  const handleShowerLove = () => {
    soundEffects.playCelebration();
    const nextCount = loveCount + 1;
    if (controlledShowerLove) {
      controlledShowerLove();
    } else {
      setInternalLoveCount(nextCount);
    }

    const msg = themeConfig.loveWhispers[loveCount % themeConfig.loveWhispers.length];
    setLoveToast(msg);
    setTimeout(() => setLoveToast(null), 2400);

    if (triggerConfetti) {
      triggerConfetti();
    }
  };

  // Toggle devotion card like
  const toggleReasonLike = (idx) => {
    soundEffects.playPop();
    setLikedReasons((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Envelope wax seal breaking with tactile animation
  const handleOpenEnvelope = () => {
    if (envelopeOpen || isOpeningEnvelope) return;
    setIsOpeningEnvelope(true);
    soundEffects.playSealBreak();
    if (triggerConfetti) triggerConfetti();
    setTimeout(() => {
      setEnvelopeOpen(true);
      setIsOpeningEnvelope(false);
    }, 450);
  };

  // Scratch card canvas foil initialization
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 250;
    const height = 124;
    canvas.width = width;
    canvas.height = height;

    // Metallic luxury gradient foil
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, themeConfig.scratchGradColors[0]);
    grad.addColorStop(0.35, themeConfig.scratchGradColors[1]);
    grad.addColorStop(0.7, themeConfig.scratchGradColors[2]);
    grad.addColorStop(1, themeConfig.scratchGradColors[3]);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle inner foil shine
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(9, 9, width - 18, height - 18);

    // Romantic Typography on foil
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH WITH LOVE ✨', width / 2, height / 2 - 5);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.font = '8.5px sans-serif';
    ctx.fillText('Rub gently to reveal our secret promise', width / 2, height / 2 + 10);
  }, [themeConfig]);

  useEffect(() => {
    if (!isScratched && (activeTab === 'scratch' || activeTab === 'all')) {
      const timer = setTimeout(initCanvas, 60);
      return () => clearTimeout(timer);
    }
  }, [initCanvas, isScratched, activeTab]);

  // Check scratch completion
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let transparentPixels = 0;
      const totalSampled = data.length / 16;

      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) {
          transparentPixels++;
        }
      }

      const percent = Math.round((transparentPixels / totalSampled) * 100);
      if (percent >= 40 && !isScratched) {
        soundEffects.playCelebration();
        setIsScratched(true);
        if (triggerConfetti) triggerConfetti();
      }
    } catch {
      // Safe fallback
    }
  }, [isScratched, triggerConfetti]);

  const handleCanvasScratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    soundEffects.playScratch();

    const now = Date.now();
    if (now - lastCheckTime.current > 160) {
      lastCheckTime.current = now;
      checkScratchPercentage();
    }
  };

  // Coordinate mapping under CSS scale
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: 0, y: 0 };

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const handlePointerDown = (e) => {
    isDrawing.current = true;
    const { x, y } = getCanvasCoords(e);
    handleCanvasScratch(x, y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    handleCanvasScratch(x, y);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  const handleInstantReveal = () => {
    if (isScratched) return;
    soundEffects.playCelebration();
    setIsScratched(true);
    if (triggerConfetti) triggerConfetti();
  };

  const handleResetScratch = () => {
    setIsScratched(false);
    setTimeout(initCanvas, 50);
  };

  const handleCopyVoucher = () => {
    const code = themeConfig.scratchCode;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setScratchCopied(true);
    soundEffects.playPop();
    setTimeout(() => setScratchCopied(false), 2000);
  };

  // Photo adoration reactions (double tap & click)
  const triggerPhotoLike = () => {
    soundEffects.playCelebration();
    setPhotoLiked(true);
    if (controlledShowerLove) {
      controlledShowerLove();
    } else {
      setInternalLoveCount((c) => c + 1);
    }
    setTimeout(() => setPhotoLiked(false), 1200);
  };

  const handlePhotoClick = () => {
    const now = Date.now();
    if (now - lastPhotoTapRef.current < 350) {
      triggerPhotoLike();
    } else {
      soundEffects.playPop();
      setPhotoLiked(true);
      setTimeout(() => setPhotoLiked(false), 900);
    }
    lastPhotoTapRef.current = now;
  };

  // Content resolution
  const reasons = (formData.specialReasons && formData.specialReasons.length > 0)
    ? formData.specialReasons
    : (formData.loveReasons && formData.loveReasons.length > 0)
    ? formData.loveReasons
    : themeConfig.defaultReasons;

  const letterBody = (typeof formData.letter === 'object' ? formData.letter?.content : formData.letter) 
    || formData.letterBody 
    || themeConfig.defaultLetter;

  const letterSignOff = (typeof formData.letter === 'object' ? formData.letter?.signOff : null)
    || formData.letterSignOff
    || `Forever & Always,\n${senderName} ❤️🌹`;

  const photos = (formData.photos && formData.photos.length > 0)
    ? formData.photos
    : [
        {
          url: formData.heroPhoto || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
          caption: formData.photoCaption || 'My favorite smile in the world 🌹',
          tag: 'Day One'
        },
        {
          url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
          caption: 'Golden sunsets by your side 🌅',
          tag: 'Pure Magic'
        }
      ];

  const currentPhoto = photos[activePhotoIdx % photos.length];

  return (
    <div className="flex-1 w-full min-h-0 flex flex-col justify-between overflow-y-auto custom-scrollbar relative z-20 select-none pb-1">
      {/* Hidden audio element for preview */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          loop
          preload="metadata"
        />
      )}

      {/* Floating Gentle Love Particles */}
      {ROMANTIC_PARTICLES.map((p, idx) => (
        <div
          key={idx}
          className="absolute pointer-events-none select-none z-10 opacity-50"
          style={{
            left: p.left,
            top: p.top,
            animation: `floatGentleAnim ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        >
          <AppleEmoji emoji={themeConfig.particleItems[idx % themeConfig.particleItems.length]} size={p.size} />
        </div>
      ))}

      {/* Floating Love Toast Notification */}
      {loveToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 text-white text-[10.5px] font-semibold shadow-xl border border-rose-400/40 backdrop-blur-md">
            <Heart className="w-3 h-3 text-rose-500 fill-current animate-pulse" />
            <span>{loveToast}</span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. STREAMLINED LUXURY HEADER: SLEEK AUDIO PILL & SEGMENTED TABS */}
      {/* =================================================================== */}
      <div className="px-2.5 pt-1.5 shrink-0 z-30 space-y-1.5">
        {/* Sleek Mini Audio Pill Header Bar */}
        <div className="w-full flex items-center justify-between px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-rose-200/70 shadow-2xs">
          {/* Subtle Occasion Indicator */}
          <div className="flex items-center gap-1 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[9.5px] font-bold text-slate-800 tracking-tight truncate">
              {formData.occasion || 'Romantic Keepsake'}
            </span>
          </div>

          {/* Interactive Mini Audio Equalizer Pill */}
          <button
            type="button"
            onClick={toggleAudio}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50/80 hover:bg-rose-100/90 border border-rose-200/70 text-rose-800 text-[9px] font-medium transition-all active:scale-95 cursor-pointer max-w-[150px]"
            title={isPlayingAudio ? 'Pause Keepsake Melody' : 'Play Keepsake Melody'}
          >
            {isPlayingAudio ? (
              <div className="flex items-center gap-0.5 h-2.5 shrink-0">
                <span className="w-0.5 h-2.5 bg-rose-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                <span className="w-0.5 h-1.5 bg-rose-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.2s]" />
                <span className="w-0.5 h-2.5 bg-rose-600 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.4s]" />
              </div>
            ) : (
              <Play className="w-2.5 h-2.5 fill-current text-rose-600 shrink-0" />
            )}
            <span className="truncate">{songTitle}</span>
            {isPlayingAudio ? (
              <Pause className="w-2.5 h-2.5 text-rose-600/70 shrink-0" />
            ) : null}
          </button>
        </div>

        {/* Clean Modern Segmented Pill Tabs (No cramped vertical stacking) */}
        <div className="w-full flex items-center justify-between p-0.5 rounded-full bg-white/85 backdrop-blur-md border border-rose-200/70 shadow-2xs text-[9.5px]">
          {[
            { key: 'letter', label: 'Letter', icon: '💌' },
            { key: 'moments', label: 'Story', icon: '📸' },
            { key: 'adore', label: 'Adore', icon: '❤️' },
            { key: 'scratch', label: 'Secret', icon: '🎁' },
            { key: 'all', label: 'All', icon: '📜' },
          ].map((tab) => {
            const isTabActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabSelect(tab.key)}
                className={`flex-1 py-1 px-1 rounded-full transition-all text-center flex items-center justify-center gap-1 cursor-pointer select-none ${
                  isTabActive
                    ? `bg-gradient-to-r ${themeConfig.activeTabGradient} text-white shadow-xs font-bold ${themeConfig.activeTabRing}`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50/50 font-medium'
                }`}
              >
                <span className="text-[11px] leading-none shrink-0">{tab.icon}</span>
                <span className="text-[9px] font-semibold tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. DEDICATED ROMANTIC CONTENT PANELS */}
      {/* =================================================================== */}
      <div className="flex-1 min-h-0 w-full px-2.5 py-2 overflow-y-auto custom-scrollbar flex flex-col items-center text-center">
        
        {/* TAB 1: LOVE LETTER & HERO HEADER (or in 'all' view) */}
        {(activeTab === 'letter' || activeTab === 'all') && (
          <div className="w-full flex flex-col items-center animate-fadeInSmooth mb-4">
            {/* Hero Romantic Card with Soft Lighting */}
            <div className={`w-full rounded-2xl p-3.5 border text-center transition-all ${themeConfig.cardBg} mb-3 relative overflow-hidden`}>
              {/* Soft ambient lighting top shine */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-300/40 to-transparent pointer-events-none" />

              {/* Romantic Date Badge */}
              <div className="inline-flex items-center justify-center mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold border flex items-center gap-1 tracking-wide uppercase ${themeConfig.badgeBg}`}>
                  <span>✨</span>
                  <span>{formData.date || 'Forever & Always'}</span>
                  <span>✨</span>
                </span>
              </div>

              {/* Romantic Title with Flowing Cursive */}
              <h1 className={`font-cursive text-xl sm:text-2xl font-bold tracking-tight leading-snug break-words ${themeConfig.headerClass} ${themeConfig.headerGlow}`}>
                <span className="block text-slate-800 text-base font-serif font-normal italic mb-0.5">To My One & Only,</span>
                <span className={`${themeConfig.accentColor} inline-flex items-center gap-1`}>
                  {recipientName} ❤️
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-[10px] text-slate-500 mt-1 italic leading-snug px-2 max-w-[240px] mx-auto break-words">
                "{formData.subtitle || themeConfig.defaultSubtitle}"
              </p>

              {/* Shower Love Reaction Button */}
              <div className="mt-2.5 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleShowerLove}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold transition-transform active:scale-95 cursor-pointer shadow-sm ${themeConfig.buttonClass}`}
                  title="Tap to shower love and send hearts"
                >
                  <Heart className="w-3.5 h-3.5 fill-current animate-pulse text-white" />
                  <span>Shower Love</span>
                  {loveCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white/30 text-[9px] font-mono">
                      {loveCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Interactive Wax-Sealed Love Envelope */}
            <div className="w-full max-w-[260px] mx-auto">
              {!envelopeOpen ? (
                /* 3D EMBOSSED WAX-SEALED ENVELOPE */
                <div
                  onClick={handleOpenEnvelope}
                  className={`group relative w-full rounded-2xl p-4 shadow-xl border cursor-pointer select-none transition-all duration-300 hover:scale-[1.02] active:scale-95 ${themeConfig.envelopeBg} ${
                    isOpeningEnvelope ? 'scale-95 brightness-110 shadow-2xl' : ''
                  }`}
                  title="Tap wax seal to unfold handwritten letter"
                >
                  {/* Decorative envelope triangular flap fold */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-100/30 to-amber-200/20 shadow-xs border-b border-amber-300/30 pointer-events-none rounded-t-2xl"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                    }}
                  />

                  {/* Centered 3D Wax Seal */}
                  <div className="relative pt-6 pb-2 flex flex-col items-center justify-center">
                    <div
                      className={`w-14 h-14 rounded-full shadow-xl relative flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-90 ${themeConfig.waxSealBg} ${
                        isOpeningEnvelope ? 'scale-125 rotate-6 ring-4 ring-amber-300/60 animate-pulse' : ''
                      }`}
                    >
                      {/* Inner embossed medallion ring */}
                      <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center shadow-inner">
                        <span className="text-xl select-none filter drop-shadow-sm leading-none flex items-center justify-center">
                          <AppleEmoji emoji={themeConfig.sealEmoji} size={22} />
                        </span>
                      </div>

                      {/* Sparkle ping */}
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                      </div>

                      {/* Tactile Seal Crack Effect during opening */}
                      {isOpeningEnvelope && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-full h-0.5 bg-white/95 rotate-45 animate-ping" />
                        </div>
                      )}
                    </div>

                    {/* Interactive hint prompt badge */}
                    <div className="mt-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-amber-200/60 text-[10px] font-bold text-slate-800 shadow-xs flex items-center gap-1">
                      <span>{isOpeningEnvelope ? 'Breaking wax seal...' : 'Tap wax seal to open'}</span>
                      <span>✨</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* UNSEALED VINTAGE TEXTURED PARCHMENT LOVE LETTER */
                <div className="w-full bg-[#FFFDF9] paper-parchment rounded-2xl p-4 shadow-xl border-2 border-amber-200/80 text-left relative overflow-hidden animate-fadeInSmooth text-slate-800">
                  {/* Vintage airmail corner stamp */}
                  <div className="absolute top-3 right-3 flex flex-col items-end pointer-events-none">
                    <div className="w-10 h-12 rounded border border-dashed border-amber-700/40 p-1 flex flex-col items-center justify-center text-amber-800/80 rotate-2 bg-amber-50/70 shadow-2xs">
                      <Heart className="w-3 h-3 fill-amber-700/60 text-amber-700" />
                      <span className="text-[6.5px] font-bold mt-0.5 font-sans">AIR MAIL</span>
                      <span className="text-[6.5px] font-sans truncate max-w-[34px]">{formData.date || 'FOREVER'}</span>
                    </div>
                  </div>

                  {/* Letter Header */}
                  <div className="border-b border-amber-900/10 pb-2 mb-2 pr-12">
                    <p className="font-serif text-sm font-bold text-rose-950">
                      Dearest {recipientName},
                    </p>
                    <p className="text-[8.5px] uppercase tracking-wider text-rose-600/70 font-sans mt-0.5">
                      {formData.date || 'Forever & Always'}
                    </p>
                  </div>

                  {/* Letter Body in Romantic Handwritten Cursive */}
                  <div className="font-cursive text-[13px] leading-relaxed text-slate-700 max-h-48 overflow-y-auto custom-scrollbar pr-1 whitespace-pre-line break-words">
                    {renderAppleText(letterBody, 13)}
                  </div>

                  {/* Letter Signature */}
                  <div className="pt-2 mt-2 border-t border-amber-900/10 text-right">
                    <p className="font-cursive text-xs font-bold text-rose-900 leading-snug whitespace-pre-line break-words">
                      {renderAppleText(letterSignOff, 13)}
                    </p>
                  </div>

                  {/* Action Buttons Below Letter */}
                  <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setEnvelopeOpen(false)}
                      className="py-1 px-2.5 rounded-full text-[9.5px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer active:scale-95 transition-transform shadow-2xs"
                    >
                      Reseal 💌
                    </button>
                    {activeTab !== 'all' && (
                      <button
                        type="button"
                        onClick={() => handleTabSelect('moments')}
                        className="py-1 px-3 rounded-full text-[9.5px] font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 shadow-xs cursor-pointer active:scale-95 transition-transform flex items-center gap-1"
                      >
                        <span>Our Story</span>
                        <span>📸 ➔</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: OUR CHERISHED MEMORIES POLAROID REEL (or in 'all' view) */}
        {(activeTab === 'moments' || activeTab === 'all') && (
          <div className="w-full flex flex-col items-center animate-fadeInSmooth mb-4">
            {/* Chapter Header */}
            <div className="text-center mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${themeConfig.badgeBg}`}>
                Chapter 2 • Captured Moments
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1 flex items-center justify-center gap-1">
                <span>Our Cherished Memories</span>
                <span>📸</span>
              </h2>
              <p className="text-[10px] text-slate-500">Every picture holds a thousand loving words</p>
            </div>

            {/* Realistic Polaroid Card with Washi Tape */}
            <div className="relative w-full max-w-[235px] bg-[#FCFBF9] p-2.5 pb-4 rounded-sm shadow-xl border border-amber-200/50 text-slate-800 rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
              {/* Textured Washi Tape on top */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 border rounded-xs shadow-2xs rotate-[-2deg] z-10 ${themeConfig.tapeClass}`}
              />

              {/* Photo Frame Container */}
              <div
                onClick={handlePhotoClick}
                onDoubleClick={triggerPhotoLike}
                className="relative w-full aspect-square rounded-xs overflow-hidden bg-slate-100 my-1 cursor-pointer group shadow-inner"
                title="Double tap or click to send love to this photo"
              >
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.caption || recipientName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Heart Burst Flash Overlay */}
                {photoLiked && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center animate-in zoom-in-50 duration-200 z-20">
                    <Heart className="w-12 h-12 text-rose-500 fill-current animate-ping" />
                  </div>
                )}

                {/* Photo Pagination badge */}
                {photos.length > 1 && (
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-black/60 text-white text-[8px] font-mono backdrop-blur-xs">
                    {activePhotoIdx + 1}/{photos.length}
                  </div>
                )}
              </div>

              {/* Polaroid Handwritten Caption */}
              <p className="font-cursive text-xs text-slate-800 text-center px-1 mt-1 font-semibold leading-snug line-clamp-2 break-words">
                "{currentPhoto.caption || formData.photoCaption || 'Forever & Always With You! ❤️🌹'}"
              </p>
              <div className="text-[8.5px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full inline-block mt-1 font-sans border border-rose-200/60">
                ✨ {currentPhoto.tag || 'Cherished Moment'} ✨
              </div>
            </div>

            {/* Carousel Controls & Like Photo Button */}
            <div className="mt-2.5 flex items-center justify-center gap-2">
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
                  }}
                  className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                  title="Previous Photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={triggerPhotoLike}
                className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[10px] font-bold text-rose-700 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-2xs"
              >
                <Heart className={`w-3.5 h-3.5 text-rose-500 ${photoLiked ? 'fill-current animate-ping' : ''}`} />
                <span>Adore Photo</span>
              </button>

              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
                  }}
                  className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                  title="Next Photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {activeTab !== 'all' && (
              <button
                type="button"
                onClick={() => handleTabSelect('adore')}
                className="mt-2 text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Why I Adore You</span>
                <span>❤️ ➔</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 3: REASONS WHY I ADORE YOU (or in 'all' view) */}
        {(activeTab === 'adore' || activeTab === 'all') && (
          <div className="w-full flex flex-col items-center animate-fadeInSmooth mb-4">
            {/* Chapter Header */}
            <div className="text-center mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${themeConfig.badgeBg}`}>
                Chapter 3 • Devotion
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1 flex items-center justify-center gap-1">
                <span>Why I Adore You</span>
                <span>❤️</span>
              </h2>
              <p className="text-[10px] text-slate-500">Tap any card to save your favorite memory</p>
            </div>

            {/* Devotion Cards Grid */}
            <div className="w-full space-y-2">
              {reasons.map((item, idx) => {
                const isLiked = !!likedReasons[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleReasonLike(idx)}
                    className={`w-full rounded-2xl p-3 border transition-all text-left flex items-start gap-2.5 cursor-pointer relative shadow-2xs hover:shadow-sm select-none active:scale-[0.98] ${
                      isLiked 
                        ? 'border-rose-400/80 bg-rose-50/70 shadow-rose-500/5' 
                        : 'bg-white/85 backdrop-blur-md border-rose-100/90 hover:border-rose-300'
                    }`}
                  >
                    {/* Cute Reason Emoji Medallion */}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-50 to-pink-100/70 border border-rose-200/70 flex items-center justify-center shrink-0 text-lg shadow-2xs">
                      <AppleEmoji emoji={item.icon || '❤️'} size={18} />
                    </div>

                    {/* Reason Text */}
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-xs font-bold text-slate-900 leading-tight break-words">
                        {renderAppleText(item.title)}
                      </h3>
                      <p className="text-[10px] text-slate-600 mt-0.5 leading-snug break-words">
                        {renderAppleText(item.desc)}
                      </p>
                    </div>

                    {/* Heart Tap Icon */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReasonLike(idx);
                      }}
                      className={`p-1.5 rounded-full transition-transform cursor-pointer active:scale-90 ${
                        isLiked ? 'text-rose-500 scale-110' : 'text-slate-300 hover:text-rose-400'
                      }`}
                      aria-label="Adore this reason"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                    </button>

                    {/* Adored Tag */}
                    {isLiked && (
                      <div className="absolute top-1.5 right-8 text-[8px] font-bold text-rose-600 animate-in fade-in">
                        Adored ❤️
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {activeTab !== 'all' && (
              <button
                type="button"
                onClick={() => handleTabSelect('scratch')}
                className="mt-2 text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Secret Love Promise</span>
                <span>🎁 ➔</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 4: SECRET LOVE SCRATCH CARD (or in 'all' view) */}
        {(activeTab === 'scratch' || activeTab === 'all') && (
          <div className="w-full flex flex-col items-center animate-fadeInSmooth mb-4">
            {/* Chapter Header */}
            <div className="text-center mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${themeConfig.badgeBg}`}>
                Chapter 4 • Special Keepsake
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1 flex items-center justify-center gap-1">
                <span>A Secret Love Promise</span>
                <span>🎁</span>
              </h2>
              <p className="text-[10px] text-slate-500">Scratch the metallic foil to reveal our secret</p>
            </div>

            {/* Scratch Box Gift Container */}
            <div className="relative w-full max-w-[250px] mx-auto rounded-2xl overflow-hidden shadow-lg border-2 border-rose-200/90 select-none bg-white">
              {/* Underlying Secret Revealed Card */}
              <div className="w-full p-3.5 bg-gradient-to-br from-[#FFF8F6] via-[#FFFDF9] to-[#FFF0F4] text-slate-800 flex flex-col items-center justify-center text-center min-h-[124px]">
                <div className="text-lg mb-0.5">
                  <AppleEmoji emoji="🌹" size={20} />
                </div>
                <h4 className="text-xs font-bold text-rose-950">Secret Promise Unlocked!</h4>
                <p className="font-cursive text-xs text-rose-800 mt-1 leading-snug px-1 break-words font-medium">
                  "{themeConfig.scratchSecret}"
                </p>

                {/* Voucher Code Pill with Copy Action */}
                <div className="mt-2 flex items-center gap-1">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-rose-200 text-[8.5px] font-mono font-bold text-rose-600 shadow-2xs select-all">
                    <span>CODE: {themeConfig.scratchCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyVoucher}
                    className="p-1 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 cursor-pointer transition-transform active:scale-90"
                    title="Copy secret voucher code"
                  >
                    {scratchCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Canvas Metallic Foil Overlay */}
              {!isScratched && (
                <canvas
                  ref={canvasRef}
                  onMouseDown={handlePointerDown}
                  onMouseMove={handlePointerMove}
                  onMouseUp={handlePointerUp}
                  onMouseLeave={handlePointerUp}
                  onTouchStart={handlePointerDown}
                  onTouchMove={handlePointerMove}
                  onTouchEnd={handlePointerUp}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
                />
              )}
            </div>

            {/* Scratch Card Action Controls */}
            <div className="mt-2 flex items-center justify-center gap-2">
              {!isScratched ? (
                <button
                  type="button"
                  onClick={handleInstantReveal}
                  className="py-1 px-3.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Instant Reveal ✨</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetScratch}
                  className="py-1 px-3.5 rounded-full bg-white border border-rose-200 text-rose-700 text-[10px] font-semibold hover:bg-rose-50 flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Scratch Again 🔁</span>
                </button>
              )}
            </div>
            <p className="text-[8px] text-slate-400 mt-1">Valid forever with zero expiration date ❤️</p>
          </div>
        )}

        {/* Bottom Keepsake Stamp in 'all' view */}
        {activeTab === 'all' && (
          <div className="pt-3 pb-2 text-center text-slate-400 text-[9px] border-t border-rose-100 w-full">
            <p className="font-cursive text-xs text-rose-800">
              Handcrafted with endless love for {recipientName} ❤️
            </p>
            <p className="text-[8px] text-slate-400 mt-0.5 font-sans">
              WishCraft Romantic Keepsake • {formData.date || 'Forever & Always'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
