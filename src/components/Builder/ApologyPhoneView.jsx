import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  RotateCcw,
  CheckCircle2,
  Award
} from 'lucide-react';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { soundEffects } from '../Templates/common/SoundEffects';

export default function ApologyPhoneView({
  formData = {},
  theme = {},
  triggerConfetti,
  onReset,
  activeTab: controlledTab,
  onTabChange,
  openEnvelope: controlledOpenEnvelope,
}) {
  const [internalTab, setInternalTab] = useState('forgive'); // 'forgive' | 'treaty' | 'promises' | 'letter'
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabSelect = (tabKey) => {
    soundEffects.playPop();
    if (onTabChange) {
      onTabChange(tabKey);
    } else {
      setInternalTab(tabKey);
    }
  };

  const [isForgiven, setIsForgiven] = useState(false);
  const [internalEnvelopeOpen, setInternalEnvelopeOpen] = useState(!!controlledOpenEnvelope);
  const envelopeOpen = internalEnvelopeOpen;
  const setEnvelopeOpen = setInternalEnvelopeOpen;
  const [isOpeningEnvelope, setIsOpeningEnvelope] = useState(false);
  const [isTreatySigned, setIsTreatySigned] = useState(false);

  useEffect(() => {
    if (controlledOpenEnvelope) {
      setInternalEnvelopeOpen(true);
    }
  }, [controlledOpenEnvelope]);

  // Runaway "No" button dodge state & bribery excuses
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  const [excuseIndex, setExcuseIndex] = useState(0);

  const briberyExcuses = [
    "What if I bring donuts? 🍩",
    "Free boba for a month? 🧋",
    "Unlimited back scratches? 💆",
    "Pretty please with sugar? 🥺",
    "I will do all dishes for 2 weeks! 🍽️",
    "Sending infinite warm hugs... please? 🧸",
    "Your favorite takeout tonight on me? 🍕",
    "I promise to always listen first 🤍"
  ];

  const templateId = (formData.templateId || theme.id || '').toLowerCase();
  const isLavender = templateId.includes('sweet') || templateId.includes('forgive');
  const isSunrise = templateId.includes('fresh') || templateId.includes('start');

  const recipientName = (formData.recipientName || '').trim() || (theme.gender === 'girl' ? 'Sarah' : 'Rohan');
  const senderName = (formData.senderName || '').trim() || (theme.gender === 'girl' ? 'Elena' : 'Alex');

  const defaultLetter = isLavender
    ? `Dear ${recipientName},\n\nI am so genuinely sorry for hurting your feelings. Seeing you sad breaks my heart completely.\n\nYou bring so much sweetness, patience, and warmth into my life, and I never want to be the reason your smile fades. I promise to be softer, more thoughtful, and hold you close whenever things get difficult.\n\nI hope you can give me a warm hug and forgive me. 💜🥺`
    : isSunrise
    ? `Dear ${recipientName},\n\nI want to apologize from the bottom of my heart. I made a mistake, and I take full responsibility for it.\n\nOur bond is too meaningful to let misunderstandings build walls between us. Every new morning is a chance to start fresh, communicate better, and treat each other with pure respect.\n\nLet's turn the page together and start afresh with peace and understanding. 🌅🕊️`
    : `Dear ${recipientName},\n\nI want to apologize sincerely from the deepest corner of my heart. 🕊️🌿\n\nSeeing you hurt breaks my spirit. You mean the world to me, and our bond is too precious to ever put at risk. I deeply regret my thoughtlessness and careless words.\n\nI promise to listen more patiently, communicate more gently, and do better. I hope you can find it in your heart to forgive me so we can heal together peacefully. 🤍`;

  const rawLetter = (typeof formData.letter === 'object' && formData.letter !== null && formData.letter.content !== undefined)
    ? formData.letter.content
    : (typeof formData.letter === 'string' ? formData.letter : formData.letterBody);
  const letterBody = rawLetter !== undefined ? rawLetter : defaultLetter;

  const letterTitle = (typeof formData.letter === 'object' ? formData.letter?.title : null) || formData.letterTitle || 'A Sincere Peace Offering 🕊️';

  const rawSignOff = (typeof formData.letter === 'object' && formData.letter !== null && formData.letter.signOff !== undefined)
    ? formData.letter.signOff
    : formData.letterSignOff;
  const letterSignOff = rawSignOff !== undefined ? rawSignOff : `— With all my love and regret, ${senderName} 🕊️`;

  // The 3 Sincere Commitments
  const promisesList = [
    {
      icon: '🕊️',
      title: 'Listening with an Open Heart',
      desc: 'I promise to pause, listen to your feelings without rushing to defend myself, and truly understand your world.'
    },
    {
      icon: '🌿',
      title: 'Gentle & Patient Words',
      desc: 'I promise to communicate with calmness, warmth, and care, never letting momentary stress turn into sharp words.'
    },
    {
      icon: '💚',
      title: 'Protecting Our Precious Bond',
      desc: 'What we share is irreplaceable. I promise to cherish you, make you feel valued every day, and never take your peace for granted.'
    }
  ];

  // Runaway "No" button dodge logic
  const handleNoDodge = () => {
    soundEffects.playPop();
    // Generate playful dodging offset
    const randomX = Math.floor(Math.random() * 90) - 45;
    const randomY = Math.floor(Math.random() * 50) - 25;
    setNoButtonOffset({ x: randomX, y: randomY });
    setExcuseIndex((prev) => (prev + 1) % briberyExcuses.length);
  };

  const handleForgiveYes = () => {
    soundEffects.playCelebration();
    setIsForgiven(true);
    setIsTreatySigned(true);
    if (triggerConfetti) triggerConfetti();
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

  return (
    <div className="flex-1 w-full min-h-0 flex flex-col justify-between overflow-y-auto custom-scrollbar relative z-20 select-none pb-4">
      {/* =================================================================== */}
      {/* 1. SERENE SINCERE PEACE HEADER */}
      {/* =================================================================== */}
      <div className="px-3 pt-1 pb-1.5 shrink-0">
        <div className="w-full bg-gradient-to-b from-emerald-100/90 via-teal-50/90 to-emerald-50/80 rounded-2xl p-2.5 shadow-sm border border-emerald-200/80 text-center">
          {/* Peace Dove Badge */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] font-semibold text-emerald-800 border border-emerald-300/80 shadow-2xs mb-1">
            <AppleEmoji emoji="🕊️" size={12} />
            <span>A Sincere Note For You</span>
            <AppleEmoji emoji="🤍" size={12} />
          </div>

          <h1 className="text-sm font-bold text-emerald-950 font-serif leading-tight">
            Dear {recipientName}
          </h1>

          {(formData.subtitle !== undefined ? formData.subtitle : 'I made a mistake, and your happiness and peace mean everything to me.') ? (
            <p className="text-[10px] text-emerald-800/90 mt-0.5 font-sans leading-snug line-clamp-2">
              {formData.subtitle !== undefined ? formData.subtitle : 'I made a mistake, and your happiness and peace mean everything to me.'}
            </p>
          ) : null}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. DEDICATED PEACE TREATY NAVIGATION TABS (NOT BIRTHDAY DOTS!) */}
      {/* =================================================================== */}
      <div className="px-3 shrink-0">
        <div className="grid grid-cols-4 gap-1 p-1 bg-emerald-900/10 rounded-xl border border-emerald-900/10 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => handleTabSelect('forgive')}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'forgive'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-950/80 hover:bg-emerald-900/10'
            }`}
          >
            <span>🥺</span>
            <span className="text-[9px]">Forgive</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('treaty')}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'treaty'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-950/80 hover:bg-emerald-900/10'
            }`}
          >
            <span>📜</span>
            <span className="text-[9px]">Accord</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('promises')}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'promises'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-950/80 hover:bg-emerald-900/10'
            }`}
          >
            <span>🌿</span>
            <span className="text-[9px]">Promises</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('letter')}
            className={`py-1 rounded-lg transition-all text-center flex flex-col items-center gap-0.5 cursor-pointer ${
              activeTab === 'letter'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-950/80 hover:bg-emerald-900/10'
            }`}
          >
            <span>💌</span>
            <span className="text-[9px]">Letter</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. ACTIVE TAB CONTENT BODY */}
      {/* =================================================================== */}
      <div className="flex-1 min-h-0 w-full px-3 py-2 flex flex-col items-center justify-start overflow-y-auto custom-scrollbar">
        {/* ----------------------------------------------------------------- */}
        {/* TAB 1: INTERACTIVE FORGIVENESS BOX (THE STAR FEATURE!) */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'forgive' && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in-up max-w-[260px]">
            {!isForgiven ? (
              <div className="w-full bg-white/95 rounded-2xl p-3 shadow-lg border border-emerald-200 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-xl mb-1 shadow-2xs">
                  🥺
                </div>

                <h2 className="text-xs sm:text-sm font-bold text-emerald-950 font-serif leading-tight">
                  Can you forgive me?
                </h2>
                <p className="text-[10px] text-emerald-800/80 mt-1 font-sans">
                  Your forgiveness and sweet smile mean the whole world to me 🤍
                </p>

                {/* Forgiveness Buttons */}
                <div className="mt-3 flex flex-col gap-2 w-full">
                  {/* YES Button */}
                  <button
                    type="button"
                    onClick={handleForgiveYes}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-md shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Yes, I forgive you</span>
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-300" />
                  </button>

                  {/* Playfully Runaway Dodging NO Button */}
                  <div className="relative h-9 flex items-center justify-center">
                    <button
                      type="button"
                      onMouseEnter={handleNoDodge}
                      onClick={handleNoDodge}
                      onTouchStart={handleNoDodge}
                      style={{
                        transform: `translate(${noButtonOffset.x}px, ${noButtonOffset.y}px)`,
                        transition: 'transform 0.15s ease-out'
                      }}
                      className="absolute py-1.5 px-3 rounded-xl bg-white border border-rose-200 text-rose-700 text-[11px] font-semibold shadow-xs hover:bg-rose-50 cursor-pointer whitespace-nowrap active:scale-90"
                    >
                      <span>No, I'm still mad 😤</span>
                    </button>
                  </div>

                  {/* Bribery Excuse Banner */}
                  {excuseIndex > 0 && (
                    <div className="text-[9px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg animate-pop-in">
                      {briberyExcuses[excuseIndex]}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* CELEBRATION BOX AFTER FORGIVENESS */
              <div className="w-full bg-gradient-to-b from-white via-emerald-50 to-teal-50 rounded-2xl p-3.5 shadow-xl border-2 border-emerald-300 text-center animate-pop-in">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-emerald-100 text-2xl mb-1.5 shadow-sm">
                  🕊️
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[9px] font-bold mb-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>PEACE FULLY RESTORED</span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-emerald-950 font-serif">
                  Thank you for your warm heart! 🕊️🤍
                </h3>

                <p className="mt-1 text-[10px] text-emerald-900/80 italic font-sans leading-relaxed">
                  "You just made my entire world brighter again. I promise to cherish and protect our peace always."
                </p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('treaty')}
                    className="py-1 px-2.5 rounded-lg bg-emerald-700 text-white text-[10px] font-semibold active:scale-95 cursor-pointer shadow-2xs"
                  >
                    View Peace Accord 📜
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgiven(false);
                      setNoButtonOffset({ x: 0, y: 0 });
                      setExcuseIndex(0);
                    }}
                    className="py-1 px-2 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-[10px] font-semibold active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-2.5 h-2.5 inline mr-0.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 2: THE OFFICIAL PEACE ACCORD */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'treaty' && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in-up max-w-[260px]">
            <div className="w-full bg-[#fafbf8] rounded-2xl p-2.5 shadow-md border border-emerald-200/80 text-left relative overflow-hidden">
              {/* Header */}
              <div className="text-center border-b border-emerald-200 pb-1.5 mb-2">
                <div className="text-[8px] font-mono tracking-widest text-emerald-700 font-bold uppercase">
                  OFFICIAL DIPLOMATIC ACCORD
                </div>
                <h3 className="text-xs font-bold text-emerald-950 font-serif">
                  The Peace & Harmony Treaty 🕊️
                </h3>
              </div>

              {/* Articles */}
              <div className="space-y-1.5 text-[9px] text-emerald-950">
                <div className="bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                  <span className="font-bold font-mono text-emerald-800">ARTICLE I: </span>
                  <span className="font-semibold text-emerald-900">Zero Ego & Listening</span>
                  <p className="text-[8.5px] text-emerald-800/80 mt-0.5">
                    Full attention whenever you speak, ego permanently set aside.
                  </p>
                </div>

                <div className="bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                  <span className="font-bold font-mono text-emerald-800">ARTICLE II: </span>
                  <span className="font-semibold text-emerald-900">Comfort Reparations</span>
                  <p className="text-[8.5px] text-emerald-800/80 mt-0.5">
                    Dinner at your favorite spot + sweet treats, fully on me.
                  </p>
                </div>

                <div className="bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100">
                  <span className="font-bold font-mono text-emerald-800">ARTICLE III: </span>
                  <span className="font-semibold text-emerald-900">Perpetual Truce</span>
                  <p className="text-[8.5px] text-emerald-800/80 mt-0.5">
                    One "You Are 100% Right" pass + unlimited warm bear hugs.
                  </p>
                </div>
              </div>

              {/* Official Stamp & Sign */}
              <div className="mt-2.5 pt-1.5 border-t border-emerald-200 flex items-center justify-between">
                <div className="text-[8px] font-mono text-emerald-800">
                  <div>ACCORD: BILATERAL</div>
                  <div className="font-bold">RATIFIED BY: {senderName}</div>
                </div>

                {isTreatySigned ? (
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-700 bg-emerald-50 flex flex-col items-center justify-center rotate-[-8deg] text-emerald-800 shadow-xs animate-pop-in">
                    <span className="text-[6px] font-black tracking-tighter">RATIFIED</span>
                    <span className="text-[10px]">🕊️</span>
                    <span className="text-[6px] font-mono">PEACE</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playCelebration();
                      setIsTreatySigned(true);
                      if (triggerConfetti) triggerConfetti();
                    }}
                    className="py-1 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[9px] font-bold shadow-xs active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <span>Ratify Accord</span>
                    <span>✍️</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 3: PROMISES FROM MY HEART */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'promises' && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in-up space-y-1.5 max-w-[260px]">
            <div className="mb-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-900 border border-emerald-200">
                <Award className="w-3 h-3 text-emerald-700" />
                <span>Promises From My Heart</span>
              </span>
            </div>

            {promisesList.map((item, idx) => (
              <div
                key={idx}
                className="w-full bg-white/90 p-2 rounded-xl border border-emerald-200/80 shadow-xs flex items-center gap-2 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center shrink-0 text-sm shadow-2xs">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-bold text-emerald-950 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[9px] text-emerald-800/80 leading-snug line-clamp-2 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 4: SINCERE UNFOLDED APOLOGY LETTER */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'letter' && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in-up max-w-[260px]">
            <h2 className="text-xs font-bold text-emerald-950 font-serif mb-1.5">
              {letterTitle}
            </h2>

            {!envelopeOpen ? (
              <div
                onClick={handleOpenEnvelope}
                className={`group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  isOpeningEnvelope ? 'scale-95 brightness-110 shadow-2xl' : ''
                }`}
                title="Tap olive wax seal to read apology letter"
              >
                {/* Serene Olive Kraft Envelope */}
                <div className="relative w-[230px] h-[145px] rounded-2xl overflow-hidden shadow-xl p-1 bg-gradient-to-br from-[#2e5a44] via-[#244b37] to-[#1c3d2c] border border-[#173224]">
                  {/* Peeking Letter Card Inside */}
                  <div className="absolute top-2 left-4 right-4 h-[70px] bg-[#f8faf8] rounded-t-xl shadow-md border-t-2 border-emerald-300 p-2 transform transition-transform duration-300 group-hover:-translate-y-2">
                    <div className="flex items-center justify-center gap-1 font-bold text-xs text-emerald-950 font-serif">
                      <span>A Message of Peace</span>
                      <AppleEmoji emoji="🕊️" size={12} />
                      <AppleEmoji emoji="🤍" size={12} />
                    </div>
                    <div className="mt-1 text-[9px] text-emerald-800/80 italic font-sans">
                      From my heart to yours...
                    </div>
                  </div>

                  {/* SVG Envelope Flaps */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 230 145" className="w-full h-full" preserveAspectRatio="none">
                      <polygon points="0,0 0,145 115,80" fill="#244b37" opacity="0.95" />
                      <polygon points="230,0 230,145 115,80" fill="#1c3d2c" opacity="0.95" />
                      <polygon points="0,145 230,145 115,72" fill="#173224" />
                    </svg>
                  </div>

                  {/* Olive Wax Seal with Crack Effect */}
                  <div className={`absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border-2 border-emerald-200 shadow-lg bg-[#15803d] flex items-center justify-center transition-all duration-300 group-hover:scale-110 active:scale-90 ${
                    isOpeningEnvelope ? 'scale-125 rotate-12 ring-2 ring-emerald-300 animate-pulse' : ''
                  }`}>
                    <AppleEmoji emoji="🕊️" size={18} />
                    {isOpeningEnvelope && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-0.5 bg-white/90 rotate-45 animate-ping" />
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-[10px] font-bold text-emerald-900 animate-bounce flex items-center justify-center gap-1">
                  <span>{isOpeningEnvelope ? 'Breaking wax seal... ✨' : 'Tap olive wax seal to read letter'}</span>
                  <span>🕊️</span>
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center animate-fade-in-up">
                {/* Unfolded Letter Card */}
                <div className="relative w-full bg-[#fbfdfb] rounded-2xl p-3 shadow-xl border border-emerald-200 text-left">
                  <div className="border-b border-emerald-200 pb-1 mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-950 font-serif">
                      {letterTitle}
                    </span>
                    <AppleEmoji emoji="🕊️" size={13} />
                  </div>

                  {letterBody ? (
                    <div className="text-[10px] text-emerald-950 leading-relaxed max-h-36 overflow-y-auto custom-scrollbar pr-1 whitespace-pre-line font-sans">
                      {renderAppleText(letterBody, 10)}
                    </div>
                  ) : null}

                  {letterSignOff ? (
                    <div className="pt-1.5 mt-1.5 border-t border-emerald-200 text-right">
                      <span className="text-xs font-bold text-emerald-900 font-serif italic">
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
                    className="py-1 px-3 rounded-lg bg-emerald-800 text-white text-[10px] font-semibold active:scale-95 cursor-pointer shadow-2xs"
                  >
                    Fold Letter 💌
                  </button>
                  {onReset && (
                    <button
                      type="button"
                      onClick={onReset}
                      className="py-1 px-2.5 rounded-lg bg-white/90 border border-emerald-200 text-emerald-900 text-[10px] font-semibold active:scale-95 cursor-pointer shadow-2xs flex items-center gap-0.5"
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
