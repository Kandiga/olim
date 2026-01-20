'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CONTENT } from '@/lib/constants';

export default function ThankYouPage() {
  // Prevent going back to form (optional)
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 preloader-gradient">
      <motion.div
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Success icon */}
        <motion.div
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-soft-gold/10 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <svg
            className="w-10 h-10 text-soft-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </svg>
        </motion.div>

        {/* Title */}
        <h1 className="font-serif text-5xl md:text-6xl text-midnight-blue mb-4">
          {CONTENT.thankYou.title}
        </h1>

        {/* Message */}
        <p className="text-midnight-blue/70 text-lg md:text-xl mb-8">
          {CONTENT.thankYou.message}
        </p>

        {/* Back to home link */}
        <Link
          href="/"
          className="inline-block border-2 border-soft-gold text-midnight-blue bg-soft-gold/10 hover:bg-soft-gold/20 px-8 py-4 font-serif text-lg tracking-wide transition-all duration-300"
        >
          Return Home
        </Link>
      </motion.div>
    </main>
  );
}
