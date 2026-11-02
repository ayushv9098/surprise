import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  X,
  LogOut,
  AlertCircle,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Plus,
  Sparkles,
  Inbox
} from 'lucide-react';
import SitesTable from './SitesTable';
import SiteDetailModal from './SiteDetailModal';
import Toast from '../Toast';

const AUTH_TOKEN_KEY = 'dearly_admin_token';

export default function AdminDashboard({ onNavigate }) {
  // Authentication State
  const [authToken, setAuthToken] = useState(() => {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(sessionStorage.getItem(AUTH_TOKEN_KEY));
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Dashboard Data State
  const [metrics, setMetrics] = useState({
    totalSites: 0,
    totalViews: 0,
    openedSites: 0,
    unopenedSites: 0,
    templateBreakdown: {},
    mostPopularTemplate: 'none',
    activeToday: 0
  });
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'opened' | 'unopened'
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

  // Logout handler
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem('dearly_admin_unlocked');
    sessionStorage.removeItem('wishcraft_admin_unlocked');
    setAuthToken('');
    setIsAuthenticated(false);
    setSites([]);
    setMetrics({
      totalSites: 0,
      totalViews: 0,
      openedSites: 0,
      unopenedSites: 0,
      templateBreakdown: {},
      mostPopularTemplate: 'none',
      activeToday: 0
    });
    showToast({ type: 'info', message: 'Logged out of admin dashboard' });
  }, [showToast]);

  // Fetch metrics & sites from server with secured header
  const fetchData = useCallback(async (isSilent = false) => {
    const token = authToken || sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    if (!isSilent) setLoading(true);
    setApiError(null);

    try {
      const queryParams = new URLSearchParams();
      if (selectedTemplate && selectedTemplate !== 'all') {
        queryParams.set('template', selectedTemplate);
      }
      if (sortBy) queryParams.set('sortBy', sortBy);

      const headers = {
        'x-admin-key': token,
        'Authorization': `Bearer ${token}`
      };

      // Fetch metrics and sites in parallel with authentication header
      const [metricsRes, sitesRes] = await Promise.all([
        fetch('/api/admin/metrics', { headers }),
        fetch(`/api/admin/sites?${queryParams.toString()}`, { headers })
      ]);

      if (metricsRes.status === 401 || sitesRes.status === 401) {
        handleLogout();
        showToast({ type: 'error', message: 'Session expired or invalid credentials. Please log in again.' });
        return;
      }

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
      console.warn('Could not fetch from backend API:', err);
      setApiError('Backend server is not reachable at /api. Please ensure the server is running on port 3001.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authToken, selectedTemplate, sortBy, handleLogout, showToast]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Handle Login verification
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setLoginError('Please enter the admin password');
      return;
    }

    setIsVerifying(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Invalid admin credentials');
        return;
      }

      sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
      setAuthToken(data.token);
      setIsAuthenticated(true);
      setPasswordInput('');
      setLoginError('');
      showToast({ type: 'success', message: 'Admin verified & dashboard unlocked!' });
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Connection failed. Make sure the API server is running.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Delete site
  const handleDeleteSite = async (id) => {
    const token = authToken || sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    // Optimistic instant state update for snappy UI feedback
    setSites((prev) => prev.filter((s) => s.id !== id && s.slug !== id));
    setMetrics((prev) => ({
      ...prev,
      totalSites: Math.max(0, (prev.totalSites || 1) - 1)
    }));

    try {
      const res = await fetch(`/api/admin/sites/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': token,
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        handleLogout();
        showToast({ type: 'error', message: 'Unauthorized. Please log in again.' });
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to delete on server');
      }

      showToast({ type: 'success', message: 'Keepsake deleted permanently' });
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
    const token = authToken || sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    try {
      showToast({ type: 'info', message: 'Preparing export...' });
      const res = await fetch('/api/admin/export', {
        headers: {
          'x-admin-key': token,
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        handleLogout();
        showToast({ type: 'error', message: 'Unauthorized. Please log in again.' });
        return;
      }

      if (!res.ok) throw new Error('Export request failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dearly-sites-export-${new Date().toISOString().slice(0, 10)}.json`;
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
      downloadAnchor.setAttribute('download', 'dearly-sites-backup.json');
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
      showToast({ type: 'success', message: 'Dashboard updated' });
    });
  };

  // Helper for template display label
  const getTemplateDisplayName = (key) => {
    if (!key || key === 'none') return 'None yet';
    const map = {
      'royal-sapphire': 'Royal Sapphire 👑',
      'blush-rose': 'Blush Rose 🌸',
      'blush-romance': 'Blush Romance 🌸',
      'golden-birthday': 'Golden Birthday 🎂',
      'polaroid-scrapbook': 'Polaroid Scrapbook 📸',
      'heartfelt-apology': 'Heartfelt Hug 🥺',
      'lavender-dream': 'Lavender Dream 💜',
      'princess-peach': 'Princess Peach ✨',
      'midnight-onyx': 'Midnight Onyx 🖤',
      'emerald-luxe': 'Emerald Luxe 🌿',
      'cinderella-sky': 'Cinderella Sky 🩵',
      'velvet-romance': 'Velvet Romance ❤️'
    };
    return map[key] || key;
  };

  // Counts of opened vs unopened keepsakes
  const openedCount = sites.filter((s) => (Number(s.viewCount) || 0) > 0).length;
  const unopenedCount = sites.filter((s) => (Number(s.viewCount) || 0) === 0).length;

  // Filter sites based on active statusFilter and searchQuery
  const filteredSites = sites.filter((site) => {
    const viewCount = Number(site.viewCount) || 0;

    // Status filter ('all' | 'opened' | 'unopened')
    if (statusFilter === 'opened' && viewCount === 0) {
      return false;
    }
    if (statusFilter === 'unopened' && viewCount > 0) {
      return false;
    }

    // Search filter (matches recipientName, senderName, title, slug, occasion)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const recipientName = (site.recipientName || '').toLowerCase();
      const senderName = (site.senderName || '').toLowerCase();
      const title = (site.title || '').toLowerCase();
      const slug = (site.slug || '').toLowerCase();
      const occasion = (site.occasion || '').toLowerCase();

      const matches =
        recipientName.includes(q) ||
        senderName.includes(q) ||
        title.includes(q) ||
        slug.includes(q) ||
        occasion.includes(q);

      if (!matches) {
        return false;
      }
    }

    return true;
  });

  // ----------------------------------------------------
  // SECURE ADMIN LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200/80 shadow-xl p-8 transition-all">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Dearly Admin
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter admin secret password to access data & controls
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-stone-200 text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400 bg-stone-50/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 transition-all cursor-pointer shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Secured API</span>
            </span>
            {onNavigate && (
              <button
                onClick={() => onNavigate('home')}
                className="text-rose-500 hover:text-rose-600 hover:underline cursor-pointer font-medium"
              >
                Back to Dearly
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
                Run <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">npm run server</code> to start the backend.
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Admin Dashboard
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Secured
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitor active keepsakes, view metrics, and manage user creations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer shadow-xs"
              title="Export Sites JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('builder')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer shadow-sm shadow-rose-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Keepsake</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              title="Logout from Admin"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50/70 border border-rose-200/80 hover:bg-rose-100/70 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* STATS CARDS — 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {/* 1. Total Keepsakes */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Keepsakes
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {metrics.totalSites || sites.length || 0}
            </div>
            <p className="text-xs text-slate-500">
              {(metrics.totalSites || sites.length || 0) === 0 ? '0 Keepsakes' : `${metrics.totalSites || sites.length} Live in Database`}
            </p>
          </div>

          {/* 2. Opened by Recipient 🟢 */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <span>Opened by Recipient</span>
                <span>🟢</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {metrics.openedSites ?? openedCount}
            </div>
            <p className="text-xs text-slate-500">
              {(metrics.openedSites ?? openedCount) === 1 ? '1 site opened & viewed' : `${metrics.openedSites ?? openedCount} sites opened & viewed`}
            </p>
          </div>

          {/* 3. Not Opened Yet ⏳ */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                <span>Not Opened Yet</span>
                <span>⏳</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-1">
              {metrics.unopenedSites ?? unopenedCount}
            </div>
            <p className="text-xs text-slate-500">
              Waiting for recipient to open
            </p>
          </div>

          {/* 4. Total Views 👁️ */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span>Total Views</span>
                <span>👁️</span>
              </span>
              <Eye className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {metrics.totalViews || 0}
            </div>
            <p className="text-xs text-slate-500">
              {metrics.totalViews === 0 ? '0 Total Views' : `${metrics.totalViews} Lifetime Opens`}
            </p>
          </div>

        </div>

        {/* Clean Database Banner when totalSites === 0 */}
        {!loading && (metrics.totalSites || sites.length || 0) === 0 && (
          <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-rose-50/60 via-stone-50/50 to-amber-50/40 border border-rose-200/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-white border border-rose-100 text-rose-500 shadow-xs shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Clean Database Ready — Waiting for real user creations
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                  All mock and dummy data has been wiped. When real users build and publish surprise websites on Dearly, they will appear here live with analytics and controls.
                </p>
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('builder')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-200 transition-colors cursor-pointer shrink-0"
              >
                Create First Keepsake
              </button>
            )}
          </div>
        )}

        {/* Status Filter Tabs right above search bar */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-stone-50 border border-stone-200/80 shadow-xs'
            }`}
          >
            <span>All ({sites.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('opened')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'opened'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-stone-50 border border-stone-200/80 shadow-xs'
            }`}
          >
            <span>🟢 Opened ({openedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('unopened')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'unopened'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-stone-50 border border-stone-200/80 shadow-xs'
            }`}
          >
            <span>⏳ Not Opened ({unopenedCount})</span>
          </button>
        </div>

        {/* TOOLBAR: Search + Template filter + Sort options */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by recipient, sender, slug or occasion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm bg-white border border-stone-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400"
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
            className="px-4 py-2.5 rounded-xl text-sm bg-white border border-stone-200 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
          >
            <option value="all">All Templates</option>
            <option value="royal-sapphire">Royal Sapphire 👑</option>
            <option value="blush-rose">Blush Rose 🌸</option>
            <option value="blush-romance">Blush Romance 🌸</option>
            <option value="velvet-romance">Velvet Romance ❤️</option>
            <option value="cinderella-sky">Cinderella Sky 🩵</option>
            <option value="midnight-onyx">Midnight Onyx 🖤</option>
            <option value="emerald-luxe">Emerald Luxe 🌿</option>
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
            className="px-4 py-2.5 rounded-xl text-sm bg-white border border-stone-200 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
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
          sites={filteredSites}
          loading={loading}
          totalSites={metrics.totalSites}
          searchQuery={searchQuery}
          selectedTemplate={selectedTemplate}
          statusFilter={statusFilter}
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
