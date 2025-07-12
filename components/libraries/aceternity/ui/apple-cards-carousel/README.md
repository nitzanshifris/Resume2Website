# Apple Cards Carousel Component

A sleek and minimal carousel implementation inspired by Apple's design, featuring smooth animations and modal expansions.

## Usage

```tsx
import { Carousel, Card } from './apple-cards-carousel';

const data = [
  {
    category: "Technology",
    title: "Innovation Starts Here",
    src: "https://example.com/image.jpg",
    content: <YourContentComponent />
  },
  // Add more cards...
];

export function MyComponent() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return <Carousel items={cards} />;
}
```

## Components

### Carousel

The main container component that handles scrolling and navigation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | JSX.Element[] | required | Array of Card components to display |
| initialScroll | number | 0 | Initial scroll position in pixels |

### Card

Individual card component with modal expansion capability.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| card | Card | required | Card data object |
| index | number | required | Card index in the carousel |
| layout | boolean | false | Enable layout animations |

### BlurImage

Image component with blur loading effect.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | required | Image source URL |
| alt | string | "Background of a beautiful view" | Alt text |
| className | string | - | Additional CSS classes |
| fill | boolean | - | Fill the container |

## Card Type

```typescript
interface Card {
  src: string;      // Background image URL
  title: string;    // Card title
  category: string; // Category label
  content: ReactNode; // Modal content
}
```

## Features

- Smooth horizontal scrolling with navigation buttons
- Click to expand cards into full modals
- Escape key and outside click to close modals
- Optional layout animations for smooth transitions
- Mobile responsive design
- Dark mode support
- Lazy image loading with blur effect
- Accessibility features

## Variants

1. **Standard** - Basic carousel without layout animations
2. **With Layout** - Enhanced with smooth layout transitions between card and modal states