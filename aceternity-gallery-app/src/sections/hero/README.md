# Hero Sections Pack

A comprehensive collection of hero section components for modern websites. This pack includes multiple hero variants that can be used as landing page headers, section headers, or standalone hero components.

## Features

- **13 Unique Variants**: Multiple hero section styles for different use cases
- **Smooth Animations**: Motion animations and interactive effects
- **Responsive Design**: Works across all screen sizes
- **Dark Mode Optimized**: Designed primarily for dark backgrounds
- **Self-Contained**: All dependencies and components included in the pack
- **Customizable**: Easy to modify colors, content, and layouts

## Installation

```bash
npm i motion clsx tailwind-merge next react-fast-marquee react-wrap-balancer react-rough-notation react-icons @tabler/icons-react
```

## Variants

### 1. Hero Section With Beams and Grid
Animated beams with collision detection and background grid pattern.

```tsx
import { HeroSectionWithBeamsAndGrid } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithBeamsAndGrid />;
}
```

### 2. Hero Section With Images Grid
Features navbar, image avatars, and scrolling image grid background.

```tsx
import { HeroSectionWithImagesGrid } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithImagesGrid />;
}
```

### 3. Hero With Centered Image
Clean hero with centered content and large image display.

```tsx
import { HeroWithCenteredImage } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroWithCenteredImage />;
}
```

### 4. Hero Section With Bento Grid
Modern bento-style grid layout with cards and highlighted text.

```tsx
import { HeroSectionWithBentoGrid } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithBentoGrid />;
}
```

### 5. Hero Section With Text Reveal
Text reveal effect with gradient highlighting for key phrases.

```tsx
import { HeroSectionWithTextReveal } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithTextReveal />;
}
```

### 6. Hero Section With Sparkles
Animated sparkle particles background with centered content.

```tsx
import { HeroSectionWithSparkles } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithSparkles />;
}
```

### 7. Hero Section With Noise Background
Features noise texture and animated striped background effect.

```tsx
import { HeroSectionWithNoiseBackground } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithNoiseBackground />;
}
```

### 8. Centered Around Testimonials
Interactive hero with animated testimonial cards that move on scroll.

```tsx
import { CenteredAroundTestimonials } from "@/packs/hero-sections";

export function MyHero() {
  return <CenteredAroundTestimonials />;
}
```

### 9. Two Column With Image
Split layout with text content on left and dashboard image on right.

```tsx
import { TwoColumnWithImage } from "@/packs/hero-sections";

export function MyHero() {
  return <TwoColumnWithImage />;
}
```

### 10. Playful Hero Section
Mobile app showcase with animated rough notation highlights and chat mockup.

```tsx
import { PlayfulHeroSection } from "@/packs/hero-sections";

export function MyHero() {
  return <PlayfulHeroSection />;
}
```

### 11. Modern Hero With Gradients
Minimalist hero section with animated gradient lines and modern typography.

```tsx
import { ModernHeroWithGradients } from "@/packs/hero-sections";

export function MyHero() {
  return <ModernHeroWithGradients />;
}
```

### 12. Full Background Image With Text
Hero section with full background image, gradient overlay, and logo showcase.

```tsx
import { FullBackgroundImageWithText } from "@/packs/hero-sections";

export function MyHero() {
  return <FullBackgroundImageWithText gradientFade={true} />;
}
```

### 13. Floating Cards 3D Hero
Interactive 3D cards that respond to mouse movement with glassmorphism design and gradient orbs.

```tsx
import { FloatingCards3DHero } from "@/packs/hero-sections";

export function MyHero() {
  return <FloatingCards3DHero />;
}
```

## Components Included

### Button Component
Versatile button with multiple variants.

```tsx
import { Button } from "@/packs/hero-sections";

<Button variant="primary">Get Started</Button>
<Button variant="outline">Learn More</Button>
<Button variant="simple">Contact Us</Button>
```

### Badge Component
Notification-style badge for announcements.

```tsx
import { Badge } from "@/packs/hero-sections";

<Badge>We've raised $69M seed funding</Badge>
```

## Pack Structure

```
hero-sections/
├── index.tsx                    # Main exports
├── hero-sections-base.tsx       # All hero components
├── hero-sections.types.ts       # TypeScript interfaces
└── README.md                    # Documentation
```

## Customization

### Colors
Modify gradient colors by changing Tailwind classes:

```tsx
// Change from cyan to purple
className="bg-gradient-to-r from-purple-500 to-pink-600"
```

### Content
All text content can be customized by editing the component directly:

```tsx
<h1 className="text-4xl font-bold">
  Your Custom Title
</h1>
```

### Animations
Adjust animation timing and effects:

```tsx
transition={{
  delay: 0.5,
  duration: 1.2,
  ease: "easeInOut",
}}
```

## Use Cases

1. **Landing Pages**: Primary hero sections for websites
2. **Product Launches**: Eye-catching announcement sections
3. **Portfolio Sites**: Creative headers for personal sites
4. **SaaS Products**: Professional hero sections with CTAs
5. **Marketing Pages**: Conversion-focused hero sections
6. **Creative Projects**: Artistic and animated hero displays

## Dependencies

- `motion/react` - Animations and interactions
- `next/image` - Optimized image handling
- `next/link` - Navigation
- `react-fast-marquee` - Scrolling marquee effects
- `react-wrap-balancer` - Text balancing
- `react-rough-notation` - Hand-drawn annotations
- `react-icons` - Icon components
- `@tabler/icons-react` - Icon library
- `next/font/google` - Google Fonts integration

## Performance Notes

- Uses CSS transforms for smooth 60fps animations
- Optimized image loading with Next.js Image component
- Efficient gradient rendering
- Minimal JavaScript for optimal performance

## Best Practices

1. **Background**: Use on dark backgrounds for best visual effect
2. **Content**: Keep hero text concise and impactful
3. **CTAs**: Include clear call-to-action buttons
4. **Mobile**: Test on various screen sizes
5. **Performance**: Use sparingly on pages with many animations