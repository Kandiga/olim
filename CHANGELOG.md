# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Value Proposition Section**: New scroll-revealed section after HeroJourney animation
  - Glassmorphism feature cards with 2x2 grid (1 column on mobile)
  - Tilt hover effect on desktop using Framer Motion springs
  - Staggered scroll reveal animations
  - Features: Group Movement, Premium Housing, Family Support, Expert Logistics

- **Final CTA Section**: Dark gradient section with dual call-to-action buttons
  - Primary: "Join the March Conference in New Jersey"
  - Secondary: "Register for the Upcoming Webinar"
  - Responsive layout with full-width stacked buttons on mobile

- **Animation Completion Flow**: Page scrolling re-enabled after HeroJourney completes
  - 1.5 second delay after "Welcome Home" appears for visibility
  - Smooth transition to scrollable content below

### Changed
- `HeroJourney.tsx`: Added `onAnimationComplete` callback prop
- `page.tsx`: Dynamic scroll control based on animation state
- `constants.ts`: Added VALUE_PROPOSITION and FINAL_CTA content objects
- `globals.css`: Added feature-card glassmorphism and section gradient styles

### New Files
- `src/components/ui/FeatureCard.tsx`: Glassmorphism card with tilt effect
- `src/components/sections/ValueProposition.tsx`: Feature grid section
- `src/components/sections/FinalCTA.tsx`: Bottom CTA section
