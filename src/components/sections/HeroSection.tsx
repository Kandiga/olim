'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CanvasSequence from '@/components/canvas/CanvasSequence';
import { ANIMATION_MILESTONES, CONTENT } from '@/lib/constants';

interface HeroSectionProps {
  containerRef: React.RefObject<HTMLDivElement>;
  pinnedRef: React.RefObject<HTMLDivElement>;
  images: HTMLImageElement[];
  progress: number;
  totalFrames: number;
  isLoaded: boolean;
}

export default function HeroSection({
  containerRef,
  pinnedRef,
  images,
  progress,
  totalFrames,
  isLoaded,
}: HeroSectionProps) {
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  // Hide scroll arrow after scrolling begins
  useEffect(() => {
    if (progress > 0.02) {
      setShowScrollArrow(false);
    }
  }, [progress]);

  // Calculate headline visibility (appears at 30% scroll)
  const headlineOpacity = progress >= ANIMATION_MILESTONES.headlineAppear
    ? Math.min(1, (progress - ANIMATION_MILESTONES.headlineAppear) / 0.1)
    : 0;

  const headlineScale = progress >= ANIMATION_MILESTONES.headlineAppear
    ? 0.95 + Math.min(0.05, (progress - ANIMATION_MILESTONES.headlineAppear) / 2)
    : 0.95;

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] bg-white"
      aria-label="Hero animation section"
    >
      {/* Pinned wrapper - this stays fixed while scrolling through the section */}
      <div
        ref={pinnedRef}
        className="w-full h-screen bg-white overflow-hidden"
      >
        {/* Max-width container for ultra-wide screens */}
        <div className="relative w-full h-full max-w-[1600px] mx-auto">
          {/* Canvas background */}
          {isLoaded && (
            <CanvasSequence
              images={images}
              progress={progress}
              totalFrames={totalFrames}
            />
          )}

          {/* Headline overlay - dark text for white background */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            style={{
              opacity: headlineOpacity,
            }}
          >
            <div
              className="w-full max-w-4xl px-6 text-center"
              style={{
                transform: `scale(${headlineScale})`,
              }}
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-midnight-blue leading-tight drop-shadow-sm">
                {CONTENT.headline}
              </h1>
              <p
                className="mt-6 font-sans text-base md:text-lg text-midnight-blue/70 max-w-2xl mx-auto"
                style={{
                  opacity: Math.max(0, headlineOpacity - 0.3) / 0.7,
                }}
              >
                {CONTENT.supporting}
              </p>
            </div>
          </div>

          {/* Scroll arrow indicator */}
          <AnimatePresence>
            {showScrollArrow && isLoaded && (
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="scroll-arrow flex flex-col items-center text-midnight-blue/50">
                  <span className="text-sm font-sans mb-2">Scroll to explore</span>
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
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
