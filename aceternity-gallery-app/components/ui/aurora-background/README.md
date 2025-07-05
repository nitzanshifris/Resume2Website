# Aurora Background Component

A subtle Aurora or Southern Lights background effect for creating stunning hero sections and content wrappers.

## Usage

```tsx
import { AuroraBackground } from '@/components/ui/aurora-background';

export function MyComponent() {
  return (
    <AuroraBackground>
      <h1 className="text-4xl font-bold dark:text-white">
        Your Content Here
      </h1>
    </AuroraBackground>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Content to display over the aurora background |
| className | string | - | Additional CSS classes for the container |
| showRadialGradient | boolean | true | Apply radial gradient mask effect |
| ...props | HTMLDivElement props | - | Any valid div element props |

## Features

- Animated gradient background simulating aurora lights
- Dark mode support with automatic color inversion
- Smooth 60-second animation loop
- Optional radial gradient mask
- Responsive and performant
- Full viewport height by default

## Variants

1. **Hero Section** - Full featured hero with animations and CTA button
2. **Content Wrapper** - Feature cards with backdrop blur effect
3. **Minimal** - Simple implementation with basic text

## Animation Details

The aurora effect is created using:
- Repeating linear gradients with multiple color stops
- CSS animations for continuous movement
- Blend modes for visual depth
- Blur filters for soft light effect

## Customization

You can customize the aurora colors by modifying the CSS custom properties:
- `--aurora`: Main gradient colors
- `--dark-gradient`: Dark mode overlay
- `--white-gradient`: Light mode overlay

The animation duration and direction can be adjusted via the `animate-aurora` class.