import express from 'express';
import cors from 'cors';
import { db, SEED_SITES } from '../server/db.js';

export { SEED_SITES };

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'wishcraft-backend',
    env: process.env.VERCEL ? 'vercel-serverless' : 'local'
  });
});

// Sites API
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

// Admin API
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
    const { search, template, sortBy } = req.query;
    const sites = db.getAllSites({ search, template, sortBy });
    res.json({ success: true, count: sites.length, total: sites.length, sites });
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
      generator: 'WishCraft Admin Control Panel',
      totalRecords: sites.length,
      sites
    };

    const fileName = `wishcraft-sites-export-${new Date().toISOString().slice(0, 10)}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    res.status(500).json({ error: 'Failed to export sites', details: error.message });
  }
});

export default app;
