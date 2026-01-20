'use client';

import { useState, useEffect } from 'react';
import { useCanvasSequence } from '@/hooks/useCanvasSequence';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Preloader from '@/components/preloader/Preloader';
import HeroJourney from '@/components/sections/HeroJourney';
import SignupForm from '@/components/forms/SignupForm';
import CookieConsent from '@/components/consent/CookieConsent';
import StaticFallback from '@/components/sections/StaticFallback';
import AboutSection from '@/components/sections/AboutSection';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  // Load images with new hook
  const { images, loadProgress, isReady, error } = useCanvasSequence();

  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

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
