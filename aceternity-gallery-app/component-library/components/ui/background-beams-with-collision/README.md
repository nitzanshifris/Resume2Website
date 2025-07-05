# Background Beams With Collision Component

Animated background beams that fall from above and create explosion effects when they collide with the ground.

## Usage

```tsx
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';

export function MyComponent() {
  return (
    <BackgroundBeamsWithCollision>
      <h1 className="relative z-20 text-4xl font-bold">
        Your Content Here
      </h1>
    </BackgroundBeamsWithCollision>
  );
}
```

## Props

### BackgroundBeamsWithCollision

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Content to display over the beams |
| className | string | - | Additional CSS classes for the container |

### BeamOptions (Internal)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialX | number | 0 | Starting X position |
| translateX | number | 0 | Target X position |
| initialY | number/string | "-200px" | Starting Y position |
| translateY | number/string | "1800px" | Target Y position |
| rotate | number | 0 | Rotation angle |
| className | string | - | Additional beam styles |
| duration | number | 8 | Animation duration in seconds |
| delay | number | 0 | Animation delay |
| repeatDelay | number | 0 | Delay between repeats |

## Features

- 7 animated beams with different properties
- Collision detection at 50ms intervals
- Particle explosion effects on impact
- Smooth gradient animations
- Dark mode support
- Responsive design
- GPU accelerated animations

## Variants

1. **Hero Text** - Large gradient text with "Exploding beams" effect
2. **Interactive Demo** - Stats display with animation details
3. **Minimal** - Simple implementation with basic text

## Technical Details

- Uses Framer Motion for animations
- Real-time collision detection between beams and ground
- 20 particles per explosion
- Random particle trajectories
- Automatic beam regeneration after collision
- Shadow effects on the ground element

## Performance Considerations

- Collision detection runs every 50ms
- Beams are regenerated 2 seconds after collision
- AnimatePresence for smooth explosion transitions
- Multiple beams can collide simultaneously