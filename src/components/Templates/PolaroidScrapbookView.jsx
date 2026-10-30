import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Camera, 
  Flame, 
  Coffee, 
  Compass, 
  X, 
  ZoomIn 
} from 'lucide-react';
import AmbientParticles from './common/AmbientParticles';
import AudioPlayer from './common/AudioPlayer';
import EnvelopeLetter from './common/EnvelopeLetter';
import PolaroidGallery from './common/PolaroidGallery';
import CuteQuiz from './common/CuteQuiz';
import ScratchCard from './common/ScratchCard';
import TemplateFooter from './common/TemplateFooter';
import { soundEffects } from './common/SoundEffects';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';

export default function PolaroidScrapbookView({ siteData = {}, onNavigateCreate, hideAudioPlayer = false, _isLiveView = false }) {
  // Determine template theme variant
  const rawId = (siteData.templateId || siteData.theme || siteData.type || '').toLowerCase();
  const isNeon = rawId.includes('neon') || rawId.includes('nostalgia') || rawId.includes('electric');
  const isCozy = rawId.includes('cozy') || rawId.includes('sunset') || rawId.includes('coffee') || rawId.includes('sunflower');
  // Default is vintage-kodak / polaroid-scrapbook
  const isVintage = !isNeon && !isCozy;

  // Personalized Names & Titles
  const defaultRecipient = isNeon ? 'My Ride or Die' : (isCozy ? 'My Cozy Favorite' : 'My Favorite Adventurer');
  const defaultSender = isNeon ? 'Your Partner in Crime' : (isCozy ? 'Yours Over Coffee' : 'Your Memory Keeper');
  
  const recipientName = siteData.recipientName || defaultRecipient;
  const senderName = siteData.senderName || defaultSender;

  const title = siteData.title || (siteData.occasion 
    ? (siteData.occasion.toLowerCase().includes(recipientName.toLowerCase()) ? siteData.occasion : `${siteData.occasion}, ${recipientName}! ${isNeon ? '⚡' : (isCozy ? '🌻' : '📸')}`) 
    : (isNeon 
        ? `Electric Nostalgia Crew // ${recipientName} ⚡` 
        : (isCozy 
            ? `Cozy Autumn Keepsakes // ${recipientName} 🌻` 
            : `The Scrapbook of Us, ${recipientName} 📸`)));

  const subtitle = siteData.subtitle || (isNeon 
    ? "Late-night drives, unfiltered chaos, inside jokes, and an unbreakable bond taped forever." 
    : (isCozy 
        ? "Warm drinks, long talks, golden sunsets, and the comforting happiness of having you in my corner." 
        : "A tender collection of candid smiles, little adventures, and memories taped forever to my heart."));

  // Thematic Default Letters
  const defaultLetter = isNeon 
    ? `Life with you is pure electric energy! From spontaneous adventures to late-night laughs, every moment is packed with high voltage hype and good vibes.\n\nThank you for always having my back, keeping things 100% real, and hyping me up when I needed it most. No matter where we go or what crazy challenges we take on, this brotherhood is locked in forever.\n\nStay electric, keep winning, and let's keep making memories worth talking about for the rest of our lives! 🔥⚡`
    : (isCozy
        ? `Thank you for the warm comfort, peaceful talks, and sweet memories we've shared. Sitting together with good coffee and honest conversations is one of life's greatest treasures.\n\nIn a busy and loud world, our time together is always my favorite pause button. You bring so much gentle calm, understanding, and sweet sunshine to my everyday life.\n\nHere's to many more peaceful, golden afternoons, warm laughs, and cherished memories together! 🌻☕`
        : `Looking through all our old photos, I can't help but smile at how much we've lived through together.\n\nFrom our very first awkward conversation to the countless late nights where we talked about everything and nothing. You've made my world softer, warmer, and so much more adventurous.\n\nHere's to all the memories we've pasted into this scrapbook, and to the blank pages waiting for us tomorrow. 📸✨`);

  const letterBody = (typeof siteData.letter === 'object' ? siteData.letter?.content : siteData.letter) || siteData.letterBody || defaultLetter;

  // Thematic Default Memories
  const defaultVintageMemories = [
    {
      chapter: "Chapter 1",
      date: "The First Frame",
      title: "The Day We First Crossed Paths",
      note: "I had no idea back then that a casual hello would turn into the most important friendship and adventure of my entire life.",
      photo: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      tapeColor: "washi-tape",
      rotation: "-2deg"
    },
    {
      chapter: "Chapter 2",
      date: "Spontaneous Moments",
      title: "The Unplanned Roadtrip & Late Talks",
      note: "Windows down, singing terribly at the top of our lungs, and getting lost just to find that tiny diner with the best milkshakes.",
      photo: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
      tapeColor: "washi-tape-pink",
      rotation: "2.5deg"
    },
    {
      chapter: "Chapter 3",
      date: "Ordinary Magic",
      title: "Quiet Coffee Runs & Rainy Sundays",
      note: "It's the small, quiet in-between moments that I treasure the most. Just sitting next to you reading or laughing at silly videos.",
      photo: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      tapeColor: "washi-tape-blue",
      rotation: "-1.5deg"
    },
    {
      chapter: "Chapter 4",
      date: "Next Roll",
      title: "To Every Adventure Still Ahead",
      note: "Every page turned with you feels like an exciting new adventure. Thank you for being my constant companion and best friend.",
      photo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
      tapeColor: "washi-tape",
      rotation: "1.8deg"
    }
  ];

  const defaultNeonMemories = [
    {
      chapter: "Phase 01",
      date: "The Genesis",
      title: "Day One & The Squad Unlocks",
      note: "Before we knew it, a casual hangout spiraled into the most legendary brotherhood. Instant chemistry, zero filter, maximum volume.",
      photo: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
      tapeColor: "bg-cyan-400/80 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
      rotation: "-2.2deg"
    },
    {
      chapter: "Phase 02",
      date: "2:00 AM Run",
      title: "Midnight Drives & Blasting Bass",
      note: "Windows rolled all the way down, headlights cutting through the foggy night, singing at the top of our lungs with no destination.",
      photo: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      tapeColor: "bg-teal-400/80 shadow-[0_0_10px_rgba(45,212,191,0.5)]",
      rotation: "2.8deg"
    },
    {
      chapter: "Phase 03",
      date: "Pure Chaos",
      title: "Inside Jokes & Glorious Mishaps",
      note: "Nobody else gets why we laugh until we can't breathe over a single word. Our inside jokes are classified government secrets.",
      photo: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      tapeColor: "bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
      rotation: "-1.8deg"
    },
    {
      chapter: "Phase 04",
      date: "Locked In",
      title: "Brotherhood For Life // 100% Real",
      note: "Through every high and low, you're the one who never folds. Proud to call you my brother — we are just getting started.",
      photo: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
      tapeColor: "bg-cyan-400/80 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
      rotation: "2deg"
    }
  ];

  const defaultCozyMemories = [
    {
      chapter: "Morning Light",
      date: "The First Autumn",
      title: "A Warm Hello That Changed Everything",
      note: "Some people enter your life like a sudden burst of golden sunlight on a crisp autumn morning. That's exactly how meeting you felt.",
      photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      tapeColor: "bg-amber-600/70",
      rotation: "-1.8deg"
    },
    {
      chapter: "Warm Brews",
      date: "Coffee & Rain",
      title: "Quiet Corner Cafes & Steaming Mugs",
      note: "Watching the rain stream down the window glass while we talked for hours about our favorite dreams and little childhood secrets.",
      photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
      tapeColor: "bg-orange-500/60",
      rotation: "2.2deg"
    },
    {
      chapter: "Golden Hour",
      date: "Sunflower Strolls",
      title: "Crunching Leaves & Golden Sunsets",
      note: "Walking side-by-side with sweaters on, kicking piles of amber leaves, laughing at silly stories until the sun dipped below the hills.",
      photo: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80",
      tapeColor: "bg-yellow-600/60",
      rotation: "-2deg"
    },
    {
      chapter: "Forever Season",
      date: "Home in You",
      title: "Seasons Change, But We Stay Constant",
      note: "Thank you for being my warmest hug and safest shelter. No matter how cold the world gets, our friendship is pure comfort.",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      tapeColor: "bg-amber-700/60",
      rotation: "1.5deg"
    }
  ];

  const timelineMemories = (siteData.memories && siteData.memories.length > 0)
    ? siteData.memories
    : (isNeon ? defaultNeonMemories : (isCozy ? defaultCozyMemories : defaultVintageMemories));

  // Interactive Reaction counter for Timeline Memories
  const [memoryReactions, setMemoryReactions] = useState({});
  const handleReactMemory = (idx, e) => {
    e.stopPropagation();
    soundEffects.playPop();
    setMemoryReactions((prev) => ({
      ...prev,
      [idx]: (prev[idx] || 0) + 1
    }));
  };

  // Lightbox State for Timeline Polaroid inspection
  const [activeTimelinePhoto, setActiveTimelinePhoto] = useState(null);

  // Theme-specific UI configuration
  const themeConfig = {
    vintage: {
      wrapperClass: "paper-parchment text-stone-800 selection:bg-amber-200 selection:text-amber-900",
      headerBadge: {
        bg: "bg-amber-50 border-amber-300 text-amber-800",
        label: "Authentic 35mm Scrapbook Journal",
        icon: "📸"
      },
      titleColor: "text-stone-900",
      subtitleColor: "text-amber-900/90",
      headerCardBg: "bg-white/95 border-amber-200/90 shadow-sm",
      binderRingClass: "bg-gradient-to-r from-stone-400 via-amber-200 to-stone-500",
      binderHoleClass: "bg-[#3d2e1e]/25 border-[#2c2014]/20",
      cardBorder: "border-amber-200/80 bg-white shadow-md",
      timelinePathClass: "border-amber-300/80",
      pinNodeClass: "bg-amber-100 border-amber-400 text-amber-800 shadow-sm",
      particlesType: "stars",
      sealType: "gold",
      sealEmoji: "⚡",
      letterSubtitle: "Folded 35mm journal entry sealed with Kodak wax seal",
      galleryTape: "gold",
      galleryTitle: "Taped Moments & Snapshots 📸",
      gallerySubtitle: "Click on any taped polaroid to expand into the full memory",
      quizTitle: "Memory Lane Trivia 📖",
      quizQuestion: "What's the golden rule of our crazy adventures?",
      quizOptions: [
        "We always take the wrong exit at least once 🛣️",
        "Someone is always searching for snacks 🍟",
        "We take a hundred blurry photos and laugh for hours 📸",
        "All of these and we wouldn't trade them for anything! ✨"
      ],
      quizReward: "Adventure Unlocked: 1x Nostalgic road trip + Your favorite boba drink! 🧋✨",
      scratchTitle: "Vintage Keepsake Voucher",
      scratchSubtitle: "Scratch the Kodak amber foil to claim your adventure coupon",
      scratchSecret: "Valid for: 1x Spontaneous Road Trip + Full Tank of Gas & Fast Food! 🚗🍟",
      scratchCode: "KODAK-ADVENTURE-35MM",
      scratchTheme: "gold",
      audioAccent: "from-amber-600 to-yellow-600",
      audioTitle: siteData.customSongTitle || siteData.music?.title || "Vintage Acoustic Scrapbook"
    },
    neon: {
      wrapperClass: "bg-[#0B0F17] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:24px_24px]",
      headerBadge: {
        bg: "bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]",
        label: "NOSTALGIA ARCHIVE // 90S-00S VIBES",
        icon: "⚡"
      },
      titleColor: "text-white drop-shadow-[0_2px_12px_rgba(6,182,212,0.35)]",
      subtitleColor: "text-cyan-200/90",
      headerCardBg: "bg-slate-900/90 border-cyan-500/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
      binderRingClass: "bg-gradient-to-r from-slate-600 via-cyan-300 to-slate-800 shadow-[0_0_8px_rgba(6,182,212,0.5)]",
      binderHoleClass: "bg-black/60 border-cyan-500/40",
      cardBorder: "border-cyan-500/30 bg-slate-900/95 shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
      timelinePathClass: "border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]",
      pinNodeClass: "bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
      particlesType: "sparks",
      sealType: "neon",
      sealEmoji: "🔥",
      letterSubtitle: "Classified brotherhood memo sealed with hot flame wax",
      galleryTape: "cyan",
      galleryTitle: "Night Shifts & Crew Snapshots ⚡",
      gallerySubtitle: "Click on any snapshot to blow up the high-voltage memory",
      quizTitle: "Chaos & Brotherhood Trivia 🛹🔥",
      quizQuestion: "Who is officially responsible for 90% of our wildest bad ideas?",
      quizOptions: [
        "Definitely you, with zero regrets 💀",
        "Me, but you hyped me up every single second 🚀",
        "It was 50/50 mutual chaos from the very start 🤝",
        "Both of us, and that's why we're completely unstoppable! 🔥"
      ],
      quizReward: "Brotherhood Perk Unlocked: 1x Late-Night Gaming & Pizza Feast on Me! 🍕🎮",
      scratchTitle: "Late-Night Brotherhood Pass",
      scratchSubtitle: "Scratch the electric cyan foil to unlock your legendary perk",
      scratchSecret: "Unlocked: 1x Midnight Drive + Unlimited Fast Food + Free Pass on Any Dare! 🚗🍔",
      scratchCode: "NEON-CREW-HYPER",
      scratchTheme: "neon",
      audioAccent: "from-cyan-500 to-teal-400",
      audioTitle: siteData.customSongTitle || siteData.music?.title || "Electric Nights & Retro Melodies"
    },
    cozy: {
      wrapperClass: "bg-[#FAF6F0] text-stone-800 selection:bg-amber-300 selection:text-amber-950 bg-[radial-gradient(#e5d5c5_1.2px,transparent_1.2px)] [background-size:24px_24px]",
      headerBadge: {
        bg: "bg-[#f5ebe0] border-[#d4a373] text-[#78350f]",
        label: "Cozy Autumn Keepsakes & Warm Coffee Chats",
        icon: "🌻"
      },
      titleColor: "text-[#4a2e1b]",
      subtitleColor: "text-[#78350f]/90",
      headerCardBg: "bg-[#FFFDF9] border-[#e6ccb2] shadow-md",
      binderRingClass: "bg-gradient-to-r from-stone-400 via-amber-300 to-stone-500",
      binderHoleClass: "bg-[#4a2e1b]/20 border-[#4a2e1b]/30",
      cardBorder: "border-[#e6ccb2] bg-[#FFFDF9] shadow-sm",
      timelinePathClass: "border-[#d4a373]",
      pinNodeClass: "bg-amber-100 border-amber-500 text-amber-900 shadow-xs",
      particlesType: "leaves",
      sealType: "peach",
      sealEmoji: "🌻",
      letterSubtitle: "Pressed botanical journal letter sealed with sunflower wax",
      galleryTape: "terracotta",
      galleryTitle: "Sunflowers & Soft Moments 🌻",
      gallerySubtitle: "Click on any taped polaroid to step into the warm memory",
      quizTitle: "Cozy Memories Trivia 🌻☕",
      quizQuestion: "What's our undisputed definition of the perfect cozy afternoon?",
      quizOptions: [
        "Warm coffee, rain against the window & long talks ☕🌧️",
        "Sharing a warm blanket and our favorite comfort shows 📺",
        "Going on a lazy stroll while the sun sets golden 🌅",
        "Anywhere, as long as we're spending it together 💛"
      ],
      quizReward: "Warm Treat Unlocked: 1x Coffee & Pastry Date at That Cozy Corner Cafe! ☕🥐",
      scratchTitle: "Cozy Comfort Voucher",
      scratchSubtitle: "Scratch the warm copper foil to claim your comfort date",
      scratchSecret: "Valid for: 1x Cozy Weekend Picnic with Homemade Treats & Hot Cocoa! 🧺🥪☕",
      scratchCode: "COZY-SUNFLOWER-2026",
      scratchTheme: "cozy",
      audioAccent: "from-amber-700 to-orange-600",
      audioTitle: siteData.customSongTitle || siteData.music?.title || "Acoustic Coffeehouse Journal"
    }
  };

  const currentTheme = isNeon ? themeConfig.neon : (isCozy ? themeConfig.cozy : themeConfig.vintage);

  return (
    <div className={`relative min-h-[100dvh] w-full max-w-full overflow-x-hidden font-sans ${currentTheme.wrapperClass} pb-[max(2rem,env(safe-area-inset-bottom,0px))]`}>
      
      {/* Ambient Floating Particles */}
      <AmbientParticles type={currentTheme.particlesType} count={24} />

      {/* Floating Audio Player */}
      {!hideAudioPlayer && (
        <AudioPlayer
          audioUrl={siteData.songUrl || siteData.customSongUrl || siteData.music?.audioUrl || siteData.audioUrl}
          title={currentTheme.audioTitle}
          theme="scrapbook"
          accentColor={currentTheme.audioAccent}
          startTime={siteData.audioStartTime || siteData.songStartTime || siteData.songTrimStart || 0}
          duration={siteData.audioDuration || siteData.songDuration || siteData.songTrimDuration || null}
        />
      )}

      {/* Scrapbook Journal Binder Header */}
      <header className="relative z-20 pt-16 sm:pt-24 pb-12 px-4 max-w-4xl mx-auto text-center">
        
        {/* Binder Spiral Holes Styling (Notebook Ring Binder Top Bar) */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-3 select-none">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              {/* Binder ring hole */}
              <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shadow-inner ${currentTheme.binderHoleClass}`} />
              {/* Metallic Ring Loop */}
              <div className={`w-1.5 sm:w-2 h-5 sm:h-6 -mt-2.5 rounded-full shadow-md z-10 ${currentTheme.binderRingClass}`} />
            </div>
          ))}
        </div>

        {/* Authentic 35mm Film Strip Deco for Vintage-Kodak */}
        {isVintage && (
          <div className="w-full max-w-xl mx-auto mb-4 overflow-hidden rounded-md bg-[#181512] border border-amber-900/40 shadow-lg text-amber-400/90 font-mono text-[9px] sm:text-[11px] select-none">
            {/* Top Sprocket Perforations */}
            <div className="flex items-center justify-between px-2 py-1 bg-black/60 border-b border-amber-950">
              <span className="tracking-widest font-bold">KODAK 400TX</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-2.5 sm:w-3 h-3 bg-amber-50/20 rounded-xs shadow-inner" />
                ))}
              </div>
              <span>SAFETY FILM</span>
            </div>

            {/* Film Center Markings */}
            <div className="py-1 px-4 flex items-center justify-between text-amber-500/80">
              <span className="flex items-center gap-1">
                <span>▶ 24A</span>
                <span className="hidden sm:inline">• ISO 400</span>
              </span>
              <span className="font-sans italic text-xs text-amber-200/90">
                Memories & Keepsakes Edition
              </span>
              <span className="flex items-center gap-1">
                <span>EASTMAN KODAK CO.</span>
                <span>▶ 25</span>
              </span>
            </div>

            {/* Bottom Sprocket Perforations */}
            <div className="flex items-center justify-between px-2 py-1 bg-black/60 border-t border-amber-950">
              <span>EXP 24</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-2.5 sm:w-3 h-3 bg-amber-50/20 rounded-xs shadow-inner" />
                ))}
              </div>
              <span>35MM FILM</span>
            </div>
          </div>
        )}

        {/* High-Energy Skate & Brotherhood Sticker Deco for Neon-Nostalgia */}
        {isNeon && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 select-none animate-in fade-in duration-500">
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider -rotate-2 shadow-md">
              ⚡ 100% RAW
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider rotate-3 shadow-md">
              DOPE CREW
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-500 text-white text-[10px] font-black uppercase tracking-wider -rotate-1 shadow-md">
              STAY WILD 🛹
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider rotate-2 shadow-md">
              🔥 BROTHERHOOD
            </span>
          </div>
        )}

        {/* Botanical Autumn Leaf & Sunflower Deco for Cozy-Memories */}
        {isCozy && (
          <div className="flex items-center justify-center gap-3 mb-3 select-none text-xl sm:text-2xl opacity-90">
            <span>🌻</span>
            <span>🍂</span>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-800 bg-[#f5ebe0] px-3 py-1 rounded-full border border-amber-300">
              Autumn Keepsakes & Comfort Mugs
            </span>
            <span>🍁</span>
            <span>☕</span>
          </div>
        )}

        {/* Header Tape Strip */}
        <div 
          className={`w-32 sm:w-44 h-6 mx-auto -mb-3 rounded-xs opacity-85 z-30 relative shadow-xs ${
            isNeon 
              ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
              : (isCozy ? 'bg-amber-600/70 border-b border-amber-800/20' : 'washi-tape')
          }`}
          style={{ transform: 'rotate(-1.2deg)' }}
        />

        {/* Main Header Binder Card */}
        <div className={`relative rounded-3xl p-6 sm:p-10 border transition-all ${currentTheme.headerCardBg}`}>
          
          {/* Badge */}
          <div className="flex items-center justify-center mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${currentTheme.headerBadge.bg}`}>
              <AppleEmoji emoji={currentTheme.headerBadge.icon} size={14} />
              <span>{currentTheme.headerBadge.label}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight ${currentTheme.titleColor}`}>
            {renderAppleText(title)}
          </h1>

          {/* Subtitle */}
          <p className={`font-handwriting text-2xl sm:text-3xl mt-3 max-w-xl mx-auto leading-relaxed ${currentTheme.subtitleColor}`}>
            "{renderAppleText(subtitle)}"
          </p>

          {/* Meta Tags */}
          <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs opacity-75">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {siteData.date || "Edition: Timeless"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              {isNeon ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Locked In Brotherhood</span>
                </>
              ) : isCozy ? (
                <>
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Warm Comfort Chats</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5 text-amber-600" />
                  <span>Shot on 35mm Film</span>
                </>
              )}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Taped with Love</span>
            </span>
          </div>
        </div>
      </header>

      {/* Chapter Memory Timeline Section */}
      <section className="relative z-20 max-w-3xl mx-auto my-12 px-4">
        
        {/* Section Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest mb-1.5 opacity-70">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Storyline</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${currentTheme.titleColor}`}>
            Down Memory Lane
          </h2>
          <p className="text-xs sm:text-sm opacity-70 mt-1">
            Every chapter, road trip, and candid moment recorded forever
          </p>
        </div>

        {/* Timeline Path Container */}
        <div className={`relative border-l-2 border-dashed ml-4 sm:ml-28 space-y-12 ${currentTheme.timelinePathClass}`}>
          {timelineMemories.map((item, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-10">
              
              {/* Timeline Pin Node */}
              <div className={`absolute -left-3.5 top-2 w-7 h-7 rounded-full flex items-center justify-center border-2 ${currentTheme.pinNodeClass}`}>
                <AppleEmoji emoji={isNeon ? '⚡' : (isCozy ? '🌻' : '📌')} size={15} />
              </div>

              {/* Date stamp badge (mobile vs desktop) */}
              <div className={`sm:absolute sm:-left-28 sm:top-2 text-xs font-bold font-mono uppercase tracking-wider mb-1 sm:mb-0 sm:text-right sm:w-22 opacity-75 ${isNeon ? 'text-cyan-400' : 'text-amber-800'}`}>
                {item.date}
              </div>

              {/* Scrapbook Card with Polaroid Frame */}
              <div 
                className={`relative rounded-2xl p-5 sm:p-6 border transition-all duration-300 hover:scale-[1.01] ${currentTheme.cardBorder}`}
                style={{ transform: `rotate(${item.rotation || '0deg'})` }}
              >
                {/* Washi Tape Strip on Top */}
                <div 
                  className={`w-24 h-4 -mt-7 mb-3 mx-auto rounded-xs opacity-80 ${item.tapeColor || 'washi-tape'}`} 
                  style={{ transform: 'rotate(-1deg)' }}
                />

                <div className="flex flex-col md:flex-row items-center gap-5">
                  
                  {/* Polaroid Thumbnail with Click-to-Zoom */}
                  <div 
                    onClick={() => setActiveTimelinePhoto(item)}
                    className="group relative w-full md:w-48 shrink-0 polaroid-frame bg-white shadow-md p-2.5 pb-6 rounded-md cursor-pointer text-slate-800"
                    title="Click to view full photo"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-xs bg-slate-100 relative">
                      <img 
                        src={item.photo} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy" 
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ZoomIn className="w-6 h-6 drop-shadow-md" />
                      </div>
                    </div>
                    <div className="mt-2 text-center font-handwriting text-sm text-slate-700 truncate px-1">
                      {item.title}
                    </div>
                  </div>

                  {/* Memory Story Content */}
                  <div className="flex-1 text-left w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${
                        isNeon 
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' 
                          : (isCozy ? 'bg-amber-100/70 text-amber-900 border-amber-300' : 'bg-amber-50 text-amber-800 border-amber-200')
                      }`}>
                        {item.chapter}
                      </span>

                      {/* Interactive Love/React Button */}
                      <button
                        onClick={(e) => handleReactMemory(idx, e)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-transform active:scale-90 cursor-pointer ${
                          memoryReactions[idx] 
                            ? 'bg-rose-500 text-white border-rose-500' 
                            : 'bg-black/5 hover:bg-black/10 text-current border-transparent'
                        }`}
                        title="React to this memory"
                      >
                        <Heart className={`w-3.5 h-3.5 ${memoryReactions[idx] ? 'fill-current' : ''}`} />
                        <span>{memoryReactions[idx] || (isNeon ? 'Hype' : 'Love')}</span>
                      </button>
                    </div>

                    <h3 className={`font-bold text-lg sm:text-xl mt-2 ${currentTheme.titleColor}`}>
                      {renderAppleText(item.title)}
                    </h3>

                    <p className={`font-handwriting text-xl sm:text-2xl mt-2 leading-relaxed opacity-90 ${isNeon ? 'text-slate-200' : 'text-slate-700'}`}>
                      "{renderAppleText(item.note)}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Lightbox Modal for Timeline Polaroid */}
      {activeTimelinePhoto && (
        <div 
          onClick={() => setActiveTimelinePhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-white rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-800 animate-in zoom-in-95 duration-200 cursor-default"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveTimelinePhoto(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Polaroid Frame in Lightbox */}
            <div className="w-full aspect-square overflow-hidden rounded-md bg-slate-100 mb-4">
              <img 
                src={activeTimelinePhoto.photo} 
                alt={activeTimelinePhoto.title} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="text-left">
              <div className="flex items-center justify-between text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">
                <span>{activeTimelinePhoto.chapter}</span>
                <span>{activeTimelinePhoto.date}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {activeTimelinePhoto.title}
              </h3>
              <p className="font-handwriting text-2xl text-slate-700 mt-2 leading-relaxed">
                "{activeTimelinePhoto.note}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sealed Retro Letter Section */}
      <section className="relative z-20 my-16">
        <EnvelopeLetter
          to={recipientName}
          from={senderName}
          date={siteData.date || "Timeless Edition"}
          letterBody={letterBody}
          sealType={currentTheme.sealType}
          sealEmoji={currentTheme.sealEmoji}
          initials={currentTheme.sealEmoji}
          fontFamily="handwriting"
          subtitle={currentTheme.letterSubtitle}
          dark={isNeon}
        />
      </section>

      {/* Polaroid Gallery Grid with Lightbox */}
      <section className="relative z-20 my-16">
        <PolaroidGallery
          photos={siteData.photos}
          title={currentTheme.galleryTitle}
          subtitle={currentTheme.gallerySubtitle}
          tapeStyle={currentTheme.galleryTape}
          dark={isNeon}
        />
      </section>

      {/* Inside Jokes & Fun Nostalgic Quiz */}
      <section className="relative z-20 my-16">
        <CuteQuiz
          quiz={siteData.quiz}
          theme={isNeon ? 'gold' : (isCozy ? 'rose' : 'rose')}
          quizTitle={currentTheme.quizTitle}
          fallbackQuestion={currentTheme.quizQuestion}
          fallbackOptions={currentTheme.quizOptions}
          correctIndex={3}
          rewardText={siteData.quiz?.rewardText || siteData.quiz?.rewardMessage || currentTheme.quizReward}
        />
      </section>

      {/* Keepsake Scratch Card */}
      <section className="relative z-20 my-16">
        <ScratchCard
          scratchCard={siteData.scratchCard}
          title={currentTheme.scratchTitle}
          subtitle={currentTheme.scratchSubtitle}
          hiddenMessage={siteData.scratchCard?.hiddenSecret || siteData.scratchCard?.hiddenMessage || currentTheme.scratchSecret}
          voucherCode={siteData.scratchCard?.code || currentTheme.scratchCode}
          theme={currentTheme.scratchTheme}
        />
      </section>

      {/* Keepsake Footer */}
      <TemplateFooter onCreateClick={onNavigateCreate} dark={isNeon} />
    </div>
  );
}