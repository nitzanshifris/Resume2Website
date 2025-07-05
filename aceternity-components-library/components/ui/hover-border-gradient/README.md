# Hover Border Gradient

A hover effect that expands to the entire container with a gradient border. Perfect for buttons, links, and interactive elements.

## Features

- **Animated Gradient Border**: Continuously rotating gradient effect
- **Hover Interaction**: Gradient expands on hover
- **Customizable Direction**: Clockwise or counter-clockwise rotation
- **Flexible Element Type**: Can be used as button, link, or any HTML element
- **Responsive Design**: Works across all screen sizes
- **Dark Mode Support**: Built-in dark mode styling

## Installation

```bash
npm i motion clsx tailwind-merge
```

## Usage

```tsx
"use client";
import React from "react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
 
export function HoverBorderGradientDemo() {
  return (
    <div className="m-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <span>Aceternity UI</span>
      </HoverBorderGradient>
    </div>
  );
}
```

## Props

### HoverBorderGradient Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | - | Content to display inside the component |
| containerClassName | string | - | Additional CSS classes for the container |
| className | string | - | Additional CSS classes for the inner content |
| as | React.ElementType | "button" | The component type that will be used as the container |
| duration | number | 1 | Duration of the animation cycle in seconds |
| clockwise | boolean | true | Determines the direction of the gradient rotation |
| ...props | React.HTMLAttributes | - | Additional props to be spread over the container element |

## Variants

### Default Button
The standard button with icon and text.

### Minimal
Simple text-only button.

### Link
Styled as a link with arrow icon.

### Square
Square button with rounded corners instead of fully rounded.

## Examples

### Basic Usage
```tsx
<HoverBorderGradient>
  Click Me
</HoverBorderGradient>
```

### As a Link
```tsx
<HoverBorderGradient as="a" href="/about">
  Learn More
</HoverBorderGradient>
```

### Custom Duration
```tsx
<HoverBorderGradient duration={2}>
  Slower Animation
</HoverBorderGradient>
```

### Counter-Clockwise
```tsx
<HoverBorderGradient clockwise={false}>
  Reverse Direction
</HoverBorderGradient>
```

### Square Button
```tsx
<HoverBorderGradient containerClassName="rounded-lg">
  Square Button
</HoverBorderGradient>
```

## Animation Details

### Gradient Positions
The gradient rotates through 4 positions:
- TOP: 20.7% gradient at top
- LEFT: 16.6% gradient at left
- BOTTOM: 20.7% gradient at bottom
- RIGHT: 16.2% gradient at right

### Hover State
On hover, the gradient expands to a 75% radial gradient with blue color (#3275F8).

## Customization

### Container Styling
Use `containerClassName` to customize the container:
```tsx
<HoverBorderGradient containerClassName="rounded-md px-8 py-4">
  Custom Shape
</HoverBorderGradient>
```

### Inner Content Styling
Use `className` to style the inner content:
```tsx
<HoverBorderGradient className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
  Gradient Background
</HoverBorderGradient>
```

## Accessibility

- Supports keyboard navigation
- Maintains semantic HTML structure
- Respects the chosen element type (button, link, etc.)
- Provides visual feedback for interactions

## Performance Notes

- Uses CSS transforms for smooth animations
- Gradient animations are GPU-accelerated
- Minimal re-renders with controlled state management