import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Smile, CheckCircle2, Award } from 'lucide-react';
import AmbientParticles from './common/AmbientParticles';
import AudioPlayer from './common/AudioPlayer';
import EnvelopeLetter from './common/EnvelopeLetter';
import PolaroidGallery from './common/PolaroidGallery';
import CuteQuiz from './common/CuteQuiz';
import ScratchCard from './common/ScratchCard';
import TemplateFooter from './common/TemplateFooter';
import { soundEffects } from './common/SoundEffects';

export default function HeartfeltApologyView({ siteData = {}, onNavigateCreate }) {
  const recipientName = siteData.recipientName || 'My Favorite Person';
  const senderName = siteData.senderName || 'Sincerely Yours';
  const title = siteData.title || siteData.occasion || `I am really sorry, ${recipientName} 🥺💜`;
  const subtitle = siteData.subtitle || "My heart aches when things aren't right between us. You mean far too much to me for silly mistakes to get in the way.";
  const letterBody = (typeof siteData.letter === 'object' ? siteData.letter?.content : siteData.letter) || siteData.letterBody || `I've been thinking non-stop about what happened, and I genuinely want to apologize from the bottom of my heart.\n\nI never want to be the reason behind your sadness or frustration. Your smile and our bond are irreplaceable to me, and I deeply regret my thoughtlessness.\n\nI promise to listen more patiently, communicate more gently, and do better. I hope you can find it in your heart to forgive me.`;

  // Interactive Forgiveness State
  const [forgiven, setForgiven] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);

  // Peace Treaty Stamped State
  const [treatyStamped, setTreatyStamped] = useState(false);

  const playfulNoTexts = [
    "No, I'm still mad 😤",
    "Are you really sure? 🥺",
    "What if I bring donuts? 🍩",
    "Unlimited back scratches? 💆",
    "Free boba for a month? 🧋",
    "Pretty please with sugar? 🥺💜",
    "You know you miss me! 🤭"
  ];

  const handleNoHover = () => {
    soundEffects.playPop();
    const randomX = (Math.random() - 0.5) * 220;
    const randomY = (Math.random() - 0.5) * 120;
    setNoButtonPos({ x: randomX, y: randomY });
    setNoCount((prev) => prev + 1);
  };

  const handleForgive = () => {
    soundEffects.playCelebration();
    setForgiven(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C084FC', '#A855F7', '#F472B6', '#38BDF8', '#FCD34D']
      });
    } catch {}
  };

  const handleStampTreaty = () => {
    soundEffects.playSealBreak();
    setTreatyStamped(true);
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.75 },
        colors: ['#9333EA', '#C084FC', '#F43F5E']
      });
    } catch {}
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FAF8FF] via-[#F3EFFF] to-[#EDE5FF] text-slate-800 overflow-hidden font-sans selection:bg-purple-200 selection:text-purple-900">
      
      {/* Ambient Floating Soft Lavender Petals & Sparkles */}
      <AmbientParticles type="lavender" count={24} />

      {/* Gentle Lavender Mist Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -right-20 w-80 h-80 bg-pink-100/35 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Audio Player */}
      <AudioPlayer
        audioUrl={siteData.music?.audioUrl || siteData.audioUrl}
        title={siteData.music?.title || "Comfort & Peace Melody"}
        theme="apology"
        accentColor="from-purple-500 to-indigo-500"
      />

      {/* Hero Section */}
      <section className="relative z-20 pt-16 sm:pt-24 pb-10 px-4 text-center max-w-3xl mx-auto">
        <div className="text-xs font-medium text-purple-600 mb-3 tracking-wide">
          A sincere note for you 🕊️
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </section>

      {/* Interactive Sincere Apology Letter in Lavender Sealed Envelope */}
      <section className="relative z-20">
        <EnvelopeLetter
          to={recipientName}
          from={senderName}
          date={siteData.date || "With Genuine Sincerity"}
          letterBody={letterBody}
          sealType="lavender"
          fontFamily="handwriting"
          initials="🕊️"
          subtitle="Break the lavender seal to read my heartfelt apology"
        />
      </section>

      {/* Interactive Forgiveness Box: Runaway "No" vs "I Forgive You" */}
      <section className="relative z-20 max-w-xl mx-auto my-12 px-4">
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-200/80 text-center overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-3">
            <Smile className="w-3.5 h-3.5 text-purple-600" />
            <span>The Peace Question</span>
          </div>

          <h3 className="font-semibold text-2xl sm:text-3xl font-bold text-slate-800">
            Can We Make Up? 🥺
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Life is too short and you are far too precious to be upset with each other.
          </p>

          {!forgiven ? (
            <div className="relative mt-8 py-6 min-h-[140px] flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Big Glowing Forgive Button */}
              <button
                onClick={handleForgive}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-white shadow-lg shadow-purple-300/60 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
              >
                <Heart className="w-5 h-5 fill-current animate-pulse" />
                <span>I Forgive You 💕</span>
              </button>

              {/* Playful Moving "No" Button */}
              <button
                onMouseEnter={handleNoHover}
                onClick={handleNoHover}
                style={{
                  transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white border border-purple-200 text-purple-800 shadow-sm hover:shadow-md cursor-pointer select-none transition-all"
              >
                {playfulNoTexts[noCount % playfulNoTexts.length]}
              </button>
            </div>
          ) : (
            /* Forgiveness Celebration State */
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-white to-purple-50 border border-purple-200 shadow-inner animate-in zoom-in-95 duration-400">
              <span className="text-5xl inline-block animate-bounce mb-2">💖</span>
              <h4 className="font-semibold text-xl sm:text-2xl font-bold text-slate-800">
                Thank You For Forgiving Me!
              </h4>
              <p className="font-handwriting text-2xl text-purple-700 mt-2">
                "You just made my entire world brighter again. I promise to cherish you always!"
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>Truce Official & Sealed</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Official Peace Treaty Certificate with Interactive Stamp */}
      <section className="relative z-20 max-w-2xl mx-auto my-12 px-4">
        <div className="relative paper-parchment rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-purple-200/80">
          
          {/* Certificate Header */}
          <div className="text-center border-b border-purple-900/10 pb-5">
            <span className="text-[10px] uppercase tracking-widest font-bold text-purple-800/60 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              OFFICIAL DIPLOMATIC ACCORD
            </span>
            <h3 className="font-semibold text-2xl sm:text-3xl font-extrabold text-slate-800 mt-3">
              The Peace & Harmony Treaty
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Between {senderName} and {recipientName}
            </p>
          </div>

          {/* Treaty Articles / Terms */}
          <div className="my-6 space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-purple-100">
              <span className="font-bold text-purple-600 text-xs mt-0.5">ARTICLE I:</span>
              <p className="text-xs sm:text-sm">
                Full chef dinner or favorite sweet dessert treat of your choice, completely on me.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-purple-100">
              <span className="font-bold text-purple-600 text-xs mt-0.5">ARTICLE II:</span>
              <p className="text-xs sm:text-sm">
                One complimentary "You Win The Argument" pass, valid indefinitely without question.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-purple-100">
              <span className="font-bold text-purple-600 text-xs mt-0.5">ARTICLE III:</span>
              <p className="text-xs sm:text-sm">
                Unlimited warm apologies, attentive listening, and giant hugs upon request.
              </p>
            </div>
          </div>

          {/* Stamp Action / Signature */}
          <div className="pt-4 border-t border-purple-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-[11px] uppercase tracking-wider text-purple-800/60 font-semibold">Treaty Status</p>
              <p className="font-semibold font-bold text-slate-800 text-base">
                {treatyStamped ? 'Formally Ratified & Enforced' : 'Awaiting Official Ratification'}
              </p>
            </div>

            {/* Official Stamp Button */}
            {!treatyStamped ? (
              <button
                onClick={handleStampTreaty}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Affix Peace Stamp 📜</span>
              </button>
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-purple-600/70 p-2 flex flex-col items-center justify-center text-purple-700 font-bold rotate-[-12deg] bg-purple-50/70 shadow-sm animate-in zoom-in-75 duration-300">
                <span className="text-[9px] uppercase tracking-widest font-mono">SEALED</span>
                <Heart className="w-5 h-5 fill-purple-600 text-purple-600 my-0.5" />
                <span className="text-[8px] uppercase tracking-wider">RATIFIED</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Memory Gallery of Happy Times */}
      <section className="relative z-20">
        <PolaroidGallery
          photos={siteData.photos}
          title="The Smiles I Miss Most"
          subtitle="Looking back on all our joyful memories that mean everything to me"
          tapeStyle="blue"
        />
      </section>

      {/* Cute Peace Trivia */}
      <section className="relative z-20">
        <CuteQuiz
          quiz={siteData.quiz}
          theme="lavender"
          quizTitle="The Peace & Truce Quiz 🕊️"
          fallbackQuestion="What is the quickest recipe to make everything right again?"
          fallbackOptions={[
            "A sincere apology and listening with an open heart",
            "Your favorite comfort snacks and warm treats",
            "A giant bear hug until you crack a smile",
            "All three together, immediately! 💜"
          ]}
          correctIndex={3}
          rewardText={siteData.quiz?.rewardText || "Treat Unlocked: 1x Giant bear hug + Favorite comfort meal on me! 🍩💜"}
        />
      </section>

      {/* Peace Treaty Scratch Card */}
      <section className="relative z-20">
        <ScratchCard
          scratchCard={siteData.scratchCard}
          title="Apology Truce Voucher"
          subtitle="Scratch below to unlock your compensation voucher"
          hiddenMessage={siteData.scratchCard?.hiddenSecret || siteData.scratchCard?.hiddenMessage || "Valid for: 1x Dinner at Your Favorite Spot + I Do The Dishes For A Week! 🍽️✨"}
          voucherCode={siteData.scratchCard?.code || "PEACE-TRUCE-2026"}
          theme="lavender"
        />
      </section>

      {/* Keepsake Footer */}
      <TemplateFooter onCreateClick={onNavigateCreate} />
    </div>
  );
}
