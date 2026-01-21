'use client';

import { motion } from 'framer-motion';
import { FINAL_CTA } from '@/lib/constants';

interface FinalCTAProps {
  onConferenceClick?: () => void;
  onWebinarClick?: () => void;
}

export default function FinalCTA({ onConferenceClick, onWebinarClick }: FinalCTAProps) {
  return (
    <section className="final-cta-section py-20 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <motion.h2
          className="font-serif text-3xl md:text-5xl lg:text-6xl text-warm-sand leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {FINAL_CTA.headline}
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-warm-sand/70 mb-12 md:mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {FINAL_CTA.subheadline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Primary CTA */}
          <div className="flex flex-col items-center">
            <button
              onClick={onConferenceClick}
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-soft-gold text-midnight-blue
                         font-serif text-lg tracking-wide
                         hover:bg-soft-gold/90 transition-all duration-300
                         hover:shadow-lg hover:shadow-soft-gold/30 cursor-pointer"
            >
              {FINAL_CTA.primaryCta}
            </button>
            <span className="mt-2 text-sm text-warm-sand/60">
              {FINAL_CTA.primarySubtext}
            </span>
          </div>

          {/* Secondary CTA */}
          <div className="flex flex-col items-center">
            <button
              onClick={onWebinarClick}
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 border-2 border-soft-gold text-soft-gold
                         font-serif text-lg tracking-wide bg-transparent
                         hover:bg-soft-gold/10 transition-all duration-300
                         hover:shadow-lg hover:shadow-soft-gold/20 cursor-pointer"
            >
              {FINAL_CTA.secondaryCta}
            </button>
            <span className="mt-2 text-sm text-warm-sand/60">
              {FINAL_CTA.secondarySubtext}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
