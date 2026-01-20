'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { CanvasRenderer, getFrameIndex, CANVAS_CONFIG } from '@/hooks/useCanvasSequence';

interface HeroJourneyProps {
  images: HTMLImageElement[];
  isReady: boolean;
  isMobile?: boolean;
}

/**
 * NARRATIVE TIMELINE (Scroll Progress 0-1):
 *
 * Phase 1 (0.00 - 0.15): INTRO TEXT
 *   - "Home Is Not a Place. It Is Belonging." on clean white
 *   - Canvas hidden (opacity 0)
 *
 * Phase 2 (0.15 - 0.25): TRANSITION
 *   - Intro text fades OUT
 *   - Canvas fades IN
 *
 * Phase 3 (0.25 - 0.85): THE SCRUB
 *   - User scrubs through 240 frames (USA → Plane → Carmiel)
 *   - Canvas fully visible
 *
 * Phase 4 (0.85 - 1.00): FINALE
 *   - Canvas fades OUT
 *   - "Welcome Home. Join the March Conference." fades IN
 */

const PHASES = {
  introStart: 0,
  introEnd: 0.15,
  transitionEnd: 0.25,
  scrubEnd: 0.85,
  finaleStart: 0.88,
};

const LERP_FADE = 0.05; // Airy fade factor

export default function HeroJourney({ images, isReady, isMobile = false }: HeroJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);

  // Initialize canvas renderer with cover mode on mobile
  useEffect(() => {
    if (!canvasRef.current) return;

    const initTimer = setTimeout(() => {
      if (!rendererRef.current && canvasRef.current) {
        // Use cover mode on mobile for fullscreen effect
        rendererRef.current = new CanvasRenderer(canvasRef.current, isMobile);
        setCanvasReady(true);
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (rendererRef.current) {
        rendererRef.current.destroy();
        rendererRef.current = null;
      }
    };
  }, [isMobile]);

  // Update images when ready
  useEffect(() => {
    if (canvasReady && rendererRef.current && images.length > 0 && images[0]) {
      rendererRef.current.setImages(images);
    }
  }, [images, canvasReady]);

  // Setup ScrollTrigger
  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      pin: stickyRef.current,
      pinSpacing: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);

        // Update canvas frames during scrub phase (0.25 - 0.85)
        if (rendererRef.current && self.progress >= PHASES.transitionEnd && self.progress <= PHASES.scrubEnd) {
          const scrubProgress = (self.progress - PHASES.transitionEnd) / (PHASES.scrubEnd - PHASES.transitionEnd);
          const frameIndex = getFrameIndex(scrubProgress, CANVAS_CONFIG.totalFrames);
          rendererRef.current.setTargetFrame(frameIndex);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [images.length]);

  // Calculate opacities based on scroll progress
  const getIntroOpacity = () => {
    if (scrollProgress <= PHASES.introEnd) return 1;
    if (scrollProgress >= PHASES.transitionEnd) return 0;
    // Fade out during transition
    return 1 - (scrollProgress - PHASES.introEnd) / (PHASES.transitionEnd - PHASES.introEnd);
  };

  const getCanvasOpacity = () => {
    if (scrollProgress < PHASES.introEnd) return 0;
    if (scrollProgress >= PHASES.transitionEnd && scrollProgress <= PHASES.scrubEnd) return 1;
    if (scrollProgress < PHASES.transitionEnd) {
      // Fade in during transition
      return (scrollProgress - PHASES.introEnd) / (PHASES.transitionEnd - PHASES.introEnd);
    }
    if (scrollProgress > PHASES.scrubEnd) {
      // Fade out after scrub
      return Math.max(0, 1 - (scrollProgress - PHASES.scrubEnd) / (PHASES.finaleStart - PHASES.scrubEnd));
    }
    return 0;
  };

  const getFinaleOpacity = () => {
    if (scrollProgress < PHASES.finaleStart) return 0;
    return Math.min(1, (scrollProgress - PHASES.finaleStart) / (1 - PHASES.finaleStart));
  };

  const introOpacity = getIntroOpacity();
  const canvasOpacity = getCanvasOpacity();
  const finaleOpacity = getFinaleOpacity();

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: '600vh', backgroundColor: '#F8F6F3' }}
      aria-label="Hero journey"
    >
      {/* Sticky container */}
      <div
        ref={stickyRef}
        className="w-full h-screen overflow-hidden"
        style={{ backgroundColor: '#F8F6F3' }}
      >
        {/* Canvas layer - z-index 10 */}
        <div
          className="absolute inset-0 z-10"
          style={{ opacity: canvasOpacity, backgroundColor: '#F8F6F3' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            aria-hidden="true"
          />
        </div>

        {/* PHASE 1: Intro Text - z-index 20 */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ opacity: introOpacity }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-4xl px-6">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-midnight-blue leading-tight">
              Home Is Not a Place.
            </h1>
            <p className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-midnight-blue/80">
              It Is Belonging.
            </p>
          </div>
        </motion.div>

        {/* PHASE 4: Finale Text - z-index 20 */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ opacity: finaleOpacity }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-4xl px-6">
            <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-midnight-blue leading-tight">
              Welcome Home.
            </h2>
            <a
              href="#signup"
              className="inline-block mt-10 px-12 py-5 border-2 border-soft-gold text-midnight-blue
                         font-serif text-xl tracking-wide bg-soft-gold/10
                         hover:bg-soft-gold/20 transition-all duration-300
                         hover:shadow-lg hover:shadow-soft-gold/20"
            >
              Join the March Conference
            </a>
          </div>
        </motion.div>

        {/* Scroll Progress Indicator - Bottom, delicate and subtle */}
        <div className={`absolute z-30 ${isMobile ? 'bottom-6 left-6 right-6' : 'bottom-8 left-1/2 -translate-x-1/2 w-32'}`}>
          {/* Background track - thin and subtle */}
          <div className={`${isMobile ? 'h-[2px]' : 'h-[3px]'} w-full bg-midnight-blue/10 rounded-full overflow-hidden backdrop-blur-sm`}>
            {/* Progress bar - soft gold, semi-transparent */}
            <motion.div
              className="h-full bg-gradient-to-r from-soft-gold/60 to-soft-gold/80 rounded-full origin-left"
              style={{
                width: `${scrollProgress * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Scroll hint - only at start */}
        {scrollProgress < 0.05 && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col items-center text-midnight-blue/40">
              <span className="text-sm font-sans mb-2 tracking-widest uppercase">Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
