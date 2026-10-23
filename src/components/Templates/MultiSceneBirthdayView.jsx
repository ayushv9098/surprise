import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { soundEffects } from './common/SoundEffects';
import { getSongById } from '../../data/songs';

// 18 Ambient floating Apple emoji configurations calibrated for each distinct theme
const FLOATING_EMOJIS_DEF = [
  { boy: '⭐', girl: '🌸', peach: '🍑', lavender: '💜', gold: '⭐', polaroid: '📸', left: '4%', top: '8%', size: 24, dur: '7s', del: '0s' },
  { boy: '🦋', girl: '🦋', peach: '✨', lavender: '🦋', gold: '✨', polaroid: '⚡', left: '10%', top: '45%', size: 26, dur: '8.5s', del: '1.2s' },
  { boy: '👑', girl: '👑', peach: '👑', lavender: '🔮', gold: '👑', polaroid: '🔥', left: '90%', top: '14%', size: 28, dur: '9s', del: '0.5s' },
  { boy: '🌹', girl: '🌹', peach: '🧡', lavender: '🌸', gold: '🎂', polaroid: '⭐', left: '8%', top: '78%', size: 24, dur: '7.5s', del: '2s' },
  { boy: '💫', girl: '💫', peach: '💫', lavender: '💫', gold: '💫', polaroid: '✨', left: '88%', top: '52%', size: 22, dur: '8s', del: '0.8s' },
  { boy: '🎉', girl: '🎉', peach: '🎉', lavender: '🎉', gold: '🎉', polaroid: '❤️', left: '22%', top: '18%', size: 24, dur: '9.5s', del: '1.5s' },
  { boy: '💙', girl: '💖', peach: '🌟', lavender: '💜', gold: '💛', polaroid: '💫', left: '80%', top: '82%', size: 22, dur: '7s', del: '1s' },
  { boy: '✨', girl: '✨', peach: '✨', lavender: '✨', gold: '✨', polaroid: '🎉', left: '48%', top: '6%', size: 22, dur: '6.5s', del: '2.3s' },
  { boy: '🔥', girl: '🎀', peach: '🍰', lavender: '🌙', gold: '🔥', polaroid: '📸', left: '70%', top: '36%', size: 22, dur: '8s', del: '1.1s' },
  { boy: '🏆', girl: '🍰', peach: '⭐', lavender: '🍰', gold: '🏆', polaroid: '⚡', left: '16%', top: '92%', size: 24, dur: '8.5s', del: '0.4s' },
  { boy: '⭐', girl: '🌸', peach: '🍑', lavender: '🌸', gold: '⭐', polaroid: '⭐', left: '84%', top: '38%', size: 22, dur: '7s', del: '2.8s' },
  { boy: '🎊', girl: '🧸', peach: '🎊', lavender: '🧸', gold: '🎊', polaroid: '⭐', left: '38%', top: '89%', size: 24, dur: '9s', del: '1.7s' },
  { boy: '⚡', girl: '🍓', peach: '🧡', lavender: '🍓', gold: '⚡', polaroid: '✨', left: '58%', top: '72%', size: 20, dur: '7.5s', del: '2.1s' },
  { boy: '🚀', girl: '💌', peach: '💌', lavender: '💌', gold: '🚀', polaroid: '🔥', left: '94%', top: '26%', size: 24, dur: '9.2s', del: '0.6s' },
  { boy: '🧿', girl: '🌈', peach: '🌈', lavender: '🌈', gold: '🧿', polaroid: '💫', left: '32%', top: '50%', size: 24, dur: '7s', del: '1.3s' },
  { boy: '🦋', girl: '🦋', peach: '✨', lavender: '🦋', gold: '✨', polaroid: '🎉', left: '74%', top: '94%', size: 26, dur: '8s', del: '2.6s' },
  { boy: '✨', girl: '✨', peach: '✨', lavender: '✨', gold: '✨', polaroid: '📸', left: '6%', top: '32%', size: 20, dur: '8.2s', del: '0.3s' },
  { boy: '👑', girl: '👑', peach: '👑', lavender: '🔮', gold: '👑', polaroid: '⚡', left: '52%', top: '20%', size: 26, dur: '6.8s', del: '1.6s' },
];

const DEFAULT_BOY_REASONS = [
  { icon: '💪', title: 'Lucky to Have You', desc: 'So grateful to have a brother like you in my corner every day!' },
  { icon: '⭐', title: 'Always There', desc: 'Always standing by my side with endless laughs and genuine support!' },
  { icon: '👑', title: 'Irreplaceable', desc: 'No one can ever match your incredible spirit and heart. A true champion!' }
];

const DEFAULT_GIRL_REASONS = [
  { icon: '🌸', title: 'Pure Sunshine', desc: 'The effortless way you turn every ordinary moment into joy!' },
  { icon: '✨', title: 'Gentle Soul', desc: 'The quiet kindness and sparkling positivity you share with everyone!' },
  { icon: '💖', title: 'Irreplaceable', desc: 'A truly irreplaceable friend whose presence makes everything brighter!' }
];

const DEFAULT_PEACH_REASONS = [
  { icon: '🍑', title: 'Radiant Glow', desc: 'Your warm energy and golden smile brighten every room you walk into!' },
  { icon: '✨', title: 'Grace & Sparkle', desc: 'The effortless charm, elegance, and pure kindness you bring to every day!' },
  { icon: '👑', title: 'Truly Irreplaceable', desc: 'A princess of hearts whose warmth and positivity inspire everyone around!' }
];

const DEFAULT_LAVENDER_REASONS = [
  { icon: '💜', title: 'Dreamy Soul', desc: 'Your gentle spirit, artistic flair, and magical calm make life feel wondrous!' },
  { icon: '✨', title: 'Fairy Tale Kindness', desc: 'The quiet sweetness and comforting presence you gift to everyone you love!' },
  { icon: '🔮', title: 'One in a Million', desc: 'A rare and beautiful star whose dreams and creativity illuminate our world!' }
];

const DEFAULT_GOLD_REASONS = [
  { icon: '🌟', title: 'Golden Heart', desc: 'Your radiant kindness and golden energy brightens every room you step into!' },
  { icon: '🥂', title: 'Endless Cheers', desc: 'Every memory together feels like a grand celebration full of laughter and victory!' },
  { icon: '⭐', title: 'Pure Excellence', desc: 'You inspire everyone with your dedication, talent, and unforgettable charisma!' }
];

const DEFAULT_POLAROID_REASONS = [
  { icon: '🤝', title: 'Loyal Brotherhood', desc: 'Standing together through every laugh, victory, and unforgettable chapter!' },
  { icon: '⚡', title: 'Unmatched Energy', desc: 'From crazy ideas to unstoppable adventures, your vibe is completely one of a kind!' },
  { icon: '📸', title: 'Timeless Memories', desc: 'Every road trip, late-night chat, and memory taped forever into our story!' }
];

// Romance Theme Reasons
const DEFAULT_VELVET_REASONS = [
  { icon: '❤️', title: 'Endless Devotion', desc: 'Every day with you feels like a romantic dream that never ends.' },
  { icon: '🌹', title: 'Graceful Elegance', desc: 'Your warm touch, gentle smile, and loving heart make my world complete.' },
  { icon: '💫', title: 'My Forever', desc: 'You are my safe harbor, my greatest adventure, and my eternal love.' }
];

const DEFAULT_SUNSET_REASONS = [
  { icon: '🌅', title: 'Golden Warmth', desc: 'Watching the sunset with you makes time stop in the most magical way.' },
  { icon: '✨', title: 'Radiant Laughter', desc: 'Your smile brings a golden hue to the simplest everyday moments.' },
  { icon: '🧡', title: 'Warm Embrace', desc: 'In your arms is where I always feel completely at home and cherished.' }
];

const DEFAULT_CELESTIAL_REASONS = [
  { icon: '🌌', title: 'Written in the Stars', desc: 'Out of billions in this universe, finding you was my greatest miracle.' },
  { icon: '🌙', title: 'Infinite Calm', desc: 'Like the gentle moonlight, your love brings peace and calm to my soul.' },
  { icon: '⭐', title: 'My Guiding Star', desc: 'No matter how deep the night, your love always guides my path home.' }
];

// Scrapbook Theme Reasons
const DEFAULT_VINTAGE_REASONS = [
  { icon: '🎞️', title: 'Timeless Snapshots', desc: 'Every memory we capture becomes an instant classic in our story.' },
  { icon: '⚡', title: 'Candid Energy', desc: 'Unfiltered, raw, hilarious moments that keep getting better with time.' },
  { icon: '☕', title: 'Golden Chapters', desc: 'Years may pass, but our bond stays rich and warm like vintage film.' }
];

const DEFAULT_NEON_REASONS = [
  { icon: '⚡', title: 'High Voltage Energy', desc: 'Whenever you walk in, the excitement and positive vibe double instantly!' },
  { icon: '🔥', title: 'Fearless Spirit', desc: 'Always ready for spontaneous road trips, wild ideas, and big wins!' },
  { icon: '🩵', title: 'Pure Authenticity', desc: 'One hundred percent genuine, real, and always keeping it vibrant!' }
];

const DEFAULT_COZY_REASONS = [
  { icon: '☕', title: 'Warm Comfort', desc: 'Heart-to-heart chats over coffee that feel like a soothing warm blanket.' },
  { icon: '🌻', title: 'Simple Joys', desc: 'Appreciating the peaceful, quiet, precious moments that mean the most.' },
  { icon: '📖', title: 'Treasured Chapters', desc: 'Every memory we build together is etched in warm terracotta gold.' }
];

// Apology Theme Reasons
const DEFAULT_PEACE_REASONS = [
  { icon: '🕊️', title: 'Heartfelt Regret', desc: 'I am truly sorry from the bottom of my heart for hurting you.' },
  { icon: '🌿', title: 'Your Precious Peace', desc: 'Your happiness and peace of mind matter more to me than anything else.' },
  { icon: '💚', title: 'A New Understanding', desc: 'I promise to listen more, care deeper, and never take your bond for granted.' }
];

const DEFAULT_FORGIVE_REASONS = [
  { icon: '🥺', title: 'Miss Your Smile', desc: 'Nothing feels right without your laughter and sweet presence around.' },
  { icon: '💜', title: 'True Regret', desc: 'I made a genuine mistake, and I am so sorry for causing you any pain.' },
  { icon: '🧸', title: 'Warmest Hugs', desc: 'Sending you the biggest, gentlest hug hoping we can share a smile again.' }
];

const DEFAULT_SUNRISE_REASONS = [
  { icon: '🌤️', title: 'A Brighter Dawn', desc: 'Every sunrise brings an opportunity to start fresh, forgive, and grow stronger.' },
  { icon: '🌱', title: 'Growing Together', desc: 'Mistakes happen, but the strength of our bond is in how we overcome them.' },
  { icon: '💛', title: 'Golden Hope', desc: 'Looking forward with pure gratitude, hoping for smiles, warmth, and laughter.' }
];

export default function MultiSceneBirthdayView({ 
  siteData = {}, 
  onNavigateCreate: _onNavigateCreate,
  onBack: _onBack,
  onNavigate: _onNavigate
}) {
  const [scene, setScene] = useState(0);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Multi-Theme Awareness across all 4 occasions (Birthday, Romance, Scrapbook, Apology)
  const templateId = (siteData.templateId || (siteData.gender === 'girl' ? 'blush-rose' : 'royal-sapphire')).toLowerCase();

  // Romance themes
  const isVelvet = templateId.includes('velvet') || templateId === 'blush-romance';
  const isSunset = templateId.includes('sunset');
  const isCelestial = templateId.includes('celestial');

  // Scrapbook themes
  const isVintage = templateId.includes('kodak') || (templateId.includes('vintage') && !templateId.includes('scrapbook'));
  const isNeon = templateId.includes('neon');
  const isCozy = templateId.includes('cozy');
  const isPolaroid = !isVintage && !isNeon && !isCozy && (templateId.includes('polaroid') || templateId.includes('scrapbook'));

  // Apology themes
  const isPeace = templateId.includes('peace') || templateId.includes('olive') || templateId === 'heartfelt-apology';
  const isForgive = templateId.includes('forgive') || templateId.includes('sweet');
  const isSunrise = templateId.includes('sunrise') || templateId.includes('fresh') || templateId.includes('start');

  // Birthday themes
  const isPeach = !isSunrise && templateId.includes('peach');
  const isLavender = !isForgive && templateId.includes('lavender');
  const isGold = templateId.includes('gold');
  const isBlush = !isVelvet && !isPeach && !isLavender && !isGold && !isPolaroid && (templateId.includes('rose') || templateId.includes('blush') || siteData.gender === 'girl');
  const isRoyal = !isVelvet && !isSunset && !isCelestial && !isVintage && !isNeon && !isCozy && !isPeace && !isForgive && !isSunrise && !isPeach && !isLavender && !isGold && !isPolaroid && !isBlush;

  const isRomanceCategory = isVelvet || isSunset || isCelestial;
  const isScrapbookCategory = isVintage || isNeon || isCozy || isPolaroid;
  const isApologyCategory = isPeace || isForgive || isSunrise;

  // Font family determination
  // Princess Peach: Playfair Display serif (.font-serif)
  // All other themes: Dancing Script (.font-cursive)
  const fontFamilyClass = isPeach ? 'font-serif' : 'font-cursive';
  const handwritingClass = 'font-cursive';

  // Theme styling tokens mapping
  const themeTokens = (() => {
    // 1. Velvet Rose (Romance)
    if (isVelvet) {
      return {
        celebrationEmoji: '❤️',
        headingColorClass: 'text-rose-950',
        headingAccentClass: 'text-rose-600',
        cardClass: 'birthday-card-velvet',
        reasonCardClass: 'special-reason-card-velvet',
        reasonIconBgClass: 'bg-rose-50/90 border border-rose-100/80',
        reasonTitleClass: 'text-rose-950',
        primaryBtnClass: 'btn-primary-velvet',
        secondaryBtnClass: 'btn-secondary-velvet',
        coverBtnGradient: 'bg-gradient-to-r from-[#E11D48] via-[#BE123C] to-[#9F1239] hover:from-[#BE123C] hover:to-[#881337] shadow-rose-600/35 hover:shadow-rose-600/50 animate-pulse-glow-velvet',
        envelopeBgGradient: 'bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 border-rose-400/40',
        envelopeShading: 'bg-rose-950/60',
        envelopeCardBorder: 'border-rose-200',
        envelopeCardTitle: 'text-rose-900',
        envelopeFolds: { fold1: '#881337', fold2: '#9f1239', fold3: '#e11d48' },
        defaultWaxColor: '#E11D48',
        defaultSealEmoji: '❤️',
        openLetterBorder: 'border-rose-200/90',
        openLetterHeader: 'text-rose-950',
        signatureColorClass: 'text-rose-800',
        bgContainerOpen: 'bg-envelope-celebration-velvet',
        bgContainerClosed: 'bg-soft-aesthetic-velvet',
        confettiColors: ['#e11d48', '#f43f5e', '#fb7185', '#ffffff', '#ffd1dc'],
        defaultSignOffEmoji: '❤️🌹',
      };
    }

    // 2. Sunset Glow (Romance)
    if (isSunset) {
      return {
        celebrationEmoji: '✨',
        headingColorClass: 'text-amber-950',
        headingAccentClass: 'text-amber-600',
        cardClass: 'birthday-card-sunset',
        reasonCardClass: 'special-reason-card-sunset',
        reasonIconBgClass: 'bg-amber-50 border border-amber-200/80',
        reasonTitleClass: 'text-amber-950',
        primaryBtnClass: 'btn-primary-sunset',
        secondaryBtnClass: 'btn-secondary-sunset',
        coverBtnGradient: 'bg-gradient-to-r from-[#F59E0B] via-[#EA580C] to-[#C2410C] hover:from-[#EA580C] hover:to-[#9A3412] shadow-amber-500/35 hover:shadow-amber-500/50 animate-pulse-glow-sunset',
        envelopeBgGradient: 'bg-gradient-to-br from-amber-500 via-rose-500 to-amber-700 border-amber-300/40',
        envelopeShading: 'bg-amber-950/60',
        envelopeCardBorder: 'border-amber-200',
        envelopeCardTitle: 'text-amber-900',
        envelopeFolds: { fold1: '#9a3412', fold2: '#c2410c', fold3: '#f59e0b' },
        defaultWaxColor: '#F59E0B',
        defaultSealEmoji: '✨',
        openLetterBorder: 'border-amber-200/90',
        openLetterHeader: 'text-amber-950',
        signatureColorClass: 'text-amber-800',
        bgContainerOpen: 'bg-envelope-celebration-sunset',
        bgContainerClosed: 'bg-soft-aesthetic-sunset',
        confettiColors: ['#f59e0b', '#fbbf24', '#f43f5e', '#ffffff', '#fde68a'],
        defaultSignOffEmoji: '🌅✨',
      };
    }

    // 3. Celestial Indigo (Romance)
    if (isCelestial) {
      return {
        celebrationEmoji: '🌙',
        headingColorClass: 'text-indigo-950',
        headingAccentClass: 'text-indigo-600',
        cardClass: 'birthday-card-celestial',
        reasonCardClass: 'special-reason-card-celestial',
        reasonIconBgClass: 'bg-indigo-50 border border-indigo-200/80',
        reasonTitleClass: 'text-indigo-950',
        primaryBtnClass: 'btn-primary-celestial',
        secondaryBtnClass: 'btn-secondary-celestial',
        coverBtnGradient: 'bg-gradient-to-r from-[#6366F1] via-[#4F46E5] to-[#3730A3] hover:from-[#4F46E5] hover:to-[#312E81] shadow-indigo-600/35 hover:shadow-indigo-600/50 animate-pulse-glow-celestial',
        envelopeBgGradient: 'bg-gradient-to-br from-indigo-700 via-indigo-900 to-purple-950 border-indigo-400/40',
        envelopeShading: 'bg-indigo-950/60',
        envelopeCardBorder: 'border-indigo-200',
        envelopeCardTitle: 'text-indigo-900',
        envelopeFolds: { fold1: '#312e81', fold2: '#3730a3', fold3: '#4f46e5' },
        defaultWaxColor: '#4F46E5',
        defaultSealEmoji: '🌙',
        openLetterBorder: 'border-indigo-200/90',
        openLetterHeader: 'text-indigo-950',
        signatureColorClass: 'text-indigo-800',
        bgContainerOpen: 'bg-envelope-celebration-celestial',
        bgContainerClosed: 'bg-soft-aesthetic-celestial',
        confettiColors: ['#6366f1', '#818cf8', '#a5b4fc', '#ffffff', '#38bdf8'],
        defaultSignOffEmoji: '🌌🌙',
      };
    }

    // 4. Vintage Kodak (Scrapbook)
    if (isVintage) {
      return {
        celebrationEmoji: '📸',
        headingColorClass: 'text-amber-950',
        headingAccentClass: 'text-amber-700',
        cardClass: 'birthday-card-vintage',
        reasonCardClass: 'special-reason-card-vintage',
        reasonIconBgClass: 'bg-amber-50 border border-amber-200/80',
        reasonTitleClass: 'text-amber-950',
        primaryBtnClass: 'btn-primary-vintage',
        secondaryBtnClass: 'btn-secondary-vintage',
        coverBtnGradient: 'bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#92400E] hover:from-[#B45309] hover:to-[#78350F] shadow-amber-600/35 hover:shadow-amber-600/50 animate-pulse-glow-vintage',
        envelopeBgGradient: 'bg-gradient-to-br from-amber-700 via-yellow-700 to-amber-900 border-amber-300/40',
        envelopeShading: 'bg-amber-950/60',
        envelopeCardBorder: 'border-amber-200',
        envelopeCardTitle: 'text-amber-900',
        envelopeFolds: { fold1: '#78350f', fold2: '#92400e', fold3: '#d97706' },
        defaultWaxColor: '#D97706',
        defaultSealEmoji: '⚡',
        openLetterBorder: 'border-amber-200/90',
        openLetterHeader: 'text-amber-950',
        signatureColorClass: 'text-amber-800',
        bgContainerOpen: 'bg-envelope-celebration-vintage',
        bgContainerClosed: 'bg-soft-aesthetic-vintage',
        confettiColors: ['#d97706', '#b45309', '#f59e0b', '#ffffff', '#fef3c7'],
        defaultSignOffEmoji: '📸⚡',
      };
    }

    // 5. Electric Vibes (Scrapbook)
    if (isNeon) {
      return {
        celebrationEmoji: '⚡',
        headingColorClass: 'text-teal-950',
        headingAccentClass: 'text-teal-600',
        cardClass: 'birthday-card-neon',
        reasonCardClass: 'special-reason-card-neon',
        reasonIconBgClass: 'bg-teal-50 border border-teal-200/80',
        reasonTitleClass: 'text-teal-950',
        primaryBtnClass: 'btn-primary-neon',
        secondaryBtnClass: 'btn-secondary-neon',
        coverBtnGradient: 'bg-gradient-to-r from-[#14B8A6] via-[#0D9488] to-[#0F766E] hover:from-[#0D9488] hover:to-[#115E59] shadow-teal-600/35 hover:shadow-teal-600/50 animate-pulse-glow-neon',
        envelopeBgGradient: 'bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-800 border-cyan-300/40',
        envelopeShading: 'bg-teal-950/60',
        envelopeCardBorder: 'border-teal-200',
        envelopeCardTitle: 'text-teal-900',
        envelopeFolds: { fold1: '#134e4a', fold2: '#115e59', fold3: '#0d9488' },
        defaultWaxColor: '#0D9488',
        defaultSealEmoji: '🔥',
        openLetterBorder: 'border-teal-200/90',
        openLetterHeader: 'text-teal-950',
        signatureColorClass: 'text-teal-800',
        bgContainerOpen: 'bg-envelope-celebration-neon',
        bgContainerClosed: 'bg-soft-aesthetic-neon',
        confettiColors: ['#14b8a6', '#06b6d4', '#3b82f6', '#ffffff', '#facc15'],
        defaultSignOffEmoji: '⚡🔥',
      };
    }

    // 6. Cozy Sunset (Scrapbook)
    if (isCozy) {
      return {
        celebrationEmoji: '🌻',
        headingColorClass: 'text-orange-950',
        headingAccentClass: 'text-orange-700',
        cardClass: 'birthday-card-cozy',
        reasonCardClass: 'special-reason-card-cozy',
        reasonIconBgClass: 'bg-orange-50 border border-orange-200/80',
        reasonTitleClass: 'text-orange-950',
        primaryBtnClass: 'btn-primary-cozy',
        secondaryBtnClass: 'btn-secondary-cozy',
        coverBtnGradient: 'bg-gradient-to-r from-[#EA580C] via-[#C2410C] to-[#9A3412] hover:from-[#C2410C] hover:to-[#7C2D12] shadow-orange-600/35 hover:shadow-orange-600/50 animate-pulse-glow-cozy',
        envelopeBgGradient: 'bg-gradient-to-br from-orange-700 via-amber-800 to-amber-950 border-orange-400/40',
        envelopeShading: 'bg-amber-950/60',
        envelopeCardBorder: 'border-orange-200',
        envelopeCardTitle: 'text-orange-900',
        envelopeFolds: { fold1: '#7c2d12', fold2: '#9a3412', fold3: '#c2410c' },
        defaultWaxColor: '#C2410C',
        defaultSealEmoji: '🌻',
        openLetterBorder: 'border-orange-200/90',
        openLetterHeader: 'text-orange-950',
        signatureColorClass: 'text-orange-800',
        bgContainerOpen: 'bg-envelope-celebration-cozy',
        bgContainerClosed: 'bg-soft-aesthetic-cozy',
        confettiColors: ['#ea580c', '#c2410c', '#f59e0b', '#ffffff', '#fed7aa'],
        defaultSignOffEmoji: '☕🌻',
      };
    }

    // 7. Olive Peace (Apology)
    if (isPeace) {
      return {
        celebrationEmoji: '🕊️',
        headingColorClass: 'text-emerald-950',
        headingAccentClass: 'text-emerald-700',
        cardClass: 'birthday-card-olive',
        reasonCardClass: 'special-reason-card-olive',
        reasonIconBgClass: 'bg-emerald-50 border border-emerald-200/80',
        reasonTitleClass: 'text-emerald-950',
        primaryBtnClass: 'btn-primary-olive',
        secondaryBtnClass: 'btn-secondary-olive',
        coverBtnGradient: 'bg-gradient-to-r from-[#16A34A] via-[#15803D] to-[#14532D] hover:from-[#15803D] hover:to-[#052E16] shadow-emerald-600/35 hover:shadow-emerald-600/50 animate-pulse-glow-olive',
        envelopeBgGradient: 'bg-gradient-to-br from-emerald-600 via-green-700 to-emerald-900 border-emerald-300/40',
        envelopeShading: 'bg-emerald-950/60',
        envelopeCardBorder: 'border-emerald-200',
        envelopeCardTitle: 'text-emerald-900',
        envelopeFolds: { fold1: '#14532d', fold2: '#166534', fold3: '#15803d' },
        defaultWaxColor: '#15803D',
        defaultSealEmoji: '🕊️',
        openLetterBorder: 'border-emerald-200/90',
        openLetterHeader: 'text-emerald-950',
        signatureColorClass: 'text-emerald-800',
        bgContainerOpen: 'bg-envelope-celebration-olive',
        bgContainerClosed: 'bg-soft-aesthetic-olive',
        confettiColors: ['#16a34a', '#22c55e', '#86efac', '#ffffff', '#dcfce7'],
        defaultSignOffEmoji: '🕊️💚',
      };
    }

    // 8. Sweet Hugs (Apology)
    if (isForgive) {
      return {
        celebrationEmoji: '💜',
        headingColorClass: 'text-purple-950',
        headingAccentClass: 'text-purple-600',
        cardClass: 'birthday-card-forgive',
        reasonCardClass: 'special-reason-card-forgive',
        reasonIconBgClass: 'bg-purple-50 border border-purple-200/80',
        reasonTitleClass: 'text-purple-950',
        primaryBtnClass: 'btn-primary-forgive',
        secondaryBtnClass: 'btn-secondary-forgive',
        coverBtnGradient: 'bg-gradient-to-r from-[#A855F7] via-[#8B5CF6] to-[#7C3AED] hover:from-[#8B5CF6] hover:to-[#6D28D9] shadow-purple-600/35 hover:shadow-purple-600/50 animate-pulse-glow-forgive',
        envelopeBgGradient: 'bg-gradient-to-br from-purple-600 via-pink-600 to-violet-800 border-purple-300/40',
        envelopeShading: 'bg-purple-950/60',
        envelopeCardBorder: 'border-purple-200',
        envelopeCardTitle: 'text-purple-900',
        envelopeFolds: { fold1: '#581c87', fold2: '#7c3aed', fold3: '#8b5cf6' },
        defaultWaxColor: '#8B5CF6',
        defaultSealEmoji: '💜',
        openLetterBorder: 'border-purple-200/90',
        openLetterHeader: 'text-purple-950',
        signatureColorClass: 'text-purple-800',
        bgContainerOpen: 'bg-envelope-celebration-forgive',
        bgContainerClosed: 'bg-soft-aesthetic-forgive',
        confettiColors: ['#a855f7', '#c084fc', '#e879f9', '#ffffff', '#f3e8ff'],
        defaultSignOffEmoji: '🥺💜',
      };
    }

    // 9. Sunrise Renewal (Apology)
    if (isSunrise) {
      return {
        celebrationEmoji: '🌤️',
        headingColorClass: 'text-amber-950',
        headingAccentClass: 'text-amber-600',
        cardClass: 'birthday-card-sunrise',
        reasonCardClass: 'special-reason-card-sunrise',
        reasonIconBgClass: 'bg-amber-50 border border-amber-200/80',
        reasonTitleClass: 'text-amber-950',
        primaryBtnClass: 'btn-primary-sunrise',
        secondaryBtnClass: 'btn-secondary-sunrise',
        coverBtnGradient: 'bg-gradient-to-r from-[#EAB308] via-[#CA8A04] to-[#A16207] hover:from-[#CA8A04] hover:to-[#713F12] shadow-amber-500/35 hover:shadow-amber-500/50 animate-pulse-glow-sunrise',
        envelopeBgGradient: 'bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 border-yellow-300/40',
        envelopeShading: 'bg-amber-950/60',
        envelopeCardBorder: 'border-amber-200',
        envelopeCardTitle: 'text-amber-900',
        envelopeFolds: { fold1: '#92400e', fold2: '#b45309', fold3: '#d97706' },
        defaultWaxColor: '#D97706',
        defaultSealEmoji: '🌤️',
        openLetterBorder: 'border-amber-200/90',
        openLetterHeader: 'text-amber-950',
        signatureColorClass: 'text-amber-800',
        bgContainerOpen: 'bg-envelope-celebration-sunrise',
        bgContainerClosed: 'bg-soft-aesthetic-sunrise',
        confettiColors: ['#eab308', '#facc15', '#fef08a', '#ffffff', '#fed7aa'],
        defaultSignOffEmoji: '🌤️💛',
      };
    }

    // 10. Princess Peach (Birthday)
    if (isPeach) {
      return {
        celebrationEmoji: '✨',
        headingColorClass: 'text-orange-950',
        headingAccentClass: 'text-orange-600',
        cardClass: 'birthday-card-peach',
        reasonCardClass: 'special-reason-card-peach',
        reasonIconBgClass: 'bg-orange-50/90 border border-orange-100/80',
        reasonTitleClass: 'text-orange-950',
        primaryBtnClass: 'btn-primary-peach',
        secondaryBtnClass: 'btn-secondary-peach',
        coverBtnGradient: 'bg-gradient-to-r from-[#FB923C] via-[#F97316] to-[#EA580C] hover:from-[#F97316] hover:to-[#C2410C] shadow-orange-600/35 hover:shadow-orange-600/50 animate-pulse-glow-peach',
        envelopeBgGradient: 'bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 border-orange-300/40',
        envelopeShading: 'bg-orange-950/60',
        envelopeCardBorder: 'border-orange-200',
        envelopeCardTitle: 'text-orange-900',
        envelopeFolds: { fold1: '#c2410c', fold2: '#ea580c', fold3: '#f97316' },
        defaultWaxColor: '#EA580C',
        defaultSealEmoji: '✨',
        openLetterBorder: 'border-orange-100/90',
        openLetterHeader: 'text-orange-900',
        signatureColorClass: 'text-orange-800',
        bgContainerOpen: 'bg-envelope-celebration-peach',
        bgContainerClosed: 'bg-soft-aesthetic-peach',
        confettiColors: ['#fb923c', '#f97316', '#f59e0b', '#fbbf24', '#f43f5e', '#fed7aa', '#ffffff'],
        defaultSignOffEmoji: '✨🧡',
      };
    }

    // 11. Lavender Dream (Birthday)
    if (isLavender) {
      return {
        celebrationEmoji: '💜',
        headingColorClass: 'text-purple-950',
        headingAccentClass: 'text-purple-600',
        cardClass: 'birthday-card-lavender',
        reasonCardClass: 'special-reason-card-lavender',
        reasonIconBgClass: 'bg-purple-50/90 border border-purple-100/80',
        reasonTitleClass: 'text-purple-950',
        primaryBtnClass: 'btn-primary-lavender',
        secondaryBtnClass: 'btn-secondary-lavender',
        coverBtnGradient: 'bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#7C3AED] hover:from-[#8B5CF6] hover:to-[#6D28D9] shadow-purple-600/35 hover:shadow-purple-600/50 animate-pulse-glow-lavender',
        envelopeBgGradient: 'bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-900 border-purple-400/40',
        envelopeShading: 'bg-purple-950/60',
        envelopeCardBorder: 'border-purple-200',
        envelopeCardTitle: 'text-purple-900',
        envelopeFolds: { fold1: '#6b21a8', fold2: '#7e22ce', fold3: '#9333ea' },
        defaultWaxColor: '#9333EA',
        defaultSealEmoji: '💜',
        openLetterBorder: 'border-purple-100/90',
        openLetterHeader: 'text-purple-900',
        signatureColorClass: 'text-purple-800',
        bgContainerOpen: 'bg-envelope-celebration-lavender',
        bgContainerClosed: 'bg-soft-aesthetic-lavender',
        confettiColors: ['#c084fc', '#a855f7', '#818cf8', '#6366f1', '#e879f9', '#f472b6', '#ffffff'],
        defaultSignOffEmoji: '💜✨',
      };
    }

    // 12. Golden Spark (Birthday)
    if (isGold) {
      return {
        celebrationEmoji: '🎂',
        headingColorClass: 'text-slate-900',
        headingAccentClass: 'text-amber-500',
        cardClass: 'birthday-card-gold',
        reasonCardClass: 'special-reason-card-gold',
        reasonIconBgClass: 'bg-amber-50 border border-amber-200/80',
        reasonTitleClass: 'text-slate-900',
        primaryBtnClass: 'btn-primary-gold',
        secondaryBtnClass: 'btn-secondary-gold',
        coverBtnGradient: 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 shadow-amber-500/35 hover:shadow-amber-500/45 animate-pulse-glow-gold',
        envelopeBgGradient: 'bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 border-amber-300/50',
        envelopeShading: 'bg-amber-950/60',
        envelopeCardBorder: 'border-amber-200',
        envelopeCardTitle: 'text-amber-900',
        envelopeFolds: { fold1: '#92400e', fold2: '#b45309', fold3: '#d97706' },
        defaultWaxColor: '#D97706',
        defaultSealEmoji: '⭐',
        openLetterBorder: 'border-amber-200/90',
        openLetterHeader: 'text-amber-900',
        signatureColorClass: 'text-amber-800',
        bgContainerOpen: 'bg-envelope-celebration-gold',
        bgContainerClosed: 'bg-soft-aesthetic-gold',
        confettiColors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff', '#38bdf8'],
        defaultSignOffEmoji: '🎂⭐',
      };
    }

    // 13. Retro Polaroid (Scrapbook/Birthday)
    if (isPolaroid) {
      return {
        celebrationEmoji: '📸',
        headingColorClass: 'text-slate-900',
        headingAccentClass: 'text-rose-600',
        cardClass: 'birthday-card-polaroid',
        reasonCardClass: 'special-reason-card-polaroid',
        reasonIconBgClass: 'bg-rose-50 border border-rose-200/80',
        reasonTitleClass: 'text-slate-900',
        primaryBtnClass: 'btn-primary-polaroid',
        secondaryBtnClass: 'btn-secondary-polaroid',
        coverBtnGradient: 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-800 shadow-rose-600/30 hover:shadow-rose-600/45 animate-pulse-glow-polaroid',
        envelopeBgGradient: 'bg-gradient-to-br from-rose-700 via-red-700 to-rose-900 border-rose-400/50',
        envelopeShading: 'bg-rose-950/60',
        envelopeCardBorder: 'border-rose-200/80',
        envelopeCardTitle: 'text-rose-950',
        envelopeFolds: { fold1: '#881337', fold2: '#9f1239', fold3: '#e11d48' },
        defaultWaxColor: '#E11D48',
        defaultSealEmoji: '⚡',
        openLetterBorder: 'border-rose-200/80',
        openLetterHeader: 'text-rose-950',
        signatureColorClass: 'text-rose-800',
        bgContainerOpen: 'bg-envelope-celebration-polaroid',
        bgContainerClosed: 'bg-soft-aesthetic-polaroid',
        confettiColors: ['#e11d48', '#f43f5e', '#fb7185', '#ffffff', '#f59e0b'],
        defaultSignOffEmoji: '📸⚡',
      };
    }

    // 14. Blush Blossom (Birthday)
    if (isBlush) {
      return {
        celebrationEmoji: '🌸',
        headingColorClass: 'text-rose-950',
        headingAccentClass: 'text-rose-600',
        cardClass: 'birthday-card-girl',
        reasonCardClass: 'special-reason-card-girl',
        reasonIconBgClass: 'bg-rose-50/90 border border-rose-100/80',
        reasonTitleClass: 'text-rose-950',
        primaryBtnClass: 'btn-primary-rose',
        secondaryBtnClass: 'btn-secondary-rose',
        coverBtnGradient: 'bg-gradient-to-r from-[#F43F5E] via-[#E11D48] to-[#BE123C] hover:from-[#E11D48] hover:to-[#9F1239] shadow-rose-600/35 hover:shadow-rose-600/50 animate-pulse-glow-rose',
        envelopeBgGradient: 'bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800 border-rose-400/40',
        envelopeShading: 'bg-rose-900/60',
        envelopeCardBorder: 'border-rose-200',
        envelopeCardTitle: 'text-rose-900',
        envelopeFolds: { fold1: '#be123c', fold2: '#e11d48', fold3: '#f43f5e' },
        defaultWaxColor: '#E11D48',
        defaultSealEmoji: '🌸',
        openLetterBorder: 'border-rose-100/90',
        openLetterHeader: 'text-rose-900',
        signatureColorClass: 'text-rose-800',
        bgContainerOpen: 'bg-envelope-celebration-girl',
        bgContainerClosed: 'bg-soft-aesthetic-girl',
        confettiColors: ['#f43f5e', '#fb7185', '#f59e0b', '#fbbf24', '#ec4899', '#f472b6', '#a855f7', '#ffffff'],
        defaultSignOffEmoji: '🌸❤️',
      };
    }

    // 15. Royal Sapphire (Birthday default / boy)
    return {
      isRoyal,
      celebrationEmoji: '👑',
      headingColorClass: 'text-blue-950',
      headingAccentClass: 'text-blue-700',
      cardClass: 'birthday-card',
      reasonCardClass: 'special-reason-card',
      reasonIconBgClass: 'bg-blue-50/90 border border-blue-100/80',
      reasonTitleClass: 'text-blue-950',
      primaryBtnClass: 'btn-primary-blue',
      secondaryBtnClass: 'btn-secondary',
      coverBtnGradient: 'bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] hover:from-[#1D4ED8] hover:to-[#1E3A8A] shadow-blue-600/35 hover:shadow-blue-600/50 animate-pulse-glow',
      envelopeBgGradient: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-blue-400/40',
      envelopeShading: 'bg-blue-900/60',
      envelopeCardBorder: 'border-blue-200',
      envelopeCardTitle: 'text-blue-900',
      envelopeFolds: { fold1: '#1e40af', fold2: '#1d4ed8', fold3: '#2563eb' },
      defaultWaxColor: '#1D4ED8',
      defaultSealEmoji: '👑',
      openLetterBorder: 'border-blue-100/90',
      openLetterHeader: 'text-blue-900',
      signatureColorClass: 'text-blue-800',
      bgContainerOpen: 'bg-envelope-celebration',
      bgContainerClosed: 'bg-soft-aesthetic',
      confettiColors: ['#3b82f6', '#60a5fa', '#f59e0b', '#fbbf24', '#ef4444', '#10b981', '#ec4899', '#8b5cf6', '#ffffff'],
      defaultSignOffEmoji: '🧿❤️',
    };
  })();

  // Floating emoji selector based on active theme
  const themeFloatingEmojis = isVelvet
    ? ['❤️', '🌹', '✨', '🍷', '💫', '💖', '💌', '🥀']
    : isSunset
    ? ['🌅', '✨', '🧡', '🌇', '💫', '💛', '💌', '🥂']
    : isCelestial
    ? ['🌌', '🌙', '⭐', '✨', '💫', '🔮', '💙', '🪐']
    : isVintage
    ? ['📸', '⚡', '🎞️', '⭐', '📼', '☕', '🔥', '✨']
    : isNeon
    ? ['⚡', '🔥', '🩵', '🛹', '✨', '💿', '💫', '🎉']
    : isCozy
    ? ['☕', '🌻', '🍂', '🤎', '✨', '📖', '💫', '🌅']
    : isPeace
    ? ['🕊️', '🌿', '🍃', '💚', '✨', '🤍', '💫', '🌸']
    : isForgive
    ? ['🥺', '💜', '🌸', '🧸', '✨', '💌', '💫', '🤍']
    : isSunrise
    ? ['🌤️', '☀️', '🌻', '💛', '✨', '🌈', '💫', '🌱']
    : null;

  const getFloatingEmoji = (e, index = 0) => {
    if (themeFloatingEmojis) return themeFloatingEmojis[index % themeFloatingEmojis.length];
    if (isPolaroid) return e.polaroid || '📸';
    if (isPeach) return e.peach || e.girl;
    if (isLavender) return e.lavender || e.girl;
    if (isGold) return e.gold || '✨';
    if (isBlush) return e.girl;
    return e.boy;
  };

  // Personalization data with neutral defaults
  const isGirlGender = siteData.gender === 'girl' || isBlush || isPeach || isLavender || isVelvet || isSunset || isCelestial || isPeace || isForgive || isSunrise;
  const recipientName = siteData.recipientName || (isGirlGender ? 'Sarah' : 'Rohan');
  const senderName = siteData.senderName || (isGirlGender ? 'Elena' : 'Alex');
  const subtitle = siteData.subtitle || 'I have a small surprise for you...';
  
  const rawOccasion = (siteData.occasion || '').trim();
  const nameToDisplay = (siteData.recipientName || '').trim() || recipientName;
  const celebrationEmoji = themeTokens.celebrationEmoji;

  let line1Text = '';
  let line2Text = '';

  if (rawOccasion) {
    if (rawOccasion.includes(',')) {
      const commaIdx = rawOccasion.indexOf(',');
      line1Text = rawOccasion.slice(0, commaIdx + 1).trim();
      const remainder = rawOccasion.slice(commaIdx + 1).trim();
      line2Text = remainder || `${nameToDisplay}! ${celebrationEmoji}`;
    } else {
      line1Text = `${rawOccasion},`;
      line2Text = `${nameToDisplay}! ${celebrationEmoji}`;
    }
  } else {
    if (isRomanceCategory) {
      line1Text = 'With All My Love,';
    } else if (isScrapbookCategory && !isPolaroid) {
      line1Text = 'Cherished Memories,';
    } else if (isApologyCategory) {
      line1Text = 'From My Heart,';
    } else {
      line1Text = 'Happy Birthday,';
    }
    line2Text = `${nameToDisplay}! ${celebrationEmoji}`;
  }
  
  const photoUrl = siteData.heroPhoto || 
                   siteData.photos?.[0]?.url || 
                   (isGirlGender 
                     ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' 
                     : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80');

  const photoCaption = siteData.photoCaption || (() => {
    if (isVelvet) return "Forever in My Heart ❤️🌹";
    if (isSunset) return "Golden Moments With You 🌅✨";
    if (isCelestial) return "Written in the Stars 🌌🌙";
    if (isVintage) return "Captured Moments Never Fade 📸🎞️";
    if (isNeon) return "Electric Memories & Good Times ⚡🔥";
    if (isCozy) return "Warm Days & Sweet Conversations ☕🌻";
    if (isPeace) return "Peace, Love & Healing 🕊️🌿";
    if (isForgive) return "Sending the Warmest Hugs 🥺💜";
    if (isSunrise) return "Here is to a Fresh Beginning 🌤️🌱";
    if (isPeach) return "Shining with Pure Warmth & Grace! ✨🍑";
    if (isLavender) return "Dreamy, Radiant & Magical Always! 💜✨";
    if (isGold) return "Golden Spark & Boundless Joy! 🎂✨";
    if (isPolaroid) return "Brothers & Besties For Life! 📸⚡";
    if (isBlush) return "Stay Wonderful Always! 🌸✨";
    return "Keep Rocking Always! 👑🔥";
  })();

  const defaultReasons = isVelvet
    ? DEFAULT_VELVET_REASONS
    : isSunset
    ? DEFAULT_SUNSET_REASONS
    : isCelestial
    ? DEFAULT_CELESTIAL_REASONS
    : isVintage
    ? DEFAULT_VINTAGE_REASONS
    : isNeon
    ? DEFAULT_NEON_REASONS
    : isCozy
    ? DEFAULT_COZY_REASONS
    : isPeace
    ? DEFAULT_PEACE_REASONS
    : isForgive
    ? DEFAULT_FORGIVE_REASONS
    : isSunrise
    ? DEFAULT_SUNRISE_REASONS
    : (isPeach 
      ? DEFAULT_PEACH_REASONS 
      : (isLavender 
        ? DEFAULT_LAVENDER_REASONS 
        : (isGold 
          ? DEFAULT_GOLD_REASONS 
          : (isPolaroid
            ? DEFAULT_POLAROID_REASONS
            : (isBlush ? DEFAULT_GIRL_REASONS : DEFAULT_BOY_REASONS)))));

  const reasons = siteData.reasons || 
                  siteData.specialReasons || 
                  defaultReasons;

  // Letter content
  const letterTitle = siteData.letter?.title || siteData.letterTitle || (isRomanceCategory ? 'A Love Note For You' : (isApologyCategory ? 'From My Heart' : 'A Little Note For You'));
  const defaultLetter = isVelvet
    ? `Dear ${recipientName},\n\nEvery day with you feels like a dream I never want to wake up from. Your gentle touch, beautiful laughter, and caring heart are the greatest gifts of my life. ❤️🌹\n\nThank you for loving me and being my forever companion. May our love continue to blossom with timeless passion and sweet romance. Forever yours.`
    : isSunset
    ? `Dear ${recipientName},\n\nWatching the sunset by your side is my favorite place in the world. You bring a golden glow, peaceful warmth, and endless joy to my life. 🌅✨\n\nThank you for every shared laugh and tender moment. Here's to countless more golden sunsets together!`
    : isCelestial
    ? `Dear ${recipientName},\n\nOut of all the stars in the universe, you are the one that shines brightest in my heart. Being with you feels like destiny written in the cosmos. 🌌🌙\n\nThank you for guiding my path with your endless love, gentle calm, and pure soul. I love you to the moon and beyond all galaxies!`
    : isVintage
    ? `Dear ${recipientName},\n\nLooking through all our snapshots and golden memories, I can't help but smile at how incredible our journey has been. Every laugh, road trip, and spontaneous moment is treasured forever. 📸🎞️\n\nThank you for being such a real and loyal companion. Here's to making many more timeless memories!`
    : isNeon
    ? `Dear ${recipientName},\n\nLife with you is pure electric energy! From spontaneous adventures to late-night laughs, every moment is packed with high voltage hype and good vibes. ⚡🔥\n\nThank you for always keeping things vibrant and genuine. Stay electric and keep rocking!`
    : isCozy
    ? `Dear ${recipientName},\n\nThank you for the warm comfort, peaceful talks, and sweet memories we've shared. Sitting together with good coffee and honest conversations is one of life's greatest pleasures. ☕🌻\n\nHere's to many more peaceful, golden afternoons and cherished memories together!`
    : isPeace
    ? `Dear ${recipientName},\n\nI want to apologize to you sincerely from the bottom of my heart. Seeing you hurt breaks my spirit, and I deeply regret my words and actions. 🕊️🌿\n\nYour happiness and peace of mind mean the world to me. I hope you can find it in your heart to forgive me so we can heal and start anew.`
    : isForgive
    ? `Dear ${recipientName},\n\nI am so genuinely sorry for my mistake. Nothing feels right without your sweet smile, laughter, and warmth around. 🥺💜\n\nI value our connection more than words can say. Sending you the warmest hug and hoping we can smile together again soon.`
    : isSunrise
    ? `Dear ${recipientName},\n\nEvery sunrise is a chance to heal, learn, and grow closer. I am so sorry for where things went wrong between us. 🌤️🌱\n\nOur bond means everything to me, and I promise to cherish and protect it with greater care. Here's to hope, renewal, and a brighter tomorrow together.`
    : (isPeach
      ? `Happy Birthday, ${recipientName}!\n\nYou bring a radiant warmth, golden sunshine, and beautiful energy wherever you go. Your smile lights up every room, and you make every ordinary day feel like something magical.\n\nMay this year unfold with sweet laughter, wonderful new adventures, and all the happiest moments your heart can hold. Stay glorious! ✨🍑`
      : (isLavender
        ? `Happy Birthday, ${recipientName}!\n\nYou possess such a dreamy spirit, creative wonder, and comforting kindness. Being in your presence feels like a breath of fresh lilac and pure calm.\n\nMay this year grant you your most cherished wishes, endless inspiration, and moments full of starlight and joy. Keep dreaming wonderfully! 💜✨`
        : (isGold
          ? `Happy Birthday, ${recipientName}!\n\nToday we celebrate a heart of pure gold. Your generosity, infectious laughter, and bright spirit illuminate the paths of everyone around you.\n\nMay your year ahead be crowned with grand triumphs, blissful memories, and radiant good health! 🎂✨`
          : (isPolaroid
            ? `Happy Birthday, ${recipientName}!\n\nLooking back at every snapshot, adventure, and late-night laugh, I'm so grateful for our brotherhood and all the memories we share. You bring unmatched loyalty, real energy, and genuine warmth into every day.\n\nMay this year bring you all the grand achievements, unforgettable memories, and boundless happiness you deserve. Keep rocking, brother! 📸⚡`
            : (isBlush
              ? `Happy Birthday, ${recipientName}!\n\nYou bring so much elegance, warmth, and sparkling wonder wherever you go. Your kind soul touches everyone you meet, and you make ordinary days feel truly unforgettable.\n\nMay this year bring you all the sweetest dreams, vibrant laughter, and boundless happiness you deserve so deeply.`
              : `Happy Birthday, ${recipientName}!\n\nYou bring so much energy, strength, and genuine happiness into the lives of everyone around you. Thank you for being someone I can always look up to and trust unconditionally.\n\nMay this year bring you all the grand achievements, good health, and joyful moments you deserve. Keep shining like a king! 👑✨`)))));

  const letterBody = (typeof siteData.letter === 'object' ? siteData.letter?.content : siteData.letter) || 
                     siteData.letterBody || 
                     defaultLetter;
  const letterSignOff = (typeof siteData.letter === 'object' && siteData.letter?.signOff) || siteData.letterSignOff || `With love, ${senderName} ${themeTokens.defaultSignOffEmoji}`;
  const letterSealEmoji = (typeof siteData.letter === 'object' && siteData.letter?.sealEmoji) || siteData.sealEmoji || themeTokens.defaultSealEmoji;
  const letterWaxColor = (typeof siteData.letter === 'object' && siteData.letter?.waxColor) || siteData.waxColor || themeTokens.defaultWaxColor;

  // Audio track URL
  const audioUrl = siteData.songId === 'silent-mode'
    ? ''
    : (siteData.songUrl || 
       siteData.customSongUrl || 
       siteData.audioUrl || 
       siteData.music?.audioUrl || 
       (siteData.songId ? getSongById(siteData.songId, siteData)?.audioUrl : null) ||
       'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=acoustic-guitar-love-story-112345.mp3');

  // Multi-angle Confetti Cannon helper from reference site
  const triggerConfettiCannon = () => {
    const colors = themeTokens.confettiColors;

    try {
      // Stage 1: Dual center bursts
      confetti({
        particleCount: 70,
        spread: 60,
        startVelocity: 50,
        origin: { x: 0.5, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 60,
        spread: 110,
        decay: 0.9,
        scalar: 0.9,
        origin: { x: 0.5, y: 0.65 },
        colors,
      });

      // Stage 2: Left and right cannons
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 75,
          startVelocity: 55,
          origin: { x: 0.05, y: 0.8 },
          colors,
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 75,
          startVelocity: 55,
          origin: { x: 0.95, y: 0.8 },
          colors,
        });
      }, 180);

      // Stage 3: Top cascading fall
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 90,
          origin: { x: 0.5, y: 0.4 },
          gravity: 0.8,
          scalar: 1.1,
          colors,
        });
      }, 420);
    } catch {}
  };

  const handleOpenCover = () => {
    soundEffects.playCelebration();
    triggerConfettiCannon();
    if (audioRef.current && audioUrl && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
    setScene(1);
  };

  const handleNextFromPhoto = () => {
    soundEffects.playPop();
    triggerConfettiCannon();
    setScene(2);
  };

  const handleChooseFeeling = () => {
    soundEffects.playCelebration();
    triggerConfettiCannon();
    setScene(3);
  };

  const handleNextFromReasons = () => {
    soundEffects.playPop();
    triggerConfettiCannon();
    setScene(4);
  };

  const handleOpenEnvelope = () => {
    soundEffects.playSealBreak();
    triggerConfettiCannon();
    setIsEnvelopeOpen(true);
  };

  const handleCloseEnvelope = (e) => {
    e?.stopPropagation();
    soundEffects.playPop();
    setIsEnvelopeOpen(false);
  };

  // Scroll to top on scene change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scene, isEnvelopeOpen]);

  const isCelebrationBg = scene === 4 && isEnvelopeOpen;
  const containerBgClass = isCelebrationBg ? themeTokens.bgContainerOpen : themeTokens.bgContainerClosed;

  // Modern Luxury Squircle Button Classes with min-h-[44px] touch targets
  const backBtnClass = "inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs hover:shadow-md text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer min-h-[44px]";

  const primaryBtnClass = `inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer ${themeTokens.primaryBtnClass} min-h-[44px]`;

  const secondaryBtnClass = `inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer ${themeTokens.secondaryBtnClass} min-h-[44px]`;

  return (
    <div className={`relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-8 overflow-x-hidden transition-colors duration-700 ${containerBgClass}`}>
      
      {/* Background HTML5 Audio Element */}
      {audioUrl ? (
        <audio
          key={audioUrl}
          ref={audioRef}
          src={audioUrl}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : null}

      {/* 18 Floating Ambient Apple Emojis calibrated to active theme */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
        {FLOATING_EMOJIS_DEF.map((e, idx) => (
          <div
            key={idx}
            className="absolute animate-float-gentle opacity-40 hover:opacity-80 transition-opacity"
            style={{
              left: e.left,
              top: e.top,
              animationDuration: e.dur,
              animationDelay: e.del,
            }}
          >
            <AppleEmoji emoji={getFloatingEmoji(e, idx)} size={e.size} />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full flex items-center justify-center py-4 sm:py-8">

        {/* ========================================================== */}
        {/* SCENE 0: COVER CARD */}
        {/* ========================================================== */}
        {scene === 0 && (
          <div className="flex flex-col items-center text-center animate-fade-in-up w-full max-w-[94vw] sm:max-w-md">
            <div className={`${themeTokens.cardClass} px-5 py-8 sm:px-12 sm:py-12 w-full relative`}>
              {/* Bouncing Theme Celebration Emoji */}
              <div className="mb-2 sm:mb-3 animate-bounce">
                <AppleEmoji emoji={celebrationEmoji} size={38} />
              </div>

              {/* Main Heading with dynamic Theme typography */}
              <h1 className={`${fontFamilyClass} text-3xl sm:text-5xl md:text-6xl font-bold ${themeTokens.headingColorClass} leading-tight tracking-tight`}>
                <span>{renderAppleText(line1Text, 38)}</span>
                <span className={`block mt-1 ${themeTokens.headingAccentClass}`}>
                  {renderAppleText(line2Text, 38)}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-3 sm:mt-4 text-slate-500 text-sm sm:text-base md:text-lg max-w-sm mx-auto leading-relaxed">
                {renderAppleText(subtitle)}
              </p>

              {/* Tap to Open Button */}
              <div className="mt-6 sm:mt-8 flex justify-center w-full">
                <button
                  type="button"
                  onClick={handleOpenCover}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-white font-bold text-base sm:text-lg cursor-pointer transition-all duration-200 min-h-[48px] shadow-xl hover:scale-[1.02] active:scale-[0.98] ${themeTokens.coverBtnGradient}`}
                >
                  <span>Tap to Open</span>
                  <AppleEmoji emoji="🎁" size={22} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* SCENE 1: THE STAR OF THE DAY (POLAROID) */}
        {/* ========================================================== */}
        {scene === 1 && (
          <div className="flex flex-col items-center text-center animate-fade-in-up w-full max-w-[94vw] sm:max-w-md">
            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
              <h2 className={`${fontFamilyClass} text-3xl sm:text-5xl font-bold ${themeTokens.headingColorClass} leading-tight`}>
                {isRomanceCategory
                  ? 'My Favorite Person'
                  : isScrapbookCategory
                  ? 'A Timeless Memory'
                  : isApologyCategory
                  ? 'A Moment to Reflect'
                  : 'The Star of the Day'}
              </h2>
              <AppleEmoji
                emoji={
                  isRomanceCategory
                    ? '❤️'
                    : isScrapbookCategory
                    ? '📸'
                    : isApologyCategory
                    ? '🕊️'
                    : '🌟'
                }
                size={28}
              />
            </div>

            {/* Polaroid Frame */}
            <div className="polaroid-frame my-2 w-full max-w-[280px] sm:max-w-[320px] mx-auto flex flex-col items-center justify-center">
              <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] max-h-[340px] sm:max-h-[380px] mx-auto overflow-hidden rounded-xl bg-slate-100 shadow-inner relative">
                <img
                  src={photoUrl}
                  alt={recipientName}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              </div>

              {/* Handwritten Polaroid Caption */}
              <p className={`mt-3 ${handwritingClass} text-xl sm:text-2xl text-slate-700 text-center flex items-center justify-center gap-1.5 px-2 break-words`}>
                {renderAppleText(photoCaption, 20)}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6 w-full max-w-xs sm:max-w-sm">
              <button
                type="button"
                onClick={() => setScene(0)}
                className={`${backBtnClass} flex-1 text-center`}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextFromPhoto}
                className={`${primaryBtnClass} flex-1 text-center`}
              >
                <span>Next →</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* SCENE 2: BEFORE WE PROCEED (MOOD CHECK) */}
        {/* ========================================================== */}
        {scene === 2 && (
          <div className="flex flex-col items-center text-center animate-pop-in w-full max-w-[94vw] sm:max-w-sm">
            <div className={`${themeTokens.cardClass} px-5 py-7 sm:px-10 sm:py-10 w-full`}>
              <h2 className={`${fontFamilyClass} text-3xl sm:text-5xl font-bold ${themeTokens.headingColorClass} leading-tight`}>
                {isApologyCategory
                  ? 'A Heartfelt Question...'
                  : isRomanceCategory
                  ? 'How is your heart feeling?'
                  : isScrapbookCategory
                  ? 'How is nostalgia hitting?'
                  : 'Before we proceed...'}
              </h2>
              <p className="mt-2 sm:mt-3 text-slate-500 text-sm sm:text-base">
                {isApologyCategory
                  ? 'Pick your feelings to open my note 🕊️'
                  : isRomanceCategory
                  ? 'Pick your vibe to unlock my heart ✨'
                  : isScrapbookCategory
                  ? 'Pick your vibe to flip the album 📸'
                  : 'How are you feeling today?'}
              </p>

              <div className="mt-5 sm:mt-7 flex flex-col gap-3 sm:gap-3.5 w-full">
                <button
                  type="button"
                  onClick={handleChooseFeeling}
                  className={`${primaryBtnClass} w-full py-3.5 px-6`}
                >
                  <span>
                    {isApologyCategory
                      ? 'Ready to Talk'
                      : isRomanceCategory
                      ? 'So In Love!'
                      : isScrapbookCategory
                      ? 'Best Days Ever!'
                      : 'Super Happy!'}
                  </span>
                  <AppleEmoji
                    emoji={
                      isApologyCategory
                        ? '🤍'
                        : isRomanceCategory
                        ? '❤️'
                        : isScrapbookCategory
                        ? '⚡'
                        : '🥳'
                    }
                    size={20}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleChooseFeeling}
                  className={`${secondaryBtnClass} w-full py-3.5 px-6`}
                >
                  <span>
                    {isApologyCategory
                      ? 'Soft Hug Accepted'
                      : isRomanceCategory
                      ? 'Butterflies Always!'
                      : isScrapbookCategory
                      ? 'Pure Golden Vibes'
                      : 'So Excited!'}
                  </span>
                  <AppleEmoji
                    emoji={
                      isApologyCategory
                        ? '🥺'
                        : isRomanceCategory
                        ? '✨'
                        : isScrapbookCategory
                        ? '📸'
                        : '✨'
                    }
                    size={20}
                  />
                </button>

                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => setScene(1)}
                    className={`${backBtnClass} w-full py-3`}
                  >
                    ← Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* SCENE 3: WHY YOU'RE SPECIAL */}
        {/* ========================================================== */}
        {scene === 3 && (
          <div className="flex flex-col items-center text-center animate-fade-in-up w-full max-w-[94vw] sm:max-w-md">
            <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
              <h2 className={`${fontFamilyClass} text-3xl sm:text-5xl font-bold ${themeTokens.headingColorClass} leading-tight`}>
                {isApologyCategory
                  ? 'Why You Mean So Much'
                  : isRomanceCategory
                  ? 'Why I Love You'
                  : isScrapbookCategory
                  ? 'Why We Are Unstoppable'
                  : "Why You're Special"}
              </h2>
              <AppleEmoji
                emoji={
                  isApologyCategory
                    ? '🕊️'
                    : isRomanceCategory
                    ? '❤️'
                    : isScrapbookCategory
                    ? '📸'
                    : '💫'
                }
                size={28}
              />
            </div>

            <div className="mt-4 sm:mt-5 flex flex-col gap-3 w-full max-w-[94vw] sm:max-w-md">
              {reasons.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className={`${themeTokens.reasonCardClass} p-3 sm:p-3.5 rounded-2xl flex items-center gap-3 sm:gap-3.5 text-left min-h-[82px] sm:min-h-[88px] transition-all`}
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${themeTokens.reasonIconBgClass} flex items-center justify-center shrink-0 shadow-2xs`}>
                    <AppleEmoji emoji={item.icon || celebrationEmoji} size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`${themeTokens.reasonTitleClass} font-bold text-xs sm:text-sm leading-tight truncate`}>
                      {renderAppleText(item.title, 15)}
                    </h3>
                    <p className="text-slate-600 text-[11px] sm:text-xs mt-0.5 leading-snug line-clamp-2">
                      {renderAppleText(item.desc || item.description, 13)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-xs sm:max-w-sm">
              <button
                type="button"
                onClick={() => setScene(2)}
                className={`${backBtnClass} flex-1 text-center`}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextFromReasons}
                className={`${primaryBtnClass} flex-1 text-center`}
              >
                <span>Next →</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* SCENE 4: 3D ENVELOPE & SECRET LETTER */}
        {/* ========================================================== */}
        {scene === 4 && (
          <div className="flex flex-col items-center text-center animate-fade-in-up w-full max-w-[94vw] sm:max-w-lg">
            <h2
              className={`${fontFamilyClass} text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 transition-colors duration-500 text-center leading-tight ${
                isEnvelopeOpen ? 'text-white' : themeTokens.headingColorClass
              }`}
            >
              {renderAppleText(letterTitle)}
            </h2>

            {/* CLOSED STATE: Realistic 3D SVG Envelope */}
            {!isEnvelopeOpen && (
              <div className="flex flex-col items-center w-full">
                <div
                  onClick={handleOpenEnvelope}
                  className="group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] w-full max-w-[280px] sm:max-w-[340px]"
                  title="Click to open envelope"
                >
                  <div
                    className={`relative w-full aspect-[330/210] rounded-2xl overflow-hidden shadow-2xl p-1 border-2 ${themeTokens.envelopeBgGradient}`}
                  >
                    {/* Shading */}
                    <div className={`absolute inset-0 ${themeTokens.envelopeShading}`} />

                    {/* Peeking Letter Card Inside */}
                    <div className={`absolute top-3 sm:top-4 left-4 right-4 sm:left-5 sm:right-5 h-[100px] sm:h-[110px] bg-white rounded-t-xl shadow-md border-t-2 ${themeTokens.envelopeCardBorder} p-2.5 sm:p-3 transform transition-transform duration-300 group-hover:-translate-y-3`}>
                      <div className={`flex items-center justify-center gap-1.5 ${themeTokens.envelopeCardTitle} font-bold text-xs sm:text-sm`}>
                        <span>
                          {isRomanceCategory
                            ? 'Forever & Always'
                            : isScrapbookCategory
                            ? 'Cherished Memories'
                            : isApologyCategory
                            ? 'From My Heart'
                            : 'Happy Birthday!'}
                        </span>
                        <AppleEmoji
                          emoji={
                            isRomanceCategory
                              ? '❤️'
                              : isScrapbookCategory
                              ? '📸'
                              : isApologyCategory
                              ? '🕊️'
                              : '🎉'
                          }
                          size={16}
                        />
                        <AppleEmoji emoji="✨" size={16} />
                      </div>
                      <div className="mt-1.5 sm:mt-2 text-center text-[10px] sm:text-[11px] text-slate-400">
                        A special letter for you...
                      </div>
                    </div>

                    {/* SVG Triangular Folds */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg
                        viewBox="0 0 330 210"
                        className="w-full h-full"
                        preserveAspectRatio="none"
                      >
                        <polygon
                          points="0,0 0,210 165,115"
                          fill={themeTokens.envelopeFolds.fold1}
                          opacity="0.95"
                        />
                        <polygon
                          points="330,0 330,210 165,115"
                          fill={themeTokens.envelopeFolds.fold2}
                          opacity="0.95"
                        />
                        <polygon
                          points="0,210 330,210 165,105"
                          fill={themeTokens.envelopeFolds.fold3}
                        />
                      </svg>
                    </div>

                    {/* Center Medallion / Wax Stamp */}
                    <div
                      className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: letterWaxColor }}
                    >
                      <AppleEmoji emoji={letterSealEmoji} size={20} />
                    </div>
                  </div>
                </div>

                {/* Bounce Prompt */}
                <p className="mt-4 sm:mt-5 text-slate-500 text-xs sm:text-sm font-medium animate-bounce flex items-center gap-1.5">
                  <span>Tap the envelope to open!</span>
                  <AppleEmoji emoji="💌" size={16} />
                </p>

                {/* Back Button */}
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => setScene(3)}
                    className={backBtnClass}
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* OPEN STATE: Expanded Letter Card */}
            {isEnvelopeOpen && (
              <div className="w-full flex flex-col items-center animate-fade-in-up">
                <div className={`relative w-full max-w-[94vw] sm:max-w-lg bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 shadow-2xl border ${themeTokens.openLetterBorder} text-left max-h-[85vh] overflow-y-auto`}>
                  {/* Header with Badges */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className={`flex items-center gap-1.5 ${themeTokens.openLetterHeader} font-bold text-base sm:text-xl`}>
                      <span>Happy Birthday!</span>
                      <AppleEmoji emoji="🎉" size={20} />
                      <AppleEmoji emoji={celebrationEmoji} size={20} />
                      <AppleEmoji emoji="✨" size={20} />
                    </div>
                    <AppleEmoji emoji="🎂" size={26} />
                  </div>

                  {/* Letter Body Paragraphs */}
                  <div className="space-y-3 sm:space-y-3.5 text-slate-700 text-sm sm:text-base leading-relaxed break-words">
                    {typeof letterBody === 'string'
                      ? letterBody.split(/\n\s*\n/).map((para, i) => (
                          <p key={i}>
                            {renderAppleText(para, 18)}
                          </p>
                        ))
                      : <p>{renderAppleText(String(letterBody), 18)}</p>
                    }
                    {/* Handwritten Signature */}
                    <div className="pt-3 border-t border-slate-100 text-right">
                      <p className={`${handwritingClass} text-xl sm:text-2xl ${themeTokens.signatureColorClass} font-bold flex items-center justify-end gap-1.5 whitespace-pre-line`}>
                        <span>{renderAppleText(letterSignOff, 20)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 w-full max-w-xs sm:max-w-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEnvelopeOpen(false);
                      setScene(0);
                      triggerConfettiCannon();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl text-white/95 hover:text-white border border-white/30 bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs sm:text-sm font-bold shadow-md transition-all duration-200 active:scale-95 cursor-pointer min-h-[44px] flex-1 text-center"
                  >
                    <span>Replay</span>
                    <AppleEmoji emoji="🔄" size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEnvelope}
                    className={`${primaryBtnClass} flex-1 text-center`}
                  >
                    <span>Close</span>
                    <AppleEmoji emoji="💌" size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
