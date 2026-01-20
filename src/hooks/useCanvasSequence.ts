'use client';

import { useState, useEffect, useRef } from 'react';

// Configuration
const TOTAL_FRAMES = 240;
const PRIORITY_FRAMES = 50;
const BATCH_SIZE = 10;
const FRAME_PATH = '/assets/sequence/desktop';
const LERP_FACTOR = 0.05; // Smooth, airy transitions

interface UseCanvasSequenceReturn {
  images: HTMLImageElement[];
  loadProgress: number;
  isReady: boolean;
  isFullyLoaded: boolean;
  error: string | null;
}

export function useCanvasSequence(): UseCanvasSequenceReturn {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

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

          if (loadedCount === PRIORITY_FRAMES) {
            setIsReady(true);
            setImages([...loadedImages]);
          }

          resolve(img);
        };

        img.onerror = () => {
          console.error(`Failed to load frame ${frameNum}`);
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
          setIsFullyLoaded(true);
        }
      } catch (err) {
        console.error('Error loading images:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load images');
        }
      }
    };

    loadAllImages();

    return () => {
      isMounted = false;
    };
  }, []);

  return { images, loadProgress, isReady, isFullyLoaded, error };
}

/**
 * Premium Canvas Renderer
 * - No black bars: Always fills with white
 * - Contain & Center: Maintains 16:9 aspect ratio
 * - Smooth lerp transitions
 */
export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private images: HTMLImageElement[] = [];
  private currentFrame: number = 0;
  private targetFrame: number = 0;
  private animationId: number | null = null;
  private isAnimating: boolean = false;
  private resizeObserver: ResizeObserver | null = null;
  private width: number = 0;
  private height: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Get context with alpha disabled for better performance
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;

    // Disable image smoothing for crisp frames
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Setup resize observer
    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => this.resize());
    });

    // Observe both canvas and window
    this.resizeObserver.observe(document.body);
    window.addEventListener('resize', this.handleResize);

    // Initial setup
    requestAnimationFrame(() => {
      this.resize();
      this.fillWhite();
    });
  }

  private handleResize = (): void => {
    requestAnimationFrame(() => this.resize());
  };

  private resize(): void {
    const dpr = window.devicePixelRatio || 1;

    // Use window dimensions for full viewport coverage
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Set display size
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Set internal resolution
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);

    // Scale for retina
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    // Always fill white first
    this.fillWhite();

    // Redraw current frame
    if (this.images.length > 0 && this.images[Math.floor(this.currentFrame)]) {
      this.drawFrame(Math.floor(this.currentFrame));
    }
  }

  private fillWhite(): void {
    // Warm off-white matching the video background for seamless blend
    this.ctx.fillStyle = '#F8F6F3';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  setImages(images: HTMLImageElement[]): void {
    this.images = images;
    if (images.length > 0 && images[0]) {
      this.resize();
      this.drawFrame(0);
    }
  }

  setTargetFrame(frame: number): void {
    this.targetFrame = Math.max(0, Math.min(frame, this.images.length - 1));

    if (!this.isAnimating) {
      this.startAnimation();
    }
  }

  private startAnimation(): void {
    this.isAnimating = true;
    this.animate();
  }

  private stopAnimation(): void {
    this.isAnimating = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = (): void => {
    // Smooth lerp transition
    this.currentFrame = this.lerp(this.currentFrame, this.targetFrame, LERP_FACTOR);

    this.drawFrame(Math.round(this.currentFrame));

    if (Math.abs(this.currentFrame - this.targetFrame) > 0.01) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.currentFrame = this.targetFrame;
      this.drawFrame(Math.floor(this.currentFrame));
      this.stopAnimation();
    }
  };

  private lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  private drawFrame(frameIndex: number): void {
    if (frameIndex < 0 || frameIndex >= this.images.length) {
      this.fillWhite();
      return;
    }

    const img = this.images[frameIndex];
    if (!img || !img.complete || !img.naturalWidth) {
      this.fillWhite();
      return;
    }

    // ALWAYS fill white first to prevent ANY black bars
    this.fillWhite();

    // CROP out the black letterbox bars from source image
    // Minimal crop to preserve "USA" text at top
    const cropPercent = 0.04; // 4% crop from top and bottom
    const srcX = 0;
    const srcY = Math.floor(img.naturalHeight * cropPercent);
    const srcWidth = img.naturalWidth;
    const srcHeight = Math.floor(img.naturalHeight * (1 - cropPercent * 2));

    // Calculate the actual content aspect ratio (after cropping)
    const contentRatio = srcWidth / srcHeight;
    const canvasRatio = this.width / this.height;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasRatio > contentRatio) {
      // Canvas is wider - fit to height, center horizontally
      drawHeight = this.height;
      drawWidth = this.height * contentRatio;
      offsetX = (this.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Canvas is taller - fit to width, center vertically
      drawWidth = this.width;
      drawHeight = this.width / contentRatio;
      offsetX = 0;
      offsetY = (this.height - drawHeight) / 2;
    }

    // Draw the cropped frame (excluding black bars)
    this.ctx.drawImage(
      img,
      srcX, srcY, srcWidth, srcHeight,  // Source rectangle (cropped)
      offsetX, offsetY, drawWidth, drawHeight  // Destination rectangle
    );
  }

  getCurrentFrame(): number {
    return Math.floor(this.currentFrame);
  }

  destroy(): void {
    this.stopAnimation();
    window.removeEventListener('resize', this.handleResize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}

export function getFrameIndex(progress: number, totalFrames: number = TOTAL_FRAMES): number {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const frameIndex = Math.floor(clampedProgress * (totalFrames - 1));
  return Math.max(0, Math.min(frameIndex, totalFrames - 1));
}

export const CANVAS_CONFIG = {
  totalFrames: TOTAL_FRAMES,
  priorityFrames: PRIORITY_FRAMES,
  lerpFactor: LERP_FACTOR,
};
