import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Calendar } from 'lucide-react';
import AmbientParticles from './common/AmbientParticles';
import AudioPlayer from './common/AudioPlayer';
import EnvelopeLetter from './common/EnvelopeLetter';
import PolaroidGallery from './common/PolaroidGallery';
import TemplateFooter from './common/TemplateFooter';
import { soundEffects } from './common/SoundEffects';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { getSongById } from '../../data/songs';

export default function BlushRomanceView({ siteData = {}, onNavigateCreate, hideAudioPlayer = false, _isLiveView = false }) {
  const rawTheme = (
    siteData.templateId || 
    siteData.themeId || 
    siteData.theme || 
    siteData.type || 
    ''
  ).toLowerCase();

  const isSunset = rawTheme.includes('sunset');
  const isCelestial = rawTheme.includes('celestial');

  const recipientName = siteData.recipientName || 'My Love';
  const senderName = siteData.senderName || 'Your Favorite Person';

  // Distinct Luxury Theme Configuration
  const themeConfig = (() => {
    if (isCelestial) {
      return {
        id: 'celestial-love',
        isDark: true,
        bgClass: 'bg-[#0A0F1D] text-slate-100 selection:bg-indigo-900 selection:text-indigo-100',
        bgGradients: 'radial-gradient(at 20% 12%, rgba(99, 102, 241, 0.3) 0px, transparent 55%), radial-gradient(at 85% 15%, rgba(168, 85, 247, 0.28) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.2) 0px, transparent 65%), radial-gradient(at 80% 80%, rgba(139, 92, 246, 0.28) 0px, transparent 55%), radial-gradient(at 15% 90%, rgba(30, 58, 138, 0.35) 0px, transparent 50%)',
        kicker: '✦ FOREVER & ALWAYS ✦',
        badgeText: 'Written in the Stars',
        badgeEmoji: '🌌',
        badgeClass: 'bg-indigo-950/80 text-indigo-200 border border-indigo-400/40 shadow-indigo-950/60 shadow-lg backdrop-blur-md',
        pillClass: 'border-indigo-500/30 bg-slate-900/70 text-indigo-200 shadow-xs',
        headlineColor: 'text-white',
        headlineGradient: 'bg-gradient-to-r from-indigo-200 via-sky-200 to-purple-200 bg-clip-text text-transparent',
        recipientGlow: 'drop-shadow-[0_4px_24px_rgba(129,140,248,0.35)]',
        subtitleColor: 'text-indigo-200/80',
        sectionKickerColor: 'text-indigo-400',
        sectionTitleColor: 'text-white',
        sectionSubtitleColor: 'text-indigo-200/70',
        accentColor: 'text-indigo-400',
        cardBg: 'bg-slate-900/75 backdrop-blur-md',
        cardBorder: 'border border-indigo-500/25 hover:border-indigo-400/50',
        cardGlow: 'hover:shadow-indigo-500/20 shadow-xl shadow-indigo-950/50',
        cardTitleColor: 'text-indigo-100',
        cardDescColor: 'text-slate-300',
        cardBadgeClass: 'bg-indigo-950/90 text-indigo-300 border border-indigo-500/30',
        cardIconBg: 'bg-indigo-950/80 text-indigo-200 border border-indigo-500/30 shadow-indigo-900/30',
        pedestalBg: 'bg-slate-900/60 border border-indigo-500/25 shadow-2xl shadow-indigo-950/70',
        dividerBorder: 'border-indigo-500/20',
        sealType: 'celestial',
        sealEmoji: siteData.letter?.sealEmoji || '🌙',
        polaroidTape: 'blue',
        particlePreset: 'stars',
        particleItems: ['🌌', '💫', '🌙', '⭐', '✨', '💎', '🪐', '💙'],
        audioAccent: 'from-indigo-500 to-purple-600',
        buttonClass: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-500/40 border border-indigo-400/30',
        confettiColors: ['#818CF8', '#A855F7', '#60A5FA', '#F472B6', '#38BDF8'],
        loveToastMessages: [
          'Written in the stars forever 🌌💫',
          'Across a thousand lifetimes, I choose you 🌙',
          'You are my universe ✨',
          'To infinity and beyond with you 💫',
          'Our souls were meant to meet 💙'
        ],
        defaultTitle: siteData.occasion 
          ? (siteData.occasion.toLowerCase().includes(recipientName.toLowerCase()) ? siteData.occasion : `${siteData.occasion}, ${recipientName} 🌌💫`)
          : `Written in the Stars, ${recipientName} 🌌💫`,
        defaultSubtitle: "In a universe of billions of galaxies, my heart was always destined to find you.",
        defaultReasons: [
          { title: "Cosmic Connection", desc: "Our souls connected as if we had known each other across a thousand lifetimes.", icon: "🌌" },
          { title: "Midnight Peace", desc: "Whenever the world gets loud, being in your arms feels like stillness under the stars.", icon: "🌙" },
          { title: "Written Destiny", desc: "Out of eight billion people on Earth, meeting you was my universe's greatest gift.", icon: "💫" },
          { title: "Eternal Orbit", desc: "Through every season and every starry night, I will choose you for all eternity.", icon: "🪐" },
        ],
        defaultLetter: `My beloved ${recipientName},\n\nThey say the odds of finding your true soulmate are one in a billion. But from the first second our eyes met, I knew our love was written in the stars long before we ever arrived.\n\nThank you for your infinite kindness, your breathtaking grace, and for loving me completely. May our love continue shining brighter than every constellation in the night sky.\n\nAcross the stars forever,\n${senderName} 🌙`
      };
    }

    if (isSunset) {
      return {
        id: 'sunset-romance',
        isDark: false,
        bgClass: 'bg-[#FFFDF7] text-slate-800 selection:bg-amber-100 selection:text-amber-900',
        bgGradients: 'radial-gradient(at 15% 10%, rgba(254, 240, 138, 0.45) 0px, transparent 55%), radial-gradient(at 85% 15%, rgba(253, 186, 116, 0.4) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(254, 215, 170, 0.35) 0px, transparent 65%), radial-gradient(at 85% 80%, rgba(251, 146, 60, 0.35) 0px, transparent 55%), radial-gradient(at 15% 90%, rgba(254, 243, 199, 0.5) 0px, transparent 50%)',
        kicker: '✦ FOREVER & ALWAYS ✦',
        badgeText: 'Sunset Glow Keepsake',
        badgeEmoji: '🌅',
        badgeClass: 'bg-amber-50/90 text-amber-800 border border-amber-200/80 shadow-xs backdrop-blur-md',
        pillClass: 'border-amber-200/80 bg-white/70 text-amber-800 shadow-xs',
        headlineColor: 'text-slate-900',
        headlineGradient: 'bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-transparent',
        recipientGlow: 'drop-shadow-[0_4px_24px_rgba(249,115,22,0.25)]',
        subtitleColor: 'text-slate-600',
        sectionKickerColor: 'text-amber-600',
        sectionTitleColor: 'text-slate-900',
        sectionSubtitleColor: 'text-slate-500',
        accentColor: 'text-amber-600',
        cardBg: 'bg-white/80 backdrop-blur-md',
        cardBorder: 'border border-amber-100/90 hover:border-amber-300',
        cardGlow: 'hover:shadow-amber-500/10 shadow-lg shadow-amber-900/5',
        cardTitleColor: 'text-slate-800',
        cardDescColor: 'text-slate-600',
        cardBadgeClass: 'bg-amber-50 text-amber-800 border border-amber-200/80',
        cardIconBg: 'bg-amber-50 text-amber-800 border border-amber-200/60 shadow-amber-900/5',
        pedestalBg: 'bg-amber-50/50 border border-amber-200/60 shadow-xl shadow-amber-500/5',
        dividerBorder: 'border-amber-200/60',
        sealType: 'gold',
        sealEmoji: siteData.letter?.sealEmoji || '✨',
        polaroidTape: 'gold',
        particlePreset: 'petals',
        particleItems: ['🌅', '✨', '🥂', '🧡', '⭐', '💛', '💫', '💖'],
        audioAccent: 'from-amber-500 to-rose-400',
        buttonClass: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-xl shadow-amber-500/25 border border-amber-200/40',
        confettiColors: ['#F59E0B', '#FBBF24', '#FB7185', '#F97316', '#F43F5E'],
        loveToastMessages: [
          'You are my golden hour! 🌅✨',
          'Every sunset is sweeter with you 🧡',
          'My brightest sunshine ☀️',
          'Forever warm beside you 🥂',
          'My favorite adventure partner 🌅'
        ],
        defaultTitle: siteData.occasion 
          ? (siteData.occasion.toLowerCase().includes(recipientName.toLowerCase()) ? siteData.occasion : `${siteData.occasion}, ${recipientName} 🌅✨`)
          : `You Are My Golden Hour, ${recipientName} 🌅✨`,
        defaultSubtitle: "From our very first hello to forever and beyond, every sunset is brighter with you.",
        defaultReasons: [
          { title: "Golden Warmth", desc: "Your radiant smile brings golden hour warmth into my life no matter the season.", icon: "🌅" },
          { title: "Guiding Light", desc: "You are the calm in my storm and the brightest light guiding me forward.", icon: "✨" },
          { title: "Tender Promises", desc: "The quiet promises kept and the steady peace you bring to my heart every day.", icon: "🧡" },
          { title: "Endless Cheers", desc: "To all our sunset talks, stolen kisses, and the thousands of tomorrows waiting for us.", icon: "🥂" },
        ],
        defaultLetter: `Dearest ${recipientName},\n\nFrom the moment you smiled at me, my world lit up like a breathtaking sunset. You are my calm sanctuary, my favorite adventure, and my golden hour every single day.\n\nThank you for being the sweetest part of my days and for filling our life with laughter and tenderness. I adore you beyond words.\n\nAlways & forever yours,\n${senderName} 🌅✨`
      };
    }

    // Default: Velvet Romance / Blush Romance
    return {
      id: 'velvet-romance',
      isDark: false,
      bgClass: 'bg-[#FFF7F8] text-slate-800 selection:bg-rose-100 selection:text-rose-900',
      bgGradients: 'radial-gradient(at 15% 10%, rgba(254, 205, 211, 0.5) 0px, transparent 55%), radial-gradient(at 85% 15%, rgba(253, 164, 175, 0.4) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(255, 228, 230, 0.55) 0px, transparent 65%), radial-gradient(at 85% 80%, rgba(254, 205, 211, 0.45) 0px, transparent 55%), radial-gradient(at 15% 90%, rgba(254, 226, 226, 0.5) 0px, transparent 50%)',
      kicker: '✦ FOREVER & ALWAYS ✦',
      badgeText: 'Velvet Rose Keepsake',
      badgeEmoji: '🌹',
      badgeClass: 'bg-rose-50/90 text-rose-700 border border-rose-200/80 shadow-xs backdrop-blur-md',
      pillClass: 'border-rose-200/80 bg-white/70 text-rose-800 shadow-xs',
      headlineColor: 'text-slate-900',
      headlineGradient: 'bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 bg-clip-text text-transparent',
      recipientGlow: 'drop-shadow-[0_4px_24px_rgba(244,63,94,0.25)]',
      subtitleColor: 'text-slate-600',
      sectionKickerColor: 'text-rose-600',
      sectionTitleColor: 'text-slate-900',
      sectionSubtitleColor: 'text-slate-500',
      accentColor: 'text-rose-600',
      cardBg: 'bg-white/80 backdrop-blur-md',
      cardBorder: 'border border-rose-100/90 hover:border-rose-300',
      cardGlow: 'hover:shadow-rose-500/10 shadow-lg shadow-rose-900/5',
      cardTitleColor: 'text-slate-800',
      cardDescColor: 'text-slate-600',
      cardBadgeClass: 'bg-rose-50 text-rose-700 border border-rose-200/80',
      cardIconBg: 'bg-rose-50 text-rose-700 border border-rose-200/60 shadow-rose-900/5',
      pedestalBg: 'bg-rose-50/50 border border-rose-200/60 shadow-xl shadow-rose-500/5',
      dividerBorder: 'border-rose-200/60',
      sealType: 'rose',
      sealEmoji: siteData.letter?.sealEmoji || '❤️',
      polaroidTape: 'pink',
      particlePreset: 'hearts',
      particleItems: ['❤️', '🌹', '✨', '💍', '💫', '💖', '💌', '🌷'],
      audioAccent: 'from-rose-600 to-red-600',
      buttonClass: 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-500/25 border border-rose-300/40',
      confettiColors: ['#E11D48', '#FB7185', '#F43F5E', '#FDA4AF', '#BE123C'],
      loveToastMessages: [
        'You have my whole heart ❤️',
        'Loving you is effortless 🌹',
        'My favorite human in the world 🥰',
        'To all our tomorrows together 💕',
        'Forever yours, my love ✨'
      ],
      defaultTitle: siteData.occasion 
        ? (siteData.occasion.toLowerCase().includes(recipientName.toLowerCase()) ? siteData.occasion : `${siteData.occasion}, ${recipientName} ❤️`)
        : `To My Favorite Person, ${recipientName} ❤️`,
      defaultSubtitle: "In a world of billions of people, my happiest place will always be right beside you.",
      defaultReasons: [
        { title: "Your Radiant Smile", desc: "How it effortlessly turns even my most exhausting day into pure joy.", icon: "✨" },
        { title: "Your Gentle Soul", desc: "The quiet kindness and endless warmth you show to everyone around you.", icon: "🌸" },
        { title: "Our Inside Jokes", desc: "How a single glance from across the room can make us burst into giggles.", icon: "💫" },
        { title: "Your Warmest Hugs", desc: "The safest, coziest, and most comforting place in the entire world.", icon: "🧸" },
      ],
      defaultLetter: `My Love,\n\nLooking back at our journey together, every single moment by your side has been a treasure. You bring warmth, laughter, and an unspoken comfort into my life that nothing else could ever replace.\n\nThank you for choosing me, for holding my hand through everything, and for filling my heart with peace and romance. With you, even quiet rainy afternoons feel like adventures.\n\nI love you more than words could ever fit on this page, today and for all the tomorrows to come.\n\nForever yours,\n${senderName} ❤️`
    };
  })();

  // Content resolution
  const title = siteData.title || themeConfig.defaultTitle;
  const subtitle = siteData.subtitle || themeConfig.defaultSubtitle;
  const letterBody = (typeof siteData.letter === 'object' ? siteData.letter?.content : siteData.letter) 
    || siteData.letterBody 
    || themeConfig.defaultLetter;

  const loveReasons = (siteData.loveReasons && siteData.loveReasons.length > 0)
    ? siteData.loveReasons
    : ((siteData.specialReasons && siteData.specialReasons.length > 0)
        ? siteData.specialReasons
        : themeConfig.defaultReasons);

  const resolvedSong = siteData.songId ? getSongById(siteData.songId, siteData) : null;
  const audioUrl = siteData.songUrl || siteData.customSongUrl || siteData.music?.audioUrl || siteData.audioUrl || resolvedSong?.audioUrl;
  const audioTitle = siteData.customSongTitle || siteData.music?.title || resolvedSong?.title || `${recipientName}'s Keepsake Melody`;

  // Photos resolution for Polaroid Gallery
  const photos = (siteData.photos && siteData.photos.length > 0) 
    ? siteData.photos 
    : (siteData.heroPhoto 
        ? [{ url: siteData.heroPhoto, caption: siteData.photoCaption || 'Our Favorite Memory ❤️', date: 'Cherished Moment' }] 
        : null);

  // Interactive Reaction State
  const [loveToast, setLoveToast] = useState(null);
  const [loveCount, setLoveCount] = useState(0);
  const [likedCards, setLikedCards] = useState({});
  const [floatingHearts, setFloatingHearts] = useState([]);

  const handleSendLove = () => {
    soundEffects.playCelebration();
    const nextCount = loveCount + 1;
    setLoveCount(nextCount);

    const msg = themeConfig.loveToastMessages[loveCount % themeConfig.loveToastMessages.length];
    setLoveToast(msg);
    setTimeout(() => {
      setLoveToast(null);
    }, 2400);

    // Dynamic mini heart bursts
    const emojis = isCelestial 
      ? ['🌌', '✨', '💫', '🌙', '💙', '⭐'] 
      : (isSunset 
          ? ['🌅', '✨', '🧡', '💛', '💖', '🥂'] 
          : ['❤️', '💖', '🌹', '✨', '💕', '🥰']);

    const newBurst = {
      id: Date.now() + Math.random(),
      left: (Math.random() - 0.5) * 80,
      rotation: (Math.random() - 0.5) * 45,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    };

    setFloatingHearts((prev) => [...prev.slice(-12), newBurst]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newBurst.id));
    }, 1200);

    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.8 },
        colors: themeConfig.confettiColors
      });
    } catch {}
  };

  const toggleCardLike = (idx) => {
    soundEffects.playPop();
    setLikedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const occasionBanner = siteData.occasion || "Celebrating Our Story";
  const dateBanner = siteData.date || "Forever & Always";

  return (
    <div 
      className={`relative min-h-screen ${themeConfig.bgClass} overflow-x-hidden font-sans selection:backdrop-blur-sm transition-colors duration-500`}
      style={{
        backgroundImage: themeConfig.bgGradients
      }}
    >
      <style>{`
        @keyframes floatHeart {
          0% {
            transform: translateY(0) scale(0.6) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-90px) scale(1.4) rotate(var(--rot, 15deg));
            opacity: 0;
          }
        }
        .animate-float-heart {
          animation: floatHeart 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes shimmerBadge {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        .animate-shimmer-badge {
          animation: shimmerBadge 3s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient Aurora / Starlight Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div 
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-60 pointer-events-none"
          style={{
            background: isCelestial 
              ? 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(168,85,247,0.15) 50%, transparent 80%)' 
              : (isSunset 
                  ? 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(245,158,11,0.15) 50%, transparent 80%)' 
                  : 'radial-gradient(circle, rgba(244,63,94,0.22) 0%, rgba(251,113,133,0.14) 50%, transparent 80%)')
          }} 
        />
      </div>

      {/* Floating Ambient Hearts, Petals, or Constellation Stars */}
      <AmbientParticles 
        type={themeConfig.particlePreset} 
        items={themeConfig.particleItems} 
        count={24} 
      />

      {/* Floating Audio Player */}
      {!hideAudioPlayer && (
        <AudioPlayer
          audioUrl={audioUrl}
          title={audioTitle}
          theme="romantic"
          accentColor={themeConfig.audioAccent}
        />
      )}

      {/* Floating Love Toast Notification */}
      {loveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md ${
            themeConfig.isDark 
              ? 'bg-indigo-950/90 text-indigo-100 border border-indigo-400/50 shadow-indigo-950/80' 
              : 'bg-slate-900/90 text-white shadow-rose-900/20'
          }`}>
            <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
            <span>{loveToast}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative z-20 pt-16 sm:pt-24 pb-12 px-4 text-center max-w-4xl mx-auto">
        {/* Editorial Romantic Kicker */}
        <div className={`text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-3 ${themeConfig.sectionKickerColor}`}>
          {themeConfig.kicker}
        </div>

        {/* Curated Theme Keepsake Badge */}
        <div className="inline-flex items-center justify-center mb-6">
          <div className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 animate-shimmer-badge ${themeConfig.badgeClass}`}>
            <AppleEmoji emoji={themeConfig.badgeEmoji} size={15} />
            <span>{themeConfig.badgeText}</span>
            <Sparkles className="w-3.5 h-3.5 opacity-70" />
          </div>
        </div>

        {/* Recipient Spotlight */}
        <div className="mb-3">
          <span className={`block font-cursive text-2xl sm:text-4xl mb-1 ${isCelestial ? 'text-indigo-300' : 'text-rose-500/90'}`}>
            To my one and only,
          </span>
          <span className={`font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight block ${themeConfig.headlineGradient} ${themeConfig.recipientGlow}`}>
            {renderAppleText(recipientName)}
          </span>
        </div>

        {/* Romantic Headline */}
        {title && title.toLowerCase().trim() !== recipientName.toLowerCase().trim() && (
          <h1 className={`font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.2] mt-3 mb-4 ${themeConfig.headlineColor}`}>
            {renderAppleText(title)}
          </h1>
        )}

        {/* Subtitle */}
        <p className={`mt-3 text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed ${themeConfig.subtitleColor}`}>
          {renderAppleText(subtitle)}
        </p>

        {/* Occasion & Date Banner Pill */}
        <div className={`mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-xs border transition-all duration-300 ${themeConfig.pillClass}`}>
          <Calendar className="w-3.5 h-3.5 opacity-70" />
          <span>{occasionBanner}</span>
          <span className="opacity-40">•</span>
          <span>{dateBanner}</span>
        </div>

        {/* Interactive Shower Love Reaction Button with Floating Heart Burst */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <div className="relative inline-block">
            {floatingHearts.map((heart) => (
              <span
                key={heart.id}
                className="absolute pointer-events-none text-2xl select-none animate-float-heart z-30"
                style={{
                  left: `calc(50% + ${heart.left}px)`,
                  bottom: '100%',
                  '--rot': `${heart.rotation}deg`
                }}
              >
                {heart.emoji}
              </span>
            ))}

            <button
              onClick={handleSendLove}
              className={`group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${themeConfig.buttonClass}`}
              title="Tap to shower love and send hearts"
            >
              <Heart className="w-5 h-5 fill-current group-hover:scale-125 transition-transform duration-300 animate-pulse" />
              <span>Shower Love</span>
              <Sparkles className="w-4 h-4 opacity-80 group-hover:rotate-45 transition-transform duration-300" />
              {loveCount > 0 && (
                <span className="ml-1 px-2.5 py-0.5 rounded-full bg-white/30 text-xs font-mono font-bold shadow-xs">
                  {loveCount}
                </span>
              )}
            </button>
          </div>
          <p className={`text-[11px] sm:text-xs opacity-75 font-medium tracking-wide ${themeConfig.subtitleColor}`}>
            Tap to send fluttering hearts & celebrate
          </p>
        </div>
      </header>

      {/* CHAPTER I: Interactive Sealed Love Letter */}
      <section className="relative z-20 max-w-4xl mx-auto my-16 px-4" aria-label="Sealed Love Letter">
        <div className="text-center mb-8">
          <div className={`text-xs font-semibold tracking-widest uppercase mb-2 ${themeConfig.sectionKickerColor}`}>
            CHAPTER I • FROM THE HEART
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${themeConfig.sectionTitleColor}`}>
            {renderAppleText(isSunset ? "A Golden Love Letter" : isCelestial ? "A Starlit Love Letter" : "Sealed With Endless Love")}
          </h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed ${themeConfig.sectionSubtitleColor}`}>
            Tap the wax seal to unfold handwritten words meant only for you
          </p>
        </div>

        {/* Romantic Pedestal Framing */}
        <div className={`relative rounded-3xl p-4 sm:p-8 backdrop-blur-md ${themeConfig.pedestalBg} transition-all duration-500`}>
          <EnvelopeLetter
            to={recipientName}
            from={senderName}
            date={siteData.date || "Forever & Always"}
            letterBody={letterBody}
            sealType={themeConfig.sealType}
            sealEmoji={themeConfig.sealEmoji}
            fontFamily="handwriting"
            initials={themeConfig.sealEmoji}
            subtitle="Tap the wax seal to open your private letter"
            dark={themeConfig.isDark}
          />
        </div>
      </section>

      {/* CHAPTER II: "Little Things I Adore About You" Devotion Cards */}
      <section className="relative z-20 max-w-4xl mx-auto my-16 px-4" aria-label="Reasons Why I Adore You">
        <div className="text-center mb-10">
          <div className={`text-xs font-semibold tracking-widest uppercase mb-2 ${themeConfig.sectionKickerColor}`}>
            CHAPTER II • THE LITTLE DETAILS
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${themeConfig.sectionTitleColor}`}>
            {renderAppleText(isSunset ? "Warm Little Things I Adore" : isCelestial ? "Constellations of Why I Love You" : "Little Things I Adore About You")}
          </h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed ${themeConfig.sectionSubtitleColor}`}>
            Every quiet laugh, gentle touch, and sweet habit that made me fall for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {loveReasons.map((item, idx) => {
            const isLiked = !!likedCards[idx];
            const cardNum = String(idx + 1).padStart(2, '0');
            return (
              <div 
                key={idx}
                onClick={() => toggleCardLike(idx)}
                className={`group relative rounded-2xl p-6 transition-all duration-300 cursor-pointer select-none ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.cardGlow} hover:-translate-y-1`}
              >
                {/* Card Top Row: Counter Badge & Adore Button */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full ${themeConfig.cardBadgeClass}`}>
                    #{cardNum}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isLiked && (
                      <span className="text-[11px] font-semibold text-rose-500 animate-in fade-in duration-200">
                        Adored
                      </span>
                    )}
                    <button
                      type="button"
                      className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                        isLiked 
                          ? 'text-rose-500 scale-110 bg-rose-50/80 shadow-xs' 
                          : 'text-slate-400/60 hover:text-rose-500 hover:scale-105'
                      }`}
                      aria-label="Adore this reason"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ${themeConfig.cardIconBg}`}>
                    <AppleEmoji emoji={item.icon || '❤️'} size={26} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base sm:text-lg font-bold leading-snug ${themeConfig.cardTitleColor}`}>
                      {renderAppleText(item.title)}
                    </h3>
                    <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${themeConfig.cardDescColor}`}>
                      {renderAppleText(item.desc)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CHAPTER III: Cherished Memories Gallery */}
      <section className="relative z-20 max-w-4xl mx-auto my-16 px-4" aria-label="Cherished Memories Gallery">
        <div className="text-center mb-6">
          <div className={`text-xs font-semibold tracking-widest uppercase mb-2 ${themeConfig.sectionKickerColor}`}>
            CHAPTER III • CHERISHED MEMORIES
          </div>
        </div>
        <PolaroidGallery
          photos={photos}
          title={isSunset ? "Golden Hour Memories" : isCelestial ? "Cosmic Memories of Us" : "Snapshots of Us"}
          subtitle="Click on any photo to zoom in & relive the moment"
          titleClassName={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${themeConfig.sectionTitleColor}`}
          subtitleClassName={`text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed ${themeConfig.sectionSubtitleColor}`}
          tapeStyle={themeConfig.polaroidTape}
          dark={themeConfig.isDark}
        />
      </section>

      {/* Closing Keepsake Dedication Card */}
      <section className="relative z-20 max-w-xl mx-auto my-16 px-4 text-center" aria-label="Closing Dedication">
        <div className={`p-8 sm:p-10 rounded-3xl ${themeConfig.cardBg} ${themeConfig.cardBorder} shadow-2xl relative overflow-hidden backdrop-blur-md`}>
          <div className="text-2xl mb-3 select-none">❦ ✦ ❦</div>
          <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${themeConfig.accentColor}`}>
            FOREVER & ALWAYS
          </p>
          <h3 className={`font-serif text-2xl sm:text-3xl font-bold mb-3 ${themeConfig.sectionTitleColor}`}>
            Every Chapter Is Sweeter With You
          </h3>
          <p className={`text-sm sm:text-base leading-relaxed ${themeConfig.sectionSubtitleColor}`}>
            Handcrafted with endless love for <span className="font-semibold text-rose-500">{recipientName}</span> by <span className={`font-semibold font-cursive text-2xl ${isCelestial ? 'text-indigo-300' : 'text-rose-600'}`}>{senderName}</span>.
          </p>
          <div className={`mt-6 pt-4 border-t ${themeConfig.dividerBorder} text-xs font-mono opacity-60`}>
            {siteData.date || "Forever & Always"}
          </div>
        </div>
      </section>

      {/* Keepsake Footer */}
      <TemplateFooter 
        onNavigateCreate={onNavigateCreate} 
        dark={themeConfig.isDark}
      />
    </div>
  );
}
