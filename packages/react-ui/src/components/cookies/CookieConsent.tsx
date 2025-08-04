import React, { useEffect, useState } from 'react';
import { initializeAnalytics } from '../../lib/firebase-config';

/**
 * Interface for CookieConsent component props
 */
interface CookieConsentProps {
  /**
   * Position of the banner
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom' | 'top';

  /**
   * Size of the banner
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Cookie Consent Banner Component
 *
 * Displays a cookie consent banner that allows users to accept cookies.
 * Since these cookies are required for the app to work, declining doesn't do anything yet.
 *
 * @param {CookieConsentProps} props - Component props
 * @returns {JSX.Element | null} The cookie consent banner or null if already accepted
 */
export const CookieConsent: React.FC<CookieConsentProps> = ({
  position = 'bottom-right',
  size = 'small',
}) => {
  // State to track if user has already given consent
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  // State to control visibility of the banner
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Check for existing consent on mount
  // Ref to track if analytics have already been initialized
  const analyticsInitializedRef = React.useRef<boolean>(false);
  // Ref to hold the fallback timer
  const analyticsFallbackTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Effect: Check for existing consent and show banner if needed
  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent');
    const hasStoredConsent = storedConsent === 'accepted';
    setHasConsent(hasStoredConsent);

    if (!hasStoredConsent) {
      // Show the banner after a short delay (1s)
      const bannerTimer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => {
        clearTimeout(bannerTimer);
      };
    } else {
      // Initialize analytics with stored consent immediately
      initializeAnalytics(hasStoredConsent);
      analyticsInitializedRef.current = true;
    }
  }, []);

  /**
   * Effect: Fallback to initialize analytics after 8 seconds if user has not responded
   * Only runs if consent is not set and analytics have not been initialized
   */
  useEffect(() => {
    if (hasConsent === false || hasConsent === true) return; // Only run if consent is not yet set
    if (analyticsInitializedRef.current) return;

    analyticsFallbackTimerRef.current = setTimeout(() => {
      if (!analyticsInitializedRef.current) {
        /**
         * Initialize analytics after 8 seconds if user has not responded.
         * This is a fallback for analytics initialization when the user does not interact.
         */
        initializeAnalytics(false);
        analyticsInitializedRef.current = true;
      }
    }, 8000);

    return () => {
      if (analyticsFallbackTimerRef.current) {
        clearTimeout(analyticsFallbackTimerRef.current);
      }
    };
  }, [hasConsent]);

  // Handle accepting cookies
  const handleAccept = (): void => {
    localStorage.setItem('cookie-consent', 'accepted');
    setHasConsent(true);
    setIsVisible(false);
    // Clear the fallback timer if it exists
    if (analyticsFallbackTimerRef.current) {
      clearTimeout(analyticsFallbackTimerRef.current);
    }
    // Initialize analytics with consent (only once)
    if (!analyticsInitializedRef.current) {
      initializeAnalytics(true);
      analyticsInitializedRef.current = true;
    }
  };

  // Handle declining cookies (currently just hides the banner)
  const handleDecline = (): void => {
    localStorage.setItem('cookie-consent', 'declined');
    setHasConsent(false);
    setIsVisible(false);
    // Clear the fallback timer if it exists
    if (analyticsFallbackTimerRef.current) {
      clearTimeout(analyticsFallbackTimerRef.current);
    }
    // Initialize analytics with no consent (only once)
    if (!analyticsInitializedRef.current) {
      initializeAnalytics(false);
      analyticsInitializedRef.current = true;
    }
  };

  // Don't render if user has already given consent or banner is not visible
  if (hasConsent !== null && !isVisible) {
    return null;
  }

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    bottom: 'bottom-0 left-0 right-0',
    top: 'top-0 left-0 right-0',
  };

  // Size classes
  const sizeClasses = {
    small: 'max-w-sm p-4',
    medium: 'max-w-md p-5',
    large: 'max-w-lg p-6',
  };

  // Combined classes
  const containerClasses = `fixed z-50 ${positionClasses[position]} ${
    position === 'bottom' || position === 'top' ? 'mx-auto' : ''
  } transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`;

  const bannerClasses = `${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col`;

  return (
    <div className={containerClasses}>
      <div className={bannerClasses}>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Cookie Consent</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            We use cookies to enhance your experience and analyze site usage.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleDecline}
            className="text-xs py-1 px-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="text-xs py-1 px-3 bg-blue-200 text-black rounded-md hover:bg-blue-300 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
