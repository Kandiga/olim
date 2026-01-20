'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const FEATURES = [
  {
    title: 'Community First',
    description: 'Join a network of families who understand your journey. Build relationships that last a lifetime.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Expert Guidance',
    description: 'Navigate bureaucracy with confidence. Our team has helped hundreds of families make the transition.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Real Integration',
    description: 'More than just paperwork. We help you find schools, jobs, and a place to call home.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
];

const STATS = [
  { number: '500+', label: 'Families Guided' },
  { number: '15', label: 'Years Experience' },
  { number: '98%', label: 'Success Rate' },
];

export default function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-24 md:py-32 overflow-hidden"
      aria-labelledby="about-title"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-soft-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-midnight-blue rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="about-title"
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-midnight-blue leading-tight mb-6"
          >
            About the Program
          </h2>
          <p className="font-sans text-lg md:text-xl text-midnight-blue/70 leading-relaxed">
            A guided journey for families ready to make Israel their home.
            We provide the support, knowledge, and community you need to thrive.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-20">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-soft-gold/10 text-soft-gold mb-6">
                {feature.icon}
              </div>
              <h3 className="font-serif text-2xl text-midnight-blue mb-4">
                {feature.title}
              </h3>
              <p className="font-sans text-midnight-blue/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          className="flex flex-wrap justify-center gap-12 md:gap-20 pt-12 border-t border-midnight-blue/10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-4xl md:text-5xl text-soft-gold mb-2">
                {stat.number}
              </div>
              <div className="font-sans text-sm text-midnight-blue/60 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
