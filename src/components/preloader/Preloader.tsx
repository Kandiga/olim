'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  progress: number;
  isReady: boolean;
  onComplete: () => void;
}

export default function Preloader({ progress, isReady, onComplete }: PreloaderProps) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [forceReady, setForceReady] = useState(false);

  // Track if onComplete has been called to prevent duplicate calls
  const hasCalledComplete = useRef(false);

  // Wrapper to ensure onComplete is only called once
  const triggerComplete = useCallback(() => {
    if (!hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onComplete();
    }
  }, [onComplete]);

  // Minimum display time for elegant reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Maximum wait timeout - force completion after 10 seconds even if images fail
  // This prevents infinite loading on Netlify if images 404
  useEffect(() => {
    const maxWaitTimer = setTimeout(() => {
      if (!isReady) {
        console.warn('Preloader timeout reached - forcing ready state');
        setForceReady(true);
      }
    }, 10000);

    return () => clearTimeout(maxWaitTimer);
  }, [isReady]);

  // Trigger exit when ready (or force ready) and minimum time elapsed
  useEffect(() => {
    const effectiveReady = isReady || forceReady;
    if (effectiveReady && minTimeElapsed) {
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isReady, forceReady, minTimeElapsed]);

  // Backup timeout: ensure onComplete fires even if AnimatePresence fails
  // Fires 1 second after exit starts (200ms delay + 600ms animation + 200ms buffer)
  useEffect(() => {
    if (!showPreloader) {
      const backupTimer = setTimeout(() => {
        triggerComplete();
      }, 1000);

      return () => clearTimeout(backupTimer);
    }
  }, [showPreloader, triggerComplete]);

  // Prevent scroll while loading
  useEffect(() => {
    if (showPreloader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showPreloader]);

  return (
    <AnimatePresence onExitComplete={triggerComplete}>
      {showPreloader && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="text-center">
            {/* Elegant loading indicator */}
            <motion.div
              className="relative w-24 h-24 mx-auto mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Outer ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#0A0F1E"
                  strokeWidth="1"
                  opacity="0.1"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#C9A227"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    strokeDasharray: '283',
                    strokeDashoffset: '0',
                  }}
                />
              </svg>

              {/* Progress number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="font-serif text-2xl text-midnight-blue tabular-nums"
                  key={progress}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {progress}
                </motion.span>
              </div>
            </motion.div>

            {/* Loading text */}
            <motion.p
              className="font-sans text-sm text-midnight-blue/50 tracking-widest uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {(isReady || forceReady) ? 'Ready' : 'Loading experience'}
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="mt-6 w-48 h-px bg-midnight-blue/10 mx-auto overflow-hidden"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <motion.div
                className="h-full bg-soft-gold origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
