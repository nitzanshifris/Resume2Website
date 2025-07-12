# 3D Animated Pin Component

A gradient pin that animates on hover with 3D perspective effects, perfect for showcasing product links, portfolio items, or featured content.

## Usage

```tsx
import { PinContainer } from "./3d-pin";

<PinContainer title="/example.com" href="https://example.com">
  <div className="w-[20rem] h-[20rem] p-4">
    {/* Your content here */}
  </div>
</PinContainer>
```

## Variants

### Gradient Card
Classic variant with a gradient background showcase.

### With Image
Variant featuring an image with title and description.

### Minimal
Clean, centered design with icon display.

## Props

### PinContainer
- `children`: ReactNode (required) - Content to display in the pin
- `title`: string (optional) - URL/title shown on hover
- `href`: string (optional) - Link destination
- `className`: string (optional) - Additional styles for content
- `containerClassName`: string (optional) - Container styles

### PinPerspective
- `title`: string (optional) - Display title
- `href`: string (optional) - Link URL

## Features
- 3D perspective transformation on hover
- Animated ripple effects
- Gradient beam animation
- Smooth scale transitions
- Dark mode optimized
- Fully accessible links