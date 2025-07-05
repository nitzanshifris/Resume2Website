# Glare Card

A glare effect that happens on hover, as seen on Linear's website. The component creates a dynamic iridescent effect that follows the user's cursor movement.

## Features

- **Interactive Glare Effect**: Dynamic glare that follows cursor movement
- **3D Transform**: Card tilts based on mouse position
- **Holographic Background**: Multi-layered background with rainbow gradients
- **Smooth Animations**: CSS transitions for smooth hover states
- **Customizable Content**: Accept any React children
- **Responsive**: Works across different screen sizes

## Usage

```tsx
import { GlareCard } from "./glare-card";

export function Example() {
  return (
    <GlareCard className="flex flex-col items-center justify-center">
      <h2 className="text-white font-bold text-xl">Your Content</h2>
      <p className="text-neutral-200 mt-2">Description text</p>
    </GlareCard>
  );
}
```

## Variants

### Simple Card
Basic usage with icon and text content.

### Demo Grid
Multiple cards showcasing different content types including SVG icons, images, and text.

## Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| children | React.ReactNode | The content to be displayed inside the card | Yes |
| className | string | Additional CSS class names to apply to the card | No |

## Styling

The component uses CSS custom properties for dynamic styling:
- `--m-x`, `--m-y`: Mouse position percentages
- `--r-x`, `--r-y`: Rotation values
- `--bg-x`, `--bg-y`: Background position
- `--opacity`: Glare effect opacity
- `--duration`: Animation duration

## Examples

### With Icon
```tsx
<GlareCard className="flex flex-col items-center justify-center">
  <svg className="h-7 w-7 text-white" /* ... */>
    {/* SVG content */}
  </svg>
  <p className="text-white font-bold text-xl mt-4">Aceternity</p>
</GlareCard>
```

### With Image
```tsx
<GlareCard className="flex flex-col items-center justify-center">
  <img
    className="h-full w-full absolute inset-0 object-cover"
    src="your-image-url"
    alt="Description"
  />
</GlareCard>
```

### With Text Content
```tsx
<GlareCard className="flex flex-col items-start justify-end py-8 px-6">
  <p className="font-bold text-white text-lg">Title</p>
  <p className="font-normal text-base text-neutral-200 mt-4">
    Your description text here.
  </p>
</GlareCard>
```