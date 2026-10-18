import QRCode from 'qrcode';

/**
 * Generate WhatsApp share intent link
 */
export const getWhatsAppShareUrl = (url, recipientName = 'Someone special', senderName = 'A friend') => {
  const text = `✨ Hey ${recipientName}! ${senderName} created a personalized surprise keepsake just for you. Open this to see your surprise: \n\n${url}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
};

/**
 * Generate High-Resolution QR Code Data URL
 */
export const generateQRCodeDataUrl = async (text, options = {}) => {
  try {
    const opts = {
      width: options.width || 320,
      margin: options.margin !== undefined ? options.margin : 2,
      color: {
        dark: options.darkColor || '#831843', // Deep rose wine
        light: options.lightColor || '#FFFDFB', // Soft warm cream
      },
      errorCorrectionLevel: 'M',
      ...options,
    };
    return await QRCode.toDataURL(text, opts);
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return null;
  }
};

/**
 * Copy text to clipboard with robust fallback
 */
export const copyToClipboard = async (text) => {
  if (!text) return false;

  // Modern clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, falling back:', err);
    }
  }

  // Fallback using textarea + execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
};

/**
 * Trigger native device share if supported (iOS / Android)
 */
export const triggerNativeShare = async ({ title, text, url }) => {
  if (navigator?.share) {
    try {
      await navigator.share({
        title: title || 'A Special Surprise For You ✨',
        text: text || 'Open your personalized keepsake surprise!',
        url: url,
      });
      return true;
    } catch (err) {
      // User cancelled or aborted
      if (err.name !== 'AbortError') {
        console.warn('Native share failed:', err);
      }
    }
  }
  return false;
};
