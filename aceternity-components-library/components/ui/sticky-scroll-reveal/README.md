# Sticky Scroll Reveal Component

A sticky container component that reveals content based on scroll position. As users scroll through text sections, the sticky content on the right updates to match the active section with smooth animations.

## Features

- Scroll-triggered content reveal
- Sticky content container
- Smooth opacity transitions
- Dynamic background gradients
- Responsive design (hidden on mobile)
- Customizable content styling

## Usage

```tsx
import { StickyScroll } from "./sticky-scroll-reveal";

const content = [
  {
    title: "First Section",
    description: "Description for the first section...",
    content: (
      <div className="flex h-full w-full items-center justify-center">
        Your content here
      </div>
    ),
  },
  // Add more sections...
];

export function MyComponent() {
  return (
    <div className="w-full py-4">
      <StickyScroll content={content} />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| content | `StickyScrollContent[]` | Required | Array of content sections with title, description, and visual content |
| contentClassName | string | undefined | Optional className for the sticky content container |

## Content Object Structure

Each content object should have:
- `title` (string): The section heading
- `description` (string): The section description text
- `content` (ReactNode, optional): The visual content to display in the sticky container

## Important Notes

### Missing Assets
The original demo references `/linear.webp` which may not exist in your project. Replace with your own images or use the alternative demos that use SVG icons and gradient backgrounds.

### Container Requirements
- The component creates its own scrollable container
- Default height is `h-[30rem]` (30rem)
- To use page scroll instead, uncomment line 22 and comment line 23 in the base component

### Responsive Behavior
- The sticky content is hidden on mobile (`hidden lg:block`)
- Text content remains visible and scrollable on all screen sizes

## Variants

### Default Demo
Basic implementation with gradient backgrounds and placeholder image.

### Portfolio Demo
Professional portfolio showcase with SVG icons representing different aspects of work.

### Product Demo
Product feature showcase with data visualizations and icons.

### Custom Styling Demo
Example showing how to customize the sticky content container styling.

## Styling

### Background Colors
The component cycles through three background colors:
- `#0f172a` (slate-900)
- `#000000` (black)
- `#171717` (neutral-900)

### Gradient Backgrounds
The sticky content cycles through three gradients:
- Cyan to Emerald
- Pink to Indigo
- Orange to Yellow

### Text Styling
- Active section: Full opacity
- Inactive sections: 30% opacity
- Smooth transitions between states

## Customization

### Custom Content Container
```tsx
<StickyScroll 
  content={content} 
  contentClassName="rounded-2xl border border-neutral-200"
/>
```

### Page-wide Scroll
To make the component respond to page scroll instead of container scroll:
1. Open the base component file
2. Uncomment `target: ref` (line 22)
3. Comment out `container: ref` (line 23)

## Best Practices

1. Keep descriptions concise but informative
2. Ensure visual content has good contrast
3. Use consistent styling across content sections
4. Test on various screen sizes
5. Consider accessibility for screen readers