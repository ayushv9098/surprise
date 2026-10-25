import React, { useState, useEffect } from 'react';
import { 
  Maximize, 
  Minimize, 
  Share2, 
  ArrowLeft, 
  Sparkles, 
  Check 
} from 'lucide-react';
import MultiSceneBirthdayView from './MultiSceneBirthdayView';
import HeartfeltApologyView from './HeartfeltApologyView';
import PolaroidScrapbookView from './PolaroidScrapbookView';
import BlushRomanceView from './BlushRomanceView';
import { soundEffects } from './common/SoundEffects';

const TEMPLATES = [
  // Birthday Templates
  { id: 'royal-sapphire', label: 'Royal Sapphire', icon: '👑', component: MultiSceneBirthdayView },
  { id: 'golden-birthday', label: 'Golden Spark', icon: '🎂', component: MultiSceneBirthdayView },
  { id: 'polaroid-scrapbook', label: 'Retro Polaroid', icon: '📸', component: MultiSceneBirthdayView },
  { id: 'midnight-onyx', label: 'Midnight Onyx', icon: '🖤', component: MultiSceneBirthdayView },
  { id: 'blush-rose', label: 'Blush Blossom', icon: '🌸', component: MultiSceneBirthdayView },
  { id: 'princess-peach', label: 'Princess Peach', icon: '✨', component: MultiSceneBirthdayView },
  { id: 'lavender-dream', label: 'Lavender Dream', icon: '💜', component: MultiSceneBirthdayView },
  { id: 'cinderella-sky', label: 'Cinderella Sky', icon: '🩵', component: MultiSceneBirthdayView },

  // Romance & Anniversary Templates
  { id: 'velvet-romance', label: 'Velvet Rose', icon: '❤️', component: BlushRomanceView },
  { id: 'sunset-romance', label: 'Sunset Glow', icon: '🌅', component: BlushRomanceView },
  { id: 'celestial-love', label: 'Celestial Indigo', icon: '🌌', component: BlushRomanceView },
  { id: 'amethyst-romance', label: 'Amethyst Dream', icon: '💜', component: BlushRomanceView },

  // Memory Scrapbook Templates
  { id: 'vintage-kodak', label: 'Vintage Kodak', icon: '📸', component: PolaroidScrapbookView },
  { id: 'neon-nostalgia', label: 'Electric Vibes', icon: '⚡', component: PolaroidScrapbookView },
  { id: 'cozy-memories', label: 'Cozy Sunset', icon: '☕', component: PolaroidScrapbookView },

  // Heartfelt Apology Templates
  { id: 'gentle-peace', label: 'Olive Peace', icon: '🕊️', component: HeartfeltApologyView },
  { id: 'sweet-forgive', label: 'Sweet Hugs', icon: '🥺', component: HeartfeltApologyView },
  { id: 'fresh-start', label: 'Sunrise Renewal', icon: '🌤️', component: HeartfeltApologyView },

  // Legacy Compatibility
  { id: 'blush-romance', label: 'Blush Romance', icon: '💖', component: BlushRomanceView },
  { id: 'heartfelt-apology', label: 'Heartfelt Apology', icon: '🥺', component: HeartfeltApologyView },
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

    // Specific new occasion templates
    if (raw.includes('amethyst') || raw.includes('violet') || (raw.includes('purple') && raw.includes('romance'))) return 'amethyst-romance';
    if (raw.includes('velvet')) return 'velvet-romance';
    if (raw.includes('sunset')) return 'sunset-romance';
    if (raw.includes('celestial')) return 'celestial-love';
    if (raw.includes('blush-romance') || raw === 'blush-romance') return 'velvet-romance';

    if (raw.includes('kodak')) return 'vintage-kodak';
    if (raw.includes('neon')) return 'neon-nostalgia';
    if (raw.includes('cozy')) return 'cozy-memories';

    if (raw.includes('peace') || raw.includes('olive')) return 'gentle-peace';
    if (raw.includes('forgive') || raw.includes('sweet')) return 'sweet-forgive';
    if (raw.includes('fresh') || raw.includes('sunrise') || raw.includes('renewal')) return 'fresh-start';

    // Existing birthday templates
    if (raw.includes('sapphire') || raw.includes('royal')) return 'royal-sapphire';
    if (raw.includes('multiscene') || raw.includes('multi-scene')) return siteData.gender === 'girl' ? 'blush-rose' : 'royal-sapphire';
    if (raw.includes('gold') || raw === 'golden-birthday' || raw === 'golden') return 'golden-birthday';
    if (raw.includes('polaroid')) return 'polaroid-scrapbook';
    if (raw.includes('midnight') || raw.includes('onyx') || raw.includes('emerald') || raw.includes('jade')) return 'midnight-onyx';
    if (raw.includes('cinderella') || raw.includes('sky')) return 'cinderella-sky';
    if (raw.includes('rose') || raw.includes('blush-rose')) return 'blush-rose';
    if (raw.includes('peach')) return 'princess-peach';
    if (raw.includes('lavender')) return 'lavender-dream';

    // Occasion based / legacy fallbacks
    if (raw.includes('apology') || raw.includes('sorry')) return 'gentle-peace';
    if (raw.includes('romance') || raw.includes('love') || raw.includes('anniversary')) return 'velvet-romance';
    if (raw.includes('scrapbook') || raw.includes('retro') || raw.includes('vintage')) return 'vintage-kodak';
    if (raw.includes('birthday') || raw.includes('bday')) {
      return siteData.gender === 'girl' ? 'blush-rose' : 'royal-sapphire';
    }
    return raw || null;
  })();

  const [selectedOverride, setSelectedOverride] = useState(null);
  const activeTemplateId = selectedOverride || propTemplateId || (() => {
    const cat = (siteData.category || '').toLowerCase();
    if (cat === 'romance') return 'velvet-romance';
    if (cat === 'scrapbook') return 'vintage-kodak';
    if (cat === 'apology') return 'gentle-peace';
    return siteData.gender === 'girl' ? 'blush-rose' : 'royal-sapphire';
  })();
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
    <div className="relative min-h-screen overflow-x-hidden">
      
      {/* Top Floating Controls Bar (Hidden in Live Keepsake View for pure recipient experience) */}
      {!isLiveView && (
        <nav 
          aria-label="Keepsake Controls"
          className="fixed top-4 left-4 right-4 z-40 max-w-5xl mx-auto flex items-center justify-between pointer-events-none"
        >
          {/* Left Side: Back / Brand Pill */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {!isLiveView && onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-slate-950 backdrop-blur-md shadow-md border border-slate-200/90 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dearly</span>
              </button>
            )}

            {/* Quick Template Switcher (Visible in preview / demo mode) */}
            {!isLiveView && showTemplateSwitcher && (
              <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-md overflow-x-auto max-w-md lg:max-w-xl">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundEffects.playPop();
                      setSelectedOverride(t.id);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                      activeTemplateId === t.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span className="truncate max-w-[100px]">{t.label}</span>
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
      )}

      {/* Floating Copied Toast Notification */}
      {!isLiveView && showCopiedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Keepsake link copied to clipboard! Ready to send.</span>
          </div>
        </div>
      )}

      {/* Dynamic Active Template Renderer */}
      <main className="w-full">
        <ComponentToRender 
          siteData={{ ...siteData, templateId: activeTemplateId }} 
          onBack={isLiveView ? undefined : onBack}
          onNavigate={onNavigate}
          onNavigateCreate={handleNavigateCreate}
          isLiveView={isLiveView}
        />
      </main>
    </div>
  );
}
