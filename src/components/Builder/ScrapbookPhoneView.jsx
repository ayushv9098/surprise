import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Check, 
  RotateCcw,
  Camera,
  Flame,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { soundEffects } from '../Templates/common/SoundEffects';

export default function ScrapbookPhoneView({
  formData = {},
  theme = {},
  triggerConfetti,
  onReset,
  activeTab: controlledTab,
  onTabChange,
  openEnvelope: controlledOpenEnvelope,
}) {
  const [internalTab, setInternalTab] = useState('timeline'); // 'timeline' | 'jokes' | 'scratch' | 'letter'
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabSelect = (tabKey) => {
    soundEffects.playPop();
    if (onTabChange) {
      onTabChange(tabKey);
    } else {
      setInternalTab(tabKey);
    }
  };

  const [activeChapter, setActiveChapter] = useState(0); // 0, 1, 2
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [internalEnvelopeOpen, setInternalEnvelopeOpen] = useState(false);
  const envelopeOpen = controlledOpenEnvelope !== undefined ? controlledOpenEnvelope : internalEnvelopeOpen;
  const setEnvelopeOpen = setInternalEnvelopeOpen;
  const [isOpeningEnvelope, setIsOpeningEnvelope] = useState(false);
  const [revealedJokes, setRevealedJokes] = useState({});

  const templateId = (formData.templateId || theme.id || '').toLowerCase();
  const isNeon = templateId.includes('neon') || templateId.includes('nostalgia');
  const isCozy = templateId.includes('cozy') || templateId.includes('memories');

  const recipientName = (formData.recipientName || '').trim() || (theme.gender === 'girl' ? 'Sarah' : 'Rohan');
  const senderName = (formData.senderName || '').trim() || (theme.gender === 'girl' ? 'Elena' : 'Alex');

  const heroPhotoUrl = formData.heroPhoto || formData.photos?.[0]?.url || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80';
  const photo2Url = formData.photos?.[1]?.url || 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80';
  const photo3Url = formData.photos?.[2]?.url || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80';

  const defaultLetter = isNeon
    ? `Life with you is pure electric energy! From spontaneous adventures to late-night laughs, every moment is packed with high voltage hype and good vibes.\n\nThank you for always having my back, keeping things 100% real, and hyping me up when I needed it most. No matter where we go, this squad is locked in forever.\n\nStay electric and let's keep making memories worth talking about for the rest of our lives! 🔥⚡`
    : isCozy
    ? `Thank you for the warm comfort, peaceful talks, and sweet memories we've shared. Sitting together with good coffee and honest conversations is one of life's greatest treasures.\n\nIn a busy and loud world, our time together is always my favorite pause button. You bring so much gentle calm and sweet sunshine to my everyday life.\n\nHere's to many more peaceful, golden afternoons and cherished memories together! 🌻☕`
    : `Looking through all our old photos, I can't help but smile at how much we've lived through together.\n\nFrom our very first awkward conversation to the countless late nights where we talked about everything and nothing. You've made my world softer, warmer, and so much more adventurous.\n\nHere's to all the memories we've pasted into this scrapbook, and to the blank pages waiting for us tomorrow! 📸✨`;

  const rawLetterBody = typeof formData.letter === 'object' && formData.letter !== null && formData.letter.content !== undefined
    ? formData.letter.content
    : (typeof formData.letter === 'string' ? formData.letter : formData.letterBody);
  const letterBody = rawLetterBody !== undefined ? rawLetterBody : defaultLetter;

  const letterTitle = (typeof formData.letter === 'object' ? formData.letter?.title : null) || formData.letterTitle || 'A Page From Our Scrapbook 📜';

  const rawLetterSignOff = typeof formData.letter === 'object' && formData.letter !== null && formData.letter.signOff !== undefined
    ? formData.letter.signOff
    : formData.letterSignOff;
  const letterSignOff = rawLetterSignOff !== undefined ? rawLetterSignOff : `— Always your partner in adventure, ${senderName} 📸`;

  // Memory Chapters
  const chapters = [
    {
      badge: 'CHAPTER 1 • THE BEGINNING',
      title: 'The Very Beginning',
      dateTag: 'FIRST FRAME',
      photo: heroPhotoUrl,
      tapeColor: 'bg-amber-200/90 border-amber-300/80',
      rotation: '-2deg',
      note: formData.photoCaption || (isNeon ? 'The day the dynamic duo officially unlocked ⚡' : isCozy ? 'A quiet hello that turned into my comfort place ☕' : 'I had no idea a simple hello would turn into my favorite adventure 📸')
    },
    {
      badge: 'CHAPTER 2 • ROADTRIPS',
      title: 'Unplanned Roadtrips & Late Talks',
      dateTag: 'MIDNIGHT RUN',
      photo: photo2Url,
      tapeColor: 'bg-rose-200/90 border-rose-300/80',
      rotation: '2deg',
      note: 'Windows rolled all the way down, singing terribly at 1:00 AM, and getting lost just to find the tiny diner with the best milkshakes.'
    },
    {
      badge: 'CHAPTER 3 • ORDINARY MAGIC',
      title: 'Ordinary Magic & Coffee Runs',
      dateTag: 'GOLDEN MEMORIES',
      photo: photo3Url,
      tapeColor: 'bg-sky-200/90 border-sky-300/80',
      rotation: '-1.5deg',
      note: 'It is the small, quiet in-between moments that I treasure most. Rainy afternoons, warm brews, and laughing until our stomachs hurt.'
    }
  ];

  // Inside Jokes List
  const insideJokes = [
    {
      id: 1,
      badge: '🔥 100% SQUAD',
      color: 'bg-[#fff9db] border-amber-300 text-amber-950',
      tape: 'bg-amber-400/80',
      rotation: '-2deg',
      hook: 'The 3:00 AM diner incident we swore never to speak of again 😂',
      secret: 'CLASSIFIED SQUAD INTEL 🤫 (Still laughing every time I think of it!)'
    },
    {
      id: 2,
      badge: '⚡ UNSTOPPABLE',
      color: 'bg-[#e7f5ff] border-blue-300 text-blue-950',
      tape: 'bg-blue-400/80',
      rotation: '2.5deg',
      hook: 'Our telepathic eye contact across a crowded room 👀',
      secret: 'TELEPATHY CONFIRMED 📡 (We knew what each other meant immediately)'
    },
    {
      id: 3,
      badge: '🛹 NO REGRETS',
      color: 'bg-[#f8f0fc] border-purple-300 text-purple-950',
      tape: 'bg-purple-400/80',
      rotation: '-1.5deg',
      hook: 'Permanent passenger princess & certified aux cord master 🎶',
      secret: 'AUX PRIVILEGES FOR LIFE 🚗 (Zero skipped tracks guaranteed)'
    }
  ];

  const handleToggleAudio = () => {
    soundEffects.playPop();
    setIsPlayingAudio(prev => !prev);
  };

  const handleScratch = () => {
    if (!isScratched) {
      soundEffects.playScratch();
      soundEffects.playCelebration();
      setIsScratched(true);
      if (triggerConfetti) triggerConfetti();
    }
  };

  const handleOpenEnvelope = () => {
    if (envelopeOpen || isOpeningEnvelope) return;
    setIsOpeningEnvelope(true);
    soundEffects.playSealBreak();
    if (triggerConfetti) triggerConfetti();
    setTimeout(() => {
      setEnvelopeOpen(true);
      setIsOpeningEnvelope(false);
    }, 420);
  };

  const toggleJoke = (id) => {
    soundEffects.playPop();
    setRevealedJokes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 w-full min-h-0 flex flex-col justify-between overflow-y-auto custom-scrollbar relative z-20 select-none pb-1">
      {/* =================================================================== */}
      {/* 1. RETRO 35MM FILM HEADER & WASHI TAPE */}
      {/* =================================================================== */}
      <div className="px-3 pt-1 pb-2 shrink-0">
        {/* Film Strip Border with Perforations */}
        <div className="w-full bg-[#1c1917] rounded-xl p-1.5 shadow-md border border-[#302c28] text-white">
          <div className="flex justify-between items-center px-1 text-[8px] text-amber-400/80 font-mono tracking-widest pb-1 border-b border-white/10">
            <span>▪ KODAK 400</span>
            <span>ISO 35MM</span>
            <span>EXP 24 ▪</span>
          </div>

          {/* Washi-Tape Header Area */}
          <div className="relative pt-2 pb-1.5 px-2 text-center bg-[#292524] rounded-lg mt-1">
            {/* Washi Tape Strip */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-amber-200/90 border border-amber-300/80 shadow-xs rotate-[-1.5deg] rounded-xs flex items-center justify-center pointer-events-none z-10">
              <div className="w-20 border-t border-dashed border-amber-600/40" />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-semibold mt-0.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>The Scrapbook of Us 📸</span>
            </div>
            <h1 className="text-sm font-bold text-white tracking-tight mt-0.5 font-serif">
              <span>{recipientName}</span>
              <span className="text-amber-400"> & </span>
              <span>{senderName}</span>
            </h1>
            {(formData.subtitle !== undefined ? formData.subtitle : 'Taped forever into the scrapbook of our greatest adventures.') ? (
              <p className="text-[10px] text-slate-300 italic mt-0.5 line-clamp-1 font-sans">
                {formData.subtitle !== undefined ? formData.subtitle : 'Taped forever into the scrapbook of our greatest adventures.'}
              </p>
            ) : null}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. AUDIO PILL: RETRO CASSETTE / VINYL LO-FI PLAYER */}
        {/* ================================================================= */}
        <div className="mt-2 flex items-center justify-between px-2.5 py-1.5 bg-[#fefae0]/90 border border-amber-300/80 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            {/* Cassette Graphic with Dual Rotating Spools */}
            <div className="relative w-7 h-5 bg-[#3e2723] rounded-[3px] border border-[#2d1b17] flex items-center justify-between px-1 shadow-inner">
              <div className={`w-2.5 h-2.5 rounded-full border border-amber-300/70 bg-[#2d1b17] flex items-center justify-center ${isPlayingAudio ? 'animate-spin' : ''}`}>
                <div className="w-1 h-1 rounded-full bg-amber-400" />
              </div>
              <div className="w-1.5 h-1 bg-amber-900/60 rounded-xs" />
              <div className={`w-2.5 h-2.5 rounded-full border border-amber-300/70 bg-[#2d1b17] flex items-center justify-center ${isPlayingAudio ? 'animate-spin' : ''}`}>
                <div className="w-1 h-1 rounded-full bg-amber-400" />
              </div>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-amber-950 font-mono">LO-FI TAPE // SIDE A</span>
                {isPlayingAudio && (
                  <span className="flex gap-0.5 items-end h-2.5">
                    <span className="w-0.5 h-2 bg-amber-600 animate-pulse" />
                    <span className="w-0.5 h-3 bg-amber-500 animate-pulse delay-75" />
                    <span className="w-0.5 h-1.5 bg-amber-600 animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <p className="text-[9px] text-amber-800/80 truncate max-w-[130px]">
                Nostalgic Acoustic Lo-Fi ♫
              </p>
            </div>
          </div>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-xs ${
              isPlayingAudio ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-900 hover:bg-amber-300'
            }`}
            title={isPlayingAudio ? 'Pause Tape' : 'Play Nostalgic Lo-Fi'}
          >
            {isPlayingAudio ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. DEDICATED SCRAPBOOK JOURNAL TABS (NOT BIRTHDAY DOTS!) */}
      {/* =================================================================== */}
      <div className="px-3 shrink-0">
        <div className="grid grid-cols-4 gap-1 p-1 bg-amber-900/10 rounded-xl border border-amber-900/10 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => handleTabSelect('timeline')}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-950/80 hover:bg-amber-900/10'
            }`}
          >
            <span>📖</span>
            <span className="text-[9px]">Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('jokes')}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'jokes'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-950/80 hover:bg-amber-900/10'
            }`}
          >
            <span>⚡</span>
            <span className="text-[9px]">Squad</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('scratch')}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'scratch'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-950/80 hover:bg-amber-900/10'
            }`}
          >
            <span>🎫</span>
            <span className="text-[9px]">Voucher</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('letter')}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'letter'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-950/80 hover:bg-amber-900/10'
            }`}
          >
            <span>💌</span>
            <span className="text-[9px]">Letter</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. ACTIVE TAB CONTENT BODY */}
      {/* =================================================================== */}
      <div className="flex-1 min-h-0 w-full px-3 py-2 flex flex-col items-center justify-start overflow-y-auto custom-scrollbar">
        {/* ----------------------------------------------------------------- */}
        {/* TAB 1: CHAPTER-BY-CHAPTER MEMORY TIMELINE */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'timeline' && (
          <div className="w-full flex flex-col items-center animate-fade-in-up">
            {/* Chapter Step Indicators */}
            <div className="flex items-center gap-1.5 mb-2">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setActiveChapter(idx);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all cursor-pointer ${
                    activeChapter === idx
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'bg-amber-100/90 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  Ch. {idx + 1}
                </button>
              ))}
            </div>

            {/* Current Chapter Polaroid Frame */}
            {(() => {
              const ch = chapters[activeChapter];
              return (
                <div className="relative flex flex-col items-center w-full max-w-[240px]">
                  {/* Washi tape pinning */}
                  <div className={`absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-16 h-4.5 ${ch.tapeColor} shadow-xs rotate-[-2deg] rounded-xs flex items-center justify-center pointer-events-none`}>
                    <div className="w-12 border-t border-dashed border-amber-600/30" />
                  </div>

                  <div className="w-full bg-[#fdfbf7] p-2.5 pb-3 rounded-xl border border-amber-200 shadow-lg flex flex-col items-center text-center">
                    <div className="w-full h-[155px] overflow-hidden rounded-lg bg-amber-50 shadow-inner relative">
                      <img
                        src={ch.photo}
                        alt={ch.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-sm bg-black/60 text-[8px] font-mono text-amber-300">
                        {ch.dateTag}
                      </div>
                    </div>

                    <div className="mt-2 text-left w-full px-0.5">
                      <div className="text-[9px] font-mono text-amber-800 font-bold uppercase tracking-wider">
                        {ch.badge}
                      </div>
                      <h3 className="text-xs font-bold text-amber-950 font-serif leading-tight">
                        {ch.title}
                      </h3>
                      <p className="mt-1 text-[10px] text-amber-900/80 leading-relaxed font-sans italic line-clamp-3">
                        "{ch.note}"
                      </p>
                    </div>
                  </div>

                  {/* Chapter Navigation Buttons */}
                  <div className="flex items-center justify-between w-full mt-2 text-[10px]">
                    <button
                      type="button"
                      disabled={activeChapter === 0}
                      onClick={() => {
                        soundEffects.playPop();
                        setActiveChapter(prev => prev - 1);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/90 border border-amber-200 text-amber-900 disabled:opacity-40 font-semibold cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span>Prev</span>
                    </button>

                    <span className="text-[10px] font-mono text-amber-900/70 font-semibold">
                      {activeChapter + 1} / {chapters.length}
                    </span>

                    <button
                      type="button"
                      disabled={activeChapter === chapters.length - 1}
                      onClick={() => {
                        soundEffects.playPop();
                        setActiveChapter(prev => prev + 1);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-800 text-white disabled:opacity-40 font-semibold cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 2: SQUAD INSIDE JOKES & HIGHLIGHTS */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'jokes' && (
          <div className="w-full flex flex-col items-center animate-fade-in-up space-y-2 max-w-[250px]">
            <div className="text-center mb-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-[10px] font-bold text-amber-900 border border-amber-200">
                <Flame className="w-3 h-3 text-orange-500 fill-current" />
                <span>Squad Intel & Highlights</span>
              </span>
              <p className="text-[9px] text-amber-800/80 mt-0.5">
                Tap each sticky note to reveal the secret punchline!
              </p>
            </div>

            {insideJokes.map((joke) => (
              <div
                key={joke.id}
                onClick={() => toggleJoke(joke.id)}
                className={`relative w-full p-2.5 rounded-xl border shadow-sm cursor-pointer transition-all active:scale-95 ${joke.color}`}
                style={{ transform: `rotate(${joke.rotation})` }}
              >
                {/* Simulated Washi Tape on Sticky Note */}
                <div className={`absolute -top-1.5 left-6 w-10 h-3 ${joke.tape} rounded-xs opacity-85 shadow-2xs`} />

                <div className="flex items-center justify-between text-[9px] font-bold mb-1">
                  <span className="font-mono">{joke.badge}</span>
                  <span className="text-[8px] opacity-60">TAP NOTE</span>
                </div>

                <p className="text-[11px] font-medium leading-snug font-sans">
                  {joke.hook}
                </p>

                {revealedJokes[joke.id] && (
                  <div className="mt-1.5 pt-1.5 border-t border-black/10 text-[10px] font-bold text-rose-700 animate-pop-in">
                    {joke.secret}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 3: RETRO GOLD/NEON FOIL SCRATCH CARD */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'scratch' && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in-up max-w-[250px]">
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-[10px] font-bold text-amber-900 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Secret Adventure Voucher</span>
              </span>
              <h2 className="text-xs font-bold text-amber-950 font-serif mt-0.5">
                Kodak Memory Pass
              </h2>
            </div>

            {/* The Scratch Card Shell */}
            <div className="w-full p-1 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-200 to-amber-500 shadow-xl border border-amber-300">
              <div className="bg-[#261f19] p-3 rounded-xl border border-amber-500/40 text-amber-100 flex flex-col items-center">
                <div className="text-[9px] font-mono tracking-widest text-amber-400 uppercase">
                  ★ SPECIAL SQUAD VOUCHER ★
                </div>

                {!isScratched ? (
                  <div
                    onClick={handleScratch}
                    className="mt-2.5 w-full py-6 px-3 rounded-xl bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200 border-2 border-dashed border-amber-500 shadow-inner flex flex-col items-center justify-center cursor-pointer group active:scale-95 transition-all"
                  >
                    <Sparkles className="w-6 h-6 text-amber-700 animate-bounce mb-1" />
                    <span className="text-xs font-bold text-amber-950 tracking-wider">
                      TAP TO SCRATCH FOIL
                    </span>
                    <span className="text-[9px] text-amber-800 font-sans mt-0.5">
                      Uncover your secret roadtrip pass ✨
                    </span>
                  </div>
                ) : (
                  <div className="mt-2.5 w-full py-4 px-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col items-center animate-pop-in">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold mb-1">
                      <Check className="w-3 h-3" />
                      <span>OFFICIALLY UNLOCKED</span>
                    </div>
                    <div className="font-mono font-black text-sm text-amber-900 tracking-wider bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-400">
                      KODAK-ADVENTURE-35MM
                    </div>
                    <p className="mt-1.5 text-[10px] font-semibold text-amber-950 leading-tight">
                      Valid for: 1x Spontaneous Roadtrip + Coffee on Me! ☕🚗
                    </p>
                  </div>
                )}

                <div className="mt-2 text-[8px] font-mono text-amber-400/80">
                  SERIAL #35MM-KODAK-US-2026
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 4: SEALED KRAFT ENVELOPE & RETRO LETTER */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'letter' && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in-up max-w-[255px]">
            <h2 className="text-xs font-bold text-amber-950 font-serif mb-1.5">
              {letterTitle}
            </h2>

            {!envelopeOpen ? (
              <div
                onClick={handleOpenEnvelope}
                className={`group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  isOpeningEnvelope ? 'scale-95 brightness-110 shadow-2xl' : ''
                }`}
                title="Tap wax seal to open letter"
              >
                {/* Realistic Kraft Envelope Container */}
                <div className="relative w-[230px] h-[145px] rounded-2xl overflow-hidden shadow-2xl p-1 bg-gradient-to-br from-[#c89666] via-[#b37d4f] to-[#915e34] border border-[#7a4e28]">
                  {/* Peeking Letter Card */}
                  <div className="absolute top-2 left-4 right-4 h-[70px] bg-[#fffbf2] rounded-t-xl shadow-md border-t-2 border-amber-300 p-2 transform transition-transform duration-300 group-hover:-translate-y-2">
                    <div className="flex items-center justify-center gap-1 font-bold text-xs text-amber-950 font-serif">
                      <span>Memories Taped Forever</span>
                      <AppleEmoji emoji="📸" size={12} />
                      <AppleEmoji emoji="⚡" size={12} />
                    </div>
                    <div className="mt-1 text-[9px] text-amber-800/80 italic font-sans">
                      A timeless chapter for you...
                    </div>
                  </div>

                  {/* SVG Envelope Flaps */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 230 145" className="w-full h-full" preserveAspectRatio="none">
                      <polygon points="0,0 0,145 115,80" fill="#a06e40" opacity="0.95" />
                      <polygon points="230,0 230,145 115,80" fill="#8f6036" opacity="0.95" />
                      <polygon points="0,145 230,145 115,72" fill="#7a4e28" />
                    </svg>
                  </div>

                  {/* Wax Seal Center with Crack Effect */}
                  <div className={`absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border-2 border-amber-200 shadow-lg bg-[#b91c1c] flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-90 ${
                    isOpeningEnvelope ? 'scale-125 rotate-12 ring-2 ring-amber-300 animate-pulse' : ''
                  }`}>
                    <AppleEmoji emoji={isNeon ? '⚡' : isCozy ? '🌻' : '📸'} size={18} />
                    {isOpeningEnvelope && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-0.5 bg-white/90 rotate-45 animate-ping" />
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-[10px] font-bold text-amber-900 animate-bounce flex items-center justify-center gap-1">
                  <span>{isOpeningEnvelope ? 'Breaking wax seal... ✨' : 'Tap wax seal to unfold letter'}</span>
                  <span>💌</span>
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center animate-fade-in-up">
                {/* Unfolded Aged Parchment Letter */}
                <div className="relative w-full bg-[#fffcf5] rounded-2xl p-3 shadow-xl border border-amber-200 text-left">
                  {/* Decorative Washi Tape at Header */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-amber-300/80 rounded-xs shadow-2xs pointer-events-none" />

                  <div className="border-b border-amber-200 pb-1 mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-950 font-serif">
                      {letterTitle}
                    </span>
                    <AppleEmoji emoji="📸" size={13} />
                  </div>

                  {letterBody ? (
                    <div className="text-[10px] text-amber-950 leading-relaxed max-h-36 overflow-y-auto custom-scrollbar pr-1 whitespace-pre-line font-sans">
                      {renderAppleText(letterBody, 10)}
                    </div>
                  ) : null}

                  {letterSignOff ? (
                    <div className="pt-1.5 mt-1.5 border-t border-amber-200 text-right">
                      <span className="text-xs font-bold text-amber-900 font-serif italic">
                        {letterSignOff}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      setEnvelopeOpen(false);
                    }}
                    className="py-1 px-3 rounded-lg bg-amber-900 text-white text-[10px] font-semibold active:scale-95 cursor-pointer shadow-2xs"
                  >
                    Reseal Letter 💌
                  </button>
                  {onReset && (
                    <button
                      type="button"
                      onClick={onReset}
                      className="py-1 px-2.5 rounded-lg bg-white/90 border border-amber-200 text-amber-900 text-[10px] font-semibold active:scale-95 cursor-pointer shadow-2xs flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Replay</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
