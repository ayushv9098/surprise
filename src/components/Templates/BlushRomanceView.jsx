import React from 'react';
import AmbientParticles from './common/AmbientParticles';
import AudioPlayer from './common/AudioPlayer';
import EnvelopeLetter from './common/EnvelopeLetter';
import PolaroidGallery from './common/PolaroidGallery';
import CuteQuiz from './common/CuteQuiz';
import ScratchCard from './common/ScratchCard';
import TemplateFooter from './common/TemplateFooter';

export default function BlushRomanceView({ siteData = {}, onNavigateCreate }) {
  const recipientName = siteData.recipientName || 'My Love';
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
    <div className="relative min-h-screen bg-[#FFFDFB] text-slate-800 overflow-hidden font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* Floating Ambient Hearts & Petals */}
      <AmbientParticles type="hearts" count={20} />

      {/* Floating Audio Player */}
      <AudioPlayer
        audioUrl={siteData.music?.audioUrl || siteData.audioUrl}
        title={siteData.music?.title || `${recipientName}'s Keepsake Melody`}
        theme="romantic"
      />

      {/* Hero Section */}
      <section className="relative z-20 pt-16 sm:pt-24 pb-12 px-4 text-center max-w-3xl mx-auto">
        <div className="text-xs font-medium text-rose-500 mb-3 tracking-wide">
          Made with love for you 🌸
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-normal leading-relaxed">
          {subtitle}
        </p>
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
          subtitle="Tap the wax seal to open your personal letter"
        />
      </section>

      {/* "Little Reasons Why I Adore You" Cards */}
      <section className="relative z-20 max-w-3xl mx-auto my-14 px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Little Things I Adore About You
          </h2>
          <p className="text-sm text-slate-500 mt-1">A few reasons why you are so special</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loveReasons.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start gap-3.5">
                <span className="text-2xl select-none">
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
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
          subtitle="Click on any photo to zoom in"
          tapeStyle="pink"
        />
      </section>

      {/* Romantic Cute Quiz */}
      <section className="relative z-20">
        <CuteQuiz
          quiz={siteData.quiz}
          theme="rose"
          quizTitle="A Little Question For You 💖"
          fallbackQuestion="What is the single best thing about us?"
          fallbackOptions={[
            "Our uncontrollable midnight laughing fits",
            "How we always find each other's favorite snacks",
            "That we can be 100% our truest, goofiest selves",
            "All of the above & everything we are ❤️"
          ]}
          fallbackCorrectIndex={3}
          fallbackRewardTitle="Treat Unlocked! 🍫"
          fallbackRewardMessage="One giant chocolate bar and a warm hug is waiting for you!"
        />
      </section>

      {/* Interactive Scratch-to-Reveal Card */}
      <section className="relative z-20">
        <ScratchCard
          scratchData={siteData.scratchCard}
          theme="rose"
          defaultTitle="Scratch for a Secret Promise ✨"
          defaultSecret="Unlimited hugs and late-night calls whenever you need them. Valid forever 💌"
        />
      </section>

      {/* Keepsake Footer */}
      <TemplateFooter onNavigateCreate={onNavigateCreate} />
    </div>
  );
}
