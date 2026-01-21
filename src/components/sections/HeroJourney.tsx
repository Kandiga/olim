'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CanvasRenderer, getFrameIndex } from '@/hooks/useCanvasSequence';

interface HeroJourneyProps {
  images: HTMLImageElement[];
  isReady: boolean;
  isMobile?: boolean;
  onCtaClick?: () => void;
  onAnimationComplete?: () => void;
}

const PHASES = {
  introStart: 0,
  introEnd: 0.12,
  transitionEnd: 0.20,
  scrubEnd: 0.80,
  finaleStart: 0.80,
};

const ANIMATION_DURATION = 7000; // 7 seconds

export default function HeroJourney({ images, isReady, isMobile = false, onCtaClick, onAnimationComplete }: HeroJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>(images);
  const animationStartedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const animationCompleteCalledRef = useRef(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Keep imagesRef in sync
  useEffect(() => {
    imagesRef.current = images;
    // Update renderer with new images
    if (rendererRef.current && images.length > 0 && images[0]) {
      rendererRef.current.setImages(images);
    }
  }, [images]);

  // Initialize canvas renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    const initTimer = setTimeout(() => {
      if (!rendererRef.current && canvasRef.current) {
        rendererRef.current = new CanvasRenderer(canvasRef.current, isMobile);
        if (imagesRef.current.length > 0 && imagesRef.current[0]) {
          rendererRef.current.setImages(imagesRef.current);
        }
      }
    }, 50);

    return () => {
      clearTimeout(initTimer);
      if (rendererRef.current) {
        rendererRef.current.destroy();
        rendererRef.current = null;
      }
    };
  }, [isMobile]);

  // Animation loop - runs continuously once started
  useEffect(() => {
    let animationId: number;

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      setAnimationProgress(progress);

      // Update canvas frames during scrub phase (20-80%)
      const totalFrames = imagesRef.current.length || 240;
      if (rendererRef.current && progress >= PHASES.transitionEnd && progress <= PHASES.scrubEnd) {
        const scrubProgress = (progress - PHASES.transitionEnd) / (PHASES.scrubEnd - PHASES.transitionEnd);
        const frameIndex = getFrameIndex(scrubProgress, totalFrames);
        rendererRef.current.setTargetFrame(frameIndex);
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else if (rendererRef.current) {
        rendererRef.current.setTargetFrame(totalFrames - 1);
      }
    };

    const startAnimation = () => {
      if (animationStartedRef.current) return;
      animationStartedRef.current = true;
      console.log('HeroJourney: Animation starting NOW');
      animationId = requestAnimationFrame(animate);
    };

    // Start animation when isReady OR after 3 seconds max (failsafe)
    if (isReady && !animationStartedRef.current) {
      startAnimation();
    }

    // Failsafe: Start animation after 3 seconds no matter what
    const failsafeTimer = setTimeout(() => {
      if (!animationStartedRef.current) {
        console.log('HeroJourney: Failsafe triggered - starting animation');
        startAnimation();
      }
    }, 3000);

    return () => {
      clearTimeout(failsafeTimer);
      // Don't cancel animation on cleanup - let it run
    };
  }, [isReady]);

  // Trigger onAnimationComplete callback with delay for "Welcome Home" visibility
  useEffect(() => {
    if (animationProgress >= 1 && !animationCompleteCalledRef.current && onAnimationComplete) {
      animationCompleteCalledRef.current = true;
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 1500); // 1.5s delay for Welcome Home visibility
      return () => clearTimeout(timer);
    }
  }, [animationProgress, onAnimationComplete]);

  // Easing function
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Calculate opacities
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

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#F8F6F3' }}
      aria-label="Hero journey"
    >
      {/* Canvas layer */}
      <div
        className="absolute inset-0 z-10"
        style={{ opacity: getCanvasOpacity(), backgroundColor: '#F8F6F3' }}
      >
        <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
      </div>

      {/* Intro Text */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center"
        style={{ opacity: getIntroOpacity() }}
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

      {/* Finale Text with CTA */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center"
        style={{ opacity: getFinaleOpacity() }}
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

      {/* Progress indicator */}
      <div className={`absolute z-30 ${isMobile ? 'bottom-6 left-6 right-6' : 'bottom-8 left-1/2 -translate-x-1/2 w-32'}`}>
        <div className={`${isMobile ? 'h-[2px]' : 'h-[3px]'} w-full bg-midnight-blue/10 rounded-full overflow-hidden backdrop-blur-sm`}>
          <motion.div
            className="h-full bg-gradient-to-r from-soft-gold/60 to-soft-gold/80 rounded-full origin-left"
            style={{ width: `${animationProgress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
