import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Lock,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Copy,
} from 'lucide-react';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { getTemplateById } from '../../data/templates';

// 8 Ambient Floating Apple Emojis Scaled for the Mobile Phone Simulator
const AMBIENT_EMOJIS_CONFIG = [
  { left: '6%', top: '8%', duration: '7.5s', delay: '0s', size: 16 },
  { left: '86%', top: '6%', duration: '8.4s', delay: '1.2s', size: 15 },
  { left: '8%', top: '32%', duration: '9.2s', delay: '0.6s', size: 14 },
  { left: '88%', top: '30%', duration: '7.1s', delay: '2.1s', size: 16 },
  { left: '6%', top: '65%', duration: '8.8s', delay: '1.8s', size: 15 },
  { left: '88%', top: '62%', duration: '7.6s', delay: '0.4s', size: 16 },
  { left: '12%', top: '88%', duration: '9.5s', delay: '2.6s', size: 14 },
  { left: '84%', top: '86%', duration: '8.1s', delay: '1.5s', size: 15 },
];

/**
 * 6 Unique aesthetic themes powering the phone simulator
 */
const THEMES = {
  'royal-sapphire': {
    id: 'royal-sapphire',
    name: 'Royal Sapphire 👑',
    gender: 'boy',
    fontFamily: 'font-cursive',
    ambientEmojis: ['⭐', '🦋', '👑', '🌹', '💫', '🎉', '💙', '✨'],
    primaryEmoji: '👑',
    containerBgClass: 'bg-soft-aesthetic',
    envelopeCelebrationBg: 'bg-envelope-celebration',
    cardClass: 'birthday-card p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-blue-950',
    accentTextClass: 'text-blue-700',
    subtitleClass: 'text-slate-500',
    btnPrimaryClass: 'btn-primary animate-pulse-glow',
    btnActionClass: 'btn-primary',
    btnMood1Class: 'btn-primary',
    btnMood2Class: 'btn-secondary',
    reasonCardClass: 'special-reason-card',
    iconBoxClass: 'bg-blue-50/90 border border-blue-100/80',
    waxColor: '#1D4ED8',
    sealEmoji: '👑',
    envelopeGradient: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-blue-400/40',
    envelopeOverlay: 'bg-blue-900/60',
    envelopePeekingBorder: 'border-blue-200',
    envelopePeekingText: 'text-blue-900',
    envelopeFolds: ['#1e40af', '#1d4ed8', '#2563eb'],
    letterCardBorder: 'border-blue-100',
    letterBorderBottom: 'border-slate-100',
    letterHeaderClass: 'text-blue-900',
    letterSignOffClass: 'text-blue-800',
    confettiColors: ['#2563EB', '#60A5FA', '#F59E0B', '#FBBF24', '#38BDF8'],
    isScrapbook: false,
    defaultReasons: [
      { icon: '💪', title: 'Lucky to Have You', desc: 'So grateful to have a brother like you in my corner every day!' },
      { icon: '⭐', title: 'Always There', desc: 'Always standing by my side with endless laughs and genuine support!' },
      { icon: '👑', title: 'Irreplaceable', desc: 'No one can ever match your incredible spirit and heart. A true champion!' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, you are not just someone special, you are my strength, my happiness, and my forever inspiration. 🧿❤️\n\nThank you for always being there with endless laughs, wisdom, and genuine support. May this year bring you all the grand achievements, good health, and joyful moments you deserve! Keep shining! 👑✨`,
    defaultSignOff: (senderName) => `With love, ${senderName} 👑💙`,
  },

  'golden-birthday': {
    id: 'golden-birthday',
    name: 'Golden Spark 🎂',
    gender: 'boy',
    fontFamily: 'font-serif',
    ambientEmojis: ['🎂', '✨', '🥂', '💛', '⭐', '🎉', '🌟', '💫'],
    primaryEmoji: '🎂',
    containerBgClass: 'bg-gradient-to-b from-[#FFFDF9] via-[#FFF8EC] to-[#FEF3D6]',
    envelopeCelebrationBg: 'bg-gradient-to-b from-amber-950 via-yellow-950 to-stone-950',
    cardClass: 'border border-amber-200/90 bg-white/95 shadow-xl shadow-amber-500/10 rounded-3xl p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'border border-amber-200/90 bg-white/95 shadow-xl shadow-amber-500/10 rounded-3xl p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-amber-950',
    accentTextClass: 'text-amber-600',
    subtitleClass: 'text-amber-900/70',
    btnPrimaryClass: 'inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer',
    btnActionClass: 'inline-flex items-center justify-center gap-1 px-5 py-1.5 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer',
    btnMood1Class: 'text-white bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 shadow-amber-500/30',
    btnMood2Class: 'text-amber-950 bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-100 border border-amber-300/80 shadow-xs',
    reasonCardClass: 'border border-amber-200/90 bg-white/95 shadow-xs rounded-2xl',
    iconBoxClass: 'bg-amber-50 border border-amber-200/80',
    waxColor: '#D97706',
    sealEmoji: '⭐',
    envelopeGradient: 'bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-800 border-amber-300/50',
    envelopeOverlay: 'bg-amber-950/60',
    envelopePeekingBorder: 'border-amber-200',
    envelopePeekingText: 'text-amber-900',
    envelopeFolds: ['#78350f', '#b45309', '#d97706'],
    letterCardBorder: 'border-amber-200/90',
    letterBorderBottom: 'border-amber-100',
    letterHeaderClass: 'text-amber-900',
    letterSignOffClass: 'text-amber-800',
    confettiColors: ['#D97706', '#F59E0B', '#FBBF24', '#FDE68A', '#FEF3C7'],
    isScrapbook: false,
    defaultReasons: [
      { icon: '🌟', title: 'Golden Heart', desc: 'Your radiant kindness and golden energy brightens every room you step into!' },
      { icon: '🥂', title: 'Endless Cheers', desc: 'Every memory together feels like a grand celebration full of laughter and victory!' },
      { icon: '⭐', title: 'Pure Excellence', desc: 'You inspire everyone with your dedication, talent, and unforgettable charisma!' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, on your golden day, wishing you the richest blessings, boundless joy, and success that shines brighter than gold! 🎂✨\n\nThank you for bringing so much golden warmth and celebration into every moment we share. Here's to making this year your most unforgettable chapter yet! 🥂🌟`,
    defaultSignOff: (senderName) => `With love & cheers, ${senderName} 🎂✨`,
  },

  'polaroid-scrapbook': {
    id: 'polaroid-scrapbook',
    name: 'Retro Polaroid 📸',
    gender: 'boy',
    fontFamily: 'font-handwriting',
    ambientEmojis: ['📸', '⚡', '🎞️', '📜', '🤎', '⭐', '✨', '☕'],
    primaryEmoji: '📸',
    containerBgClass: 'paper-parchment',
    envelopeCelebrationBg: 'bg-gradient-to-b from-stone-900 via-amber-950 to-stone-950',
    cardClass: 'border border-amber-800/15 bg-[#FFFDF9]/95 shadow-md rounded-2xl p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'border border-amber-800/15 bg-[#FFFDF9]/95 shadow-md rounded-2xl p-5 sm:p-6 w-full max-w-[260px] text-center relative',
    headingClass: 'text-stone-900',
    accentTextClass: 'text-amber-800',
    subtitleClass: 'text-stone-600',
    btnPrimaryClass: 'inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-amber-800 to-stone-800 shadow-md shadow-stone-800/20 active:scale-95 transition-all cursor-pointer',
    btnActionClass: 'inline-flex items-center justify-center gap-1 px-5 py-1.5 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-amber-800 to-stone-800 shadow-md shadow-stone-800/20 active:scale-95 transition-all cursor-pointer',
    btnMood1Class: 'text-white bg-gradient-to-r from-amber-800 to-stone-800 shadow-stone-800/20',
    btnMood2Class: 'text-stone-900 bg-gradient-to-r from-stone-100 to-amber-100 border border-stone-300/80 shadow-xs',
    reasonCardClass: 'border border-amber-800/15 bg-[#FFFDF9]/95 shadow-xs rounded-xl',
    iconBoxClass: 'bg-amber-50/80 border border-amber-200/60',
    waxColor: '#78350F',
    sealEmoji: '⚡',
    envelopeGradient: 'bg-gradient-to-br from-amber-900 via-stone-800 to-amber-950 border-amber-600/40',
    envelopeOverlay: 'bg-stone-950/60',
    envelopePeekingBorder: 'border-amber-300',
    envelopePeekingText: 'text-stone-900',
    envelopeFolds: ['#451a03', '#78350f', '#92400e'],
    letterCardBorder: 'border-amber-800/20 bg-[#FFFDF9]',
    letterBorderBottom: 'border-amber-100',
    letterHeaderClass: 'text-stone-900',
    letterSignOffClass: 'text-amber-900',
    confettiColors: ['#78350F', '#B45309', '#D97706', '#A16207', '#EAB308'],
    isScrapbook: true,
    defaultReasons: [
      { icon: '🤝', title: 'Through Thick & Thin', desc: 'Always standing by my side with steadfast loyalty and endless support!' },
      { icon: '⚡', title: 'Unmatched Chemistry', desc: 'From crazy ideas to unstoppable laughter, our vibe is completely one of a kind!' },
      { icon: '📸', title: 'Timeless Memories', desc: 'Every adventure and laugh we share turns into an unforgettable chapter!' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, flipping through memories with you is a reminder of how truly special true friendship is. 📸⚡\n\nThank you for all the late-night talks, epic adventures, and memories etched forever in heart. Wishing you the warmest and happiest birthday! 🤎☕`,
    defaultSignOff: (senderName) => `Always your friend, ${senderName} 📸⚡`,
  },

  'blush-rose': {
    id: 'blush-rose',
    name: 'Blush Blossom 🌸',
    gender: 'girl',
    fontFamily: 'font-cursive',
    ambientEmojis: ['🌸', '🦋', '👑', '🌹', '💫', '🎉', '💖', '✨'],
    primaryEmoji: '🌸',
    containerBgClass: 'bg-soft-aesthetic-girl',
    envelopeCelebrationBg: 'bg-envelope-celebration-girl',
    cardClass: 'birthday-card-girl p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-girl p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-rose-950',
    accentTextClass: 'text-rose-600',
    subtitleClass: 'text-slate-500',
    btnPrimaryClass: 'btn-primary-rose animate-pulse-glow-rose',
    btnActionClass: 'btn-primary-rose',
    btnMood1Class: 'btn-primary-rose',
    btnMood2Class: 'btn-secondary-rose',
    reasonCardClass: 'special-reason-card-girl',
    iconBoxClass: 'bg-rose-50/90 border border-rose-100/80',
    waxColor: '#E11D48',
    sealEmoji: '🌸',
    envelopeGradient: 'bg-gradient-to-br from-rose-600 via-rose-700 to-pink-900 border-rose-300/40',
    envelopeOverlay: 'bg-rose-950/60',
    envelopePeekingBorder: 'border-rose-200',
    envelopePeekingText: 'text-rose-900',
    envelopeFolds: ['#be123c', '#e11d48', '#f43f5e'],
    letterCardBorder: 'border-rose-100',
    letterBorderBottom: 'border-slate-100',
    letterHeaderClass: 'text-rose-900',
    letterSignOffClass: 'text-rose-700',
    confettiColors: ['#F43F5E', '#FB7185', '#F59E0B', '#EC4899', '#A855F7'],
    isScrapbook: false,
    defaultReasons: [
      { icon: '🌸', title: 'Pure Sunshine', desc: 'The effortless way you turn every ordinary moment into joy!' },
      { icon: '✨', title: 'Gentle Soul', desc: 'The quiet kindness and sparkling positivity you share with everyone!' },
      { icon: '💖', title: 'Irreplaceable', desc: 'A truly irreplaceable friend whose presence makes everything brighter!' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, you bring so much warmth, light, and sparkling happiness into my life. 🌸❤️\n\nThank you for being such an incredible friend and gentle soul. May this year bring you all the sweetest dreams, vibrant laughter, and boundless happiness you deserve so deeply!`,
    defaultSignOff: (senderName) => `With love, ${senderName} 🌸💖`,
  },

  'princess-peach': {
    id: 'princess-peach',
    name: 'Princess Peach ✨',
    gender: 'girl',
    fontFamily: 'font-serif',
    ambientEmojis: ['✨', '🍑', '🌟', '🧡', '👑', '🎉', '💫', '🌸'],
    primaryEmoji: '✨',
    containerBgClass: 'bg-gradient-to-b from-[#FFFDF9] via-[#FFF4EB] to-[#FEEAD8]',
    envelopeCelebrationBg: 'bg-gradient-to-b from-amber-950 via-rose-950 to-orange-950',
    cardClass: 'border border-orange-200/90 bg-white/95 shadow-xl shadow-orange-500/10 rounded-3xl p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'border border-orange-200/90 bg-white/95 shadow-xl shadow-orange-500/10 rounded-3xl p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-orange-950',
    accentTextClass: 'text-orange-600',
    subtitleClass: 'text-orange-900/70',
    btnPrimaryClass: 'inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 shadow-md shadow-orange-500/30 active:scale-95 transition-all cursor-pointer',
    btnActionClass: 'inline-flex items-center justify-center gap-1 px-5 py-1.5 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 shadow-md shadow-orange-500/30 active:scale-95 transition-all cursor-pointer',
    btnMood1Class: 'text-white bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 shadow-orange-500/30',
    btnMood2Class: 'text-orange-950 bg-gradient-to-r from-orange-100 via-rose-100 to-amber-100 border border-orange-300/80 shadow-xs',
    reasonCardClass: 'border border-orange-200/90 bg-white/95 shadow-xs rounded-2xl',
    iconBoxClass: 'bg-orange-50 border border-orange-200/80',
    waxColor: '#EA580C',
    sealEmoji: '✨',
    envelopeGradient: 'bg-gradient-to-br from-orange-600 via-rose-600 to-amber-700 border-orange-300/50',
    envelopeOverlay: 'bg-orange-950/60',
    envelopePeekingBorder: 'border-orange-200',
    envelopePeekingText: 'text-orange-900',
    envelopeFolds: ['#9a3412', '#c2410c', '#ea580c'],
    letterCardBorder: 'border-orange-200/90',
    letterBorderBottom: 'border-orange-100',
    letterHeaderClass: 'text-orange-900',
    letterSignOffClass: 'text-orange-800',
    confettiColors: ['#EA580C', '#F97316', '#FB923C', '#F43F5E', '#FDE047'],
    isScrapbook: false,
    defaultReasons: [
      { icon: '🍑', title: 'Peach Perfection', desc: 'Your heartwarming smile brings sweetest joy and elegance to all of us!' },
      { icon: '✨', title: 'Sparkling Grace', desc: 'You have a gentle superpower to make everyone feel cherished and deeply valued!' },
      { icon: '👑', title: 'True Royalty', desc: 'Inside and out, you carry yourself with royal charm, compassion, and boundless grace!' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, you light up every room with your gentle warmth, sweetest smile, and radiant positivity! ✨🍑\n\nMay your birthday sparkle brighter than fairy dust and starlight, bringing you endless joy and unforgettable magical memories! 👑🌟`,
    defaultSignOff: (senderName) => `With love & sparkles, ${senderName} ✨🧡`,
  },

  'lavender-dream': {
    id: 'lavender-dream',
    name: 'Lavender Dream 💜',
    gender: 'girl',
    fontFamily: 'font-cursive',
    ambientEmojis: ['💜', '🦋', '🌙', '✨', '🔮', '🎉', '💫', '🌸'],
    primaryEmoji: '💜',
    containerBgClass: 'bg-gradient-to-b from-[#FAF5FF] via-[#F3E8FF] to-[#EDE9FE]',
    envelopeCelebrationBg: 'bg-gradient-to-b from-purple-950 via-violet-950 to-indigo-950',
    cardClass: 'border border-purple-200/90 bg-white/95 shadow-xl shadow-purple-500/10 rounded-3xl p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'border border-purple-200/90 bg-white/95 shadow-xl shadow-purple-500/10 rounded-3xl p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-purple-950',
    accentTextClass: 'text-purple-600',
    subtitleClass: 'text-purple-900/70',
    btnPrimaryClass: 'inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-md shadow-purple-600/30 active:scale-95 transition-all cursor-pointer',
    btnActionClass: 'inline-flex items-center justify-center gap-1 px-5 py-1.5 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-md shadow-purple-600/30 active:scale-95 transition-all cursor-pointer',
    btnMood1Class: 'text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-purple-600/30',
    btnMood2Class: 'text-purple-950 bg-gradient-to-r from-purple-100 via-violet-100 to-indigo-100 border border-purple-300/80 shadow-xs',
    reasonCardClass: 'border border-purple-200/90 bg-white/95 shadow-xs rounded-2xl',
    iconBoxClass: 'bg-purple-50 border border-purple-200/80',
    waxColor: '#7C3AED',
    sealEmoji: '💜',
    envelopeGradient: 'bg-gradient-to-br from-purple-700 via-violet-800 to-indigo-900 border-purple-300/50',
    envelopeOverlay: 'bg-purple-950/60',
    envelopePeekingBorder: 'border-purple-200',
    envelopePeekingText: 'text-purple-900',
    envelopeFolds: ['#581c87', '#6b21a8', '#7c3aed'],
    letterCardBorder: 'border-purple-200/90',
    letterBorderBottom: 'border-purple-100',
    letterHeaderClass: 'text-purple-900',
    letterSignOffClass: 'text-purple-800',
    confettiColors: ['#7C3AED', '#8B5CF6', '#A78BFA', '#C084FC', '#E879F9'],
    isScrapbook: false,
    defaultReasons: [
      { icon: '💜', title: 'Magical Presence', desc: 'Your gentle spirit and soothing energy bring comfort and magic everywhere!' },
      { icon: '🦋', title: 'Fairy Elegance', desc: 'Like a butterfly dancing in the breeze, you inspire dreams and wonder!' },
      { icon: '🌙', title: 'Endless Wonder', desc: 'A deeply creative, compassionate soul who makes life infinitely more beautiful!' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, wishing you the gentlest fairy magic, sweetest dreams, and a world of endless wonder on your special day. 💜🌙\n\nYour presence is a calming melody and a beautiful spark of joy in this world. Keep shining and dreaming big! 🦋✨`,
    defaultSignOff: (senderName) => `With love & magic, ${senderName} 💜🌙`,
  },
};

/**
 * Resolves theme configuration based on templateId and fallback gender
 */
const resolveTheme = (templateId, gender) => {
  let targetId = templateId || '';
  if (targetId === 'blush-romance') targetId = 'blush-rose';
  if (targetId === 'heartfelt-apology') targetId = 'lavender-dream';

  if (THEMES[targetId]) {
    return THEMES[targetId];
  }
  return gender === 'girl' ? THEMES['blush-rose'] : THEMES['royal-sapphire'];
};

export default function LivePhonePreview({ formData = {} }) {
  const [screen, setScreen] = useState(0); // 0: Cover/Landing, 1: Ritual/Photo, 2: Gift/Chapters/Mood, 3: Reasons/Photo, 4: Envelope/Letter
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  // Template-Specific Interactive States
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);

  // Scoped Confetti Canvas References
  const confettiCanvasRef = useRef(null);
  const confettiInstanceRef = useRef(null);

  useEffect(() => {
    if (confettiCanvasRef.current) {
      confettiInstanceRef.current = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      });
    }
    return () => {
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current.reset();
      }
    };
  }, []);

  // Reset simulator state immediately whenever user selects another template
  useEffect(() => {
    setScreen(0);
    setEnvelopeOpen(false);
    setCandlesBlown(false);
    setGiftOpened(false);
  }, [formData.templateId]);

  const template = getTemplateById(formData.templateId || 'royal-sapphire');
  const theme = resolveTheme(formData.templateId, formData.gender || template?.gender);

  const isGolden = theme.id === 'golden-birthday';
  const isScrapbook = theme.id === 'polaroid-scrapbook';
  const isMultiScene = !isGolden && !isScrapbook;

  const isGirl = theme.gender === 'girl';
  const recipientName = formData.recipientName || (isGirl ? 'Sarah' : 'Rohan');
  const senderName = formData.senderName || (isGirl ? 'Elena' : 'Alex');
  const subtitle = formData.subtitle || template?.defaultSubtitle || 'I have a small surprise for you...';

  const rawOccasion = (formData.occasion || '').trim();
  const nameToDisplay = (formData.recipientName || '').trim() || (isGirl ? 'Sarah' : 'Rohan');
  const celebrationEmoji = theme.primaryEmoji;

  // Smart greeting determination
  let line1Text = '';
  let line2Text = '';

  if (isScrapbook && !formData.occasion) {
    line1Text = 'Chapters of Brotherhood';
    line2Text = `${nameToDisplay}! 📸⚡`;
  } else if (rawOccasion) {
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
    line1Text = 'Happy Birthday,';
    line2Text = `${nameToDisplay}! ${celebrationEmoji}`;
  }

  const heroPhotoUrl = formData.heroPhoto || formData.photos?.[0]?.url || template?.samplePhoto;

  const defaultCaptions = {
    'royal-sapphire': 'Keep Rocking Always! 👑🔥',
    'golden-birthday': 'Keep Shining Brighter Than Gold! 🎂✨',
    'polaroid-scrapbook': 'Brothers & Besties For Life! 📸⚡',
    'blush-rose': 'Stay Wonderful Always! 🌸✨',
    'princess-peach': 'May All Your Wishes Sparkle! ✨💖',
    'lavender-dream': 'Never Stop Dreaming Beautiful Dreams! 💜🦋',
  };

  const photoCaption =
    formData.photoCaption ||
    formData.photos?.[0]?.caption ||
    defaultCaptions[theme.id] ||
    (isGirl ? 'Stay Wonderful Always! 🌸✨' : 'Keep Rocking Always! 👑🔥');

  const specialReasons =
    formData.specialReasons && formData.specialReasons.length > 0
      ? formData.specialReasons
      : formData.reasons && formData.reasons.length > 0
      ? formData.reasons
      : theme.defaultReasons;

  const letterTitle =
    (typeof formData.letter === 'object' ? formData.letter?.title : null) ||
    formData.letterTitle ||
    'A Little Note For You';
  const letterBody =
    (typeof formData.letter === 'object' ? formData.letter?.content : formData.letter) ||
    formData.letterBody ||
    theme.defaultLetter(recipientName);
  const letterSignOff =
    (typeof formData.letter === 'object' && formData.letter?.signOff) ||
    formData.letterSignOff ||
    theme.defaultSignOff(senderName);
  const letterSealEmoji =
    (typeof formData.letter === 'object' && formData.letter?.sealEmoji) ||
    formData.sealEmoji ||
    theme.sealEmoji;
  const letterWaxColor =
    (typeof formData.letter === 'object' && formData.letter?.waxColor) ||
    formData.waxColor ||
    theme.waxColor;

  // Scoped celebration confetti strictly inside mobile simulator
  const triggerConfetti = () => {
    try {
      const fire = confettiInstanceRef.current;
      if (fire) {
        fire({
          particleCount: 38,
          spread: 55,
          origin: { y: 0.65 },
          colors: theme.confettiColors,
        });
      }
    } catch {
      // graceful fallback
    }
  };

  const handleOpenLanding = () => {
    triggerConfetti();
    setScreen(1);
  };

  const handleNextPhoto = () => {
    triggerConfetti();
    setScreen(2);
  };

  const handleChooseFeeling = () => {
    triggerConfetti();
    setScreen(3);
  };

  const handleNextReasons = () => {
    triggerConfetti();
    setScreen(4);
  };

  const handleOpenEnvelope = () => {
    triggerConfetti();
    setEnvelopeOpen(true);
  };

  const handleResetScreen = () => {
    triggerConfetti();
    setScreen(0);
    setEnvelopeOpen(false);
    setCandlesBlown(false);
    setGiftOpened(false);
  };

  const handlePrevScene = () => {
    if (screen > 0) {
      setScreen((prev) => prev - 1);
      setEnvelopeOpen(false);
    }
  };

  const handleNextScene = () => {
    if (screen < 4) {
      setScreen((prev) => prev + 1);
      setEnvelopeOpen(false);
    }
  };

  // Address bar display URL
  const cleanName = (recipientName || 'someone').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const displayUrl = `for-${cleanName || 'someone'}.wishcraft.live`;

  // Dynamic background styling matching the chosen template
  const isCelebrationBg = screen === 4 && envelopeOpen;
  const isDarkScene = isCelebrationBg;
  const containerBgClass = isCelebrationBg
    ? theme.envelopeCelebrationBg
    : theme.containerBgClass;

  const activeAmbientEmojis = theme.ambientEmojis;

  return (
    <div className="flex flex-col items-center justify-center w-full select-none py-2">
      {/* =================================================================== */}
      {/* REALISTIC IPHONE 15 / 16 PRO TITANIUM SIMULATOR CHASSIS */}
      {/* =================================================================== */}
      <div className="relative w-[300px] min-[360px]:w-[320px] sm:w-[350px] h-[660px] min-[360px]:h-[680px] sm:h-[700px] max-w-full flex items-center justify-center">
        {/* Physical Hardware Buttons */}
        <div className="absolute -left-[3.5px] top-[112px] w-[3.5px] h-[22px] bg-[#434050] rounded-l-[3px] shadow-xs pointer-events-none" />
        <div className="absolute -left-[3.5px] top-[148px] w-[3.5px] h-[46px] bg-[#434050] rounded-l-[3px] shadow-xs pointer-events-none" />
        <div className="absolute -left-[3.5px] top-[204px] w-[3.5px] h-[46px] bg-[#434050] rounded-l-[3px] shadow-xs pointer-events-none" />
        <div className="absolute -left-[1.5px] top-[72px] w-[1.5px] h-[4px] bg-[#2d2a38] pointer-events-none" />
        <div className="absolute -left-[1.5px] bottom-[72px] w-[1.5px] h-[4px] bg-[#2d2a38] pointer-events-none" />

        <div className="absolute -right-[3.5px] top-[165px] w-[3.5px] h-[68px] bg-[#434050] rounded-r-[3px] shadow-xs pointer-events-none" />
        <div className="absolute -right-[1.5px] top-[72px] w-[1.5px] h-[4px] bg-[#2d2a38] pointer-events-none" />
        <div className="absolute -right-[1.5px] bottom-[72px] w-[1.5px] h-[4px] bg-[#2d2a38] pointer-events-none" />

        {/* Metallic Titanium Outer Rim */}
        <div className="w-full h-full p-[2.5px] rounded-[52px] sm:rounded-[56px] bg-gradient-to-b from-[#8a8698] via-[#4b4859] to-[#6b667c] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.15)] flex flex-col">
          {/* Deep Black Uniform Screen Bezel */}
          <div className="w-full h-full p-2.5 sm:p-3 bg-black rounded-[50px] sm:rounded-[54px] flex flex-col">
            {/* Phone Screen Canvas */}
            <div
              className={`relative w-full h-full ${containerBgClass} before:!absolute before:!inset-0 rounded-[38px] sm:rounded-[42px] overflow-hidden flex flex-col transition-colors duration-500`}
            >
              {/* Scoped Confetti Canvas strictly bounded inside the phone frame */}
              <canvas
                ref={confettiCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-30"
              />

              {/* 8 Ambient Floating Apple Emojis Scaled to Selected Theme */}
              {AMBIENT_EMOJIS_CONFIG.map((cfg, idx) => (
                <div
                  key={idx}
                  className="absolute pointer-events-none select-none z-10 opacity-70"
                  style={{
                    left: cfg.left,
                    top: cfg.top,
                    animation: `floatGentleAnim ${cfg.duration} ease-in-out infinite`,
                    animationDelay: cfg.delay,
                  }}
                >
                  <AppleEmoji emoji={activeAmbientEmojis[idx] || theme.primaryEmoji} size={cfg.size} />
                </div>
              ))}

              {/* ========================================================== */}
              {/* TOP iOS STATUS BAR & DYNAMIC ISLAND */}
              {/* ========================================================== */}
              <div className="relative w-full pt-3 px-6 pb-1 flex items-center justify-between text-xs select-none z-30 shrink-0">
                {/* Left: Current Time */}
                <div className="w-16 flex items-center justify-start">
                  <span
                    className={`font-semibold text-[13px] tracking-tight font-sans ${
                      isDarkScene ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    12:56 PM
                  </span>
                </div>

                {/* Center: True Dynamic Island Pill */}
                <div className="w-24 sm:w-28 h-6 sm:h-7 bg-black rounded-full flex items-center justify-end pr-2.5 shadow-sm pointer-events-none">
                  <div className="relative w-2.5 h-2.5 rounded-full bg-[#0a0d1a] border border-[#1e2538] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-950/90 border border-blue-400/30" />
                    <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 rounded-full bg-blue-200/70" />
                  </div>
                </div>

                {/* Right: Cellular Signal, Wi-Fi & Battery Icons */}
                <div
                  className={`w-16 flex items-center justify-end gap-1.5 ${
                    isDarkScene ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <svg className="w-4 h-3 fill-current" viewBox="0 0 17 12">
                    <rect x="0" y="8.5" width="2.5" height="3.5" rx="0.6" />
                    <rect x="4.5" y="6" width="2.5" height="6" rx="0.6" />
                    <rect x="9" y="3" width="2.5" height="9" rx="0.6" />
                    <rect x="13.5" y="0" width="2.5" height="12" rx="0.6" />
                  </svg>

                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 12">
                    <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />
                    <path d="M4.5 7.5a5 5 0 0 1 7 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M2 4.5a8.5 8.5 0 0 1 12 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>

                  <div className="flex items-center">
                    <div
                      className={`w-5 h-2.5 rounded-[3px] border-[1.2px] p-[1.5px] flex items-center ${
                        isDarkScene ? 'border-white' : 'border-slate-900'
                      }`}
                    >
                      <div
                        className={`w-full h-full rounded-[1px] ${
                          isDarkScene ? 'bg-white' : 'bg-slate-900'
                        }`}
                      />
                    </div>
                    <div
                      className={`w-[1.5px] h-1 rounded-r-xs -ml-[0.5px] ${
                        isDarkScene ? 'bg-white' : 'bg-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* ========================================================== */}
              {/* INTERACTIVE MULTI-SCENE SCREEN BODY */}
              {/* ========================================================== */}
              <div className="flex-1 overflow-y-auto px-3.5 py-2 flex flex-col justify-center items-center text-center custom-scrollbar relative z-20">
                {/* -------------------------------------------------------- */}
                {/* SCENE 0: COVER / LANDING */}
                {/* -------------------------------------------------------- */}
                {screen === 0 && (
                  <div className="w-full flex items-center justify-center animate-fade-in-up px-1">
                    {/* A) Golden Spark Cover */}
                    {isGolden && (
                      <div className="border border-amber-200/90 bg-white/95 shadow-xl shadow-amber-500/10 rounded-3xl p-5 sm:p-6 w-full text-center relative">
                        {/* Floating Cake & Sparkles */}
                        <div className="mb-2 inline-flex items-center justify-center gap-2 animate-bounce">
                          <AppleEmoji emoji="🎂" size={32} />
                          <AppleEmoji emoji="✨" size={24} />
                          <AppleEmoji emoji="🥂" size={26} />
                          <AppleEmoji emoji="💛" size={24} />
                        </div>

                        {/* Luxury Serif Headline */}
                        <div className="text-[11px] font-semibold text-amber-700 tracking-wider uppercase mb-1.5 flex items-center justify-center gap-1 font-serif">
                          <span>A Golden Birthday Celebration</span>
                          <AppleEmoji emoji="🎂" size={13} />
                          <AppleEmoji emoji="✨" size={13} />
                        </div>

                        <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-amber-950">
                          <span>Happy Birthday,</span>
                          <span className="block mt-1 text-amber-600">
                            {renderAppleText(recipientName, 22)}! 🎂✨
                          </span>
                        </h1>

                        <p className="mt-3 text-xs sm:text-sm text-amber-900/75 leading-relaxed font-normal">
                          {renderAppleText(formData.subtitle || template?.defaultSubtitle || "May your year shine brighter than pure gold.", 12)}
                        </p>

                        <div className="mt-5 flex justify-center">
                          <button
                            type="button"
                            onClick={handleOpenLanding}
                            className={theme.btnPrimaryClass}
                          >
                            <span>Start Celebration</span>
                            <AppleEmoji emoji="✨" size={14} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* B) Retro Polaroid Scrapbook Journal Binder Cover */}
                    {isScrapbook && (
                      <div className="border border-amber-800/15 bg-[#FFFDF9]/95 shadow-md rounded-2xl p-5 sm:p-6 w-full text-center relative">
                        <div className="w-20 h-4 washi-tape mx-auto -mt-6 mb-2 rounded-xs shadow-2xs rotate-1 select-none pointer-events-none" />

                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-900 text-[10px] font-semibold mb-2">
                          <span>Memories & Keepsakes Journal</span>
                          <AppleEmoji emoji="📸" size={12} />
                        </div>

                        <div className="mb-2 inline-block animate-bounce">
                          <AppleEmoji emoji="📸" size={36} />
                        </div>

                        <h1 className="font-handwriting text-2xl sm:text-3xl font-bold leading-tight text-stone-900">
                          <span>{renderAppleText(line1Text, 24)}</span>
                          <span className="block mt-1 text-amber-800">
                            {renderAppleText(line2Text, 24)}
                          </span>
                        </h1>

                        <p className="font-handwriting text-base sm:text-lg text-stone-700 mt-2.5 leading-snug">
                          "{renderAppleText(formData.subtitle || template?.defaultSubtitle || "Taped forever into the scrapbook of our greatest memories.", 13)}"
                        </p>

                        <div className="mt-5 flex justify-center">
                          <button
                            type="button"
                            onClick={handleOpenLanding}
                            className={theme.btnPrimaryClass}
                          >
                            <span>Open Journal</span>
                            <AppleEmoji emoji="📖" size={14} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* C) Multi-Scene (Royal Sapphire, Blush Blossom, Princess Peach, Lavender Dream) */}
                    {isMultiScene && (
                      <div className={theme.cardClass}>
                        <div className="mb-3 inline-block animate-bounce">
                          <AppleEmoji emoji={theme.primaryEmoji} size={38} />
                        </div>

                        <h1 className={`${theme.fontFamily} text-2xl sm:text-3xl font-bold leading-tight ${theme.headingClass}`}>
                          <span>{renderAppleText(line1Text, 24)}</span>
                          <span className={`block mt-1 ${theme.accentTextClass}`}>
                            {renderAppleText(line2Text, 24)}
                          </span>
                        </h1>

                        <p className={`mt-3 text-xs sm:text-sm ${theme.subtitleClass} leading-relaxed font-normal`}>
                          {renderAppleText(subtitle, 12)}
                        </p>

                        <div className="mt-5 flex justify-center">
                          <button
                            type="button"
                            onClick={handleOpenLanding}
                            className={`py-2 px-5 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 ${theme.btnPrimaryClass}`}
                          >
                            <span>Tap to Open</span>
                            <AppleEmoji emoji="🎁" size={14} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* SCENE 1 */}
                {/* -------------------------------------------------------- */}
                {screen === 1 && (
                  <div className="w-full flex flex-col items-center animate-fade-in-up py-1 max-w-[280px]">
                    {/* A) Golden Spark: 2-Tier Birthday Cake with Burning Candles */}
                    {isGolden && (
                      <div className="w-full flex flex-col items-center">
                        <div className="text-center mb-2">
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-800 text-[10px] font-semibold mb-1">
                            <span>Make a Wish</span>
                            <AppleEmoji emoji="🕯️" size={12} />
                          </div>
                          <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-950 leading-tight">
                            Blow the Candles to Make a Wish 🕯️
                          </h2>
                          <p className="text-[11px] text-amber-900/70 mt-0.5 font-serif">
                            {candlesBlown ? "You Made a Birthday Wish! ✨" : "Close your eyes, make a wish & blow!"}
                          </p>
                        </div>

                        {/* 2-Tier Birthday Cake with 4 Glowing Candles */}
                        <div className="relative my-3 flex flex-col items-center justify-center">
                          {/* Candles Row */}
                          <div className="flex items-end justify-center gap-3.5 mb-1 z-10">
                            {[0, 1, 2, 3].map((candle) => (
                              <div key={candle} className="flex flex-col items-center">
                                {!candlesBlown ? (
                                  <div className="w-3.5 h-5 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full animate-flame shadow-md shadow-amber-400" />
                                ) : (
                                  <span className="text-xs text-slate-400 flex items-center justify-center h-5 animate-in fade-in duration-300">
                                    <AppleEmoji emoji="💨" size={14} />
                                  </span>
                                )}
                                <div className="w-2 h-6 bg-gradient-to-b from-amber-200 via-pink-200 to-amber-300 rounded-t-xs shadow-inner" />
                              </div>
                            ))}
                          </div>

                          {/* Cake Tiers */}
                          <div className="relative flex flex-col items-center">
                            {/* Top Layer */}
                            <div className="w-36 h-9 rounded-t-xl bg-gradient-to-b from-amber-100 to-amber-200 border-t-2 border-amber-300/80 shadow-md flex items-center justify-center">
                              <span className="text-[10px] font-bold text-amber-800 tracking-wider font-serif">
                                ⭐ HAPPY BIRTHDAY ⭐
                              </span>
                            </div>
                            {/* Bottom Layer */}
                            <div className="w-48 h-10 rounded-b-xl bg-gradient-to-b from-[#FFF2D6] to-[#FCE6BD] border-t-2 border-amber-300/50 shadow-lg flex items-center justify-around px-3">
                              <AppleEmoji emoji="🍓" size={14} />
                              <AppleEmoji emoji="✨" size={14} />
                              <AppleEmoji emoji="🎂" size={14} />
                              <AppleEmoji emoji="✨" size={14} />
                              <AppleEmoji emoji="🍓" size={14} />
                            </div>
                            {/* Cake Stand Plate */}
                            <div className="w-56 h-2.5 bg-gradient-to-r from-amber-200 via-white to-amber-200 rounded-full shadow-md mt-1" />
                          </div>
                        </div>

                        {/* Blow Candles Action / Status */}
                        {!candlesBlown ? (
                          <button
                            type="button"
                            onClick={() => {
                              triggerConfetti();
                              setCandlesBlown(true);
                            }}
                            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
                          >
                            <span>Blow Candles</span>
                            <AppleEmoji emoji="🕯️" size={14} />
                          </button>
                        ) : (
                          <div className="mt-2 flex flex-col items-center animate-pop-in">
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs">
                              <span>Wish Made!</span>
                              <AppleEmoji emoji="✨" size={13} />
                            </div>
                            <p className="font-serif italic text-xs text-amber-900 mt-1">
                              "You Made a Birthday Wish! ✨"
                            </p>
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-center gap-2.5 mt-3.5 w-full">
                          <button
                            type="button"
                            onClick={() => setScreen(0)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerConfetti();
                              setScreen(2);
                            }}
                            className={theme.btnActionClass}
                          >
                            <span>Next: Open Gift</span>
                            <AppleEmoji emoji="🎁" size={13} className="ml-1" />
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* B) Retro Polaroid Scrapbook: Star Polaroid with Washi Tape */}
                    {isScrapbook && (
                      <div className="w-full flex flex-col items-center">
                        <div className="flex items-center justify-center gap-1.5 mb-0.5">
                          <h2 className="font-handwriting text-2xl font-bold text-stone-900">
                            The Star of the Day
                          </h2>
                          <AppleEmoji emoji="🌟" size={18} />
                        </div>

                        <div className="relative my-1 mx-auto inline-block">
                          <div className="w-20 h-4 washi-tape mx-auto -mb-2 rounded-xs shadow-2xs rotate-1 relative z-10 select-none pointer-events-none" />
                          <div className="polaroid-frame-tilted shadow-xl">
                            <div className="relative w-[170px] sm:w-[185px] h-[200px] sm:h-[220px] overflow-hidden rounded-[3px] bg-stone-100 shadow-inner">
                              <img
                                src={heroPhotoUrl}
                                alt={recipientName}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'center 12%' }}
                              />
                            </div>
                            <p className="mt-2 font-handwriting text-sm sm:text-base text-stone-800 text-center flex items-center justify-center gap-1">
                              <span>{renderAppleText(photoCaption || "Brothers & Besties For Life! 📸⚡", 13)}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2.5 mt-2 w-full">
                          <button
                            type="button"
                            onClick={() => setScreen(0)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerConfetti();
                              setScreen(2);
                            }}
                            className={theme.btnActionClass}
                          >
                            <span>Next: Memory Chapters</span>
                            <AppleEmoji emoji="🎞️" size={13} className="ml-1" />
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* C) Multi-Scene: Star of the Day Polaroid */}
                    {isMultiScene && (
                      <div className="w-full flex flex-col items-center">
                        <div className="flex items-center justify-center gap-1.5 mb-0.5">
                          <h2 className={`${theme.fontFamily} text-xl sm:text-2xl font-bold ${theme.headingClass}`}>
                            The Star of the Day
                          </h2>
                          <AppleEmoji emoji="🌟" size={18} />
                        </div>

                        <div className="relative my-1 mx-auto inline-block">
                          <div className="polaroid-frame shadow-xl">
                            <div className="relative w-[170px] sm:w-[185px] h-[215px] sm:h-[235px] overflow-hidden rounded-[3px] bg-slate-100 shadow-inner">
                              <img
                                src={heroPhotoUrl}
                                alt={recipientName}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'center 12%' }}
                              />
                            </div>
                            <p className={`mt-2 ${theme.fontFamily} text-xs sm:text-sm text-slate-700 text-center flex items-center justify-center gap-1`}>
                              <span>{renderAppleText(photoCaption, 12)}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2.5 mt-2 w-full">
                          <button
                            type="button"
                            onClick={() => setScreen(0)}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={handleNextPhoto}
                            className={theme.btnActionClass}
                          >
                            <span>Next</span>
                            <AppleEmoji emoji="✨" size={13} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* SCENE 2 */}
                {/* -------------------------------------------------------- */}
                {screen === 2 && (
                  <div className="w-full flex flex-col items-center animate-fade-in-up py-1 max-w-[280px]">
                    {/* A) Golden Spark: Golden Gift Box Unboxing */}
                    {isGolden && (
                      <div className="w-full flex flex-col items-center">
                        <div className="text-center mb-1">
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-800 text-[10px] font-semibold mb-1">
                            <span>Surprise Package</span>
                            <AppleEmoji emoji="🎁" size={12} />
                          </div>
                          <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-950 leading-tight">
                            A Special Gift For You 🎁
                          </h2>
                          <p className="text-[11px] text-amber-900/70 mt-0.5 font-serif">
                            {giftOpened ? "Surprise unwrapped with love!" : "Tap the gift box below to unwrap"}
                          </p>
                        </div>

                        {!giftOpened ? (
                          <div
                            onClick={() => {
                              triggerConfetti();
                              setGiftOpened(true);
                            }}
                            className="group my-3 cursor-pointer select-none flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
                          >
                            <div className="relative w-28 h-28 flex items-center justify-center">
                              <span className="absolute -inset-1 rounded-2xl bg-amber-300/50 blur-lg animate-pulse" />
                              <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-300 p-1 shadow-xl border-2 border-white/70 flex flex-col items-center justify-center">
                                <div className="absolute inset-y-0 w-6 bg-rose-500/90 shadow-xs" />
                                <div className="absolute inset-x-0 h-6 bg-rose-500/90 shadow-xs" />
                                <div className="relative z-10 w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md border-2 border-rose-300">
                                  <AppleEmoji emoji="✨" size={18} />
                                </div>
                              </div>
                            </div>
                            <span className="mt-3 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white text-xs font-bold shadow-md cursor-pointer">
                              <span>Tap to Unbox</span>
                              <AppleEmoji emoji="🎁" size={13} />
                            </span>
                          </div>
                        ) : (
                          <div className="my-3 p-4 bg-white/95 rounded-2xl border border-amber-300 shadow-md text-center max-w-[250px] animate-pop-in">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 mb-2 shadow-2xs">
                              <AppleEmoji emoji="💛" size={22} />
                            </div>
                            <h3 className="font-serif font-bold text-sm text-amber-950">
                              Pure Gold Wishes!
                            </h3>
                            <p className="mt-1 font-serif text-xs text-amber-900 leading-relaxed font-semibold">
                              "You are pure gold to everyone around you! 💛✨"
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-center gap-2.5 mt-2 w-full">
                          <button
                            type="button"
                            onClick={() => setScreen(1)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerConfetti();
                              setScreen(3);
                            }}
                            className={theme.btnActionClass}
                          >
                            <span>Next: Star Photo</span>
                            <AppleEmoji emoji="🌟" size={13} className="ml-1" />
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* B) Retro Polaroid Scrapbook: Scrapbook Chapters Timeline */}
                    {isScrapbook && (
                      <div className="w-full flex flex-col items-center text-center space-y-2 py-1">
                        <div className="flex items-center justify-center gap-1.5 mb-0.5">
                          <h2 className="font-handwriting text-2xl font-bold text-stone-900">
                            Scrapbook Chapters
                          </h2>
                          <AppleEmoji emoji="📜" size={20} />
                        </div>

                        <div className="flex flex-col gap-2 w-full mt-1">
                          {[
                            {
                              ch: 'Chapter 1',
                              title: 'The Day We First Met ☕',
                              note: 'Where our great journey first began',
                              tape: 'washi-tape',
                              rot: '-rotate-1',
                            },
                            {
                              ch: 'Chapter 2',
                              title: 'Late Night Talks & Big Dreams ⚡',
                              note: 'Endless laughter, coffee and future plans',
                              tape: 'washi-tape-pink',
                              rot: 'rotate-1',
                            },
                            {
                              ch: 'Chapter 3',
                              title: 'To Every Adventure Ahead 🏔️',
                              note: 'The best chapters are still unwritten!',
                              tape: 'washi-tape-blue',
                              rot: '-rotate-0.5',
                            },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              className={`relative bg-[#FFFDF9] border border-amber-800/15 p-2.5 rounded-xl shadow-xs text-left ${item.rot} transition-transform hover:scale-[1.02]`}
                            >
                              <div className={`w-14 h-3 ${item.tape} mx-auto -mt-4 mb-1.5 rounded-xs opacity-85 select-none pointer-events-none`} />
                              <div className="flex items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <span className="text-[9px] font-bold tracking-wider uppercase text-amber-800/70 bg-amber-100/60 px-1.5 py-0.2 rounded-xs">
                                    {item.ch}
                                  </span>
                                  <h3 className="font-handwriting text-sm font-bold text-stone-900 mt-0.5 leading-snug">
                                    {item.title}
                                  </h3>
                                  <p className="text-[10px] text-stone-600 mt-0.5 font-sans leading-tight">
                                    {item.note}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-center gap-2.5 mt-2 w-full">
                          <button
                            type="button"
                            onClick={() => setScreen(1)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerConfetti();
                              setScreen(3);
                            }}
                            className={theme.btnActionClass}
                          >
                            <span>Next: 3 Reasons</span>
                            <AppleEmoji emoji="💫" size={13} className="ml-1" />
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* C) Multi-Scene: Before we proceed (Mood Check) */}
                    {isMultiScene && (
                      <div className="w-full flex flex-col items-center text-center animate-pop-in">
                        <div className={theme.subCardClass}>
                          <h2 className={`${theme.fontFamily} text-2xl sm:text-3xl font-bold leading-tight ${theme.headingClass}`}>
                            Before we proceed...
                          </h2>
                          <p className={`mt-2 text-xs ${theme.subtitleClass}`}>
                            How are you feeling today?
                          </p>

                          <div className="mt-5 flex flex-col gap-2.5 w-full">
                            <button
                              type="button"
                              onClick={handleChooseFeeling}
                              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 ${theme.btnMood1Class}`}
                            >
                              <span>Super Happy!</span>
                              <AppleEmoji emoji="🥳" size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={handleChooseFeeling}
                              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 ${theme.btnMood2Class}`}
                            >
                              <span>So Excited!</span>
                              <AppleEmoji emoji="✨" size={15} />
                            </button>

                            <div className="mt-1">
                              <button
                                type="button"
                                onClick={() => setScreen(1)}
                                className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs font-semibold transition-all active:scale-95 w-full cursor-pointer"
                              >
                                ← Back
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* SCENE 3 */}
                {/* -------------------------------------------------------- */}
                {screen === 3 && (
                  <div className="w-full flex flex-col items-center animate-fade-in-up space-y-1.5 py-1 max-w-[280px]">
                    {/* A) Golden Spark: Star of the Day Polaroid */}
                    {isGolden && (
                      <div className="w-full flex flex-col items-center">
                        <div className="flex items-center justify-center gap-1.5 mb-0.5">
                          <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-950">
                            The Star of the Day
                          </h2>
                          <AppleEmoji emoji="🌟" size={18} />
                        </div>

                        <div className="relative my-1 mx-auto inline-block">
                          <div className="polaroid-frame shadow-xl border border-amber-300/80 bg-gradient-to-b from-amber-50/50 to-white">
                            <div className="relative w-[170px] sm:w-[185px] h-[200px] sm:h-[220px] overflow-hidden rounded-[3px] bg-amber-50 shadow-inner">
                              <img
                                src={heroPhotoUrl}
                                alt={recipientName}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'center 12%' }}
                              />
                            </div>
                            <p className="mt-2 font-serif text-xs sm:text-sm text-amber-900 text-center font-semibold flex items-center justify-center gap-1">
                              <span>{renderAppleText(photoCaption || "Keep Shining Brighter Than Gold! 🎂✨", 12)}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2.5 mt-2 w-full">
                          <button
                            type="button"
                            onClick={() => setScreen(2)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerConfetti();
                              setScreen(4);
                            }}
                            className={theme.btnActionClass}
                          >
                            <span>Next: Secret Letter</span>
                            <AppleEmoji emoji="💌" size={13} className="ml-1" />
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* B) Retro Polaroid Scrapbook: 3 Special Reasons with Scrapbook Tape */}
                    {isScrapbook && (
                      <div className="w-full flex flex-col items-center text-center space-y-1.5 py-1">
                        <div className="flex items-center justify-center gap-1.5 mb-0.5">
                          <h2 className="font-handwriting text-2xl font-bold text-stone-900">
                            Why You're Special
                          </h2>
                          <AppleEmoji emoji="💫" size={20} />
                        </div>

                        <div className="flex flex-col gap-2 w-full mt-1">
                          {specialReasons.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="relative bg-[#FFFDF9] border border-amber-800/15 p-2.5 rounded-xl shadow-xs text-left"
                            >
                              <div className={`w-12 h-2.5 ${idx % 2 === 0 ? 'washi-tape' : 'washi-tape-pink'} mx-auto -mt-3.5 mb-1 rounded-xs opacity-80 select-none pointer-events-none`} />
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-amber-50/80 border border-amber-200/60 flex items-center justify-center shrink-0">
                                  <AppleEmoji emoji={item.icon || '⚡'} size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-handwriting text-base font-bold text-stone-900 leading-tight">
                                    {renderAppleText(item.title, 14)}
                                  </h3>
                                  <p className="text-[10px] text-stone-600 mt-0.5 leading-snug line-clamp-2 font-sans">
                                    {renderAppleText(item.desc || item.description, 10)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-center gap-2.5 mt-2.5 w-full">
                          <button
                            type="button"
                            onClick={() => setScreen(2)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerConfetti();
                              setScreen(4);
                            }}
                            className={theme.btnActionClass}
                          >
                            <span>Next: Secret Letter</span>
                            <AppleEmoji emoji="💌" size={13} className="ml-1" />
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* C) Multi-Scene: Why You're Special (3 Cards) */}
                    {isMultiScene && (
                      <div className="w-full flex flex-col items-center text-center space-y-1.5 py-1">
                        <div className="flex items-center justify-center gap-1.5 mb-0.5">
                          <h2 className={`${theme.fontFamily} text-xl sm:text-2xl font-bold ${theme.headingClass}`}>
                            Why You're Special
                          </h2>
                          <AppleEmoji emoji="💫" size={20} />
                        </div>

                        <div className="mt-2 flex flex-col gap-2 w-full">
                          {specialReasons.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className={`${theme.reasonCardClass} p-2.5 rounded-xl flex items-center gap-2.5 text-left min-h-[64px] transition-all`}
                            >
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${theme.iconBoxClass}`}>
                                <AppleEmoji emoji={item.icon || theme.primaryEmoji} size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-bold text-xs truncate leading-tight ${theme.headingClass}`}>
                                  {renderAppleText(item.title, 13)}
                                </h3>
                                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                                  {renderAppleText(item.desc || item.description, 11)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-center gap-2.5 mt-2.5 w-full">
                          <button
                            type="button"
                            onClick={() => setScreen(2)}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={handleNextReasons}
                            className={theme.btnActionClass}
                          >
                            <span>Next</span>
                            <AppleEmoji emoji="✨" size={13} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* SCENE 4: 3D ENVELOPE & SECRET LETTER */}
                {/* -------------------------------------------------------- */}
                {screen === 4 && (
                  <div className="w-full flex flex-col items-center text-center animate-fade-in-up py-1">
                    <h2
                      className={`${theme.fontFamily} text-xl sm:text-2xl font-bold mb-2.5 transition-colors duration-500 text-center ${
                        envelopeOpen ? 'text-white' : theme.headingClass
                      }`}
                    >
                      {renderAppleText(letterTitle, 16)}
                    </h2>

                    {/* CLOSED STATE: 3D SVG Realistic Envelope */}
                    {!envelopeOpen && (
                      <div className="flex flex-col items-center">
                        <div
                          onClick={handleOpenEnvelope}
                          className="group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                          title="Tap the envelope to open!"
                        >
                          <div
                            className={`relative w-[230px] sm:w-[245px] h-[155px] sm:h-[165px] rounded-2xl overflow-hidden shadow-2xl p-1 border-2 ${theme.envelopeGradient}`}
                          >
                            {/* Inner Dark Overlay */}
                            <div className={`absolute inset-0 ${theme.envelopeOverlay}`} />

                            {/* Peeking Letter Card Inside */}
                            <div className={`absolute top-3 left-4 right-4 h-[80px] bg-white rounded-t-xl shadow-md border-t-2 ${theme.envelopePeekingBorder} p-2 transform transition-transform duration-300 group-hover:-translate-y-2`}>
                              <div className={`flex items-center justify-center gap-1 font-bold text-xs ${theme.envelopePeekingText}`}>
                                {isGolden && (
                                  <>
                                    <span>Golden Wishes!</span>
                                    <AppleEmoji emoji="🎂" size={13} />
                                    <AppleEmoji emoji="✨" size={13} />
                                  </>
                                )}
                                {isScrapbook && (
                                  <>
                                    <span className="font-handwriting text-sm">Chapters of Memories</span>
                                    <AppleEmoji emoji="📸" size={13} />
                                    <AppleEmoji emoji="⚡" size={13} />
                                  </>
                                )}
                                {isMultiScene && (
                                  <>
                                    <span>Happy Birthday!</span>
                                    <AppleEmoji emoji="🎉" size={13} />
                                    <AppleEmoji emoji={theme.primaryEmoji} size={13} />
                                    <AppleEmoji emoji="✨" size={13} />
                                  </>
                                )}
                              </div>
                              <div className="mt-1 text-center text-[10px] text-slate-400 font-sans">
                                {isScrapbook ? 'A handwritten note for you...' : 'A special letter for you...'}
                              </div>
                            </div>

                            {/* SVG Realistic Folds matching reference */}
                            <div className="absolute inset-0 pointer-events-none">
                              <svg viewBox="0 0 245 165" className="w-full h-full" preserveAspectRatio="none">
                                <polygon points="0,0 0,165 122.5,90" fill={theme.envelopeFolds[0]} opacity="0.95" />
                                <polygon points="245,0 245,165 122.5,90" fill={theme.envelopeFolds[1]} opacity="0.95" />
                                <polygon points="0,165 245,165 122.5,82" fill={theme.envelopeFolds[2]} />
                              </svg>
                            </div>

                            {/* Center Medallion / Wax Stamp */}
                            <div
                              className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                              style={{ backgroundColor: letterWaxColor }}
                            >
                              <AppleEmoji emoji={letterSealEmoji} size={18} />
                            </div>
                          </div>
                        </div>

                        {/* Bounce Prompt */}
                        <p className={`mt-3 ${theme.subtitleClass} text-xs font-medium animate-bounce flex items-center gap-1`}>
                          <span>Tap the envelope to open!</span>
                          <AppleEmoji emoji="💌" size={14} />
                        </p>

                        {/* Back Button */}
                        <div className="mt-2.5">
                          <button
                            type="button"
                            onClick={() => setScreen(3)}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            ← Back
                          </button>
                        </div>
                      </div>
                    )}

                    {/* OPEN STATE: Expanded Letter Card */}
                    {envelopeOpen && (
                      <div className="w-full flex flex-col items-center animate-fade-in-up">
                        <div
                          className={`relative w-full max-w-[275px] bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border text-left ${theme.letterCardBorder}`}
                        >
                          {isScrapbook && (
                            <div className="w-16 h-3 washi-tape mx-auto -mt-6 mb-2 rounded-xs opacity-70 select-none pointer-events-none" />
                          )}

                          {/* Header */}
                          <div className={`flex items-center justify-between border-b ${theme.letterBorderBottom} pb-2 mb-2.5`}>
                            <div
                              className={`flex items-center gap-1.5 font-bold text-xs sm:text-sm ${theme.letterHeaderClass}`}
                            >
                              {isGolden && (
                                <>
                                  <span className="font-serif">Golden Wishes!</span>
                                  <AppleEmoji emoji="🎂" size={14} />
                                  <AppleEmoji emoji="✨" size={14} />
                                </>
                              )}
                              {isScrapbook && (
                                <>
                                  <span className="font-handwriting text-base">Memories & Keepsakes</span>
                                  <AppleEmoji emoji="📸" size={14} />
                                  <AppleEmoji emoji="⚡" size={14} />
                                </>
                              )}
                              {isMultiScene && (
                                <>
                                  <span>Happy Birthday!</span>
                                  <AppleEmoji emoji="🎉" size={14} />
                                  <AppleEmoji emoji={theme.primaryEmoji} size={14} />
                                  <AppleEmoji emoji="✨" size={14} />
                                </>
                              )}
                            </div>
                            <AppleEmoji emoji={isScrapbook ? '☕' : isGolden ? '🥂' : '🎂'} size={18} />
                          </div>

                          {/* Letter Body */}
                          <div className={`space-y-2 text-slate-700 text-xs leading-relaxed max-h-40 overflow-y-auto custom-scrollbar pr-1 whitespace-pre-line ${isScrapbook ? 'font-handwriting text-sm text-stone-800' : 'font-sans'}`}>
                            {renderAppleText(letterBody, isScrapbook ? 13 : 11)}
                          </div>

                          {/* Signature styled in template's font */}
                          <div className={`pt-2 mt-2 border-t ${theme.letterBorderBottom} text-right`}>
                            <p
                              className={`${theme.fontFamily} text-base sm:text-lg font-bold flex items-center justify-end gap-1 whitespace-pre-line ${theme.letterSignOffClass}`}
                            >
                              <span>{renderAppleText(letterSignOff, 15)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons Below Open Letter */}
                        <div className="flex items-center justify-center gap-2.5 mt-3.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEnvelopeOpen(false);
                              setScreen(3);
                            }}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-white/90 hover:text-white border border-white/30 bg-white/15 backdrop-blur-sm text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setEnvelopeOpen(false)}
                            className={theme.btnActionClass}
                          >
                            <span>Close Envelope</span>
                            <AppleEmoji emoji="💌" size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ========================================================== */}
              {/* BOTTOM iOS SAFARI ADDRESS BAR & TOOLBAR */}
              {/* ========================================================== */}
              <div className="w-full pb-1 z-30 shrink-0 select-none">
                {/* Floating Safari Address Bar */}
                <div className="mx-3 mb-1 px-3 py-1.5 rounded-2xl bg-[#e5e5ea]/85 backdrop-blur-md border border-slate-200/60 flex items-center justify-between text-xs text-slate-800 shadow-2xs">
                  {/* Left: AA Text Size Icon */}
                  <span className="text-[11px] font-semibold text-slate-700 select-none tracking-tight">
                    AA
                  </span>

                  {/* Center: Lock Icon + Live Link Domain */}
                  <div className="flex items-center gap-1 text-[11px] font-normal text-slate-800 truncate max-w-[165px]">
                    <Lock className="w-2.5 h-2.5 text-slate-600 shrink-0 stroke-[2.5]" />
                    <span className="truncate">{displayUrl}</span>
                  </div>

                  {/* Right: Safari Reload Button (Resets to Cover Scene) */}
                  <button
                    type="button"
                    onClick={handleResetScreen}
                    title="Reload Surprise"
                    className="text-slate-700 hover:text-slate-900 transition-colors p-0.5 cursor-pointer active:rotate-180 duration-300"
                  >
                    <RotateCw className="w-3 h-3 stroke-[2.2]" />
                  </button>
                </div>

                {/* Scene Indicator Dots (0-4) */}
                <div className="flex items-center justify-center gap-1.5 py-0.5 mb-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setScreen(i);
                        if (i !== 4) setEnvelopeOpen(false);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        screen === i
                          ? 'w-4 bg-blue-600 shadow-xs'
                          : 'w-1.5 bg-slate-400/60 hover:bg-slate-500'
                      }`}
                      aria-label={`Go to scene ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Safari Bottom 5-Button Toolbar */}
                <div className="px-5 pt-0.5 pb-1 flex items-center justify-between text-[#007aff]">
                  {/* 1. Back Chevron */}
                  <button
                    type="button"
                    onClick={handlePrevScene}
                    disabled={screen === 0}
                    className={`cursor-pointer transition-opacity ${
                      screen === 0 ? 'opacity-30' : 'hover:opacity-80 active:scale-95'
                    }`}
                    title="Previous Scene"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
                  </button>

                  {/* 2. Forward Chevron */}
                  <button
                    type="button"
                    onClick={handleNextScene}
                    disabled={screen === 4}
                    className={`cursor-pointer transition-opacity ${
                      screen === 4 ? 'opacity-30' : 'hover:opacity-80 active:scale-95'
                    }`}
                    title="Next Scene"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.2]" />
                  </button>

                  {/* 3. iOS Share Sheet Icon */}
                  <button
                    type="button"
                    onClick={triggerConfetti}
                    className="cursor-pointer hover:opacity-80 active:scale-95"
                    title="Share"
                  >
                    <svg
                      className="w-4 h-4 stroke-[2.2]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </button>

                  {/* 4. Bookmarks Book Icon */}
                  <button
                    type="button"
                    className="cursor-pointer hover:opacity-80 active:scale-95"
                    title="Bookmarks"
                  >
                    <BookOpen className="w-4 h-4 stroke-[2.2]" />
                  </button>

                  {/* 5. Safari Tabs Icon */}
                  <button
                    type="button"
                    className="cursor-pointer hover:opacity-80 active:scale-95"
                    title="Tabs"
                  >
                    <Copy className="w-4 h-4 stroke-[2.2]" />
                  </button>
                </div>

                {/* iOS Home Indicator Bar */}
                <div className="w-28 sm:w-32 h-1 bg-black rounded-full mx-auto mb-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
