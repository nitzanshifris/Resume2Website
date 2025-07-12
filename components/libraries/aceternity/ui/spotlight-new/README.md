# Spotlight New Component

A new and improved spotlight effect component with animated left and right spotlights that create a dynamic lighting effect. This version provides a more subtle and sophisticated approach compared to the traditional spotlight effect.

## Features

- Dual spotlight beams (left and right)
- Smooth horizontal animation
- Customizable gradients and colors
- Adjustable animation speed and offset
- Configurable spotlight dimensions
- Fade-in effect on mount

## Usage

```tsx
import { Spotlight } from "./spotlight-new";

export function MyComponent() {
  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <Spotlight />
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white">
          Your Content Here
        </h1>
      </div>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| gradientFirst | string | Complex gradient | First gradient color for the spotlight effect |
| gradientSecond | string | Complex gradient | Second gradient color for the spotlight effect |
| gradientThird | string | Complex gradient | Third gradient color for the spotlight effect |
| translateY | number | -350 | Vertical translation offset in pixels |
| width | number | 560 | Width of the main spotlight element in pixels |
| height | number | 1380 | Height of the spotlight elements in pixels |
| smallWidth | number | 240 | Width of the smaller spotlight elements in pixels |
| duration | number | 7 | Animation duration in seconds |
| xOffset | number | 100 | Horizontal animation offset in pixels |

## Variants

### Default
The standard spotlight effect with blue-tinted gradients.

### Custom Colors
Customize the gradient colors to match your brand:
```tsx
<Spotlight 
  gradientFirst="radial-gradient(...your gradient...)"
  gradientSecond="radial-gradient(...your gradient...)"
  gradientThird="radial-gradient(...your gradient...)"
/>
```

### Fast Animation
Increase the animation speed for more dynamic movement:
```tsx
<Spotlight duration={3} xOffset={200} />
```

### Subtle Effect
Lower opacity and slower movement for ambient lighting:
```tsx
<Spotlight 
  gradientFirst="radial-gradient(...lower opacity...)"
  duration={10}
  xOffset={50}
/>
```

### Large Spotlights
Bigger beams for more dramatic coverage:
```tsx
<Spotlight width={800} smallWidth={350} />
```

## Styling

The component uses absolute positioning and should be placed within a relative container. The spotlights are pointer-events-none to allow interaction with content underneath.

### Container Requirements
- Position: relative
- Overflow: hidden
- Dark background recommended (e.g., bg-black)

### Z-Index Considerations
- Spotlight beams: z-40
- Your content should have z-10 or higher to appear above the spotlights