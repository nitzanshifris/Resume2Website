# Images Slider

A full page slider with images that can be navigated with the keyboard. Perfect for hero sections, product showcases, and immersive landing pages.

## Features

- **Keyboard Navigation**: Use arrow keys to navigate between slides
- **Automatic Slideshow**: Configurable autoplay with 5-second intervals
- **3D Transitions**: Smooth scale and rotation animations
- **Image Preloading**: All images are preloaded for seamless transitions
- **Overlay Support**: Customizable overlay for better text visibility
- **Directional Transitions**: Choose between "up" or "down" slide transitions
- **Responsive Design**: Works across all screen sizes
- **Performance Optimized**: Efficient image loading and animations

## Installation

```bash
npm i motion clsx tailwind-merge
```

## Usage

```tsx
"use client";
import { motion } from "motion/react";
import React from "react";
import { ImagesSlider } from "../ui/images-slider";
 
export function ImagesSliderDemo() {
  const images = [
    "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  
  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          The hero section slideshow <br /> nobody asked for
        </motion.p>
        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Join now →</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  );
}
```

## Props

### ImagesSlider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| images | string[] | - | Array of image URLs to display in the slider |
| children | React.ReactNode | - | Content to overlay on the images |
| overlay | React.ReactNode | true | Whether to show an overlay on the images |
| overlayClassName | string | - | Additional CSS classes for the overlay |
| className | string | - | CSS classes for the slider container |
| autoplay | boolean | true | Auto-advance slides every 5 seconds |
| direction | "up" \| "down" | "up" | Direction of slide transitions |

## Variants

### Default
Full-featured slider with title, subtitle, and CTA button.

### Minimal
Clean design with just title and subtitle, no buttons.

### Product Showcase
Perfect for featuring products with dual CTAs and downward transitions.

### Dark Overlay
Heavy overlay for better text readability with manual navigation hints.

### Preview
Gallery-optimized variant with constrained height.

## Examples

### Basic Usage
```tsx
<ImagesSlider images={imageUrls}>
  <h1>Your Content Here</h1>
</ImagesSlider>
```

### With Custom Overlay
```tsx
<ImagesSlider 
  images={imageUrls}
  overlayClassName="bg-black/80"
>
  <h1>Enhanced Readability</h1>
</ImagesSlider>
```

### Manual Navigation Only
```tsx
<ImagesSlider 
  images={imageUrls}
  autoplay={false}
>
  <h1>Use Arrow Keys</h1>
</ImagesSlider>
```

### Downward Transitions
```tsx
<ImagesSlider 
  images={imageUrls}
  direction="down"
>
  <h1>Different Animation</h1>
</ImagesSlider>
```

## Keyboard Controls

- **→** (Right Arrow): Next slide
- **←** (Left Arrow): Previous slide

## Animation Details

### Initial Animation
- Scale: 0 → 1
- Opacity: 0 → 1
- RotateX: 45deg → 0deg
- Duration: 0.5s
- Easing: Custom cubic-bezier

### Exit Animations
- **Up Direction**: Slides exit upward (y: -150%)
- **Down Direction**: Slides exit downward (y: 150%)
- Duration: 1s

## Performance Considerations

- Images are preloaded before display
- Failed image loads are handled gracefully
- Efficient keyboard event listeners with cleanup
- Automatic interval cleanup on unmount

## Customization

### Container Sizing
Use the `className` prop to control the slider dimensions:
```tsx
<ImagesSlider className="h-screen" images={images}>
  {/* Full screen slider */}
</ImagesSlider>

<ImagesSlider className="h-96" images={images}>
  {/* Fixed height slider */}
</ImagesSlider>
```

### Content Positioning
The slider uses flexbox centering. Override with custom classes on your content:
```tsx
<ImagesSlider images={images}>
  <div className="absolute top-20 left-20">
    {/* Custom positioned content */}
  </div>
</ImagesSlider>
```

## Accessibility

- Keyboard navigation support
- Images include loading states
- Content remains accessible with z-index management
- Overlay can be disabled for better contrast if needed

## Best Practices

1. **Image Optimization**: Use appropriately sized images for web
2. **Loading States**: Consider showing a loader while images preload
3. **Content Contrast**: Ensure text is readable over all images
4. **Mobile Experience**: Test content sizing on smaller screens
5. **Performance**: Limit the number of images for better load times