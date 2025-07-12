# Hero Highlight

A background effect with a text highlight component, perfect for hero sections.

## Features

- **Interactive Dot Pattern**: Mouse-following highlight effect on hover
- **Text Highlight Animation**: Animated text highlighting with gradient backgrounds
- **Dark Mode Support**: Different patterns and colors for light/dark themes
- **Fully Customizable**: Control container size, styles, and animations
- **Multiple Variants**: Different layouts for various use cases

## Installation

```bash
npm i motion clsx tailwind-merge
```

## Usage

```tsx
import React from "react";
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

export function HeroSection() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        Build amazing products with{" "}
        <Highlight className="text-black dark:text-white">
          highlighted text
        </Highlight>
      </motion.h1>
    </HeroHighlight>
  );
}
```

## Components

### HeroHighlight

The main container component that provides the interactive dot pattern background.

### Highlight

A text wrapper that animates a background highlight effect when the page loads.

## Variants

### Full Demo
The original demo with the complete Fight Club quote and animations.

### Preview
A compact version suitable for galleries and previews.

### Minimal
Simple implementation without motion animations.

### Multiple Highlights
Example with multiple highlighted text segments.

### Call to Action
Hero section with CTA button and multiple highlights.

## Props

### HeroHighlight Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | - | Content to display inside the component |
| className | string | - | CSS classes for the content wrapper |
| containerClassName | string | - | CSS classes for the container |

### Highlight Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | - | Text to highlight |
| className | string | - | Additional CSS classes |

## Examples

### Simple Hero Section
```tsx
<HeroHighlight>
  <h1 className="text-4xl font-bold text-center">
    Welcome to <Highlight>our platform</Highlight>
  </h1>
</HeroHighlight>
```

### With Multiple Highlights
```tsx
<HeroHighlight>
  <div className="text-center space-y-4">
    <h2 className="text-3xl font-bold">
      <Highlight>Build</Highlight> amazing products
    </h2>
    <p className="text-lg">
      Create stunning interfaces with{" "}
      <Highlight>animated highlights</Highlight>
    </p>
  </div>
</HeroHighlight>
```

### Constrained Container
```tsx
<HeroHighlight containerClassName="h-96 w-full rounded-lg overflow-hidden">
  <h1 className="text-3xl font-bold">
    Contained <Highlight>hero section</Highlight>
  </h1>
</HeroHighlight>
```

## Customization

### Container Height
Use the `containerClassName` prop to control the container size:
```tsx
<HeroHighlight containerClassName="h-screen"> // Full screen
<HeroHighlight containerClassName="h-96">     // Fixed height
<HeroHighlight containerClassName="h-[50vh]"> // Half viewport
```

### Highlight Colors
Override the highlight gradient with custom classes:
```tsx
<Highlight className="bg-gradient-to-r from-blue-300 to-purple-300">
  Custom colors
</Highlight>
```

### Pattern Customization
The component uses SVG patterns that can be customized by modifying the `dotPatterns` object in the source code.