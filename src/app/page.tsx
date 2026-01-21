'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Preloader from '@/components/preloader/Preloader';
import SignupModal from '@/components/forms/SignupModal';
import CookieConsent from '@/components/consent/CookieConsent';
import StaticFallback from '@/components/sections/StaticFallback';
import SignupForm from '@/components/forms/SignupForm';
import ValueProposition from '@/components/sections/ValueProposition';
import FinalCTA from '@/components/sections/FinalCTA';

// Dynamically import heavy components to avoid SSR issues
const HeroJourney = dynamic(() => import('@/components/sections/HeroJourney'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Ensure client-side hydration first
  useEffect(() => {
    setIsClient(true);

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Detect mobile device - check screen width and touch capability
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isSmallScreen || (isTouchDevice && isMobileUA));
    };

    checkMobile();

    // Listen for resize to handle orientation changes
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Control page scrolling based on animation state
  useEffect(() => {
    if (!isClient) return;

    if (animationComplete) {
      // Re-enable scrolling after animation completes
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    } else {
      // Disable scrolling during animation
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      // Restore scrolling on unmount
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isClient, animationComplete]);

  // Only load images after client is ready and mobile detection is complete
  useEffect(() => {
    if (!isClient || prefersReducedMotion) return;

    let isMounted = true;
    // Mobile has 120 frames, desktop has 240 frames
    const TOTAL_FRAMES = isMobile ? 120 : 240;
    // Load fewer priority frames on mobile for faster initial load
    const PRIORITY_FRAMES = isMobile ? 30 : 50;
    const BATCH_SIZE = isMobile ? 5 : 10;
    // Use mobile or desktop frames based on device detection
    const FRAME_PATH = isMobile ? '/assets/sequence/mobile' : '/assets/sequence/desktop';
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    console.log(`Loading ${isMobile ? 'MOBILE' : 'DESKTOP'} frames from ${FRAME_PATH}`);
    let loadedCount = 0;
    let processedPriorityCount = 0;

    const loadImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = String(index + 1).padStart(3, '0');
        img.src = `${FRAME_PATH}/frame-${frameNum}.jpg`;

        img.onload = () => {
          if (!isMounted) return resolve(img);
          loadedCount++;
          loadedImages[index] = img;
          const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(progress);

          if (index < PRIORITY_FRAMES) {
            processedPriorityCount++;
            if (processedPriorityCount === PRIORITY_FRAMES) {
              setIsReady(true);
              setImages([...loadedImages]);
            }
          }
          resolve(img);
        };

        img.onerror = () => {
          if (!isMounted) return resolve(img);
          console.error(`Failed to load frame ${frameNum}`);
          if (index < PRIORITY_FRAMES) {
            processedPriorityCount++;
            const progress = Math.round((processedPriorityCount / TOTAL_FRAMES) * 100);
            setLoadProgress(Math.max(progress, 1));
            if (processedPriorityCount === PRIORITY_FRAMES) {
              setIsReady(true);
              setImages([...loadedImages]);
            }
          }
          resolve(img);
        };
      });
    };

    const loadAllImages = async () => {
      try {
        // Priority loading
        const priorityPromises: Promise<HTMLImageElement>[] = [];
        for (let i = 0; i < PRIORITY_FRAMES; i++) {
          priorityPromises.push(loadImage(i));
        }
        await Promise.all(priorityPromises);
        if (!isMounted) return;

        // Batch load remaining
        for (let i = PRIORITY_FRAMES; i < TOTAL_FRAMES; i += BATCH_SIZE) {
          const batchPromises: Promise<HTMLImageElement>[] = [];
          const endIndex = Math.min(i + BATCH_SIZE, TOTAL_FRAMES);
          for (let j = i; j < endIndex; j++) {
            batchPromises.push(loadImage(j));
          }
          await Promise.all(batchPromises);
          if (!isMounted) return;
          setImages([...loadedImages]);
        }

        if (isMounted) {
          setImages([...loadedImages]);
        }
      } catch (err) {
        console.error('Error loading images:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load images');
        }
      }
    };

    loadAllImages();
    return () => { isMounted = false; };
  }, [isClient, prefersReducedMotion, isMobile]);

  // Handle preloader completion
  const handlePreloaderComplete = () => {
    console.log('Preloader complete!');
    setPreloaderComplete(true);
  };

  // Fallback: Force preloaderComplete after 12 seconds no matter what
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!preloaderComplete) {
        console.log('Fallback: Forcing preloader complete');
        setPreloaderComplete(true);
      }
    }, 12000);

    return () => clearTimeout(fallbackTimer);
  }, [preloaderComplete]);

  // Modal controls
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle animation completion
  const handleAnimationComplete = () => {
    console.log('Animation complete - enabling scrolling');
    setAnimationComplete(true);
  };

  // Show loading state during SSR/hydration
  if (!isClient) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-midnight-blue font-serif text-4xl">Loading...</div>
      </main>
    );
  }

  // Show static fallback for reduced motion preference
  if (prefersReducedMotion) {
    return (
      <main className="bg-white h-screen overflow-hidden">
        <StaticFallback reason="reduced-motion" />
        <SignupModal isOpen={isModalOpen} onClose={closeModal} />
        <CookieConsent />
      </main>
    );
  }

  // Show static fallback on error
  if (error) {
    return (
      <main className="bg-white h-screen overflow-hidden">
        <StaticFallback reason="error" />
        <div id="signup">
          <SignupForm />
        </div>
        <CookieConsent />
      </main>
    );
  }

  return (
    <main className={`bg-white ${animationComplete ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>
      {/* Sophisticated Preloader */}
      {!preloaderComplete && (
        <Preloader
          progress={loadProgress}
          isReady={isReady}
          onComplete={handlePreloaderComplete}
        />
      )}

      {/* Hero Journey with canvas animation - auto-plays */}
      <HeroJourney
        images={images}
        isReady={preloaderComplete}
        isMobile={isMobile}
        onCtaClick={openModal}
        onAnimationComplete={handleAnimationComplete}
      />

      {/* Scrollable sections after animation completes */}
      {animationComplete && (
        <>
          <ValueProposition onCtaClick={openModal} />
          <FinalCTA onCtaClick={openModal} />
        </>
      )}

      {/* Signup Modal */}
      <SignupModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Cookie consent banner */}
      <CookieConsent />
    </main>
  );
}
