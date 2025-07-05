# Shooting Stars

A beautiful animated shooting star effect that creates meteors flying across the screen. Perfect for creating magical, space-themed backgrounds.

## Features

- Customizable star colors and trail colors
- Adjustable speed and spawn intervals
- Smooth SVG-based animations
- Responsive and performant
- Works great with Stars Background component

## Usage

```tsx
import { ShootingStars } from "./shooting-stars/shooting-stars";

export default function MyComponent() {
  return (
    <div className="relative h-screen bg-neutral-900">
      <ShootingStars />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

## Props

- `minSpeed` - Minimum speed of shooting stars (default: 10)
- `maxSpeed` - Maximum speed of shooting stars (default: 30)
- `minDelay` - Minimum delay between stars in ms (default: 1200)
- `maxDelay` - Maximum delay between stars in ms (default: 4200)
- `starColor` - Color of the star (default: "#9CA3AF")
- `trailColor` - Color of the trail (default: "#2F59AA")
- `starWidth` - Width of the star (default: 10)
- `starHeight` - Height of the star (default: 1)
- `className` - Additional CSS classes

## Examples

### Colorful Shooting Stars
```tsx
<ShootingStars 
  starColor="#FF00FF"
  trailColor="#00FFFF"
  minSpeed={20}
  maxSpeed={40}
/>
```

### Slow Shooting Stars
```tsx
<ShootingStars 
  minDelay={3000}
  maxDelay={6000}
/>
```