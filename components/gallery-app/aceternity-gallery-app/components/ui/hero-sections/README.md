# Hero Sections

A set of hero sections ranging from simple to complex layouts with entry animations.

## Features

- **Word-by-Word Animation**: Each word animates in sequence for dramatic effect
- **Gradient Accents**: Blue gradient lines and borders for visual interest
- **Motion Effects**: Smooth fade-in and blur animations
- **Responsive Design**: Adapts beautifully to different screen sizes
- **Dark Mode Support**: Built-in dark mode styling
- **Call-to-Action Buttons**: Pre-styled buttons with hover effects

## Installation

```bash
npm i motion clsx tailwind-merge @tabler/icons-react cobe
```

## Usage

```tsx
"use client";
 
import { motion } from "motion/react";
 
export function HeroSectionOne() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      {/* Component content */}
    </div>
  );
}
```

## Components

### HeroSectionOne

The main hero section component with animated text, gradient borders, and image preview.

### Navbar

A simple navigation bar component included in the hero section.

## Variants

### Full Demo
The complete hero section with all animations and features.

### Preview
A constrained version for gallery display with scrollable content.

### Minimal
A simplified version optimized for smaller containers.

## Props

### HeroSectionOne Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| containerClassName | string | - | CSS classes for the container |

## Animation Details

### Text Animation
- Each word appears with:
  - Opacity: 0 to 1
  - Blur: 4px to 0px
  - Y position: 10px to 0px
  - Delay: 0.1s per word
  - Duration: 0.3s

### Content Animation
- Description appears after 0.8s
- Buttons appear after 1s
- Image preview appears after 1.2s

## Customization

### Container Styling
```tsx
<HeroSectionOne containerClassName="custom-classes" />
```

### Gradient Colors
The component uses blue gradients (via-blue-500) that can be customized by modifying the gradient classes.

### Button Styles
Two button variants are included:
1. Primary: Black background with white text (inverts in dark mode)
2. Secondary: White background with border

## Examples

### Basic Usage
```tsx
<HeroSectionOne />
```

### With Custom Container
```tsx
<HeroSectionOne containerClassName="h-screen w-full" />
```

### In a Constrained Space
```tsx
<div className="h-96 overflow-auto">
  <HeroSectionOne />
</div>
```

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Button hover states for interactivity
- High contrast text for readability

## Performance Notes

- Motion animations are GPU-accelerated
- Images should be optimized for web
- Consider lazy loading for below-the-fold content