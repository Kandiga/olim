# Olim Together - Product Requirements Document (PRD)

**Version:** 1.0
**Last Updated:** January 2026
**Status:** MVP Specification

---

## Executive Summary

**Product:** Premium landing page for "Olim Together" - a guided Aliyah program helping North American Jewish families relocate to Israel.

**Core Experience:** A scroll-driven HTML5 Canvas animation showing the emotional journey from scattered homes across the USA to a unified community in Carmiel, Israel. Concludes with a signup form for an upcoming NJ conference.

**Target Audience:** North American Jewish families at various stages of considering Aliyah - from fearful/anxious about current events, to curious explorers, to those ready to act.

**Primary Goal:** Capture leads (email, name, interest area) for the NJ Conference while delivering an emotionally resonant, premium experience.

---

## Tech Stack

| Category | Technology | Rationale |
|----------|------------|-----------|
| Framework | Next.js 14+ (App Router) | Server components, optimal performance |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS | Utility-first, rapid development |
| Animation | GSAP + ScrollTrigger | Industry-standard scroll animation |
| UI Motion | Framer Motion | React-native animations for UI elements |
| Rendering | HTML5 Canvas | 60fps frame-by-frame scroll scrubbing |
| Forms | Netlify Forms | Built-in to hosting, no backend needed |
| Hosting | Netlify | Edge CDN, serverless functions |

---

## Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Midnight Blue | `#0A0F1E` | Primary background, text |
| Warm Sand | `#F5F2ED` | Secondary background, light text |
| Soft Gold | `#C9A227` | Accents, CTAs, highlights |
| Pure Black | `#000000` | Canvas background |
| White | `#FFFFFF` | Primary text on dark |

### Typography
| Role | Font | Weight | Size (Desktop) |
|------|------|--------|----------------|
| Headlines | Playfair Display | 600 | 48-56px |
| Body | Inter | 400/500 | 16-18px |
| Preloader | Playfair Display | 400 | 64px+ |
| Form Labels | Inter | 500 | 14px |

### Spacing Scale
- Base unit: 4px
- Section padding: 64px (desktop), 32px (mobile)
- Form field gap: 16px
- Button padding: 16px 32px

---

## Feature Specifications

---

### FEATURE 1: Initial Loading Experience

**Description:** Gradient background and preloader that displays while 240 image frames are being loaded.

#### 1.1 Initial Background
- **Gradient:** Top-to-bottom, Midnight Blue (#0A0F1E) to Pure Black (#000000)
- **Behavior:** Visible immediately on page load, before any JS executes
- **Implementation:** CSS in `globals.css`, applied to `<body>` or root container

#### 1.2 Preloader Component
- **Visual:** Large percentage number only (no "Loading..." text)
- **Font:** Playfair Display, 64px+, white color
- **Position:** Center-center of viewport
- **Progress:** 0-100%, updates as images load
- **Animation:** Numbers should transition smoothly (counter animation)
- **Exit:** Fade out over 500ms when loading complete
- **Scroll Lock:** Prevent scrolling until preloader exits

#### 1.3 Image Loading Strategy
- **Priority:** Load frames 1-10 first (immediate interaction)
- **Batching:** Load remaining frames in batches of 20
- **Progress Tracking:** `(loadedCount / totalFrames) * 100`
- **Error Handling:** If loading fails, show static fallback image

**Acceptance Criteria:**
- [ ] Gradient visible within 100ms of page load
- [ ] Percentage updates smoothly without jumps
- [ ] Preloader fades out when `progress === 100`
- [ ] User cannot scroll during loading
- [ ] Total load time under 5 seconds on 4G connection

---

### FEATURE 2: Canvas Animation Engine

**Description:** High-performance HTML5 Canvas that renders 240 frames based on scroll position.

#### 2.1 Frame Sequence
- **Source:** Existing 240 JPEG frames in `/Parallax Video SCROLL/`
- **Conversion:** Convert to WebP format
  - Desktop: All 240 frames, original resolution
  - Mobile: Every 2nd frame (120 total), 960x540
- **Storage:** `/public/assets/sequence/desktop/` and `/mobile/`

#### 2.2 Canvas Renderer
- **Double Buffering:** Two canvas elements (active + offscreen) to prevent tearing
- **Frame Budget:** 16.7ms maximum per frame (60fps target)
- **Resize Handling:** Recalculate dimensions on window resize (debounced 100ms)
- **Image Scaling:** "Cover" behavior - fill viewport, crop excess
- **DPR Handling:** Scale canvas for device pixel ratio

#### 2.3 Scroll Mapping
- **Scroll Container:** Hero section with `height: 500vh` (5x viewport)
- **Progress Calculation:** `scrollProgress = scrollY / (containerHeight - viewportHeight)`
- **Frame Mapping:** `frameIndex = Math.floor(progress * (totalFrames - 1))`
- **Smoothing:** Lerp interpolation with factor 0.15 for buttery motion

#### 2.4 GSAP Integration
- **Plugin:** ScrollTrigger
- **Trigger:** Hero section element
- **Start:** "top top"
- **End:** "bottom bottom"
- **Scrub:** 0.5 (slight lag for smoothness)

**Acceptance Criteria:**
- [ ] Canvas renders at consistent 60fps during scroll
- [ ] No visible tearing or flicker during rapid scroll
- [ ] Frame transition is smooth, not jumpy
- [ ] Canvas fills viewport on all screen sizes
- [ ] Memory usage stays stable (no leaks)

---

### FEATURE 3: Scroll Arrow Indicator

**Description:** Animated arrow at bottom of viewport prompting user to scroll.

#### 3.1 Visual Design
- **Icon:** Downward chevron/arrow
- **Color:** Soft Gold (#C9A227) with 80% opacity
- **Size:** 24px
- **Position:** Center-bottom of viewport, 32px from bottom edge

#### 3.2 Animation
- **Idle:** Gentle bounce animation (translateY 0 to 8px), 1.5s duration, infinite
- **Easing:** ease-in-out

#### 3.3 Behavior
- **Visibility:** Visible only when scroll progress = 0%
- **Fade Out:** Immediately when user starts scrolling (opacity 0 over 300ms)
- **Never Returns:** Once hidden, stays hidden

**Acceptance Criteria:**
- [ ] Arrow bounces continuously on page load
- [ ] Arrow fades out instantly when scroll begins
- [ ] Arrow does not reappear if user scrolls back to top
- [ ] Animation is smooth, not janky

---

### FEATURE 4: Headline Overlay

**Description:** Main headline text that fades in during scroll animation.

#### 4.1 Content
```
"Home Is Not a Place.
Home Is Where You Are Safe
to Be Who You Are."
```

#### 4.2 Typography
- **Font:** Playfair Display
- **Weight:** 600
- **Size:** 48-56px desktop, 32-40px mobile (scale down, don't reflow)
- **Color:** White (#FFFFFF)
- **Alignment:** Center
- **Line Height:** 1.3

#### 4.3 Position
- **Placement:** Center-center of viewport
- **Z-Index:** Above canvas, below form (when form appears)

#### 4.4 Animation
- **Trigger Point:** 30% scroll progress (~frame 72)
- **Fade In:** Opacity 0 to 1 over scroll range 30-40%
- **Scale Effect:** Scale from 0.95 to 1.0 simultaneously
- **Fade Out:** Opacity 1 to 0 over scroll range 85-95%
- **Easing:** ease-out for fade in, ease-in for fade out

**Acceptance Criteria:**
- [ ] Headline invisible at 0% scroll
- [ ] Headline fully visible at 40% scroll
- [ ] Headline begins fading at 85% scroll
- [ ] Headline invisible at 95% scroll
- [ ] Scale effect is subtle but noticeable
- [ ] Text is readable on all frame backgrounds

---

### FEATURE 5: Form Section

**Description:** Lead capture form that appears after scroll animation completes.

#### 5.1 Section Layout
- **Trigger:** Appears when scroll reaches 100%
- **Position:** Full section below the sticky canvas
- **Background:** Gradient continuation or midnight blue
- **Height:** Auto (content-based) + padding

#### 5.2 Form Container
- **Style:** Semi-transparent card with frosted glass effect
- **Background:** `rgba(10, 15, 30, 0.8)` with `backdrop-filter: blur(20px)`
- **Border:** 1px solid `rgba(201, 162, 39, 0.3)` (subtle gold)
- **Border Radius:** 16px
- **Padding:** 48px desktop, 32px mobile
- **Max Width:** 480px
- **Position:** Centered horizontally

#### 5.3 Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| First Name | text | Yes | Min 2 characters |
| Last Name | text | Yes | Min 2 characters |
| Email | email | Yes | Basic format regex |
| Interest | select | Yes | One selection required |

**Interest Options (dropdown):**
1. Schools for kids
2. Community life
3. Career transition
4. Safety

#### 5.4 Form Labels
- **Style:** Labels above each field (not floating, not placeholder-only)
- **Font:** Inter, 500 weight, 14px
- **Color:** Warm Sand (#F5F2ED)
- **Margin Bottom:** 8px

#### 5.5 Input Styling
- **Background:** `rgba(255, 255, 255, 0.1)`
- **Border:** 1px solid `rgba(255, 255, 255, 0.2)`
- **Border Radius:** 8px
- **Padding:** 14px 16px
- **Font:** Inter, 400, 16px
- **Color:** White
- **Focus State:** Border color changes to Soft Gold

#### 5.6 Submit Button
- **Text:** "Get Started"
- **Style:** Outlined - transparent background, 2px Soft Gold border, Soft Gold text
- **Padding:** 16px 48px
- **Border Radius:** 8px
- **Font:** Inter, 600 weight, 16px

#### 5.7 Button Interactions
- **Hover:** Scale to 1.02, subtle gold glow (`box-shadow: 0 0 20px rgba(201, 162, 39, 0.3)`)
- **Active:** Scale to 0.98
- **Disabled:** 50% opacity during submission
- **Transition:** 200ms ease-out

#### 5.8 Validation
- **Timing:** On submit only (not real-time, not on blur)
- **Error Display:** Red text below each invalid field
- **Error Color:** `#EF4444`
- **Error Message Examples:**
  - "Please enter your first name"
  - "Please enter a valid email address"
  - "Please select an area of interest"

#### 5.9 Netlify Forms Integration
```html
<form
  name="conference-signup"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
>
  <input type="hidden" name="form-name" value="conference-signup" />
  <input type="hidden" name="bot-field" />
  <!-- visible fields -->
</form>
```

#### 5.10 Submission Flow
1. User clicks "Get Started"
2. Button shows loading state (spinner or "Submitting...")
3. Validate all fields
4. If invalid: show errors, re-enable button
5. If valid: submit to Netlify
6. On success: **Instant redirect** to `/thank-you`
7. On error: Show generic error message, allow retry

**Acceptance Criteria:**
- [ ] Form only visible after 100% scroll
- [ ] All 4 fields render correctly
- [ ] Dropdown shows all 4 interest options
- [ ] Labels are above fields, not inside
- [ ] Validation fires only on submit
- [ ] Invalid fields show error messages
- [ ] Valid submission redirects to /thank-you
- [ ] Honeypot field is hidden from users
- [ ] Form submission appears in Netlify dashboard

---

### FEATURE 6: Thank You Page

**Description:** Simple confirmation page shown after successful form submission.

#### 6.1 Route
- **URL:** `/thank-you`

#### 6.2 Content
- **Headline:** "Welcome Home"
- **Subtext:** "We'll be in touch soon with details about the upcoming event."
- **Additional:** Link to return to homepage (optional)

#### 6.3 Styling
- **Background:** Midnight Blue to Black gradient (same as main page)
- **Text:** Centered, white, same typography as main page
- **Animation:** Subtle fade-in on page load

#### 6.4 Behavior
- **Direct Access:** Page should work if accessed directly (not just via redirect)
- **Meta:** noindex (don't index thank you page in search)

**Acceptance Criteria:**
- [ ] Page loads after form submission
- [ ] Content displays correctly
- [ ] Page has noindex meta tag
- [ ] Styling matches main page aesthetic

---

### FEATURE 7: Cookie Consent Banner

**Description:** GDPR/CCPA compliant cookie consent banner.

#### 7.1 Visual Design
- **Style:** Minimal bottom bar
- **Position:** Fixed to bottom of viewport
- **Height:** Auto (content-based), approximately 60-80px
- **Background:** Midnight Blue with slight transparency
- **Z-Index:** Above all other content

#### 7.2 Content
- **Text:** "We use cookies to improve your experience." (or similar)
- **Privacy Link:** "Privacy Policy" - links to `/privacy`
- **Buttons:** "Accept" and "Decline"

#### 7.3 Button Styling
- **Accept:** Solid Soft Gold background, dark text
- **Decline:** Text only or subtle outline

#### 7.4 Behavior
- **First Visit:** Banner appears after preloader completes
- **Accept:** Store `cookie_consent: accepted` in localStorage, hide banner
- **Decline:** Store `cookie_consent: declined` in localStorage, hide banner
- **Return Visit:** If consent stored, don't show banner
- **Animation:** Slide up from bottom (300ms)

#### 7.5 Privacy Policy Page
- **URL:** `/privacy`
- **Content:** Basic privacy policy (needs to be created)
- **Sections:** Data collected, how it's used, user rights, contact info

**Acceptance Criteria:**
- [ ] Banner appears on first visit
- [ ] Banner does not appear if consent already stored
- [ ] Accept/Decline buttons work correctly
- [ ] Consent persists across sessions (localStorage)
- [ ] Privacy policy link works
- [ ] Banner doesn't block scroll or content interaction

---

### FEATURE 8: Responsive Behavior

**Description:** Consistent experience across desktop and mobile devices.

#### 8.1 Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1023px
- **Desktop:** >= 1024px
- **Minimum Supported:** 360px width

#### 8.2 Mobile Adaptations
| Element | Desktop | Mobile |
|---------|---------|--------|
| Frame Count | 240 | 120 (every 2nd) |
| Headline Size | 48-56px | 32-40px |
| Form Padding | 48px | 24px |
| Section Padding | 64px | 32px |

#### 8.3 Device Detection
- Use `window.matchMedia('(max-width: 640px)')` for mobile
- Detect on mount, update on resize
- Load appropriate frame set based on detection

#### 8.4 Touch Scroll
- Same scroll-scrub behavior as desktop
- Ensure smooth touch scrolling (no jank)
- Test on iOS Safari and Chrome Android

**Acceptance Criteria:**
- [ ] Site works on 360px width screens
- [ ] Mobile loads 120 frames (not 240)
- [ ] Text is readable on all sizes
- [ ] Touch scroll is smooth
- [ ] Form is usable on mobile keyboards

---

### FEATURE 9: Accessibility

**Description:** Ensure site is usable by people with disabilities and assistive technologies.

#### 9.1 Reduced Motion
- **Detection:** `window.matchMedia('(prefers-reduced-motion: reduce)')`
- **Behavior:** Show single static image instead of scroll animation
- **Static Image:** High-quality frame ~200 (Carmiel community visible)
- **Content:** All text content still visible and accessible

#### 9.2 Screen Readers
- **Canvas:** Add `aria-hidden="true"` (decorative)
- **Headline:** Proper heading hierarchy (`<h1>`)
- **Form:** Proper `<label>` elements with `for` attributes
- **Buttons:** Descriptive text (no "Click here")

#### 9.3 Keyboard Navigation
- **Tab Order:** Logical flow through interactive elements
- **Focus Indicators:** Visible focus rings on all interactive elements
- **Skip Link:** Optional skip-to-content link

#### 9.4 Color Contrast
- **Text on Dark:** White (#FFFFFF) on Midnight Blue - passes WCAG AA
- **Gold Text:** Ensure sufficient contrast where used

**Acceptance Criteria:**
- [ ] Reduced motion users see static image
- [ ] All interactive elements are keyboard accessible
- [ ] Form can be completed without mouse
- [ ] Screen reader announces form labels correctly
- [ ] Color contrast passes WCAG AA

---

### FEATURE 10: Error States and Fallbacks

**Description:** Graceful handling of errors and edge cases.

#### 10.1 Image Load Failure
- **Behavior:** After retry attempts fail, show static fallback image
- **Fallback Image:** Pre-optimized static frame (frame 200)
- **User Message:** None (seamless fallback)

#### 10.2 Unsupported Browser
- **Detection:** Check for Canvas, ES6, CSS Grid support
- **Behavior:** Show upgrade prompt message
- **Message:** "Please upgrade your browser for the best experience."
- **Include:** Links to Chrome, Firefox, Safari

#### 10.3 JavaScript Disabled
- **Behavior:** Show static content with basic form
- **Approach:** `<noscript>` fallback with essential info

#### 10.4 Network Errors (Form)
- **Behavior:** Show error message, allow retry
- **Message:** "Something went wrong. Please try again."
- **Button:** Returns to enabled state

**Acceptance Criteria:**
- [ ] Failed image load shows static fallback
- [ ] Old browsers see upgrade message
- [ ] Form errors display user-friendly messages
- [ ] All error states are recoverable

---

### FEATURE 11: SEO and Meta Tags

**Description:** Search engine optimization and social sharing.

#### 11.1 Page Title
```
Olim Together - Home Is Where You Are Safe
```

#### 11.2 Meta Description
```
Join thousands of North American families on their journey home to Israel. Guided Aliyah support for housing, schools, careers, and community.
```

#### 11.3 Open Graph Tags
- `og:title`: Same as page title
- `og:description`: Same as meta description
- `og:image`: Static image of the final frame or branded graphic
- `og:type`: website
- `og:url`: Canonical URL

#### 11.4 Favicon
- **Design:** Simple letter "O" or "OT" in brand colors
- **Formats:** .ico, .png (multiple sizes), apple-touch-icon

**Acceptance Criteria:**
- [ ] Title appears in browser tab
- [ ] Meta description under 160 characters
- [ ] OG image displays when shared on social
- [ ] Favicon displays in browser

---

## Implementation Strategy: Testing Loop

For each feature, follow this strict workflow:

### 1. BUILD
Write the code for one specific feature or component.

### 2. TEST
Immediately write/run tests:
- **Unit tests** for hooks and utilities (Jest/Vitest)
- **Component tests** for React components (Testing Library)
- **Visual verification** in browser for UI components

### 3. VERIFY
- Ensure all tests pass
- Run linter (`npm run lint`)
- Check for TypeScript errors
- Verify in browser (Chrome DevTools)

### 4. PROCEED
Only move to the next feature once verified.

---

## Build Order (with Testing Checkpoints)

### Phase 1: Foundation
1. **Project Setup**
   - Initialize Next.js + TypeScript + Tailwind
   - Configure fonts (Playfair Display, Inter)
   - Set up GSAP
   - TEST: Project builds, fonts load

2. **Asset Conversion Script**
   - Create WebP conversion script
   - Run on existing JPEGs
   - TEST: All 240 desktop + 120 mobile frames exist

3. **Design Tokens**
   - Create `constants.ts` with colors, typography, breakpoints
   - Configure Tailwind theme
   - TEST: Tokens available in components

### Phase 2: Canvas Engine
4. **useCanvasSequence Hook**
   - Image preloading with progress
   - Error handling
   - TEST: Hook returns progress 0-100, images array populated

5. **useScrollProgress Hook**
   - GSAP ScrollTrigger integration
   - TEST: Returns value 0-1 based on scroll

6. **CanvasRenderer Class**
   - Double-buffer rendering
   - Lerp smoothing
   - TEST: Canvas renders frames, 60fps verified

7. **CanvasSequence Component**
   - Integrates hooks and renderer
   - TEST: Visual verification of scroll animation

### Phase 3: UI Layer
8. **Preloader Component**
   - Percentage display
   - Fade out animation
   - TEST: Shows progress, fades when complete

9. **Scroll Arrow Component**
   - Bounce animation
   - Fade on scroll
   - TEST: Animates, disappears on scroll

10. **Headline Overlay**
    - Fade + scale animation
    - Scroll-linked visibility
    - TEST: Appears at 30%, fades at 85%

11. **HeroSection Composition**
    - Combines all hero elements
    - TEST: Full scroll experience works end-to-end

### Phase 4: Forms
12. **Form UI Components**
    - Input, Select, Button primitives
    - TEST: Components render, styles apply

13. **SignupForm Component**
    - All fields, validation, Netlify attributes
    - TEST: Validation fires on submit, data structure correct

14. **Form Section Integration**
    - Position after canvas
    - Frosted glass card
    - TEST: Form appears at 100% scroll

15. **Thank You Page**
    - Route + content
    - TEST: Page accessible, styled correctly

### Phase 5: Compliance & Polish
16. **Cookie Consent Banner**
    - UI, localStorage persistence
    - TEST: Shows once, persists choice

17. **Privacy Policy Page**
    - Content, route
    - TEST: Page accessible, linked from banner

18. **Accessibility Pass**
    - Reduced motion fallback
    - Keyboard navigation
    - TEST: prefers-reduced-motion shows static, tab navigation works

19. **Responsive Testing**
    - All breakpoints
    - TEST: Verify at 360px, 768px, 1024px, 1440px

### Phase 6: Deployment
20. **Netlify Configuration**
    - netlify.toml
    - Form testing
    - TEST: Deploy succeeds, form submissions work

21. **Performance Audit**
    - Lighthouse
    - TEST: Performance > 90, Accessibility = 100

---

## File Structure (Final)

```
olim-together/
├── public/
│   ├── assets/
│   │   ├── sequence/
│   │   │   ├── desktop/           # 240 WebP frames
│   │   │   └── mobile/            # 120 WebP frames
│   │   └── fallback/
│   │       └── hero-static.webp
│   ├── fonts/
│   │   ├── PlayfairDisplay-*.woff2
│   │   └── Inter-*.woff2
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── thank-you/
│   │   │   └── page.tsx
│   │   └── privacy/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── CanvasSequence.tsx
│   │   │   ├── CanvasRenderer.ts
│   │   │   └── CanvasFallback.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   └── FormSection.tsx
│   │   ├── forms/
│   │   │   └── SignupForm.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── ScrollArrow.tsx
│   │   ├── preloader/
│   │   │   └── Preloader.tsx
│   │   ├── consent/
│   │   │   └── CookieConsent.tsx
│   │   └── seo/
│   │       └── MetaTags.tsx
│   │
│   ├── hooks/
│   │   ├── useCanvasSequence.ts
│   │   ├── useScrollProgress.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useReducedMotion.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── lib/
│   │   ├── gsap.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   └── types/
│       └── index.ts
│
├── scripts/
│   └── convert-images.js
│
├── __tests__/
│   ├── hooks/
│   ├── components/
│   └── utils/
│
├── netlify.toml
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Verification Checklist (Pre-Launch)

### Performance
- [ ] Lighthouse Performance > 90
- [ ] LCP < 2.5 seconds
- [ ] CLS < 0.1
- [ ] Canvas maintains 60fps
- [ ] Total page weight < 15MB

### Functionality
- [ ] Animation plays smoothly on scroll
- [ ] Headline fades in at correct point
- [ ] Form appears at end of scroll
- [ ] Form validation works correctly
- [ ] Form submission reaches Netlify
- [ ] Redirect to thank-you works
- [ ] Cookie consent persists

### Accessibility
- [ ] Reduced motion shows static fallback
- [ ] All elements keyboard navigable
- [ ] Screen reader compatibility
- [ ] Color contrast passes WCAG AA

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Chrome Android

### Responsive
- [ ] 360px (minimum)
- [ ] 375px (iPhone SE)
- [ ] 768px (tablet)
- [ ] 1024px (desktop)
- [ ] 1440px (large desktop)

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "gsap": "^3.12.5",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10",
    "sharp": "^0.33.0",
    "@testing-library/react": "^14",
    "@testing-library/jest-dom": "^6",
    "vitest": "^1.0.0"
  }
}
```

---

## Future Phases (Post-MVP)

1. **Phase 2: Localization**
   - Full Hebrew translation
   - RTL layout support
   - Language toggle

2. **Phase 3: Extended Content**
   - 6-section emotional arc narrative
   - Community map (Katzrin, Karmiel, Sderot)
   - Program grid with hover interactions

3. **Phase 4: Enhanced Features**
   - Analytics integration
   - A/B testing capability
   - CRM integration

4. **Phase 5: Performance Enhancements**
   - PWA capability
   - Image CDN integration
   - Advanced caching strategies
