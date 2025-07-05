# Colourful Text Component

A text component with animated color transitions, filter, and scale effects.

## Features

- Individual character animation
- Smooth color transitions
- Blur and scale effects
- Customizable colors and timing
- Automatic color shuffling

## Usage

```tsx
import { ColourfulText } from "@/component-library/components/ui/colourful-text";

function MyComponent() {
  return (
    <h1 className="text-4xl font-bold">
      Build <ColourfulText text="amazing" /> experiences
    </h1>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| text | string | Yes | The text string to be rendered with colorful animated characters |

## Variants

- **Demo**: Full-screen showcase with background image
- **Hero**: Hero section variant with gradient background
- **Minimal**: Simple implementation for inline use

## Animation Details

- Each character animates individually
- Colors shuffle every 5 seconds
- Includes y-axis movement, scale, blur, and opacity animations
- Staggered animation delay based on character position