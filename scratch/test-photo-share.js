import assert from 'node:assert';
import { saveSurprise, loadSurprise } from '../src/utils/storage.js';
import { db } from '../server/db.js';

async function runPhotoShareTest() {
  console.log('====================================================');
  console.log('🧪 RUNNING PHOTO & CLEAN SHARE URL E2E VERIFICATION');
  console.log('====================================================\n');

  // Step 1: Create a realistic ~50KB base64 JPEG photo dataUrl
  // Valid minimal JPEG header followed by base64 payload to simulate real 50KB image
  const jpegHeaderBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/';
  const paddingLength = 50 * 1024; // 50KB
  const rawPayload = 'B'.repeat(paddingLength);
  const fakeBase64 = Buffer.from(rawPayload).toString('base64');
  const realPhotoDataUrl = `data:image/jpeg;base64,${jpegHeaderBase64}${fakeBase64}`;

  console.log(`[1/5] Generated realistic base64 photo data URL:`);
  console.log(`      Photo string length: ${realPhotoDataUrl.length} characters (~${Math.round(realPhotoDataUrl.length / 1024)} KB)`);

  const payload = {
    recipientName: 'Sarah Jenkins',
    senderName: 'Alex Carter',
    headline: 'You make every day extraordinary ✨',
    occasion: 'Happy 2nd Anniversary! 🌸',
    subtitle: 'Falling in love every single day.',
    templateId: 'royal-sapphire',
    template: 'royal-sapphire',
    heroPhoto: realPhotoDataUrl,
    photoCaption: 'Under the golden city lights 🏙️',
    photos: [
      { id: 'photo-1', url: realPhotoDataUrl, caption: 'Under the golden city lights 🏙️' }
    ],
    songId: 'romantic-acoustic',
    customAudioUrl: 'https://cdn.pixabay.com/audio/test-audio.mp3',
    specialReasons: [
      { id: 'r1', icon: '⭐', title: 'Your Infectious Energy', desc: 'Lights up any room you walk into' },
      { id: 'r2', icon: '🦋', title: 'Always There For Me', desc: 'No matter what happens, you have my back' },
      { id: 'r3', icon: '👑', title: 'Truly One of a Kind', desc: 'Never stop being the awesome person you are' }
    ],
    letter: {
      title: 'To My Dearest Sarah',
      content: 'Every single moment with you is an adventure I treasure with all my heart. Happy 2nd Anniversary, my sweetest love!',
      signOff: 'With all my love, Alex',
      sealEmoji: '💌',
      waxColor: '#E11D48'
    }
  };

  let savedId = null;

  try {
    // Step 2: Call saveSurprise(payload)
    console.log('\n[2/5] Calling saveSurprise(payload)...');
    const startTime = Date.now();
    const saveResult = await saveSurprise(payload);
    const duration = Date.now() - startTime;

    savedId = saveResult.id;

    console.log(`      saveSurprise completed in ${duration}ms`);
    console.log(`      Saved to API: ${saveResult.savedToApi}`);
    console.log(`      Generated slug: ${saveResult.slug}`);
    console.log(`      Generated shareUrl: ${saveResult.shareUrl}`);

    assert.strictEqual(saveResult.success, true, 'saveSurprise must return success: true');
    assert.strictEqual(saveResult.savedToApi, true, 'saveSurprise must save successfully to /api/sites without timing out');
    assert.ok(saveResult.shareUrl, 'saveSurprise must generate a valid shareUrl');
    assert.ok(saveResult.shareUrl.length < 2000, `shareUrl must be clean & short (< 2000 chars), got ${saveResult.shareUrl.length} chars`);
    assert.ok(!saveResult.shareUrl.includes(fakeBase64.substring(0, 50)), 'shareUrl must NOT contain the 50KB base64 photo in query string');

    // Step 3: Extract ?v=slug or ?d=hash from shareUrl
    console.log('\n[3/5] Extracting slug or hash from shareUrl...');
    const parsedUrl = new URL(saveResult.shareUrl);
    const extractedSlug = parsedUrl.searchParams.get('v') || parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('slug');
    const extractedHash = parsedUrl.searchParams.get('d');

    console.log(`      Extracted ?v slug: "${extractedSlug}"`);
    if (extractedHash) {
      console.log(`      Extracted ?d hash length: ${extractedHash.length} chars`);
    }

    assert.ok(extractedSlug || extractedHash, 'Must extract either ?v=slug or ?d=hash from shareUrl');
    const queryParamToLoad = extractedSlug || extractedHash;

    // Step 4: Call loadSurprise(extractedSlug)
    console.log('\n[4/5] Calling loadSurprise(extractedSlug)...');
    const loadedSite = await loadSurprise(queryParamToLoad);

    assert.ok(loadedSite, 'loadSurprise must return a valid site object');

    // Step 5: Verify the returned site object properties
    console.log('\n[5/5] Verifying returned site properties...');
    
    // Verification 1: recipientName
    assert.strictEqual(loadedSite.recipientName, payload.recipientName, 'recipientName must match');
    console.log(`  ✓ recipientName: "${loadedSite.recipientName}"`);

    // Verification 2: heroPhoto matches uploaded dataUrl
    assert.ok(loadedSite.heroPhoto, 'heroPhoto must exist on loaded site');
    assert.strictEqual(loadedSite.heroPhoto, realPhotoDataUrl, 'heroPhoto must match uploaded 50KB dataUrl with 100% fidelity');
    console.log(`  ✓ heroPhoto: 50KB base64 dataUrl matches uploaded photo perfectly (${loadedSite.heroPhoto.length} chars)`);

    // Verification 3: occasion
    assert.strictEqual(loadedSite.occasion, payload.occasion, 'occasion must match');
    console.log(`  ✓ occasion: "${loadedSite.occasion}"`);

    // Verification 4: specialReasons (3 items)
    assert.ok(Array.isArray(loadedSite.specialReasons), 'specialReasons must be an array');
    assert.strictEqual(loadedSite.specialReasons.length, 3, 'specialReasons must have exactly 3 items');
    assert.strictEqual(loadedSite.specialReasons[0].title, payload.specialReasons[0].title, 'First reason title matches');
    assert.strictEqual(loadedSite.specialReasons[1].title, payload.specialReasons[1].title, 'Second reason title matches');
    assert.strictEqual(loadedSite.specialReasons[2].title, payload.specialReasons[2].title, 'Third reason title matches');
    console.log(`  ✓ specialReasons: 3 items preserved with 100% integrity`);

    // Verification 5: letter
    assert.ok(loadedSite.letter, 'letter must exist on loaded site');
    if (typeof loadedSite.letter === 'object') {
      assert.strictEqual(loadedSite.letter.content, payload.letter.content, 'letter content must match');
      assert.strictEqual(loadedSite.letter.title, payload.letter.title, 'letter title must match');
    } else {
      assert.strictEqual(loadedSite.letter, payload.letter.content, 'letter string must match');
    }
    console.log(`  ✓ letter: preserved with 100% integrity`);

    // Verification 6: templateId
    const loadedTemplateId = loadedSite.templateId || loadedSite.template;
    assert.strictEqual(loadedTemplateId, payload.templateId, 'templateId must match');
    console.log(`  ✓ templateId: "${loadedTemplateId}"`);

    // Additional check: Also verify loadSurprise works directly when passing full shareUrl
    console.log('\n[Bonus] Verifying loadSurprise works directly with full shareUrl...');
    const loadedFromFullUrl = await loadSurprise(saveResult.shareUrl);
    assert.ok(loadedFromFullUrl, 'loadSurprise with full shareUrl must return valid site');
    assert.strictEqual(loadedFromFullUrl.recipientName, payload.recipientName, 'recipientName from full shareUrl matches');
    assert.strictEqual(loadedFromFullUrl.heroPhoto, realPhotoDataUrl, 'heroPhoto from full shareUrl matches');
    console.log('  ✓ loadSurprise(saveResult.shareUrl) resolved successfully with matching data');

    console.log('\n====================================================');
    console.log('🎉 ALL PHOTO & CLEAN SHARE URL VERIFICATIONS PASSED (100%)!');
    console.log('====================================================\n');
  } finally {
    if (savedId) {
      db.deleteSite(savedId);
      console.log('Test site cleaned up from database.');
    }
  }
}

runPhotoShareTest().catch((err) => {
  console.error('\n❌ Test failed with error:', err);
  process.exit(1);
});
