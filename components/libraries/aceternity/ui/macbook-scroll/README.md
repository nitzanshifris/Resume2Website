# Macbook Scroll

A 3D MacBook Pro animation component that responds to scroll. Features a realistic MacBook design with keyboard, trackpad, and screen that transforms as you scroll.

## Usage

```tsx
import { MacBookScroll } from "./macbook-scroll";

export default function Example() {
  return (
    <MacBookScroll
      src="/your-image.jpg"
      title="Your Title"
      showGradient={false}
      badge={<YourBadgeComponent />}
    />
  );
}
```

## Props

- `src`: Image source for the MacBook screen
- `title`: Title text or React node displayed above the MacBook
- `showGradient`: Whether to show gradient overlay on the screen
- `badge`: Optional badge component to display

## Features

- Scroll-triggered 3D transformations
- Realistic MacBook Pro design with keyboard and trackpad
- Customizable screen content
- Support for badges/overlays
- Responsive design with mobile optimizations