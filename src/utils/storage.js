import LZString from 'lz-string';

const STORAGE_KEY = 'my_created_surprises';

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
 * Compress arbitrary object into URL-safe string
 */
export const compressSurprise = (payload) => {
  try {
    const jsonStr = JSON.stringify(payload);
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
    const list = getSavedSurprises();
    const existingIndex = list.findIndex(
      (item) => item.id === surprise.id || (surprise.slug && item.slug === surprise.slug)
    );
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...surprise, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...surprise, createdAt: surprise.createdAt || new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
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
    const list = getSavedSurprises().filter((s) => s.id !== id && s.slug !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Primary Dual-Persistence Engine
 * Saves to backend API if available, plus LZ-String URL hash & localStorage.
 */
export const saveSurprise = async (payload) => {
  const id = payload.id || `wc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const slug = payload.slug || generateSlug(payload.recipientName);
  const now = new Date().toISOString();

  const completePayload = {
    ...payload,
    id,
    slug,
    updatedAt: now,
    createdAt: payload.createdAt || now,
  };

  // 1. Generate ultra-reliable compressed URL parameter
  const compressedHash = compressSurprise(completePayload);
  
  // Construct absolute URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  
  // If base route is '/', url will be /?v=slug&d=compressed
  const shareUrl = `${origin}${pathname}?v=${encodeURIComponent(slug)}&d=${compressedHash}`;

  // 2. Persist in localStorage
  saveSurpriseLocally({
    ...completePayload,
    shareUrl,
    compressedHash,
  });

  // 3. Attempt POST to API endpoint
  let savedToApi = false;
  let apiResponse = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('/api/sites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...completePayload,
        compressedHash,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      apiResponse = await res.json().catch(() => ({}));
      savedToApi = true;
    }
  } catch (err) {
    // Graceful offline fallback: backend might not be running yet, or user is offline
    console.info('Backend API unavailable; client-side standalone link active.');
  }

  return {
    success: true,
    id,
    slug,
    shareUrl,
    compressedHash,
    savedToApi,
    data: completePayload,
    apiResponse,
  };
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

  // If slugOrHash itself looks like a compressed string (longer than standard slug)
  if (slugOrHash && slugOrHash.length > 40) {
    const decompressed = decompressSurprise(slugOrHash);
    if (decompressed) return decompressed;
  }

  // Try fetching from backend API
  if (slugOrHash) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`/api/sites/${encodeURIComponent(slugOrHash)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json && json.data) return json.data;
        if (json) return json;
      }
    } catch (e) {
      // API failed or offline
    }

    // Try checking localStorage
    const saved = getSavedSurprises();
    const localMatch = saved.find((item) => item.slug === slugOrHash || item.id === slugOrHash);
    if (localMatch) {
      return localMatch;
    }
  }

  return null;
};

/**
 * Client-side lightweight image compressor (resizes to max 800px & 0.75 JPEG)
 * Keeps payload lightweight for instant sharing without server upload limits.
 */
export const compressImageFile = (file, maxWidth = 800, maxHeight = 800, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};
