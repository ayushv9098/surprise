import React, { useState, useEffect } from 'react';
import {
  Loader2,
  ArrowRight,
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { BuilderStudio, RecipientModal } from './components/Builder';
import { TemplateViewer } from './components/Templates';
import AdminDashboard from './components/Admin/AdminDashboard';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppleEmoji from './components/common/AppleEmoji';
import { CATEGORIES } from './data/categories';
import { getPresetForTemplate } from './data/samplePresets';
import { loadSurprise } from './utils/storage';
import { Agentation } from 'agentation';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (
        searchParams.get('view') === 'admin' ||
        window.location.pathname.toLowerCase() === '/admin'
      ) {
        return 'admin';
      }
    }
    return 'home';
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState('royal-sapphire');
  const [siteData, setSiteData] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoadingSite, setIsLoadingSite] = useState(false);
  const [toast, setToast] = useState(null);
  const [recipientModalCategory, setRecipientModalCategory] = useState(null);

  const handleNavigate = (view, templateId = null) => {
    if (templateId) {
      setSelectedTemplateId(templateId);
    }
    if (view === 'home') {
      setSiteData(null);
      setIsPreviewMode(false);
      setCurrentView('home');
      if (typeof window !== 'undefined') {
        window.history.pushState({ view: 'home' }, '', '/');
      }
    } else {
      setCurrentView(view);
      if (typeof window !== 'undefined') {
        if (view === 'admin') {
          window.history.pushState({ view: 'admin' }, '', '/admin');
        } else if (
          window.location.pathname.toLowerCase() === '/admin' ||
          window.location.search
        ) {
          window.history.pushState({ view }, '', '/');
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check URL on load for direct surprise links (?v=slug, ?d=compressed, ?view=admin, /admin, etc.)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const slug = searchParams.get('v') || searchParams.get('id') || searchParams.get('slug');
    const compressedData = searchParams.get('d');
    const viewParam = searchParams.get('view');
    const previewTemplate = searchParams.get('preview');

    if (viewParam === 'admin' || window.location.pathname.toLowerCase() === '/admin') {
      return;
    }

    if (previewTemplate) {
      const preset = getPresetForTemplate(previewTemplate);
      setSiteData({ ...preset, templateId: previewTemplate });
      setIsPreviewMode(true);
      setCurrentView('viewer');
      return;
    }

    if (slug || compressedData) {
      setIsLoadingSite(true);
      loadSurprise(slug || window.location.search)
        .then((data) => {
          if (data) {
            const actualSite = data.site || data.data || data;
            setSiteData(actualSite);
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

  // Secret keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A to quickly open Admin from any page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleNavigate('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (
        searchParams.get('view') === 'admin' ||
        window.location.pathname.toLowerCase() === '/admin'
      ) {
        setCurrentView('admin');
      } else if (searchParams.get('preview')) {
        const previewTpl = searchParams.get('preview');
        const preset = getPresetForTemplate(previewTpl);
        setSiteData({ ...preset, templateId: previewTpl });
        setIsPreviewMode(true);
        setCurrentView('viewer');
      } else if (searchParams.get('v') || searchParams.get('id') || searchParams.get('slug') || searchParams.get('d')) {
        // Keepsake view
      } else {
        // Browser back button was pressed from a preview or other view:
        // Keep the user strictly on the home page inside WishCraft!
        setSiteData(null);
        setIsPreviewMode(false);
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePreviewPreset = (templateId) => {
    const preset = getPresetForTemplate(templateId);
    setSiteData({ ...preset, templateId });
    setIsPreviewMode(true);
    setCurrentView('viewer');
    if (typeof window !== 'undefined') {
      window.history.pushState({ view: 'preview', templateId }, '', `/?preview=${encodeURIComponent(templateId)}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (cat) => {
    if (cat.hasGender) {
      setRecipientModalCategory(cat);
    } else {
      handleNavigate('builder', cat.defaultTemplate);
    }
  };

  const handleRecipientSelect = (_gender, templateId) => {
    setRecipientModalCategory(null);
    handleNavigate('builder', templateId);
  };

  const handleStartCreating = () => {
    const birthdayCategory = CATEGORIES.find((c) => c.id === 'birthday') || CATEGORIES[0];
    setRecipientModalCategory(birthdayCategory);
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
    const isSharedKeepsake = Boolean(
      typeof window !== 'undefined' && (
        new URLSearchParams(window.location.search).get('v') ||
        new URLSearchParams(window.location.search).get('slug') ||
        new URLSearchParams(window.location.search).get('d')
      )
    );
    const isLiveView = !isPreviewMode && isSharedKeepsake;

    return (
      <>
        <ErrorBoundary onReset={() => handleNavigate('home')}>
          <TemplateViewer
            siteData={siteData}
            isLiveView={isLiveView}
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
                onBack={() => handleNavigate('home')}
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
              <h1 className="font-bold text-4xl sm:text-5xl lg:text-[56px] leading-[1.15] text-[#1a1a1a] mb-5 tracking-tight">
                Create a surprise website for someone special
              </h1>

              <p className="text-base text-gray-500 max-w-lg mx-auto leading-relaxed mb-10">
                Turn photos, letters and songs into a heartfelt interactive website. Free, no coding, ready in 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleStartCreating}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-base font-medium bg-[#E8364E] text-white hover:bg-[#d42e44] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md"
                >
                  Start Creating →
                </button>

                <button
                  onClick={() => handlePreviewPreset('royal-sapphire')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-base font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  See Example
                </button>
              </div>
            </section>

            {/* OCCASION SELECTION SECTION */}
            <section id="occasions" className="px-4 sm:px-6 max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="font-semibold text-2xl text-[#1a1a1a]">
                  Choose an occasion
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Pick an occasion to customize personalized keepsake surprises
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className="group bg-white rounded-2xl border border-gray-200/80 p-6 text-left transition-all duration-200 hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Top row: circular/rounded icon container with AppleEmoji and subtle Select -> */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-13 h-13 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-rose-50/50 group-hover:border-rose-100 transition-all duration-200 shadow-2xs">
                          <AppleEmoji emoji={cat.emoji} size={28} />
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-rose-600 transition-colors">
                          <span>Select</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-rose-600 transition-colors">
                        {cat.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </button>
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
                  onClick={handleStartCreating}
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
      <RecipientModal
        isOpen={Boolean(recipientModalCategory)}
        category={recipientModalCategory}
        onSelect={handleRecipientSelect}
        onClose={() => setRecipientModalCategory(null)}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
}
