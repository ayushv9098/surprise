import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Music,
  Camera,
  Mail,
  Share2,
  ExternalLink,
  ChevronRight,
  Loader2,
  Play
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { BuilderStudio } from './components/Builder';
import { TemplateViewer } from './components/Templates';
import AdminDashboard from './components/Admin/AdminDashboard';
import { TEMPLATES } from './data/templates';
import { getPresetForTemplate } from './data/samplePresets';
import { loadSurprise } from './utils/storage';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'builder' | 'viewer' | 'admin'
  const [selectedTemplateId, setSelectedTemplateId] = useState('blush-romance');
  const [siteData, setSiteData] = useState(null);
  const [isLoadingSite, setIsLoadingSite] = useState(false);
  const [toast, setToast] = useState(null);

  // Check URL on load for direct surprise links (?v=slug, ?d=compressed, ?view=admin, etc.)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const slug = searchParams.get('v') || searchParams.get('id');
    const compressedData = searchParams.get('d');
    const viewParam = searchParams.get('view');
    const previewTemplate = searchParams.get('preview');

    if (viewParam === 'admin') {
      setCurrentView('admin');
      return;
    }

    if (previewTemplate) {
      const preset = getPresetForTemplate(previewTemplate);
      setSiteData({ ...preset, templateId: previewTemplate });
      setCurrentView('viewer');
      return;
    }

    if (slug || compressedData) {
      setIsLoadingSite(true);
      loadSurprise(slug || window.location.search)
        .then((data) => {
          if (data) {
            setSiteData(data);
            setCurrentView('viewer');
          } else {
            setToast({ type: 'error', message: 'Could not load surprise website. Opening creator studio.' });
            setCurrentView('home');
          }
        })
        .catch(() => {
          setToast({ type: 'error', message: 'Error loading surprise website.' });
          setCurrentView('home');
        })
        .finally(() => {
          setIsLoadingSite(false);
        });
    }
  }, []);

  const handleNavigate = (view, templateId = null) => {
    if (templateId) {
      setSelectedTemplateId(templateId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviewPreset = (templateId) => {
    const preset = getPresetForTemplate(templateId);
    setSiteData({ ...preset, templateId });
    setCurrentView('viewer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state while loading a shared surprise site
  if (isLoadingSite) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-200/40 mb-6 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-slate-800 mb-2">
          Unwrapping Your Surprise...
        </h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          Someone made something special for you. Loading memories, music, and secret messages...
        </p>
        <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
      </div>
    );
  }

  // Full Screen Live Keepsake Viewer
  if (currentView === 'viewer' && siteData) {
    return (
      <TemplateViewer
        siteData={siteData}
        isLiveView={true}
        onBack={() => handleNavigate('home')}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDFB] flex flex-col selection:bg-rose-100 selection:text-rose-600">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1">
        {/* VIEW: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <AdminDashboard onNavigate={handleNavigate} />
          </div>
        )}

        {/* VIEW: BUILDER STUDIO */}
        {currentView === 'builder' && (
          <div className="py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <BuilderStudio
              initialTemplateId={selectedTemplateId}
              onComplete={(result) => {
                setToast({
                  type: 'success',
                  message: `Surprise for ${result.recipientName || 'your special person'} is ready!`
                });
              }}
            />
          </div>
        )}

        {/* VIEW: HOME LANDING PAGE */}
        {currentView === 'home' && (
          <div className="space-y-24 sm:space-y-32">
            {/* HERO SECTION */}
            <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center overflow-hidden">
              {/* Background ambient glow circles */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-gradient-to-tr from-rose-100/50 via-pink-100/40 to-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

              {/* Tag pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50/90 border border-rose-200/70 text-rose-700 text-xs font-semibold shadow-xs mb-8 animate-float">
                <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>100% Free Forever • Made For Real Emotions</span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.15] max-w-4xl mx-auto mb-6">
                Make Someone Smile With A{' '}
                <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                  Custom Keepsake
                </span>{' '}
                Website.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
                Turn favorite photos, inside jokes, and heartfelt letters into a breathtaking, interactive website in under 2 minutes. No coding required.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-16">
                <button
                  onClick={() => handleNavigate('builder')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-xl shadow-rose-200/80 hover:shadow-2xl hover:shadow-rose-300/80 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Create Surprise Free</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>

                <button
                  onClick={() => handlePreviewPreset('blush-romance')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-semibold bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>See Live Devi Demo</span>
                </button>
              </div>

              {/* Social Proof Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-rose-100/60 text-left">
                <div className="p-3 bg-white/60 backdrop-blur-xs rounded-2xl border border-rose-100/50">
                  <div className="font-serif font-bold text-xl sm:text-2xl text-slate-900">12,400+</div>
                  <div className="text-xs text-slate-500 font-medium">Surprises Created</div>
                </div>
                <div className="p-3 bg-white/60 backdrop-blur-xs rounded-2xl border border-rose-100/50">
                  <div className="font-serif font-bold text-xl sm:text-2xl text-rose-600">4.9 / 5 ⭐️</div>
                  <div className="text-xs text-slate-500 font-medium">Love & Smile Rating</div>
                </div>
                <div className="p-3 bg-white/60 backdrop-blur-xs rounded-2xl border border-rose-100/50">
                  <div className="font-serif font-bold text-xl sm:text-2xl text-slate-900">2 Mins</div>
                  <div className="text-xs text-slate-500 font-medium">Instant Live Link</div>
                </div>
                <div className="p-3 bg-white/60 backdrop-blur-xs rounded-2xl border border-rose-100/50">
                  <div className="font-serif font-bold text-xl sm:text-2xl text-emerald-600">100% Free</div>
                  <div className="text-xs text-slate-500 font-medium">Zero Paywall Today</div>
                </div>
              </div>
            </section>

            {/* TEMPLATES SHOWCASE */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>4 Crafted Aesthetics</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                  Choose the Perfect Vibe
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Every template is crafted with emotional detail: background music, sealed letters, interactive scratch cards, and romantic quizzes.
                </p>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="group relative bg-white/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md shadow-slate-100 hover:shadow-xl hover:shadow-rose-100/50 hover:border-rose-200 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{tmpl.emoji}</span>
                          <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                            {tmpl.tag}
                          </span>
                        </div>
                        {tmpl.badges && tmpl.badges[0] && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
                            {tmpl.badges[0]}
                          </span>
                        )}
                      </div>

                      {/* Title & Headline */}
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-3">
                        {tmpl.headline}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {tmpl.description}
                      </p>

                      {/* Image Preview Banner */}
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 border border-slate-100 group-hover:scale-[1.01] transition-transform">
                        <img
                          src={tmpl.previewImage}
                          alt={tmpl.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-4">
                          <span className="text-xs font-medium text-white/90">
                            Includes live audio & interactive elements
                          </span>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="grid grid-cols-2 gap-2 mb-8">
                        {tmpl.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handlePreviewPreset(tmpl.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-slate-700" />
                        <span>Live Preview</span>
                      </button>

                      <button
                        onClick={() => handleNavigate('builder', tmpl.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200/60 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS (3 SIMPLE STEPS) */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
              <div className="bg-gradient-to-b from-rose-50/60 to-pink-50/30 rounded-3xl p-8 sm:p-14 border border-rose-100/70">
                <div className="text-center max-w-xl mx-auto mb-12">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Dead Simple For Anyone
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-3">
                    Ready In Just 3 Quick Steps
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    You don't need any technical skills. If you can send a WhatsApp text, you can build a stunning website.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/90 p-6 rounded-2xl border border-rose-100 shadow-sm flex flex-col">
                    <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-600 font-serif font-bold text-lg flex items-center justify-center mb-4">
                      1
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">
                      Choose Your Vibe
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Select between romantic blush, golden birthday celebration, vintage polaroid scrapbook, or sweet apology hug.
                    </p>
                  </div>

                  <div className="bg-white/90 p-6 rounded-2xl border border-rose-100 shadow-sm flex flex-col">
                    <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-600 font-serif font-bold text-lg flex items-center justify-center mb-4">
                      2
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">
                      Add Photos & Secret Letter
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Drop in your favorite photos, choose a cute background song, and write a secret letter sealed with a digital wax stamp.
                    </p>
                  </div>

                  <div className="bg-white/90 p-6 rounded-2xl border border-rose-100 shadow-sm flex flex-col">
                    <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-600 font-serif font-bold text-lg flex items-center justify-center mb-4">
                      3
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">
                      Send Instant WhatsApp Link
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Get a custom live link and QR code in 1 click. When they open it, confetti flies and music starts automatically!
                    </p>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <button
                    onClick={() => handleNavigate('builder')}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all cursor-pointer"
                  >
                    <span>Start Building Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* CREATOR / OWNER CONTROL CALLOUT */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
                    <span>Owner Control Center</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Full Visibility Over Every Website Created
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-lg">
                    Track visitor counts, explore created websites, view photos & letters, and export database anytime through the PIN-protected Admin Panel.
                  </p>
                </div>

                <button
                  onClick={() => handleNavigate('admin')}
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Admin Panel</span>
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
