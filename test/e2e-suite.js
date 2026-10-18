import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import LZString from 'lz-string';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const FRONTEND_BASE = process.env.FRONTEND_URL || 'http://localhost:5174';
const BACKEND_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

// Whitelist of allowed public CDN and service hostnames
const ALLOWED_HOSTNAMES = new Set([
  'images.unsplash.com',
  'cdn.pixabay.com',
  'cdn.freesound.org',
  'www.soundhelix.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'api.whatsapp.com',
  'www.w3.org',
  'localhost',
  '127.0.0.1',
  'emojicdn.elk.sh'
]);

async function runE2ESuite() {
  console.log('====================================================');
  console.log('🚀 WISHCRAFT PRODUCTION E2E VERIFICATION SUITE');
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

  // =========================================================================
  // SECTION 1: Deep Privacy Audit & Data Hygiene
  // =========================================================================
  console.log('[1/8] Running Deep Privacy Audit...');
  let totalFilesAudited = 0;
  const discoveredUrls = [];
  const privacyViolations = [];

  function auditDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      if (['node_modules', '.git', 'dist'].includes(item)) continue;
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        auditDirectory(fullPath);
      } else {
        totalFilesAudited++;
        const content = fs.readFileSync(fullPath, 'utf8');

        // Check 1: Private name boundary check ('aditi' or 'devi')
        const nameMatch = content.match(/\b(aditi|devi)\b/i);
        if (nameMatch) {
          privacyViolations.push(`Personal name "${nameMatch[0]}" found in ${path.relative(ROOT, fullPath)}`);
        }

        // Check 2: Extract external URLs to verify against allowed hostnames
        const urlMatches = content.match(/https?:\/\/[^\s'"<>`)]+/g) || [];
        for (const rawUrl of urlMatches) {
          discoveredUrls.push({ url: rawUrl, file: path.relative(ROOT, fullPath) });
        }
      }
    }
  }

  // Audit src/, data/, server/, and index.html
  ['src', 'data', 'server'].forEach((folder) => {
    auditDirectory(path.join(ROOT, folder));
  });

  const indexHtmlPath = path.join(ROOT, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    totalFilesAudited++;
    const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
    const indexNameMatch = indexContent.match(/\b(aditi|devi)\b/i);
    if (indexNameMatch) {
      privacyViolations.push(`Personal name "${indexNameMatch[0]}" in index.html`);
    }
    const indexUrls = indexContent.match(/https?:\/\/[^\s'"<>`)]+/g) || [];
    for (const rawUrl of indexUrls) {
      discoveredUrls.push({ url: rawUrl, file: 'index.html' });
    }
  }

  assert(
    privacyViolations.length === 0,
    `Zero occurrences of private personal names ('aditi'/'devi') across ${totalFilesAudited} files in src/, data/, server/, index.html`
  );
  if (privacyViolations.length > 0) {
    privacyViolations.forEach((v) => console.error(`    -> ${v}`));
  }

  // Audit discovered URLs for private domains or unauthorized external endpoints
  const unapprovedUrls = [];
  for (const { url, file } of discoveredUrls) {
    // Extract hostname up to port, path, or template variable
    const match = url.match(/^https?:\/\/([a-zA-Z0-9\.\-_]+)/);
    const host = match ? match[1].toLowerCase() : null;

    if (!host || !ALLOWED_HOSTNAMES.has(host)) {
      unapprovedUrls.push({ url, host, file });
    }
  }

  assert(
    unapprovedUrls.length === 0,
    `All ${discoveredUrls.length} extracted URLs strictly conform to approved CDNs/public namespaces (no private domains)`
  );
  if (unapprovedUrls.length > 0) {
    unapprovedUrls.forEach((u) => console.error(`    -> Unapproved URL: ${u.url} in ${u.file}`));
  }

  // =========================================================================
  // SECTION 2: Compression & Decompression Roundtrip (LZ-String)
  // =========================================================================
  console.log('\n[2/8] Testing LZ-String Roundtrip & URL Query Construction...');
  const sampleSite = {
    templateId: 'blush-romance',
    recipientName: 'Sarah Jenkins',
    senderName: 'Alex Carter',
    occasion: 'Happy 2nd Anniversary! 🌸',
    subtitle: 'Falling in love every single day.',
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7', caption: 'Our coffee walk ☕' },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486', caption: 'Botanical garden walk 🌿' }
    ],
    songId: 'romantic-acoustic',
    letter: {
      title: 'For You Always',
      content: 'Every moment with you is an adventure I treasure forever.'
    },
    quiz: {
      enabled: true,
      question: 'Where did we first meet?',
      options: ['Corner Cafe', 'Park Bench', 'Library', 'Concert Hall'],
      correctIndex: 0
    },
    scratchCard: {
      enabled: true,
      title: 'Scratch for a surprise',
      hiddenSecret: 'Free ice cream date tonight! 🍦'
    }
  };

  const jsonStr = JSON.stringify(sampleSite);
  const compressed = LZString.compressToEncodedURIComponent(jsonStr);
  const decompressedStr = LZString.decompressFromEncodedURIComponent(compressed);
  const decompressedObj = JSON.parse(decompressedStr);

  assert(compressed && compressed.length > 0, `Compressed payload generated (length: ${compressed.length} chars)`);
  assert(decompressedObj.recipientName === sampleSite.recipientName, 'Decompressed recipientName matches');
  assert(decompressedObj.senderName === sampleSite.senderName, 'Decompressed senderName matches');
  assert(
    Array.isArray(decompressedObj.photos) && decompressedObj.photos.length === 2,
    'Decompressed photo array integrity verified (2 photos)'
  );
  assert(
    decompressedObj.photos[0].caption === sampleSite.photos[0].caption,
    'Decompressed photo caption and metadata preserved'
  );
  assert(
    decompressedObj.letter.title === sampleSite.letter.title &&
      decompressedObj.letter.content === sampleSite.letter.content,
    'Decompressed letter object preserved with 100% integrity'
  );
  assert(
    decompressedObj.quiz.enabled === true &&
      decompressedObj.quiz.options.length === 4 &&
      decompressedObj.quiz.correctIndex === 0,
    'Decompressed quiz object matches full specification'
  );
  assert(
    decompressedObj.scratchCard.enabled === true &&
      decompressedObj.scratchCard.hiddenSecret === sampleSite.scratchCard.hiddenSecret,
    'Decompressed scratch card object preserved with secret intact'
  );

  // Test URL query string construction with ?v=...&d=...
  const testSlug = 'for-sarah';
  const constructedUrl = `${FRONTEND_BASE}/?v=${encodeURIComponent(testSlug)}&d=${encodeURIComponent(compressed)}`;
  const parsedUrl = new URL(constructedUrl);
  const extractedSlug = parsedUrl.searchParams.get('v');
  const extractedData = parsedUrl.searchParams.get('d');

  assert(extractedSlug === testSlug, `URL query param 'v' correctly matches '${testSlug}'`);
  assert(extractedData === compressed, "URL query param 'd' accurately encodes the LZ payload");

  const roundtripFromQuery = JSON.parse(LZString.decompressFromEncodedURIComponent(extractedData));
  assert(
    roundtripFromQuery.recipientName === sampleSite.recipientName,
    'Full roundtrip extraction from URL query parameter matches payload'
  );

  // =========================================================================
  // SECTION 3: High-Resolution QR Code Engine Verification
  // =========================================================================
  console.log('\n[3/8] Testing High-Resolution QR Code Engine...');
  const qrDataUrl = await QRCode.toDataURL(constructedUrl, { width: 300, margin: 2 });
  assert(qrDataUrl.startsWith('data:image/png;base64,'), 'QR Code PNG Data URL generated successfully');
  assert(qrDataUrl.length > 500, `QR Code base64 data density verified (${qrDataUrl.length} chars)`);

  // =========================================================================
  // SECTION 4: Route & Frontend HTTP Verification
  // =========================================================================
  console.log('\n[4/8] Testing Route & Frontend HTTP Availability...');
  const frontendRoutes = [
    { url: `${FRONTEND_BASE}/`, name: 'Home page (Builder Studio)' },
    { url: `${FRONTEND_BASE}/?preview=blush-romance`, name: 'Template: blush-romance' },
    { url: `${FRONTEND_BASE}/?preview=golden-birthday`, name: 'Template: golden-birthday' },
    { url: `${FRONTEND_BASE}/?preview=polaroid-scrapbook`, name: 'Template: polaroid-scrapbook' },
    { url: `${FRONTEND_BASE}/?preview=heartfelt-apology`, name: 'Template: heartfelt-apology' },
    { url: `${FRONTEND_BASE}/?view=admin`, name: 'Admin Control Center' }
  ];

  for (const route of frontendRoutes) {
    try {
      const res = await fetch(route.url);
      assert(res.ok && res.status === 200, `GET ${route.url} (${route.name}) returned HTTP 200 OK`);
      const body = await res.text();
      assert(body.includes('id="root"'), `  -> Response renders valid HTML application root for ${route.name}`);
    } catch (e) {
      assert(false, `Frontend route failed for ${route.url}: ${e.message}`);
    }
  }

  // =========================================================================
  // SECTION 5: Backend API Health Check
  // =========================================================================
  console.log('\n[5/8] Testing Backend API Health Check...');
  try {
    const healthRes = await fetch(`${BACKEND_BASE}/api/health`);
    assert(healthRes.status === 200, `GET /api/health returned HTTP ${healthRes.status}`);
    const healthData = await healthRes.json();
    assert(healthData.status === 'ok', "Health response status is 'ok'");
    assert(healthData.service === 'wishcraft-backend', "Service identifier matches 'wishcraft-backend'");
  } catch (e) {
    assert(false, `Backend health check failed: ${e.message}`);
  }

  // =========================================================================
  // SECTION 6: Site Creation & Automated View Count Increment
  // =========================================================================
  console.log('\n[6/8] Testing Site Creation & Automated View Count Increment...');
  const e2eSlug = `e2e-test-${Date.now().toString(36)}`;
  let createdSiteId = null;

  try {
    const createRes = await fetch(`${BACKEND_BASE}/api/sites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...sampleSite,
        slug: e2eSlug,
        recipientName: 'Elena Gilbert',
        template: 'blush-romance'
      })
    });

    assert(createRes.status === 201, 'POST /api/sites returned 201 Created');
    const createData = await createRes.json();
    assert(createData.success === true, 'Response contains success: true');
    assert(createData.site && createData.site.slug === e2eSlug, `Created site with verified slug: ${e2eSlug}`);
    createdSiteId = createData.site.id;

    // View count verification
    const view1Res = await fetch(`${BACKEND_BASE}/api/sites/${e2eSlug}`);
    assert(view1Res.status === 200, `GET /api/sites/${e2eSlug} returned HTTP 200 OK`);
    const view1Data = await view1Res.json();
    const count1 = view1Data.site.viewCount;

    const view2Res = await fetch(`${BACKEND_BASE}/api/sites/${e2eSlug}`);
    assert(view2Res.status === 200, `GET /api/sites/${e2eSlug} (second view) returned HTTP 200 OK`);
    const view2Data = await view2Res.json();
    const count2 = view2Data.site.viewCount;

    assert(count2 === count1 + 1, `View count incremented automatically from ${count1} to ${count2}`);
  } catch (e) {
    assert(false, `Site creation or view counting failed: ${e.message}`);
  }

  // =========================================================================
  // SECTION 7: Admin Control Center Metrics & Search / Filter
  // =========================================================================
  console.log('\n[7/8] Testing Admin Control Center Metrics & Search/Filter Validation...');
  try {
    // 7.1 Admin metrics endpoint
    const metricsRes = await fetch(`${BACKEND_BASE}/api/admin/metrics`);
    assert(metricsRes.status === 200, 'GET /api/admin/metrics returned HTTP 200 OK');
    const metricsData = await metricsRes.json();
    assert(metricsData.success === true, 'Admin metrics success flag is true');
    assert(typeof metricsData.metrics.totalSites === 'number' && metricsData.metrics.totalSites > 0, `Total sites recorded: ${metricsData.metrics.totalSites}`);
    assert(typeof metricsData.metrics.totalViews === 'number' && metricsData.metrics.totalViews >= 0, `Total views recorded: ${metricsData.metrics.totalViews}`);
    assert(
      typeof metricsData.metrics.mostPopularTemplate === 'string',
      `Most popular template identified: "${metricsData.metrics.mostPopularTemplate}"`
    );

    // 7.2 Search validation
    const searchRes = await fetch(`${BACKEND_BASE}/api/admin/sites?search=Elena`);
    assert(searchRes.status === 200, 'GET /api/admin/sites?search=Elena returned HTTP 200 OK');
    const searchData = await searchRes.json();
    const foundElena = searchData.sites.some((s) => s.recipientName.includes('Elena'));
    assert(foundElena, "Search query 'Elena' successfully retrieved the matching site");

    // 7.3 Template filter validation
    const filterRes = await fetch(`${BACKEND_BASE}/api/admin/sites?template=blush-romance`);
    assert(filterRes.status === 200, 'GET /api/admin/sites?template=blush-romance returned HTTP 200 OK');
    const filterData = await filterRes.json();
    const allBlush = filterData.sites.every(
      (s) => (s.template || s.templateId) === 'blush-romance'
    );
    assert(allBlush, `Template filter strictly returned only blush-romance sites (count: ${filterData.sites.length})`);

    // 7.4 Sorting validation (views-desc)
    const sortRes = await fetch(`${BACKEND_BASE}/api/admin/sites?sortBy=views-desc`);
    assert(sortRes.status === 200, 'GET /api/admin/sites?sortBy=views-desc returned HTTP 200 OK');
    const sortData = await sortRes.json();
    let isSortedDesc = true;
    for (let i = 0; i < sortData.sites.length - 1; i++) {
      if ((sortData.sites[i].viewCount || 0) < (sortData.sites[i + 1].viewCount || 0)) {
        isSortedDesc = false;
        break;
      }
    }
    assert(isSortedDesc, 'Sites sorting by views-desc returns records in non-increasing viewCount order');
  } catch (e) {
    assert(false, `Admin API validation failed: ${e.message}`);
  }

  // =========================================================================
  // SECTION 8: Test Site Cleanup & Deletion Verification
  // =========================================================================
  console.log('\n[8/8] Testing Admin Site Deletion & Cleanup...');
  try {
    if (createdSiteId) {
      const delRes = await fetch(`${BACKEND_BASE}/api/admin/sites/${createdSiteId}`, {
        method: 'DELETE'
      });
      assert(delRes.status === 200, `DELETE /api/admin/sites/${createdSiteId} returned HTTP 200 OK`);
      const delData = await delRes.json();
      assert(delData.success === true, 'Admin delete response confirmed success');

      // Verify site no longer resolves via public slug
      const checkRes = await fetch(`${BACKEND_BASE}/api/sites/${e2eSlug}`);
      assert(checkRes.status === 404, `GET /api/sites/${e2eSlug} returns 404 Not Found after deletion`);
    } else {
      assert(false, 'No createdSiteId available for deletion test');
    }
  } catch (e) {
    assert(false, `Site deletion and cleanup failed: ${e.message}`);
  }

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('\n====================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ESuite();
