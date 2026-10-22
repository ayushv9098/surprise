import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import AmbientParticles from './common/AmbientParticles';
import AudioPlayer from './common/AudioPlayer';
import EnvelopeLetter from './common/EnvelopeLetter';
import PolaroidGallery from './common/PolaroidGallery';
import CuteQuiz from './common/CuteQuiz';
import ScratchCard from './common/ScratchCard';
import TemplateFooter from './common/TemplateFooter';
import { soundEffects } from './common/SoundEffects';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { getSongById } from '../../data/songs';

export default function BlushRomanceView({ siteData = {}, onNavigateCreate }) {
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
        bgClass: 'bg-[#0F172A] text-slate-100 selection:bg-indigo-900 selection:text-indigo-100',
        badgeText: 'Written in the Stars',
        badgeEmoji: '🌌',
        badgeClass: 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 shadow-indigo-950/50 shadow-md',
        headlineColor: 'text-white',
        headlineGradient: 'bg-gradient-to-r from-indigo-200 via-sky-200 to-purple-200 bg-clip-text text-transparent',
        subtitleColor: 'text-indigo-200/80',
        sectionTitleColor: 'text-white',
        sectionSubtitleColor: 'text-indigo-200/70',
        cardBg: 'bg-slate-900/85 backdrop-blur-md',
        cardBorder: 'border border-indigo-500/20 hover:border-indigo-400/50',
        cardGlow: 'hover:shadow-indigo-500/10 shadow-lg',
        cardTitleColor: 'text-indigo-200',
        cardDescColor: 'text-slate-300',
        sealType: 'celestial',
        sealEmoji: siteData.letter?.sealEmoji || '🌙',
        polaroidTape: 'blue',
        particlePreset: 'stars',
        particleItems: ['🌌', '💫', '🌙', '⭐', '✨', '💎', '🪐', '💙'],
        audioAccent: 'from-indigo-500 to-purple-600',
        scratchTheme: 'celestial',
        quizTheme: 'indigo',
        buttonClass: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/30 shadow-lg border border-indigo-400/30',
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
        defaultLetter: `My beloved ${recipientName},\n\nThey say the odds of finding your true soulmate are one in a billion. But from the first second our eyes met, I knew our love was written in the stars long before we ever arrived.\n\nThank you for your infinite kindness, your breathtaking grace, and for loving me completely. May our love continue shining brighter than every constellation in the night sky.\n\nAcross the stars forever,\n${senderName} 🌙`,
        defaultQuiz: {
          title: "A Little Constellation Question 🌌",
          question: "Where is our love written?",
          options: [
            "In the pages of a fairy tale book",
            "Across the constellations of the stars",
            "Deep inside both of our hearts forever",
            "All of the above, across the entire cosmos! 🌌"
          ],
          correctIndex: 3,
          reward: "Unlocked: 1x Stargazing Night + Endless Midnight Conversations! 🌙✨"
        },
        defaultScratch: {
          title: "Scratch to Reveal a Cosmic Promise 🌙",
          secret: "1x Stargazing Drive + Warm Hot Chocolate Under the Moon 🍫🌌",
          subtitle: "A promise written in the cosmos 💫",
          code: "STARS-FOREVER-2026"
        }
      };
    }

    if (isSunset) {
      return {
        id: 'sunset-romance',
        isDark: false,
        bgClass: 'bg-[#FFFBF5] text-slate-800 selection:bg-amber-100 selection:text-amber-900',
        badgeText: 'Golden Hour Keepsake',
        badgeEmoji: '🌅',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs',
        headlineColor: 'text-slate-900',
        headlineGradient: 'bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-transparent',
        subtitleColor: 'text-slate-600',
        sectionTitleColor: 'text-slate-900',
        sectionSubtitleColor: 'text-slate-500',
        cardBg: 'bg-white/95 backdrop-blur-xs',
        cardBorder: 'border border-amber-100/90 hover:border-amber-300',
        cardGlow: 'hover:shadow-amber-100/50 shadow-xs hover:shadow-md',
        cardTitleColor: 'text-slate-800',
        cardDescColor: 'text-slate-600',
        sealType: 'gold',
        sealEmoji: siteData.letter?.sealEmoji || '✨',
        polaroidTape: 'gold',
        particlePreset: 'petals',
        particleItems: ['🌅', '✨', '🥂', '🧡', '⭐', '💛', '💫', '💖'],
        audioAccent: 'from-amber-500 to-rose-400',
        scratchTheme: 'gold',
        quizTheme: 'gold',
        buttonClass: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25 shadow-md border border-amber-300/40',
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
        defaultLetter: `Dearest ${recipientName},\n\nFrom the moment you smiled at me, my world lit up like a breathtaking sunset. You are my calm sanctuary, my favorite adventure, and my golden hour every single day.\n\nThank you for being the sweetest part of my days and for filling our life with laughter and tenderness. I adore you beyond words.\n\nAlways & forever yours,\n${senderName} 🌅✨`,
        defaultQuiz: {
          title: "A Little Golden Hour Question 🌅",
          question: "What is our absolute favorite kind of moment together?",
          options: [
            "Watching the sunset in peaceful silence together",
            "Late-night car rides singing our favorite songs",
            "Laughing until our stomachs hurt over silly jokes",
            "Every single moment, wherever we are ✨"
          ],
          correctIndex: 3,
          reward: "Unlocked: 1x Sunset Picnic Date + Favorite Boba Drink! 🌅🥤"
        },
        defaultScratch: {
          title: "Scratch for a Golden Promise 🌅",
          secret: "1x Sunset Walk + Warm Coffee & Pastries on Me! ☕🌅",
          subtitle: "Valid for infinity and beyond ✨",
          code: "GOLDEN-HOUR-2026"
        }
      };
    }

    // Default: Velvet Romance / Blush Romance
    return {
      id: 'velvet-romance',
      isDark: false,
      bgClass: 'bg-[#FFF8F8] text-slate-800 selection:bg-rose-100 selection:text-rose-900',
      badgeText: 'Forever in My Heart',
      badgeEmoji: '❤️',
      badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200/80 shadow-xs',
      headlineColor: 'text-slate-900',
      headlineGradient: 'bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 bg-clip-text text-transparent',
      subtitleColor: 'text-slate-600',
      sectionTitleColor: 'text-slate-900',
      sectionSubtitleColor: 'text-slate-500',
      cardBg: 'bg-white/95 backdrop-blur-xs',
      cardBorder: 'border border-rose-100/90 hover:border-rose-300',
      cardGlow: 'hover:shadow-rose-100/50 shadow-xs hover:shadow-md',
      cardTitleColor: 'text-slate-800',
      cardDescColor: 'text-slate-600',
      sealType: 'rose',
      sealEmoji: siteData.letter?.sealEmoji || '❤️',
      polaroidTape: 'pink',
      particlePreset: 'hearts',
      particleItems: ['❤️', '🌹', '✨', '💍', '💫', '💖', '💌', '🌷'],
      audioAccent: 'from-rose-600 to-red-600',
      scratchTheme: 'rose',
      quizTheme: 'rose',
      buttonClass: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-500/25 shadow-md border border-rose-300/40',
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
      defaultLetter: `My Love,\n\nLooking back at our journey together, every single moment by your side has been a treasure. You bring warmth, laughter, and an unspoken comfort into my life that nothing else could ever replace.\n\nThank you for choosing me, for holding my hand through everything, and for filling my heart with peace and romance. With you, even quiet rainy afternoons feel like adventures.\n\nI love you more than words could ever fit on this page, today and for all the tomorrows to come.\n\nForever yours,\n${senderName} ❤️`,
      defaultQuiz: {
        title: "A Little Question For You 💖",
        question: "What is the single best thing about us?",
        options: [
          "Our uncontrollable midnight laughing fits",
          "How we always find each other's favorite snacks",
          "That we can be 100% our truest, goofiest selves",
          "All of the above & everything we are ❤️"
        ],
        correctIndex: 3,
        reward: "Unlocked: 1x Giant Warm Hug + Your favorite sweet treat anytime! 🍫❤️"
      },
      defaultScratch: {
        title: "Scratch for a Secret Promise ✨",
        secret: "Unlimited cuddles, late-night dessert runs & loving you forever! 🍨🌹",
        subtitle: "Redeemable anytime with zero expiration date ❤️",
        code: "LOVE-FOREVER-2026"
      }
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

  const handleSendLove = () => {
    soundEffects.playCelebration();
    const nextCount = loveCount + 1;
    setLoveCount(nextCount);

    const msg = themeConfig.loveToastMessages[loveCount % themeConfig.loveToastMessages.length];
    setLoveToast(msg);
    setTimeout(() => {
      setLoveToast(null);
    }, 2400);

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: isCelestial 
          ? ['#818CF8', '#A855F7', '#60A5FA', '#F472B6'] 
          : (isSunset 
              ? ['#F59E0B', '#FBBF24', '#FB7185', '#F97316'] 
              : ['#E11D48', '#FB7185', '#F43F5E', '#FDA4AF'])
      });
    } catch {}
  };

  const toggleCardLike = (idx) => {
    soundEffects.playPop();
    setLikedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className={`relative min-h-screen ${themeConfig.bgClass} overflow-x-hidden font-sans selection:backdrop-blur-sm transition-colors duration-500`}>
      
      {/* Floating Ambient Hearts, Petals, or Constellation Stars */}
      <AmbientParticles 
        type={themeConfig.particlePreset} 
        items={themeConfig.particleItems} 
        count={24} 
      />

      {/* Floating Audio Player */}
      <AudioPlayer
        audioUrl={audioUrl}
        title={audioTitle}
        theme="romantic"
        accentColor={themeConfig.audioAccent}
      />

      {/* Floating Love Toast Notification */}
      {loveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-2xl ${
            themeConfig.isDark 
              ? 'bg-indigo-950 text-indigo-100 border border-indigo-400/50 shadow-indigo-950/80' 
              : 'bg-slate-900 text-white shadow-rose-900/20'
          }`}>
            <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
            <span>{loveToast}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative z-20 pt-16 sm:pt-24 pb-10 px-4 text-center max-w-3xl mx-auto">
        {/* Curated Theme Badge */}
        <div className="inline-flex items-center justify-center mb-4">
          <div className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 ${themeConfig.badgeClass}`}>
            <span>{themeConfig.badgeText}</span>
            <AppleEmoji emoji={themeConfig.badgeEmoji} size={14} />
          </div>
        </div>

        {/* Romantic Headline */}
        <h1 className={`text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight ${themeConfig.headlineColor}`}>
          {renderAppleText(title)}
        </h1>

        {/* Subtitle */}
        <p className={`mt-4 text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed ${themeConfig.subtitleColor}`}>
          {renderAppleText(subtitle)}
        </p>

        {/* Interactive Shower Love Reaction Button */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <button
            onClick={handleSendLove}
            className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${themeConfig.buttonClass}`}
            title="Tap to shower love and send hearts"
          >
            <Heart className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
            <span>Shower Love</span>
            {loveCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/25 text-[11px] font-mono">
                {loveCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Interactive Sealed Love Letter */}
      <section className="relative z-20" aria-label="Sealed Love Letter">
        <EnvelopeLetter
          to={recipientName}
          from={senderName}
          date={siteData.date || "Forever & Always"}
          letterBody={letterBody}
          sealType={themeConfig.sealType}
          sealEmoji={themeConfig.sealEmoji}
          fontFamily="handwriting"
          initials={themeConfig.sealEmoji}
          subtitle="Tap the wax seal to open your personal letter"
          dark={themeConfig.isDark}
        />
      </section>

      {/* "Little Things I Adore About You" Interactive Cards */}
      <section className="relative z-20 max-w-3xl mx-auto my-14 px-4" aria-label="Reasons Why I Adore You">
        <div className="text-center mb-8">
          <div className={`text-xs font-medium tracking-wide uppercase mb-1.5 ${themeConfig.isDark ? 'text-indigo-400' : (isSunset ? 'text-amber-600' : 'text-rose-600')}`}>
            From The Heart
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold ${themeConfig.sectionTitleColor}`}>
            {renderAppleText(isSunset ? "Warm Little Things I Adore" : isCelestial ? "Constellations of Why I Love You" : "Little Things I Adore About You")}
          </h2>
          <p className={`text-xs sm:text-sm mt-1 max-w-md mx-auto ${themeConfig.sectionSubtitleColor}`}>
            Tap any card to save your favorite memory
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loveReasons.map((item, idx) => {
            const isLiked = !!likedCards[idx];
            return (
              <div 
                key={idx}
                onClick={() => toggleCardLike(idx)}
                className={`group relative rounded-2xl p-5 transition-all duration-300 cursor-pointer select-none ${themeConfig.cardBg} ${themeConfig.cardBorder} ${themeConfig.cardGlow} hover:-translate-y-0.5`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="text-2xl select-none shrink-0 inline-flex items-center group-hover:scale-115 transition-transform">
                    <AppleEmoji emoji={item.icon || '❤️'} size={26} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm sm:text-base font-semibold leading-snug truncate ${themeConfig.cardTitleColor}`}>
                        {renderAppleText(item.title)}
                      </h3>
                      <button
                        type="button"
                        className={`p-1 rounded-full transition-colors ${
                          isLiked ? 'text-rose-500 scale-110' : 'text-slate-400/60 hover:text-rose-400'
                        }`}
                        aria-label="Adore this reason"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${themeConfig.cardDescColor}`}>
                      {renderAppleText(item.desc)}
                    </p>
                  </div>
                </div>

                {isLiked && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-semibold text-rose-500 animate-in fade-in duration-200">
                    <span>Adored</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Polaroid Memories Carousel / Lightbox Gallery */}
      <section className="relative z-20" aria-label="Polaroid Memories">
        <PolaroidGallery
          photos={photos}
          title={isSunset ? "Golden Hour Memories" : isCelestial ? "Cosmic Memories of Us" : "Snapshots of Us"}
          subtitle="Click on any photo to zoom in"
          tapeStyle={themeConfig.polaroidTape}
          dark={themeConfig.isDark}
        />
      </section>

      {/* Romantic Cute Quiz */}
      <section className="relative z-20" aria-label="Cute Quiz">
        <CuteQuiz
          quiz={siteData.quiz}
          theme={themeConfig.quizTheme}
          dark={themeConfig.isDark}
          quizTitle={siteData.quiz?.quizTitle || themeConfig.defaultQuiz.title}
          fallbackQuestion={themeConfig.defaultQuiz.question}
          fallbackOptions={themeConfig.defaultQuiz.options}
          correctIndex={themeConfig.defaultQuiz.correctIndex}
          rewardText={themeConfig.defaultQuiz.reward}
        />
      </section>

      {/* Interactive Scratch-to-Reveal Card */}
      <section className="relative z-20" aria-label="Scratch Card">
        <ScratchCard
          scratchData={siteData.scratchCard}
          theme={themeConfig.scratchTheme}
          dark={themeConfig.isDark}
          defaultTitle={themeConfig.defaultScratch.title}
          defaultSecret={themeConfig.defaultScratch.secret}
          subtitle={themeConfig.defaultScratch.subtitle}
          voucherCode={themeConfig.defaultScratch.code}
        />
      </section>

      {/* Keepsake Footer */}
      <TemplateFooter 
        onNavigateCreate={onNavigateCreate} 
        dark={themeConfig.isDark}
      />
    </div>
  );
}
