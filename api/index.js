import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, SEED_SITES } from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dearly-admin-2026';
export { SEED_SITES };

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Admin authentication middleware
function requireAdminAuth(req, res, next) {
  const adminKey = req.headers['x-admin-key'];
  const authHeader = req.headers.authorization;

  let bearerToken = null;
  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      bearerToken = authHeader.slice(7).trim();
    } else {
      bearerToken = authHeader.trim();
    }
  }

  const token = adminKey || bearerToken;

  if (!token || token !== ADMIN_SECRET) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid admin credentials'
    });
  }

  next();
}

// Health check
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'dearly-backend',
    env: process.env.VERCEL ? 'vercel-serverless' : 'local',
    redis: 'upstash-active'
  });
});

// List of known social crawlers, bots, and metadata scrapers
const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'WhatsApp',
  'Twitterbot',
  'TelegramBot',
  'Slackbot',
  'Discordbot',
  'Googlebot',
  'bingbot',
  'Applebot',
  'LinkedInBot',
  'Pinterest'
];

// Sites API (Public) - registers real view count when browser client loads
app.get('/api/sites/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const site = await db.getSiteBySlug(slug, { increment: true });
    if (!site) return res.status(404).json({ error: 'Surprise site not found', slug });
    res.json({ success: true, site });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site', details: error.message });
  }
});

/**
 * Public: Serve surprise page with personalized dynamic OpenGraph metadata for WhatsApp/social sharing
 * NOTE: Bot crawls and initial SSR HTML requests use increment: false so link unfurls don't inflate view count!
 * Real view is registered when browser executes and hits /api/sites/:slug.
 */
app.get('/s/:slug', async (req, res) => {
  const { slug } = req.params;
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_USER_AGENTS.some((bot) => userAgent.toLowerCase().includes(bot.toLowerCase()));

  if (isBot) {
    console.log(`[Crawler/Bot Detected] ${userAgent.slice(0, 60)} accessing /s/${slug}`);
  }

  const distHtmlPath = path.resolve(__dirname, '../dist/index.html');
  const indexHtmlPath = path.resolve(__dirname, '../index.html');
  const htmlFile = fs.existsSync(distHtmlPath) ? distHtmlPath : indexHtmlPath;

  try {
    let html = fs.existsSync(htmlFile) ? fs.readFileSync(htmlFile, 'utf-8') : '';
    // Increment: false ensures bot scrapers & initial HTML requests do NOT artificially mark as opened/viewed
    const site = await db.getSiteBySlug(slug, { increment: false });

    if (site && html) {
      const pageTitle = `${site.title || `Special Surprise for ${site.recipientName}`} — Dearly`;
      const ogTitle = `${site.title || `Special Surprise for ${site.recipientName} 🎁`} — Dearly`;
      const ogDesc = `A personalized keepsake surprise website created for ${site.recipientName || 'someone special'}. Tap to open envelope! 💌`;

      html = html
        .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
        .replace(/<meta property="og:title" content=".*?"/, `<meta property="og:title" content="${ogTitle}"`)
        .replace(/<meta property="og:description" content=".*?"/, `<meta property="og:description" content="${ogDesc}"`)
        .replace(/<meta (?:property|name)="twitter:title" content=".*?"/, `<meta name="twitter:title" content="${ogTitle}"`)
        .replace(/<meta (?:property|name)="twitter:description" content=".*?"/, `<meta name="twitter:description" content="${ogDesc}"`);
    }

    if (html) {
      return res.type('html').send(html);
    }
    return res.status(404).send('Not Found');
  } catch (err) {
    console.error('Error serving /s/:slug dynamic preview:', err);
    if (fs.existsSync(htmlFile)) {
      try {
        const rawHtml = fs.readFileSync(htmlFile, 'utf-8');
        return res.type('html').send(rawHtml);
      } catch {
        return res.status(500).send('Internal server error');
      }
    }
    return res.status(500).send('Internal server error');
  }
});

app.post('/api/sites', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') return res.status(400).json({ error: 'Invalid payload' });
    if (!payload.recipientName && !payload.title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newSite = await db.createSite(payload);
    res.status(201).json({
      success: true,
      message: 'Surprise website created successfully',
      site: newSite,
      slug: newSite.slug,
      ...newSite
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create site', details: error.message });
  }
});

// Admin Auth: Login endpoint (Public)
app.post('/api/admin/login', (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password || password !== ADMIN_SECRET) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid admin credentials'
      });
    }

    res.json({
      success: true,
      token: ADMIN_SECRET,
      message: 'Admin authenticated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Protect all following admin endpoints
app.use('/api/admin', requireAdminAuth);

// Admin API (Secured)
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const metrics = await db.getMetrics();
    res.json({ success: true, metrics, ...metrics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics', details: error.message });
  }
});

app.get('/api/admin/sites', async (req, res) => {
  try {
    const { search, template, sortBy, page, limit, status } = req.query;
    const allSites = await db.getAllSites({ search, template, sortBy, status });
    const total = allSites.length;

    let sites = allSites;
    let pageNum = null;
    let limitNum = null;
    let totalPages = null;

    if (limit !== undefined) {
      pageNum = Math.max(1, parseInt(page, 10) || 1);
      limitNum = Math.max(1, parseInt(limit, 10) || 20);
      totalPages = Math.ceil(total / limitNum) || 1;
      const startIndex = (pageNum - 1) * limitNum;
      sites = allSites.slice(startIndex, startIndex + limitNum);
    }

    res.json({
      success: true,
      count: sites.length,
      total,
      sites,
      ...(limit !== undefined ? { page: pageNum, limit: limitNum, totalPages } : {})
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sites', details: error.message });
  }
});

app.delete('/api/admin/sites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteSite(id);
    if (!deleted) return res.status(404).json({ error: 'Site not found' });
    res.json({ success: true, message: 'Site deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete site', details: error.message });
  }
});

app.get('/api/admin/export', async (req, res) => {
  try {
    const sites = await db.getAllSites();
    const exportData = {
      exportedAt: new Date().toISOString(),
      generator: 'Dearly Admin Control Panel',
      totalRecords: sites.length,
      sites
    };

    const fileName = `dearly-sites-export-${new Date().toISOString().slice(0, 10)}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    res.status(500).json({ error: 'Failed to export sites', details: error.message });
  }
});

export default app;
