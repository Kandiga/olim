# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-01-20

### Fixed
- **Canvas Letterboxing**: Resolved black bars by ensuring canvas clears with `#FFFFFF` before every frame
- **Text Alignment**: All narrative text now properly centered with `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`
- **Canvas Sizing**: Fixed initial render issue using ResizeObserver and requestAnimationFrame initialization

### Added
- **Purple Scroll Indicator**: Minimalist vertical progress indicator on the right side
  - Gray track with purple (`#A855F7`) progress bar
  - Height maps to scroll progress
- **4-Phase Narrative Timeline**:
  - Phase 1 (0-15%): "Home Is Not a Place. It Is Belonging." on clean white
  - Phase 2 (15-25%): Crossfade text → canvas
  - Phase 3 (25-85%): Frame sequence scrub (USA → Plane → Carmiel)
  - Phase 4 (85-100%): "Welcome Home" + CTA button

### Changed
- **CanvasRenderer**: Complete rewrite with `fillWhite()` before every draw
- **Lerp Factor**: Reduced to 0.05 for smoother, airier transitions
- **Scroll Height**: Increased to 600vh for deeper scroll experience
- **Z-Index Layers**: Canvas (10), Text (20), Indicators (30)

---

## [0.1.1] - 2026-01-20

### Fixed
- Fixed aspect ratio distortion and centered canvas for ultra-wide displays
- Changed canvas scaling from "cover" (stretch/crop) to "contain" (proportional fit)
- Canvas now maintains 16:9 aspect ratio on all screen sizes
- Added white background fill for seamless "infinite" effect on ultra-wide monitors
- ScrollTrigger now properly pins the canvas section during scroll
- Added `scrub: 0.5` for smoother, Apple-like scroll inertia

### Changed
- Hero section reduced from `500vh` to `300vh` for better scroll pacing
- Canvas container now limited to `max-w-[1600px]` on ultra-wide screens
- Canvas centers horizontally with generous white space on sides
- Text overlays now use dark colors (`text-midnight-blue`) for white background
- Body background changed from black to white for seamless canvas integration

### Technical
- CanvasRenderer now sizes based on parent container instead of window
- Added `pin` and `pinnedRef` to `useScrollProgress` hook
- Reset canvas context transform before scaling to prevent accumulation
- Removed fixed positioning from canvas in favor of absolute within pinned container

## [0.1.0] - 2026-01-20

### Added
- Initial MVP release
- 240-frame scroll-driven canvas animation
- Priority image loading with progress tracking
- Double-buffered canvas rendering at 60fps
- Preloader with percentage display
- Headline overlay appearing at 30% scroll
- Signup form with Netlify Forms integration
- Cookie consent banner with localStorage persistence
- Thank you page redirect
- Privacy policy page
- Reduced motion accessibility fallback
- Mobile optimization (120 frames at 960x540)
- WebP image conversion script
- Netlify deployment configuration
