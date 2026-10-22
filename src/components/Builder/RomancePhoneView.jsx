import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { soundEffects } from '../Templates/common/SoundEffects';
import { getSongById } from '../../data/songs';

// Curated romantic memories for fallback
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
  }
];

// Runaway "No" button messages and positions (kept safe inside 260px container)
const RUNAWAY_POSITIONS = ['5%', '45%', '15%', '40%', '25%', '8%'];
const NO_MESSAGES = [
  'No',
  'Think again! 😉',
  'Are you sure? 🥺',
  'Wrong button! 😂',
  'Try other one! 💖',
  'No escape! 🥰'
];

export default function RomancePhoneView({
  formData = {},
  theme = {},
  triggerConfetti: parentTriggerConfetti,
  onReset: _onReset,
  activeTab: controlledTab,
  onTabChange,
  openEnvelope: controlledOpenEnvelope,
  resetNonce: _resetNonce,
}) {
  const templateId = (formData.templateId || theme.id || '').toLowerCase();
  const isCelestial = templateId.includes('celestial');
  const isSunset = templateId.includes('sunset');

  // Recipient & Sender Names
  const recipientName = (formData.recipientName || '').trim() || (theme.gender === 'girl' ? 'My Love' : 'Sweetheart');
  const senderName = (formData.senderName || '').trim() || (theme.gender === 'girl' ? 'Your Favorite Person' : 'Forever Yours');

  // Resolved Photos array
  const rawPhotos = (formData.photos && formData.photos.length > 0)
    ? formData.photos
    : (formData.heroPhoto
        ? [{ id: 'p1', url: formData.heroPhoto, caption: formData.photoCaption !== undefined ? formData.photoCaption : 'The prettiest smile in the world ✨', tag: 'Special Moment 🌸' }]
        : DEFAULT_ROMANCE_PHOTOS);

  const photos = rawPhotos.map((p, idx) => ({
    id: p.id || `photo-${idx}`,
    url: p.url || p.src || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    caption: p.caption !== undefined ? p.caption : (formData.photoCaption !== undefined ? formData.photoCaption : 'My favorite memory with you ✨'),
    tag: p.tag || `Memory #${idx + 1}`
  }));

  // Letter Content
  const defaultLetterText = `My dearest ${recipientName},\n\nFrom the moment you entered my life, ordinary days became unforgettable adventures. Your smile brightens even my cloudiest days, and your laugh is honestly my favorite sound.\n\nThank you for holding my hand when things get chaotic and for always knowing how to make me smile with just one look. Here is to a lifetime of quiet sunsets and sweet laughter together.\n\n— With all my love, always ${senderName} 💖`;

  const rawLetter = typeof formData.letter === 'object' && formData.letter !== null && formData.letter.content !== undefined
    ? formData.letter.content
    : (typeof formData.letter === 'string' ? formData.letter : formData.letterBody);

  const letterContent = rawLetter !== undefined ? rawLetter : defaultLetterText;

  // Audio stream
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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [internalTab, setInternalTab] = useState('photos');
  const activeTabRaw = controlledTab !== undefined ? controlledTab : internalTab;
  const activeTab = activeTabRaw === 'game' ? 'quiz' : activeTabRaw;

  const handleSelectTab = (tabKey) => {
    soundEffects.playPop();
    if (onTabChange) {
      onTabChange(tabKey);
    } else {
      setInternalTab(tabKey);
    }
  };

  // Tab 1: Photos State
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState({});
  const [showPhotoLikePop, setShowPhotoLikePop] = useState(false);

  // Tab 2: Letter State
  const [internalLetterOpen, setInternalLetterOpen] = useState(false);
  const isLetterOpen = controlledOpenEnvelope !== undefined ? controlledOpenEnvelope : internalLetterOpen;

  // Tab 3: Quiz State (Runaway "No" Button Game!)
  const [gameVictory, setGameVictory] = useState(false);
  const [noRunawayStep, setNoRunawayStep] = useState(0);
  const [noAttempts, setNoAttempts] = useState(0);
  const [yesScale, setYesScale] = useState(1);

  // Audio Ref
  const audioRef = useRef(null);

  // Auto-open letter when prop changes
  useEffect(() => {
    if (controlledOpenEnvelope) {
      setInternalLetterOpen(true);
    }
  }, [controlledOpenEnvelope]);

  const toggleAudio = (e) => {
    if (e) e.stopPropagation();
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
  };

  const triggerLocalConfetti = useCallback(() => {
    if (parentTriggerConfetti) {
      parentTriggerConfetti();
    } else {
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { x: 0.5, y: 0.6 },
          colors: isCelestial
            ? ['#818CF8', '#A855F7', '#60A5FA', '#F472B6']
            : ['#FF1493', '#FF69B4', '#FFB6C1', '#FFFFFF', '#FFAEC2']
        });
      } catch {}
    }
  }, [parentTriggerConfetti, isCelestial]);

  // Tab 1: Photos Navigation
  const totalPhotosCount = photos.length;
  const activePhoto = photos[(currentPhotoIdx % totalPhotosCount + totalPhotosCount) % totalPhotosCount] || photos[0];
  const isCurrentPhotoLiked = !!likedPhotos[activePhoto.id];

  const handleNextPhoto = (e) => {
    if (e) e.stopPropagation();
    soundEffects.playPop();
    setCurrentPhotoIdx((prev) => (prev + 1) % totalPhotosCount);
  };

  const handlePrevPhoto = (e) => {
    if (e) e.stopPropagation();
    soundEffects.playPop();
    setCurrentPhotoIdx((prev) => (prev - 1 + totalPhotosCount) % totalPhotosCount);
  };

  const togglePhotoLike = (e) => {
    if (e) e.stopPropagation();
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
    setYesScale((prev) => Math.min(prev + 0.12, 1.45));
    triggerLocalConfetti();
  };

  const handleYesVictory = () => {
    setGameVictory(true);
    soundEffects.playCelebration();
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

  // Palette Classes
  const containerBg = isCelestial
    ? 'bg-gradient-to-b from-[#070a14] via-[#0c1427] to-[#0a0f1d] text-slate-100'
    : isSunset
    ? 'bg-gradient-to-b from-[#fffdf8] via-[#fef3c7]/60 to-[#fffaf0] text-amber-950'
    : 'bg-gradient-to-b from-[#fff8f9] via-[#ffe9ed]/60 to-[#fff0f3] text-rose-950';

  const cardBg = isCelestial
    ? 'bg-slate-900/90 border-indigo-400/30 text-white shadow-indigo-950/40'
    : isSunset
    ? 'bg-white/95 border-amber-200/90 text-slate-800 shadow-amber-900/5'
    : 'bg-white/95 border-rose-200/90 text-slate-800 shadow-rose-900/5';

  const pillActiveBg = isCelestial
    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
    : isSunset
    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
    : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs';

  const btnPrimary = isCelestial
    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-indigo-500/30'
    : isSunset
    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-amber-500/25'
    : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-500/25';

  return (
    <div className={`flex-1 w-full min-h-0 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar relative z-20 select-none pb-2 ${containerBg}`}>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
        onPlay={() => setIsPlayingAudio(true)}
        onPause={() => setIsPlayingAudio(false)}
      />

      {/* 1. TOP HEADER & ROTATING VINYL MUSIC PILL */}
      <div className="w-full px-3 pt-1 pb-1 shrink-0 flex items-center justify-between gap-1.5 z-30">
        <div className="flex items-center gap-1 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
          <span className="text-[10px] font-bold tracking-tight truncate opacity-80">
            {formData.occasion || 'Romantic Keepsake 🌸'}
          </span>
        </div>

        {/* Mini Rotating Vinyl Audio Pill */}
        <button
          type="button"
          onClick={toggleAudio}
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/90 hover:bg-white border border-rose-200/80 shadow-2xs text-[9.5px] font-medium text-slate-800 transition-all active:scale-95 cursor-pointer max-w-[145px]"
          title={isPlayingAudio ? 'Pause melody' : 'Play melody'}
        >
          {/* Mini Rotating Disc Graphic */}
          <div className="relative w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-inner">
            <div className={`w-1.5 h-1.5 rounded-full bg-rose-400 ${isPlayingAudio ? 'animate-spin' : ''}`} />
          </div>

          <span className="truncate">{audioTitle}</span>

          {/* Mini 3-bar Equalizer */}
          <div className="flex items-end gap-0.5 h-2.5 shrink-0">
            <span className={`w-0.5 bg-rose-500 rounded-full ${isPlayingAudio ? 'h-2.5 animate-pulse' : 'h-1'}`} />
            <span className={`w-0.5 bg-pink-500 rounded-full ${isPlayingAudio ? 'h-1.5 animate-pulse delay-75' : 'h-1.5'}`} />
            <span className={`w-0.5 bg-rose-600 rounded-full ${isPlayingAudio ? 'h-2 animate-pulse delay-150' : 'h-0.5'}`} />
          </div>
        </button>
      </div>

      {/* 2. SOFT HERO GREETING */}
      <div className="px-3 pt-0.5 pb-1 text-center shrink-0">
        <h1 className="font-serif text-lg font-bold tracking-tight flex items-center justify-center gap-1 text-slate-900 leading-tight">
          <span>Hey {renderAppleText(recipientName)}</span>
          <AppleEmoji emoji="🌸" size={18} />
        </h1>
        <p className="text-[10px] text-slate-500 leading-snug mt-0.5 max-w-[250px] mx-auto truncate">
          A little corner made just to bring a smile to your face ✨
        </p>
      </div>

      {/* 3. THREE ICONIC SEGMENTED NAV PILLS */}
      <div className="w-full max-w-[250px] mx-auto px-2 pb-2 shrink-0">
        <div className="w-full flex items-center p-0.5 rounded-full bg-white/85 backdrop-blur-md border border-rose-200/80 shadow-2xs text-[10px]">
          <button
            type="button"
            onClick={() => handleSelectTab('photos')}
            className={`flex-1 py-1 px-1.5 rounded-full transition-all text-center flex items-center justify-center gap-1 cursor-pointer select-none font-bold ${
              activeTab === 'photos' ? pillActiveBg : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AppleEmoji emoji="📸" size={12} />
            <span>Photos</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('letter')}
            className={`flex-1 py-1 px-1.5 rounded-full transition-all text-center flex items-center justify-center gap-1 cursor-pointer select-none font-bold ${
              activeTab === 'letter' ? pillActiveBg : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AppleEmoji emoji="💌" size={12} />
            <span>Letter</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('quiz')}
            className={`flex-1 py-1 px-1.5 rounded-full transition-all text-center flex items-center justify-center gap-1 cursor-pointer select-none font-bold ${
              activeTab === 'quiz' ? pillActiveBg : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AppleEmoji emoji="🙈" size={12} />
            <span>Quiz</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN DEDICATED CONTENT PANELS (Scoped neatly to 260px) */}
      <div className="flex-1 w-full px-2.5 flex flex-col items-center justify-center min-h-0">

        {/* TAB 1: [📸 PHOTOS] */}
        {activeTab === 'photos' && (
          <div className="w-full max-w-[250px] mx-auto flex flex-col items-center animate-in fade-in duration-200">
            {/* Polaroid Memory Card */}
            <div className={`w-full rounded-2xl p-2.5 shadow-md border ${cardBg} relative`}>
              {/* Cute Washi Tape Accent on Top */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-rose-200/90 border border-rose-300/80 shadow-2xs rotate-[-1.5deg] rounded-xs flex items-center justify-center pointer-events-none z-10">
                <div className="w-12 border-t border-dashed border-rose-500/40" />
              </div>

              {/* Photo Image Frame */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 my-1 shadow-inner group">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.caption || recipientName}
                  className="w-full h-full object-cover transition-transform duration-300"
                />

                {/* Heart Burst Reaction Overlay */}
                {showPhotoLikePop && (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center z-20 animate-in zoom-in-50 duration-200">
                    <span className="text-4xl animate-bounce">💖</span>
                  </div>
                )}

                {/* Floating Heart Button */}
                <button
                  type="button"
                  onClick={togglePhotoLike}
                  className="absolute bottom-1.5 right-1.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-rose-500 shadow-md transition-transform active:scale-90 cursor-pointer"
                  title="Like photo"
                >
                  <AppleEmoji emoji={isCurrentPhotoLiked ? '💖' : '🤍'} size={14} />
                </button>
              </div>

              {/* Romantic Tag & Caption */}
              <div className="text-center pt-1 px-1">
                <div className="inline-block px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200/70 text-[8.5px] font-semibold text-rose-700">
                  {activePhoto.tag || 'Cherished Memory 🌸'}
                </div>
                {activePhoto.caption ? (
                  <p className="font-serif italic text-xs text-slate-800 mt-1 line-clamp-2 leading-snug">
                    "{renderAppleText(activePhoto.caption, 12)}"
                  </p>
                ) : null}
              </div>
            </div>

            {/* Prev / Counter / Next Controls */}
            <div className="flex items-center justify-between w-full mt-2 px-1">
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="py-1 px-3 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-slate-700 text-[10px] font-bold shadow-2xs active:scale-95 cursor-pointer"
              >
                ← Prev
              </button>

              <div className="px-2.5 py-0.5 rounded-full bg-white/90 border border-rose-200 text-[10px] font-mono font-bold text-rose-600 shadow-2xs">
                {((currentPhotoIdx % totalPhotosCount) + totalPhotosCount) % totalPhotosCount + 1} / {totalPhotosCount}
              </div>

              <button
                type="button"
                onClick={handleNextPhoto}
                className="py-1 px-3 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-slate-700 text-[10px] font-bold shadow-2xs active:scale-95 cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: [💌 LETTER] */}
        {activeTab === 'letter' && (
          <div className="w-full max-w-[250px] mx-auto flex flex-col items-center animate-in fade-in duration-200">
            {!isLetterOpen ? (
              /* CLOSED VINTAGE ENVELOPE */
              <div
                onClick={() => {
                  soundEffects.playSealBreak();
                  triggerLocalConfetti();
                  setInternalLetterOpen(true);
                }}
                className={`w-full rounded-2xl p-4 shadow-lg border-2 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 ${cardBg} relative text-center`}
                title="Tap to unseal handwritten letter"
              >
                {/* Airmail / Special Postage Stamp in top corner */}
                <div className="absolute top-2.5 right-2.5 w-8 h-10 border border-dashed border-rose-400/80 rounded bg-rose-50/90 flex flex-col items-center justify-center shadow-2xs">
                  <span className="text-[10px] leading-none">🌹</span>
                  <span className="text-[5.5px] font-bold text-rose-800 mt-0.5">SPECIAL</span>
                </div>

                {/* Delicate Crest */}
                <div className="text-[7.5px] font-bold text-rose-600/80 tracking-widest uppercase mb-2">
                  ✦ FOR MY FAVORITE PERSON ✦
                </div>

                {/* Recipient Addressee */}
                <p className="font-serif text-sm font-bold text-slate-900">
                  To: {recipientName} 💌
                </p>

                {/* Center Wax Seal Button */}
                <div className="my-3 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 border-2 border-white shadow-md flex items-center justify-center transform group-hover:scale-105">
                    <span className="text-xl">🌸</span>
                  </div>
                </div>

                <div className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[9.5px] font-bold text-rose-700 shadow-2xs">
                  Tap to open sealed letter ✨
                </div>
              </div>
            ) : (
              /* UNSEALED HANDWRITTEN LETTER */
              <div className={`w-full rounded-2xl p-3.5 shadow-lg border-2 text-left relative ${cardBg} animate-in fade-in duration-300`}>
                <div className="border-b border-rose-100 pb-1.5 mb-2 text-center">
                  <span className="text-[8px] font-bold tracking-widest uppercase text-rose-500">
                    ✦ FOR MY FAVORITE PERSON ✦
                  </span>
                </div>

                {/* Letter Body in Romantic Handwritten Font */}
                <div className="font-serif text-[11px] leading-relaxed text-slate-700 max-h-48 overflow-y-auto custom-scrollbar pr-1 whitespace-pre-line break-words">
                  {renderAppleText(letterContent, 12)}
                </div>

                {/* Fold Back Button */}
                <div className="mt-2.5 pt-2 border-t border-rose-100 flex justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEffects.playPop();
                      setInternalLetterOpen(false);
                    }}
                    className="py-1 px-4 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold shadow-2xs cursor-pointer active:scale-95"
                  >
                    Fold Back 🌸
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: [🙈 QUIZ] (RUNAWAY "NO" BUTTON GAME!) */}
        {activeTab === 'quiz' && (
          <div className="w-full max-w-[250px] mx-auto flex flex-col items-center animate-in fade-in duration-200">
            {!gameVictory ? (
              /* GAME ACTIVE ARENA */
              <div className={`w-full rounded-2xl p-3.5 shadow-lg border text-center relative ${cardBg}`}>
                <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 mx-auto flex items-center justify-center text-sm shadow-2xs mb-1">
                  🌸
                </div>

                <h3 className="font-serif text-sm font-bold text-slate-900 leading-tight">
                  Tell Me Truthfully...
                </h3>
                <p className="text-[9.5px] text-slate-500 mt-0.5 leading-snug">
                  There is only one honest answer! 💖
                </p>

                {/* The Romantic Question */}
                <p className="font-serif italic font-bold text-xs text-rose-950 my-2 px-1 leading-snug">
                  “Do you like spending time with me?” 🌸
                </p>

                {/* Game Action Arena */}
                <div className="relative w-full min-h-[90px] flex flex-col items-center justify-center gap-2 pt-1">
                  {/* YES Button (Scales up with each No attempt!) */}
                  <div style={{ transform: `scale(${yesScale})`, transition: 'transform 0.2s ease-out' }}>
                    <button
                      type="button"
                      onClick={handleYesVictory}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-transform ${btnPrimary}`}
                    >
                      <span>YES, VERY MUCH!</span>
                      <span className="ml-1">🥰</span>
                    </button>
                  </div>

                  {/* Runaway NO Button */}
                  <div
                    className="w-full relative h-8 flex items-center justify-center"
                  >
                    <button
                      type="button"
                      onMouseEnter={handleNoRunaway}
                      onTouchStart={handleNoRunaway}
                      onClick={handleNoRunaway}
                      style={{
                        position: noAttempts === 0 ? 'relative' : 'absolute',
                        left: noAttempts === 0 ? undefined : currentNoPos,
                        transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="py-1 px-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 text-[10px] font-semibold cursor-pointer active:scale-90 shadow-2xs select-none"
                    >
                      {currentNoMsg}
                    </button>
                  </div>
                </div>

                <p className="text-[8.5px] text-slate-400 mt-1 italic">
                  (Notice: 'No' button runs away 😉)
                </p>
              </div>
            ) : (
              /* VICTORY STATE: TREAT UNLOCKED VOUCHER */
              <div className={`w-full rounded-2xl p-3 shadow-lg border text-center ${cardBg} animate-in zoom-in-95 duration-200`}>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[8.5px] font-bold text-rose-700 tracking-wider mb-1">
                  ✦ TREAT UNLOCKED ✦
                </div>

                <h3 className="font-serif text-sm font-bold text-slate-900 flex items-center justify-center gap-1">
                  <span>Haha, Knew It!</span>
                  <span>😄</span>
                </h3>

                <p className="text-[9px] text-slate-600 mt-0.5 leading-snug px-1">
                  One Dairy Milk Silk is officially pending from my side anytime you want! 🍫😋
                </p>

                {/* Sweet Dessert Voucher Ticket */}
                <div className="my-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-left relative overflow-hidden shadow-2xs">
                  <div className="text-[7.5px] font-bold tracking-widest uppercase text-amber-800">
                    ★ SPECIAL DESSERT VOUCHER ★
                  </div>
                  <div className="text-xs font-bold text-amber-950 mt-0.5 flex items-center gap-1">
                    <span>🍫 Dairy Milk Silk</span>
                  </div>
                  <p className="text-[8.5px] text-amber-800/90 mt-0.5">
                    Reserved exclusively for <strong>{recipientName}</strong> 🌸
                  </p>
                  <div className="mt-1 pt-1 border-t border-amber-200/80 flex items-center justify-between text-[7px] text-amber-900/60 font-mono">
                    <span>||| |||| || |||||</span>
                    <span>Redeemable Anytime ✨</span>
                  </div>
                </div>

                {/* Play Again Button */}
                <button
                  type="button"
                  onClick={handleResetGame}
                  className="py-1 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9.5px] font-bold border border-slate-200 cursor-pointer active:scale-95 shadow-2xs"
                >
                  Play Again 🔄
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
