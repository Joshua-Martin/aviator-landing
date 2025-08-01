// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, logEvent, setConsent, Analytics, ConsentSettings } from 'firebase/analytics';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD5bYIDUf7NpAB4L6Ph3IHYdhO7idjkW1E',
  authDomain: 'aviator-cx.firebaseapp.com',
  projectId: 'aviator-cx',
  storageBucket: 'aviator-cx.firebasestorage.app',
  messagingSenderId: '312014929736',
  appId: '1:312014929736:web:b8cabcf159d53bdb193d7d',
  measurementId: 'G-00JQG137G1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null;

/**
 * Initialize Firebase Analytics with user consent
 * @param {boolean} hasConsent - Whether the user has given consent for analytics
 * @returns {Analytics|null} - The analytics instance or null if in SSR
 */
export const initializeAnalytics = (hasConsent: boolean = false): Analytics | null => {
  // Only initialize in browser environment
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);

      // Set consent based on user preference
      const consentSettings: ConsentSettings = {
        analytics_storage: hasConsent ? 'granted' : 'denied',
      };

      setConsent(consentSettings);
      return analytics;
    } catch (error) {
      console.error('Error initializing analytics:', error);
      return null;
    }
  }
  return null;
};

/**
 * Track button click events
 * @param {string} buttonId - Identifier for the button
 * @param {Record<string, any>} additionalParams - Any additional parameters to track
 */
export const trackButtonClick = (
  buttonId: string,
  additionalParams?: Record<string, any>
): void => {
  if (!analytics) return;

  logEvent(analytics, 'button_click', {
    button_id: buttonId,
    timestamp: new Date().toISOString(),
    ...additionalParams,
  });
};

/**
 * Track video playback events
 * @param {string} videoId - Identifier for the video
 * @param {string} eventType - Type of video event (play, pause, complete, etc)
 * @param {Record<string, any>} additionalParams - Any additional parameters to track
 */
export const trackVideoEvent = (
  videoId: string,
  eventType: 'play' | 'pause' | 'complete',
  additionalParams?: Record<string, any>
): void => {
  if (!analytics) return;

  logEvent(analytics, 'video_' + eventType, {
    video_id: videoId,
    video_name: additionalParams?.name || videoId,
    timestamp: new Date().toISOString(),
    ...additionalParams,
  });
};

/**
 * Update user consent for analytics
 * @param {boolean} hasConsent - Whether the user has given consent
 */
export const updateAnalyticsConsent = (hasConsent: boolean): void => {
  if (!analytics) return;

  const consentSettings: ConsentSettings = {
    analytics_storage: hasConsent ? 'granted' : 'denied',
  };

  setConsent(consentSettings);
};

export { analytics, functions };

// Add default export for backward compatibility
export default functions;
