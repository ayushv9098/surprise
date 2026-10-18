import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Wand2,
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
    { number: 1, label: 'Step 1' },
    { number: 2, label: 'Step 2' },
    { number: 3, label: 'Step 3' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-slate-800 pb-28">
      {/* Studio Top Navigation */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 flex items-center justify-between">
          {/* Step Tabs with bottom line indicator */}
          <div className="flex items-center gap-0">
            {steps.map((s) => {
              const isActive = currentStep === s.number;
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => setCurrentStep(s.number)}
                  className={`relative px-5 py-3.5 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-slate-900'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {s.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile View Toggle — simple text tabs */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveMobileView('editor')}
              className={`px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                activeMobileView === 'editor'
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileView('preview')}
              className={`px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                activeMobileView === 'preview'
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Preview
            </button>
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
            {/* Autofill demo link — small text inside form area */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleApplySamplePreset}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              >
                <Wand2 className="w-3 h-3" />
                <span>Autofill with demo data</span>
              </button>
            </div>

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
                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <StepDetails formData={formData} onChange={handleUpdateFormData} />
                </div>
              </div>
            )}

            {/* Step 2 Content */}
            {currentStep === 2 && (
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm animate-fadeIn">
                <StepMedia formData={formData} onChange={handleUpdateFormData} />
              </div>
            )}

            {/* Step 3 Content */}
            {currentStep === 3 && (
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm animate-fadeIn">
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
            <div className="p-6 rounded-2xl bg-gray-50/60 border border-gray-100 flex flex-col items-center">
              <LivePhonePreview formData={formData} />
            </div>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Back — simple text link */}
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Next / Create & Share — solid button on right */}
          <button
            type="button"
            onClick={handleNextStep}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : currentStep === 3 ? (
              <span>Create & Share</span>
            ) : (
              <>
                <span>Next Step</span>
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
