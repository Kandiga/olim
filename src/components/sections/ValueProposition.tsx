'use client';

import { motion } from 'framer-motion';
import FeatureCard from '@/components/ui/FeatureCard';
import { VALUE_PROPOSITION } from '@/lib/constants';

interface ValuePropositionProps {
  onCtaClick?: () => void;
}

export default function ValueProposition({ onCtaClick }: ValuePropositionProps) {
  return (
    <section className="value-prop-gradient py-20 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section headline */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-midnight-blue leading-tight">
            {VALUE_PROPOSITION.headline}
          </h2>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {VALUE_PROPOSITION.features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon as 'users' | 'home' | 'heart' | 'compass'}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        {/* CTA button */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={onCtaClick}
            className="inline-block px-10 py-4 border-2 border-soft-gold text-midnight-blue
                       font-serif text-lg tracking-wide bg-soft-gold/10
                       hover:bg-soft-gold/20 transition-all duration-300
                       hover:shadow-lg hover:shadow-soft-gold/20 cursor-pointer"
          >
            {VALUE_PROPOSITION.ctaText}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
