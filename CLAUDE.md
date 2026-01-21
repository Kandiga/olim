# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Olim Together is a premium landing page for a guided Aliyah program helping North American Jewish families relocate to Israel. The site features a scroll-driven canvas animation showing a journey from USA to Carmiel, Israel.

## Commands

```bash
npm run dev          # Start development server at localhost:3000
npm run build        # Production build (outputs to /out for static hosting)
npm run lint         # Run ESLint
npm run convert-images  # Batch convert images to WebP (uses Sharp)
```

## Tech Stack

- **Framework**: Next.js 14 (App Router) with static export (`output: 'export'`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Animation**: GSAP + ScrollTrigger for scroll-based animation, Framer Motion for UI
- **Rendering**: HTML5 Canvas for 240-frame sequence animation
- **Hosting**: Netlify static site (forms handled by Netlify Forms)

## Architecture

### Core Animation Flow

The main experience is a 4-phase scroll-driven animation in `HeroJourney.tsx`:

1. **Phase 1 (0-12% scroll)**: Intro text on white background, canvas hidden
2. **Phase 2 (12-20% scroll)**: Text fades out, canvas fades in
3. **Phase 3 (20-80% scroll)**: User scrubs through 240 frames (USA → Plane → Carmiel)
4. **Phase 4 (80-100% scroll)**: Canvas fades out, "Welcome Home" crossfades in

### Key Files

- `src/app/page.tsx` - Main page orchestrating preloader, image loading, and component rendering
- `src/components/sections/HeroJourney.tsx` - Core scroll animation with GSAP ScrollTrigger
- `src/hooks/useCanvasSequence.ts` - CanvasRenderer class handling contain/cover modes and LERP interpolation
- `src/lib/constants.ts` - Design tokens, frame config, animation milestones, content copy

### Image Loading Strategy

- Desktop: 240 frames at 1920x1080 from `/public/assets/sequence/desktop/`
- Mobile: 120 frames at 960x540 from `/public/assets/sequence/mobile/`
- Priority loading: First 50 (desktop) or 30 (mobile) frames load before page becomes interactive
- Remaining frames load in batches in background

### Canvas Rendering Modes

- **Desktop**: "contain" mode - fits all content, centers horizontally
- **Mobile**: "cover" mode - fills screen, may crop edges
- LERP factor: 0.05 for smooth frame transitions

### Forms

SignupForm uses Netlify Forms with `form-name="signup"` attribute. Redirects to `/thank-you` on success.

## Design System

Tailwind extended colors (in `tailwind.config.ts`):
- `midnight-blue`: #0A0F1E (primary text/background)
- `warm-sand`: #F5F2ED (secondary backgrounds)
- `soft-gold`: #C9A227 (CTAs, accents)

Fonts: Playfair Display (headlines), Inter (body)

## Important Patterns

- All interactive components use `'use client'` directive
- HeroJourney is dynamically imported with `ssr: false` to avoid hydration issues
- Respects `prefers-reduced-motion` - shows StaticFallback component instead of animation
- Mobile detection uses combination of touch capability, screen width, and user agent
