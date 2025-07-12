# Focus Cards Component

A beautiful card grid component that applies focus effects on hover, blurring non-hovered cards to create an elegant interaction.

## Usage

```tsx
import { FocusCards } from "@/components/ui/focus-cards";

const cards = [
  {
    title: "Forest Adventure",
    src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Valley of life",
    src: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function FocusCardsDemo() {
  return <FocusCards cards={cards} />;
}
```

## Features

- Smooth hover animations with focus/blur effects
- Responsive grid layout (1 column on mobile, 3 on desktop)
- Gradient text overlay on hover
- Memoized card components for performance
- Built-in default cards if none provided

## Props

### FocusCards
- `cards` (optional): Array of Card objects. If not provided, uses default cards.

### Card Object
- `title`: The title displayed on hover
- `src`: The image URL

## Styling

The component uses Tailwind CSS classes and can be customized by:
- Modifying the grid layout classes
- Adjusting hover effects and transitions
- Customizing the text overlay gradient