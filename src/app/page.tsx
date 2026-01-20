'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Preloader from '@/components/preloader/Preloader';
import SignupForm from '@/components/forms/SignupForm';
import CookieConsent from '@/components/consent/CookieConsent';
import StaticFallback from '@/components/sections/StaticFallback';
import AboutSection from '@/components/sections/AboutSection';

// Dynamically import heavy components to avoid SSR issues
const HeroJourney = dynamic(() => import('@/components/sections/HeroJourney'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure client-side hydration first
  useEffect(() => {
    setIsClient(true);

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  // Only load images after client is ready
  useEffect(() => {
    if (!isClient || prefersReducedMotion) return;

    let isMounted = true;
    const TOTAL_FRAMES = 240;
    const PRIORITY_FRAMES = 50;
    const BATCH_SIZE = 10;
    const FRAME_PATH = '/assets/sequence/desktop';
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
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
  }, [isClient, prefersReducedMotion]);

  // Handle preloader completion
  const handlePreloaderComplete = () => {
    setPreloaderComplete(true);
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
      <main className="bg-white">
        <StaticFallback reason="reduced-motion" />
        <AboutSection />
        <div id="signup">
          <SignupForm />
        </div>
        <CookieConsent />
      </main>
    );
  }

  // Show static fallback on error
  if (error) {
    return (
      <main className="bg-white">
        <StaticFallback reason="error" />
        <AboutSection />
        <div id="signup">
          <SignupForm />
        </div>
        <CookieConsent />
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* Sophisticated Preloader */}
      {!preloaderComplete && (
        <Preloader
          progress={loadProgress}
          isReady={isReady}
          onComplete={handlePreloaderComplete}
        />
      )}

      {/* Hero Journey with canvas animation */}
      <HeroJourney
        images={images}
        isReady={isReady && preloaderComplete}
      />

      {/* About the Program Section */}
      <AboutSection />

      {/* Signup form section */}
      <div id="signup">
        <SignupForm />
      </div>

      {/* Cookie consent banner */}
      <CookieConsent />
    </main>
  );
}
