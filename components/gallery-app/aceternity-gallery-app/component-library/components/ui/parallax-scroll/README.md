# Parallax Grid Scroll

A grid where two columns scroll in opposite directions, giving a parallax effect.

## Installation

```bash
npm i motion clsx tailwind-merge
```

## Usage

### Basic Parallax Scroll

```tsx
import { ParallaxScroll } from "@/components/ui/parallax-scroll";

const images = [
  "https://images.unsplash.com/photo-1554080353-a576cf803bda...",
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e...",
  // ... more images
];

function ParallaxScrollDemo() {
  return <ParallaxScroll images={images} />;
}
```

### Enhanced Parallax Scroll with Rotation

```tsx
import { ParallaxScrollSecond } from "@/components/ui/parallax-scroll";

function ParallaxScrollSecondDemo() {
  return <ParallaxScrollSecond images={images} />;
}
```

## Components

### ParallaxScroll
Basic parallax scrolling grid with vertical translations.

**Props:**
- `images: string[]` - Array of image URLs to display
- `className?: string` - Additional CSS classes

**Features:**
- Three-column responsive grid
- Opposite direction scrolling for outer columns
- Smooth scroll-based animations

### ParallaxScrollSecond
Enhanced parallax scrolling with rotation and horizontal movement.

**Props:**
- `images: string[]` - Array of image URLs to display  
- `className?: string` - Additional CSS classes

**Features:**
- Three-column responsive grid
- Rotation and horizontal translation effects
- More dynamic visual movement

## Grid Layout

The component automatically splits your images array into three equal parts:
- **First column**: Scrolls up with rotation (ParallaxScrollSecond only)
- **Second column**: Static reference point
- **Third column**: Scrolls down with rotation (ParallaxScrollSecond only)

## Customization

The component uses a fixed height container (`h-[40rem]`) with scroll. You can customize:

```tsx
<ParallaxScroll 
  images={images}
  className="h-[60rem] bg-gray-100" // Custom height and background
/>
```

## Performance Notes

- Uses Framer Motion's `useScroll` and `useTransform` for optimized animations
- Scroll container is the component itself for better performance
- Images are lazy-loaded by the browser