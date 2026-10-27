import LZString from 'lz-string';
import { compressImageFile as compressPhoto, getDataUrlSizeKB } from './imageCompressor';

export { compressPhoto as compressImageFile, getDataUrlSizeKB };

const STORAGE_KEY = 'my_created_surprises';

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
 * Get all surprises saved locally in the browser
 */
export const getSavedSurprises = () => {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('localStorage read failed:', e);
    return [];
  }
};

/**
 * Save surprise locally
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

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
      return true;
    } catch (quotaError) {
      console.warn('localStorage quota exceeded, trimming saved surprises list:', quotaError);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 10)));
        return true;
      } catch {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([cleanSurprise]));
          return true;
        } catch {
          return false;
        }
      }
    }
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
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
 * Load Surprise:
 * Checks URL ?d= parameter, then checks API /api/sites/:slug, falls back to localStorage.
 */
export const loadSurprise = async (slugOrHash) => {
  // Check if current browser query string contains 'd'
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const dParam = urlParams.get('d');
    if (dParam) {
      const decompressed = decompressSurprise(dParam);
      if (decompressed) {
        return decompressed;
      }
    }
  }

  // If slugOrHash itself is or contains a query string or full URL
  let targetSlug = slugOrHash;
  if (typeof slugOrHash === 'string' && (slugOrHash.includes('?') || slugOrHash.includes('='))) {
    try {
      const queryPart = slugOrHash.includes('?') ? slugOrHash.split('?')[1] : slugOrHash;
      const params = new URLSearchParams(queryPart);
      const dParam = params.get('d');
      if (dParam) {
        const decompressed = decompressSurprise(dParam);
        if (decompressed) return decompressed;
      }
      const extracted = params.get('v') || params.get('id') || params.get('slug');
      if (extracted) {
        targetSlug = extracted;
      }
    } catch {
      // fallback
    }
  }

  // If targetSlug is missing, try reading from window.location.pathname or search in browser
  if (!targetSlug && typeof window !== 'undefined') {
    if (window.location?.pathname) {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length === 2 && parts[0] === 's') {
        targetSlug = parts[1];
      } else if (parts.length === 1 && parts[0] !== 'admin') {
        targetSlug = parts[0];
      }
    }
    if (!targetSlug && window.location?.search) {
      try {
        const params = new URLSearchParams(window.location.search);
        targetSlug = params.get('v') || params.get('id') || params.get('slug');
      } catch {
        // fallback
      }
    }
  }

  if (typeof targetSlug === 'string') {
    try {
      targetSlug = decodeURIComponent(targetSlug).trim();
    } catch {
      targetSlug = targetSlug.trim();
    }
  }

  // If targetSlug itself looks like a compressed string (longer than standard slug)
  if (targetSlug && targetSlug.length > 40 && !targetSlug.includes('-')) {
    const decompressed = decompressSurprise(targetSlug);
    if (decompressed) return decompressed;
  }

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
        const json = await res.json();
        if (json && json.site) return json.site;
        if (json && json.data) return json.data;
        return json;
      }
    } catch {
      // API failed or offline
    }

    // Try checking localStorage
    const saved = getSavedSurprises();
    const localMatch = saved.find(
      (item) =>
        (item.slug && item.slug.toLowerCase() === targetSlug.toLowerCase()) ||
        (item.id && item.id.toLowerCase() === targetSlug.toLowerCase())
    );
    if (localMatch) {
      return (localMatch.data && (localMatch.data.recipientName || localMatch.data.templateId))
        ? localMatch.data
        : localMatch;
    }
  }

  return null;
};
