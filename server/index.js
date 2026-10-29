import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:url';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
export const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dearly-admin-2026';

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'dearly-backend',
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

/**
 * Public: Get site by slug (registers real view count when browser client loads)
 */
app.get('/api/sites/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const site = await db.getSiteBySlug(slug, { increment: true });

    if (!site) {
      return res.status(404).json({
        error: 'Surprise site not found',
        slug
      });
    }

    res.json({
      success: true,
      site
    });
  } catch (error) {
    console.error('Error fetching site by slug:', error);
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

/**
 * Public/Builder: Create and persist a new surprise website
 */
app.post('/api/sites', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    if (!payload.recipientName && !payload.title) {
      return res.status(400).json({
        error: 'Missing required fields: recipientName or title is required'
      });
    }

    const newSite = await db.createSite(payload);
    res.status(201).json({
      success: true,
      message: 'Surprise website created successfully',
      site: newSite,
      ...newSite
    });
  } catch (error) {
    console.error('Error creating site:', error);
    res.status(500).json({ error: 'Failed to create site', details: error.message });
  }
});

/**
 * Admin: Login endpoint to verify admin secret and return token
 */
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

// Protect all following admin endpoints with admin authentication middleware
app.use('/api/admin', requireAdminAuth);

/**
 * Admin: Get dashboard metrics & summary
 */
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const metrics = await db.getMetrics();
    res.json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics', details: error.message });
  }
});

/**
 * Admin: List sites with optional search, template filter, sorting, and pagination
 */
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
      sites,
      total,
      ...(limit !== undefined ? { page: pageNum, limit: limitNum, totalPages } : {})
    });
  } catch (error) {
    console.error('Error listing sites:', error);
    res.status(500).json({ error: 'Failed to fetch sites list', details: error.message });
  }
});

/**
 * Admin: Delete a site by id or slug
 */
app.delete('/api/admin/sites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteSite(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Site with id or slug "${id}" not found`
      });
    }

    res.json({
      success: true,
      message: `Site "${id}" was deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting site:', error);
    res.status(500).json({ error: 'Failed to delete site', details: error.message });
  }
});

/**
 * Admin: Export all sites as JSON file download
 */
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
    console.error('Error exporting sites:', error);
    res.status(500).json({ error: 'Failed to export sites', details: error.message });
  }
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`✨ Dearly API Server running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Admin Metrics: http://localhost:${PORT}/api/admin/metrics (Secured)`);
  console.log(`   Admin Sites:   http://localhost:${PORT}/api/admin/sites (Secured)`);
});

export { app, server };
export default app;
