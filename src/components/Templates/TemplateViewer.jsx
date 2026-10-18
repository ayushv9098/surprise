import React, { useState, useEffect } from 'react';
import { 
  Maximize, 
  Minimize, 
  Share2, 
  ArrowLeft, 
  Sparkles, 
  Check 
} from 'lucide-react';
import BlushRomanceView from './BlushRomanceView';
import GoldenBirthdayView from './GoldenBirthdayView';
import PolaroidScrapbookView from './PolaroidScrapbookView';
import HeartfeltApologyView from './HeartfeltApologyView';
import { soundEffects } from './common/SoundEffects';

const TEMPLATES = [
  { id: 'blush-romance', label: 'Blush Romance', icon: '💖', component: BlushRomanceView },
  { id: 'golden-birthday', label: 'Golden Birthday', icon: '🎂', component: GoldenBirthdayView },
  { id: 'polaroid-scrapbook', label: 'Polaroid Scrapbook', icon: '📖', component: PolaroidScrapbookView },
  { id: 'heartfelt-apology', label: 'Heartfelt Apology', icon: '💜', component: HeartfeltApologyView },
];

export default function TemplateViewer({ 
  siteData = {}, 
  onBack, 
  onNavigate,
  isLiveView = false,
  showTemplateSwitcher = true
}) {
  const propTemplateId = (() => {
    const raw = (siteData.templateId || siteData.theme || siteData.type || '').toLowerCase();
    if (raw.includes('birthday') || raw.includes('bday')) return 'golden-birthday';
    if (raw.includes('scrapbook') || raw.includes('retro') || raw.includes('vintage')) return 'polaroid-scrapbook';
    if (raw.includes('apology') || raw.includes('sorry')) return 'heartfelt-apology';
    if (raw.includes('blush') || raw.includes('romance') || raw.includes('love')) return 'blush-romance';
    return null;
  })();

  const [selectedOverride, setSelectedOverride] = useState(null);
  const activeTemplateId = selectedOverride || propTemplateId || 'blush-romance';
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Handle Fullscreen
  const toggleFullscreen = () => {
    soundEffects.playPop();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Handle Share / Copy Link
  const handleShare = () => {
    soundEffects.playPop();
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl)
        .then(() => {
          setShowCopiedToast(true);
          setTimeout(() => setShowCopiedToast(false), 2800);
        })
        .catch(() => {});
    }
  };

  const handleNavigateCreate = () => {
    if (onNavigate) {
      onNavigate('builder');
    } else if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // Find component to render
  const selectedTemplate = TEMPLATES.find((t) => t.id === activeTemplateId) || TEMPLATES[0];
  const ComponentToRender = selectedTemplate.component;

  return (
    <div className="relative min-h-screen">
      
      {/* Top Floating Controls Bar */}
      <nav 
        aria-label="Keepsake Controls"
        className="fixed top-4 left-4 right-4 z-40 max-w-5xl mx-auto flex items-center justify-between pointer-events-none"
      >
        {/* Left Side: Back / Brand Pill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 backdrop-blur-md shadow-md border border-slate-200/80 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
          )}

          {/* Quick Template Switcher (Visible in preview / demo mode) */}
          {showTemplateSwitcher && !isLiveView && (
            <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-md">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    soundEffects.playPop();
                    setSelectedOverride(t.id);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTemplateId === t.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Share & Fullscreen Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 backdrop-blur-md shadow-md border border-slate-200/80 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Copy Keepsake Link"
          >
            {showCopiedToast ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 sm:px-3 sm:py-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 backdrop-blur-md shadow-md border border-slate-200/80 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </nav>

      {/* Floating Copied Toast Notification */}
      {showCopiedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Keepsake link copied to clipboard! Ready to send ✨</span>
          </div>
        </div>
      )}

      {/* Dynamic Active Template Renderer */}
      <main className="w-full">
        <ComponentToRender 
          siteData={{ ...siteData, templateId: activeTemplateId }} 
          onNavigateCreate={handleNavigateCreate}
        />
      </main>
    </div>
  );
}
