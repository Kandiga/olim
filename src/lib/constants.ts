// Design System Constants
export const COLORS = {
  midnightBlue: '#0A0F1E',
  warmSand: '#F5F2ED',
  softGold: '#C9A227',
  canvasBg: '#FFFFFF',
} as const;

// Frame sequence configuration
export const FRAME_CONFIG = {
  desktop: {
    totalFrames: 240,
    width: 1920,
    height: 1080,
    path: '/assets/sequence/desktop',
  },
  mobile: {
    totalFrames: 120,
    width: 960,
    height: 540,
    path: '/assets/sequence/mobile',
  },
} as const;

// Animation milestones (scroll progress 0-1)
export const ANIMATION_MILESTONES = {
  usaMap: { start: 0, end: 0.245 },           // Frames 1-59
  lightEmerges: { start: 0.245, end: 0.495 }, // Frames 60-119
  particleTransition: { start: 0.495, end: 0.745 }, // Frames 120-179
  carmielReveal: { start: 0.745, end: 1 },    // Frames 180-240
  headlineAppear: 0.3, // 30% scroll
} as const;

// Preloader configuration
export const PRELOADER_CONFIG = {
  priorityFrames: 10,
  batchSize: 20,
  minLoadTime: 500, // minimum ms to show preloader
} as const;

// Content copy
export const CONTENT = {
  headline: 'Home Is Not a Place. Home Is Where You Are Safe to Be Who You Are.',
  supporting: 'Join thousands of families building their tomorrow in Israel. Your journey home starts with a single step.',
  ctaButton: 'Get Started',
  thankYou: {
    title: 'Welcome Home',
    message: "We'll be in touch soon...",
  },
} as const;

// Form options
export const INTEREST_OPTIONS = [
  { value: 'schools', label: 'Schools & Education' },
  { value: 'community', label: 'Community & Social' },
  { value: 'career', label: 'Career & Employment' },
  { value: 'safety', label: 'Safety & Security' },
] as const;

// Breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;
