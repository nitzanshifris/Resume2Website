# Animated Testimonials Component

A beautiful testimonials showcase component with smooth animations and 3D effects.

## Usage

```tsx
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';

const testimonials = [
  {
    quote: "Amazing product that transformed our workflow!",
    name: "John Doe",
    designation: "CEO at Company",
    src: "https://example.com/avatar.jpg"
  },
  // Add more testimonials...
];

export function MyComponent() {
  return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />;
}
```

## Props

### AnimatedTestimonials

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| testimonials | Testimonial[] | required | Array of testimonial objects |
| autoplay | boolean | false | Enable automatic rotation every 5 seconds |

### Testimonial Type

```typescript
interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}
```

## Features

- Smooth card rotation animations
- Word-by-word text reveal effect
- Image stack with 3D perspective
- Navigation controls
- Autoplay option
- Dark mode support
- Responsive design

## Variants

1. **Standard** - Manual navigation testimonials
2. **Autoplay** - Automatic rotation testimonials