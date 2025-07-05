# Background Gradient Animation

A smooth and elegant background gradient animation that changes the gradient position over time. This component creates mesmerizing animated gradients perfect for hero sections, call-to-action areas, and background effects.

## Features

- **Animated Gradients**: Multiple animated gradient layers with different movement patterns
- **Interactive Mode**: Optional mouse tracking for dynamic gradient positioning
- **Customizable Colors**: Configure up to 5 gradient colors plus background colors
- **Blend Modes**: Support for various CSS blend modes for creative effects
- **Safari Compatibility**: Optimized blur effects for Safari browsers
- **Responsive Design**: Works seamlessly across all screen sizes
- **Performance Optimized**: Efficient CSS animations with minimal JavaScript

## Usage

```tsx
import React from "react";
import { BackgroundGradientAnimation } from "./background-gradient-animation";

export function Example() {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          Gradients X Animations
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}
```

## Components

### BackgroundGradientAnimation
The main component that renders the animated gradient background with optional content overlay.

## Props

### BackgroundGradientAnimation
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| gradientBackgroundStart | string | "rgb(108, 0, 162)" | Starting color of the background gradient |
| gradientBackgroundEnd | string | "rgb(0, 17, 82)" | Ending color of the background gradient |
| firstColor | string | "18, 113, 255" | First animated color (RGB values without rgb()) |
| secondColor | string | "221, 74, 255" | Second animated color (RGB values without rgb()) |
| thirdColor | string | "100, 220, 255" | Third animated color (RGB values without rgb()) |
| fourthColor | string | "200, 50, 50" | Fourth animated color (RGB values without rgb()) |
| fifthColor | string | "180, 180, 50" | Fifth animated color (RGB values without rgb()) |
| pointerColor | string | "140, 100, 255" | Interactive pointer color (RGB values without rgb()) |
| size | string | "80%" | Size of the animated gradient elements |
| blendingValue | string | "hard-light" | CSS blend mode for the animated elements |
| interactive | boolean | true | Enable mouse interaction |
| children | React.ReactNode | undefined | Content to overlay on the animation |
| className | string | undefined | Additional CSS classes for content |
| containerClassName | string | undefined | Additional CSS classes for container |

## Animation Details

- **Movement Patterns**: 5 different animation types (horizontal, circular, vertical)
- **Timing**: Various durations (20s, 30s, 40s) for natural movement
- **Blend Modes**: CSS mix-blend-mode for color interactions
- **Blur Effects**: SVG filters and CSS blur for smooth gradients
- **Safari Support**: Conditional blur settings for optimal performance

## Styling

The component uses CSS custom properties for dynamic color configuration:
- Background: Linear gradient using start/end colors
- Animation: Keyframe-based movement with transform origins
- Blur: SVG filter with Gaussian blur and color matrix
- Blend: Mix-blend-mode for color interactions

## Required CSS Animations

Add these keyframes to your CSS file:

```css
@keyframes moveHorizontal {
  0% { transform: translateX(-50%) translateY(-10%); }
  50% { transform: translateX(50%) translateY(10%); }
  100% { transform: translateX(-50%) translateY(-10%); }
}

@keyframes moveInCircle {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}

@keyframes moveVertical {
  0% { transform: translateY(-50%); }
  50% { transform: translateY(50%); }
  100% { transform: translateY(-50%); }
}
```

## Performance

- Uses CSS transforms for hardware acceleration
- Efficient SVG filters for blur effects
- Minimal JavaScript for mouse tracking
- Optimized for Safari browser compatibility
- Smooth 60fps animations

## Examples

### Basic Usage
```tsx
<BackgroundGradientAnimation>
  <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold">
    <h1>Your Content Here</h1>
  </div>
</BackgroundGradientAnimation>
```

### Custom Colors
```tsx
<BackgroundGradientAnimation
  gradientBackgroundStart="rgb(50, 0, 100)"
  gradientBackgroundEnd="rgb(0, 50, 100)"
  firstColor="255, 100, 50"
  secondColor="100, 255, 50"
  thirdColor="50, 100, 255"
>
  <div className="content">Custom themed content</div>
</BackgroundGradientAnimation>
```

### Non-Interactive Mode
```tsx
<BackgroundGradientAnimation interactive={false}>
  <div className="content">Static animation without mouse tracking</div>
</BackgroundGradientAnimation>
```

### Call to Action
```tsx
<BackgroundGradientAnimation>
  <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-center text-white">
    <h2 className="text-5xl font-bold mb-4">Get Started Today</h2>
    <p className="text-xl mb-6">Experience the power of animated gradients</p>
    <button className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
      Learn More
    </button>
  </div>
</BackgroundGradientAnimation>
```

## Implementation Notes

- Component automatically sets CSS custom properties on document.body
- Uses `useRef` for interactive mouse tracking
- Includes Safari detection for optimized blur effects
- Content should use `absolute z-50` positioning for proper layering
- Text content benefits from `pointer-events-none` for better UX