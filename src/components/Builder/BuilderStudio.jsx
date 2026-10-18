import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Wand2,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import TemplateSelector from './TemplateSelector';
import StepDetails from './StepDetails';
import StepMedia from './StepMedia';
import StepSurprises from './StepSurprises';
import LivePhonePreview from './LivePhonePreview';
import ShareModal from './ShareModal';
import { getPresetForTemplate } from '../../data/samplePresets';
import { saveSurprise } from '../../utils/storage';

export default function BuilderStudio({ initialTemplateId = 'blush-romance', onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeMobileView, setActiveMobileView] = useState('editor'); // 'editor' | 'preview'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareResult, setShareResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState(() => {
    const preset = getPresetForTemplate(initialTemplateId);
    return {
      templateId: initialTemplateId,
      recipientName: preset.recipientName || 'Aditi',
      senderName: preset.senderName || 'Rahul',
      occasion: preset.occasion || 'Happy 2nd Anniversary My Love! 🌸',
      subtitle: preset.subtitle || '730 days of falling in love with your smile, over and over again.',
      photos: preset.photos || [],
      songId: 'romantic-acoustic',
      letter: preset.letter || {},
      quiz: preset.quiz || {},
      scratchCard: preset.scratchCard || {},
    };
  });

  const handleUpdateFormData = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleTemplateChange = (templateId) => {
    const preset = getPresetForTemplate(templateId);
    setFormData((prev) => ({
      ...prev,
      templateId,
      recipientName: prev.recipientName || preset.recipientName,
      senderName: prev.senderName || preset.senderName,
      occasion: preset.occasion,
      subtitle: preset.subtitle,
      photos: prev.photos?.length > 0 ? prev.photos : preset.photos,
      letter: preset.letter,
      quiz: preset.quiz,
      scratchCard: preset.scratchCard,
    }));
  };

  const handleApplySamplePreset = () => {
    const preset = getPresetForTemplate(formData.templateId);
    setFormData((prev) => ({
      ...prev,
      recipientName: preset.recipientName,
      senderName: preset.senderName,
      occasion: preset.occasion,
      subtitle: preset.subtitle,
      photos: preset.photos,
      letter: preset.letter,
      quiz: preset.quiz,
      scratchCard: preset.scratchCard,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handlePublish();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const res = await saveSurprise(formData);
      setShareResult(res);
      setShowShareModal(true);
      if (onComplete) {
        onComplete(res);
      }
    } catch (err) {
      console.error('Failed to publish surprise:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Details', subtitle: 'Who & Why' },
    { number: 2, title: 'Media & Song', subtitle: 'Photos & Music' },
    { number: 3, title: 'Surprises', subtitle: 'Letters & Games' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-slate-800 pb-28">
      {/* Studio Top Control Strip */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-rose-100/70 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Step Progress Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {steps.map((s) => {
              const isActive = currentStep === s.number;
              const isPast = currentStep > s.number;
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => setCurrentStep(s.number)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-xs'
                      : isPast
                      ? 'bg-rose-100/80 text-rose-700 hover:bg-rose-200/80'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200/60'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-rose-600'
                        : isPast
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-300 text-white'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> : s.number}
                  </span>
                  <span className="hidden sm:inline">{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Demo Data Loader & Mobile View Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplySamplePreset}
              title="Autofill with sweet romantic demo content"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer shadow-2xs"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span className="hidden md:inline">1-Click Aesthetic Sample</span>
              <span className="md:hidden">Demo Fill</span>
            </button>

            {/* Mobile View Toggle (Editor vs Preview) */}
            <div className="lg:hidden flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveMobileView('editor')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeMobileView === 'editor'
                    ? 'bg-white text-rose-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Studio
              </button>
              <button
                type="button"
                onClick={() => setActiveMobileView('preview')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activeMobileView === 'preview'
                    ? 'bg-white text-rose-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: 3-Step Form Editor (7 cols) */}
          <div
            className={`lg:col-span-7 space-y-8 ${
              activeMobileView === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Step 1 Content */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                {/* Template Selector Grid */}
                <TemplateSelector
                  selectedId={formData.templateId}
                  onSelect={handleTemplateChange}
                  onApplyPreset={handleApplySamplePreset}
                />

                {/* Details Form Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-rose-100/90 shadow-sm shadow-rose-100/30">
                  <StepDetails formData={formData} onChange={handleUpdateFormData} />
                </div>
              </div>
            )}

            {/* Step 2 Content */}
            {currentStep === 2 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-rose-100/90 shadow-sm shadow-rose-100/30 animate-fadeIn">
                <StepMedia formData={formData} onChange={handleUpdateFormData} />
              </div>
            )}

            {/* Step 3 Content */}
            {currentStep === 3 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-rose-100/90 shadow-sm shadow-rose-100/30 animate-fadeIn">
                <StepSurprises formData={formData} onChange={handleUpdateFormData} />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Live Phone Preview (5 cols) */}
          <div
            className={`lg:col-span-5 lg:sticky lg:top-32 ${
              activeMobileView === 'editor' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="p-4 sm:p-6 rounded-3xl bg-rose-50/40 border border-rose-100/80 shadow-inner flex flex-col items-center">
              <LivePhonePreview formData={formData} />
            </div>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-t border-rose-100/80 shadow-lg shadow-rose-950/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Back Button */}
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Step Helper Text */}
          <div className="text-center hidden sm:block">
            <span className="text-xs font-bold text-slate-800">
              {currentStep === 1 && 'Step 1 of 3: Choose Style & Names'}
              {currentStep === 2 && 'Step 2 of 3: Add Photos & Soundtrack'}
              {currentStep === 3 && 'Step 3 of 3: Final Surprises & Wax Seal'}
            </span>
            <p className="text-[11px] text-slate-400">Takes less than 2 minutes</p>
          </div>

          {/* Next / Publish Button */}
          <button
            type="button"
            onClick={handleNextStep}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-200/80 hover:shadow-lg hover:shadow-rose-300/80 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Magic...</span>
              </>
            ) : currentStep === 3 ? (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Publish & Get Share Link ✨</span>
              </>
            ) : (
              <>
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
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
