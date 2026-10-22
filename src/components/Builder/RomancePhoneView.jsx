import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Music,
  Play,
  Pause,
  Award
} from 'lucide-react';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { soundEffects } from '../Templates/common/SoundEffects';

export default function RomancePhoneView({
  formData = {},
  theme = {},
  triggerConfetti,
  onReset: _onReset
}) {
  const [activeTab, setActiveTab] = useState('adore'); // 'adore' | 'letter' | 'moments' | 'scratch'
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [loveCount, setLoveCount] = useState(0);
  const [loveToast, setLoveToast] = useState(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [likedReasons, setLikedReasons] = useState({});
  const [isScratched, setIsScratched] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const templateId = (formData.templateId || theme.id || '').toLowerCase();
  const isSunset = templateId.includes('sunset');
  const isCelestial = templateId.includes('celestial');
  const _isVelvet = !isSunset && !isCelestial;

  const recipientName = (formData.recipientName || '').trim() || (theme.gender === 'girl' ? 'Maya' : 'Liam');
  const senderName = (formData.senderName || '').trim() || (theme.gender === 'girl' ? 'Liam' : 'Maya');

  // Theme configuration
  const themeConfig = (() => {
    if (isCelestial) {
      return {
        badgeText: 'Written in the Stars 🌌',
        badgeBg: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40',
        headerClass: 'text-white',
        accentColor: 'text-indigo-400',
        bgPill: 'bg-indigo-900/40 border-indigo-500/30 text-indigo-200',
        cardBg: 'bg-slate-900/90 border-indigo-500/30 text-slate-100',
        activeTabBg: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/30',
        buttonClass: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/30',
        sealEmoji: '🌙',
        scratchSecret: '1x Stargazing Drive + Midnight Conversations Under the Moon 🌙✨',
        scratchCode: 'STARS-FOREVER-2026',
        scratchFoil: 'bg-gradient-to-br from-indigo-300 via-indigo-600 to-purple-700',
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
        badgeText: 'Golden Hour Keepsake 🌅',
        badgeBg: 'bg-amber-100/80 text-amber-800 border-amber-300/80',
        headerClass: 'text-amber-950',
        accentColor: 'text-amber-600',
        bgPill: 'bg-amber-100/70 border-amber-300/80 text-amber-900',
        cardBg: 'bg-[#FFFDF9] border-amber-200/90 text-slate-800',
        activeTabBg: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/30',
        buttonClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30',
        sealEmoji: '✨',
        scratchSecret: '1x Sunset Walk + Warm Coffee & Pastries on Me! ☕🌅',
        scratchCode: 'GOLDEN-HOUR-2026',
        scratchFoil: 'bg-gradient-to-br from-amber-200 via-amber-500 to-orange-600',
        defaultSubtitle: "From our very first hello to forever and beyond, every sunset is brighter with you.",
        defaultReasons: [
          { title: "Golden Warmth", desc: "Your radiant smile brings golden hour warmth into my life no matter the season.", icon: "🌅" },
          { title: "Guiding Light", desc: "You are the calm in my storm and the brightest light guiding me forward.", icon: "✨" },
          { title: "Tender Promises", desc: "The quiet promises kept and the steady peace you bring to my heart every day.", icon: "🧡" },
        ],
        defaultLetter: `Dearest ${recipientName},\n\nFrom the moment you smiled at me, my world lit up like a breathtaking sunset. You are my calm sanctuary, my favorite adventure, and my golden hour every single day.\n\nThank you for being the sweetest part of my days and for filling our life with laughter and tenderness. I adore you beyond words.\n\nAlways & forever yours,\n${senderName} 🌅✨`,
      };
    }

    // Default: Velvet Romance
    return {
      badgeText: 'Forever in My Heart ❤️',
      badgeBg: 'bg-rose-100/80 text-rose-800 border-rose-300/80',
      headerClass: 'text-rose-950',
      accentColor: 'text-rose-600',
      bgPill: 'bg-rose-100/70 border-rose-300/80 text-rose-900',
      cardBg: 'bg-[#FFFDFD] border-rose-200/90 text-slate-800',
      activeTabBg: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-500/30',
      buttonClass: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-500/30',
      sealEmoji: '❤️',
      scratchSecret: 'Unlimited cuddles, late-night dessert runs & loving you forever! 🍨🌹',
      scratchCode: 'LOVE-FOREVER-2026',
      scratchFoil: 'bg-gradient-to-br from-rose-200 via-rose-500 to-red-600',
      defaultSubtitle: "In a world of billions of people, my happiest place will always be right beside you.",
      defaultReasons: [
        { title: "Your Radiant Smile", desc: "How it effortlessly turns even my most exhausting day into pure joy.", icon: "✨" },
        { title: "Your Gentle Soul", desc: "The quiet kindness and endless warmth you show to everyone around you.", icon: "🌸" },
        { title: "Our Inside Jokes", desc: "How a single glance from across the room can make us burst into giggles.", icon: "💫" },
      ],
      defaultLetter: `My Love,\n\nLooking back at our journey together, every single moment by your side has been a treasure. You bring warmth, laughter, and an unspoken comfort into my life that nothing else could ever replace.\n\nThank you for choosing me, for holding my hand through everything, and for filling my heart with peace and romance.\n\nI love you more than words could ever fit on this page, today and for all the tomorrows to come.\n\nForever yours,\n${senderName} ❤️`,
    };
  })();

  const loveToastMessages = [
    'You have my whole heart ❤️',
    'Loving you is effortless 🌹',
    'My favorite human 🥰',
    'To all our tomorrows together 💕',
    'Forever yours, my love ✨'
  ];

  const handleShowerLove = () => {
    soundEffects.playCelebration();
    const nextCount = loveCount + 1;
    setLoveCount(nextCount);
    const msg = loveToastMessages[loveCount % loveToastMessages.length];
    setLoveToast(msg);
    setTimeout(() => setLoveToast(null), 2000);
    if (triggerConfetti) triggerConfetti();
  };

  const toggleReasonLike = (idx) => {
    soundEffects.playPop();
    setLikedReasons(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleOpenEnvelope = () => {
    soundEffects.playSealBreak();
    if (triggerConfetti) triggerConfetti();
    setEnvelopeOpen(true);
  };

  const handleScratch = () => {
    if (!isScratched) {
      soundEffects.playScratch();
      soundEffects.playCelebration();
      setIsScratched(true);
      if (triggerConfetti) triggerConfetti();
    }
  };

  const reasons = (formData.specialReasons && formData.specialReasons.length > 0)
    ? formData.specialReasons
    : themeConfig.defaultReasons;

  const letterBody = (typeof formData.letter === 'object' ? formData.letter?.content : formData.letter) 
    || formData.letterBody 
    || themeConfig.defaultLetter;

  const photos = (formData.photos && formData.photos.length > 0)
    ? formData.photos
    : [
        {
          url: formData.heroPhoto || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
          caption: formData.photoCaption || 'My favorite smile in the world 🌹'
        },
        {
          url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
          caption: 'Golden sunsets with you 🌅'
        }
      ];

  const currentPhoto = photos[activePhotoIdx % photos.length];

  return (
    <div className="flex-1 w-full flex flex-col justify-between overflow-y-auto custom-scrollbar relative z-20 select-none pb-1">
      
      {/* Floating Love Toast inside phone preview */}
      {loveToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-lg">
            <Heart className="w-3 h-3 text-rose-500 fill-current animate-pulse" />
            <span>{loveToast}</span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. ROMANTIC HEADER: SERIF TYPOGRAPHY & SHOWER LOVE BUTTON */}
      {/* =================================================================== */}
      <div className="px-3 pt-1 pb-2 shrink-0">
        <div className={`w-full rounded-2xl p-2.5 shadow-sm border text-center transition-all ${themeConfig.cardBg}`}>
          
          {/* Curated Theme Badge */}
          <div className="inline-flex items-center justify-center mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${themeConfig.badgeBg}`}>
              {themeConfig.badgeText}
            </span>
          </div>

          {/* Romantic Title in font-serif */}
          <h1 className={`font-serif text-lg sm:text-xl font-bold tracking-tight leading-tight ${themeConfig.headerClass}`}>
            <span>{formData.occasion || 'Happy Anniversary,'} </span>
            <span className={themeConfig.accentColor}>{recipientName} ❤️</span>
          </h1>

          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-2 px-1">
            "{formData.subtitle || themeConfig.defaultSubtitle}"
          </p>

          {/* Interactive Shower Love Button */}
          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleShowerLove}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-sm ${themeConfig.buttonClass}`}
            >
              <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span>Shower Love</span>
              {loveCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white/30 text-[9px]">
                  {loveCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Ambient Cassette Audio Pill */}
        <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 rounded-2xl bg-white/90 border border-rose-200/80 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Music className={`w-3 h-3 ${isPlayingAudio ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-800 leading-none">Keepsake Melody ♫</p>
              <p className="text-[8px] text-slate-500 mt-0.5">Acoustic Romance</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              setIsPlayingAudio(!isPlayingAudio);
            }}
            className="w-6 h-6 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center cursor-pointer transition-transform active:scale-90"
          >
            {isPlayingAudio ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. DEDICATED ROMANCE TABS (NOT BIRTHDAY SCENES!) */}
      {/* =================================================================== */}
      <div className="px-3 shrink-0">
        <div className="grid grid-cols-4 gap-1 p-1 bg-rose-900/10 rounded-xl border border-rose-900/10 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => { soundEffects.playPop(); setActiveTab('adore'); }}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'adore' ? themeConfig.activeTabBg : 'text-slate-700 hover:bg-rose-100/50'
            }`}
          >
            <span>🌹</span>
            <span className="text-[9px]">Adore</span>
          </button>

          <button
            type="button"
            onClick={() => { soundEffects.playPop(); setActiveTab('letter'); }}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'letter' ? themeConfig.activeTabBg : 'text-slate-700 hover:bg-rose-100/50'
            }`}
          >
            <span>💌</span>
            <span className="text-[9px]">Letter</span>
          </button>

          <button
            type="button"
            onClick={() => { soundEffects.playPop(); setActiveTab('moments'); }}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'moments' ? themeConfig.activeTabBg : 'text-slate-700 hover:bg-rose-100/50'
            }`}
          >
            <span>📸</span>
            <span className="text-[9px]">Moments</span>
          </button>

          <button
            type="button"
            onClick={() => { soundEffects.playPop(); setActiveTab('scratch'); }}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'scratch' ? themeConfig.activeTabBg : 'text-slate-700 hover:bg-rose-100/50'
            }`}
          >
            <span>✨</span>
            <span className="text-[9px]">Secret</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. TAB CONTENT VIEWS */}
      {/* =================================================================== */}
      <div className="flex-1 px-3 py-2 flex flex-col justify-center">
        
        {/* TAB 1: DEVOTION CARDS (WHY I ADORE YOU) */}
        {activeTab === 'adore' && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <div className="text-center mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">From The Heart</span>
              <h3 className="font-serif text-xs font-bold text-slate-800">Little Things I Adore About You</h3>
            </div>

            {reasons.slice(0, 3).map((r, idx) => {
              const isLiked = !!likedReasons[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleReasonLike(idx)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs ${
                    isLiked ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200/80 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0">
                      <AppleEmoji emoji={r.icon || '❤️'} size={18} />
                    </span>
                    <div className="text-left min-w-0">
                      <h4 className="text-[11px] font-bold text-slate-800 truncate">
                        {renderAppleText(r.title)}
                      </h4>
                      <p className="text-[9px] text-slate-500 line-clamp-1">
                        {renderAppleText(r.desc)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`p-1 rounded-full transition-transform active:scale-75 ${
                      isLiked ? 'text-rose-600 scale-110' : 'text-slate-300'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: WAX SEALED LOVE LETTER */}
        {activeTab === 'letter' && (
          <div className="animate-in fade-in duration-300">
            {!envelopeOpen ? (
              <div 
                onClick={handleOpenEnvelope}
                className="group relative rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0] p-4 text-center border border-amber-200/80 shadow-md cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
              >
                <div className="text-[10px] font-bold text-amber-800/80 mb-0.5">Sealed Love Letter</div>
                <h4 className="text-sm font-bold text-slate-800">For My Dearest {recipientName}</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">Tap the wax seal to break open your letter</p>

                {/* Wax Seal Stamp */}
                <div className="my-3 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-md flex items-center justify-center border-2 border-rose-300/40 group-hover:scale-110 transition-transform">
                    <AppleEmoji emoji={themeConfig.sealEmoji} size={18} />
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-600 bg-white/90 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                  <span>Break Wax Seal</span>
                  <span>✨</span>
                </span>
              </div>
            ) : (
              /* Unfolded Letter Parchment */
              <div className="rounded-2xl paper-parchment p-3.5 shadow-md border border-amber-200 text-left relative max-h-[220px] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-1.5 mb-2">
                  <span className="text-[9px] font-bold text-rose-700">Dearest {recipientName},</span>
                  <span className="text-[8px] text-amber-800/60 font-mono">AIR MAIL ❤️</span>
                </div>
                <p className="font-handwriting text-base text-slate-800 leading-snug whitespace-pre-line">
                  {renderAppleText(letterBody)}
                </p>
                <div className="mt-3 pt-1.5 border-t border-amber-900/10 flex items-center justify-between">
                  <span className="font-handwriting text-sm font-bold text-rose-600">
                    Forever yours, {senderName} ❤️
                  </span>
                  <button
                    type="button"
                    onClick={() => setEnvelopeOpen(false)}
                    className="text-[8px] font-bold text-slate-500 hover:text-slate-800 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200 cursor-pointer"
                  >
                    Refold
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COUPLE POLAROID GALLERY */}
        {activeTab === 'moments' && (
          <div className="animate-in fade-in duration-300 flex flex-col items-center">
            <div className="relative w-full max-w-[210px] bg-white p-2 pb-4 rounded-xl shadow-md border border-slate-200 text-slate-800 rotate-[-1deg]">
              {/* Tape deco */}
              <div className="w-16 h-3 -mt-3.5 mx-auto bg-rose-200/90 border border-rose-300/80 rounded-xs shadow-2xs rotate-[-2deg]" />

              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 my-1">
                <img
                  src={currentPhoto.url}
                  alt={currentPhoto.caption || recipientName}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-handwriting text-xs text-slate-700 text-center truncate px-1 mt-1">
                "{currentPhoto.caption || 'My favorite smile in the world 🌹'}"
              </p>
            </div>

            {/* Photo pagination controls */}
            {photos.length > 1 && (
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length)}
                  className="p-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer active:scale-90"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9px] font-mono text-slate-500 font-bold">
                  {activePhotoIdx + 1} / {photos.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActivePhotoIdx((prev) => (prev + 1) % photos.length)}
                  className="p-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer active:scale-90"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: METALLIC LOVE SCRATCH CARD */}
        {activeTab === 'scratch' && (
          <div className="animate-in fade-in duration-300 text-center">
            <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">
              Secret Keepsake Voucher
            </div>
            
            <div 
              onClick={handleScratch}
              className="relative w-full rounded-2xl p-4 border border-rose-200 shadow-md overflow-hidden cursor-pointer bg-white transition-transform active:scale-98"
            >
              {!isScratched ? (
                /* Metallic Foil Cover */
                <div className={`p-4 rounded-xl ${themeConfig.scratchFoil} text-white shadow-inner flex flex-col items-center justify-center min-h-[90px]`}>
                  <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse mb-1" />
                  <p className="text-xs font-bold tracking-tight">Tap to Scratch Metallic Foil</p>
                  <p className="text-[9px] text-white/80 mt-0.5">Reveal secret promise & coupon code</p>
                </div>
              ) : (
                /* Revealed Secret Promise */
                <div className="p-3 rounded-xl bg-gradient-to-b from-rose-50 to-pink-50 border border-rose-200 text-slate-800 animate-in zoom-in-95 duration-300">
                  <div className="text-xl mb-1">🌹</div>
                  <h4 className="text-xs font-bold text-rose-950">Secret Promise Unlocked!</h4>
                  <p className="font-handwriting text-sm text-rose-700 mt-1 leading-snug">
                    "{themeConfig.scratchSecret}"
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-rose-200 text-[8px] font-mono font-bold text-rose-600">
                    <Award className="w-3 h-3 text-rose-500" />
                    <span>CODE: {themeConfig.scratchCode}</span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[8px] text-slate-400 mt-1">Valid forever with zero expiration date ❤️</p>
          </div>
        )}

      </div>
    </div>
  );
}
