import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  KeyRound,
  Sparkles,
  Eye,
  Heart,
  Activity,
  Search,
  RefreshCw,
  Download,
  PlusCircle,
  AlertCircle,
  X,
  LogOut,
  ArrowRight
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
      setPinError('Incorrect PIN code. Hint: Use 1234');
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
    try {
      const res = await fetch(`/api/admin/sites/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete on server');
      }

      showToast({ type: 'success', message: 'Surprise website deleted permanently' });
      // Refresh data
      fetchData(true);
    } catch (err) {
      console.error('Delete error:', err);
      // Optimistic local update fallback
      setSites((prev) => prev.filter((s) => s.id !== id && s.slug !== id));
      showToast({ type: 'info', message: 'Site removed from view' });
    }
  };

  // Handle JSON export download
  const handleExport = async () => {
    try {
      showToast({ type: 'info', message: 'Preparing export download...' });
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

      showToast({ type: 'success', message: 'Export downloaded successfully!' });
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
      showToast({ type: 'success', message: 'Downloaded local backup JSON' });
    }
  };

  // Refresh handler with spin feedback
  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchData(true).then(() => {
      showToast({ type: 'success', message: 'Metrics and sites refreshed' });
    });
  };

  // Helper for template display label
  const getTemplateDisplayName = (key) => {
    const map = {
      'blush-romance': 'Blush Romance 🌸',
      'golden-birthday': 'Golden Birthday 🎂',
      'polaroid-scrapbook': 'Polaroid Scrapbook 📸',
      'heartfelt-apology': 'Heartfelt Hug 🥺'
    };
    return map[key] || key;
  };

  // ----------------------------------------------------
  // PIN PROTECTION SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-rose-100/30 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-200/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative text-center">
            {/* Lock Icon */}
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center text-white shadow-md shadow-slate-300">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-serif font-bold text-slate-800">
              WishCraft Admin Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 mb-6">
              Enter Owner Passcode to manage websites, inspect letters, and view real-time traffic.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-left text-xs font-semibold text-slate-600 mb-1.5">
                  Security Passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={8}
                    autoFocus
                    placeholder="Enter PIN (e.g. 1234)"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (pinError) setPinError('');
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono tracking-widest text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50"
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-rose-500 font-medium text-left mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-md shadow-slate-200 transition-all cursor-pointer"
              >
                <span>Unlock Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Demo PIN: <strong className="text-slate-600 font-mono">1234</strong></span>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('home')}
                  className="text-rose-600 hover:underline cursor-pointer"
                >
                  Return to Studio
                </button>
              )}
            </div>

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
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Backend Warning banner if API is unreachable */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">{apiError}</span>
              <span className="text-amber-700">
                You can run <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">npm run server</code> to start the Express API on port 3001.
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

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Control Center
              </span>
              <span className="text-xs text-slate-400 font-medium">Session Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Surprise Management Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Monitor user-generated websites, live recipient view engagement, and full memory archives.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            {onNavigate && (
              <button
                onClick={() => onNavigate('builder')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Surprise</span>
              </button>
            )}

            <button
              onClick={handleLock}
              title="Lock Admin Session"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>

        {/* TOP STATS CARDS ROW (Apple-style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* Card 1: Total Surprises */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Surprises
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-slate-900 mb-1">
              {metrics.totalSites || 0}
            </div>
            <p className="text-[11px] text-slate-500">
              Live websites crafted & published
            </p>
          </div>

          {/* Card 2: Total Live Views */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Live Views
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-slate-900 mb-1">
              {metrics.totalViews || 0}
            </div>
            <p className="text-[11px] text-slate-500">
              Recipient surprise opens & reads
            </p>
          </div>

          {/* Card 3: Most Popular Template */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Top Template
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-bold text-slate-900 truncate mb-1">
              {getTemplateDisplayName(metrics.mostPopularTemplate)}
            </div>
            <p className="text-[11px] text-slate-500">
              Highest selected style
            </p>
          </div>

          {/* Card 4: Active Today */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Today
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-slate-900 mb-1">
              {metrics.activeToday ?? (metrics.recentSites?.length || 0)}
            </div>
            <p className="text-[11px] text-slate-500">
              Surprises created or viewed today
            </p>
          </div>

        </div>

        {/* TOOLBAR: Search, Filters, & Action Buttons */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, recipient, sender, slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400"
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

          {/* Filters & Actions Group */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Template Dropdown */}
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
            >
              <option value="all">All Templates</option>
              <option value="blush-romance">Blush Romance 🌸</option>
              <option value="golden-birthday">Golden Birthday 🎂</option>
              <option value="polaroid-scrapbook">Polaroid Scrapbook 📸</option>
              <option value="heartfelt-apology">Heartfelt Hug 🥺</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="views-desc">Most Viewed</option>
              <option value="views-asc">Least Viewed</option>
              <option value="oldest">Oldest First</option>
              <option value="recipient">Recipient (A-Z)</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              title="Refresh sites list"
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-rose-500' : ''}`} />
            </button>

            {/* Export JSON Button */}
            <button
              onClick={handleExport}
              title="Export all records as JSON file"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

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
