/**
 * Haptic Feedback Utility for Mobile Browsers (Web Vibration API)
 * Provides subtle, tactile micro-vibrations for clean luxury interactions
 * Optimized for iOS & Android in-app browsers (Instagram, Snapchat, Chrome, Safari).
 */

const canVibrate = () => {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
};

export const haptics = {
  /**
   * Subtle tap micro-vibration (buttons, navigation, card flips)
   * 8ms tactile pulse
   */
  tap: () => {
    try {
      if (canVibrate()) {
        navigator.vibrate(8);
      }
    } catch {
      // Safe fallback when vibration permissions are restricted
    }
  },

  /**
   * Crisp pop micro-vibration (wax seal, toggles, likes, treats)
   * 15ms tactile pulse
   */
  pop: () => {
    try {
      if (canVibrate()) {
        navigator.vibrate(15);
      }
    } catch {
      // Safe fallback
    }
  },

  /**
   * Celebratory rhythmic micro-vibration (confetti bursts, quiz victory, surprise reveals)
   * Pattern: 15ms buzz, 30ms rest, 20ms buzz
   */
  celebrate: () => {
    try {
      if (canVibrate()) {
        navigator.vibrate([15, 30, 20]);
      }
    } catch {
      // Safe fallback
    }
  },

  /**
   * Custom vibration pattern helper
   */
  vibrate: (pattern) => {
    try {
      if (canVibrate()) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Safe fallback
    }
  }
};

export default haptics;
