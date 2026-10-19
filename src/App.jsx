import React, { useState, useEffect } from 'react';
import {
  Loader2
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { BuilderStudio } from './components/Builder';
import { TemplateViewer } from './components/Templates';
import AdminDashboard from './components/Admin/AdminDashboard';
import ErrorBoundary from './components/common/ErrorBoundary';
import { TEMPLATES } from './data/templates';
import { getPresetForTemplate } from './data/samplePresets';
import { loadSurprise } from './utils/storage';
import { Agentation } from 'agentation';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'builder' | 'viewer' | 'admin'
  const [selectedTemplateId, setSelectedTemplateId] = useState('blush-romance');
  const [siteData, setSiteData] = useState(null);
  const [isLoadingSite, setIsLoadingSite] = useState(false);
  const [toast, setToast] = useState(null);

  // Check URL on load for direct surprise links (?v=slug, ?d=compressed, ?view=admin, etc.)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const slug = searchParams.get('v') || searchParams.get('id') || searchParams.get('slug');
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
    if ((view === 'home' || view === 'builder' || view === 'admin') && typeof window !== 'undefined' && window.location.search) {
      window.history.pushState({}, '', window.location.pathname);
    }
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
        <div className="mb-6 text-4xl">✨</div>
        <h2 className="font-bold text-2xl text-gray-800 mb-2">
          Unwrapping Your Surprise...
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          Someone made something special for you. Loading memories, music, and secret messages...
        </p>
        <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
      </div>
    );
  }

  // Full Screen Live Keepsake Viewer
  if (currentView === 'viewer' && siteData) {
    return (
      <>
        <ErrorBoundary onReset={() => handleNavigate('home')}>
          <TemplateViewer
            siteData={siteData}
            isLiveView={true}
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        </ErrorBoundary>
        {import.meta.env.DEV && <Agentation />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDFB] flex flex-col selection:bg-rose-100 selection:text-rose-600">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1">
        {/* VIEW: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ErrorBoundary onReset={() => handleNavigate('home')}>
              <AdminDashboard onNavigate={handleNavigate} />
            </ErrorBoundary>
          </div>
        )}

        {/* VIEW: BUILDER STUDIO */}
        {currentView === 'builder' && (
          <div className="py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ErrorBoundary onReset={() => handleNavigate('home')}>
              <BuilderStudio
                initialTemplateId={selectedTemplateId}
                onComplete={(result) => {
                  setToast({
                    type: 'success',
                    message: `Surprise for ${result.recipientName || 'your special person'} is ready!`
                  });
                }}
              />
            </ErrorBoundary>
          </div>
        )}

        {/* VIEW: HOME LANDING PAGE */}
        {currentView === 'home' && (
          <div className="space-y-20 sm:space-y-28">

            {/* HERO SECTION */}
            <section className="pt-16 sm:pt-24 pb-8 px-4 sm:px-6 max-w-3xl mx-auto text-center">
              <h1 className="font-bold text-4xl sm:text-5xl lg:text-[56px] leading-[1.15] text-[#1a1a1a] mb-5">
                Create a surprise website for someone special
              </h1>

              <p className="text-base text-gray-500 max-w-lg mx-auto leading-relaxed mb-10">
                Turn photos, letters and songs into a heartfelt interactive website. Free, no coding, ready in 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => handleNavigate('builder')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-base font-medium bg-[#E8364E] text-white hover:bg-[#d42e44] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md"
                >
                  Start Creating →
                </button>

                <button
                  onClick={() => handlePreviewPreset('blush-romance')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-base font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  See Example
                </button>
              </div>
            </section>

            {/* TEMPLATES SECTION */}
            <section className="px-4 sm:px-6 max-w-5xl mx-auto">
              <h2 className="font-semibold text-2xl text-[#1a1a1a] mb-8">
                Pick a style
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image Preview */}
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={tmpl.previewImage}
                        alt={tmpl.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <h3 className="font-semibold text-base text-gray-900 mb-1">
                        {tmpl.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-1">
                        {tmpl.description}
                      </p>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePreviewPreset(tmpl.id)}
                          className="text-sm font-medium text-gray-600 hover:text-gray-900 active:scale-95 transition-all duration-150 cursor-pointer"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleNavigate('builder', tmpl.id)}
                          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm hover:shadow"
                        >
                          Use this
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="px-4 sm:px-6 max-w-4xl mx-auto">
              <h2 className="font-semibold text-2xl text-[#1a1a1a] mb-8">
                How it works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80">
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm flex items-center justify-center mb-4">
                    1
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Choose a style
                  </h3>
                  <p className="text-sm text-gray-500">
                    Pick from romantic, birthday, scrapbook, or heartfelt apology templates.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200/80">
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm flex items-center justify-center mb-4">
                    2
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Add your content
                  </h3>
                  <p className="text-sm text-gray-500">
                    Upload photos, write a secret letter, and pick a background song.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200/80">
                  <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm flex items-center justify-center mb-4">
                    3
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Share the link
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get an instant live link. When they open it, music plays and confetti flies.
                  </p>
                </div>
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={() => handleNavigate('builder')}
                  className="px-6 py-3 rounded-xl text-sm font-medium bg-[#E8364E] text-white hover:bg-[#d42e44] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md"
                >
                  Start Creating →
                </button>
              </div>
            </section>

          </div>
        )}
      </main>

      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
}
