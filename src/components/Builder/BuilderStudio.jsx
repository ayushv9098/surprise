import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import StepDetails from './StepDetails';
import StepMedia from './StepMedia';
import StepSurprises from './StepSurprises';
import LivePhonePreview from './LivePhonePreview';
import ShareModal from './ShareModal';
import { getPresetForTemplate } from '../../data/samplePresets';
import { getTemplateById, getTemplatesByCategory } from '../../data/templates';
import { saveSurprise } from '../../utils/storage';
import AppleEmoji from '../common/AppleEmoji';

export default function BuilderStudio({
  initialTemplateId,
  initialGender = 'boy',
  initialCategory = 'birthday',
  onBack,
  onComplete,
}) {
  const handleBackClick = onBack;
  const [currentStep, setCurrentStep] = useState(1);
  const [formSection, setFormSection] = useState('details'); // 'details' | 'media' | 'surprises'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareResult, setShareResult] = useState(null);

  // Focus & Section Auto-Sync State for Mobile Simulator
  const [previewTarget, setPreviewTarget] = useState({ screen: 0, openEnvelope: false, nonce: 0 });

  const syncToPreview = (screen, openEnvelope = false) => {
    setPreviewTarget({ screen, openEnvelope, nonce: Date.now() });
  };

  const handleSectionTabClick = (sectionId) => {
    setFormSection(sectionId);
    if (sectionId === 'details') {
      syncToPreview(0, false);
    } else if (sectionId === 'media') {
      syncToPreview(1, false);
    } else if (sectionId === 'surprises') {
      syncToPreview(3, false);
    }
  };

  const handleFocusField = (fieldName) => {
    if (['recipientName', 'senderName', 'occasion', 'subtitle'].includes(fieldName)) {
      syncToPreview(0, false);
    } else if (['heroPhoto', 'photos', 'photoCaption', 'songId', 'customSongUrl'].includes(fieldName)) {
      syncToPreview(1, false);
    } else if (fieldName === 'reasons' || fieldName.startsWith('reason') || fieldName.startsWith('quiz')) {
      syncToPreview(3, false);
    } else if (['letter', 'letterTitle', 'waxSeal'].includes(fieldName)) {
      syncToPreview(4, false);
    } else if (['letterContent', 'letterSignOff'].includes(fieldName) || fieldName.startsWith('letter')) {
      syncToPreview(4, true);
    }
  };

  // Compute resolved initial gender & template
  const resolvedInitialTemplateId = (() => {
    if (initialTemplateId) {
      const tmpl = getTemplateById(initialTemplateId);
      if (tmpl) return tmpl.id;
    }
    return initialGender === 'girl' ? 'blush-rose' : 'royal-sapphire';
  })();

  const resolvedInitialGender = (() => {
    if (initialTemplateId) {
      const tmpl = getTemplateById(initialTemplateId);
      if (tmpl?.gender) return tmpl.gender;
    }
    if (initialGender) return initialGender;
    return 'boy';
  })();

  const [selectedGender, setSelectedGender] = useState(resolvedInitialGender);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (initialCategory) return initialCategory;
    if (initialTemplateId) {
      const tmpl = getTemplateById(initialTemplateId);
      if (tmpl?.category) return tmpl.category;
    }
    return 'birthday';
  });

  // Form State
  const [formData, setFormData] = useState(() => {
    const tmpl = getTemplateById(resolvedInitialTemplateId);
    const preset = getPresetForTemplate(tmpl.id);
    return {
      templateId: tmpl.id,
      category: selectedCategory,
      gender: resolvedInitialGender,
      recipientName: preset.recipientName || (resolvedInitialGender === 'girl' ? 'Sarah' : 'Rohan'),
      senderName: preset.senderName || (resolvedInitialGender === 'girl' ? 'Elena' : 'Alex'),
      occasion: preset.occasion || 'Happy Birthday',
      subtitle: preset.subtitle || 'I have a small surprise for you...',
      heroPhoto: preset.heroPhoto || tmpl.samplePhoto,
      photoCaption: preset.photoCaption || (resolvedInitialGender === 'girl' ? 'Stay Wonderful Always! 🌸✨' : 'Keep Rocking Always! 👑🔥'),
      photos: preset.photos || [
        {
          id: 'p1',
          url: preset.heroPhoto || tmpl.samplePhoto,
          caption: preset.photoCaption || (resolvedInitialGender === 'girl' ? 'Stay Wonderful Always! 🌸✨' : 'Keep Rocking Always! 👑🔥'),
          tag: 'The Star',
        },
      ],
      specialReasons: preset.specialReasons || (resolvedInitialGender === 'girl' ? [
        { icon: '🌸', title: 'Pure Sunshine', desc: 'The effortless way you turn every ordinary moment into joy!' },
        { icon: '✨', title: 'Gentle Soul', desc: 'The quiet kindness and sparkling positivity you share with everyone!' },
        { icon: '💖', title: 'Irreplaceable Friend', desc: 'A truly irreplaceable friend whose presence makes everything brighter!' },
      ] : [
        { icon: '💪', title: 'Lucky to Have You', desc: 'So grateful to have a brother like you in my corner every day!' },
        { icon: '⭐', title: 'Always There', desc: 'Always standing by my side with endless laughs and genuine support!' },
        { icon: '👑', title: 'Irreplaceable', desc: 'No one can ever match your incredible spirit and heart. A true champion!' },
      ]),
      letter: preset.letter || {},
      songId: preset.songId || tmpl.recommendedSongId || (resolvedInitialGender === 'girl' ? 'kesariya' : 'baar-baar-din-ye-aaye'),
    };
  });

  const handleUpdateFormData = (patch) => {
    if (patch.category && patch.category !== selectedCategory) {
      setSelectedCategory(patch.category);
    }

    // Auto-sync preview scene based on edited field
    if (patch.recipientName !== undefined || patch.senderName !== undefined || patch.occasion !== undefined || patch.subtitle !== undefined) {
      syncToPreview(0, false);
    } else if (patch.heroPhoto !== undefined || patch.photoCaption !== undefined || patch.photos !== undefined || patch.songId !== undefined || patch.customSongUrl !== undefined) {
      syncToPreview(1, false);
    } else if (patch.specialReasons !== undefined || patch.reasons !== undefined || patch.quizQuestion !== undefined || patch.quizYesText !== undefined || patch.quizTreat !== undefined || patch.quizVictoryNote !== undefined || patch.quiz !== undefined) {
      syncToPreview(3, false);
    } else if (patch.letterContent !== undefined || patch.letterSignOff !== undefined) {
      syncToPreview(4, true);
    } else if (patch.letter !== undefined || patch.letterBody !== undefined || patch.letterTitle !== undefined) {
      const isContentOrSignOff =
        (patch.letter && formData.letter && (patch.letter.content !== formData.letter.content || patch.letter.signOff !== formData.letter.signOff)) ||
        (patch.letterBody !== undefined && patch.letterBody !== formData.letterBody && patch.letterBody !== formData.letter?.content) ||
        (patch.letterSignOff !== undefined && patch.letterSignOff !== formData.letterSignOff && patch.letterSignOff !== formData.letter?.signOff);

      const isOnlySealOrTitle =
        (!isContentOrSignOff && patch.letter && (patch.letter.sealEmoji !== formData.letter?.sealEmoji || patch.letter.waxColor !== formData.letter?.waxColor || patch.letter.title !== formData.letter?.title)) ||
        (patch.letter && !patch.letter.content && !patch.letter.signOff);

      syncToPreview(4, !isOnlySealOrTitle);
    }

    setFormData((prev) => {
      let updatedLetter = prev.letter ? { ...prev.letter } : {};

      // When senderName is updated in Tab 1, keep letter signOff in sync if it had the old sender
      if (patch.senderName !== undefined && patch.senderName !== prev.senderName) {
        const oldSender = prev.senderName;
        if (oldSender && updatedLetter.signOff && updatedLetter.signOff.includes(oldSender) && patch.letter === undefined) {
          updatedLetter.signOff = updatedLetter.signOff.split(oldSender).join(patch.senderName);
        }
      }

      // When recipientName is updated in Tab 1, keep letter greeting & content in sync
      if (patch.recipientName !== undefined && patch.recipientName !== prev.recipientName && patch.letter === undefined && updatedLetter.content) {
        const oldRecipient = prev.recipientName;
        const newRecipient = patch.recipientName || '';

        let content = updatedLetter.content;
        let replaced = false;

        // 1. If prev.recipientName was present in updatedLetter.content, replace it with patch.recipientName
        if (oldRecipient && oldRecipient.trim() && content.includes(oldRecipient)) {
          if (oldRecipient.trim().length >= 2) {
            content = content.split(oldRecipient).join(newRecipient);
            replaced = true;
          } else {
            // For 1-character typing in progress, update the greeting line safely
            const lines = content.split('\n');
            if (lines.length > 0 && lines[0].includes(oldRecipient)) {
              lines[0] = lines[0].split(oldRecipient).join(newRecipient);
              content = lines.join('\n');
              replaced = true;
            }
          }
        }

        // 2. Also if updatedLetter.content contains common default preset names ("Sarah", "Rohan", "Elena", "Alex", "Kabir", "Maya", "Kiara")
        // at the beginning (e.g. Sweet Sarah, Dear Sarah, Happy Birthday Kabir, etc.), replace that greeting name with patch.recipientName
        const defaultNames = ['Sarah', 'Rohan', 'Elena', 'Alex', 'Kabir', 'Maya', 'Kiara'];
        for (const defaultName of defaultNames) {
          if (!replaced && content.includes(defaultName)) {
            content = content.split(defaultName).join(newRecipient);
            replaced = true;
            break;
          }
        }

        // 3. Fallback for the opening greeting line if old name wasn't cleanly matched (e.g. after deletion or greeting format)
        if (!replaced && newRecipient.trim()) {
          const lines = content.split('\n');
          if (lines.length > 0) {
            const greetingMatch = lines[0].match(/^(Happy Birthday|Dear|My dearest|Dearest|Sweet|Sweetest)(\s+)([^,!\n]+)(.*)$/i);
            if (greetingMatch) {
              lines[0] = `${greetingMatch[1]} ${newRecipient}${greetingMatch[4]}`;
              content = lines.join('\n');
            }
          }
        }

        updatedLetter.content = content;
      }

      return {
        ...prev,
        ...patch,
        letter: patch.letter !== undefined ? patch.letter : updatedLetter,
      };
    });
  };

  const handleFieldChange = handleUpdateFormData;

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    syncToPreview(0, false);
    const targetTemplateId = gender === 'girl' ? 'blush-rose' : 'royal-sapphire';
    const preset = getPresetForTemplate(targetTemplateId);
    const tmpl = getTemplateById(targetTemplateId);

    setFormData((prev) => ({
      ...prev,
      gender,
      templateId: targetTemplateId,
      recipientName: gender === 'girl' ? 'Sarah' : 'Rohan',
      senderName: gender === 'girl' ? 'Elena' : 'Alex',
      occasion: preset.occasion || 'Happy Birthday',
      subtitle: preset.subtitle,
      heroPhoto: preset.heroPhoto || tmpl.samplePhoto,
      photoCaption: preset.photoCaption,
      photos: preset.photos,
      specialReasons: preset.specialReasons,
      letter: preset.letter,
      songId: preset.songId || tmpl.recommendedSongId,
    }));
  };

  const handleTemplateChange = (templateId) => {
    syncToPreview(0, false);
    const tmpl = getTemplateById(templateId);
    const preset = getPresetForTemplate(templateId);
    if (tmpl.gender && tmpl.gender !== selectedGender) {
      setSelectedGender(tmpl.gender);
    }
    if (tmpl.category && tmpl.category !== selectedCategory) {
      setSelectedCategory(tmpl.category);
    }

    const isBirthdayTemplate = !tmpl.category || tmpl.category === 'birthday';
    const defaultBirthdayNicknames = [
      'Happy Birthday, Lavender Dreamer! 💜',
      'Happy Birthday, Sunshine! 🌸',
      'Happy Birthday Princess! ✨👑',
      'Happy Birthday Princess! 👑💖',
      'Happy Birthday, Fairy Princess! 🩵✨',
      'Happy Birthday to the King! 👑',
      'Happy Birthday, Shining Star! 🎂✨',
      'Chapters of Brotherhood 📸⚡',
      'Happy Birthday to the King! 🖤👑',
    ];

    setFormData((prev) => {
      const isCustomOccasion = prev.occasion && !defaultBirthdayNicknames.includes(prev.occasion) && prev.occasion !== 'Happy Birthday';
      const resolvedOccasion = isBirthdayTemplate
        ? (currentStep === 1 ? 'Happy Birthday' : (isCustomOccasion ? prev.occasion : 'Happy Birthday'))
        : (currentStep === 1 ? (preset.occasion || tmpl.defaultOccasion || '') : (prev.occasion || preset.occasion || tmpl.defaultOccasion || ''));

      let templateLetter = preset.letter ? { ...preset.letter } : (prev.letter ? { ...prev.letter } : {});
      const activeRecipient = currentStep === 1 ? (preset.recipientName || (tmpl.gender === 'girl' ? 'Sarah' : 'Rohan')) : prev.recipientName;
      const activeSender = currentStep === 1 ? (preset.senderName || (tmpl.gender === 'girl' ? 'Elena' : 'Alex')) : prev.senderName;

      // If user has already entered a custom recipientName, keep it in sync with the new preset letter
      if (currentStep !== 1 && activeRecipient && templateLetter.content) {
        const defaultNames = ['Sarah', 'Rohan', 'Elena', 'Alex', 'Kabir', 'Maya', 'Kiara'];
        for (const dName of defaultNames) {
          if (templateLetter.content.includes(dName)) {
            templateLetter.content = templateLetter.content.split(dName).join(activeRecipient);
            break;
          }
        }
      }

      if (currentStep !== 1 && activeSender && templateLetter.signOff) {
        const defaultSenders = ['Alex', 'Elena', 'Liam', 'Julian', 'Noah', 'Aryan', 'Samir', 'Dev', 'Meera', 'Rohan', 'Kabir', 'Sameer'];
        for (const dSender of defaultSenders) {
          if (templateLetter.signOff.includes(dSender)) {
            templateLetter.signOff = templateLetter.signOff.split(dSender).join(activeSender);
            break;
          }
        }
      }

      return {
        ...prev,
        templateId,
        category: tmpl.category || prev.category || selectedCategory,
        gender: tmpl.gender || prev.gender,
        recipientName: activeRecipient,
        senderName: activeSender,
        occasion: resolvedOccasion,
        subtitle: preset.subtitle || tmpl.defaultSubtitle || prev.subtitle,
        heroPhoto: preset.heroPhoto || tmpl.samplePhoto || prev.heroPhoto,
        photoCaption: preset.photoCaption || tmpl.defaultCaption || prev.photoCaption,
        photos: preset.photos?.length ? preset.photos : prev.photos,
        specialReasons: preset.specialReasons?.length ? preset.specialReasons : prev.specialReasons,
        letter: templateLetter,
        quizQuestion: preset.quizQuestion !== undefined ? preset.quizQuestion : prev.quizQuestion,
        quizYesText: preset.quizYesText !== undefined ? preset.quizYesText : prev.quizYesText,
        quizTreat: preset.quizTreat !== undefined ? preset.quizTreat : prev.quizTreat,
        quizVictoryNote: preset.quizVictoryNote !== undefined ? preset.quizVictoryNote : prev.quizVictoryNote,
        songId: preset.songId || tmpl.recommendedSongId || prev.songId,
      };
    });
  };

  const handleNextStep = (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handlePublish();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const res = await saveSurprise(formData);
      setShareResult(res);
      setTimeout(() => setShowShareModal(true), 60);
      if (onComplete) {
        onComplete(res);
      }
    } catch (err) {
      console.error('Failed to publish surprise, engaging fallback:', err);
      // Guarantee fallback object so modal always displays
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
      const fallbackSlug = formData?.slug || 'surprise';
      const fallbackRes = {
        success: true,
        id: formData?.id || `wc-${Date.now().toString(36)}`,
        slug: fallbackSlug,
        shareUrl: `${origin}${pathname}?v=${encodeURIComponent(fallbackSlug)}`,
        data: formData,
        savedToApi: false,
      };
      setShareResult(fallbackRes);
      setTimeout(() => setShowShareModal(true), 60);
      if (onComplete) {
        onComplete(fallbackRes);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const occasionCategory = formData.category || 'birthday';
  const isRomance =
    occasionCategory === 'romance' ||
    ['velvet-romance', 'sunset-romance', 'celestial-love', 'blush-romance'].includes(formData.templateId) ||
    Boolean(
      formData.templateId && (
        formData.templateId.includes('romance') ||
        formData.templateId.includes('velvet') ||
        formData.templateId.includes('sunset') ||
        formData.templateId.includes('celestial')
      )
    );
  const isScrapbook = !isRomance && (occasionCategory === 'scrapbook' || ['vintage-kodak', 'neon-nostalgia', 'cozy-memories'].includes(formData.templateId));
  const isApology = !isRomance && !isScrapbook && (occasionCategory === 'apology' || ['gentle-peace', 'sweet-forgive', 'fresh-start'].includes(formData.templateId));
  const _isBirthday = !isRomance && !isScrapbook && !isApology;

  const tab1Emoji = isRomance ? '❤️' : isScrapbook ? '📸' : isApology ? '🕊️' : (selectedGender === 'boy' ? '👑' : '🌸');
  const tab2Label = isRomance || isScrapbook ? '2. Photos & Music' : '2. Photo & Song';
  const tab3Label = isRomance ? '3. Letter & Quiz' : isScrapbook ? '3. Memories & Letter' : isApology ? '3. Promises & Letter' : '3. Reasons & Letter';
  const tab3ShortLabel = isRomance ? '3. Quiz' : '3. Letter';

  const FORM_TABS = [
    { id: 'details', label: '1. Names', shortLabel: '1. Names', emoji: tab1Emoji },
    { id: 'media', label: tab2Label, shortLabel: '2. Photos', emoji: '📸' },
    { id: 'surprises', label: tab3Label, shortLabel: tab3ShortLabel, emoji: '💌' },
  ];

  return (
    <div className="bg-[#FFFDFB] text-slate-800 overflow-x-hidden">

      {/* ================================================================== */}
      {/* DESKTOP LAYOUT: Two-panel split — left scrolls, right fixed         */}
      {/* ================================================================== */}
      <div className="hidden lg:flex" style={{ height: 'calc(100vh - 56px - 72px)' }}>
        {/* LEFT PANEL: Scrollable form area */}
        <div className="flex-1 overflow-y-auto pb-10 px-6 xl:px-10 pt-6 custom-scrollbar">
          {/* STEP 1: CHOOSE STYLE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn max-w-2xl">
              <TemplateSelector
                selectedId={formData.templateId}
                selectedCategory={selectedCategory}
                selectedGender={selectedGender}
                onSelectCategory={(catId) => {
                  setSelectedCategory(catId);
                  handleFieldChange({ category: catId });
                  const catTmpls = getTemplatesByCategory(catId);
                  if (catTmpls.length > 0 && !catTmpls.some((t) => t.id === formData.templateId)) {
                    const topTmpl =
                      catId === 'birthday'
                        ? (catTmpls.find((t) => t.gender === selectedGender)?.id || catTmpls[0].id)
                        : catTmpls[0].id;
                    handleTemplateChange(topTmpl);
                  }
                }}
                onSelectGender={handleGenderChange}
                onSelectTemplate={handleTemplateChange}
              />
            </div>
          )}

          {/* STEP 2: COMPLETE NON-TECHNICAL 2-MINUTE FORM */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn max-w-2xl">
              <div className="w-full flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/70 shadow-2xs">
                {FORM_TABS.map((tab) => {
                  const isActive = formSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSectionTabClick(tab.id)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer select-none ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-800 font-semibold'
                      }`}
                    >
                      <AppleEmoji emoji={tab.emoji} size={14} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-xs p-3.5 sm:p-7 space-y-5 sm:space-y-6">
                {formSection === 'details' && (
                  <StepDetails formData={formData} onChange={handleUpdateFormData} onFocusField={handleFocusField} />
                )}
                {formSection === 'media' && (
                  <StepMedia formData={formData} onChange={handleUpdateFormData} onFocusField={handleFocusField} />
                )}
                {formSection === 'surprises' && (
                  <StepSurprises formData={formData} onChange={handleUpdateFormData} onFocusField={handleFocusField} />
                )}
                {formSection !== 'surprises' && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    {formSection === 'details' && (
                      <button
                        type="button"
                        onClick={() => handleSectionTabClick('media')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/90 hover:bg-rose-100 border border-rose-200/70 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <span>Next: Photo & Song</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {formSection === 'media' && (
                      <button
                        type="button"
                        onClick={() => handleSectionTabClick('surprises')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/90 hover:bg-rose-100 border border-rose-200/70 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        <span>Next: Reasons & Letter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Fixed phone simulator — never scrolls */}
        <div
          className="shrink-0 flex flex-col items-center justify-center border-l border-slate-100 bg-[#FAFAFA] overflow-hidden p-2 sm:p-3 relative"
          style={{ width: '420px', height: '100%' }}
        >
          <LivePhonePreview
            formData={formData}
            onBack={handleBackClick || onBack}
            activeSection={formSection}
            previewScreen={previewTarget.screen}
            openEnvelope={previewTarget.openEnvelope}
            syncNonce={previewTarget.nonce}
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* MOBILE LAYOUT: Full-page scroll with simulator directly under form  */}
      {/* ================================================================== */}
      <div className="lg:hidden min-h-screen pb-36 px-4 pt-4 space-y-6">
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <TemplateSelector
              selectedId={formData.templateId}
              selectedCategory={selectedCategory}
              selectedGender={selectedGender}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                handleFieldChange({ category: catId });
                const catTmpls = getTemplatesByCategory(catId);
                if (catTmpls.length > 0 && !catTmpls.some((t) => t.id === formData.templateId)) {
                  const topTmpl =
                    catId === 'birthday'
                      ? (catTmpls.find((t) => t.gender === selectedGender)?.id || catTmpls[0].id)
                      : catTmpls[0].id;
                  handleTemplateChange(topTmpl);
                }
              }}
              onSelectGender={handleGenderChange}
              onSelectTemplate={handleTemplateChange}
            />

            {/* Mobile Simulator directly under templates */}
            <div className="space-y-3">
              <div className="pt-4 pb-2 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <AppleEmoji emoji="📱" size={14} />
                  <span>Live Phone Preview</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Interactive Simulator</span>
              </div>
              <div
                className="w-full flex items-center justify-center p-1 sm:p-3 overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50/60 to-slate-100/40 border border-slate-200/60 shadow-2xs"
                style={{ height: '640px', minHeight: '540px' }}
              >
                <LivePhonePreview
                  formData={formData}
                  onBack={handleBackClick || onBack}
                  activeSection={formSection}
                  previewScreen={previewTarget.screen}
                  openEnvelope={previewTarget.openEnvelope}
                  syncNonce={previewTarget.nonce}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-full flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/70 shadow-2xs">
              {FORM_TABS.map((tab) => {
                const isActive = formSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSectionTabClick(tab.id)}
                    className={`flex-1 inline-flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-xs transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800 font-semibold'
                    }`}
                  >
                    <AppleEmoji emoji={tab.emoji} size={13} />
                    <span>{tab.shortLabel}</span>
                  </button>
                );
              })}
            </div>
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-3.5 space-y-5">
              {formSection === 'details' && <StepDetails formData={formData} onChange={handleUpdateFormData} onFocusField={handleFocusField} />}
              {formSection === 'media' && <StepMedia formData={formData} onChange={handleUpdateFormData} onFocusField={handleFocusField} />}
              {formSection === 'surprises' && <StepSurprises formData={formData} onChange={handleUpdateFormData} onFocusField={handleFocusField} />}
              {formSection !== 'surprises' && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  {formSection === 'details' && (
                    <button type="button" onClick={() => handleSectionTabClick('media')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/90 hover:bg-rose-100 border border-rose-200/70 active:scale-95 cursor-pointer">
                      <span>Next: Photo & Song</span><ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {formSection === 'media' && (
                    <button type="button" onClick={() => handleSectionTabClick('surprises')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50/90 hover:bg-rose-100 border border-rose-200/70 active:scale-95 cursor-pointer">
                      <span>Next: Reasons & Letter</span><ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Simulator directly under form section */}
            <div className="space-y-3 pt-2">
              <div className="pt-4 pb-2 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <AppleEmoji emoji="📱" size={14} />
                  <span>Live Phone Preview</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Interactive Simulator</span>
              </div>
              <div
                className="w-full flex items-center justify-center p-1 sm:p-3 overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50/60 to-slate-100/40 border border-slate-200/60 shadow-2xs"
                style={{ height: '640px', minHeight: '540px' }}
              >
                <LivePhonePreview
                  formData={formData}
                  onBack={handleBackClick || onBack}
                  activeSection={formSection}
                  previewScreen={previewTarget.screen}
                  openEnvelope={previewTarget.openEnvelope}
                  syncNonce={previewTarget.nonce}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-rose-100/70 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Back Button or Subtle Step Indicator */}
          <div className="flex items-center min-w-0 sm:min-w-[140px]">
            {currentStep === 1 ? (
              onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200/80 active:scale-95 transition-all cursor-pointer shrink-0 border border-slate-200/60 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                  <span>Back to Home</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none px-1">
                  <AppleEmoji emoji="🎨" size={13} />
                  <span>Step 1 of 2</span>
                </div>
              )
            ) : (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200/80 active:scale-95 transition-all cursor-pointer shrink-0 border border-slate-200/60 shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                <span className="sm:hidden">Style</span>
                <span className="hidden sm:inline">Back to Style</span>
              </button>
            )}
          </div>

          {/* Center: Live Step & Recipient Context Pill */}
          <div className="hidden sm:inline-flex items-center justify-center">
            {currentStep === 1 ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-700 shadow-2xs">
                <AppleEmoji emoji="🎨" size={14} />
                <span>Step 1 of 2 • Select Surprise Aesthetic</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50/90 border border-rose-200/60 text-xs font-bold text-rose-700 shadow-2xs">
                <AppleEmoji emoji={tab1Emoji} size={14} />
                <span>Surprise for {formData.recipientName || 'Someone'}</span>
                <span className="text-rose-400 font-medium">• Step 2/2</span>
              </div>
            )}
          </div>

          {/* Right: The Luxury CTA Button */}
          <div className="flex items-center justify-end sm:min-w-[140px] ml-auto sm:ml-0">
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="relative group overflow-hidden inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm text-white tracking-wide bg-gradient-to-r from-[#E11D48] via-[#E8364E] to-[#C91834] hover:from-[#BE123C] hover:via-[#D42B43] hover:to-[#B91C1C] border border-white/25 shadow-md shadow-rose-950/20 hover:shadow-xl hover:shadow-rose-950/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed select-none whitespace-nowrap"
            >
              {/* Subtle ambient shimmer shine glow */}
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="font-bold">Crafting...</span>
                  </>
                ) : currentStep === 1 ? (
                  <>
                    <AppleEmoji emoji="✍️" size={14} />
                    <span className="font-bold">Proceed to Form</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                ) : (
                  <>
                    <AppleEmoji emoji="🚀" size={15} />
                    <span className="font-bold sm:hidden">Create Live Link</span>
                    <span className="font-bold hidden sm:inline">Create & Share Live Link</span>
                    <AppleEmoji emoji="✨" size={13} />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareResult={shareResult}
        formData={formData}
      />
    </div>
  );
}
