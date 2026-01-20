'use client';

import { useRef, useEffect, useCallback } from 'react';
import { CanvasRenderer } from './CanvasRenderer';
import { getFrameIndex } from '@/hooks/useScrollProgress';

interface CanvasSequenceProps {
  images: HTMLImageElement[];
  progress: number;
  totalFrames: number;
}

export default function CanvasSequence({ images, progress, totalFrames }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  // Initialize renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    rendererRef.current = new CanvasRenderer(canvasRef.current);

    return () => {
      if (rendererRef.current) {
        rendererRef.current.destroy();
        rendererRef.current = null;
      }
    };
  }, []);

  // Update images when loaded
  useEffect(() => {
    if (rendererRef.current && images.length > 0) {
      rendererRef.current.setImages(images);
    }
  }, [images]);

  // Update frame on scroll progress change
  useEffect(() => {
    if (rendererRef.current && images.length > 0) {
      const frameIndex = getFrameIndex(progress, totalFrames);
      rendererRef.current.setTargetFrame(frameIndex);
    }
  }, [progress, totalFrames, images.length]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
