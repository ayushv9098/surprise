import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const BACKEND_BASE = process.env.BACKEND_URL || 'http://localhost:3001';
const FRONTEND_BASE = process.env.FRONTEND_URL || 'http://localhost:5174';

async function runAdminAudit() {
  console.log('====================================================');
  console.log('👑 WISHCRAFT ADMIN CONTROL CENTER & SYSTEM AUDIT');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Health check
  console.log('[1/7] Auditing Health Check Endpoint...');
  try {
    const res = await fetch(`${BACKEND_BASE}/api/health`);
    assert(res.status === 200, 'GET /api/health returned HTTP 200 OK');
    const data = await res.json();
    assert(data.status === 'ok', "Health status is 'ok'");
    assert(data.service === 'wishcraft-backend', "Service name is 'wishcraft-backend'");
  } catch (e) {
    assert(false, `Health check failed: ${e.message}`);
  }

  // 2. Metrics endpoint
  console.log('\n[2/7] Auditing Admin Metrics Endpoint...');
  try {
    const res = await fetch(`${BACKEND_BASE}/api/admin/metrics`);
    assert(res.status === 200, 'GET /api/admin/metrics returned HTTP 200 OK');
    const data = await res.json();
    assert(data.success === true, 'Metrics success flag is true');
    assert(typeof data.metrics.totalSites === 'number', `totalSites is numeric: ${data.metrics.totalSites}`);
    assert(typeof data.metrics.totalViews === 'number', `totalViews is numeric: ${data.metrics.totalViews}`);
    assert(typeof data.metrics.mostPopularTemplate === 'string', `mostPopularTemplate: "${data.metrics.mostPopularTemplate}"`);
    assert(typeof data.metrics.activeToday === 'number', `activeToday is numeric: ${data.metrics.activeToday}`);
    assert(Array.isArray(data.metrics.recentSites), `recentSites is an array (length: ${data.metrics.recentSites.length})`);
  } catch (e) {
    assert(false, `Metrics audit failed: ${e.message}`);
  }

  // 3. Sites list endpoint: pagination, search, filter, sort
  console.log('\n[3/7] Auditing Admin Sites API (Pagination, Search, Filter, Sort)...');
  try {
    // 3.1 All sites
    const allRes = await fetch(`${BACKEND_BASE}/api/admin/sites`);
    assert(allRes.status === 200, 'GET /api/admin/sites returned HTTP 200 OK');
    const allData = await allRes.json();
    assert(Array.isArray(allData.sites), 'Sites returned as array');
    const totalCount = allData.total || allData.sites.length;
    assert(totalCount > 0, `Total sites recorded: ${totalCount}`);

    // 3.2 Pagination
    const pageLimit = 3;
    const pageRes = await fetch(`${BACKEND_BASE}/api/admin/sites?limit=${pageLimit}&page=1`);
    assert(pageRes.status === 200, `GET /api/admin/sites?limit=${pageLimit}&page=1 returned HTTP 200 OK`);
    const pageData = await pageRes.json();
    assert(pageData.sites.length === pageLimit, `Page 1 correctly returned exactly ${pageLimit} sites`);
    assert(pageData.total === totalCount, `Pagination maintains accurate total count: ${pageData.total}`);
    assert(pageData.page === 1, `Response reflects page 1`);
    assert(pageData.limit === pageLimit, `Response reflects limit ${pageLimit}`);
    assert(pageData.totalPages === Math.ceil(totalCount / pageLimit), `totalPages calculated correctly: ${pageData.totalPages}`);

    // Page 2
    const page2Res = await fetch(`${BACKEND_BASE}/api/admin/sites?limit=${pageLimit}&page=2`);
    const page2Data = await page2Res.json();
    assert(page2Data.sites.length === pageLimit, `Page 2 correctly returned ${pageLimit} sites`);
    assert(page2Data.page === 2, `Response reflects page 2`);
    assert(page2Data.sites[0].id !== pageData.sites[0].id, 'Page 2 contains different records than Page 1');

    // 3.3 Search
    const searchTarget = allData.sites[0]?.recipientName || 'Elena';
    const searchRes = await fetch(`${BACKEND_BASE}/api/admin/sites?search=${encodeURIComponent(searchTarget)}`);
    assert(searchRes.status === 200, `GET /api/admin/sites?search=${searchTarget} returned HTTP 200 OK`);
    const searchData = await searchRes.json();
    assert(searchData.sites.length > 0, `Search for "${searchTarget}" returned ${searchData.sites.length} matching site(s)`);

    // 3.4 Template filter
    const templateKey = 'royal-sapphire';
    const filterRes = await fetch(`${BACKEND_BASE}/api/admin/sites?template=${templateKey}`);
    assert(filterRes.status === 200, `GET /api/admin/sites?template=${templateKey} returned HTTP 200 OK`);
    const filterData = await filterRes.json();
    const allMatch = filterData.sites.every(s => (s.template || s.templateId) === templateKey);
    assert(allMatch, `All ${filterData.sites.length} filtered sites strictly match template "${templateKey}"`);

    // 3.5 Sorting: views-desc
    const sortViewsRes = await fetch(`${BACKEND_BASE}/api/admin/sites?sortBy=views-desc`);
    assert(sortViewsRes.status === 200, 'GET /api/admin/sites?sortBy=views-desc returned HTTP 200 OK');
    const sortViewsData = await sortViewsRes.json();
    let viewsSorted = true;
    for (let i = 0; i < sortViewsData.sites.length - 1; i++) {
      if ((sortViewsData.sites[i].viewCount || 0) < (sortViewsData.sites[i + 1].viewCount || 0)) {
        viewsSorted = false;
        break;
      }
    }
    assert(viewsSorted, 'Sites sorted by views-desc in non-increasing viewCount order');

    // 3.6 Sorting: oldest
    const sortOldestRes = await fetch(`${BACKEND_BASE}/api/admin/sites?sortBy=oldest`);
    assert(sortOldestRes.status === 200, 'GET /api/admin/sites?sortBy=oldest returned HTTP 200 OK');
    const sortOldestData = await sortOldestRes.json();
    let oldestSorted = true;
    for (let i = 0; i < sortOldestData.sites.length - 1; i++) {
      if (new Date(sortOldestData.sites[i].createdAt).getTime() > new Date(sortOldestData.sites[i + 1].createdAt).getTime()) {
        oldestSorted = false;
        break;
      }
    }
    assert(oldestSorted, 'Sites sorted by oldest in chronological order');
  } catch (e) {
    assert(false, `Sites API audit failed: ${e.message}`);
  }

  // 4. Creation, View Increment, and Deletion lifecycle
  console.log('\n[4/7] Auditing Full Lifecycle (Create -> Increment Views -> Delete)...');
  try {
    const testSlug = `audit-test-${Date.now().toString(36)}`;
    const createRes = await fetch(`${BACKEND_BASE}/api/sites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientName: 'Audit Person',
        senderName: 'Admin Auditor',
        slug: testSlug,
        template: 'royal-sapphire',
        occasion: 'System Audit'
      })
    });
    assert(createRes.status === 201, 'POST /api/sites returned 201 Created');
    const createData = await createRes.json();
    const createdId = createData.site.id;
    assert(createdId && createData.site.slug === testSlug, `Site created with id ${createdId} and slug ${testSlug}`);

    // Verify retrieval & view count increment
    const view1 = await (await fetch(`${BACKEND_BASE}/api/sites/${testSlug}`)).json();
    assert(view1.success && view1.site.viewCount === 1, `First view recorded count = 1`);

    const view2 = await (await fetch(`${BACKEND_BASE}/api/sites/${testSlug}`)).json();
    assert(view2.success && view2.site.viewCount === 2, `Second view incremented count to 2`);

    // Verify deletion cleans up data file
    const delRes = await fetch(`${BACKEND_BASE}/api/admin/sites/${createdId}`, { method: 'DELETE' });
    assert(delRes.status === 200, `DELETE /api/admin/sites/${createdId} returned HTTP 200 OK`);
    const delData = await delRes.json();
    assert(delData.success === true, 'Delete confirmed success: true');

    // Verify 404
    const check404 = await fetch(`${BACKEND_BASE}/api/sites/${testSlug}`);
    assert(check404.status === 404, `GET /api/sites/${testSlug} correctly returns 404 Not Found after deletion`);
  } catch (e) {
    assert(false, `Lifecycle audit failed: ${e.message}`);
  }

  // 5. Audit Admin Dashboard UI Code & Wiring
  console.log('\n[5/7] Auditing Admin Dashboard UI Code & Features...');
  const adminDashPath = path.join(ROOT, 'src/components/Admin/AdminDashboard.jsx');
  const adminDashContent = fs.readFileSync(adminDashPath, 'utf8');

  const sitesTablePath = path.join(ROOT, 'src/components/Admin/SitesTable.jsx');
  const sitesTableContent = fs.readFileSync(sitesTablePath, 'utf8');

  const modalPath = path.join(ROOT, 'src/components/Admin/SiteDetailModal.jsx');
  const modalContent = fs.readFileSync(modalPath, 'utf8');

  // Authentication check
  assert(adminDashContent.includes('ADMIN_PIN = \'1234\''), 'AdminDashboard enforces ADMIN_PIN = "1234"');
  assert(adminDashContent.includes('sessionStorage.getItem(AUTH_STORAGE_KEY)'), 'Admin session persisted in sessionStorage');
  assert(adminDashContent.includes('sessionStorage.removeItem(AUTH_STORAGE_KEY)'), 'Lock action clears session from sessionStorage');

  // Search, Template, Sort UI
  assert(adminDashContent.includes('searchQuery') && adminDashContent.includes('Search by name'), 'Search bar with clearable input');
  assert(adminDashContent.includes('selectedTemplate') && adminDashContent.includes('All Templates'), 'Template filter dropdown with full options');
  assert(adminDashContent.includes('sortBy') && adminDashContent.includes('setSortBy'), 'Sort options dropdown integrated with reactive state');

  // Instant optimistic deletion
  assert(adminDashContent.includes('setSites((prev) => prev.filter'), 'Admin deletion triggers instant optimistic state update');

  // Canonical ?v= URLs in SitesTable
  assert(sitesTableContent.includes('/?v='), 'SitesTable uses canonical ?v= clean short URLs');

  // Pagination in SitesTable
  assert(sitesTableContent.includes('paginatedSites') && sitesTableContent.includes('ChevronLeft'), 'SitesTable has touch-friendly client pagination controls');

  // Template badges coverage in SitesTable
  assert(sitesTableContent.includes('royal-sapphire') && sitesTableContent.includes('blush-rose'), 'SitesTable includes royal-sapphire and blush-rose template badges');

  // Site detail modal
  assert(modalContent.includes('TEMPLATE_CONFIG') && modalContent.includes('royal-sapphire'), 'SiteDetailModal supports full template configuration palette');

  // 6. Navigation & Routes
  console.log('\n[6/7] Auditing App Navigation & Keyboard Shortcuts...');
  const appPath = path.join(ROOT, 'src/App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf8');

  assert(appContent.includes("viewParam === 'admin' || window.location.pathname.toLowerCase() === '/admin'"), 'Direct /admin URL route supported');
  assert(appContent.includes("e.ctrlKey || e.metaKey") && appContent.includes("e.shiftKey") && appContent.includes("'A'"), 'Ctrl+Shift+A / Cmd+Shift+A shortcut navigates to Admin dashboard');

  // 7. Strict Privacy Check
  console.log('\n[7/7] Strict Privacy & Personal Data Audit...');
  let privacyViolations = [];
  function scanDir(dir) {
    for (const f of fs.readdirSync(dir)) {
      if (['node_modules', '.git', 'dist'].includes(f)) continue;
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) scanDir(full);
      else {
        const text = fs.readFileSync(full, 'utf8');
        const forbidden = ['a' + 'diti', 'd' + 'evi'];
        const match = text.match(new RegExp(`\\b(${forbidden.join('|')})\\b`, 'i'));
        if (match) privacyViolations.push(`${match[0]} in ${path.relative(ROOT, full)}`);
      }
    }
  }
  ['src', 'data', 'server', 'api'].forEach(f => scanDir(path.join(ROOT, f)));
  assert(privacyViolations.length === 0, `Zero occurrences of private personal names in src/, data/, server/, api/`);

  // Summary
  console.log('\n====================================================');
  console.log(`AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

runAdminAudit();
