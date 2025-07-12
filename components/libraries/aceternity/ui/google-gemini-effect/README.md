# Google Gemini Effect

An effect of SVGs as seen on the Google Gemini Website. This component creates animated SVG paths that respond to scroll progress, creating a mesmerizing visual effect.

## Features

- **Scroll-driven Animation**: SVG paths animate based on scroll progress
- **Multiple Path Layers**: 5 different colored paths with staggered animations
- **Gaussian Blur Effects**: Background blur effects for visual depth
- **Customizable Content**: Configurable title and description
- **Responsive Design**: Works across different screen sizes
- **Motion Values**: Uses Framer Motion's useTransform for smooth animations

## Usage

```tsx
import { useScroll, useTransform } from "motion/react";
import React from "react";
import { GoogleGeminiEffect } from "./google-gemini-effect";

export function Example() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div
      className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip"
      ref={ref}
    >
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />
    </div>
  );
}
```

## Components

### GoogleGeminiEffect
The main component that renders the animated SVG paths with scroll-based animation.

## Props

### GoogleGeminiEffect
| Prop | Type | Description |
|------|------|-------------|
| pathLengths | MotionValue[] | An array of MotionValue objects used to animate the SVG paths |
| title | string (optional) | The title to be displayed. Defaults to "Build with Aceternity UI" |
| description | string (optional) | The description to be displayed |
| className | string (optional) | Additional CSS classes |

## Animation Details

- **Path Colors**: #FFB7C5, #FFDDB7, #B1C5FF, #4FABFF, #076EFF
- **Animation Range**: Scroll progress from 0 to 0.8
- **Path Length Range**: Each path animates from different starting points to 1.2
- **Blur Effect**: Gaussian blur with stdDeviation of 5
- **Sticky Positioning**: Component uses sticky positioning at top-80

## Styling

The component uses a dark theme with:
- Background: Black
- Text gradient: From neutral-100 to neutral-300
- Description: Neutral-400
- Button: White background with black text
- SVG: Full width with absolute positioning

## Performance

- Uses Framer Motion's optimized scroll tracking
- Leverages CSS transforms for smooth animations
- Minimal re-renders with motion values
- Hardware-accelerated SVG animations

## Examples

### Basic Usage
```tsx
<GoogleGeminiEffect
  pathLengths={[
    pathLengthFirst,
    pathLengthSecond, 
    pathLengthThird,
    pathLengthFourth,
    pathLengthFifth,
  ]}
/>
```

### Custom Title and Description
```tsx
<GoogleGeminiEffect
  pathLengths={pathLengths}
  title="Custom Title"
  description="Custom description text"
/>
```

### With Custom Styling
```tsx
<GoogleGeminiEffect
  pathLengths={pathLengths}
  className="custom-styles"
  title="Styled Component"
/>
```

## Implementation Notes

- Requires a scroll container with sufficient height (400vh recommended)
- Uses `useScroll` hook with target ref for scroll tracking
- SVG paths are optimized for performance
- Component is sticky positioned for proper scroll behavior
- Blur effects are applied using SVG filters