import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  X,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import SitesTable from './SitesTable';
import SiteDetailModal from './SiteDetailModal';
import Toast from '../Toast';

const ADMIN_PIN = '1234';
const AUTH_STORAGE_KEY = 'wishcraft_admin_unlocked';

export default function AdminDashboard({ onNavigate }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Dashboard Data State
  const [metrics, setMetrics] = useState({
    totalSites: 0,
    totalViews: 0,
    templateBreakdown: {},
    mostPopularTemplate: 'blush-romance',
    activeToday: 0
  });
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Inspection Modal
  const [inspectSite, setInspectSite] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((t) => {
    setToast(t);
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch metrics & sites from server
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setApiError(null);

    try {
      const queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());
      if (selectedTemplate && selectedTemplate !== 'all') {
        queryParams.set('template', selectedTemplate);
      }
      if (sortBy) queryParams.set('sortBy', sortBy);

      // Fetch in parallel
      const [metricsRes, sitesRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch(`/api/admin/sites?${queryParams.toString()}`)
      ]);

      if (!metricsRes.ok || !sitesRes.ok) {
        throw new Error('Server returned an error status');
      }

      const metricsData = await metricsRes.json();
      const sitesData = await sitesRes.json();

      if (metricsData.success && metricsData.metrics) {
        setMetrics(metricsData.metrics);
      }
      if (sitesData.success && Array.isArray(sitesData.sites)) {
        setSites(sitesData.sites);
      }
    } catch (err) {
      console.warn('Could not fetch from backend API, falling back to local:', err);
      setApiError('Backend server is not reachable at /api. Please ensure "npm run server" is active on port 3001.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, selectedTemplate, sortBy]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Handle PIN unlock
  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setPinError('');
      setPinInput('');
      showToast({ type: 'success', message: 'Admin panel unlocked successfully!' });
    } else {
      setPinError('Incorrect PIN. Try 1234');
      setPinInput('');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    showToast({ type: 'info', message: 'Admin session locked' });
  };

  // Handle Delete site
  const handleDeleteSite = async (id) => {
    // Optimistic instant state update for immediate UI feedback
    setSites((prev) => prev.filter((s) => s.id !== id && s.slug !== id));
    setMetrics((prev) => ({
      ...prev,
      totalSites: Math.max(0, (prev.totalSites || 1) - 1)
    }));

    try {
      const res = await fetch(`/api/admin/sites/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete on server');
      }

      showToast({ type: 'success', message: 'Surprise website deleted permanently' });
      // Refresh data silently to keep counts in perfect sync
      fetchData(true);
    } catch (err) {
      console.error('Delete error:', err);
      showToast({ type: 'error', message: 'Could not sync deletion with server. Refreshing...' });
      fetchData(true);
    }
  };

  // Handle JSON export download
  const handleExport = async () => {
    try {
      showToast({ type: 'info', message: 'Preparing export...' });
      const res = await fetch('/api/admin/export');
      if (!res.ok) throw new Error('Export request failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wishcraft-sites-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast({ type: 'success', message: 'Export downloaded!' });
    } catch (err) {
      console.error('Export error:', err);
      // Fallback: client-side JSON export
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sites, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'wishcraft-sites-backup.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast({ type: 'success', message: 'Downloaded local backup' });
    }
  };

  // Refresh handler
  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchData(true).then(() => {
      showToast({ type: 'success', message: 'Data refreshed' });
    });
  };

  // Helper for template display label
  const getTemplateDisplayName = (key) => {
    const map = {
      'royal-sapphire': 'Royal Sapphire 👑',
      'blush-rose': 'Blush Rose 🌸',
      'blush-romance': 'Blush Romance 🌸',
      'golden-birthday': 'Golden Birthday 🎂',
      'polaroid-scrapbook': 'Polaroid Scrapbook 📸',
      'heartfelt-apology': 'Heartfelt Hug 🥺',
      'lavender-dream': 'Lavender Dream 💜',
      'princess-peach': 'Princess Peach ✨'
    };
    return map[key] || key;
  };

  // ----------------------------------------------------
  // PIN PROTECTION SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-slate-800">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Enter your PIN to continue
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="Enter PIN"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError('');
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono tracking-widest text-slate-800 text-center focus:outline-hidden focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400 bg-gray-50/50"
              />
              {pinError && (
                <p className="text-xs text-rose-500 mt-2 text-center">{pinError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Unlock
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-400">
            <span>Demo PIN: <strong className="text-slate-600 font-mono">1234</strong></span>
            {onNavigate && (
              <button
                onClick={() => onNavigate('home')}
                className="text-rose-500 hover:underline cursor-pointer"
              >
                Back to Studio
              </button>
            )}
          </div>
        </div>
        <Toast toast={toast} onClose={clearToast} />
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED DASHBOARD SCREEN
  // ----------------------------------------------------
  return (
    <div className="min-h-screen pb-20 bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Backend Warning banner if API is unreachable */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">{apiError}</span>
              <span className="text-amber-700">
                Run <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">npm run server</code> to start the API.
              </span>
            </div>
            <button
              onClick={() => fetchData()}
              className="px-3 py-1 bg-amber-200/70 hover:bg-amber-300 rounded-lg font-medium transition-colors cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <h1 className="text-2xl font-semibold text-slate-900">
            Admin Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-medium"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>

            <button
              onClick={handleExport}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-medium"
            >
              Export
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('builder')}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer shadow-sm"
              >
                Create Surprise
              </button>
            )}

            <button
              onClick={handleLock}
              title="Lock Admin Session"
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* STATS CARDS — 4 simple number cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="text-3xl font-semibold text-slate-900 mb-1">
              {metrics.totalSites || 0}
            </div>
            <p className="text-sm text-gray-500">Total Surprises</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="text-3xl font-semibold text-slate-900 mb-1">
              {metrics.totalViews || 0}
            </div>
            <p className="text-sm text-gray-500">Total Views</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="text-lg font-semibold text-slate-900 mb-1 truncate">
              {getTemplateDisplayName(metrics.mostPopularTemplate)}
            </div>
            <p className="text-sm text-gray-500">Top Template</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="text-3xl font-semibold text-slate-900 mb-1">
              {metrics.activeToday ?? (metrics.recentSites?.length || 0)}
            </div>
            <p className="text-sm text-gray-500">Active Today</p>
          </div>

        </div>

        {/* TOOLBAR: Search + Template filter + Sort options */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, slug, recipient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm bg-white border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Template Dropdown */}
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm bg-white border border-gray-200 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
          >
            <option value="all">All Templates</option>
            <option value="royal-sapphire">Royal Sapphire 👑</option>
            <option value="blush-rose">Blush Rose 🌸</option>
            <option value="blush-romance">Blush Romance 🌸</option>
            <option value="golden-birthday">Golden Birthday 🎂</option>
            <option value="polaroid-scrapbook">Polaroid Scrapbook 📸</option>
            <option value="lavender-dream">Lavender Dream 💜</option>
            <option value="heartfelt-apology">Heartfelt Hug 🥺</option>
            <option value="princess-peach">Princess Peach ✨</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm bg-white border border-gray-200 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
          >
            <option value="newest">Newest First ⏱️</option>
            <option value="oldest">Oldest First ⏳</option>
            <option value="views-desc">Most Views 🔥</option>
            <option value="views-asc">Least Views 👀</option>
            <option value="recipient">By Recipient (A-Z) 🔤</option>
          </select>
        </div>

        {/* SITES TABLE */}
        <SitesTable
          sites={sites}
          loading={loading}
          onInspect={(site) => setInspectSite(site)}
          onDelete={handleDeleteSite}
          onToast={showToast}
          onCreateNew={() => onNavigate && onNavigate('builder')}
        />

        {/* SITE DETAIL INSPECT MODAL */}
        {inspectSite && (
          <SiteDetailModal
            site={inspectSite}
            onClose={() => setInspectSite(null)}
            onDelete={handleDeleteSite}
            onToast={showToast}
          />
        )}

        {/* TOAST NOTIFICATIONS */}
        <Toast toast={toast} onClose={clearToast} />

      </div>
    </div>
  );
}
