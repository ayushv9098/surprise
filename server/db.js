import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'dearly-data')
  : path.resolve(__dirname, '../data');
const SITES_FILE = path.join(DATA_DIR, 'sites.json');

// Upstash Redis REST Credentials
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://measured-gull-97539.upstash.io';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAX0DAAIgcDJhZWUyZjA0MzQ0ZDE0OTZiOGMyMzUzNjZkZWQ1ZmQyNw';

// Seed keepsake for Ashuu Bhai to guarantee instant availability across cold starts & cloud deploys
export const ASHUU_BHAI_SITE = {
  id: 'wc-ashuu-bhai-gihdt',
  slug: 'ashuu-bhai-gihdt',
  title: 'Special Birthday Surprise for Ashuu Bhai 🎂👑',
  recipientName: 'Ashuu Bhai',
  senderName: 'Your Loved Ones',
  occasion: 'Happy Birthday',
  subtitle: 'Wishing the coolest brother & friend a legendary birthday celebration!',
  category: 'birthday',
  gender: 'boy',
  template: 'golden-birthday',
  templateId: 'golden-birthday',
  heroPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  photoCaption: 'Cheers to Another Year of Greatness! 🌟🥂',
  photos: [
    {
      id: 'ashuu-p1',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      caption: 'Cheers to Another Year of Greatness! 🌟🥂',
      tag: 'Birthday King'
    },
    {
      id: 'ashuu-p2',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      caption: 'Golden moments, laughter, and brotherhood forever! ⚡🎉',
      tag: 'Golden Star'
    }
  ],
  specialReasons: [
    {
      icon: '👑',
      title: 'Golden Heart 👑',
      desc: 'Always standing strong for everyone with unconditional support, warmth, and brotherhood.'
    },
    {
      icon: '⚡',
      title: 'Unmatched Energy ⚡',
      desc: 'Bringing unmatched vibes, smiles, and uplifting joy wherever you go!'
    },
    {
      icon: '🌟',
      title: 'True Inspiration 🌟',
      desc: 'A brother who inspires everyone around him to dream bigger, laugh louder, and shine brighter.'
    }
  ],
  letter: {
    title: 'A Special Birthday Letter For You',
    content: 'Dearest Ashuu Bhai, 👑🎂\n\nWishing you the happiest and most blessed Birthday! You are not just a brother but a true pillar of strength, laughter, and support.\n\nMay this year bring you unstoppable success, good health, boundless happiness, and every dream fulfilled. Keep smiling, keep inspiring, and shine brighter than gold!\n\nHave a grand and unforgettable celebration, Bhai! 🥂🌟',
    signOff: 'With respect & love always, Your Loved Ones 👑✨',
    sealEmoji: '👑',
    waxColor: '#D97706'
  },
  songId: 'baar-baar-din-ye-aaye',
  viewCount: 0,
  createdAt: '2026-10-29T12:00:00.000Z',
  updatedAt: '2026-10-29T12:00:00.000Z'
};

export const SEED_SITES = [ASHUU_BHAI_SITE];

/**
 * Execute command against Upstash Redis REST API
 */
async function upstashCommand(command, ...args) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([command, ...args])
    });

    if (!res.ok) {
      console.error(`[Upstash Redis] Command ${command} failed: HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error(`[Upstash Redis] Command ${command} error:`, err.message);
    return null;
  }
}

/**
 * Safe parser for Redis JSON data
 */
function parseSiteJson(val) {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return null;
  }
}

/**
 * Ensure local file directory and file exists for offline fallback
 */
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

    // If original source file exists, copy it
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

/**
 * Read local fallback sites from disk
 */
function readSites() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(SITES_FILE, 'utf-8');
    const sites = JSON.parse(raw);
    return Array.isArray(sites) ? sites : [...SEED_SITES];
  } catch (error) {
    console.error('Error reading local sites file, using seed data:', error.message);
    return [...SEED_SITES];
  }
}

/**
 * Write to local fallback sites on disk
 */
function writeSites(sites) {
  try {
    ensureDataFile();
    fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local sites:', err.message);
  }
}

/**
 * Slugify text
 */
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
   * Fetch a single site by slug or ID from Upstash Redis, with fallback to local JSON
   */
  async getSite(slug) {
    if (!slug) return null;
    const cleanSlug = String(slug).toLowerCase().trim();

    // 1. Try Upstash Redis by slug
    try {
      const raw = await upstashCommand('GET', `site:${cleanSlug}`);
      const parsed = parseSiteJson(raw);
      if (parsed) return parsed;
    } catch (err) {
      console.error(`Upstash getSite error for ${cleanSlug}:`, err.message);
    }

    // 2. Fallback to local sites.json
    const localSites = readSites();
    const found = localSites.find(
      (s) =>
        (s.slug || '').toLowerCase().trim() === cleanSlug ||
        (s.id || '').toLowerCase().trim() === cleanSlug
    );

    // If found in local file but not in Upstash, backfill to Upstash
    if (found) {
      this.saveSite(found).catch(() => {});
      return found;
    }

    // 3. Fallback to Ashuu Bhai seed if requested
    if (cleanSlug === 'ashuu-bhai-gihdt' || cleanSlug === 'wc-ashuu-bhai-gihdt') {
      this.saveSite(ASHUU_BHAI_SITE).catch(() => {});
      return ASHUU_BHAI_SITE;
    }

    return null;
  },

  /**
   * Persist a site into Upstash Redis AND index it in sites:all, with local write-through
   */
  async saveSite(site) {
    if (!site) return null;
    const cleanSlug = String(site.slug || site.id || '').toLowerCase().trim();
    if (!cleanSlug) return null;

    const siteWithMeta = {
      ...site,
      slug: site.slug || cleanSlug,
      updatedAt: site.updatedAt || new Date().toISOString()
    };

    const jsonStr = JSON.stringify(siteWithMeta);

    // 1. Save to Upstash Redis
    try {
      await upstashCommand('SET', `site:${cleanSlug}`, jsonStr);
      if (siteWithMeta.id) {
        const cleanId = String(siteWithMeta.id).toLowerCase().trim();
        if (cleanId && cleanId !== cleanSlug) {
          await upstashCommand('SET', `site:${cleanId}`, jsonStr);
        }
      }
      await upstashCommand('SADD', 'sites:all', cleanSlug);
    } catch (err) {
      console.error(`Upstash saveSite error for ${cleanSlug}:`, err.message);
    }

    // 2. Also keep local data file in sync (offline fallback)
    try {
      const sites = readSites();
      const idx = sites.findIndex(
        (s) =>
          (s.slug || '').toLowerCase().trim() === cleanSlug ||
          (siteWithMeta.id && (s.id || '').toLowerCase().trim() === String(siteWithMeta.id).toLowerCase().trim())
      );
      if (idx >= 0) {
        sites[idx] = siteWithMeta;
      } else {
        sites.unshift(siteWithMeta);
      }
      writeSites(sites);
    } catch (err) {
      console.error('Failed to write local sites.json:', err.message);
    }

    return siteWithMeta;
  },

  /**
   * Increment viewCount and update lastViewedAt in Upstash Redis
   */
  async incrementViews(slug) {
    if (!slug) return null;
    const site = await this.getSite(slug);
    if (!site) return null;

    site.viewCount = (Number(site.viewCount) || 0) + 1;
    site.lastViewedAt = new Date().toISOString();

    await this.saveSite(site);
    return site;
  },

  /**
   * Get site by slug with optional view count increment
   * @param {string} slug - The slug or id of the site
   * @param {Object} [options] - Options object
   * @param {boolean} [options.increment=true] - If true, increment viewCount and update lastViewedAt
   */
  async getSiteBySlug(slug, { increment = true } = {}) {
    if (!slug) return null;
    if (increment) {
      return await this.incrementViews(slug);
    } else {
      return await this.getSite(slug);
    }
  },

  /**
   * Fetch all sites from Upstash Redis index sites:all, with local fallback
   */
  async getAllSites({ search, template, sortBy = 'newest', status } = {}) {
    let sites = [];

    // 1. Fetch from Upstash Redis index
    try {
      const slugs = await upstashCommand('SMEMBERS', 'sites:all');
      if (Array.isArray(slugs) && slugs.length > 0) {
        const keys = slugs.map((s) => `site:${String(s).toLowerCase().trim()}`);
        
        // Batch MGET
        const rawResults = [];
        for (let i = 0; i < keys.length; i += 50) {
          const chunk = keys.slice(i, i + 50);
          const chunkRes = await upstashCommand('MGET', ...chunk);
          if (Array.isArray(chunkRes)) {
            rawResults.push(...chunkRes);
          }
        }

        sites = rawResults.map(parseSiteJson).filter(Boolean);
      }
    } catch (err) {
      console.error('Error fetching sites from Upstash Redis:', err.message);
    }

    // 2. Fallback / Merge with local file
    const localSites = readSites();
    if (sites.length === 0) {
      sites = [...localSites];
    } else {
      const existingSlugs = new Set(sites.map((s) => (s.slug || '').toLowerCase().trim()));
      for (const ls of localSites) {
        const lsSlug = (ls.slug || '').toLowerCase().trim();
        if (lsSlug && !existingSlugs.has(lsSlug)) {
          sites.push(ls);
          // Sync missing local sites to Redis
          this.saveSite(ls).catch(() => {});
        }
      }
    }

    // Ensure Ashuu Bhai is always present
    const hasAshuu = sites.some((s) => (s.slug || '').toLowerCase() === 'ashuu-bhai-gihdt');
    if (!hasAshuu) {
      sites.unshift(ASHUU_BHAI_SITE);
      this.saveSite(ASHUU_BHAI_SITE).catch(() => {});
    }

    // Status filter
    if (status === 'opened') {
      sites = sites.filter((site) => (Number(site.viewCount) || 0) > 0);
    } else if (status === 'unopened') {
      sites = sites.filter((site) => (Number(site.viewCount) || 0) === 0);
    }

    // Search filter
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      sites = sites.filter((site) => {
        const title = (site.title || '').toLowerCase();
        const recipient = (site.recipientName || '').toLowerCase();
        const sender = (site.senderName || '').toLowerCase();
        const slugStr = (site.slug || '').toLowerCase();
        const occasion = (site.occasion || '').toLowerCase();
        return (
          title.includes(q) ||
          recipient.includes(q) ||
          sender.includes(q) ||
          slugStr.includes(q) ||
          occasion.includes(q)
        );
      });
    }

    // Template filter
    if (template && template !== 'all') {
      const t = template.toLowerCase();
      sites = sites.filter((site) => {
        const sTemplate = (site.template || site.templateId || '').toLowerCase();
        return sTemplate === t;
      });
    }

    // Sorting
    sites.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sortBy === 'views-desc') {
        return (Number(b.viewCount) || 0) - (Number(a.viewCount) || 0);
      }
      if (sortBy === 'views-asc') {
        return (Number(a.viewCount) || 0) - (Number(b.viewCount) || 0);
      }
      if (sortBy === 'recipient') {
        return (a.recipientName || '').localeCompare(b.recipientName || '');
      }
      // default: newest
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return sites;
  },

  /**
   * Create and persist a new surprise website
   */
  async createSite(siteData) {
    const allSites = await this.getAllSites();

    const id = siteData.id || `site_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Generate clean unique slug
    let baseSlug = slugify(siteData.slug || siteData.recipientName || siteData.title || 'surprise');
    if (!baseSlug) baseSlug = 'surprise';
    
    let candidateSlug = baseSlug;
    let counter = 1;
    while (allSites.some((s) => (s.slug || '').toLowerCase() === candidateSlug.toLowerCase())) {
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

    await this.saveSite(newSite);
    return newSite;
  },

  /**
   * Delete a site by id or slug from Upstash Redis and local storage
   */
  async deleteSite(id) {
    if (!id) return false;
    const cleanId = String(id).toLowerCase().trim();
    let found = false;

    // Upstash Redis deletion
    try {
      const existing = await this.getSite(cleanId);
      if (existing) {
        found = true;
        const slug = (existing.slug || '').toLowerCase().trim();
        const siteId = (existing.id || '').toLowerCase().trim();
        if (slug) {
          await upstashCommand('DEL', `site:${slug}`);
          await upstashCommand('SREM', 'sites:all', slug);
        }
        if (siteId && siteId !== slug) {
          await upstashCommand('DEL', `site:${siteId}`);
        }
      }
    } catch (err) {
      console.error('Error deleting site from Upstash:', err.message);
    }

    // Local file deletion
    try {
      const sites = readSites();
      const initialLength = sites.length;
      const filtered = sites.filter(
        (s) =>
          (s.id || '').toLowerCase().trim() !== cleanId &&
          (s.slug || '').toLowerCase().trim() !== cleanId
      );
      if (filtered.length !== initialLength) {
        found = true;
        writeSites(filtered);
      }
    } catch (err) {
      console.error('Error deleting site from local file:', err.message);
    }

    return found;
  },

  /**
   * Get analytics & metrics summary
   */
  async getMetrics() {
    const sites = await this.getAllSites();

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

    let mostPopularTemplate = 'none';
    let maxCount = -1;
    for (const [tpl, count] of Object.entries(templateBreakdown)) {
      if (count > maxCount) {
        maxCount = count;
        mostPopularTemplate = tpl;
      }
    }

    const sorted = [...sites].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    const recentSites = sorted.slice(0, 5);

    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const activeToday = sites.filter((s) => {
      const createdTime = new Date(s.createdAt || 0).getTime();
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
