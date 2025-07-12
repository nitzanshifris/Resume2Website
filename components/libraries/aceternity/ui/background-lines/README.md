# Background Lines Component

A set of SVG paths that animate in a wave pattern. Perfect for hero sections background, as seen on height.app. Creates dynamic, flowing line animations that add visual interest to any section.

## Features

- Animated SVG paths with wave-like motion
- Customizable animation duration
- Multiple colorful stroke animations
- Random delays for organic movement
- Dark mode compatible
- Responsive design
- TypeScript support

## Usage

### Basic Usage

```tsx
import { BackgroundLines } from "./background-lines-base";

function MyComponent() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h1>Your content here</h1>
      <p>Text overlay on animated background</p>
    </BackgroundLines>
  );
}
```

### Custom Animation Speed

```tsx
import { BackgroundLines } from "./background-lines-base";

function FastAnimation() {
  return (
    <BackgroundLines 
      className="h-screen flex items-center justify-center"
      svgOptions={{ duration: 5 }} // Faster animation
    >
      <h1>Fast moving lines</h1>
    </BackgroundLines>
  );
}
```

### Available Variants

1. **Hero Section** (`background-lines-hero-section.tsx`)
   - Full-screen hero with large title and subtitle
   - Perfect for landing pages and main sections

2. **About Section** (`background-lines-about-section.tsx`)
   - Personal profile section with skills grid
   - Ideal for portfolio about pages

3. **Services Section** (`background-lines-services-section.tsx`)
   - Service offerings with icon cards
   - Great for business service pages

4. **Contact Section** (`background-lines-contact-section.tsx`)
   - Contact information and CTA buttons
   - Perfect for contact/footer sections

5. **Minimal** (`background-lines-minimal.tsx`)
   - Compact version for smaller sections
   - Subtle background effect

6. **Fast Animation** (`background-lines-fast-animation.tsx`)
   - High-energy version with quick animations
   - Dynamic and attention-grabbing

## Props

### BackgroundLines Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | Required | Content to be rendered over the animated background |
| className | string | undefined | CSS classes for the container |
| svgOptions | object | undefined | Animation configuration options |

### SVG Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| duration | number | 10 | Animation duration in seconds for each path |

## Animation Details

- **Path Count**: 21 unique animated paths (duplicated for density)
- **Colors**: 21 different stroke colors for visual variety
- **Animation**: Stroke dash animation with opacity changes
- **Timing**: Random delays and repeat delays for organic feel
- **Performance**: Uses `will-change-transform` for optimization

## Styling Notes

- The component uses absolute positioning for the SVG overlay
- Container should have `position: relative` for proper layering
- Content uses `relative z-20` to appear above the animated background
- Background defaults to white/black based on theme
- SVG paths use various colors including blues, greens, reds, and purples

## Customization

### Custom Colors

To customize the line colors, modify the `colors` array in the SVG component:

```tsx
const colors = [
  "#YOUR_COLOR_1",
  "#YOUR_COLOR_2",
  // ... more colors
];
```

### Custom Paths

You can replace the `paths` array with your own SVG path data to create different line patterns.

### Animation Timing

Adjust animation timing by modifying the transition object:

```tsx
transition={{
  duration: 8, // Custom duration
  ease: "easeInOut", // Different easing
  repeat: Infinity,
  repeatType: "loop",
}}
```

## Performance Considerations

- Uses Framer Motion for smooth animations
- SVG paths are optimized for performance
- Random delays prevent synchronization which could cause performance issues
- Component is memoized where possible

## Dependencies

- motion (framer-motion)
- @/lib/utils (cn function)
- React 18+

## Browser Support

- Modern browsers with SVG support
- Framer Motion animation support
- CSS backdrop-filter for enhanced effects (optional)