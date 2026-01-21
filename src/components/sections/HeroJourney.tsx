'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CanvasRenderer, getFrameIndex } from '@/hooks/useCanvasSequence';

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
  finaleStart: 0.80,
};

const ANIMATION_DURATION = 7000; // 7 seconds in milliseconds

export default function HeroJourney({ images, isReady, isMobile = false, onCtaClick }: HeroJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>(images);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Keep imagesRef in sync with latest images
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Initialize canvas renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    const initTimer = setTimeout(() => {
      if (!rendererRef.current && canvasRef.current) {
        rendererRef.current = new CanvasRenderer(canvasRef.current, isMobile);
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

  // Update images when available
  useEffect(() => {
    if (rendererRef.current && images.length > 0 && images[0]) {
      rendererRef.current.setImages(images);
    }
  }, [images]);

  // START ANIMATION IMMEDIATELY when isReady becomes true
  useEffect(() => {
    if (!isReady) return;

    console.log('HeroJourney: Starting animation!');

    let startTime: number | null = null;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      setAnimationProgress(progress);

      // Update canvas frames during scrub phase (20-80%)
      // Use imagesRef to get latest images, supporting mobile (120) and desktop (240) frame counts
      const totalFrames = imagesRef.current.length || 240;
      if (rendererRef.current && progress >= PHASES.transitionEnd && progress <= PHASES.scrubEnd) {
        const scrubProgress = (progress - PHASES.transitionEnd) / (PHASES.scrubEnd - PHASES.transitionEnd);
        const frameIndex = getFrameIndex(scrubProgress, totalFrames);
        rendererRef.current.setTargetFrame(frameIndex);
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Animation complete - ensure we show the last frame
        if (rendererRef.current) {
          rendererRef.current.setTargetFrame(totalFrames - 1);
        }
      }
    };

    // Start after a tiny delay
    const startDelay = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 50);

    return () => {
      clearTimeout(startDelay);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isReady]);

  // Easing function for smooth transitions
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Calculate opacities based on animation progress
  const getIntroOpacity = () => {
    if (animationProgress <= PHASES.introEnd) return 1;
    if (animationProgress >= PHASES.transitionEnd) return 0;
    const progress = (animationProgress - PHASES.introEnd) / (PHASES.transitionEnd - PHASES.introEnd);
    return 1 - easeInOutCubic(progress);
  };

  const getCanvasOpacity = () => {
    if (animationProgress < PHASES.introEnd) return 0;
    if (animationProgress >= PHASES.transitionEnd && animationProgress <= PHASES.scrubEnd) return 1;
    if (animationProgress < PHASES.transitionEnd) {
      const progress = (animationProgress - PHASES.introEnd) / (PHASES.transitionEnd - PHASES.introEnd);
      return easeInOutCubic(progress);
    }
    if (animationProgress > PHASES.scrubEnd) {
      const fadeOutDuration = 1 - PHASES.scrubEnd;
      const progress = (animationProgress - PHASES.scrubEnd) / fadeOutDuration;
      return 1 - easeInOutCubic(Math.min(1, progress));
    }
    return 0;
  };

  const getFinaleOpacity = () => {
    if (animationProgress < PHASES.finaleStart) return 0;
    const fadeInDuration = 1 - PHASES.finaleStart;
    const progress = (animationProgress - PHASES.finaleStart) / fadeInDuration;
    return easeInOutCubic(Math.min(1, progress));
  };

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
        <div className={`${isMobile ? 'h-[2px]' : 'h-[3px]'} w-full bg-midnight-blue/10 rounded-full overflow-hidden backdrop-blur-sm`}>
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
