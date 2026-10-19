import React from 'react';
import { Heart, Calendar } from 'lucide-react';
import AmbientParticles from './common/AmbientParticles';
import AudioPlayer from './common/AudioPlayer';
import EnvelopeLetter from './common/EnvelopeLetter';
import PolaroidGallery from './common/PolaroidGallery';
import CuteQuiz from './common/CuteQuiz';
import ScratchCard from './common/ScratchCard';
import TemplateFooter from './common/TemplateFooter';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';

export default function PolaroidScrapbookView({ siteData = {}, onNavigateCreate }) {
  const recipientName = siteData.recipientName || 'My Favorite Adventurer';
  const senderName = siteData.senderName || 'Your Memory Keeper';
  const title = siteData.title || siteData.occasion || `The Scrapbook of Us, ${recipientName}`;
  const subtitle = siteData.subtitle || "A tender collection of candid smiles, little adventures, and memories taped forever to my heart.";
  const letterBody = (typeof siteData.letter === 'object' ? siteData.letter?.content : siteData.letter) || siteData.letterBody || `Looking through all our old photos, I can't help but smile at how much we've lived through together.\n\nFrom our very first awkward conversation to the countless late nights where we talked about everything and nothing. You've made my world softer, warmer, and so much more adventurous.\n\nHere's to all the memories we've pasted into this scrapbook, and to the blank pages waiting for us tomorrow.`;

  // Memory Timeline Items
  const timelineMemories = siteData.memories || [
    {
      chapter: "Chapter 1",
      date: "The Very Beginning",
      title: "The Day We First Crossed Paths",
      note: "I had no idea back then that a casual hello would turn into the most important friendship and love of my entire life.",
      photo: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80",
      tapeColor: "washi-tape",
      rotation: "-2deg"
    },
    {
      chapter: "Chapter 2",
      date: "Spontaneous Moments",
      title: "The Unplanned Roadtrip & Late Talks",
      note: "Windows down, singing terribly at the top of our lungs, and getting lost just to find that tiny diner with the best milkshakes.",
      photo: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80",
      tapeColor: "washi-tape-pink",
      rotation: "2.5deg"
    },
    {
      chapter: "Chapter 3",
      date: "Ordinary Magic",
      title: "Quiet Coffee Runs & Rainy Sundays",
      note: "It's the small, quiet in-between moments that I treasure the most. Just sitting next to you reading or laughing at silly videos.",
      photo: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
      tapeColor: "washi-tape-blue",
      rotation: "-1.5deg"
    },
    {
      chapter: "Chapter 4",
      date: "Here & Now",
      title: "To Every Adventure Still Ahead",
      note: "Every page turned with you feels like an exciting new adventure. Thank you for being my constant companion and best friend.",
      photo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
      tapeColor: "washi-tape",
      rotation: "1.8deg"
    }
  ];

  return (
    <div className="relative min-h-screen paper-parchment text-slate-800 overflow-hidden font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Ambient Floating Sparkles & Petals */}
      <AmbientParticles type="petals" count={22} />

      {/* Floating Audio Player */}
      <AudioPlayer
        audioUrl={siteData.music?.audioUrl || siteData.audioUrl}
        title={siteData.music?.title || "Vintage Acoustic Scrapbook"}
        theme="scrapbook"
      />

      {/* Scrapbook Journal Binder Header */}
      <header className="relative z-20 pt-16 sm:pt-24 pb-12 px-4 max-w-4xl mx-auto text-center">
        {/* Washi tape header deco */}
        <div className="w-32 h-6 washi-tape mx-auto -mb-3 rounded-xs opacity-80" />

        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-amber-200/80">
          <div className="text-xs font-medium text-amber-700 mb-2 flex items-center justify-center gap-1.5">
            <span>Memories & Keepsakes Journal</span>
            <AppleEmoji emoji="📸" size={14} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            {renderAppleText(title)}
          </h1>

          <p className="font-handwriting text-2xl sm:text-3xl text-amber-800/90 mt-3 max-w-xl mx-auto">
            "{renderAppleText(subtitle)}"
          </p>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              {siteData.date || "Edition: Forever"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Taped with Love
            </span>
          </div>
        </div>
      </header>

      {/* Memory Timeline Section (Vertical Scrapbook Thread) */}
      <section className="relative z-20 max-w-3xl mx-auto my-12 px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Down Memory Lane
          </h2>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-dashed border-amber-300 ml-4 sm:ml-32 space-y-12">
          {timelineMemories.map((item, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-10">
              
              {/* Timeline Pin Node */}
              <div className="absolute -left-3.5 top-1.5 w-7 h-7 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center shadow-sm">
                <AppleEmoji emoji="📌" size={16} />
              </div>

              {/* Date stamp badge (mobile vs desktop) */}
              <div className="sm:absolute sm:-left-32 sm:top-1 text-xs font-bold font-mono uppercase tracking-wider text-amber-800/70 mb-1 sm:mb-0 sm:text-right sm:w-24">
                {item.date}
              </div>

              {/* Scrapbook Card */}
              <div 
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-amber-200/80 transition-transform duration-300 hover:scale-[1.01]"
                style={{ transform: `rotate(${item.rotation})` }}
              >
                {/* Washi Tape Strip */}
                <div className={`w-20 h-4 ${item.tapeColor} -mt-7 mb-3 mx-auto rounded-xs opacity-75`} />

                <div className="flex flex-col md:flex-row items-center gap-5">
                  {/* Polaroid Thumbnail */}
                  <div className="w-full md:w-44 shrink-0 polaroid-frame bg-white shadow-sm p-2 pb-6">
                    <div className="aspect-square w-full overflow-hidden rounded-xs bg-slate-100">
                      <img 
                        src={item.photo} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                        loading="lazy" 
                      />
                    </div>
                  </div>

                  {/* Memory Story */}
                  <div className="flex-1 text-left">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-amber-700/70 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {item.chapter}
                    </span>
                    <h3 className="font-semibold text-lg sm:text-xl font-bold text-slate-800 mt-1.5">
                      {item.title}
                    </h3>
                    <p className="font-handwriting text-xl sm:text-2xl text-slate-700 mt-2 leading-relaxed">
                      "{item.note}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Sealed Scrapbook Journal Letter */}
      <section className="relative z-20">
        <EnvelopeLetter
          to={recipientName}
          from={senderName}
          date={siteData.date || "Timeless"}
          letterBody={letterBody}
          sealType="rose"
          fontFamily="handwriting"
          initials={siteData.letter?.sealEmoji || (recipientName ? recipientName[0].toUpperCase() : '📸')}
          subtitle="Folded scrapbook journal entry sealed with wax"
        />
      </section>

      {/* Polaroid Gallery Grid with Lightbox */}
      <section className="relative z-20">
        <PolaroidGallery
          photos={siteData.photos}
          title="Taped Moments & Snapshots"
          subtitle="Click on any taped polaroid to expand into the full memory"
          tapeStyle="gold"
        />
      </section>

      {/* Cute Nostalgic Quiz */}
      <section className="relative z-20">
        <CuteQuiz
          quiz={siteData.quiz}
          theme="rose"
          quizTitle="Memory Lane Trivia 📖"
          fallbackQuestion="What is the one thing we always remember about our favorite trips together?"
          fallbackOptions={[
            "Getting lost and somehow finding the best food spot",
            "Singing out loud with all the car windows down",
            "Laughing so hard our stomachs ached",
            "All of these memories and a million more! 🚗"
          ]}
          correctIndex={3}
          rewardText={siteData.quiz?.rewardText || "Treat Unlocked: 1x Nostalgic road trip + Your favorite boba drink! 🧋✨"}
        />
      </section>

      {/* Scrapbook Scratch Card */}
      <section className="relative z-20">
        <ScratchCard
          scratchCard={siteData.scratchCard}
          title="Vintage Keepsake Voucher"
          subtitle="Scratch the gold foil below to claim your memory token"
          hiddenMessage={siteData.scratchCard?.hiddenSecret || siteData.scratchCard?.hiddenMessage || "Valid for: 1x Cozy Weekend Picnic with Homemade Treats! 🧺🥪"}
          voucherCode={siteData.scratchCard?.code || "SCRAPBOOK-MAGIC-2026"}
          theme="gold"
        />
      </section>

      {/* Keepsake Footer */}
      <TemplateFooter onCreateClick={onNavigateCreate} />
    </div>
  );
}
