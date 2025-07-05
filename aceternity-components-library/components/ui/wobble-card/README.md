# Wobble Card

A card effect that translates and scales on mousemove, perfect for feature cards.

## Features

- **Mouse Tracking**: Interactive card that follows mouse movement with parallax effect
- **Smooth Animation**: Fluid transitions with customizable easing
- **Noise Texture**: Subtle texture overlay for added depth and visual interest
- **Flexible Layout**: Works with CSS Grid for complex layouts
- **Customizable Styling**: Full control over colors and dimensions
- **Responsive Design**: Adapts to all screen sizes

## Installation

```bash
npm install motion clsx tailwind-merge
```

### Required Assets

Download and add the noise texture to your public folder:
- `public/noise.webp` - Noise texture for background effect

## Usage

### Basic Usage

```tsx
import { WobbleCard } from "./wobble-card";

export function BasicWobbleCard() {
  return (
    <WobbleCard containerClassName="bg-blue-800 min-h-[200px]">
      <h2 className="text-xl font-semibold text-white">
        Interactive Card
      </h2>
      <p className="mt-2 text-neutral-200">
        Move your mouse over this card to see the wobble effect.
      </p>
    </WobbleCard>
  );
}
```

### Grid Layout

```tsx
import { WobbleCard } from "./wobble-card";

export function WobbleCardGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 bg-pink-800 min-h-[300px]"
      >
        <h2 className="text-3xl font-semibold text-white">
          Large Feature Card
        </h2>
        <p className="mt-4 text-neutral-200">
          This card spans two columns on larger screens.
        </p>
      </WobbleCard>
      
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="text-2xl font-semibold text-white">
          Sidebar Card
        </h2>
        <p className="mt-4 text-neutral-200">
          A smaller companion card.
        </p>
      </WobbleCard>
    </div>
  );
}
```

### Feature Cards

```tsx
import { WobbleCard } from "./wobble-card";

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <WobbleCard containerClassName="bg-gradient-to-br from-violet-800 to-indigo-900 min-h-[250px]">
        <div className="w-12 h-12 bg-white/20 rounded-lg mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Feature One
        </h3>
        <p className="text-neutral-200 text-sm">
          Description of your amazing feature goes here.
        </p>
      </WobbleCard>
      
      <WobbleCard containerClassName="bg-gradient-to-br from-emerald-800 to-teal-900 min-h-[250px]">
        <div className="w-12 h-12 bg-white/20 rounded-lg mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Feature Two
        </h3>
        <p className="text-neutral-200 text-sm">
          Another great feature of your product.
        </p>
      </WobbleCard>
      
      <WobbleCard containerClassName="bg-gradient-to-br from-orange-800 to-red-900 min-h-[250px]">
        <div className="w-12 h-12 bg-white/20 rounded-lg mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Feature Three
        </h3>
        <p className="text-neutral-200 text-sm">
          The third amazing feature to showcase.
        </p>
      </WobbleCard>
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | Yes | Content to be rendered inside the WobbleCard |
| `containerClassName` | `string` | No | Optional className for styling the container |
| `className` | `string` | No | Optional className for styling the children wrapper |

## Styling

### Container Styling
The `containerClassName` prop controls the outer container. Use it to set:
- Background colors or gradients
- Minimum heights
- Grid column spans
- Any other container-level styles

```tsx
<WobbleCard 
  containerClassName="bg-gradient-to-br from-purple-800 to-pink-900 min-h-[400px]"
>
  {/* Content */}
</WobbleCard>
```

### Content Styling
The `className` prop controls the inner content wrapper. It already includes:
- Padding: `px-4 py-20 sm:px-10`
- Full height: `h-full`

You can override or extend these styles:

```tsx
<WobbleCard 
  containerClassName="bg-blue-800"
  className="flex items-center justify-center"
>
  {/* Centered content */}
</WobbleCard>
```

### Default Styles
- Container background: `bg-indigo-800` (override with containerClassName)
- Border radius: `rounded-2xl`
- Overflow: `overflow-hidden`
- Complex box shadow for depth

## Animation Details

### Mouse Tracking
- The card translates based on mouse position
- Movement is divided by 20 for subtle effect
- Both outer container and inner content move in opposite directions
- Creates a parallax effect

### Transform Properties
- Container moves with the mouse
- Content moves against the mouse with slight scale (1.03)
- Smooth transitions with 0.1s ease-out
- Resets to origin when mouse leaves

### Noise Texture
- Applied as a background image overlay
- 10% opacity for subtlety
- Scaled to 120% to avoid edge visibility
- Radial mask for smooth edges

## Examples

### CTA Card
```tsx
<WobbleCard 
  containerClassName="bg-gradient-to-br from-blue-600 to-purple-700 min-h-[300px]"
>
  <h2 className="text-3xl font-bold text-white mb-4">
    Start Your Journey
  </h2>
  <p className="text-white/80 mb-6">
    Join thousands of developers building amazing things.
  </p>
  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
    Get Started
  </button>
</WobbleCard>
```

### Testimonial Card
```tsx
<WobbleCard containerClassName="bg-zinc-900 min-h-[200px]">
  <blockquote className="text-zinc-300">
    "This component adds a delightful interactive touch to our feature cards."
  </blockquote>
  <cite className="text-zinc-500 mt-4 block">
    - Happy Developer
  </cite>
</WobbleCard>
```

### Stats Card
```tsx
<WobbleCard containerClassName="bg-gradient-to-br from-green-800 to-emerald-900">
  <div className="text-center">
    <div className="text-5xl font-bold text-white mb-2">98%</div>
    <div className="text-green-200">Customer Satisfaction</div>
  </div>
</WobbleCard>
```

## Best Practices

1. **Performance**: The component uses CSS transforms which are GPU-accelerated
2. **Accessibility**: Ensure good color contrast for text content
3. **Mobile**: The wobble effect is mouse-based, so it won't work on touch devices
4. **Content**: Keep content concise for better visual impact
5. **Grid Layouts**: Use with CSS Grid for complex, responsive layouts

## Browser Support

Works in all modern browsers that support:
- CSS transforms
- Framer Motion
- CSS Grid (for layout examples)
- Radial gradients