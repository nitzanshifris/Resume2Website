# Grid and Dot Backgrounds

Beautiful grid and dot background patterns using CSS gradients.

## Features

- **Multiple Variants**: Grid, small grid, and dot patterns
- **CSS-Based**: Pure CSS implementation using gradients
- **Customizable**: Configurable pattern size and styling
- **Lightweight**: No external dependencies beyond React
- **Responsive**: Works well across different screen sizes

## Installation

```bash
npm i clsx tailwind-merge
```

## Usage

```tsx
import React from "react";
import { GridAndDotBackgrounds } from "@/components/ui/grid-and-dot-backgrounds";

export function MyComponent() {
  return (
    <GridAndDotBackgrounds 
      variant="grid" 
      className="h-96 w-full bg-black relative flex items-center justify-center"
    >
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-2xl md:text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Your Content Here
      </p>
    </GridAndDotBackgrounds>
  );
}
```

## Variants

### Grid Background
```tsx
<GridAndDotBackgrounds variant="grid" />
```

### Small Grid Background
```tsx
<GridAndDotBackgrounds variant="gridSmall" />
```

### Dot Background
```tsx
<GridAndDotBackgrounds variant="dot" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "grid" \| "gridSmall" \| "dot" | "grid" | Type of background pattern |
| size | "default" \| "small" | "default" | Size of pattern elements |
| className | string | - | Additional CSS classes |
| children | ReactNode | - | Content to display over background |

## Examples

### Hero Section with Grid Background
```tsx
<GridAndDotBackgrounds variant="grid" className="h-screen bg-black flex items-center justify-center">
  <div className="text-center">
    <h1 className="text-6xl font-bold text-white mb-4">Welcome</h1>
    <p className="text-xl text-gray-400">Beautiful background patterns</p>
  </div>
</GridAndDotBackgrounds>
```

### Card with Dot Background
```tsx
<GridAndDotBackgrounds variant="dot" className="h-64 bg-slate-900 rounded-lg p-8">
  <div className="relative z-10">
    <h3 className="text-2xl font-semibold text-white mb-2">Feature Card</h3>
    <p className="text-gray-300">With dot background pattern</p>
  </div>
</GridAndDotBackgrounds>
```

## Customization

The component uses CSS gradients for patterns. You can customize colors by overriding the CSS variables or modifying the component's style props.

### Custom Colors
```tsx
<GridAndDotBackgrounds 
  variant="grid"
  style={{
    backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`
  }}
/>
```