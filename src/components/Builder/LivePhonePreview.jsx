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
 * All themes share the unified 5-scene flow with their distinct fonts, colors, and styling!
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
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary animate-pulse-glow cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 active:scale-95 cursor-pointer',
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
    fontFamily: 'font-cursive',
    ambientEmojis: ['🎂', '✨', '🥂', '💛', '⭐', '🎉', '🌟', '💫'],
    primaryEmoji: '🎂',
    containerBgClass: 'bg-soft-aesthetic-gold',
    envelopeCelebrationBg: 'bg-envelope-celebration-gold',
    cardClass: 'birthday-card-gold p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-gold p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-slate-900',
    accentTextClass: 'text-amber-500',
    subtitleClass: 'text-slate-500',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 shadow-md shadow-amber-500/30 active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 shadow-md shadow-amber-500/30 active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 shadow-xs active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 shadow-xs active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-gold',
    iconBoxClass: 'bg-amber-50 border border-amber-200/80',
    waxColor: '#D97706',
    sealEmoji: '⭐',
    envelopeGradient: 'bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 border-amber-300/50',
    envelopeOverlay: 'bg-amber-950/60',
    envelopePeekingBorder: 'border-amber-200',
    envelopePeekingText: 'text-amber-900',
    envelopeFolds: ['#92400e', '#b45309', '#d97706'],
    letterCardBorder: 'border-amber-200/90',
    letterBorderBottom: 'border-amber-100',
    letterHeaderClass: 'text-amber-900',
    letterSignOffClass: 'text-amber-800',
    confettiColors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff', '#38bdf8'],
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
    fontFamily: 'font-cursive',
    ambientEmojis: ['📸', '⚡', '🔥', '⭐', '✨', '🎉', '💫', '❤️'],
    primaryEmoji: '📸',
    containerBgClass: 'bg-soft-aesthetic-polaroid',
    envelopeCelebrationBg: 'bg-envelope-celebration-polaroid',
    cardClass: 'birthday-card-polaroid p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-polaroid p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-slate-900',
    accentTextClass: 'text-rose-600',
    subtitleClass: 'text-slate-500',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 shadow-md shadow-rose-600/30 hover:shadow-lg hover:shadow-rose-600/40 active:scale-95 cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 shadow-md shadow-rose-600/30 active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 shadow-md shadow-rose-600/30 active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-rose-950 bg-rose-50 hover:bg-rose-100 border border-rose-200/90 shadow-xs active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-rose-950 bg-rose-50 hover:bg-rose-100 border border-rose-200/90 shadow-xs active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-polaroid',
    iconBoxClass: 'bg-rose-50 border border-rose-200/80',
    waxColor: '#E11D48',
    sealEmoji: '⚡',
    envelopeGradient: 'bg-gradient-to-br from-rose-700 via-red-700 to-rose-900 border-rose-400/50',
    envelopeOverlay: 'bg-rose-950/60',
    envelopePeekingBorder: 'border-rose-200',
    envelopePeekingText: 'text-rose-950',
    envelopeFolds: ['#881337', '#9f1239', '#e11d48'],
    letterCardBorder: 'border-rose-200/90 bg-white/95',
    letterBorderBottom: 'border-rose-100',
    letterHeaderClass: 'text-rose-950',
    letterSignOffClass: 'text-rose-800',
    confettiColors: ['#e11d48', '#f43f5e', '#fb7185', '#ffffff', '#f59e0b'],
    defaultReasons: [
      { icon: '🤝', title: 'Loyal Brotherhood', desc: 'Standing together through every laugh, victory, and unforgettable chapter!' },
      { icon: '⚡', title: 'Unmatched Energy', desc: 'From crazy ideas to unstoppable adventures, our vibe is completely one of a kind!' },
      { icon: '📸', title: 'Timeless Memories', desc: 'Every road trip, late-night chat, and memory taped forever into our story!' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, looking back at every snapshot, adventure, and late-night laugh, I'm so grateful for our brotherhood and all the memories we share. 📸⚡\n\nYou bring unmatched loyalty, real energy, and genuine warmth into every day. Wishing you the happiest and most unforgettable birthday! ❤️⚡`,
    defaultSignOff: (senderName) => `Always your brother, ${senderName} 📸⚡`,
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
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-rose animate-pulse-glow-rose cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary-rose active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary-rose active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-rose-950 bg-rose-50 hover:bg-rose-100 border border-rose-200 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-pink-950 bg-pink-50/80 hover:bg-pink-100 border border-pink-200 active:scale-95 cursor-pointer',
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
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 shadow-md shadow-orange-500/30 active:scale-95 transition-all cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-orange-950 bg-orange-100/80 hover:bg-orange-100 border border-orange-200/80 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 shadow-md shadow-orange-500/30 active:scale-95 transition-all cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 shadow-orange-500/30 active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-orange-950 bg-orange-100/80 hover:bg-orange-100 border border-orange-200/80 shadow-xs active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-orange-900 bg-amber-100/80 hover:bg-amber-100 border border-amber-200/80 shadow-xs active:scale-95 cursor-pointer',
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
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-md shadow-purple-600/30 active:scale-95 transition-all cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-purple-950 bg-purple-100/80 hover:bg-purple-100 border border-purple-300/80 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-md shadow-purple-600/30 active:scale-95 transition-all cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-purple-600/30 active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-purple-950 bg-purple-100/80 hover:bg-purple-100 border border-purple-200/80 shadow-xs active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-purple-900 bg-violet-100/80 hover:bg-violet-100 border border-violet-200/80 shadow-xs active:scale-95 cursor-pointer',
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
  const [screen, setScreen] = useState(0); // 0: Cover/Landing, 1: Photo, 2: Mood/Feeling, 3: Reasons, 4: Envelope/Letter
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

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
  }, [formData.templateId]);

  const template = getTemplateById(formData.templateId || 'royal-sapphire');
  const theme = resolveTheme(formData.templateId, formData.gender || template?.gender);

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
              {/* INTERACTIVE 5-SCENE SCREEN BODY */}
              {/* ========================================================== */}
              <div className="flex-1 overflow-y-auto px-3.5 py-2 flex flex-col justify-center items-center text-center custom-scrollbar relative z-20">
                {/* -------------------------------------------------------- */}
                {/* SCENE 0: COVER / LANDING */}
                {/* -------------------------------------------------------- */}
                {screen === 0 && (
                  <div className="w-full flex items-center justify-center animate-fade-in-up px-1">
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
                          className={`flex items-center justify-center gap-1.5 ${theme.btnPrimaryClass}`}
                        >
                          <span>Tap to Open</span>
                          <AppleEmoji emoji="🎁" size={14} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* SCENE 1: STAR PHOTO CARD */}
                {/* -------------------------------------------------------- */}
                {screen === 1 && (
                  <div className="w-full flex flex-col items-center animate-fade-in-up py-1 max-w-[280px]">
                    <div className="w-full flex flex-col items-center">
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        <h2 className={`${theme.fontFamily} text-xl sm:text-2xl font-bold ${theme.headingClass}`}>
                          The Star of the Day
                        </h2>
                        <AppleEmoji emoji="🌟" size={18} />
                      </div>

                      <div className="relative my-1 mx-auto flex flex-col items-center justify-center">
                        <div className="polaroid-frame shadow-xl flex flex-col items-center justify-center mx-auto">
                          <div className="w-[180px] sm:w-[195px] h-[195px] sm:h-[210px] mx-auto overflow-hidden rounded-[10px] bg-slate-100 shadow-inner relative">
                            <img
                              src={heroPhotoUrl}
                              alt={recipientName}
                              className="w-full h-full object-cover object-center transition-all duration-300"
                            />
                          </div>
                          <p className={`mt-2.5 ${theme.fontFamily} text-xs sm:text-sm text-slate-700 text-center flex items-center justify-center gap-1 max-w-[180px] sm:max-w-[195px] leading-relaxed mx-auto`}>
                            <span>{renderAppleText(photoCaption, 12)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2.5 mt-2.5 w-full max-w-[240px]">
                        <button
                          type="button"
                          onClick={() => setScreen(0)}
                          className="flex-1 py-2 px-3 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs text-xs font-semibold transition-all active:scale-95 cursor-pointer text-center"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNextPhoto}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1 ${theme.btnActionClass}`}
                        >
                          <span>Next</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* SCENE 2: FEELING / MOOD CHECK */}
                {/* -------------------------------------------------------- */}
                {screen === 2 && (
                  <div className="w-full flex flex-col items-center text-center animate-pop-in">
                    <div className={theme.subCardClass}>
                      <h2 className={`${theme.fontFamily} text-xl sm:text-2xl font-bold leading-tight ${theme.headingClass}`}>
                        How do you feel today?
                      </h2>
                      <p className={`mt-1.5 text-xs ${theme.subtitleClass}`}>
                        Pick your vibe to unlock the next chapter ✨
                      </p>

                      <div className="mt-4 flex flex-col gap-2.5 w-full">
                        <button
                          type="button"
                          onClick={handleChooseFeeling}
                          className={`w-full flex items-center justify-center gap-2 ${theme.btnMood1Class}`}
                        >
                          <span>Super Happy!</span>
                          <AppleEmoji emoji="🥳" size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={handleChooseFeeling}
                          className={`w-full flex items-center justify-center gap-2 ${theme.btnMood2Class}`}
                        >
                          <span>So Excited!</span>
                          <AppleEmoji emoji="✨" size={15} />
                        </button>

                        <div className="mt-1">
                          <button
                            type="button"
                            onClick={() => setScreen(1)}
                            className="w-full py-2 px-3 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs text-xs font-semibold transition-all active:scale-95 cursor-pointer text-center"
                          >
                            ← Back
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* SCENE 3: REASONS WHY YOU'RE SPECIAL */}
                {/* -------------------------------------------------------- */}
                {screen === 3 && (
                  <div className="w-full flex flex-col items-center text-center space-y-1.5 py-1 max-w-[280px]">
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

                    <div className="flex items-center justify-center gap-2.5 mt-2.5 w-full max-w-[240px]">
                      <button
                        type="button"
                        onClick={() => setScreen(2)}
                        className="flex-1 py-2 px-3 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs text-xs font-semibold transition-all active:scale-95 cursor-pointer text-center"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextReasons}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1 ${theme.btnActionClass}`}
                      >
                        <span>Next</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* SCENE 4: 3D WAX-SEALED ENVELOPE & SECRET LETTER */}
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
                          title="Tap the wax seal to open!"
                        >
                          <div
                            className={`relative w-[230px] sm:w-[245px] h-[155px] sm:h-[165px] rounded-2xl overflow-hidden shadow-2xl p-1 border-2 ${theme.envelopeGradient}`}
                          >
                            {/* Inner Dark Overlay */}
                            <div className={`absolute inset-0 ${theme.envelopeOverlay}`} />

                            {/* Peeking Letter Card Inside */}
                            <div className={`absolute top-3 left-4 right-4 h-[80px] bg-white rounded-t-xl shadow-md border-t-2 ${theme.envelopePeekingBorder} p-2 transform transition-transform duration-300 group-hover:-translate-y-2`}>
                              <div className={`flex items-center justify-center gap-1 font-bold text-xs ${theme.envelopePeekingText}`}>
                                <span>Happy Birthday!</span>
                                <AppleEmoji emoji="🎉" size={13} />
                                <AppleEmoji emoji={theme.primaryEmoji} size={13} />
                                <AppleEmoji emoji="✨" size={13} />
                              </div>
                              <div className="mt-1 text-center text-[10px] text-slate-400 font-sans">
                                A special letter for you...
                              </div>
                            </div>

                            {/* SVG Realistic Folds */}
                            <div className="absolute inset-0 pointer-events-none">
                              <svg viewBox="0 0 245 165" className="w-full h-full" preserveAspectRatio="none">
                                <polygon points="0,0 0,165 122.5,90" fill={theme.envelopeFolds[0]} opacity="0.95" />
                                <polygon points="245,0 245,165 122.5,90" fill={theme.envelopeFolds[1]} opacity="0.95" />
                                <polygon points="0,165 245,165 122.5,82" fill={theme.envelopeFolds[2]} />
                              </svg>
                            </div>

                            {/* Center Wax Seal */}
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
                          <span>Tap the wax seal to open!</span>
                          <AppleEmoji emoji="💌" size={14} />
                        </p>

                        {/* Back Button */}
                        <div className="mt-2.5 w-full max-w-[240px] flex justify-center">
                          <button
                            type="button"
                            onClick={() => setScreen(3)}
                            className="py-2 px-6 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs text-xs font-semibold transition-all active:scale-95 cursor-pointer text-center"
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
                          {/* Header */}
                          <div className={`flex items-center justify-between border-b ${theme.letterBorderBottom} pb-2 mb-2.5`}>
                            <div
                              className={`flex items-center gap-1.5 font-bold text-xs sm:text-sm ${theme.letterHeaderClass}`}
                            >
                              <span className={theme.fontFamily}>{renderAppleText(letterTitle, 14)}</span>
                              <AppleEmoji emoji="✨" size={13} />
                            </div>
                            <AppleEmoji emoji={theme.primaryEmoji} size={18} />
                          </div>

                          {/* Letter Body */}
                          <div className="space-y-2 text-slate-700 text-xs leading-relaxed max-h-40 overflow-y-auto custom-scrollbar pr-1 whitespace-pre-line font-sans">
                            {renderAppleText(letterBody, 11)}
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
                        <div className="flex items-center justify-center gap-2.5 mt-3 w-full max-w-[240px]">
                          <button
                            type="button"
                            onClick={() => setEnvelopeOpen(false)}
                            className="flex-1 py-2 px-3 rounded-xl text-white/90 hover:text-white border border-white/30 bg-white/15 backdrop-blur-sm text-xs font-semibold transition-all active:scale-95 cursor-pointer text-center"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            onClick={handleResetScreen}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1 ${theme.btnActionClass}`}
                          >
                            <span>Replay</span>
                            <span>🔁</span>
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
