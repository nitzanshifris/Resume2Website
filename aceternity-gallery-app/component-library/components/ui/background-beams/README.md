# Background Beams Component

Multiple animated background beams that follow SVG paths, creating a dynamic and futuristic background effect.

## Usage

```tsx
import { BackgroundBeams } from '@/components/ui/background-beams';

export function MyComponent() {
  return (
    <div className="h-[40rem] w-full bg-neutral-950 relative">
      <div className="relative z-10">
        {/* Your content here */}
      </div>
      <BackgroundBeams />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | - | Additional CSS classes for the container |

## Features

- 50+ animated beam paths
- Smooth gradient animations
- Random animation durations for organic movement
- Fully responsive SVG implementation
- Dark theme optimized
- GPU accelerated animations
- Memoized for performance

## Variants

1. **Waitlist Form** - Email capture form with gradient text
2. **Feature Section** - Three-column feature grid with cards
3. **Minimal** - Simple implementation with basic text

## Technical Details

The component uses:
- Framer Motion for gradient animations
- SVG paths for beam trajectories
- Linear gradients with animated positions
- React.memo for performance optimization
- Random delays and durations for natural movement

## Styling Notes

- Best used with dark backgrounds (bg-neutral-950)
- Content should have relative z-10 positioning
- Container should have defined height
- Works well with backdrop blur effects

## Performance

The component is optimized with:
- React.memo to prevent unnecessary re-renders
- CSS transforms for smooth animations
- pointer-events: none to prevent interaction overhead