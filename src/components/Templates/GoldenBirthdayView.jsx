import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Cake, Gift, PartyPopper, Flame, CheckCircle2, RotateCcw } from 'lucide-react';
import AmbientParticles from './common/AmbientParticles';
import AudioPlayer from './common/AudioPlayer';
import EnvelopeLetter from './common/EnvelopeLetter';
import PolaroidGallery from './common/PolaroidGallery';
import CuteQuiz from './common/CuteQuiz';
import ScratchCard from './common/ScratchCard';
import TemplateFooter from './common/TemplateFooter';
import { soundEffects } from './common/SoundEffects';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';

export default function GoldenBirthdayView({ siteData = {}, onNavigateCreate }) {
  const recipientName = siteData.recipientName || 'Birthday Star';
  const senderName = siteData.senderName || 'Your Biggest Fan';
  const title = siteData.title || siteData.occasion || `Happy Birthday, ${recipientName}! 🎉`;
  const subtitle = siteData.subtitle || "May this new chapter sparkle with boundless joy, unforgettable adventures, and every dream you've wished for.";
  const letterBody = (typeof siteData.letter === 'object' ? siteData.letter?.content : siteData.letter) || siteData.letterBody || `Another year older, wiser, and even more wonderful!\n\nI want to remind you just how special your presence is in this world. Your laughter lights up every room, your kindness touches everyone you meet, and you bring so much warmth to the lives around you.\n\nToday is entirely about celebrating YOU. May your year ahead be showered with blessings, sweet laughter, good health, and magic in every single step!`;

  // Birthday Cake State
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  // Gift Box Unboxing State
  const [isGiftOpened, setIsGiftOpened] = useState(false);

  // Confetti cannon trigger
  const fireConfettiCannon = () => {
    soundEffects.playCelebration();
    try {
      // Left cannon
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#F59E0B', '#FBBF24', '#F43F5E', '#EC4899', '#38BDF8']
      });
      // Right cannon
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#F59E0B', '#FBBF24', '#F43F5E', '#EC4899', '#38BDF8']
      });
    } catch {}
  };

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    soundEffects.playBlowCandle();
    setCandlesBlown(true);

    setTimeout(() => {
      setWishMade(true);
      fireConfettiCannon();
    }, 400);
  };

  const handleRelightCandles = () => {
    soundEffects.playPop();
    setCandlesBlown(false);
    setWishMade(false);
  };

  const handleOpenGift = () => {
    if (isGiftOpened) return;
    soundEffects.playUnbox();
    setIsGiftOpened(true);
    fireConfettiCannon();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF9EE] to-[#FEF5E7] text-slate-800 overflow-hidden font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Ambient Floating Confetti, Balloons & Sparkles */}
      <AmbientParticles type="confetti" count={28} />

      {/* Warm Golden Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-orange-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -left-20 w-80 h-80 bg-yellow-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Audio Player */}
      <AudioPlayer
        audioUrl={siteData.music?.audioUrl || siteData.audioUrl}
        title={siteData.music?.title || "Golden Birthday Celebration"}
        theme="birthday"
        accentColor="from-amber-500 to-yellow-500"
      />

      {/* Hero Section */}
      <section className="relative z-20 pt-16 sm:pt-24 pb-10 px-4 text-center max-w-3xl mx-auto">
        <div className="text-xs font-medium text-amber-600 mb-3 tracking-wide flex items-center justify-center gap-1.5">
          <span>A Golden Birthday Celebration</span>
          <AppleEmoji emoji="🎂" size={14} />
        </div>

        {/* Big Celebratory Headline */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          {renderAppleText(title)}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          {renderAppleText(subtitle)}
        </p>

        {/* Confetti Cannon Button */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <button
            onClick={fireConfettiCannon}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <PartyPopper className="w-4 h-4" />
            <span className="flex items-center gap-1.5">
              <span>Pop Confetti!</span>
              <AppleEmoji emoji="🎊" size={16} />
            </span>
          </button>
        </div>
      </section>

      {/* Interactive Birthday Cake with Blow Candles Feature */}
      <section className="relative z-20 max-w-xl mx-auto my-10 px-4">
        <div className="glass-card-warm rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-200/70 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 text-xs font-semibold mb-4">
            <Cake className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Cake Ritual</span>
          </div>

          <h3 className="font-semibold text-xl sm:text-2xl font-bold text-slate-800">
            Make a Wish & Blow Out the Candles
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Close your eyes, make your deepest wish, and blow!
          </p>

          {/* Birthday Cake Illustration with Animated Candle Flames */}
          <div className="relative my-8 flex flex-col items-center justify-center">
            
            {/* Candles Row */}
            <div className="flex items-end justify-center gap-5 sm:gap-7 mb-1 z-10">
              {[0, 1, 2, 3].map((candle) => (
                <div key={candle} className="flex flex-col items-center">
                  {/* Candle Flame */}
                  {!candlesBlown ? (
                    <div className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full animate-flame shadow-md shadow-amber-400" />
                  ) : (
                    <span className="text-xs text-slate-400 animate-in fade-in duration-300 flex items-center justify-center">
                      <AppleEmoji emoji="💨" size={16} />
                    </span>
                  )}
                  {/* Candle Stick */}
                  <div className="w-2.5 h-8 bg-gradient-to-b from-amber-200 via-pink-200 to-amber-300 rounded-t-xs shadow-inner" />
                </div>
              ))}
            </div>

            {/* Cake Tiers */}
            <div className="relative flex flex-col items-center">
              {/* Top Layer */}
              <div className="w-48 sm:w-56 h-12 rounded-t-2xl bg-gradient-to-b from-amber-100 to-amber-200 border-t-4 border-amber-300/80 shadow-md flex items-center justify-center">
                <span className="text-xs font-bold text-amber-800 tracking-wider">
                  ⭐ HAPPY BIRTHDAY ⭐
                </span>
              </div>
              {/* Bottom Layer */}
              <div className="w-60 sm:w-72 h-14 rounded-b-2xl bg-gradient-to-b from-[#FFF2D6] to-[#FCE6BD] border-t-2 border-amber-300/50 shadow-lg flex items-center justify-around px-4">
                <span className="text-lg inline-flex items-center"><AppleEmoji emoji="🍓" size={20} /></span>
                <span className="text-lg inline-flex items-center"><AppleEmoji emoji="✨" size={20} /></span>
                <span className="text-lg inline-flex items-center"><AppleEmoji emoji="🎂" size={20} /></span>
                <span className="text-lg inline-flex items-center"><AppleEmoji emoji="✨" size={20} /></span>
                <span className="text-lg inline-flex items-center"><AppleEmoji emoji="🍓" size={20} /></span>
              </div>
              {/* Cake Stand Plate */}
              <div className="w-72 sm:w-84 h-3 bg-gradient-to-r from-amber-200 via-white to-amber-200 rounded-full shadow-md mt-1" />
            </div>
          </div>

          {/* Wish Feedback / Action Button */}
          {!wishMade ? (
            <button
              onClick={handleBlowCandles}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-yellow-200 animate-pulse" />
              <span className="flex items-center gap-1.5">
                <span>Blow Out Candles!</span>
                <AppleEmoji emoji="🎂" size={16} />
              </span>
            </button>
          ) : (
            <div className="animate-in zoom-in-95 duration-400 flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="flex items-center gap-1">
                  <span>Wish Released Into The Universe!</span>
                  <AppleEmoji emoji="🌟" size={14} />
                </span>
              </div>
              <p className="font-handwriting text-2xl text-amber-800 mt-1">
                "May every single candle carry your happiest dreams into reality!"
              </p>
              <button
                onClick={handleRelightCandles}
                className="mt-4 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Relight candles & blow again</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Gift Box Unboxing */}
      <section className="relative z-20 max-w-xl mx-auto my-12 px-4">
        <div className="glass-card-warm rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-200/80 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold mb-3">
            <Gift className="w-3.5 h-3.5 text-orange-600" />
            <span>Surprise Package</span>
          </div>

          <h3 className="font-semibold text-xl sm:text-2xl font-bold text-slate-800">
            Open Your Birthday Gift Box
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tap the gift box below to unwrap your special birthday treats
          </p>

          {!isGiftOpened ? (
            <div 
              onClick={handleOpenGift}
              className="group my-8 cursor-pointer select-none flex flex-col items-center"
            >
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 active:scale-95">
                {/* Glow ring */}
                <span className="absolute -inset-2 rounded-3xl bg-amber-300/40 blur-xl animate-pulse-glow" />
                
                {/* 3D Gift Box visual */}
                <div className="relative w-full h-full rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-300 p-1 shadow-2xl border-2 border-white/60 flex flex-col items-center justify-center">
                  {/* Ribbon horizontal & vertical */}
                  <div className="absolute inset-y-0 w-8 bg-rose-500/90 shadow-sm" />
                  <div className="absolute inset-x-0 h-8 bg-rose-500/90 shadow-sm" />
                  
                  {/* Golden Ribbon Bow */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-rose-300">
                    <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                </div>
              </div>

              <span className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-md group-hover:bg-amber-600 transition-colors">
                <Gift className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1.5">
                  <span>Tap Box to Unwrap!</span>
                  <AppleEmoji emoji="🎁" size={14} />
                </span>
              </span>
            </div>
          ) : (
            /* Opened Gift items */
            <div className="my-8 animate-in zoom-in-95 duration-500 space-y-3 text-left">
              <div className="p-4 rounded-2xl bg-white/90 border border-amber-200/80 shadow-sm flex items-center gap-3">
                <span className="text-3xl shrink-0 inline-flex items-center"><AppleEmoji emoji="🎫" size={32} /></span>
                <div>
                  <h4 className="font-semibold font-bold text-slate-800 text-sm sm:text-base">VIP Birthday Pass</h4>
                  <p className="text-xs text-slate-500">Zero rules, zero chores, you call all the shots today!</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-amber-200/80 shadow-sm flex items-center gap-3">
                <span className="text-3xl shrink-0 inline-flex items-center"><AppleEmoji emoji="🥂" size={32} /></span>
                <div>
                  <h4 className="font-semibold font-bold text-slate-800 text-sm sm:text-base">Celebration Dinner on Me</h4>
                  <p className="text-xs text-slate-500">Pick any restaurant or treat and consider it booked!</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-amber-200/80 shadow-sm flex items-center gap-3">
                <span className="text-3xl shrink-0 inline-flex items-center"><AppleEmoji emoji="✨" size={32} /></span>
                <div>
                  <h4 className="font-semibold font-bold text-slate-800 text-sm sm:text-base">Year-Long Wish Guarantee</h4>
                  <p className="text-xs text-slate-500">Whenever you need cheering up, I'm just one call away.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Birthday Letter in Sealed Gold Envelope */}
      <section className="relative z-20">
        <EnvelopeLetter
          to={recipientName}
          from={senderName}
          date={siteData.date || "On Your Special Day"}
          letterBody={letterBody}
          sealType="gold"
          fontFamily="serif"
          initials="🎂"
          subtitle="A personal sealed birthday blessing"
        />
      </section>

      {/* Polaroid Gallery */}
      <section className="relative z-20">
        <PolaroidGallery
          photos={siteData.photos}
          title="Another Year of Radiant Moments"
          subtitle="Looking back on all the laughter and adventures we shared"
          tapeStyle="gold"
        />
      </section>

      {/* Birthday Trivia Quiz */}
      <section className="relative z-20">
        <CuteQuiz
          quiz={siteData.quiz}
          theme="gold"
          quizTitle="The Official Birthday Rule Quiz 👑"
          fallbackQuestion="What is the #1 mandatory rule for your birthday today?"
          fallbackOptions={[
            "Zero stress, zero chores, and zero worries",
            "Eat cake for breakfast, lunch, and dinner",
            "Accept every hug and compliment graciously",
            "All of the above without exception! 🎉"
          ]}
          correctIndex={3}
          rewardText={siteData.quiz?.rewardText || "Treat Unlocked: Extra giant slice of cake + VIP royal treatment all day! 🎂👑"}
        />
      </section>

      {/* Golden Scratch Card */}
      <section className="relative z-20">
        <ScratchCard
          scratchCard={siteData.scratchCard}
          title="Birthday Mystery Voucher"
          subtitle="Scratch below to reveal your birthday bonus!"
          hiddenMessage={siteData.scratchCard?.hiddenSecret || siteData.scratchCard?.hiddenMessage || "Valid for: 1x All-Expenses-Paid Celebration Dinner + Favorite Dessert! 🥂🍽️"}
          voucherCode={siteData.scratchCard?.code || "BDAY-ROYAL-2026"}
          theme="gold"
        />
      </section>

      {/* Keepsake Footer */}
      <TemplateFooter onCreateClick={onNavigateCreate} />
    </div>
  );
}
