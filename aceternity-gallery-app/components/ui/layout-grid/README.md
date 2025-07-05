# Layout Grid

A layout effect that animates the grid item on click, powered by Framer Motion layout. Perfect for portfolios, product showcases, and interactive content galleries.

## Features

- **Interactive Grid**: Click any card to expand it with smooth animations
- **Framer Motion Layout**: Uses `layoutId` for seamless shared element transitions
- **Responsive Design**: Adapts from single column to 3-column grid
- **Customizable Cards**: Flexible content, styling, and grid positioning
- **Overlay Effect**: Background overlay when card is expanded
- **Smooth Animations**: Natural easing and timing for professional feel
- **Click Outside**: Click outside expanded card to close it

## Installation

```bash
npm i motion clsx tailwind-merge
```

## Usage

```tsx
import { LayoutGrid } from "@/components/ui/layout-grid";

const cards = [
  {
    id: 1,
    content: <div>Your content here</div>,
    className: "md:col-span-2",
    thumbnail: "https://example.com/image.jpg",
  },
  {
    id: 2,
    content: <div>Another card</div>,
    className: "col-span-1",
    thumbnail: "https://example.com/image2.jpg",
  },
];

export function MyLayoutGrid() {
  return (
    <div className="h-screen py-20 w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}
```

## Props

### LayoutGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| cards | `Card[]` | - | Array of card objects to display in the grid |

### Card Object

| Property | Type | Description |
|----------|------|-------------|
| id | `number` | Unique identifier for the card |
| content | `React.ReactElement \| React.ReactNode \| string` | Content to display when card is expanded |
| className | `string` | CSS classes for grid positioning (e.g., "md:col-span-2") |
| thumbnail | `string` | URL of the thumbnail image |

## Variants

### Default
The original house-themed layout with beautiful nature images.

### Portfolio
Technology and project-focused cards perfect for showcasing work.

### Products
Product and service cards ideal for business presentations.

## Grid Layout Classes

The component uses CSS Grid with these common patterns:

- `col-span-1` - Takes 1 column (default)
- `md:col-span-2` - Takes 2 columns on medium screens and up
- `md:col-span-3` - Takes 3 columns (full width) on medium screens and up

## Examples

### Basic Portfolio Grid
```tsx
const portfolioCards = [
  {
    id: 1,
    content: (
      <div>
        <h2 className="text-2xl font-bold text-white">Project Alpha</h2>
        <p className="text-neutral-200">Description of your project...</p>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail: "project-image.jpg",
  },
  // ... more cards
];

<LayoutGrid cards={portfolioCards} />
```

### Product Showcase
```tsx
const productCards = [
  {
    id: 1,
    content: (
      <div>
        <h2 className="text-2xl font-bold text-white">Pro Plan</h2>
        <p className="text-neutral-200">Advanced features for power users</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Get Started
        </button>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail: "product-image.jpg",
  },
];

<LayoutGrid cards={productCards} />
```

### Custom Content
```tsx
const CustomContent = () => (
  <div className="space-y-4">
    <h2 className="text-3xl font-bold text-white">Custom Card</h2>
    <p className="text-neutral-200">Any React component can go here</p>
    <div className="flex gap-2">
      <button className="px-3 py-1 bg-green-600 text-white rounded">Action 1</button>
      <button className="px-3 py-1 bg-blue-600 text-white rounded">Action 2</button>
    </div>
  </div>
);

const cards = [
  {
    id: 1,
    content: <CustomContent />,
    className: "md:col-span-2",
    thumbnail: "custom-image.jpg",
  },
];
```

## Animation Details

The component uses Framer Motion's `layoutId` feature for shared element transitions:

- **Card Expansion**: Smooth transition from grid position to centered modal
- **Image Animation**: Thumbnail scales and repositions during expansion
- **Content Animation**: Fades in content with upward motion
- **Background Overlay**: Subtle fade to dark background
- **Exit Animation**: Smooth return to grid position

### Key Animation Features
- `layoutId` for seamless card transitions
- Staggered content animations
- Natural easing curves
- Responsive to user interactions

## Customization

### Grid Layout
Modify the grid structure by changing the container classes:
```tsx
// Custom grid layout
<div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 max-w-7xl mx-auto gap-4 relative">
```

### Card Styling
Customize individual card appearance:
```tsx
const card = {
  id: 1,
  content: <YourContent />,
  className: "md:col-span-2 custom-card-class",
  thumbnail: "image.jpg",
};
```

### Animation Timing
Adjust animation duration and easing:
```tsx
// In the SelectedCard component
transition={{
  duration: 0.5,  // Custom duration
  ease: "easeOut", // Custom easing
}}
```

### Background Overlay
Modify the overlay effect:
```tsx
// Custom overlay opacity and color
<motion.div
  animate={{ opacity: selected?.id ? 0.5 : 0 }}
  className="absolute h-full w-full left-0 top-0 bg-blue-900 opacity-0 z-10"
/>
```

## Responsive Behavior

- **Mobile (< 768px)**: Single column layout
- **Tablet (≥ 768px)**: 3-column grid with `md:col-span-*` classes
- **Desktop**: Maintains 3-column grid with larger spacing

## Accessibility

- **Keyboard Navigation**: Cards are clickable and keyboard accessible
- **Screen Readers**: Proper alt text for images
- **Focus Management**: Visible focus indicators
- **ARIA Labels**: Semantic markup for better accessibility

## Performance Notes

- **Layout Animations**: GPU-accelerated via Framer Motion
- **Image Loading**: Images load on-demand
- **Efficient Re-renders**: Optimized state management
- **Memory Usage**: Minimal overhead for animations

## Best Practices

1. **Image Optimization**: Use optimized images (WebP, proper sizing)
2. **Content Length**: Keep expanded content concise for better UX
3. **Grid Balance**: Mix different `col-span` values for visual interest
4. **Loading States**: Consider loading states for images
5. **Error Handling**: Handle missing images gracefully
6. **Performance**: Limit the number of cards for optimal performance

## Common Use Cases

- **Portfolio Galleries**: Showcase projects and work samples
- **Product Catalogs**: Display products with detailed information
- **Feature Showcases**: Highlight key features or services
- **Image Galleries**: Interactive photo galleries
- **Content Cards**: Blog posts, articles, or case studies
- **Team Profiles**: Staff or team member showcases