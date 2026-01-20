'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface UseScrollProgressOptions {
  start?: string;
  end?: string;
  scrub?: number | boolean;
  pin?: boolean;
  pinSpacing?: boolean;
}

interface UseScrollProgressReturn {
  progress: number;
  containerRef: React.RefObject<HTMLDivElement>;
  pinnedRef: React.RefObject<HTMLDivElement>;
}

export function useScrollProgress(options: UseScrollProgressOptions = {}): UseScrollProgressReturn {
  const {
    start = 'top top',
    end = 'bottom bottom',
    scrub = 0.5,
    pin = false,
    pinSpacing = true,
  } = options;
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start,
      end,
      scrub,
      pin: pin ? pinnedRef.current : false,
      pinSpacing,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [start, end, scrub, pin, pinSpacing]);

  return { progress, containerRef, pinnedRef };
}

// Utility function to get current frame based on progress
export function getFrameIndex(progress: number, totalFrames: number): number {
  const frameIndex = Math.floor(progress * (totalFrames - 1));
  return Math.max(0, Math.min(frameIndex, totalFrames - 1));
}

// Linear interpolation helper
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}
