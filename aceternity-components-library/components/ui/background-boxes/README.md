# Background Boxes Component

A full-width background box container that creates an animated grid pattern with interactive hover effects.

## Features

- Interactive hover animations with random color changes
- Skewed 3D perspective effect
- Customizable styling with className prop
- Performance optimized with React.memo
- Dark mode compatible

## Usage

### Basic Usage

```tsx
import { Boxes } from "./background-boxes-base";

function MyComponent() {
  return (
    <div className="relative h-96 overflow-hidden bg-slate-900">
      <Boxes />
      {/* Your content here */}
    </div>
  );
}
```

### Available Variants

1. **Hero Section** (`background-boxes-hero.tsx`)
   - Standard hero section with title and subtitle
   - Height: 384px (h-96)

2. **Fullscreen** (`background-boxes-fullscreen.tsx`)
   - Full viewport height implementation
   - Includes CTA button example

3. **Minimal** (`background-boxes-minimal.tsx`)
   - Compact version without content
   - Height: 256px (h-64)

4. **With Card** (`background-boxes-with-card.tsx`)
   - Features a glassmorphic card overlay
   - Great for showcasing features or content

## Props

### Boxes Component

| Prop | Type | Description |
|------|------|-------------|
| className | string (optional) | Additional CSS classes for styling |
| ...rest | any | Other props passed to the container div |

## Styling Notes

- The component uses absolute positioning, so ensure the parent container has `position: relative`
- Requires a dark background (e.g., `bg-slate-900`) for optimal visual effect
- The mask gradient creates a fade effect from the center
- Colors can be customized by modifying the `colors` array in the component

## Dependencies

- motion (framer-motion)
- @/lib/utils (cn function)
- React 18+