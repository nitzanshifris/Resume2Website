# Sticky Banner Component

A banner component that sticks to the top of its container and can optionally hide when the user scrolls down. Perfect for announcements, notifications, and important messages.

## Features

- Sticky positioning at the top of container
- Smooth animations on appear/disappear
- Optional hide-on-scroll behavior
- Built-in close button with animation
- Customizable styling through className prop
- Responsive and accessible

## Usage

```tsx
import { StickyBanner } from "@/components/ui/sticky-banner";

export function MyComponent() {
  return (
    <div className="relative h-screen overflow-y-auto">
      <StickyBanner className="bg-gradient-to-b from-blue-500 to-blue-600">
        <p className="text-white">
          Announcing our new feature!{" "}
          <a href="#" className="underline">Learn more</a>
        </p>
      </StickyBanner>
      
      {/* Your scrollable content */}
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | undefined | Optional CSS class to apply to the banner |
| children | React.ReactNode | Required | Content to display inside the banner |
| hideOnScroll | boolean | false | When true, hides the banner after scrolling down 40px |

## Variants

### Default Banner
Standard sticky banner that remains visible while scrolling.

### Hide on Scroll
Banner that automatically hides when user scrolls down more than 40px.
```tsx
<StickyBanner hideOnScroll={true}>
  {/* content */}
</StickyBanner>
```

### Color Variants
Use different gradients for various purposes:
- Blue: Announcements
- Purple: Features
- Dark: System messages
- Green: Success messages
- Yellow: Warnings or promotions

## Styling

The component accepts a `className` prop for custom styling. Common patterns:

```tsx
// Gradient backgrounds
<StickyBanner className="bg-gradient-to-b from-blue-500 to-blue-600">

// Solid colors
<StickyBanner className="bg-blue-600">

// With backdrop blur
<StickyBanner className="bg-white/90 backdrop-blur-sm">
```

## Container Requirements

The parent container should have:
- `position: relative`
- `overflow-y: auto` or `overflow-y: scroll`
- A defined height (e.g., `h-screen`, `h-[60vh]`)

## Accessibility

- The close button is keyboard accessible
- Banner content should be concise and clear
- Links within the banner should have sufficient contrast
- Consider using appropriate ARIA attributes for important announcements