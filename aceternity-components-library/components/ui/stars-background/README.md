# Stars Background

A stunning animated starry background with twinkling effects. Creates a realistic night sky with customizable star density and twinkle animations.

## Features

- Canvas-based rendering for performance
- Customizable star density
- Twinkling animation effects
- Responsive to container size
- Smooth fade-in animation
- Works perfectly with Shooting Stars component

## Usage

```tsx
import { StarsBackground } from "./stars-background/stars-background";

export default function MyComponent() {
  return (
    <div className="relative h-screen bg-neutral-900">
      <StarsBackground />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

## Props

- `starDensity` - Density of stars (default: 0.00015)
- `allStarsTwinkle` - Whether all stars should twinkle (default: true)
- `twinkleProbability` - Probability of a star twinkling (default: 0.7)
- `minTwinkleSpeed` - Minimum twinkle animation speed (default: 0.5)
- `maxTwinkleSpeed` - Maximum twinkle animation speed (default: 1)
- `className` - Additional CSS classes

## Examples

### Dense Stars
```tsx
<StarsBackground starDensity={0.0005} />
```

### Static Stars (No Twinkling)
```tsx
<StarsBackground 
  allStarsTwinkle={false} 
  twinkleProbability={0} 
/>
```

### Slow Twinkling
```tsx
<StarsBackground 
  minTwinkleSpeed={2}
  maxTwinkleSpeed={4}
/>
```