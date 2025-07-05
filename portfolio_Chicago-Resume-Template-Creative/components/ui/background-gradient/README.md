# Background Gradient Component

An animated gradient that sits at the background of a card, button or anything. Perfect for creating eye-catching UI elements with dynamic gradient animations.

## Features

- Animated gradient background with customizable animation
- Static gradient option (animate=false)
- Hover effects with opacity changes
- Fully customizable styling
- Dark mode compatible
- TypeScript support

## Usage

### Basic Usage

```tsx
import { BackgroundGradient } from "./background-gradient-base";

function MyComponent() {
  return (
    <BackgroundGradient className="rounded-[22px] p-4 bg-white dark:bg-zinc-900">
      <p>Your content here</p>
    </BackgroundGradient>
  );
}
```

### Available Variants

1. **Product Card** (`background-gradient-product-card.tsx`)
   - E-commerce product showcase with image, description, and buy button
   - Perfect for product listings and featured items

2. **Feature Card** (`background-gradient-feature-card.tsx`)
   - Service/feature presentation with icon, title, and feature list
   - Great for pricing cards and feature showcases

3. **Profile Card** (`background-gradient-profile-card.tsx`)
   - User profile card with avatar, bio, and social links
   - Ideal for team pages and author profiles

4. **Minimal** (`background-gradient-minimal.tsx`)
   - Simple gradient background with minimal content
   - Perfect for subtle accents and backgrounds

5. **Static** (`background-gradient-static.tsx`)
   - Non-animated version of the gradient
   - Good for performance-sensitive applications

## Props

### BackgroundGradient Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | undefined | The content to be rendered within the gradient background |
| className | string | undefined | CSS class for the inner div |
| containerClassName | string | undefined | CSS class for the outermost div |
| animate | boolean | true | Whether the gradient should animate |

## Styling Notes

- The component uses a complex radial gradient with multiple color stops
- Animation moves the background position creating a flowing effect
- Hover effects increase opacity from 60% to 100%
- The gradient includes colors: teal (#00ccb1), purple (#7b61ff), yellow (#ffc414), and blue (#1ca0fb)
- Uses `will-change-transform` for better animation performance

## Customization

### Custom Colors

To customize the gradient colors, modify the `bg-[radial-gradient(...)]` classes in the component:

```tsx
// Example with custom colors
className="bg-[radial-gradient(circle_farthest-side_at_0_100%,#ff0000,transparent),radial-gradient(circle_farthest-side_at_100%_0,#00ff00,transparent)]"
```

### Animation Speed

Adjust the animation duration in the transition prop:

```tsx
transition={{
  duration: 3, // Faster animation
  repeat: Infinity,
  repeatType: "reverse",
}}
```

## Dependencies

- motion (framer-motion)
- @/lib/utils (cn function)
- @tabler/icons-react (for variant examples)
- React 18+