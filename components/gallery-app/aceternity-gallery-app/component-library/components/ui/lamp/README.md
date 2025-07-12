# Lamp

A lamp effect as seen on Linear, great for section headers. Creates a beautiful lighting effect with conic gradients and smooth animations.

## Features

- **Stunning Visual Effect**: Beautiful lamp effect with conic gradients
- **Smooth Animations**: Motion animations with `whileInView` triggers
- **Customizable Content**: Pass any React children to display under the lamp
- **Responsive Design**: Works across all screen sizes
- **Dark Mode Optimized**: Designed for dark backgrounds
- **Multiple Variants**: Different styles and sizes available

## Installation

```bash
npm i motion clsx tailwind-merge
```

## Usage

```tsx
import { LampDemo, LampContainer } from "@/components/ui/lamp";

export function MyLampSection() {
  return (
    <LampContainer>
      <h1 className="text-4xl font-bold text-white">
        Your Amazing Content
      </h1>
    </LampContainer>
  );
}
```

## Props

### LampContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `React.ReactNode` | - | Content to display under the lamp effect |
| className | `string` | - | Additional CSS classes for the container |

### LampDemo Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string` | "Build lamps" | Main title text |
| subtitle | `string` | "the right way" | Subtitle text |
| className | `string` | - | Additional CSS classes for the text |
| containerClassName | `string` | - | Additional CSS classes for the container |

## Variants

### Default
The standard lamp effect with animated conic gradients and responsive text.

### Gallery Preview
Optimized for gallery display with constrained height and smaller text.

### Simple
A simplified version with basic styling and blue-purple gradient text.

### Colorful
Features pink and purple gradients for a more vibrant look.

### Minimal
Clean, minimal version with subtle white light effect.

## Examples

### Basic Usage
```tsx
<LampDemo />
```

### Custom Content
```tsx
<LampContainer>
  <div className="text-center">
    <h1 className="text-6xl font-bold text-white mb-4">
      Welcome
    </h1>
    <p className="text-gray-300 text-xl">
      To our amazing platform
    </p>
  </div>
</LampContainer>
```

### Custom Styling
```tsx
<LampDemo 
  title="Custom Title"
  subtitle="Custom Subtitle"
  className="text-blue-300"
  containerClassName="h-96"
/>
```

### Gallery Variants
```tsx
<LampSimple title="Beautiful Design" />
<LampColorful title="Creative" subtitle="Solutions" />
<LampMinimal title="Clean & Simple" />
```

## Animation Details

The component uses Framer Motion for smooth animations:

- **Initial State**: Reduced opacity and translated position
- **Animation Trigger**: `whileInView` for viewport-based animations
- **Easing**: "easeInOut" for natural motion
- **Timing**: Staggered delays for layered effect

### Key Animation Features
- Expanding lamp beam width
- Fading in content from below
- Smooth gradient transitions
- Responsive to viewport entry

## Technical Implementation

### Conic Gradients
Uses CSS conic gradients with custom positioning:
```css
background-image: conic-gradient(var(--conic-position), var(--tw-gradient-stops))
--conic-position: from_70deg_at_center_top
```

### Masking Effects
Applies gradient masks for smooth edge transitions:
```css
mask-image: linear-gradient(to_top, white, transparent)
```

### Blur Effects
Multiple blur layers create depth and atmosphere:
- Background blur for depth
- Gradient blurs for light diffusion
- Backdrop blur for glass effect

## Customization

### Colors
Modify the gradient colors by changing the Tailwind classes:
```tsx
// Change from cyan to purple
className="bg-gradient-conic from-purple-500 via-transparent to-transparent"
```

### Size
Adjust the lamp size by modifying dimensions:
```tsx
// Smaller lamp
className="h-32 w-[20rem]"
```

### Animation Speed
Customize animation timing:
```tsx
transition={{
  delay: 0.5,
  duration: 1.2,
  ease: "easeInOut",
}}
```

## Accessibility

- Uses semantic HTML with proper heading structure
- Respects `prefers-reduced-motion` settings
- High contrast text for readability
- Keyboard navigation friendly

## Performance Notes

- Uses CSS transforms for smooth 60fps animations
- Minimal JavaScript for optimal performance
- Efficient gradient rendering
- Viewport-based animation triggers reduce unnecessary renders

## Best Practices

1. **Background**: Use on dark backgrounds for best effect
2. **Content**: Keep text content concise and impactful
3. **Spacing**: Allow adequate space around the component
4. **Responsive**: Test on various screen sizes
5. **Performance**: Use sparingly on pages with many animations