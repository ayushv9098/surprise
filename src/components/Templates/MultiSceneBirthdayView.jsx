import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';
import { soundEffects } from './common/SoundEffects';
import { getSongById } from '../../data/songs';

// 18 Ambient floating Apple emoji configurations calibrated for each distinct theme
const FLOATING_EMOJIS_DEF = [
  { boy: '⭐', girl: '🌸', peach: '🍑', lavender: '💜', gold: '⭐', polaroid: '📸', left: '4%', top: '8%', size: 24, dur: '7s', del: '0s' },
  { boy: '🦋', girl: '🦋', peach: '✨', lavender: '🦋', gold: '✨', polaroid: '⚡', left: '10%', top: '45%', size: 26, dur: '8.5s', del: '1.2s' },
  { boy: '👑', girl: '👑', peach: '👑', lavender: '🔮', gold: '👑', polaroid: '🎞️', left: '90%', top: '14%', size: 28, dur: '9s', del: '0.5s' },
  { boy: '🌹', girl: '🌹', peach: '🧡', lavender: '🌸', gold: '🎂', polaroid: '⭐', left: '8%', top: '78%', size: 24, dur: '7.5s', del: '2s' },
  { boy: '💫', girl: '💫', peach: '💫', lavender: '💫', gold: '💫', polaroid: '✨', left: '88%', top: '52%', size: 22, dur: '8s', del: '0.8s' },
  { boy: '🎉', girl: '🎉', peach: '🎉', lavender: '🎉', gold: '🎉', polaroid: '📜', left: '22%', top: '18%', size: 24, dur: '9.5s', del: '1.5s' },
  { boy: '💙', girl: '💖', peach: '🌟', lavender: '💜', gold: '💛', polaroid: '💫', left: '80%', top: '82%', size: 22, dur: '7s', del: '1s' },
  { boy: '✨', girl: '✨', peach: '✨', lavender: '✨', gold: '✨', polaroid: '☕', left: '48%', top: '6%', size: 22, dur: '6.5s', del: '2.3s' },
  { boy: '🔥', girl: '🎀', peach: '🍰', lavender: '🌙', gold: '🔥', polaroid: '📸', left: '70%', top: '36%', size: 22, dur: '8s', del: '1.1s' },
  { boy: '🏆', girl: '🍰', peach: '⭐', lavender: '🍰', gold: '🏆', polaroid: '⚡', left: '16%', top: '92%', size: 24, dur: '8.5s', del: '0.4s' },
  { boy: '⭐', girl: '🌸', peach: '🍑', lavender: '🌸', gold: '⭐', polaroid: '🎞️', left: '84%', top: '38%', size: 22, dur: '7s', del: '2.8s' },
  { boy: '🎊', girl: '🧸', peach: '🎊', lavender: '🧸', gold: '🎊', polaroid: '⭐', left: '38%', top: '89%', size: 24, dur: '9s', del: '1.7s' },
  { boy: '⚡', girl: '🍓', peach: '🧡', lavender: '🍓', gold: '⚡', polaroid: '✨', left: '58%', top: '72%', size: 20, dur: '7.5s', del: '2.1s' },
  { boy: '🚀', girl: '💌', peach: '💌', lavender: '💌', gold: '🚀', polaroid: '📜', left: '94%', top: '26%', size: 24, dur: '9.2s', del: '0.6s' },
  { boy: '🧿', girl: '🌈', peach: '🌈', lavender: '🌈', gold: '🧿', polaroid: '💫', left: '32%', top: '50%', size: 24, dur: '7s', del: '1.3s' },
  { boy: '🦋', girl: '🦋', peach: '✨', lavender: '🦋', gold: '✨', polaroid: '☕', left: '74%', top: '94%', size: 26, dur: '8s', del: '2.6s' },
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
  { icon: '🎂', title: 'Golden Heart', desc: 'A heart of pure gold that brings boundless joy and warmth to everyone!' },
  { icon: '⭐', title: 'Star Quality', desc: 'Always shining bright and inspiring others to reach for their highest dreams!' },
  { icon: '👑', title: 'Pure Excellence', desc: 'Celebrating the incredible person you are today and all the adventures ahead!' }
];

const DEFAULT_POLAROID_REASONS = [
  { icon: '📸', title: 'Unforgettable Memories', desc: 'Every adventure and laugh we share becomes an instant classic memory!' },
  { icon: '⚡', title: 'Brothers & Besties', desc: 'Always bringing unmatched energy, loyalty, and honest brotherhood!' },
  { icon: '👑', title: 'Truly One of a Kind', desc: 'No one has a spirit quite like yours. Grateful for our bond always!' }
];

export default function MultiSceneBirthdayView({ 
  siteData = {}, 
  onNavigateCreate: _onNavigateCreate,
  onBack,
  onNavigate: _onNavigate
}) {
  const [scene, setScene] = useState(0);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Multi-Theme Awareness (Royal Sapphire, Blush Blossom, Princess Peach, Lavender Dream, Golden Spark)
  const templateId = (siteData.templateId || (siteData.gender === 'girl' ? 'blush-rose' : 'royal-sapphire')).toLowerCase();
  const isPeach = templateId.includes('peach');
  const isLavender = templateId.includes('lavender');
  const isGold = templateId.includes('gold');
  const isPolaroid = templateId.includes('polaroid') || templateId.includes('scrapbook');
  const isBlush = templateId.includes('rose') || templateId.includes('blush') || (!isPeach && !isLavender && !isGold && !isPolaroid && siteData.gender === 'girl');
  const isRoyal = !isBlush && !isPeach && !isLavender && !isGold && !isPolaroid;

  // Font family determination
  // Princess Peach & Golden Spark: Playfair Display serif (.font-serif)
  // Retro Polaroid: Caveat handwriting (.font-handwriting)
  // Royal Sapphire, Blush Blossom, Lavender Dream: Dancing Script (.font-cursive)
  const fontFamilyClass = (isPeach || isGold) ? 'font-serif' : (isPolaroid ? 'font-handwriting' : 'font-cursive');
  const handwritingClass = isPolaroid ? 'font-handwriting' : 'font-cursive';

  // Theme styling tokens mapping
  const themeTokens = (() => {
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
    if (isGold) {
      return {
        celebrationEmoji: '🎂',
        headingColorClass: 'text-amber-950',
        headingAccentClass: 'text-amber-600',
        cardClass: 'birthday-card-gold',
        reasonCardClass: 'special-reason-card-gold',
        reasonIconBgClass: 'bg-amber-50 border border-amber-200/80',
        reasonTitleClass: 'text-amber-950',
        primaryBtnClass: 'btn-primary-gold',
        secondaryBtnClass: 'btn-secondary-gold',
        coverBtnGradient: 'bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#B45309] hover:from-[#D97706] hover:to-[#92400E] shadow-amber-600/35',
        envelopeBgGradient: 'bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 border-amber-300/40',
        envelopeShading: 'bg-amber-950/60',
        envelopeCardBorder: 'border-amber-200',
        envelopeCardTitle: 'text-amber-900',
        envelopeFolds: { fold1: '#b45309', fold2: '#d97706', fold3: '#f59e0b' },
        defaultWaxColor: '#D97706',
        defaultSealEmoji: '⭐',
        openLetterBorder: 'border-amber-100/90',
        openLetterHeader: 'text-amber-900',
        signatureColorClass: 'text-amber-800',
        bgContainerOpen: 'bg-envelope-celebration-gold',
        bgContainerClosed: 'bg-soft-aesthetic-gold',
        confettiColors: ['#f59e0b', '#fbbf24', '#d97706', '#b45309', '#fef3c7', '#ffffff'],
        defaultSignOffEmoji: '🎂⭐',
      };
    }
    if (isPolaroid) {
      return {
        celebrationEmoji: '📸',
        headingColorClass: 'text-stone-900',
        headingAccentClass: 'text-amber-800',
        cardClass: 'birthday-card-polaroid',
        reasonCardClass: 'special-reason-card-polaroid',
        reasonIconBgClass: 'bg-amber-100/60 border border-amber-200/80',
        reasonTitleClass: 'text-stone-900',
        primaryBtnClass: 'btn-primary-polaroid',
        secondaryBtnClass: 'btn-secondary-polaroid',
        coverBtnGradient: 'bg-gradient-to-r from-[#92400E] via-[#78350F] to-[#451A03] hover:from-[#78350F] hover:to-[#291002] shadow-amber-900/35',
        envelopeBgGradient: 'bg-gradient-to-br from-amber-800 via-stone-800 to-amber-950 border-amber-500/40',
        envelopeShading: 'bg-stone-950/60',
        envelopeCardBorder: 'border-amber-200/80',
        envelopeCardTitle: 'text-amber-950',
        envelopeFolds: { fold1: '#451a03', fold2: '#78350f', fold3: '#92400e' },
        defaultWaxColor: '#78350F',
        defaultSealEmoji: '⚡',
        openLetterBorder: 'border-amber-200/60',
        openLetterHeader: 'text-amber-950',
        signatureColorClass: 'text-amber-900',
        bgContainerOpen: 'bg-envelope-celebration-polaroid',
        bgContainerClosed: 'bg-soft-aesthetic-polaroid',
        confettiColors: ['#b45309', '#d97706', '#78350f', '#f59e0b', '#fef3c7', '#ffffff'],
        defaultSignOffEmoji: '📸⚡',
      };
    }
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
    // Royal Sapphire (default / boy)
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
  const getFloatingEmoji = (e) => {
    if (isPolaroid) return e.polaroid || '📸';
    if (isPeach) return e.peach || e.girl;
    if (isLavender) return e.lavender || e.girl;
    if (isGold) return e.gold || '✨';
    if (isBlush) return e.girl;
    return e.boy;
  };

  // Personalization data with neutral defaults
  const isGirlGender = siteData.gender === 'girl' || isBlush || isPeach || isLavender;
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
    line1Text = 'Happy Birthday,';
    line2Text = `${nameToDisplay}! ${celebrationEmoji}`;
  }
  
  const photoUrl = siteData.heroPhoto || 
                   siteData.photos?.[0]?.url || 
                   (isGirlGender 
                     ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' 
                     : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80');

  const photoCaption = siteData.photoCaption || 
                       (isPeach 
                         ? "Shining with Pure Warmth & Grace! ✨🍑"
                         : (isLavender 
                           ? "Dreamy, Radiant & Magical Always! 💜✨"
                           : (isGold
                             ? "Golden Spark & Boundless Joy! 🎂✨"
                             : (isPolaroid
                               ? "Brothers & Besties For Life! 📸⚡"
                               : (isBlush ? "Stay Wonderful Always! 🌸✨" : "Keep Rocking Always! 👑🔥")))));

  const defaultReasons = isPeach 
    ? DEFAULT_PEACH_REASONS 
    : (isLavender 
      ? DEFAULT_LAVENDER_REASONS 
      : (isGold 
        ? DEFAULT_GOLD_REASONS 
        : (isPolaroid
          ? DEFAULT_POLAROID_REASONS
          : (isBlush ? DEFAULT_GIRL_REASONS : DEFAULT_BOY_REASONS))));

  const reasons = siteData.reasons || 
                  siteData.specialReasons || 
                  defaultReasons;

  // Letter content
  const letterTitle = siteData.letter?.title || siteData.letterTitle || 'A Little Note For You';
  const defaultLetter = isPeach
    ? `Happy Birthday, ${recipientName}!\n\nYou bring a radiant warmth, golden sunshine, and beautiful energy wherever you go. Your smile lights up every room, and you make every ordinary day feel like something magical.\n\nMay this year unfold with sweet laughter, wonderful new adventures, and all the happiest moments your heart can hold. Stay glorious! ✨🍑`
    : (isLavender
      ? `Happy Birthday, ${recipientName}!\n\nYou possess such a dreamy spirit, creative wonder, and comforting kindness. Being in your presence feels like a breath of fresh lilac and pure calm.\n\nMay this year grant you your most cherished wishes, endless inspiration, and moments full of starlight and joy. Keep dreaming wonderfully! 💜✨`
      : (isGold
        ? `Happy Birthday, ${recipientName}!\n\nToday we celebrate a heart of pure gold. Your generosity, infectious laughter, and bright spirit illuminate the paths of everyone around you.\n\nMay your year ahead be crowned with grand triumphs, blissful memories, and radiant good health! 🎂✨`
        : (isPolaroid
          ? `Happy Birthday, ${recipientName}!\n\nLooking back at every snapshot, adventure, and late-night laugh, I'm so grateful for our brotherhood and all the memories we share. You bring unmatched loyalty, real energy, and genuine warmth into every day.\n\nMay this year bring you all the grand achievements, unforgettable memories, and boundless happiness you deserve. Keep rocking, brother! 📸⚡`
          : (isBlush
            ? `Happy Birthday, ${recipientName}!\n\nYou bring so much elegance, warmth, and sparkling wonder wherever you go. Your kind soul touches everyone you meet, and you make ordinary days feel truly unforgettable.\n\nMay this year bring you all the sweetest dreams, vibrant laughter, and boundless happiness you deserve so deeply.`
            : `Happy Birthday, ${recipientName}!\n\nYou bring so much energy, strength, and genuine happiness into the lives of everyone around you. Thank you for being someone I can always look up to and trust unconditionally.\n\nMay this year bring you all the grand achievements, good health, and joyful moments you deserve. Keep shining like a king! 👑✨`))));

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
  const backBtnClass = "inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-xs hover:shadow-md text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer min-h-[44px]";

  const primaryBtnClass = `inline-flex items-center justify-center gap-1.5 px-7 py-2.5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer ${themeTokens.primaryBtnClass} min-h-[44px]`;

  const secondaryBtnClass = `inline-flex items-center justify-center gap-1.5 px-7 py-2.5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer ${themeTokens.secondaryBtnClass} min-h-[44px]`;

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
            <AppleEmoji emoji={getFloatingEmoji(e)} size={e.size} />
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
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200/90 shadow-sm text-xs sm:text-sm font-bold cursor-pointer transition-all active:scale-95 z-20"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to WishCraft</span>
                </button>
              )}

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
                The Star of the Day
              </h2>
              <AppleEmoji emoji="🌟" size={28} />
            </div>

            {/* Polaroid Frame */}
            <div className="polaroid-frame my-2 w-full max-w-[260px] sm:max-w-[310px] mx-auto">
              <div className="relative w-full h-[280px] sm:h-[360px] overflow-hidden rounded-[4px] bg-slate-100 shadow-inner">
                <img
                  src={photoUrl}
                  alt={recipientName}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 12%' }}
                />
              </div>

              {/* Handwritten Polaroid Caption */}
              <p className={`mt-3 ${handwritingClass} text-xl sm:text-2xl text-slate-700 text-center flex items-center justify-center gap-1.5 px-2 break-words`}>
                {renderAppleText(photoCaption, 20)}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6 w-full max-w-xs sm:max-w-sm flex-wrap">
              <button
                type="button"
                onClick={() => setScene(0)}
                className={`${backBtnClass} flex-1 sm:flex-initial`}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextFromPhoto}
                className={`${primaryBtnClass} flex-1 sm:flex-initial`}
              >
                <span>Next</span>
                <AppleEmoji emoji="✨" size={18} />
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
                Before we proceed...
              </h2>
              <p className="mt-2 sm:mt-3 text-slate-500 text-sm sm:text-base">
                How are you feeling today?
              </p>

              <div className="mt-5 sm:mt-7 flex flex-col gap-3 sm:gap-3.5 w-full">
                <button
                  type="button"
                  onClick={handleChooseFeeling}
                  className={`${primaryBtnClass} w-full py-3 sm:py-3.5 px-6`}
                >
                  <span>Super Happy!</span>
                  <AppleEmoji emoji="🥳" size={20} />
                </button>

                <button
                  type="button"
                  onClick={handleChooseFeeling}
                  className={`${secondaryBtnClass} w-full py-3 sm:py-3.5 px-6`}
                >
                  <span>So Excited!</span>
                  <AppleEmoji emoji="✨" size={20} />
                </button>

                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => setScene(1)}
                    className={`${backBtnClass} w-full py-2.5 sm:py-3`}
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
                Why You're Special
              </h2>
              <AppleEmoji emoji="💫" size={28} />
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
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-xs sm:max-w-sm flex-wrap">
              <button
                type="button"
                onClick={() => setScene(2)}
                className={`${backBtnClass} flex-1 sm:flex-initial`}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextFromReasons}
                className={`${primaryBtnClass} flex-1 sm:flex-initial`}
              >
                <span>Next</span>
                <AppleEmoji emoji="✨" size={18} />
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
                        <span>Happy Birthday!</span>
                        <AppleEmoji emoji="🎉" size={16} />
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
                <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 w-full max-w-xs sm:max-w-sm flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEnvelopeOpen(false);
                      setScene(3);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-2xl text-white/90 hover:text-white border border-white/30 bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer min-h-[44px] flex-1 sm:flex-initial"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEnvelope}
                    className={`${primaryBtnClass} px-7 py-2.5 text-xs sm:text-sm flex-1 sm:flex-initial min-h-[44px]`}
                  >
                    <span>Close Envelope</span>
                    <AppleEmoji emoji="💌" size={18} />
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
