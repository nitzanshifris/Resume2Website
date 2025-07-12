# Sparkles

A configurable sparkles component built with tsParticles that creates beautiful animated particle effects. Perfect for backgrounds, hero sections, and adding visual flair to your applications.

## Features

- Fully customizable particle effects
- Interactive particles (click to add more)
- Smooth fade-in animation
- High performance with FPS limiting
- Responsive and retina-ready
- Multiple preset variations
- Dark/light mode support

## Usage

```tsx
import { SparklesCore } from "./sparkles";

export function SparklesBackground() {
  return (
    <div className="relative h-screen bg-black">
      <SparklesCore
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="w-full h-full"
        particleColor="#FFFFFF"
      />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

## Props

- `id` - Unique identifier for the sparkles instance
- `className` - Additional CSS classes
- `background` - Background color (default: "#0d47a1")
- `minSize` - Minimum particle size (default: 1)
- `maxSize` - Maximum particle size (default: 3)
- `speed` - Animation speed for opacity changes (default: 4)
- `particleColor` - Color of the particles (default: "#ffffff")
- `particleDensity` - Number of particles (default: 120)

## Variants

### Default Sparkles
Classic sparkle effect with gradients and mask for smooth edges.

### Full Page
Full screen sparkle background with lower density for better performance.

### Colorful
Vibrant purple/pink sparkles with gradient background.

### Minimal
Simple black particles on white background for a clean look.

### Dense
High density sparkles with cyan colors for an intense effect.

## Performance Tips

1. Adjust `particleDensity` based on viewport size
2. Use lower `maxSize` for better performance on mobile
3. Disable interactions if not needed
4. Consider using `background: "transparent"` to avoid GPU overhead

## Customization Examples

### Slow Moving Sparkles
```tsx
<SparklesCore
  speed={1}
  minSize={0.4}
  maxSize={0.8}
  particleDensity={50}
/>
```

### Rainbow Sparkles
```tsx
<SparklesCore
  particleColor="#FF00FF"
  speed={2}
  particleDensity={200}
/>
```

### Large Particles
```tsx
<SparklesCore
  minSize={2}
  maxSize={5}
  particleDensity={30}
/>
```