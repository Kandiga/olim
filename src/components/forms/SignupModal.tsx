'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignupForm from './SignupForm';
import { MODAL_CONTENT, ModalSource } from '@/lib/constants';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  ctaSource?: ModalSource;
}

export default function SignupModal({ isOpen, onClose, ctaSource = 'hero' }: SignupModalProps) {
  const content = MODAL_CONTENT[ctaSource];
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-midnight-blue/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="relative z-10 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center
                         text-warm-sand/60 hover:text-warm-sand transition-colors duration-200
                         rounded-full hover:bg-white/10"
              aria-label="Close modal"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* SignupForm - inherits its own styling */}
            <SignupForm
              source={ctaSource}
              title={content.title}
              subtitle={content.subtitle}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
