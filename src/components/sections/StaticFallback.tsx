'use client';

import { CONTENT } from '@/lib/constants';

interface StaticFallbackProps {
  reason?: 'reduced-motion' | 'error' | 'unsupported';
}

export default function StaticFallback({ reason = 'reduced-motion' }: StaticFallbackProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 preloader-gradient">
      <div className="text-center max-w-3xl">
        {/* Show different message based on reason */}
        {reason === 'error' && (
          <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700">
              We encountered an issue loading the animation. Please refresh or try a different browser.
            </p>
          </div>
        )}

        {reason === 'unsupported' && (
          <div className="mb-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-yellow-700">
              Your browser may not fully support this experience. For the best experience, please use a modern browser.
            </p>
          </div>
        )}

        {/* Static content */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-midnight-blue leading-tight mb-6">
          {CONTENT.headline}
        </h1>
        <p className="text-midnight-blue/70 text-lg md:text-xl max-w-2xl mx-auto">
          {CONTENT.supporting}
        </p>

        {/* Scroll prompt or CTA */}
        <div className="mt-10">
          <a
            href="#signup"
            className="border-2 border-soft-gold text-midnight-blue bg-soft-gold/10 hover:bg-soft-gold/20 px-8 py-4 font-serif text-lg tracking-wide transition-all duration-300 ease-out inline-block"
          >
            {CONTENT.ctaButton}
          </a>
        </div>
      </div>
    </section>
  );
}
