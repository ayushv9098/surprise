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
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'dearly-backend',
    env: process.env.VERCEL ? 'vercel-serverless' : 'local'
  });
});

// Sites API (Public)
app.get('/api/sites/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const site = db.getSiteBySlug(slug);
    if (!site) return res.status(404).json({ error: 'Surprise site not found', slug });
    res.json({ success: true, site });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site', details: error.message });
  }
});

/**
 * Public: Serve surprise page with personalized dynamic OpenGraph metadata for WhatsApp/social sharing
 */
app.get('/s/:slug', (req, res) => {
  const { slug } = req.params;
  const distHtmlPath = path.resolve(__dirname, '../dist/index.html');
  const indexHtmlPath = path.resolve(__dirname, '../index.html');
  const htmlFile = fs.existsSync(distHtmlPath) ? distHtmlPath : indexHtmlPath;

  try {
    let html = fs.readFileSync(htmlFile, 'utf-8');
    const site = db.getSiteBySlug(slug);

    if (site) {
      const recipient = site.recipientName || 'Someone special';
      const sender = site.senderName ? ` from ${site.senderName}` : '';
      const pageTitle = `${site.title || `Special Surprise for ${recipient}`} — Dearly`;
      const ogTitle = `${site.title || `Special Surprise for ${recipient} 🎁`} — Dearly`;
      const ogDesc = `A heartfelt digital keepsake surprise website created for ${recipient}${sender}. Tap to unwrap envelope! 💌`;

      html = html
        .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
        .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${ogTitle}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${ogDesc}" />`)
        .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${ogTitle}" />`)
        .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${ogDesc}" />`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    if (fs.existsSync(htmlFile)) {
      return res.sendFile(htmlFile);
    }
    return res.status(404).send('Not Found');
  }
});

app.post('/api/sites', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') return res.status(400).json({ error: 'Invalid payload' });
    if (!payload.recipientName && !payload.title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newSite = db.createSite(payload);
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
app.get('/api/admin/metrics', (req, res) => {
  try {
    const metrics = db.getMetrics();
    res.json({ success: true, metrics, ...metrics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics', details: error.message });
  }
});

app.get('/api/admin/sites', (req, res) => {
  try {
    const { search, template, sortBy, page, limit } = req.query;
    const allSites = db.getAllSites({ search, template, sortBy });
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

app.delete('/api/admin/sites/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteSite(id);
    if (!deleted) return res.status(404).json({ error: 'Site not found' });
    res.json({ success: true, message: 'Site deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete site', details: error.message });
  }
});

app.get('/api/admin/export', (req, res) => {
  try {
    const sites = db.getAllSites();
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
