# Infinite Moving Cards

A customizable group of cards that move infinitely in a loop. Made with Framer Motion and Tailwind CSS.

## Features

- **Infinite Loop**: Cards seamlessly loop without gaps
- **Customizable Speed**: Choose from fast, normal, or slow animation speeds
- **Bidirectional**: Animate cards left or right
- **Pause on Hover**: Optional hover interaction to pause scrolling
- **Responsive Design**: Works across all screen sizes
- **Dark Mode Support**: Built-in dark mode styling
- **Smooth Animation**: CSS-based animation for optimal performance

## Installation

```bash
npm i motion clsx tailwind-merge
```

### Add Tailwind CSS Animation

Add the following to your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
      animation: {
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
    },
  },
}
```

## Usage

```tsx
"use client";
 
import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
 
export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}
 
const testimonials = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    title: "Hamlet",
  },
  // ... more testimonials
];
```

## Props

### InfiniteMovingCards Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | `{ quote: string; name: string; title: string; }[]` | - | Array of testimonial items to display |
| direction | `"left" \| "right"` | `"left"` | Direction of the scrolling animation |
| speed | `"fast" \| "normal" \| "slow"` | `"fast"` | Speed of the scrolling animation |
| pauseOnHover | `boolean` | `true` | Whether to pause animation on hover |
| className | `string` | - | Additional CSS classes for the container |

## Variants

### Default
Standard configuration with right direction and slow speed.

### Preview
Gallery-optimized variant with constrained height and normal speed.

### Fast Speed
Demonstrates the fast speed setting with modern testimonials.

### Reverse Direction
Shows cards moving in the opposite direction with tech quotes.

### No Pause
Continuous animation that doesn't pause on hover.

## Examples

### Basic Usage
```tsx
<InfiniteMovingCards items={testimonials} />
```

### Right Direction with Slow Speed
```tsx
<InfiniteMovingCards 
  items={testimonials}
  direction="right"
  speed="slow"
/>
```

### Fast Speed Without Pause
```tsx
<InfiniteMovingCards 
  items={testimonials}
  speed="fast"
  pauseOnHover={false}
/>
```

### Custom Styling
```tsx
<InfiniteMovingCards 
  items={testimonials}
  className="max-w-4xl"
/>
```

## Animation Details

### Speed Settings
- **Fast**: 20 seconds per cycle
- **Normal**: 40 seconds per cycle
- **Slow**: 80 seconds per cycle

### Direction
- **Left**: Cards move from right to left (default)
- **Right**: Cards move from left to right

### Technical Implementation
- Uses CSS custom properties for dynamic speed and direction
- Duplicates items for seamless looping
- Applies mask gradient for smooth fade at edges

## Customization

### Card Styling
The component uses predefined card styles with:
- Rounded corners (rounded-2xl)
- Border styling with dark mode support
- Gradient background
- Padding for content

### Container Width
The container has a max-width of 7xl by default. Override with className prop:
```tsx
<InfiniteMovingCards className="max-w-4xl" items={items} />
```

### Animation Timing
Customize animation duration by modifying CSS variables:
```css
.custom-speed {
  --animation-duration: 60s;
}
```

## Item Structure

Each item in the array should follow this structure:
```typescript
{
  quote: string;    // The main content/testimonial text
  name: string;     // Person's name or source
  title: string;    // Title, position, or attribution
}
```

## Accessibility

- Uses semantic HTML with blockquote elements
- Respects user's prefers-reduced-motion setting
- Pauseable animation for better readability
- High contrast text for readability

## Performance Notes

- CSS-based animation for smooth 60fps performance
- Minimal JavaScript for initialization
- Efficient DOM cloning for infinite loop
- No re-renders during animation

## Best Practices

1. **Content Length**: Keep quotes reasonably short for better readability
2. **Number of Items**: Use at least 3-4 items for smooth looping
3. **Container Height**: Ensure adequate height for card visibility
4. **Speed Selection**: Choose speed based on content length
5. **Responsive Design**: Test on various screen sizes