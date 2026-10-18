import React from 'react';
import { Heart, Sparkles, Calendar } from 'lucide-react';
import AmbientParticles from './common/AmbientParticles';
import AudioPlayer from './common/AudioPlayer';
import EnvelopeLetter from './common/EnvelopeLetter';
import PolaroidGallery from './common/PolaroidGallery';
import CuteQuiz from './common/CuteQuiz';
import ScratchCard from './common/ScratchCard';
import TemplateFooter from './common/TemplateFooter';

export default function BlushRomanceView({ siteData = {}, onNavigateCreate }) {
  const recipientName = siteData.recipientName || 'Devi';
  const senderName = siteData.senderName || 'Your Favorite Person';
  const title = siteData.title || siteData.occasion || `To My Favorite Person, ${recipientName}`;
  const subtitle = siteData.subtitle || "In a world of billions of people, my happiest place will always be right beside you.";
  const letterBody = (typeof siteData.letter === 'object' ? siteData.letter?.content : siteData.letter) || siteData.letterBody || `I still remember the first time you smiled at me. It felt like the entire room went quiet and time stood still.\n\nThank you for being my anchor, my sweetest distraction, and the person I can always be silly with. With you, even ordinary grocery runs and quiet rainy afternoons feel like adventures.\n\nI love you more than words could ever fit on this page, today and for all the tomorrows to come.`;

  const loveReasons = siteData.loveReasons || [
    { title: "Your Radiant Smile", desc: "How it effortlessly turns even my most exhausting day into pure joy.", icon: "✨" },
    { title: "Your Gentle Soul", desc: "The quiet kindness and endless warmth you show to everyone around you.", icon: "🌸" },
    { title: "Our Inside Jokes", desc: "How a single glance from across the room can make us burst into giggles.", icon: "💫" },
    { title: "Your Warmest Hugs", desc: "The safest, coziest, and most comforting place in the entire world.", icon: "🧸" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FFF5F7] via-[#FFF0F5] to-[#FDF4F5] text-slate-800 overflow-hidden font-sans selection:bg-rose-200 selection:text-rose-900">
      
      {/* Floating Ambient Hearts & Petals */}
      <AmbientParticles type="hearts" count={26} />

      {/* Decorative Soft Background Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -right-20 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Audio Player */}
      <AudioPlayer
        audioUrl={siteData.music?.audioUrl || siteData.audioUrl}
        title={siteData.music?.title || `${recipientName}'s Keepsake Melody`}
        theme="romantic"
      />

      {/* Hero Section */}
      <section className="relative z-20 pt-16 sm:pt-24 pb-12 px-4 text-center max-w-4xl mx-auto">
        {/* Sweet Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-xs mb-5 animate-float">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-rose-600">
            A Keepsake Crafted For You
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          {subtitle}
        </p>

        {/* Date / Special Moment Indicator */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-100/60 text-xs font-medium text-rose-700">
          <Calendar className="w-3.5 h-3.5" />
          <span>{siteData.date || "Today, Tomorrow & Forever"}</span>
        </div>
      </section>

      {/* Interactive Sealed Love Letter */}
      <section className="relative z-20">
        <EnvelopeLetter
          to={recipientName}
          from={senderName}
          date={siteData.date || "Forever & Always"}
          letterBody={letterBody}
          sealType="rose"
          fontFamily="handwriting"
          initials={recipientName ? recipientName[0].toUpperCase() : 'D'}
          subtitle="Click the wax seal to unlock your personal letter"
        />
      </section>

      {/* "Little Reasons Why I Adore You" Cards */}
      <section className="relative z-20 max-w-4xl mx-auto my-14 px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-500">
            From The Heart
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
            Little Things I Adore About You
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {loveReasons.map((item, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-white/90 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl select-none group-hover:scale-125 transition-transform">
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Polaroid Memories Carousel / Wall with Lightbox */}
      <section className="relative z-20">
        <PolaroidGallery
          photos={siteData.photos}
          title="Snapshots of Us"
          subtitle="Click on any polaroid to zoom into the memory"
          tapeStyle="pink"
        />
      </section>

      {/* Romantic Cute Quiz */}
      <section className="relative z-20">
        <CuteQuiz
          quiz={siteData.quiz}
          theme="rose"
          quizTitle="The Devi Love Trivia 💖"
          fallbackQuestion="What is the single best thing about us?"
          fallbackOptions={[
            "Our uncontrollable midnight laughing fits",
            "How we always find each other's favorite snacks",
            "That we can be 100% our truest, goofiest selves",
            "All of the above, plus a million more reasons ❤️"
          ]}
          correctIndex={3}
          rewardText={siteData.quiz?.rewardText || "You've unlocked 1x Big Warm Hug + Midnight Ice Cream Treat! 🍫🍦"}
        />
      </section>

      {/* Scratch-to-Reveal Card */}
      <section className="relative z-20">
        <ScratchCard
          scratchCard={siteData.scratchCard}
          title="Mystery Love Coupon"
          subtitle="Redeemable anytime with zero expiration date ❤️"
          hiddenMessage={siteData.scratchCard?.hiddenSecret || siteData.scratchCard?.hiddenMessage || "Valid for: 1x Late-Night Drive + Favorite Dessert on Me! 🍨🚗"}
          voucherCode={siteData.scratchCard?.code || "DEVI-FOREVER-2026"}
          theme="rose"
        />
      </section>

      {/* Subtle Keepsake Footer */}
      <TemplateFooter onCreateClick={onNavigateCreate} />
    </div>
  );
}
