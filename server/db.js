import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'dearly-data')
  : path.resolve(__dirname, '../data');
const SITES_FILE = path.join(DATA_DIR, 'sites.json');

// Clean seed sites - no fake/mock entries, production real data only
export const SEED_SITES = [];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SITES_FILE)) {
    // If running on Vercel and new SITES_FILE does not exist, check if legacy wishcraft data exists
    if (process.env.VERCEL) {
      const legacyWishcraftPath = path.join('/tmp', 'wishcraft-data', 'sites.json');
      if (fs.existsSync(legacyWishcraftPath)) {
        try {
          fs.copyFileSync(legacyWishcraftPath, SITES_FILE);
          return;
        } catch {
          // fallback to bundled sites.json
        }
      }
    }

    // If original file exists, copy it
    const sourcePath = path.resolve(__dirname, '../data/sites.json');
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, SITES_FILE);
        return;
      } catch {
        // fallback to SEED_SITES
      }
    }
    fs.writeFileSync(SITES_FILE, JSON.stringify(SEED_SITES, null, 2), 'utf-8');
  }
}

function readSites() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(SITES_FILE, 'utf-8');
    const sites = JSON.parse(raw);
    return Array.isArray(sites) ? sites : [];
  } catch (error) {
    console.error('Error reading sites file, falling back to seed data:', error);
    return [...SEED_SITES];
  }
}

function writeSites(sites) {
  ensureDataFile();
  fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2), 'utf-8');
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const db = {
  /**
   * Fetch all sites with optional search, template filter, sorting, and status filter
   */
  getAllSites({ search, template, sortBy = 'newest', status } = {}) {
    let sites = readSites();

    // Status filter
    if (status === 'opened') {
      sites = sites.filter((site) => (Number(site.viewCount) || 0) > 0);
    } else if (status === 'unopened') {
      sites = sites.filter((site) => (Number(site.viewCount) || 0) === 0);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      sites = sites.filter((site) => {
        const title = (site.title || '').toLowerCase();
        const recipient = (site.recipientName || '').toLowerCase();
        const sender = (site.senderName || '').toLowerCase();
        const slug = (site.slug || '').toLowerCase();
        const occasion = (site.occasion || '').toLowerCase();
        return (
          title.includes(q) ||
          recipient.includes(q) ||
          sender.includes(q) ||
          slug.includes(q) ||
          occasion.includes(q)
        );
      });
    }

    if (template && template !== 'all') {
      const t = template.toLowerCase();
      sites = sites.filter((site) => {
        const sTemplate = (site.template || site.templateId || '').toLowerCase();
        return sTemplate === t;
      });
    }

    // Sort order
    sites.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'views-desc') {
        return (b.viewCount || 0) - (a.viewCount || 0);
      }
      if (sortBy === 'views-asc') {
        return (a.viewCount || 0) - (b.viewCount || 0);
      }
      if (sortBy === 'recipient') {
        return (a.recipientName || '').localeCompare(b.recipientName || '');
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sites;
  },

  /**
   * Get site by slug with optional view count increment
   * @param {string} slug - The slug or id of the site
   * @param {Object} [options] - Options object
   * @param {boolean} [options.increment=true] - If true, increment viewCount and update lastViewedAt
   */
  getSiteBySlug(slug, { increment = true } = {}) {
    if (!slug) return null;
    const sites = readSites();
    const normalizedSlug = slug.toLowerCase().trim();
    const index = sites.findIndex(
      (s) =>
        (s.slug || '').toLowerCase() === normalizedSlug ||
        (s.id || '').toLowerCase() === normalizedSlug
    );

    if (index === -1) {
      return null;
    }

    const site = sites[index];
    if (increment) {
      site.viewCount = (site.viewCount || 0) + 1;
      site.lastViewedAt = new Date().toISOString();
      sites[index] = site;
      writeSites(sites);
    }

    return site;
  },

  /**
   * Create and persist a new surprise website
   */
  createSite(siteData) {
    const sites = readSites();

    const id = siteData.id || `site_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Generate clean unique slug
    let baseSlug = slugify(siteData.slug || siteData.recipientName || siteData.title || 'surprise');
    if (!baseSlug) baseSlug = 'surprise';
    
    let candidateSlug = baseSlug;
    let counter = 1;
    while (sites.some((s) => (s.slug || '').toLowerCase() === candidateSlug.toLowerCase())) {
      candidateSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      counter++;
      if (counter > 10) break;
    }

    const template = siteData.template || siteData.templateId || 'blush-romance';

    const newSite = {
      ...siteData,
      id,
      slug: candidateSlug,
      template,
      templateId: template,
      viewCount: 0,
      createdAt: siteData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    sites.unshift(newSite);
    writeSites(sites);

    return newSite;
  },

  /**
   * Delete a site by id or slug
   */
  deleteSite(id) {
    const sites = readSites();
    const initialLength = sites.length;
    const filtered = sites.filter((s) => s.id !== id && s.slug !== id);

    if (filtered.length === initialLength) {
      return false;
    }

    writeSites(filtered);
    return true;
  },

  /**
   * Get analytics & metrics summary
   */
  getMetrics() {
    const sites = readSites();

    const totalSites = sites.length;
    const totalViews = sites.reduce((sum, s) => sum + (Number(s.viewCount) || 0), 0);
    const openedSites = sites.filter((s) => (Number(s.viewCount) || 0) > 0).length;
    const unopenedSites = sites.filter((s) => (Number(s.viewCount) || 0) === 0).length;

    const templateBreakdown = {};

    sites.forEach((site) => {
      const t = site.template || site.templateId;
      if (t) {
        templateBreakdown[t] = (templateBreakdown[t] || 0) + 1;
      }
    });

    // Determine most popular template dynamically from real data
    let mostPopularTemplate = 'none';
    let maxCount = -1;
    for (const [tpl, count] of Object.entries(templateBreakdown)) {
      if (count > maxCount) {
        maxCount = count;
        mostPopularTemplate = tpl;
      }
    }

    // Recent sites (last 5 sorted by newest)
    const sorted = [...sites].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const recentSites = sorted.slice(0, 5);

    // Active today: created or viewed in the last 24h
    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const activeToday = sites.filter((s) => {
      const createdTime = new Date(s.createdAt).getTime();
      const viewedTime = s.lastViewedAt ? new Date(s.lastViewedAt).getTime() : 0;
      return (now - createdTime < ONE_DAY_MS) || (now - viewedTime < ONE_DAY_MS);
    }).length;

    return {
      totalSites,
      totalViews,
      openedSites,
      unopenedSites,
      templateBreakdown,
      mostPopularTemplate,
      activeToday,
      recentSites
    };
  }
};

export default db;
