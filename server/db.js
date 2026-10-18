import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const SITES_FILE = path.join(DATA_DIR, 'sites.json');

// Initial seed sites for lively first run
const SEED_SITES = [
  {
    id: 'seed-blush-01',
    slug: 'for-elena',
    title: 'To My Dearest Elena 🌸',
    recipientName: 'Elena Rostova',
    senderName: 'Daniel',
    template: 'blush-romance',
    templateId: 'blush-romance',
    occasion: '2nd Anniversary',
    theme: 'rose',
    accentColor: '#F43F5E',
    letter: 'Elena, from the rainy afternoon we spent sharing an umbrella in Florence, I knew life with you was going to be extraordinary. Thank you for filling every single day with quiet laughter, warm matcha lattes, and gentle reassurance. Happy 2nd Anniversary, my sweetest heart.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
        caption: 'Florence under the rain 🌧️'
      },
      {
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
        caption: 'Our Sunday botanical garden walk 🌿'
      },
      {
        url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
        caption: 'Forever starts here 💍'
      }
    ],
    quiz: [
      {
        question: 'Where did we have our very first date?',
        options: ['Caffè Paszkowski', 'Piazza Michelangelo', 'Trattoria Mario'],
        correctAnswer: 'Caffè Paszkowski'
      },
      {
        question: 'Who fell asleep first during our first movie marathon?',
        options: ['Daniel', 'Elena (100%)', 'Neither, we finished both films!'],
        correctAnswer: 'Elena (100%)'
      }
    ],
    scratchSecret: 'Pack your bags for Venice this weekend! ✈️💌',
    musicTrack: 'romantic-acoustic',
    viewCount: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    lastViewedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: 'seed-gold-02',
    slug: 'happy-25th-lucas',
    title: 'Happy 25th Birthday, Lucas! 🎂',
    recipientName: 'Lucas Vance',
    senderName: 'Chloe & The Crew',
    template: 'golden-birthday',
    templateId: 'golden-birthday',
    occasion: '25th Birthday Milestone',
    theme: 'amber',
    accentColor: '#D97706',
    letter: 'Lucas! Quarter of a century looks dangerously sharp on you. From late-night gaming marathons to spontaneous mountain drives, you have been the absolute soul of our crew. May this year bring wild adventures and massive wins!',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
        caption: 'Golden champagne birthday moments 🥂'
      },
      {
        url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
        caption: 'Camping under Tahoe stars ✨'
      }
    ],
    quiz: [
      {
        question: 'What is Lucas’s signature catchphrase?',
        options: ['"Trust the process"', '"Let’s get tacos"', '"Just one more game"'],
        correctAnswer: '"Just one more game"'
      }
    ],
    scratchSecret: 'Check under your car driver seat for the festival VIP passes! 🎸🎫',
    musicTrack: 'upbeat-birthday',
    viewCount: 118,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    lastViewedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'seed-polaroid-03',
    slug: 'summer-with-maya',
    title: 'Our Golden Summer Memories 📸',
    recipientName: 'Maya Lin',
    senderName: 'Sophia',
    template: 'polaroid-scrapbook',
    templateId: 'polaroid-scrapbook',
    occasion: 'Friendship Scrapbook',
    theme: 'yellow',
    accentColor: '#CA8A04',
    letter: 'Maya, flipping through our camera roll from this past summer made me smile until my cheeks hurt. Thank you for being the most spontaneous, creative, and sunshine-filled best friend in the universe. Here is to 100 more road trips!',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
        caption: 'Polaroid film roll #04 — Highway 1 🌊'
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        caption: 'Sunset bonfire with s’mores 🔥'
      }
    ],
    quiz: [
      {
        question: 'What ice cream flavor melted all over Maya’s shoes?',
        options: ['Pistachio Gelato', 'Salted Caramel Cone', 'Strawberry Sorbet'],
        correctAnswer: 'Pistachio Gelato'
      }
    ],
    scratchSecret: 'Trip to Big Sur cabins is already reserved for next month! 🌲⛺',
    musicTrack: 'lofi-nostalgia',
    viewCount: 65,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    lastViewedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'seed-apology-04',
    slug: 'heartfelt-hug-liam',
    title: 'A Little Peace Offering for Liam 🥺',
    recipientName: 'Liam Chen',
    senderName: 'Aria',
    template: 'heartfelt-apology',
    templateId: 'heartfelt-apology',
    occasion: 'Sweet Apology & Hug',
    theme: 'violet',
    accentColor: '#8B5CF6',
    letter: 'Liam, I am genuinely sorry for misunderstanding things the other night. You mean too much to me for silly pride to get in the way. I baked your favorite cinnamon rolls as a peace offering. Forgive me?',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
        caption: 'Our peace truce cinnamon roll date ☕'
      }
    ],
    quiz: [
      {
        question: 'Will you accept the warmest hug and cinnamon roll?',
        options: ['Yes, definitely! ❤️', 'Only if extra frosting!', 'Thinking about it... (Yes)'],
        correctAnswer: 'Yes, definitely! ❤️'
      }
    ],
    scratchSecret: 'Unlimited boba tea on me for the rest of the semester! 🧋🤍',
    musicTrack: 'soft-guitar',
    viewCount: 29,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    lastViewedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(SITES_FILE)) {
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
   * Fetch all sites with optional search, template filter, and sorting
   */
  getAllSites({ search, template, sortBy = 'newest' } = {}) {
    let sites = readSites();

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
   * Get site by slug and increment its view count
   */
  getSiteBySlug(slug) {
    if (!slug) return null;
    const sites = readSites();
    const normalizedSlug = slug.toLowerCase().trim();
    const index = sites.findIndex(
      (s) => (s.slug || '').toLowerCase() === normalizedSlug
    );

    if (index === -1) {
      return null;
    }

    const site = sites[index];
    site.viewCount = (site.viewCount || 0) + 1;
    site.lastViewedAt = new Date().toISOString();

    sites[index] = site;
    writeSites(sites);

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

    const templateBreakdown = {
      'blush-romance': 0,
      'golden-birthday': 0,
      'polaroid-scrapbook': 0,
      'heartfelt-apology': 0
    };

    sites.forEach((site) => {
      const t = site.template || site.templateId;
      if (t) {
        templateBreakdown[t] = (templateBreakdown[t] || 0) + 1;
      }
    });

    // Determine most popular template
    let mostPopularTemplate = 'blush-romance';
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
      templateBreakdown,
      mostPopularTemplate,
      activeToday,
      recentSites
    };
  }
};

export default db;
