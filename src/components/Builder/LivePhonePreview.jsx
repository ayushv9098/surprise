import React, { useState, useRef, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { getTemplateById } from '../../data/templates';
import { soundEffects } from '../Templates/common/SoundEffects';
import ScrapbookPhoneView from './ScrapbookPhoneView';
import ApologyPhoneView from './ApologyPhoneView';
import RomancePhoneView from './RomancePhoneView';

// 8 Ambient Floating Apple Emojis Scaled for the Mobile Phone Simulator (strictly for Birthday)
// Positioned elegantly within top 6% to 68%
const AMBIENT_EMOJIS_CONFIG = [
  { left: '6%', top: '8%', duration: '7.5s', delay: '0s', size: 16 },
  { left: '86%', top: '6%', duration: '8.4s', delay: '1.2s', size: 15 },
  { left: '8%', top: '28%', duration: '9.2s', delay: '0.6s', size: 14 },
  { left: '88%', top: '26%', duration: '7.1s', delay: '2.1s', size: 16 },
  { left: '6%', top: '48%', duration: '8.8s', delay: '1.8s', size: 15 },
  { left: '88%', top: '46%', duration: '7.6s', delay: '0.4s', size: 16 },
  { left: '10%', top: '68%', duration: '9.5s', delay: '2.6s', size: 14 },
  { left: '84%', top: '66%', duration: '8.1s', delay: '1.5s', size: 15 },
];

/**
 * 6 Unique aesthetic themes powering the phone simulator
 * All themes share the unified 5-scene flow with their distinct fonts, colors, and styling!
 */
const THEMES = {
  'royal-sapphire': {
    id: 'royal-sapphire',
    name: 'Royal Sapphire 👑',
    category: 'birthday',
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
    category: 'birthday',
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
    category: 'birthday',
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
    category: 'birthday',
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
    category: 'birthday',
    gender: 'girl',
    fontFamily: 'font-serif',
    ambientEmojis: ['✨', '🍑', '🌟', '🧡', '👑', '🎉', '💫', '🌸'],
    primaryEmoji: '✨',
    containerBgClass: 'bg-gradient-to-b from-[#FFFDF9] via-[#FFF4EB] to-[#FEEAD8]',
    envelopeCelebrationBg: 'bg-gradient-to-b from-amber-950 via-rose-950 to-orange-950',
    cardClass: 'birthday-card-peach p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-peach p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-orange-950',
    accentTextClass: 'text-orange-600',
    subtitleClass: 'text-orange-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-peach animate-pulse-glow-peach cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-orange-950 bg-orange-100/80 hover:bg-orange-100 border border-orange-200/80 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 shadow-md shadow-orange-500/30 active:scale-95 transition-all cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 shadow-orange-500/30 active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-orange-950 bg-orange-100/80 hover:bg-orange-100 border border-orange-200/80 shadow-xs active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-orange-900 bg-amber-100/80 hover:bg-amber-100 border border-amber-200/80 shadow-xs active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-peach',
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
    category: 'birthday',
    gender: 'girl',
    fontFamily: 'font-cursive',
    ambientEmojis: ['💜', '🦋', '🌙', '✨', '🔮', '🎉', '💫', '🌸'],
    primaryEmoji: '💜',
    containerBgClass: 'bg-gradient-to-b from-[#FAF5FF] via-[#F3E8FF] to-[#EDE9FE]',
    envelopeCelebrationBg: 'bg-gradient-to-b from-purple-950 via-violet-950 to-indigo-950',
    cardClass: 'birthday-card-lavender p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-lavender p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-purple-950',
    accentTextClass: 'text-purple-600',
    subtitleClass: 'text-purple-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-lavender animate-pulse-glow-lavender cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-purple-950 bg-purple-100/80 hover:bg-purple-100 border border-purple-300/80 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-md shadow-purple-600/30 active:scale-95 transition-all cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 shadow-purple-600/30 active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-purple-950 bg-purple-100/80 hover:bg-purple-100 border border-purple-200/80 shadow-xs active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-purple-900 bg-violet-100/80 hover:bg-violet-100 border border-violet-200/80 shadow-xs active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-lavender',
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

  // =========================================================================
  // ROMANCE THEMES
  // =========================================================================
  'velvet-romance': {
    id: 'velvet-romance',
    name: 'Velvet Rose ❤️',
    category: 'romance',
    gender: 'girl',
    fontFamily: 'font-cursive',
    ambientEmojis: ['❤️', '🌹', '✨', '🍷', '💫', '💖', '💌', '🥀'],
    primaryEmoji: '❤️',
    containerBgClass: 'bg-soft-aesthetic-velvet',
    envelopeCelebrationBg: 'bg-envelope-celebration-velvet',
    cardClass: 'birthday-card-velvet p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-velvet p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-rose-950',
    accentTextClass: 'text-rose-600',
    subtitleClass: 'text-rose-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-velvet animate-pulse-glow-velvet cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-rose-950 bg-rose-50 hover:bg-rose-100 border border-rose-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary-velvet active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary-velvet active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-rose-950 bg-rose-50 hover:bg-rose-100 border border-rose-200/90 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-rose-900 bg-rose-100/70 hover:bg-rose-100 border border-rose-200 active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-velvet',
    iconBoxClass: 'bg-rose-50/90 border border-rose-200/80',
    waxColor: '#E11D48',
    sealEmoji: '❤️',
    envelopeGradient: 'bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 border-rose-400/40',
    envelopeOverlay: 'bg-rose-950/60',
    envelopePeekingBorder: 'border-rose-200',
    envelopePeekingText: 'text-rose-900',
    envelopeFolds: ['#881337', '#9f1239', '#e11d48'],
    letterCardBorder: 'border-rose-200/90',
    letterBorderBottom: 'border-rose-100',
    letterHeaderClass: 'text-rose-950',
    letterSignOffClass: 'text-rose-800',
    confettiColors: ['#e11d48', '#f43f5e', '#fb7185', '#ffffff', '#ffd1dc'],
    defaultReasons: [
      { icon: '❤️', title: 'Endless Devotion', desc: 'Every day with you feels like a romantic dream that never ends.' },
      { icon: '🌹', title: 'Graceful Elegance', desc: 'Your warm touch, gentle smile, and loving heart make my world complete.' },
      { icon: '💫', title: 'My Forever', desc: 'You are my safe harbor, my greatest adventure, and my eternal love.' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, words can never fully capture the deep warmth and joy you bring to my heart every single day. ❤️🌹\n\nThank you for loving me so purely and beautifully. May our love continue to blossom with timeless passion, sweetest laughter, and endless shared dreams! Always yours.`,
    defaultSignOff: (senderName) => `Forever & Always, ${senderName} ❤️🌹`,
  },

  'sunset-romance': {
    id: 'sunset-romance',
    name: 'Sunset Glow 🌅',
    category: 'romance',
    gender: 'girl',
    fontFamily: 'font-cursive',
    ambientEmojis: ['🌅', '✨', '🧡', '🌇', '💫', '💛', '💌', '🥂'],
    primaryEmoji: '✨',
    containerBgClass: 'bg-soft-aesthetic-sunset',
    envelopeCelebrationBg: 'bg-envelope-celebration-sunset',
    cardClass: 'birthday-card-sunset p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-sunset p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-amber-950',
    accentTextClass: 'text-amber-600',
    subtitleClass: 'text-amber-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-sunset animate-pulse-glow-sunset cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary-sunset active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary-sunset active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-100 border border-amber-200 active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-sunset',
    iconBoxClass: 'bg-amber-50 border border-amber-200/80',
    waxColor: '#F59E0B',
    sealEmoji: '✨',
    envelopeGradient: 'bg-gradient-to-br from-amber-500 via-rose-500 to-amber-700 border-amber-300/40',
    envelopeOverlay: 'bg-amber-950/60',
    envelopePeekingBorder: 'border-amber-200',
    envelopePeekingText: 'text-amber-900',
    envelopeFolds: ['#9a3412', '#c2410c', '#f59e0b'],
    letterCardBorder: 'border-amber-200/90',
    letterBorderBottom: 'border-amber-100',
    letterHeaderClass: 'text-amber-950',
    letterSignOffClass: 'text-amber-800',
    confettiColors: ['#f59e0b', '#fbbf24', '#f43f5e', '#ffffff', '#fde68a'],
    defaultReasons: [
      { icon: '🌅', title: 'Golden Warmth', desc: 'Watching the sunset with you makes time stop in the most magical way.' },
      { icon: '✨', title: 'Radiant Laughter', desc: 'Your smile brings a golden hue to the simplest everyday moments.' },
      { icon: '🧡', title: 'Warm Embrace', desc: 'In your arms is where I always feel completely at home and cherished.' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, you bring a warm, golden glow into my world that illuminates even the cloudiest days. 🌅✨\n\nThank you for every shared sunset, cozy whisper, and sweet smile. You are my greatest blessing, and I cherish every second by your side.`,
    defaultSignOff: (senderName) => `With golden love, ${senderName} 🌅💛`,
  },

  'celestial-love': {
    id: 'celestial-love',
    name: 'Celestial Indigo 🌌',
    category: 'romance',
    gender: 'girl',
    fontFamily: 'font-cursive',
    ambientEmojis: ['🌌', '🌙', '⭐', '✨', '💫', '🔮', '💙', '🪐'],
    primaryEmoji: '🌙',
    containerBgClass: 'bg-soft-aesthetic-celestial',
    envelopeCelebrationBg: 'bg-envelope-celebration-celestial',
    cardClass: 'birthday-card-celestial p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-celestial p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-indigo-950',
    accentTextClass: 'text-indigo-600',
    subtitleClass: 'text-indigo-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-celestial animate-pulse-glow-celestial cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-indigo-950 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary-celestial active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary-celestial active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-indigo-950 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/90 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-indigo-900 bg-indigo-100/70 hover:bg-indigo-100 border border-indigo-200 active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-celestial',
    iconBoxClass: 'bg-indigo-50 border border-indigo-200/80',
    waxColor: '#4F46E5',
    sealEmoji: '🌙',
    envelopeGradient: 'bg-gradient-to-br from-indigo-700 via-indigo-900 to-purple-950 border-indigo-400/40',
    envelopeOverlay: 'bg-indigo-950/60',
    envelopePeekingBorder: 'border-indigo-200',
    envelopePeekingText: 'text-indigo-900',
    envelopeFolds: ['#312e81', '#3730a3', '#4f46e5'],
    letterCardBorder: 'border-indigo-200/90',
    letterBorderBottom: 'border-indigo-100',
    letterHeaderClass: 'text-indigo-950',
    letterSignOffClass: 'text-indigo-800',
    confettiColors: ['#6366f1', '#818cf8', '#a5b4fc', '#ffffff', '#38bdf8'],
    defaultReasons: [
      { icon: '🌌', title: 'Written in the Stars', desc: 'Out of billions in this universe, finding you was my greatest miracle.' },
      { icon: '🌙', title: 'Infinite Calm', desc: 'Like the gentle moonlight, your love brings peace and calm to my soul.' },
      { icon: '⭐', title: 'My Guiding Star', desc: 'No matter how deep the night, your love always guides my path home.' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, you are the constellation that illuminates my entire universe. 🌌🌙\n\nI love you to the moon and beyond all galaxies. May our cosmic journey together be blessed with endless wonder, boundless joy, and infinite love.`,
    defaultSignOff: (senderName) => `To the stars & back, ${senderName} 🌌🌙`,
  },

  // =========================================================================
  // MEMORY SCRAPBOOK THEMES
  // =========================================================================
  'vintage-kodak': {
    id: 'vintage-kodak',
    name: 'Vintage Kodak 📸',
    category: 'scrapbook',
    gender: 'boy',
    fontFamily: 'font-cursive',
    ambientEmojis: ['📸', '⚡', '🎞️', '⭐', '📼', '☕', '🔥', '✨'],
    primaryEmoji: '📸',
    containerBgClass: 'bg-soft-aesthetic-vintage',
    envelopeCelebrationBg: 'bg-envelope-celebration-vintage',
    cardClass: 'birthday-card-vintage p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-vintage p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-amber-950',
    accentTextClass: 'text-amber-700',
    subtitleClass: 'text-amber-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-vintage animate-pulse-glow-vintage cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary-vintage active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary-vintage active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-100 border border-amber-200 active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-vintage',
    iconBoxClass: 'bg-amber-50 border border-amber-200/80',
    waxColor: '#D97706',
    sealEmoji: '⚡',
    envelopeGradient: 'bg-gradient-to-br from-amber-700 via-yellow-700 to-amber-900 border-amber-300/40',
    envelopeOverlay: 'bg-amber-950/60',
    envelopePeekingBorder: 'border-amber-200',
    envelopePeekingText: 'text-amber-900',
    envelopeFolds: ['#78350f', '#92400e', '#d97706'],
    letterCardBorder: 'border-amber-200/90',
    letterBorderBottom: 'border-amber-100',
    letterHeaderClass: 'text-amber-950',
    letterSignOffClass: 'text-amber-800',
    confettiColors: ['#d97706', '#b45309', '#f59e0b', '#ffffff', '#fef3c7'],
    defaultReasons: [
      { icon: '🎞️', title: 'Timeless Snapshots', desc: 'Every memory we capture becomes an instant classic in our story.' },
      { icon: '⚡', title: 'Candid Energy', desc: 'Unfiltered, raw, hilarious moments that keep getting better with time.' },
      { icon: '☕', title: 'Golden Chapters', desc: 'Years may pass, but our bond stays rich and warm like vintage film.' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, flipping through the scrapbook of all our memories, I smile at every candid shot and hilarious adventure we've shared. 📸🎞️\n\nThank you for being such an authentic, loyal companion. Here's to adding a thousand more unforgettable snapshots to our collection!`,
    defaultSignOff: (senderName) => `Captured with love, ${senderName} 📸⚡`,
  },

  'neon-nostalgia': {
    id: 'neon-nostalgia',
    name: 'Electric Vibes ⚡',
    category: 'scrapbook',
    gender: 'boy',
    fontFamily: 'font-cursive',
    ambientEmojis: ['⚡', '🔥', '🩵', '🛹', '✨', '💿', '💫', '🎉'],
    primaryEmoji: '⚡',
    containerBgClass: 'bg-soft-aesthetic-neon',
    envelopeCelebrationBg: 'bg-envelope-celebration-neon',
    cardClass: 'birthday-card-neon p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-neon p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-teal-950',
    accentTextClass: 'text-teal-600',
    subtitleClass: 'text-teal-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-neon animate-pulse-glow-neon cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-teal-950 bg-teal-50 hover:bg-teal-100 border border-teal-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary-neon active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary-neon active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-teal-950 bg-teal-50 hover:bg-teal-100 border border-teal-200/90 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-teal-900 bg-teal-100/70 hover:bg-teal-100 border border-teal-200 active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-neon',
    iconBoxClass: 'bg-teal-50 border border-teal-200/80',
    waxColor: '#0D9488',
    sealEmoji: '🔥',
    envelopeGradient: 'bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-800 border-cyan-300/40',
    envelopeOverlay: 'bg-teal-950/60',
    envelopePeekingBorder: 'border-teal-200',
    envelopePeekingText: 'text-teal-900',
    envelopeFolds: ['#134e4a', '#115e59', '#0d9488'],
    letterCardBorder: 'border-teal-200/90',
    letterBorderBottom: 'border-teal-100',
    letterHeaderClass: 'text-teal-950',
    letterSignOffClass: 'text-teal-800',
    confettiColors: ['#14b8a6', '#06b6d4', '#3b82f6', '#ffffff', '#facc15'],
    defaultReasons: [
      { icon: '⚡', title: 'High Voltage Energy', desc: 'Whenever you walk in, the excitement and positive vibe double instantly!' },
      { icon: '🔥', title: 'Fearless Spirit', desc: 'Always ready for spontaneous road trips, wild ideas, and big wins!' },
      { icon: '🩵', title: 'Pure Authenticity', desc: 'One hundred percent genuine, real, and always keeping it vibrant!' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, life with you is high-voltage electric excitement! ⚡🔥\n\nThank you for bringing non-stop laughter, spontaneous hype, and fearless energy into everything we do. Never dim your bright neon glow!`,
    defaultSignOff: (senderName) => `Stay Electric, ${senderName} ⚡🔥`,
  },

  'cozy-memories': {
    id: 'cozy-memories',
    name: 'Cozy Sunset ☕',
    category: 'scrapbook',
    gender: 'boy',
    fontFamily: 'font-cursive',
    ambientEmojis: ['☕', '🌻', '🍂', '🤎', '✨', '📖', '💫', '🌅'],
    primaryEmoji: '🌻',
    containerBgClass: 'bg-soft-aesthetic-cozy',
    envelopeCelebrationBg: 'bg-envelope-celebration-cozy',
    cardClass: 'birthday-card-cozy p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-cozy p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-orange-950',
    accentTextClass: 'text-orange-700',
    subtitleClass: 'text-orange-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-cozy animate-pulse-glow-cozy cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-orange-950 bg-orange-50 hover:bg-orange-100 border border-orange-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary-cozy active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary-cozy active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-orange-950 bg-orange-50 hover:bg-orange-100 border border-orange-200/90 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-orange-900 bg-orange-100/70 hover:bg-orange-100 border border-orange-200 active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-cozy',
    iconBoxClass: 'bg-orange-50 border border-orange-200/80',
    waxColor: '#C2410C',
    sealEmoji: '🌻',
    envelopeGradient: 'bg-gradient-to-br from-orange-700 via-amber-800 to-amber-950 border-orange-400/40',
    envelopeOverlay: 'bg-amber-950/60',
    envelopePeekingBorder: 'border-orange-200',
    envelopePeekingText: 'text-orange-900',
    envelopeFolds: ['#7c2d12', '#9a3412', '#c2410c'],
    letterCardBorder: 'border-orange-200/90',
    letterBorderBottom: 'border-orange-100',
    letterHeaderClass: 'text-orange-950',
    letterSignOffClass: 'text-orange-800',
    confettiColors: ['#ea580c', '#c2410c', '#f59e0b', '#ffffff', '#fed7aa'],
    defaultReasons: [
      { icon: '☕', title: 'Warm Comfort', desc: 'Heart-to-heart chats over coffee that feel like a soothing warm blanket.' },
      { icon: '🌻', title: 'Simple Joys', desc: 'Appreciating the peaceful, quiet, precious moments that mean the most.' },
      { icon: '📖', title: 'Treasured Chapters', desc: 'Every memory we build together is etched in warm terracotta gold.' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, you bring such peaceful warmth, grounded comfort, and sweet joy into my life. ☕🌻\n\nThank you for the endless cozy memories, deep conversations, and unwavering companionship. Here's to many more peaceful, golden afternoons together!`,
    defaultSignOff: (senderName) => `With warm hugs, ${senderName} ☕🌻`,
  },

  // =========================================================================
  // HEARTFELT APOLOGY THEMES
  // =========================================================================
  'gentle-peace': {
    id: 'gentle-peace',
    name: 'Olive Peace 🕊️',
    category: 'apology',
    gender: 'girl',
    fontFamily: 'font-cursive',
    ambientEmojis: ['🕊️', '🌿', '🍃', '💚', '✨', '🤍', '💫', '🌸'],
    primaryEmoji: '🕊️',
    containerBgClass: 'bg-soft-aesthetic-olive',
    envelopeCelebrationBg: 'bg-envelope-celebration-olive',
    cardClass: 'birthday-card-olive p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-olive p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-emerald-950',
    accentTextClass: 'text-emerald-700',
    subtitleClass: 'text-emerald-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-olive animate-pulse-glow-olive cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary-olive active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary-olive active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100/70 hover:bg-emerald-100 border border-emerald-200 active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-olive',
    iconBoxClass: 'bg-emerald-50 border border-emerald-200/80',
    waxColor: '#15803D',
    sealEmoji: '🕊️',
    envelopeGradient: 'bg-gradient-to-br from-emerald-600 via-green-700 to-emerald-900 border-emerald-300/40',
    envelopeOverlay: 'bg-emerald-950/60',
    envelopePeekingBorder: 'border-emerald-200',
    envelopePeekingText: 'text-emerald-900',
    envelopeFolds: ['#14532d', '#166534', '#15803d'],
    letterCardBorder: 'border-emerald-200/90',
    letterBorderBottom: 'border-emerald-100',
    letterHeaderClass: 'text-emerald-950',
    letterSignOffClass: 'text-emerald-800',
    confettiColors: ['#16a34a', '#22c55e', '#86efac', '#ffffff', '#dcfce7'],
    defaultReasons: [
      { icon: '🕊️', title: 'Heartfelt Regret', desc: 'I am truly sorry from the bottom of my heart for hurting you.' },
      { icon: '🌿', title: 'Your Precious Peace', desc: 'Your happiness and peace of mind matter more to me than anything else.' },
      { icon: '💚', title: 'A New Understanding', desc: 'I promise to listen more, care deeper, and never take your bond for granted.' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, I want to apologize sincerely from the deepest corner of my heart. 🕊️🌿\n\nSeeing you hurt breaks my spirit. You mean the world to me, and our bond is too precious to ever put at risk. I hope you can forgive me and allow us to heal together peacefully.`,
    defaultSignOff: (senderName) => `With sincere apology, ${senderName} 🕊️💚`,
  },

  'sweet-forgive': {
    id: 'sweet-forgive',
    name: 'Sweet Hugs 🥺',
    category: 'apology',
    gender: 'girl',
    fontFamily: 'font-cursive',
    ambientEmojis: ['🥺', '💜', '🌸', '🧸', '✨', '💌', '💫', '🤍'],
    primaryEmoji: '💜',
    containerBgClass: 'bg-soft-aesthetic-forgive',
    envelopeCelebrationBg: 'bg-envelope-celebration-forgive',
    cardClass: 'birthday-card-forgive p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-forgive p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-purple-950',
    accentTextClass: 'text-purple-600',
    subtitleClass: 'text-purple-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-forgive animate-pulse-glow-forgive cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-purple-950 bg-purple-50 hover:bg-purple-100 border border-purple-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary-forgive active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary-forgive active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-purple-950 bg-purple-50 hover:bg-purple-100 border border-purple-200/90 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-purple-900 bg-purple-100/70 hover:bg-purple-100 border border-purple-200 active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-forgive',
    iconBoxClass: 'bg-purple-50 border border-purple-200/80',
    waxColor: '#8B5CF6',
    sealEmoji: '💜',
    envelopeGradient: 'bg-gradient-to-br from-purple-600 via-pink-600 to-violet-800 border-purple-300/40',
    envelopeOverlay: 'bg-purple-950/60',
    envelopePeekingBorder: 'border-purple-200',
    envelopePeekingText: 'text-purple-900',
    envelopeFolds: ['#581c87', '#7c3aed', '#8b5cf6'],
    letterCardBorder: 'border-purple-200/90',
    letterBorderBottom: 'border-purple-100',
    letterHeaderClass: 'text-purple-950',
    letterSignOffClass: 'text-purple-800',
    confettiColors: ['#a855f7', '#c084fc', '#e879f9', '#ffffff', '#f3e8ff'],
    defaultReasons: [
      { icon: '🥺', title: 'Miss Your Smile', desc: 'Nothing feels right without your laughter and sweet presence around.' },
      { icon: '💜', title: 'True Regret', desc: 'I made a genuine mistake, and I am so sorry for causing you any pain.' },
      { icon: '🧸', title: 'Warmest Hugs', desc: 'Sending you the biggest, gentlest hug hoping we can share a smile again.' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, I am so very sorry. 🥺💜\n\nI miss your laughter, your sweet messages, and the gentle comfort of having you close. Please forgive my mistake — I promise to make it up to you with all my care and affection.`,
    defaultSignOff: (senderName) => `With warm hugs & sorry, ${senderName} 🥺💜`,
  },

  'fresh-start': {
    id: 'fresh-start',
    name: 'Sunrise Renewal 🌤️',
    category: 'apology',
    gender: 'girl',
    fontFamily: 'font-cursive',
    ambientEmojis: ['🌤️', '☀️', '🌻', '💛', '✨', '🌈', '💫', '🌱'],
    primaryEmoji: '🌤️',
    containerBgClass: 'bg-soft-aesthetic-sunrise',
    envelopeCelebrationBg: 'bg-envelope-celebration-sunrise',
    cardClass: 'birthday-card-sunrise p-5 sm:p-6 w-full text-center relative',
    subCardClass: 'birthday-card-sunrise p-5 sm:p-6 w-full max-w-[260px] text-center',
    headingClass: 'text-amber-950',
    accentTextClass: 'text-amber-600',
    subtitleClass: 'text-amber-900/70',
    btnPrimaryClass: 'py-2.5 px-6 rounded-xl text-xs font-bold text-white btn-primary-sunrise animate-pulse-glow-sunrise cursor-pointer',
    btnSecondaryClass: 'py-2 px-5 rounded-xl text-xs font-semibold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 active:scale-95 cursor-pointer',
    btnActionClass: 'py-2 px-4 rounded-xl text-xs font-bold text-white btn-primary-sunrise active:scale-95 cursor-pointer',
    btnMood1Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-white btn-primary-sunrise active:scale-95 cursor-pointer',
    btnMood2Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 active:scale-95 cursor-pointer',
    btnMood3Class: 'py-2.5 px-4 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-100 border border-amber-200 active:scale-95 cursor-pointer',
    reasonCardClass: 'special-reason-card-sunrise',
    iconBoxClass: 'bg-amber-50 border border-amber-200/80',
    waxColor: '#D97706',
    sealEmoji: '🌤️',
    envelopeGradient: 'bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 border-yellow-300/40',
    envelopeOverlay: 'bg-amber-950/60',
    envelopePeekingBorder: 'border-amber-200',
    envelopePeekingText: 'text-amber-900',
    envelopeFolds: ['#92400e', '#b45309', '#d97706'],
    letterCardBorder: 'border-amber-200/90',
    letterBorderBottom: 'border-amber-100',
    letterHeaderClass: 'text-amber-950',
    letterSignOffClass: 'text-amber-800',
    confettiColors: ['#eab308', '#facc15', '#fef08a', '#ffffff', '#fed7aa'],
    defaultReasons: [
      { icon: '🌤️', title: 'A Brighter Dawn', desc: 'Every sunrise brings an opportunity to start fresh, forgive, and grow stronger.' },
      { icon: '🌱', title: 'Growing Together', desc: 'Mistakes happen, but the strength of our bond is in how we overcome them.' },
      { icon: '💛', title: 'Golden Hope', desc: 'Looking forward with pure gratitude, hoping for smiles, warmth, and laughter.' },
    ],
    defaultLetter: (recipientName) =>
      `Dear ${recipientName}, with every sunrise comes the promise of a fresh start and brighter days. 🌤️🌱\n\nI am genuinely sorry for where things went wrong. I value you more than words can express, and I hope we can step forward into a warm new chapter together.`,
    defaultSignOff: (senderName) => `With hope & apology, ${senderName} 🌤️💛`,
  },
};

/**
 * Resolves theme configuration based on templateId, fallback gender, and occasion category
 */
const resolveTheme = (templateId, gender, category) => {
  let targetId = (templateId || '').trim();
  if (targetId === 'blush-romance') targetId = 'velvet-romance';
  if (targetId === 'heartfelt-apology') targetId = 'gentle-peace';

  if (THEMES[targetId]) {
    return THEMES[targetId];
  }

  // Exact & partial aliases lookup
  if (targetId.includes('velvet')) return THEMES['velvet-romance'];
  if (targetId.includes('sunset')) return THEMES['sunset-romance'];
  if (targetId.includes('celestial')) return THEMES['celestial-love'];
  if (targetId.includes('kodak')) return THEMES['vintage-kodak'];
  if (targetId.includes('neon')) return THEMES['neon-nostalgia'];
  if (targetId.includes('cozy')) return THEMES['cozy-memories'];
  if (targetId.includes('peace') || targetId.includes('olive')) return THEMES['gentle-peace'];
  if (targetId.includes('forgive') || targetId.includes('sweet')) return THEMES['sweet-forgive'];
  if (targetId.includes('fresh') || targetId.includes('sunrise') || targetId.includes('start')) return THEMES['fresh-start'];

  if (targetId.includes('sapphire') || targetId.includes('royal')) return THEMES['royal-sapphire'];
  if (targetId.includes('gold')) return THEMES['golden-birthday'];
  if (targetId.includes('polaroid')) return THEMES['polaroid-scrapbook'];
  if (targetId.includes('rose') || targetId.includes('blush')) return THEMES['blush-rose'];
  if (targetId.includes('peach')) return THEMES['princess-peach'];
  if (targetId.includes('lavender')) return THEMES['lavender-dream'];

  if (targetId.includes('romance') || targetId.includes('love') || targetId.includes('anniversary')) return THEMES['velvet-romance'];
  if (targetId.includes('scrapbook') || targetId.includes('retro') || targetId.includes('vintage')) return THEMES['vintage-kodak'];
  if (targetId.includes('apology') || targetId.includes('sorry')) return THEMES['gentle-peace'];

  if (category === 'romance') return THEMES['velvet-romance'];
  if (category === 'scrapbook') return THEMES['vintage-kodak'];
  if (category === 'apology') return THEMES['gentle-peace'];

  return gender === 'girl' ? THEMES['blush-rose'] : THEMES['royal-sapphire'];
};

const BASE_WIDTH = 320;
const BASE_HEIGHT = 650;

export default function LivePhonePreview({
  formData = {},
  activeSection,
  previewScreen,
  openEnvelope,
  syncNonce,
}) {
  const [screen, setScreen] = useState(0); // 0: Cover/Landing, 1: Photo, 2: Mood/Feeling, 3: Reasons, 4: Envelope/Letter
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [apologyForgiveState, setApologyForgiveState] = useState('initial'); // 'initial' | 'begging' | 'begging-2'

  // Dynamic Viewport Auto-Scaling Tracking
  const [windowDimensions, setWindowDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width: windowWidth, height: windowHeight } = windowDimensions;

  const autoScale = useMemo(() => {
    if (windowWidth < 640) {
      return Math.min(1.0, Math.max(0.70, +((windowHeight - 160) / BASE_HEIGHT).toFixed(2)));
    }
    // Desktop: Top Navbar (56px) + Bottom Bar (72px) + Breathing Margin (32px) = 160px
    const availableHeight = windowHeight - 160;
    return Math.min(1.0, Math.max(0.50, +(availableHeight / BASE_HEIGHT).toFixed(2)));
  }, [windowWidth, windowHeight]);

  const effectiveScale = autoScale;

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

  // Dedicated Experience States
  const [romanticTab, setRomanticTab] = useState('photos'); // 'photos' | 'letter' | 'quiz'
  const [resetNonce, setResetNonce] = useState(0);
  const [scrapbookTab, setScrapbookTab] = useState('timeline'); // 'timeline' | 'jokes' | 'scratch' | 'letter'
  const [apologyTab, setApologyTab] = useState('forgive'); // 'forgive' | 'treaty' | 'promises' | 'letter'

  // Synchronize simulator scene with active form section or focused field
  useEffect(() => {
    if (typeof previewScreen === 'number') {
      setScreen(previewScreen);
      if (previewScreen === 0 || previewScreen === 1) {
        setRomanticTab('photos');
        setScrapbookTab('timeline');
        setApologyTab('forgive');
      } else if (previewScreen === 3) {
        setRomanticTab('quiz');
        setScrapbookTab('jokes');
        setApologyTab('treaty');
      } else if (previewScreen === 4) {
        setRomanticTab('letter');
        setEnvelopeOpen(true);
        setScrapbookTab('letter');
        setApologyTab('letter');
      }
    }
  }, [previewScreen, syncNonce]);

  useEffect(() => {
    if (typeof openEnvelope === 'boolean') {
      setEnvelopeOpen(openEnvelope);
      if (openEnvelope) {
        setRomanticTab('letter');
      }
    }
  }, [openEnvelope, syncNonce]);

  useEffect(() => {
    if (activeSection === 'details') {
      setScreen(0);
      setEnvelopeOpen(false);
      setRomanticTab('photos');
      setScrapbookTab('timeline');
      setApologyTab('forgive');
    } else if (activeSection === 'media') {
      setScreen(1);
      setEnvelopeOpen(false);
      setRomanticTab('photos');
      setScrapbookTab('timeline');
      setApologyTab('forgive');
    } else if (activeSection === 'surprises') {
      setScreen(3);
      setEnvelopeOpen(false);
      setRomanticTab('quiz');
      setScrapbookTab('jokes');
      setApologyTab('treaty');
    } else if (activeSection === 'letter') {
      setScreen(4);
      setEnvelopeOpen(true);
      setRomanticTab('letter');
      setScrapbookTab('letter');
      setApologyTab('letter');
    }
  }, [activeSection]);

  // Reset simulator state immediately whenever user selects another template or category
  useEffect(() => {
    setScreen(0);
    setEnvelopeOpen(false);
    setApologyForgiveState('initial');
    setRomanticTab('photos');
    setScrapbookTab('timeline');
    setApologyTab('forgive');
    setBookmarkSaved(false);
  }, [formData.templateId, formData.category]);

  const template = getTemplateById(formData.templateId || 'royal-sapphire');
  const occasionCategory =
    formData.category ||
    template?.category ||
    'birthday';
  const theme = resolveTheme(formData.templateId, formData.gender || template?.gender, occasionCategory);

  const isRomance =
    occasionCategory === 'romance' ||
    ['velvet-romance', 'sunset-romance', 'celestial-love', 'blush-romance'].includes(theme.id) ||
    ['velvet-romance', 'sunset-romance', 'celestial-love', 'blush-romance'].includes(formData.templateId) ||
    Boolean(
      formData.templateId && (
        formData.templateId.includes('romance') ||
        formData.templateId.includes('velvet') ||
        formData.templateId.includes('sunset') ||
        formData.templateId.includes('celestial')
      )
    );

  const isScrapbook =
    !isRomance && (
      occasionCategory === 'scrapbook' ||
      ['vintage-kodak', 'neon-nostalgia', 'cozy-memories'].includes(theme.id) ||
      ['vintage-kodak', 'neon-nostalgia', 'cozy-memories'].includes(formData.templateId)
    );

  const isApology =
    !isRomance && !isScrapbook && (
      occasionCategory === 'apology' ||
      ['gentle-peace', 'sweet-forgive', 'fresh-start', 'heartfelt-apology'].includes(theme.id) ||
      ['gentle-peace', 'sweet-forgive', 'fresh-start', 'heartfelt-apology'].includes(formData.templateId)
    );

  const isBirthday = !isRomance && !isScrapbook && !isApology;

  const isGirl = theme.gender === 'girl';
  const recipientName = formData.recipientName || (isGirl ? 'Sarah' : 'Rohan');
  const senderName = formData.senderName || (isGirl ? 'Elena' : 'Alex');

  const hasExplicitOccasion = formData.occasion !== undefined;
  const rawOccasion = (formData.occasion || '').trim();
  const nameToDisplay = (formData.recipientName || '').trim() || (isGirl ? 'Sarah' : 'Rohan');
  const celebrationEmoji = theme.primaryEmoji;

  // Smart occasion greeting determination
  let line1Text = '';
  let line2Text = '';

  const isDefaultBirthdayOccasion =
    !rawOccasion ||
    rawOccasion.toLowerCase().includes('happy birthday') ||
    rawOccasion.toLowerCase().includes('birthday');

  if (hasExplicitOccasion && rawOccasion === '') {
    // User explicitly cleared occasion: do NOT force fallback
    line1Text = '';
    line2Text = `${nameToDisplay}! ${celebrationEmoji}`;
  } else if (rawOccasion && (!isDefaultBirthdayOccasion || isBirthday)) {
    if (rawOccasion.includes(',')) {
      const commaIdx = rawOccasion.indexOf(',');
      line1Text = rawOccasion.slice(0, commaIdx + 1).trim();
      const remainder = rawOccasion.slice(commaIdx + 1).trim();
      line2Text = remainder || `${nameToDisplay}! ${celebrationEmoji}`;
    } else {
      if (isRomance) {
        line1Text = rawOccasion;
        line2Text = `${nameToDisplay} ❤️`;
      } else if (isScrapbook) {
        line1Text = rawOccasion;
        line2Text = `${nameToDisplay}! 📸`;
      } else if (isApology) {
        line1Text = rawOccasion;
        line2Text = `Dear ${nameToDisplay} 🤍`;
      } else {
        line1Text = `${rawOccasion},`;
        line2Text = `${nameToDisplay}! ${celebrationEmoji}`;
      }
    }
  } else {
    if (isRomance) {
      line1Text = 'To My One & Only,';
      line2Text = `${nameToDisplay} ❤️`;
    } else if (isScrapbook) {
      line1Text = 'The Scrapbook of Us,';
      line2Text = `${nameToDisplay}! 📸`;
    } else if (isApology) {
      line1Text = 'A Sincere Message,';
      line2Text = `For ${nameToDisplay} 🤍`;
    } else {
      line1Text = 'Happy Birthday,';
      line2Text = `${nameToDisplay}! ${celebrationEmoji}`;
    }
  }

  // Dynamic subtitle adapted to occasion - Only fallback if undefined!
  let displaySubtitle = '';
  if (formData.subtitle !== undefined) {
    displaySubtitle = (formData.subtitle || '').trim();
  } else {
    if (isRomance) {
      displaySubtitle = template?.defaultSubtitle || 'Every single second with you is my favorite memory.';
    } else if (isScrapbook) {
      displaySubtitle = template?.defaultSubtitle || 'Taped forever into the scrapbook of our greatest adventures.';
    } else if (isApology) {
      displaySubtitle = template?.defaultSubtitle || 'I made a mistake, and your happiness means everything to me.';
    } else {
      displaySubtitle = template?.defaultSubtitle || 'I have a small surprise for you...';
    }
  }

  const heroPhotoUrl = formData.heroPhoto || formData.photos?.[0]?.url || template?.samplePhoto;

  const defaultCaptions = {
    'royal-sapphire': 'Keep Rocking Always! 👑🔥',
    'golden-birthday': 'Keep Shining Brighter Than Gold! 🎂✨',
    'polaroid-scrapbook': 'Brothers & Besties For Life! 📸⚡',
    'blush-rose': 'Stay Wonderful Always! 🌸✨',
    'princess-peach': 'May All Your Wishes Sparkle! ✨💖',
    'lavender-dream': 'Never Stop Dreaming Beautiful Dreams! 💜🦋',
    'velvet-romance': 'My favorite smile in the world 🌹',
    'sunset-romance': 'Golden Moments With You 🌅✨',
    'celestial-love': 'Written in the Stars 🌌🌙',
    'vintage-kodak': 'A moment frozen in time 📸',
    'neon-nostalgia': 'Electric Memories & Good Times ⚡🔥',
    'cozy-memories': 'Warm Days & Sweet Conversations ☕🌻',
    'gentle-peace': 'Cherishing our beautiful bond 🤍',
    'sweet-forgive': 'Cherishing our beautiful bond 🤍',
    'fresh-start': 'Cherishing our beautiful bond 🤍',
  };

  // Dynamic photo caption - Only fallback if undefined!
  let photoCaption = '';
  if (formData.photoCaption !== undefined) {
    photoCaption = (formData.photoCaption || '').trim();
  } else if (formData.photos?.[0]?.caption !== undefined) {
    photoCaption = (formData.photos[0].caption || '').trim();
  } else {
    if (isRomance) {
      photoCaption = defaultCaptions[theme.id] || 'My favorite smile in the world 🌹';
    } else if (isScrapbook) {
      photoCaption = defaultCaptions[theme.id] || 'A moment frozen in time 📸';
    } else if (isApology) {
      photoCaption = defaultCaptions[theme.id] || 'Cherishing our beautiful bond 🤍';
    } else {
      photoCaption = defaultCaptions[theme.id] || (isGirl ? 'Stay Wonderful Always! 🌸✨' : 'Keep Rocking Always! 👑🔥');
    }
  }

  const isDefaultBirthdayReasons =
    formData.specialReasons &&
    formData.specialReasons.length === 3 &&
    (formData.specialReasons[0]?.title === 'Lucky to Have You' ||
      formData.specialReasons[0]?.title === 'Pure Sunshine');

  const specialReasons =
    (!isBirthday && isDefaultBirthdayReasons)
      ? theme.defaultReasons
      : (formData.specialReasons && formData.specialReasons.length > 0)
      ? formData.specialReasons
      : (formData.reasons && formData.reasons.length > 0)
      ? formData.reasons
      : theme.defaultReasons;

  const defaultLetterTitles = {
    romance: 'A Love Letter For You 💕',
    scrapbook: 'A Page From Our Scrapbook 📜',
    apology: 'A Sincere Peace Offering 🕊️',
    birthday: 'A Little Note For You',
  };

  const rawLetterTitle =
    (typeof formData.letter === 'object' ? formData.letter?.title : null) ||
    formData.letterTitle;

  const letterTitle =
    rawLetterTitle && rawLetterTitle !== 'A Little Note For You'
      ? rawLetterTitle
      : isRomance
      ? defaultLetterTitles.romance
      : isScrapbook
      ? defaultLetterTitles.scrapbook
      : isApology
      ? defaultLetterTitles.apology
      : defaultLetterTitles.birthday;

  // Dynamic letter body & sign-off - Only fallback if undefined!
  const rawLetterBody =
    typeof formData.letter === 'object' && formData.letter !== null && formData.letter.content !== undefined
      ? formData.letter.content
      : (typeof formData.letter === 'string' ? formData.letter : formData.letterBody);

  const letterBody = rawLetterBody !== undefined
    ? rawLetterBody
    : theme.defaultLetter(recipientName);

  const rawLetterSignOff =
    typeof formData.letter === 'object' && formData.letter !== null && formData.letter.signOff !== undefined
      ? formData.letter.signOff
      : formData.letterSignOff;

  const letterSignOff = rawLetterSignOff !== undefined
    ? rawLetterSignOff
    : theme.defaultSignOff(senderName);

  const rawSealEmoji =
    (typeof formData.letter === 'object' && formData.letter?.sealEmoji) ||
    formData.sealEmoji;

  const letterSealEmoji =
    rawSealEmoji && rawSealEmoji !== '👑' && rawSealEmoji !== '🌸' && rawSealEmoji !== '⭐'
      ? rawSealEmoji
      : theme.sealEmoji || (isRomance ? '❤️' : isScrapbook ? '⚡' : isApology ? '🕊️' : '🎁');

  const rawWaxColor =
    (typeof formData.letter === 'object' && formData.letter?.waxColor) ||
    formData.waxColor;

  const letterWaxColor = rawWaxColor || theme.waxColor;

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
    soundEffects.playPop();
    triggerConfetti();
    setScreen(0);
    setEnvelopeOpen(false);
    setRomanticTab('photos');
    setScrapbookTab('timeline');
    setApologyTab('forgive');
    setApologyForgiveState('initial');
    setResetNonce((prev) => prev + 1);
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

  // Dynamic background styling matching the chosen template
  const isCelebrationBg = screen === 4 && envelopeOpen;
  const isDarkScene = isCelebrationBg;
  const containerBgClass = isCelebrationBg
    ? theme.envelopeCelebrationBg
    : theme.containerBgClass;

  const activeAmbientEmojis = theme.ambientEmojis;

  return (
    <div className="flex flex-col items-center justify-center w-full select-none py-1">
      {/* Viewport Auto-Scaling Dimension-Matched Container */}
      <div
        className="relative transition-all duration-150 flex flex-col items-center justify-start"
        style={{
          width: `${Math.round(BASE_WIDTH * effectiveScale)}px`,
          height: `${Math.round(BASE_HEIGHT * effectiveScale)}px`,
        }}
      >
        <div
          style={{
            width: `${BASE_WIDTH}px`,
            height: `${BASE_HEIGHT}px`,
            transform: `scale(${effectiveScale})`,
            transformOrigin: 'top center',
          }}
          className="relative shrink-0 select-none"
        >
          {/* =================================================================== */}
          {/* REALISTIC IPHONE 15 / 16 PRO TITANIUM SIMULATOR CHASSIS */}
          {/* =================================================================== */}
          <div className="relative w-[300px] min-[360px]:w-[320px] h-[650px] flex items-center justify-center">
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
            <div className="w-full h-full p-[2.5px] rounded-[50px] bg-gradient-to-b from-[#8a8698] via-[#4b4859] to-[#6b667c] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.15)] flex flex-col">
              {/* Deep Black Uniform Screen Bezel */}
              <div className="w-full h-full p-2.5 bg-black rounded-[48px] flex flex-col">
                {/* Phone Screen Canvas */}
                <div
                  className={`relative w-full h-full ${containerBgClass} before:!absolute before:!inset-0 rounded-[38px] overflow-hidden flex flex-col transition-colors duration-500`}
                >
              {/* Scoped Confetti Canvas strictly bounded inside the phone frame */}
              <canvas
                ref={confettiCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-30"
              />

              {/* 8 Ambient Floating Apple Emojis Scaled to Selected Theme (strictly for Birthday to keep Romance/Scrapbook/Apology clean and uncluttered) */}
              {isBirthday && AMBIENT_EMOJIS_CONFIG.map((cfg, idx) => (
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
                <div className="w-24 h-6 bg-black rounded-full flex items-center justify-end pr-2.5 shadow-sm pointer-events-none">
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
              {/* INTERACTIVE SCREEN BODY: DEDICATED OCCASION EXPERIENCES */}
              {/* ========================================================== */}
              {isRomance ? (
                <RomancePhoneView
                  formData={formData}
                  theme={theme}
                  triggerConfetti={triggerConfetti}
                  onReset={handleResetScreen}
                  activeTab={romanticTab}
                  onTabChange={setRomanticTab}
                  openEnvelope={envelopeOpen}
                  resetNonce={resetNonce}
                />
              ) : isScrapbook ? (
                <ScrapbookPhoneView
                  formData={formData}
                  theme={theme}
                  triggerConfetti={triggerConfetti}
                  onReset={handleResetScreen}
                  activeTab={scrapbookTab}
                  onTabChange={setScrapbookTab}
                  openEnvelope={envelopeOpen}
                />
              ) : isApology ? (
                <ApologyPhoneView
                  formData={formData}
                  theme={theme}
                  triggerConfetti={triggerConfetti}
                  onReset={handleResetScreen}
                  activeTab={apologyTab}
                  onTabChange={setApologyTab}
                  openEnvelope={envelopeOpen}
                />
              ) : (
                <div className="flex-1 overflow-y-auto px-3.5 py-2 flex flex-col justify-center items-center text-center custom-scrollbar relative z-20">
                {/* -------------------------------------------------------- */}
                {/* SCENE 0: COVER / LANDING */}
                {/* -------------------------------------------------------- */}
                {screen === 0 && (
                  <div className="w-full flex items-center justify-center animate-fade-in-up px-1">
                    <div className={theme.cardClass}>
                      {/* Occasion / Keepsake Badge */}
                      {isRomance && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/90 border border-rose-200/80 text-[11px] font-semibold text-rose-700 mb-2.5 shadow-2xs">
                          <AppleEmoji emoji="❤️" size={13} />
                          <span>A Love Letter For You</span>
                          <AppleEmoji emoji="✨" size={13} />
                        </div>
                      )}
                      {isScrapbook && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-200/80 text-[11px] font-semibold text-amber-800 mb-2.5 shadow-2xs">
                          <AppleEmoji emoji="📸" size={13} />
                          <span>The Scrapbook of Us • Vol. 1</span>
                          <AppleEmoji emoji="⚡" size={13} />
                        </div>
                      )}
                      {isApology && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800 mb-2.5 shadow-2xs">
                          <AppleEmoji emoji="🕊️" size={13} />
                          <span>A Sincere Message From My Heart</span>
                          <AppleEmoji emoji="🤍" size={13} />
                        </div>
                      )}

                      <div className={`mb-2.5 inline-block ${isRomance ? 'animate-pulse' : 'animate-bounce'}`}>
                        <AppleEmoji emoji={theme.primaryEmoji} size={38} />
                      </div>

                      <h1 className={`${theme.fontFamily} text-2xl sm:text-3xl font-bold leading-tight ${theme.headingClass}`}>
                        {line1Text ? <span>{renderAppleText(line1Text, 24)}</span> : null}
                        <span className={`block mt-1 ${theme.accentTextClass}`}>
                          {renderAppleText(line2Text, 24)}
                        </span>
                      </h1>

                      {displaySubtitle ? (
                        <p className={`mt-3 text-xs sm:text-sm ${theme.subtitleClass} leading-relaxed font-normal`}>
                          {renderAppleText(displaySubtitle, 12)}
                        </p>
                      ) : null}

                      <div className="mt-5 flex justify-center">
                        <button
                          type="button"
                          onClick={handleOpenLanding}
                          className={`flex items-center justify-center gap-1.5 ${theme.btnPrimaryClass}`}
                        >
                          {isRomance ? (
                            <>
                              <span>Tap to Unseal My Heart</span>
                              <AppleEmoji emoji="❤️" size={14} className="ml-1" />
                            </>
                          ) : isScrapbook ? (
                            <>
                              <span>Tap to Open Journal</span>
                              <AppleEmoji emoji="📖" size={14} className="ml-1" />
                            </>
                          ) : isApology ? (
                            <>
                              <span>Tap to Open With Love</span>
                              <AppleEmoji emoji="💌" size={14} className="ml-1" />
                            </>
                          ) : (
                            <>
                              <span>Tap to Open</span>
                              <AppleEmoji emoji="🎁" size={14} className="ml-1" />
                            </>
                          )}
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
                          {isRomance
                            ? 'The One Who Holds My Heart'
                            : isScrapbook
                            ? 'A Moment Frozen in Time'
                            : isApology
                            ? 'Cherishing Our Bond'
                            : 'The Star of the Day'}
                        </h2>
                        <AppleEmoji
                          emoji={isRomance ? '🌹' : isScrapbook ? '📸' : isApology ? '🤍' : '🌟'}
                          size={18}
                        />
                      </div>

                      <div className="relative my-1 mx-auto flex flex-col items-center justify-center">
                        {/* Washi tape accent for Scrapbook */}
                        {isScrapbook && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-16 h-4 bg-amber-200/90 border border-amber-300/80 shadow-xs rotate-[-2.5deg] rounded-xs flex items-center justify-center pointer-events-none">
                            <div className="w-12 border-t border-dashed border-amber-500/40" />
                          </div>
                        )}

                        {/* Rose petal pin accent for Romance */}
                        {isRomance && (
                          <div className="absolute -top-2.5 -right-2 z-20 w-7 h-7 rounded-full bg-rose-100/95 border border-rose-300/80 flex items-center justify-center shadow-xs pointer-events-none">
                            <AppleEmoji emoji="🌹" size={14} />
                          </div>
                        )}

                        {/* Serene olive leaf accent for Apology */}
                        {isApology && (
                          <div className="absolute -top-2.5 -right-2 z-20 w-7 h-7 rounded-full bg-emerald-50/95 border border-emerald-200/80 flex items-center justify-center shadow-xs pointer-events-none">
                            <AppleEmoji emoji="🌿" size={14} />
                          </div>
                        )}

                        <div
                          className={`polaroid-frame shadow-xl flex flex-col items-center justify-center mx-auto ${
                            isRomance
                              ? 'border border-rose-200/70 shadow-rose-900/10'
                              : isScrapbook
                              ? 'border border-amber-200/70 shadow-amber-900/10'
                              : isApology
                              ? 'border border-emerald-100 shadow-emerald-900/10'
                              : ''
                          }`}
                        >
                          <div className="w-[180px] sm:w-[195px] h-[195px] sm:h-[210px] mx-auto overflow-hidden rounded-[10px] bg-slate-100 shadow-inner relative">
                            <img
                              src={heroPhotoUrl}
                              alt={recipientName}
                              className="w-full h-full object-cover object-center transition-all duration-300"
                            />
                          </div>
                          {photoCaption ? (
                            <p className={`mt-2.5 ${theme.fontFamily} text-xs sm:text-sm text-slate-700 text-center flex items-center justify-center gap-1 max-w-[180px] sm:max-w-[195px] leading-relaxed mx-auto`}>
                              <span>{renderAppleText(photoCaption, 12)}</span>
                            </p>
                          ) : null}
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
                        {isApology
                          ? 'Will you forgive me? 🥺'
                          : isRomance
                          ? 'How Much I Adore You ✨'
                          : isScrapbook
                          ? 'Our Greatest Adventures ⚡'
                          : 'How do you feel today?'}
                      </h2>
                      <p className={`mt-1.5 text-xs ${theme.subtitleClass}`}>
                        {isApology
                          ? 'Your forgiveness and smile mean the world to me 🤍'
                          : isRomance
                          ? 'Pick how your heart beats today 💕'
                          : isScrapbook
                          ? 'Select your favorite chapter highlight 🎞️'
                          : 'Pick your vibe to unlock the next chapter ✨'}
                      </p>

                      <div className="mt-4 flex flex-col gap-2.5 w-full">
                        {isApology ? (
                          <>
                            <button
                              type="button"
                              onClick={handleChooseFeeling}
                              className={`w-full flex items-center justify-center gap-2 ${theme.btnMood1Class}`}
                            >
                              <span>Yes, let's make up</span>
                              <AppleEmoji emoji="❤️" size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (apologyForgiveState === 'initial') {
                                  setApologyForgiveState('begging');
                                } else if (apologyForgiveState === 'begging') {
                                  setApologyForgiveState('begging-2');
                                } else {
                                  handleChooseFeeling();
                                }
                              }}
                              className={`w-full flex items-center justify-center gap-2 transition-all duration-300 ${theme.btnMood2Class}`}
                            >
                              {apologyForgiveState === 'initial' && (
                                <>
                                  <span>Still thinking...</span>
                                  <AppleEmoji emoji="🥺" size={15} />
                                </>
                              )}
                              {apologyForgiveState === 'begging' && (
                                <>
                                  <span className="animate-pulse">Pretty please with sugar?</span>
                                  <AppleEmoji emoji="🍩" size={15} />
                                </>
                              )}
                              {apologyForgiveState === 'begging-2' && (
                                <>
                                  <span className="animate-bounce">Sending infinite hugs... please?</span>
                                  <AppleEmoji emoji="🧸" size={15} />
                                </>
                              )}
                            </button>
                          </>
                        ) : isRomance ? (
                          <>
                            <button
                              type="button"
                              onClick={handleChooseFeeling}
                              className={`w-full flex items-center justify-center gap-2 ${theme.btnMood1Class}`}
                            >
                              <span>More Than Words Can Say</span>
                              <AppleEmoji emoji="❤️" size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={handleChooseFeeling}
                              className={`w-full flex items-center justify-center gap-2 ${theme.btnMood2Class}`}
                            >
                              <span>Infinity & Beyond</span>
                              <AppleEmoji emoji="💫" size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={handleChooseFeeling}
                              className={`w-full flex items-center justify-center gap-2 ${theme.btnMood3Class}`}
                            >
                              <span>To the Moon & Back</span>
                              <AppleEmoji emoji="🌙" size={15} />
                            </button>
                          </>
                        ) : isScrapbook ? (
                          <>
                            <button
                              type="button"
                              onClick={handleChooseFeeling}
                              className={`w-full flex items-center justify-center gap-2 ${theme.btnMood1Class}`}
                            >
                              <span>Unplanned Roadtrips</span>
                              <AppleEmoji emoji="🚗" size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={handleChooseFeeling}
                              className={`w-full flex items-center justify-center gap-2 ${theme.btnMood2Class}`}
                            >
                              <span>Endless Late Talks</span>
                              <AppleEmoji emoji="☕" size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={handleChooseFeeling}
                              className={`w-full flex items-center justify-center gap-2 ${theme.btnMood3Class}`}
                            >
                              <span>Unstoppable Laughs</span>
                              <AppleEmoji emoji="😂" size={15} />
                            </button>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}

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
                {/* SCENE 3: REASONS / HIGHLIGHTS / PROMISES */}
                {/* -------------------------------------------------------- */}
                {screen === 3 && (
                  <div className="w-full flex flex-col items-center text-center space-y-1.5 py-1 max-w-[280px]">
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <h2 className={`${theme.fontFamily} text-xl sm:text-2xl font-bold ${theme.headingClass}`}>
                        {isApology
                          ? 'Promises to You'
                          : isRomance
                          ? 'Reasons Why I Adore You'
                          : isScrapbook
                          ? 'Why This Bond Is For Life'
                          : "Why You're Special"}
                      </h2>
                      <AppleEmoji
                        emoji={
                          isApology
                            ? '🌿'
                            : isRomance
                            ? '❤️'
                            : isScrapbook
                            ? '🤙'
                            : '💫'
                        }
                        size={20}
                      />
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
                                {isRomance ? (
                                  <>
                                    <span>For My True Love</span>
                                    <AppleEmoji emoji="❤️" size={13} />
                                    <AppleEmoji emoji="🌹" size={13} />
                                    <AppleEmoji emoji="✨" size={13} />
                                  </>
                                ) : isScrapbook ? (
                                  <>
                                    <span>Memories Taped Forever</span>
                                    <AppleEmoji emoji="📸" size={13} />
                                    <AppleEmoji emoji="⚡" size={13} />
                                    <AppleEmoji emoji="🌻" size={13} />
                                  </>
                                ) : isApology ? (
                                  <>
                                    <span>A Message of Peace</span>
                                    <AppleEmoji emoji="🕊️" size={13} />
                                    <AppleEmoji emoji="🤍" size={13} />
                                    <AppleEmoji emoji="🌿" size={13} />
                                  </>
                                ) : (
                                  <>
                                    <span>Happy Birthday!</span>
                                    <AppleEmoji emoji="🎉" size={13} />
                                    <AppleEmoji emoji={theme.primaryEmoji} size={13} />
                                    <AppleEmoji emoji="✨" size={13} />
                                  </>
                                )}
                              </div>
                              <div className="mt-1 text-center text-[10px] text-slate-400 font-sans">
                                {isRomance
                                  ? 'Forever & always in my heart...'
                                  : isScrapbook
                                  ? 'A timeless chapter for you...'
                                  : isApology
                                  ? 'From my heart to yours...'
                                  : 'A special letter for you...'}
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
                          {isRomance ? (
                            <>
                              <span>Tap the wax seal to unseal my heart!</span>
                              <AppleEmoji emoji="💌" size={14} />
                            </>
                          ) : isScrapbook ? (
                            <>
                              <span>Tap the wax seal to open the letter!</span>
                              <AppleEmoji emoji="📜" size={14} />
                            </>
                          ) : isApology ? (
                            <>
                              <span>Tap the wax seal to read my apology</span>
                              <AppleEmoji emoji="🕊️" size={14} />
                            </>
                          ) : (
                            <>
                              <span>Tap the wax seal to open!</span>
                              <AppleEmoji emoji="💌" size={14} />
                            </>
                          )}
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
                              <AppleEmoji
                                emoji={isRomance ? '❤️' : isScrapbook ? '📸' : isApology ? '🕊️' : '✨'}
                                size={13}
                              />
                            </div>
                            <AppleEmoji emoji={theme.primaryEmoji} size={18} />
                          </div>

                          {/* Letter Body */}
                          {letterBody ? (
                            <div className="space-y-2 text-slate-700 text-xs leading-relaxed max-h-40 overflow-y-auto custom-scrollbar pr-1 whitespace-pre-line font-sans">
                              {renderAppleText(letterBody, 11)}
                            </div>
                          ) : null}

                          {/* Signature styled in template's font */}
                          {letterSignOff ? (
                            <div className={`pt-2 mt-2 border-t ${theme.letterBorderBottom} text-right`}>
                              <p
                                className={`${theme.fontFamily} text-base sm:text-lg font-bold flex items-center justify-end gap-1 whitespace-pre-line ${theme.letterSignOffClass}`}
                              >
                                <span>{renderAppleText(letterSignOff, 15)}</span>
                              </p>
                            </div>
                          ) : null}
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
              )}

              {/* ========================================================== */}
              {/* BOTTOM HOME INDICATOR & SCENE DOTS */}
              {/* ========================================================== */}
              <div className="w-full pb-1 z-30 shrink-0 select-none">
                {/* Scene Indicator Dots strictly for Multi-Scene Birthday (Romance/Scrapbook/Apology have their own dedicated tabs) */}
                {isBirthday && (
                  <div className="flex items-center justify-center gap-1.5 py-1 mb-0.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setScreen(i);
                          if (i !== 4) setEnvelopeOpen(false);
                          if (i !== 2) setApologyForgiveState('initial');
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
                )}

                {/* Minimal iOS Home Indicator Bar */}
                <div className="w-28 h-1 bg-black/40 rounded-full mx-auto my-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
}
