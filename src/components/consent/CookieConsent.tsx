'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_CONSENT_KEY = 'olim-together-cookie-consent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already responded to cookie consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay before showing banner
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          className="cookie-bar"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-warm-sand/80 text-sm text-center sm:text-left">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
              <a
                href="/privacy-policy"
                className="text-soft-gold hover:underline"
              >
                Learn more
              </a>
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm text-warm-sand/60 hover:text-warm-sand transition-colors"
              >
                Reject
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2 text-sm bg-soft-gold text-midnight-blue rounded-md font-medium hover:bg-soft-gold/90 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
