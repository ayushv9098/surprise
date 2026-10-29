import LZString from 'lz-string';
import { compressImageFile as compressPhoto, getDataUrlSizeKB } from './imageCompressor';

export { compressPhoto as compressImageFile, getDataUrlSizeKB };

const STORAGE_KEYS = ['dearly_saved_surprises', 'my_created_surprises'];
const PRIMARY_STORAGE_KEY = 'dearly_saved_surprises';

const getApiBase = () => {
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    return '';
  }
  return typeof process !== 'undefined' && process.env?.VITE_API_BASE ? process.env.VITE_API_BASE : 'http://localhost:3001';
};

/**
 * Generate a clean URL-safe slug
 */
export const generateSlug = (recipientName = 'special-one') => {
  const cleanName = recipientName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 16) || 'surprise';
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${cleanName}-${randomSuffix}`;
};

/**
 * Strip giant audio data URLs (or non-serializable blob handles) that cause
 * 100% CPU lockups during LZString compression, JSON serialization, and localStorage writes.
 */
export const sanitizeAudioPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return payload;

  const isGiant = (url) => typeof url === 'string' && (
    (url.startsWith('data:') && url.length > 500000) ||
    (url.startsWith('data:audio') && url.length > 50000)
  );

  const hasGiantSongUrl = isGiant(payload.songUrl);
  const hasGiantCustomSongUrl = isGiant(payload.customSongUrl);
  const hasAudioBlob = Boolean(payload.customAudioBlob);

  if (hasGiantSongUrl || hasGiantCustomSongUrl || hasAudioBlob) {
    const clean = { ...payload };
    if (hasGiantSongUrl) {
      clean.songUrl = '';
    }
    if (hasGiantCustomSongUrl) {
      clean.customSongUrl = '';
    }
    if (hasAudioBlob) {
      delete clean.customAudioBlob;
    }
    return clean;
  }

  return payload;
};

/**
 * Compress arbitrary object into URL-safe string
 */
export const compressSurprise = (payload) => {
  try {
    if (!payload) return '';
    const cleanPayload = sanitizeAudioPayload(payload);
    const jsonStr = JSON.stringify(cleanPayload);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (err) {
    console.error('Failed to compress surprise payload:', err);
    return '';
  }
};

/**
 * Decompress encoded string back into object
 */
export const decompressSurprise = (encodedStr) => {
  if (!encodedStr) return null;
  try {
    const jsonStr = LZString.decompressFromEncodedURIComponent(encodedStr);
    if (!jsonStr) return null;
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Failed to decompress surprise payload:', err);
    return null;
  }
};

/**
 * Get all surprises saved locally in the browser.
 * Supports both modern 'dearly_saved_surprises' and legacy 'my_created_surprises'.
 */
export const getSavedSurprises = () => {
  try {
    if (typeof localStorage === 'undefined') return [];
    const list = [];
    const seen = new Set();

    for (const key of STORAGE_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const array = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of array) {
          if (!item || typeof item !== 'object') continue;
          const identifier = (item.slug || item.id || item.data?.slug || item.data?.id || '').toLowerCase();
          if (identifier) {
            if (!seen.has(identifier)) {
              seen.add(identifier);
              list.push(item);
            }
          } else {
            list.push(item);
          }
        }
      } catch (parseErr) {
        // ignore parse errors for a specific key
      }
    }
    return list;
  } catch (e) {
    console.warn('localStorage read failed:', e);
    return [];
  }
};

/**
 * Save surprise locally across storage keys
 */
export const saveSurpriseLocally = (surprise) => {
  try {
    if (typeof localStorage === 'undefined' || !surprise) return false;
    const cleanSurprise = sanitizeAudioPayload(surprise);
    const list = getSavedSurprises();
    const existingIndex = list.findIndex(
      (item) => item.id === cleanSurprise.id || (cleanSurprise.slug && item.slug === cleanSurprise.slug)
    );
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...cleanSurprise, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...cleanSurprise, createdAt: cleanSurprise.createdAt || new Date().toISOString() });
    }

    const payloadString = JSON.stringify(list.slice(0, 50));
    for (const key of STORAGE_KEYS) {
      try {
        localStorage.setItem(key, payloadString);
      } catch (quotaError) {
        console.warn(`localStorage quota exceeded for ${key}, trimming saved surprises list:`, quotaError);
        try {
          localStorage.setItem(key, JSON.stringify(list.slice(0, 10)));
        } catch {
          try {
            localStorage.setItem(key, JSON.stringify([cleanSurprise]));
          } catch {
            // ignore
          }
        }
      }
    }
    return true;
  } catch (e) {
    console.warn('localStorage write failed:', e);
    return false;
  }
};

/**
 * Delete a saved surprise
 */
export const deleteSavedSurprise = (id) => {
  try {
    if (typeof localStorage === 'undefined') return false;
    const list = getSavedSurprises().filter((s) => s.id !== id && s.slug !== id);
    const payloadString = JSON.stringify(list);
    for (const key of STORAGE_KEYS) {
      try {
        localStorage.setItem(key, payloadString);
      } catch {}
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Primary Dual-Persistence Engine
 * Saves to backend API if available, plus LZ-String URL hash & localStorage.
 * Always resolves to a valid object and never throws an unhandled rejection.
 */
export const saveSurprise = async (payload = {}) => {
  try {
    const cleanPayload = sanitizeAudioPayload(payload);
    const id = cleanPayload?.id || `wc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const slug = cleanPayload?.slug || generateSlug(cleanPayload?.recipientName);
    const now = new Date().toISOString();

    const completePayload = {
      ...cleanPayload,
      id,
      slug,
      updatedAt: now,
      createdAt: cleanPayload?.createdAt || now,
    };

    // 1. Generate ultra-reliable compressed URL parameter synchronously
    const compressedHash = compressSurprise(completePayload);

    // 2. Attempt POST to API endpoint with a 15000ms timeout
    let savedToApi = false;
    let apiResponse = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const res = await fetch(`${getApiBase()}/api/sites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(completePayload),
          signal: controller.signal,
        });

        if (res.ok) {
          apiResponse = await res.json().catch(() => ({}));
          savedToApi = true;
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch {
      // Graceful offline fallback: backend might not be running or timed out; client-side standalone link is active
      console.info('Backend API offline/timed out; local storage fallback active.');
    }

    // Extract canonical slug from API
    const savedSlug = apiResponse?.site?.slug || apiResponse?.slug || slug;

    // Origin and clean origin
    const origin = (typeof window !== 'undefined' && window.location?.origin)
      ? window.location.origin
      : (typeof process !== 'undefined' && process.env?.TEST_ORIGIN ? process.env.TEST_ORIGIN : 'http://localhost:5174');
    const cleanOrigin = origin.replace(/\/+$/, '');

    // Construct ultra-compact clean shareUrl (< 45 chars, e.g. https://dearlys.vercel.app/s/rohan-7x2d)
    // NEVER append ?d=${compressedHash} to user-facing share links or WhatsApp links!
    const shareUrl = `${cleanOrigin}/s/${encodeURIComponent(savedSlug)}`;

    // 3. Persist in localStorage with guarded try-catch
    try {
      saveSurpriseLocally({
        ...completePayload,
        slug: savedSlug,
        shareUrl,
        compressedHash,
      });
    } catch {
      // LocalStorage quota or access error ignored
    }

    return {
      success: true,
      id,
      slug: savedSlug,
      shareUrl,
      compressedHash,
      savedToApi,
      data: completePayload,
      apiResponse,
    };
  } catch (criticalErr) {
    console.error('saveSurprise fallback engaged:', criticalErr);
    const fallbackId = payload?.id || `wc-${Date.now().toString(36)}`;
    const fallbackSlug = payload?.slug || 'surprise';
    const origin = (typeof window !== 'undefined' && window.location?.origin)
      ? window.location.origin
      : (typeof process !== 'undefined' && process.env?.TEST_ORIGIN ? process.env.TEST_ORIGIN : 'http://localhost:5174');
    const cleanOrigin = origin.replace(/\/+$/, '');
    return {
      success: true,
      id: fallbackId,
      slug: fallbackSlug,
      shareUrl: `${cleanOrigin}/s/${encodeURIComponent(fallbackSlug)}`,
      compressedHash: '',
      savedToApi: false,
      data: payload || {},
      apiResponse: null,
    };
  }
};

/**
 * Fire-and-forget background sync / re-publish of a local keepsake to the cloud backend API.
 * Never throws, never blocks the caller.
 */
export const backgroundSyncToBackend = (payload) => {
  if (!payload || typeof payload !== 'object') return;
  try {
    const cleanPayload = sanitizeAudioPayload(payload);
    if (!cleanPayload.recipientName && !cleanPayload.title && !cleanPayload.slug && !cleanPayload.templateId) {
      return;
    }

    fetch(`${getApiBase()}/api/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanPayload),
    })
      .then(async (res) => {
        if (res.ok) {
          const resJson = await res.json().catch(() => ({}));
          console.info(`[Dearly Auto-Sync] Successfully re-synced keepsake "${cleanPayload.slug || cleanPayload.id}" to cloud backend.`, resJson);
        } else {
          console.warn(`[Dearly Auto-Sync] Cloud backend returned status ${res.status} while re-syncing.`);
        }
      })
      .catch((err) => {
        console.warn('[Dearly Auto-Sync] Background re-sync network notice (backend offline or cold-start):', err);
      });
  } catch (err) {
    console.warn('[Dearly Auto-Sync] Error in backgroundSyncToBackend:', err);
  }
};

/**
 * Load Surprise:
 * Checks URL ?d= parameter, then checks API /api/sites/:slug.
 * If backend returns 404, cold-starts, or is unavailable:
 *   - Checks localStorage for a keepsake with matching slug or id.
 *   - If found in localStorage:
 *       - Automatically fires background POST /api/sites to re-sync / re-publish to backend cloud DB!
 *       - Returns the keepsake data immediately so the page renders without 404 error!
 * If not found anywhere, returns null.
 */
export const loadSurprise = async (slugOrParams) => {
  // Check if current browser query string contains 'd'
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const dParam = urlParams.get('d');
    if (dParam) {
      const decompressed = decompressSurprise(dParam);
      if (decompressed) {
        if (decompressed.slug || decompressed.id) {
          backgroundSyncToBackend(decompressed);
        }
        return decompressed;
      }
    }
  }

  // Parse targetSlug from string or object
  let targetSlug = null;
  let dParam = null;

  if (typeof slugOrParams === 'string') {
    let str = slugOrParams.trim();
    if (str.includes('/s/')) {
      const parts = str.split('/s/');
      str = parts[parts.length - 1];
    }
    if (str.includes('?')) {
      const [pathPart, queryPart] = str.split('?');
      if (!targetSlug && pathPart && !pathPart.startsWith('http')) {
        targetSlug = pathPart;
      }
      try {
        const sp = new URLSearchParams(queryPart);
        dParam = sp.get('d') || dParam;
        const extracted = sp.get('v') || sp.get('id') || sp.get('slug');
        if (extracted) targetSlug = extracted;
      } catch {}
    } else if (str.includes('=')) {
      try {
        const sp = new URLSearchParams(str);
        dParam = sp.get('d') || dParam;
        const extracted = sp.get('v') || sp.get('id') || sp.get('slug');
        if (extracted) targetSlug = extracted;
      } catch {}
    } else {
      targetSlug = str;
    }
  } else if (slugOrParams && typeof slugOrParams === 'object') {
    targetSlug = slugOrParams.slug || slugOrParams.id || slugOrParams.v || slugOrParams.targetSlug || null;
    dParam = slugOrParams.d || null;
  }

  // Check window location if targetSlug is still not resolved
  if (typeof window !== 'undefined') {
    if (!dParam && window.location.search) {
      try {
        const params = new URLSearchParams(window.location.search);
        dParam = params.get('d');
        if (!targetSlug) {
          targetSlug = params.get('v') || params.get('id') || params.get('slug');
        }
      } catch {}
    }
    if (!targetSlug && window.location.pathname) {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length >= 2 && parts[0].toLowerCase() === 's') {
        targetSlug = parts[1];
      } else if (parts.length === 1 && !['admin', 'builder', 'create', 'templates', 'about', 'privacy', 'terms'].includes(parts[0].toLowerCase())) {
        targetSlug = parts[0];
      }
    }
  }

  // If dParam was found in query/object
  if (dParam) {
    const decompressed = decompressSurprise(dParam);
    if (decompressed) {
      if (decompressed.slug || decompressed.id) {
        backgroundSyncToBackend(decompressed);
      }
      return decompressed;
    }
  }

  if (typeof targetSlug === 'string') {
    try {
      targetSlug = decodeURIComponent(targetSlug).trim();
    } catch {
      targetSlug = targetSlug.trim();
    }
    targetSlug = targetSlug.split('#')[0].replace(/\/+$/, '');
  }

  // If targetSlug itself looks like a compressed string (longer than standard slug)
  if (targetSlug && targetSlug.length > 40 && !targetSlug.includes('-')) {
    const decompressed = decompressSurprise(targetSlug);
    if (decompressed) {
      if (decompressed.slug || decompressed.id) {
        backgroundSyncToBackend(decompressed);
      }
      return decompressed;
    }
  }

  // Helper function to find keepsake in localStorage and trigger auto-resync
  const findInLocalStorageAndSync = () => {
    if (!targetSlug) return null;
    const cleanTargetSlug = targetSlug.toLowerCase().trim();

    // 1. Search in saved surprises list (both dearly_saved_surprises & my_created_surprises)
    const saved = getSavedSurprises();
    const localMatch = saved.find((item) => {
      if (!item) return false;
      const iSlug = (item.slug || item.data?.slug || item.site?.slug || '').toLowerCase().trim();
      const iId = (item.id || item.data?.id || item.site?.id || '').toLowerCase().trim();
      return (iSlug && iSlug === cleanTargetSlug) || (iId && iId === cleanTargetSlug);
    });

    if (localMatch) {
      const keepsakeData = (localMatch.data && (localMatch.data.recipientName || localMatch.data.templateId || localMatch.data.scenes))
        ? localMatch.data
        : (localMatch.site && (localMatch.site.recipientName || localMatch.site.templateId || localMatch.site.scenes))
        ? localMatch.site
        : localMatch;

      const payloadToSync = {
        ...localMatch,
        ...keepsakeData,
        slug: keepsakeData.slug || localMatch.slug || targetSlug,
        id: keepsakeData.id || localMatch.id,
      };

      // Automatically fire background POST /api/sites to re-sync / re-publish to backend cloud DB!
      backgroundSyncToBackend(payloadToSync);

      // Return keepsake data so the page renders instantly without 404 error!
      return payloadToSync;
    }

    // 2. Check direct individual key in localStorage
    if (typeof localStorage !== 'undefined') {
      const directKeys = [
        targetSlug,
        `surprise_${targetSlug}`,
        `dearly_${targetSlug}`,
        `site_${targetSlug}`
      ];
      for (const dk of directKeys) {
        try {
          const directRaw = localStorage.getItem(dk);
          if (directRaw) {
            const parsed = JSON.parse(directRaw);
            if (parsed && typeof parsed === 'object') {
              const resObj = parsed.site || parsed.data || parsed;
              const payloadToSync = {
                ...parsed,
                ...resObj,
                slug: resObj.slug || parsed.slug || targetSlug,
              };
              backgroundSyncToBackend(payloadToSync);
              return payloadToSync;
            }
          }
        } catch {}
      }
    }

    return null;
  };

  // Try fetching from backend API
  if (targetSlug) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${getApiBase()}/api/sites/${encodeURIComponent(targetSlug)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json().catch(() => null);
        const site = json?.site || json?.data || json;
        if (site && (site.recipientName || site.templateId || site.scenes || site.slug || site.title)) {
          return site;
        }
      }
      // If res is not ok (404, 500, etc.), fall through to check localStorage!
    } catch {
      // API failed, offline, or timed out - fall through to check localStorage!
    }

    // If backend returned 404 or failed: check localStorage & background re-sync
    const localKeepsake = findInLocalStorageAndSync();
    if (localKeepsake) {
      return localKeepsake;
    }
  }

  return null;
};
