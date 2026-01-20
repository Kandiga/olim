import { lerp } from '@/hooks/useScrollProgress';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private images: HTMLImageElement[] = [];
  private currentFrame: number = 0;
  private targetFrame: number = 0;
  private animationId: number | null = null;
  private isAnimating: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;

    // Create offscreen canvas for double-buffering
    this.offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = this.offscreenCanvas.getContext('2d');
    if (!offscreenCtx) throw new Error('Could not get offscreen 2D context');
    this.offscreenCtx = offscreenCtx;

    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private resize = (): void => {
    const dpr = window.devicePixelRatio || 1;
    const parent = this.canvas.parentElement;
    const width = parent?.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || window.innerHeight;

    // Set display size
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Set actual size with device pixel ratio
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    // Set offscreen canvas size
    this.offscreenCanvas.width = width * dpr;
    this.offscreenCanvas.height = height * dpr;

    // Reset and scale context for retina displays
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.offscreenCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.offscreenCtx.scale(dpr, dpr);

    // Redraw current frame after resize
    if (this.images.length > 0) {
      this.drawFrame(Math.floor(this.currentFrame));
    }
  };

  setImages(images: HTMLImageElement[]): void {
    this.images = images;
    if (images.length > 0) {
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
    // Lerp towards target frame for smooth animation
    this.currentFrame = lerp(this.currentFrame, this.targetFrame, 0.15);

    // Draw the interpolated frame
    this.drawFrame(Math.round(this.currentFrame));

    // Continue animation if not at target
    if (Math.abs(this.currentFrame - this.targetFrame) > 0.1) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.currentFrame = this.targetFrame;
      this.drawFrame(Math.floor(this.currentFrame));
      this.stopAnimation();
    }
  };

  private drawFrame(frameIndex: number): void {
    if (frameIndex < 0 || frameIndex >= this.images.length) return;

    const img = this.images[frameIndex];
    if (!img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = this.canvas.width / dpr;
    const canvasHeight = this.canvas.height / dpr;

    // Calculate CONTAIN-fit dimensions (proportional, no stretching)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image (ultra-wide screen) - fit to height
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Canvas is taller than image - fit to width
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    // Draw to offscreen canvas first (double-buffering)
    // Fill with white background for seamless "infinite" effect
    this.offscreenCtx.fillStyle = '#FFFFFF';
    this.offscreenCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    this.offscreenCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Copy to visible canvas
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.drawImage(
      this.offscreenCanvas,
      0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height,
      0, 0, canvasWidth, canvasHeight
    );
  }

  getCurrentFrame(): number {
    return Math.floor(this.currentFrame);
  }

  destroy(): void {
    this.stopAnimation();
    window.removeEventListener('resize', this.resize);
  }
}
