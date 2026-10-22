import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Smile, CheckCircle2, Award } from 'lucide-react';
import AmbientParticles from './common/AmbientParticles';
import AudioPlayer from './common/AudioPlayer';
import EnvelopeLetter from './common/EnvelopeLetter';
import PolaroidGallery from './common/PolaroidGallery';
import CuteQuiz from './common/CuteQuiz';
import ScratchCard from './common/ScratchCard';
import TemplateFooter from './common/TemplateFooter';
import { soundEffects } from './common/SoundEffects';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';

// Distinct Theme Configurations for the 3 Sincere Apology Styles
const APOLOGY_THEMES = {
  'gentle-peace': {
    id: 'gentle-peace',
    name: 'Olive Peace',
    heroBadge: 'A sincere note for you 🕊️',
    heroIcon: '🕊️',
    containerBg: 'bg-gradient-to-b from-[#F3F8F3] via-[#EBF4EB] to-[#E0EFE2]',
    selectionClass: 'selection:bg-emerald-200 selection:text-emerald-900',
    badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200/90',
    titleColor: 'text-emerald-950',
    subtitleColor: 'text-emerald-800/80',
    accentColorHex: '#15803D',
    glow1: 'bg-emerald-200/35',
    glow2: 'bg-teal-100/35',
    glow3: 'bg-green-100/30',
    particlesType: 'olive',
    envelopeSealType: 'olive',
    envelopeSealEmoji: '🕊️',
    envelopeSubtitle: 'Break the olive wax seal to read my heartfelt apology',
    forgiveBtnGradient: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-400/50',
    noBtnClass: 'bg-white/95 border-emerald-200 text-emerald-800 hover:bg-emerald-50 shadow-sm',
    forgiveBoxBorder: 'border-emerald-200/80 shadow-emerald-900/5',
    forgiveCelebrationBg: 'from-white to-emerald-50 border-emerald-200',
    forgiveCelebrationText: 'text-emerald-900',
    forgiveCelebrationQuote: 'text-emerald-700',
    forgiveCelebrationBadge: 'bg-emerald-100 text-emerald-800',
    forgiveCelebrationEmoji: '🕊️',
    forgiveCelebrationMsg: 'Thank You For Granting Peace!',
    forgiveCelebrationSubtext: '"You just made my entire world brighter again. I promise to cherish and protect our peace always."',
    confettiColors: ['#15803D', '#22C55E', '#86EFAC', '#FFFFFF', '#34D399', '#A7F3D0'],
    treatyBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    treatyTitle: 'The Peace & Harmony Treaty',
    treatySubtitle: 'Diplomatic Accord of Healing & Understanding',
    treatyBorder: 'border-emerald-300/80',
    treatyArticles: [
      {
        roman: 'ARTICLE I:',
        title: 'Deep Listening & Unconditional Empathy',
        desc: 'Full attention whenever you speak, ego permanently set aside, and zero defensiveness.',
      },
      {
        roman: 'ARTICLE II:',
        title: 'Comfort Reparations',
        desc: 'Dinner at your absolute favorite spot, warm sweet treats, and complete pampering, fully on me.',
      },
      {
        roman: 'ARTICLE III:',
        title: 'Perpetual Truce & Care',
        desc: 'One complimentary "You are 100% Right" pass and unlimited warm bear hugs on demand.',
      },
    ],
    treatyBtnClass: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-300',
    stampColor: 'border-emerald-700 text-emerald-800 bg-emerald-50/90',
    stampText: 'PEACE ACCORD',
    promisesTitle: 'Promises from My Heart',
    promisesSubtitle: 'Sincere commitments I make to protect our bond and never take your peace for granted',
    promisesList: [
      {
        icon: '🕊️',
        title: 'Listening with an Open Heart',
        desc: 'I promise to pause, listen to your feelings without rushing to defend myself, and truly understand your world.',
      },
      {
        icon: '🌿',
        title: 'Gentle & Patient Words',
        desc: 'I promise to communicate with calmness, warmth, and care, never letting momentary stress turn into sharp words.',
      },
      {
        icon: '💚',
        title: 'Protecting Our Precious Bond',
        desc: 'What we share is irreplaceable. I promise to cherish you, make you feel valued every day, and never take your smile for granted.',
      },
    ],
    promisesCardBg: 'bg-white/90 border-emerald-200/70 hover:border-emerald-400/80 shadow-emerald-900/5',
    promisesIconBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    quizTheme: 'emerald',
    quizTitle: 'The Peace & Truce Quiz 🕊️',
    scratchTheme: 'olive',
    scratchTitle: 'Apology Truce Voucher',
    scratchSubtitle: 'Scratch below to unlock your peace & comfort voucher',
    scratchSecret: 'Valid for: 1x Dinner at Your Favorite Spot + I Do The Dishes For A Week! 🍽️🕊️',
    scratchCode: 'PEACE-TRUCE-2026',
    audioTheme: 'apology',
    audioTitle: 'Gentle Peace & Acoustic Harmony',
    audioAccent: 'from-emerald-600 to-teal-600',
    polaroidTitle: 'The Smiles I Miss Most',
    polaroidSubtitle: 'Looking back on all our joyful memories that mean everything to me',
    polaroidTape: 'blue',
    defaultLetter: (recipientName) =>
      `Dear ${recipientName},\n\nI want to apologize sincerely from the deepest corner of my heart. 🕊️🌿\n\nSeeing you hurt breaks my spirit. You mean the world to me, and our bond is too precious to ever put at risk. I deeply regret my thoughtlessness and careless words.\n\nI promise to listen more patiently, communicate more gently, and do better. I hope you can find it in your heart to forgive me so we can heal together peacefully.`,
  },

  'sweet-forgive': {
    id: 'sweet-forgive',
    name: 'Sweet Hugs',
    heroBadge: 'A sincere note for you 🥺💜',
    heroIcon: '🥺',
    containerBg: 'bg-gradient-to-b from-[#FAF8FF] via-[#F3EFFF] to-[#EDE5FF]',
    selectionClass: 'selection:bg-purple-200 selection:text-purple-900',
    badgeBg: 'bg-purple-100 text-purple-800 border border-purple-200/90',
    titleColor: 'text-purple-950',
    subtitleColor: 'text-purple-800/80',
    accentColorHex: '#8B5CF6',
    glow1: 'bg-purple-200/40',
    glow2: 'bg-indigo-100/40',
    glow3: 'bg-pink-100/35',
    particlesType: 'lavender',
    envelopeSealType: 'lavender',
    envelopeSealEmoji: '💜',
    envelopeSubtitle: 'Break the lilac wax seal to read my heartfelt apology',
    forgiveBtnGradient: 'bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-400/50',
    noBtnClass: 'bg-white/95 border-purple-200 text-purple-800 hover:bg-purple-50 shadow-sm',
    forgiveBoxBorder: 'border-purple-200/80 shadow-purple-900/5',
    forgiveCelebrationBg: 'from-white to-purple-50 border-purple-200',
    forgiveCelebrationText: 'text-purple-900',
    forgiveCelebrationQuote: 'text-purple-700',
    forgiveCelebrationBadge: 'bg-purple-100 text-purple-800',
    forgiveCelebrationEmoji: '💖',
    forgiveCelebrationMsg: 'Thank You For Forgiving Me!',
    forgiveCelebrationSubtext: '"You just made my entire world brighter again. I promise to hold you tight and cherish our bond always!"',
    confettiColors: ['#8B5CF6', '#C084FC', '#F472B6', '#E879F9', '#FFFFFF', '#DDD6FE'],
    treatyBadge: 'bg-purple-100 text-purple-800 border-purple-200',
    treatyTitle: 'The Big Hug & Sweet Truce Accord',
    treatySubtitle: 'Pact of Endless Warmth & Sweet Healing',
    treatyBorder: 'border-purple-300/80',
    treatyArticles: [
      {
        roman: 'ARTICLE I:',
        title: 'Infinite Comfort Bear Hugs',
        desc: 'Guaranteed giant warm hugs whenever you feel down, tired, or need sweet reassurance.',
      },
      {
        roman: 'ARTICLE II:',
        title: 'Sweet Treats & Boba Restitution',
        desc: 'Your favorite boba drinks, sweet cupcakes, and snacks hand-delivered with zero hesitation.',
      },
      {
        roman: 'ARTICLE III:',
        title: 'Gentle Heart Protection',
        desc: 'Never letting misunderstandings linger overnight, and always prioritizing your sweet smile.',
      },
    ],
    treatyBtnClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-300',
    stampColor: 'border-purple-600 text-purple-700 bg-purple-50/90',
    stampText: 'SWEET TRUCE',
    promisesTitle: 'Promises from My Heart',
    promisesSubtitle: 'Little promises from the deepest part of my heart to make things right again',
    promisesList: [
      {
        icon: '🥺',
        title: 'Never Overlooking Your Feelings',
        desc: 'Your happiness and security matter more than anything. I promise to always check in and care for how you feel.',
      },
      {
        icon: '🧸',
        title: 'Giant Hugs, Zero Cold Shoulders',
        desc: 'No stubborn silences. When things are tough, I will hold you tighter, speak softer, and be your calm.',
      },
      {
        icon: '💜',
        title: 'Treasuring Every Sweet Moment',
        desc: 'I will never take your kindness, patience, and warmth for granted. You deserve the best version of me.',
      },
    ],
    promisesCardBg: 'bg-white/90 border-purple-200/70 hover:border-purple-400/80 shadow-purple-900/5',
    promisesIconBg: 'bg-purple-50 border-purple-200 text-purple-700',
    quizTheme: 'lavender',
    quizTitle: 'The Sweet Truce & Hugs Quiz 💜',
    scratchTheme: 'lavender',
    scratchTitle: 'Sweet Apology Voucher',
    scratchSubtitle: 'Scratch below to unlock your sweet compensation treat',
    scratchSecret: 'Valid for: Unlimited Warm Hugs + 1x Late-Night Ice Cream Run! 🍨💜',
    scratchCode: 'SWEET-HUGS-2026',
    audioTheme: 'apology',
    audioTitle: 'Comfort & Peace Melody',
    audioAccent: 'from-purple-500 to-indigo-500',
    polaroidTitle: 'Moments That Make Me Smile',
    polaroidSubtitle: 'Looking at these memories reminds me why you mean everything to me',
    polaroidTape: 'pink',
    defaultLetter: (recipientName) =>
      `Dear ${recipientName},\n\nI am so very sorry. 🥺💜\n\nI miss your laughter, your sweet messages, and the gentle comfort of having you close. Everything feels dull and quiet without your smile.\n\nPlease forgive my silly mistake — I promise to make it up to you with endless warm hugs, extra care, and listening with all my heart.`,
  },

  'fresh-start': {
    id: 'fresh-start',
    name: 'Sunrise Renewal',
    heroBadge: 'A sincere note for you 🌤️💛',
    heroIcon: '🌤️',
    containerBg: 'bg-gradient-to-b from-[#FFFDF8] via-[#FEF8EC] to-[#FDF1D8]',
    selectionClass: 'selection:bg-amber-200 selection:text-amber-900',
    badgeBg: 'bg-amber-100 text-amber-800 border border-amber-200/90',
    titleColor: 'text-amber-950',
    subtitleColor: 'text-amber-900/80',
    accentColorHex: '#D97706',
    glow1: 'bg-amber-200/40',
    glow2: 'bg-yellow-100/50',
    glow3: 'bg-orange-100/35',
    particlesType: 'sunrise',
    envelopeSealType: 'gold',
    envelopeSealEmoji: '🌤️',
    envelopeSubtitle: 'Break the golden wax seal to read my sincere apology',
    forgiveBtnGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-400/50',
    noBtnClass: 'bg-white/95 border-amber-200 text-amber-800 hover:bg-amber-50 shadow-sm',
    forgiveBoxBorder: 'border-amber-200/80 shadow-amber-900/5',
    forgiveCelebrationBg: 'from-white to-amber-50 border-amber-200',
    forgiveCelebrationText: 'text-amber-900',
    forgiveCelebrationQuote: 'text-amber-700',
    forgiveCelebrationBadge: 'bg-amber-100 text-amber-800',
    forgiveCelebrationEmoji: '🌤️',
    forgiveCelebrationMsg: 'Thank You For Turning The Page!',
    forgiveCelebrationSubtext: '"A brand new sunrise begins for us today. I promise to bring warmth, honesty, and care to every single moment."',
    confettiColors: ['#D97706', '#F59E0B', '#FCD34D', '#FEF08A', '#FFFFFF', '#FED7AA'],
    treatyBadge: 'bg-amber-100 text-amber-800 border-amber-200',
    treatyTitle: 'The Fresh Dawn & Clean Slate Accord',
    treatySubtitle: 'New Chapter Charter of Healing & Growth',
    treatyBorder: 'border-amber-300/80',
    treatyArticles: [
      {
        roman: 'ARTICLE I:',
        title: 'Clean Slate & Zero Grudges',
        desc: "Leaving yesterday's mistakes in the past, moving forward with forgiveness and renewed trust.",
      },
      {
        roman: 'ARTICLE II:',
        title: 'Golden Sunrise Adventures',
        desc: 'Morning coffees, peaceful walks, and making joyful new memories filled with laughter.',
      },
      {
        roman: 'ARTICLE III:',
        title: 'Continuous Growth & Dedication',
        desc: 'Learning every day how to be a better partner, friend, and safe haven for you.',
      },
    ],
    treatyBtnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-300',
    stampColor: 'border-amber-600 text-amber-700 bg-amber-50/90',
    stampText: 'NEW CHAPTER',
    promisesTitle: 'Promises from My Heart',
    promisesSubtitle: 'My heartfelt commitments as we start this warm, bright new chapter together',
    promisesList: [
      {
        icon: '🌤️',
        title: 'A Dawn of Empathy & Kindness',
        desc: 'Approaching every conversation with patience, grace, and an eager desire to support you.',
      },
      {
        icon: '🌱',
        title: 'Growing Together Through Mistakes',
        desc: 'Acknowledging when I stumble, learning with humility, and becoming stronger together.',
      },
      {
        icon: '💛',
        title: 'Unwavering Loyalty & Warmth',
        desc: 'Being your safe harbor where you are always treasured, respected, and deeply loved.',
      },
    ],
    promisesCardBg: 'bg-white/90 border-amber-200/70 hover:border-amber-400/80 shadow-amber-900/5',
    promisesIconBg: 'bg-amber-50 border-amber-200 text-amber-700',
    quizTheme: 'gold',
    quizTitle: 'The Fresh Start & New Dawn Quiz 🌤️',
    scratchTheme: 'gold',
    scratchTitle: 'Fresh Chapter Voucher',
    scratchSubtitle: 'Scratch below to unlock your sunrise clean-slate voucher',
    scratchSecret: 'Valid for: 1x Sunrise Coffee Date + Clean Slate Guarantee Forever! ☕🌤️',
    scratchCode: 'FRESH-START-2026',
    audioTheme: 'apology',
    audioTitle: 'Sunrise Renewal & Acoustic Calm',
    audioAccent: 'from-amber-500 to-orange-500',
    polaroidTitle: 'Sunny Memories We Cherish',
    polaroidSubtitle: 'Remembering the golden times and stepping forward into even brighter ones',
    polaroidTape: 'gold',
    defaultLetter: (recipientName) =>
      `Dear ${recipientName},\n\nWith every sunrise comes the promise of a fresh start and brighter days. 🌤️🌱\n\nI am genuinely sorry for where things went wrong. I value you more than words can express, and I never want pride or mistakes to stand between us.\n\nI hope we can turn the page, leave the hurt behind, and step forward into a warm, beautiful new chapter together.`,
  },
};

export default function HeartfeltApologyView({ siteData = {}, onNavigateCreate, hideAudioPlayer = false, _isLiveView = false }) {
  // Determine Theme Style
  const activeThemeId = (() => {
    const raw = (siteData.templateId || siteData.theme || siteData.type || '').toLowerCase();
    if (raw.includes('forgive') || raw.includes('sweet') || raw.includes('hug')) return 'sweet-forgive';
    if (raw.includes('fresh') || raw.includes('sunrise') || raw.includes('renewal')) return 'fresh-start';
    if (raw.includes('peace') || raw.includes('olive') || raw.includes('dove')) return 'gentle-peace';
    return 'gentle-peace';
  })();

  const themeConfig = APOLOGY_THEMES[activeThemeId] || APOLOGY_THEMES['gentle-peace'];

  const recipientName = siteData.recipientName || 'My Favorite Person';
  const senderName = siteData.senderName || 'Sincerely Yours';

  const title = siteData.title || (
    siteData.occasion 
      ? (siteData.occasion.toLowerCase().includes(recipientName.toLowerCase()) 
          ? siteData.occasion 
          : `${siteData.occasion}, ${recipientName} ${themeConfig.heroIcon}`)
      : `I am really sorry, ${recipientName} ${themeConfig.heroIcon}`
  );

  const subtitle = siteData.subtitle || (
    activeThemeId === 'sweet-forgive'
      ? "Nothing feels right when you're upset. You mean the entire world to me, and I miss your sweet laughter."
      : activeThemeId === 'fresh-start'
        ? "Every sunrise is a chance to heal, learn, and grow closer. I want to build a warm new chapter with you."
        : "My heart aches when things aren't right between us. You mean far too much to me for silly mistakes to get in the way."
  );

  const letterBody = (typeof siteData.letter === 'object' ? siteData.letter?.content : siteData.letter) 
    || siteData.letterBody 
    || themeConfig.defaultLetter(recipientName);

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
    "Free boba for a month? 🧋",
    "Pretty please with sugar? 🥺💜",
    "Unlimited back scratches? 💆",
    "I'll do all the chores! 🧹",
    "What about your favorite pizza? 🍕",
    "I'll buy you that hoodie you wanted! 🎁",
    "You know you miss me! 🤭",
  ];

  const handleNoHover = (e) => {
    if (e && e.type === 'touchstart') {
      e.preventDefault();
    }
    soundEffects.playPop();

    // Prevent button from flying off screen on narrow mobile screens
    const isNarrow = typeof window !== 'undefined' && window.innerWidth < 480;
    const maxRangeX = isNarrow ? 70 : 140;
    const maxRangeY = isNarrow ? 45 : 85;

    const randomX = (Math.random() - 0.5) * (maxRangeX * 2);
    const randomY = (Math.random() - 0.5) * (maxRangeY * 2);
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
        colors: themeConfig.confettiColors,
      });
    } catch {}
  };

  const handleStampTreaty = () => {
    soundEffects.playSealBreak();
    setTreatyStamped(true);
    try {
      confetti({
        particleCount: 65,
        spread: 55,
        origin: { y: 0.75 },
        colors: themeConfig.confettiColors,
      });
    } catch {}
  };

  // Resolve Promises to Display
  const rawPromises = siteData.reasons || siteData.promises;
  const promisesToDisplay = Array.isArray(rawPromises) && rawPromises.length > 0
    ? rawPromises.map((p, i) => ({
        icon: p.icon || themeConfig.promisesList[i % themeConfig.promisesList.length].icon,
        title: p.title || p.heading || `Promise #${i + 1}`,
        desc: p.desc || p.description || p.text || p.content || '',
      }))
    : themeConfig.promisesList;

  return (
    <div className={`relative min-h-screen ${themeConfig.containerBg} ${themeConfig.selectionClass} text-slate-800 overflow-x-hidden font-sans pb-16`}>
      
      {/* Ambient Floating Particles */}
      <AmbientParticles type={themeConfig.particlesType} count={24} />

      {/* Gentle Theme Ambient Mist Glows */}
      <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 ${themeConfig.glow1} rounded-full blur-3xl pointer-events-none`} />
      <div className={`absolute top-1/3 -left-20 w-80 h-80 ${themeConfig.glow2} rounded-full blur-3xl pointer-events-none`} />
      <div className={`absolute top-2/3 -right-20 w-80 h-80 ${themeConfig.glow3} rounded-full blur-3xl pointer-events-none`} />

      {/* Floating Audio Player */}
      {!hideAudioPlayer && (
        <AudioPlayer
          audioUrl={siteData.songUrl || siteData.customSongUrl || siteData.music?.audioUrl || siteData.audioUrl}
          title={siteData.customSongTitle || siteData.music?.title || themeConfig.audioTitle}
          theme={themeConfig.audioTheme}
          accentColor={themeConfig.audioAccent}
        />
      )}

      {/* Hero Section */}
      <section className="relative z-20 pt-16 sm:pt-24 pb-8 px-4 text-center max-w-3xl mx-auto">
        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full ${themeConfig.badgeBg} text-xs font-semibold mb-3 tracking-wide shadow-xs`}>
          <span>{themeConfig.heroBadge}</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${themeConfig.titleColor} leading-tight break-words`}>
          {renderAppleText(title)}
        </h1>

        <p className={`mt-4 text-base sm:text-lg ${themeConfig.subtitleColor} max-w-xl mx-auto leading-relaxed`}>
          {renderAppleText(subtitle)}
        </p>
      </section>

      {/* Sincere Unfolded Apology Letter in Envelope */}
      <section className="relative z-20">
        <EnvelopeLetter
          to={recipientName}
          from={senderName}
          date={siteData.date || "With Genuine Sincerity"}
          letterBody={letterBody}
          sealType={themeConfig.envelopeSealType}
          fontFamily="handwriting"
          initials={themeConfig.envelopeSealEmoji}
          subtitle={themeConfig.envelopeSubtitle}
        />
      </section>

      {/* Interactive Playful Forgiveness Box */}
      <section className="relative z-20 max-w-xl mx-auto my-12 px-4">
        <div className={`glass-card rounded-3xl p-6 sm:p-8 shadow-xl ${themeConfig.forgiveBoxBorder} border text-center overflow-hidden relative backdrop-blur-md`}>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${themeConfig.badgeBg} text-xs font-semibold mb-3`}>
            <Smile className="w-3.5 h-3.5" />
            <span>The Peace Question</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center justify-center gap-2">
            <span>Can You Forgive Me?</span>
            <AppleEmoji emoji={themeConfig.heroIcon} size={28} />
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
            Life is too short and you are far too precious to be upset with each other.
          </p>

          {!forgiven ? (
            <div className="relative mt-8 py-6 min-h-[140px] flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Big Sincere Forgive Button */}
              <button
                onClick={handleForgive}
                className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm sm:text-base font-bold ${themeConfig.forgiveBtnGradient} shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 select-none`}
              >
                <Heart className="w-5 h-5 fill-current animate-pulse" />
                <span className="flex items-center gap-1.5">
                  <span>Yes, I Forgive You</span>
                  <AppleEmoji emoji="❤️" size={18} />
                </span>
              </button>

              {/* Playful Moving "No" Button */}
              <button
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                onClick={handleNoHover}
                style={{
                  transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className={`px-5 py-3 rounded-full text-xs sm:text-sm font-semibold ${themeConfig.noBtnClass} border cursor-pointer select-none transition-all flex items-center justify-center gap-1.5`}
              >
                {renderAppleText(playfulNoTexts[noCount % playfulNoTexts.length], 16)}
              </button>
            </div>
          ) : (
            /* Forgiveness Joyful Acceptance State */
            <div className={`mt-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-b ${themeConfig.forgiveCelebrationBg} shadow-inner animate-in zoom-in-95 duration-400 flex flex-col items-center`}>
              <AppleEmoji emoji={themeConfig.forgiveCelebrationEmoji} size={48} className="animate-bounce mb-2" />
              <h4 className={`text-xl sm:text-2xl font-black ${themeConfig.forgiveCelebrationText}`}>
                {themeConfig.forgiveCelebrationMsg}
              </h4>
              <p className={`font-handwriting text-2xl sm:text-3xl ${themeConfig.forgiveCelebrationQuote} mt-2.5 max-w-md mx-auto leading-snug`}>
                {themeConfig.forgiveCelebrationSubtext}
              </p>
              <div className={`mt-5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${themeConfig.forgiveCelebrationBadge} text-xs font-bold shadow-xs`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>Truce Official & Sealed</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Promises from My Heart Section */}
      <section className="relative z-20 max-w-4xl mx-auto my-12 px-4">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full ${themeConfig.badgeBg} text-xs font-semibold mb-2.5 shadow-xs`}>
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Sincere Commitments</span>
          </div>
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${themeConfig.titleColor}`}>
            {themeConfig.promisesTitle}
          </h3>
          <p className={`text-xs sm:text-sm ${themeConfig.subtitleColor} mt-2 max-w-lg mx-auto leading-relaxed`}>
            {themeConfig.promisesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {promisesToDisplay.map((promise, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl p-6 ${themeConfig.promisesCardBg} border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 ${themeConfig.promisesIconBg} border shadow-xs`}>
                  {typeof promise.icon === 'string' && promise.icon.length <= 4 ? (
                    <AppleEmoji emoji={promise.icon} size={24} />
                  ) : (
                    promise.icon || <Heart className="w-5 h-5 text-current fill-current" />
                  )}
                </div>
                <h4 className={`text-base font-bold ${themeConfig.titleColor} mb-2 leading-snug`}>
                  {renderAppleText(promise.title)}
                </h4>
                <p className={`text-xs sm:text-sm ${themeConfig.subtitleColor} leading-relaxed`}>
                  {renderAppleText(promise.desc || promise.description || promise.text)}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-1 text-[11px] font-semibold opacity-75">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span>Promise #{idx + 1} sealed from the heart</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Peace Treaty Certificate with Interactive Stamp */}
      <section className="relative z-20 max-w-2xl mx-auto my-12 px-4">
        <div className={`relative paper-parchment rounded-3xl p-6 sm:p-10 shadow-xl border-2 ${themeConfig.treatyBorder}`}>
          
          {/* Certificate Header */}
          <div className="text-center border-b border-slate-900/10 pb-5">
            <span className={`text-[10px] uppercase tracking-widest font-black px-3.5 py-1 rounded-full border ${themeConfig.treatyBadge}`}>
              OFFICIAL DIPLOMATIC ACCORD
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-3 tracking-tight">
              {themeConfig.treatyTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Between <span className="font-semibold text-slate-700">{senderName}</span> and <span className="font-semibold text-slate-700">{recipientName}</span>
            </p>
          </div>

          {/* Treaty Articles / Terms */}
          <div className="my-6 space-y-3.5 text-sm text-slate-700">
            {themeConfig.treatyArticles.map((article, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/75 border border-slate-200/70 shadow-xs">
                <span className="font-black text-xs mt-0.5 font-mono text-slate-800 tracking-wider">
                  {article.roman}
                </span>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-800 mb-0.5">
                    {article.title}
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {article.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stamp Action / Signature Area */}
          <div className="pt-5 border-t border-slate-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Treaty Status</p>
              <p className="font-extrabold text-slate-800 text-sm sm:text-base mt-0.5">
                {treatyStamped ? (
                  <span className="text-emerald-700 flex items-center justify-center sm:justify-start gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    <span>Formally Ratified & In Full Effect</span>
                  </span>
                ) : (
                  'Awaiting Official Ratification'
                )}
              </p>
            </div>

            {/* Official Stamp Button / Sealed Stamp Indicator */}
            {!treatyStamped ? (
              <button
                onClick={handleStampTreaty}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold ${themeConfig.treatyBtnClass} transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md select-none`}
              >
                <Award className="w-4 h-4" />
                <span className="flex items-center gap-1.5">
                  <span>Affix Official Stamp</span>
                  <AppleEmoji emoji="📜" size={14} />
                </span>
              </button>
            ) : (
              <div className={`relative px-4 py-3 rounded-2xl border-4 ${themeConfig.stampColor} font-bold rotate-[-8deg] shadow-lg animate-in zoom-in-75 duration-300 flex items-center gap-3 select-none`}>
                <div className="w-12 h-12 rounded-full border-2 border-current flex flex-col items-center justify-center">
                  <span className="text-[8px] uppercase tracking-widest font-mono">SEALED</span>
                  <AppleEmoji emoji={themeConfig.envelopeSealEmoji} size={16} />
                  <span className="text-[7px] uppercase tracking-wider font-mono">RATIFIED</span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-black tracking-wider uppercase">{themeConfig.stampText}</p>
                  <p className="text-[10px] opacity-80">Diplomatic Truce Active</p>
                  <div className="flex items-center gap-1 text-[9px] mt-0.5 opacity-90 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                    <span>Ratified Forever</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Memory Gallery of Joyful Times */}
      <section className="relative z-20">
        <PolaroidGallery
          photos={siteData.photos}
          title={themeConfig.polaroidTitle}
          subtitle={themeConfig.polaroidSubtitle}
          tapeStyle={themeConfig.polaroidTape}
        />
      </section>

      {/* Cute Peace Trivia */}
      <section className="relative z-20">
        <CuteQuiz
          quiz={siteData.quiz}
          theme={themeConfig.quizTheme}
          quizTitle={themeConfig.quizTitle}
          fallbackQuestion="What is the single quickest recipe to make everything right between us?"
          fallbackOptions={[
            "A sincere apology and listening with an open heart",
            "Your favorite comfort treats and sweet drinks",
            "A giant warm bear hug that melts all the tension",
            "All three together right now, no questions asked! 💜"
          ]}
          correctIndex={3}
          rewardText={siteData.quiz?.rewardText || "Treat Unlocked: 1x Giant bear hug + Favorite comfort meal on me! 🍩💜"}
        />
      </section>

      {/* Peace Treaty Scratch Card */}
      <section className="relative z-20">
        <ScratchCard
          scratchCard={siteData.scratchCard}
          title={themeConfig.scratchTitle}
          subtitle={themeConfig.scratchSubtitle}
          hiddenMessage={siteData.scratchCard?.hiddenSecret || siteData.scratchCard?.hiddenMessage || themeConfig.scratchSecret}
          voucherCode={siteData.scratchCard?.code || themeConfig.scratchCode}
          theme={themeConfig.scratchTheme}
        />
      </section>

      {/* Keepsake Footer */}
      <TemplateFooter onCreateClick={onNavigateCreate} />
    </div>
  );
}