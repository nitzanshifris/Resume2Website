# Hero Parallax

A scroll effect with rotation, translation and opacity animations, perfect for showcasing products or portfolio items.

## Features

- **Scroll-based Animation**: Smooth parallax effect triggered by scroll
- **3D Transforms**: Rotation and perspective effects for depth
- **Multiple Rows**: Three rows of products with alternating directions
- **Spring Physics**: Natural motion using Framer Motion's spring animations
- **Hover Effects**: Individual product cards lift on hover
- **Fully Responsive**: Adapts to different screen sizes

## Installation

```bash
npm i motion clsx tailwind-merge
```

## Usage

```tsx
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail: "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  // Add more products...
];

export function HeroSection() {
  return <HeroParallax products={products} />;
}
```

## Components

### HeroParallax

The main container component that handles scroll detection and animations.

### Header

A hero section header with title and description.

### ProductCard

Individual product card component with hover effects.

## Variants

### Full Demo
The complete experience with 15 products and full scroll height.

### Preview
A constrained version for galleries with limited height.

### Minimal
A simplified version with fewer products.

## Props

### HeroParallax Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| products | Product[] | defaultProducts | Array of product objects |
| containerClassName | string | - | CSS classes for the container |

### Product Object

```typescript
interface Product {
  title: string;
  link: string;
  thumbnail: string;
}
```

### ProductCard Props

| Prop | Type | Description |
|------|------|-------------|
| product | Product | Product object with title, link, and thumbnail |
| translate | MotionValue<number> | Framer Motion value for x-axis translation |

## Examples

### Basic Usage
```tsx
<HeroParallax />
```

### With Custom Products
```tsx
const myProducts = [
  {
    title: "Project 1",
    link: "https://example.com/project1",
    thumbnail: "/images/project1.jpg",
  },
  // More products...
];

<HeroParallax products={myProducts} />
```

### Constrained Container
```tsx
<HeroParallax 
  containerClassName="h-[600px] overflow-hidden rounded-lg"
/>
```

## Customization

### Container Height
The default height is `300vh` to allow for scroll-based animations. You can customize this with `containerClassName`:

```tsx
<HeroParallax containerClassName="h-[200vh]" />
```

### Animation Timing
The component uses spring physics with:
- `stiffness: 300`
- `damping: 30`
- `bounce: 100`

### Scroll Ranges
- Rotation: `[0, 0.2]` of scroll progress
- Opacity: `[0.2, 1]` from 20% to 100%
- Translation: Progressive throughout scroll

## Performance Notes

- Images are loaded as standard `<img>` tags
- Consider lazy loading for large numbers of products
- The component uses GPU-accelerated transforms
- Spring animations are optimized for 60fps

## Accessibility

- Product cards are wrapped in anchor tags for navigation
- Alt text is provided for all images
- Keyboard navigation is supported through standard link behavior