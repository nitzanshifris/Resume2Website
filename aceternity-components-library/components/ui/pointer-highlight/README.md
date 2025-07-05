# Pointer Highlight Component

An animated highlight effect that draws a border around content with a pointer indicator, triggered when the element comes into view.

## Usage

```tsx
import { PointerHighlight } from "./pointer-highlight";

export function Example() {
  return (
    <PointerHighlight>
      <span>Your highlighted content</span>
    </PointerHighlight>
  );
}
```

## Props

- `children`: React.ReactNode - The content to highlight
- `rectangleClassName`: string (optional) - Custom classes for the rectangle border
- `pointerClassName`: string (optional) - Custom classes for the pointer icon
- `containerClassName`: string (optional) - Custom classes for the container wrapper

## Variants

### Basic Usage
Simple text highlighting with default styling.

### Inline Highlighting
Use within text content with custom colors and sizes:
```tsx
<PointerHighlight
  rectangleClassName="bg-neutral-200 dark:bg-neutral-700"
  pointerClassName="text-yellow-500 h-3 w-3"
  containerClassName="inline-block"
>
  <span>highlighted text</span>
</PointerHighlight>
```

### Custom Colors
Apply different background and pointer colors:
```tsx
<PointerHighlight
  rectangleClassName="bg-blue-100 dark:bg-blue-900 border-blue-300"
  pointerClassName="text-blue-500"
>
  <span>content</span>
</PointerHighlight>
```

## Features

- Automatic size detection with ResizeObserver
- Smooth animation on scroll into view
- Customizable styling for all elements
- Dark mode support
- Responsive design