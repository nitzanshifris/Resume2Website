# 3D Marquee Component

A 3D Marquee effect with grid, perfect for showcasing testimonials, hero sections, and image galleries with a stunning 3D perspective.

## Usage

```tsx
import { ThreeDMarquee } from "./3d-marquee";

const images = [
  "image-url-1.jpg",
  "image-url-2.jpg",
  // ... more images
];

<ThreeDMarquee images={images} />
```

## Variants

### Standard
Basic 3D marquee with image grid in a contained container.

### Fullscreen
Full-screen variant with overlay and centered text, perfect for hero sections.

## Props

### ThreeDMarquee
- `images`: string[] (required) - Array of image URLs to display
- `className`: string (optional) - Additional CSS classes

### GridLineHorizontal / GridLineVertical
- `className`: string (optional) - Additional CSS classes
- `offset`: string (optional) - Controls line extension beyond boundaries

## Features
- 3D perspective transformation
- Automatic column distribution
- Smooth hover animations
- Grid lines for visual depth
- Responsive scaling
- Dark mode support