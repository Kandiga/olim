'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CanvasRenderer, getFrameIndex, CANVAS_CONFIG } from '@/hooks/useCanvasSequence';

interface HeroJourneyProps {
  images: HTMLImageElement[];
  isReady: boolean;
  isMobile?: boolean;
  onCtaClick?: () => void;
}

/**
 * AUTO-PLAY ANIMATION TIMELINE (7 seconds total):
 *
 * Phase 1 (0.00 - 0.12): INTRO TEXT - 0.84 seconds
 *   - "Home Is Not a Place. It Is Belonging." on clean white
 *   - Canvas hidden (opacity 0)
 *
 * Phase 2 (0.12 - 0.20): TRANSITION IN - 0.56 seconds
 *   - Intro text fades OUT
 *   - Canvas fades IN
 *
 * Phase 3 (0.20 - 0.80): THE SCRUB - 4.2 seconds
 *   - Auto-play through 240 frames (USA → Plane → Carmiel)
 *   - Canvas fully visible
 *
 * Phase 4 (0.80 - 1.00): CROSSFADE FINALE - 1.4 seconds
 *   - Canvas fades OUT smoothly
 *   - "Welcome Home" fades IN simultaneously (crossfade)
 */

const PHASES = {
  introStart: 0,
  introEnd: 0.12,
  transitionEnd: 0.20,
  scrubEnd: 0.80,
  finaleStart: 0.80, // Start finale at same time as scrub ends for crossfade
};

const ANIMATION_DURATION = 7000; // 7 seconds in milliseconds

export default function HeroJourney({ images, isReady, isMobile = false, onCtaClick }: HeroJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

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

  // Auto-play animation loop
  const animate = useCallback((currentTime: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

    setAnimationProgress(progress);

    // Update canvas frames during scrub phase (20-80%)
    if (rendererRef.current && progress >= PHASES.transitionEnd && progress <= PHASES.scrubEnd) {
      const scrubProgress = (progress - PHASES.transitionEnd) / (PHASES.scrubEnd - PHASES.transitionEnd);
      const frameIndex = getFrameIndex(scrubProgress, CANVAS_CONFIG.totalFrames);
      rendererRef.current.setTargetFrame(frameIndex);
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete - ensure we show the last frame
      if (rendererRef.current) {
        rendererRef.current.setTargetFrame(CANVAS_CONFIG.totalFrames - 1);
      }
    }
  }, []);

  // Start animation when ready
  useEffect(() => {
    if (!isReady || !canvasReady || animationStarted) return;

    // Small delay to ensure everything is rendered
    const startDelay = setTimeout(() => {
      setAnimationStarted(true);
      animationRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(startDelay);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReady, canvasReady, animationStarted, animate]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Calculate opacities based on animation progress
  const getIntroOpacity = () => {
    if (animationProgress <= PHASES.introEnd) return 1;
    if (animationProgress >= PHASES.transitionEnd) return 0;
    // Smooth fade out during transition
    const progress = (animationProgress - PHASES.introEnd) / (PHASES.transitionEnd - PHASES.introEnd);
    return 1 - easeInOutCubic(progress);
  };

  const getCanvasOpacity = () => {
    if (animationProgress < PHASES.introEnd) return 0;
    if (animationProgress >= PHASES.transitionEnd && animationProgress <= PHASES.scrubEnd) return 1;
    if (animationProgress < PHASES.transitionEnd) {
      // Smooth fade in during transition
      const progress = (animationProgress - PHASES.introEnd) / (PHASES.transitionEnd - PHASES.introEnd);
      return easeInOutCubic(progress);
    }
    if (animationProgress > PHASES.scrubEnd) {
      // Smooth crossfade out - takes 20% of animation (0.80 to 1.00)
      const fadeOutDuration = 1 - PHASES.scrubEnd;
      const progress = (animationProgress - PHASES.scrubEnd) / fadeOutDuration;
      return 1 - easeInOutCubic(Math.min(1, progress));
    }
    return 0;
  };

  const getFinaleOpacity = () => {
    if (animationProgress < PHASES.finaleStart) return 0;
    // Smooth crossfade in - synchronized with canvas fade out
    const fadeInDuration = 1 - PHASES.finaleStart;
    const progress = (animationProgress - PHASES.finaleStart) / fadeInDuration;
    return easeInOutCubic(Math.min(1, progress));
  };

  // Easing function for smooth transitions
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  const introOpacity = getIntroOpacity();
  const canvasOpacity = getCanvasOpacity();
  const finaleOpacity = getFinaleOpacity();

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#F8F6F3' }}
      aria-label="Hero journey"
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

      {/* PHASE 4: Finale Text with CTA - z-index 20 */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center"
        style={{ opacity: finaleOpacity }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center max-w-4xl px-6">
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-midnight-blue leading-tight">
            Welcome Home.
          </h2>
          <button
            onClick={onCtaClick}
            className="inline-block mt-10 px-12 py-5 border-2 border-soft-gold text-midnight-blue
                       font-serif text-xl tracking-wide bg-soft-gold/10
                       hover:bg-soft-gold/20 transition-all duration-300
                       hover:shadow-lg hover:shadow-soft-gold/20 cursor-pointer"
          >
            Join the March Conference
          </button>
        </div>
      </motion.div>

      {/* Progress indicator - subtle bar at bottom */}
      <div className={`absolute z-30 ${isMobile ? 'bottom-6 left-6 right-6' : 'bottom-8 left-1/2 -translate-x-1/2 w-32'}`}>
        {/* Background track - thin and subtle */}
        <div className={`${isMobile ? 'h-[2px]' : 'h-[3px]'} w-full bg-midnight-blue/10 rounded-full overflow-hidden backdrop-blur-sm`}>
          {/* Progress bar - soft gold, semi-transparent */}
          <motion.div
            className="h-full bg-gradient-to-r from-soft-gold/60 to-soft-gold/80 rounded-full origin-left"
            style={{
              width: `${animationProgress * 100}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
