# SVG Mask Effect Component

A mask reveal effect component that reveals hidden content when hovering over a container. Uses SVG masking to create a smooth circular reveal animation that follows the cursor.

## Features

- Smooth mask reveal animation following cursor
- Customizable mask sizes (default and hover states)
- Background color transitions on hover
- Support for any React content (text, components, etc.)
- Dark mode support
- Responsive design

## Usage

```tsx
import { MaskContainer } from "@/components/ui/svg-mask-effect";

export function MyComponent() {
  return (
    <MaskContainer
      revealText={
        <p className="text-4xl font-bold">
          This text is revealed on hover!
        </p>
      }
      className="h-[40rem] rounded-md border"
    >
      Hover over me to see the magic
    </MaskContainer>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | string \| ReactNode | undefined | The content that is always visible |
| revealText | string \| ReactNode | undefined | The content revealed on hover |
| size | number | 10 | Initial size of the mask circle in pixels |
| revealSize | number | 600 | Size of the mask circle when hovered |
| className | string | undefined | Additional CSS classes for the container |

## Important Setup

### Required SVG Mask File

The component requires a mask SVG file to be present in your public folder:

**Location:** `/public/mask.svg`

```svg
<svg
  width="1298"
  height="1298"
  viewBox="0 0 1298 1298"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle cx="649" cy="649" r="649" fill="black" />
</svg>
```

Make sure this file exists in your public directory for the mask effect to work properly.

## Variants

### Default
Standard mask effect with quote text reveal.

### Minimal
Simple hover-to-reveal with smaller mask sizes.

### Colorful
Features gradient backgrounds and colorful reveal content.

### Large
Larger mask area with more complex reveal content.

### Multiline
Multiple lines of text with quotes and descriptions.

## Styling

### Container Height
The default container uses `h-screen` but this can be overridden:
```tsx
<MaskContainer className="h-[40rem]">
```

### Background Colors
- Default state: White background
- Hover state: Dark slate background
- These transition smoothly on hover

### Text Styling
- Always visible text: White on dark background
- Revealed text: Dark on light background
- Automatically inverts in dark mode

## CSS Variables

The component uses CSS variables for colors:
- `var(--slate-900)`: Hover background color
- `var(--white)`: Default background color

Make sure these are defined in your CSS or Tailwind config.

## Customization Examples

### Small Precise Mask
```tsx
<MaskContainer
  size={20}
  revealSize={200}
  revealText={<p>Precise reveal</p>}
>
  Hover here
</MaskContainer>
```

### Large Dramatic Reveal
```tsx
<MaskContainer
  size={50}
  revealSize={1000}
  revealText={<h1 className="text-6xl">WOW!</h1>}
>
  Prepare to be amazed
</MaskContainer>
```

### With Complex Content
```tsx
<MaskContainer
  revealText={
    <div className="space-y-4">
      <h2 className="text-4xl">Title</h2>
      <p>Description</p>
      <button className="px-4 py-2 bg-blue-500 rounded">
        Action
      </button>
    </div>
  }
>
  Interactive content inside
</MaskContainer>
```

## Performance Considerations

- The component uses mouse move events which are throttled by the browser
- Mask position updates use CSS transforms for smooth performance
- Consider using smaller mask sizes for better performance on low-end devices

## Accessibility

- The revealed content is always in the DOM (just visually hidden)
- Screen readers can access both visible and revealed content
- Consider adding ARIA labels for better context