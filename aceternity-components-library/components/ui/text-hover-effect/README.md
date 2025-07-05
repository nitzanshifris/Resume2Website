# Text Hover Effect

A sophisticated text hover effect that reveals a colorful gradient on mouse hover, inspired by x.ai's design. Features real-time mouse tracking and SVG-based animations.

## Features

- **Mouse Tracking**: Gradient follows cursor movement in real-time
- **SVG-Based Animation**: Uses SVG masks and gradients for smooth effects
- **Colorful Gradient**: Five vibrant colors in the reveal animation
- **Stroke Animation**: Animated text outline that draws on load
- **Responsive**: Scales with container size
- **TypeScript Support**: Fully typed with TypeScript

## Installation

```bash
npm install motion clsx tailwind-merge
```

## Usage

```tsx
import { TextHoverEffect } from "./text-hover-effect";

export function MyComponent() {
  return (
    <div className="h-[40rem] flex items-center justify-center">
      <TextHoverEffect text="HOVER" duration={0.3} />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | - | The text to display (required) |
| `duration` | `number` | `0` | Mask transition duration in seconds |
| `automatic` | `boolean` | - | Automatic animation (not implemented) |

## Examples

### Basic Usage
```tsx
<TextHoverEffect text="ACET" />
```

### Custom Duration
```tsx
<TextHoverEffect text="SLOW" duration={1} />
```

### Short Text
```tsx
<TextHoverEffect text="AI" />
```

### Long Text
```tsx
<TextHoverEffect text="ACETERNITY" duration={0.5} />
```

## Technical Details

### SVG Structure
The component uses multiple SVG layers:
1. **Background stroke** - Subtle outline visible on hover
2. **Animated stroke** - Draws the text outline over 4 seconds
3. **Gradient text** - Colorful gradient revealed by mouse position

### Gradient Colors
- Yellow (#eab308)
- Red (#ef4444) 
- Blue (#3b82f6)
- Cyan (#06b6d4)
- Violet (#8b5cf6)

### Mouse Tracking
- Converts mouse coordinates to SVG percentage positions
- Updates radial gradient center position in real-time
- Smooth transitions with configurable duration

### Typography
- Uses Helvetica font family
- 7xl text size (very large)
- Bold font weight
- Centered alignment

## Container Requirements

For optimal display:
```tsx
<div className="h-[40rem] flex items-center justify-center">
  <TextHoverEffect text="YOUR TEXT" />
</div>
```

- Use a container with defined height
- Center the component with flexbox
- Ensure adequate spacing around text

## Performance Considerations

- Mouse tracking updates on every mousemove event
- Consider throttling for performance-critical applications
- Works best with short text (1-8 characters)
- SVG scales automatically with container

## Browser Support

Requires modern browsers with support for:
- SVG masks and gradients
- CSS transforms
- JavaScript ES6+

Works in all current browsers including Chrome, Firefox, Safari, and Edge.

## Accessibility

- Text content is accessible to screen readers
- Consider providing alternative text for users who cannot see animations
- Respect user preferences for reduced motion when possible

## Use Cases

Perfect for:
- Hero section headings
- Brand names and logos
- Interactive typography
- Landing page focal points
- Portfolio headers
- Creative showcases
- Call-to-action elements