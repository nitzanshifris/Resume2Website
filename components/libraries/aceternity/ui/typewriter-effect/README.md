# Typewriter Effect

Text generates as if it is being typed on the screen.

## Features

- **Two Variants**: TypewriterEffect and TypewriterEffectSmooth
- **Smooth Animation**: Text appears with typing effect
- **Customizable Cursor**: Blinking cursor with custom styling
- **Per-Word Styling**: Individual word styling support
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Built-in dark mode styles

## Installation

```bash
npm install motion clsx tailwind-merge
```

## Usage

### TypewriterEffectSmooth (Recommended)

```tsx
import { TypewriterEffectSmooth } from "./typewriter-effect";

const words = [
  {
    text: "Build",
  },
  {
    text: "awesome",
  },
  {
    text: "apps",
  },
  {
    text: "with",
  },
  {
    text: "Aceternity.",
    className: "text-blue-500 dark:text-blue-500",
  },
];

export function MyComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />
    </div>
  );
}
```

### TypewriterEffect (Janky Animation)

```tsx
import { TypewriterEffect } from "./typewriter-effect";

const words = [
  {
    text: "Build",
  },
  {
    text: "awesome",
  },
  {
    text: "apps",
  },
  {
    text: "with",
  },
  {
    text: "Aceternity.",
    className: "text-blue-500 dark:text-blue-500",
  },
];

export function MyComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-base mb-10">
        The road to freedom starts from here
      </p>
      <TypewriterEffect words={words} />
    </div>
  );
}
```

## Props

### TypewriterEffect & TypewriterEffectSmooth

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `words` | `Word[]` | - | Array of word objects with text and optional className (required) |
| `className` | `string` | - | Additional CSS classes for the container |
| `cursorClassName` | `string` | - | Additional CSS classes for the cursor |

### Word Object

```typescript
interface Word {
  text: string;
  className?: string;
}
```

## Examples

### Basic Usage
```tsx
const words = [
  { text: "Hello" },
  { text: "World" },
];

<TypewriterEffectSmooth words={words} />
```

### With Custom Styling
```tsx
const words = [
  {
    text: "Welcome",
    className: "text-purple-500",
  },
  {
    text: "to",
  },
  {
    text: "our",
  },
  {
    text: "platform!",
    className: "text-blue-500 font-bold",
  },
];

<TypewriterEffectSmooth 
  words={words}
  className="text-2xl"
  cursorClassName="bg-red-500"
/>
```

### Hero Section
```tsx
const heroWords = [
  { text: "Create" },
  { text: "beautiful" },
  { text: "websites" },
  { text: "with" },
  { text: "ease.", className: "text-blue-500" },
];

<div className="flex flex-col items-center justify-center h-screen">
  <TypewriterEffectSmooth words={heroWords} />
  <div className="flex gap-4 mt-8">
    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">
      Get Started
    </button>
    <button className="px-6 py-2 border border-gray-300 rounded-lg">
      Learn More
    </button>
  </div>
</div>
```

### Marketing Copy
```tsx
const marketingWords = [
  { text: "Boost" },
  { text: "your" },
  { text: "productivity" },
  { text: "by" },
  { text: "300%", className: "text-green-500 font-bold" },
];

<TypewriterEffectSmooth words={marketingWords} />
```

## Styling

### Default Styles
- **Container**: Responsive text sizes from base to 5xl
- **Cursor**: Blue blinking cursor (4px width)
- **Animation**: 2-second reveal with 1-second delay

### Customization
- Use `className` prop to override container styles
- Use `cursorClassName` prop to customize cursor appearance
- Use `word.className` to style individual words

## Technical Details

### TypewriterEffectSmooth
- Smooth width animation from 0% to fit-content
- Linear easing with 2-second duration
- 1-second delay before animation starts
- Uses `whileInView` trigger

### TypewriterEffect
- Character-by-character reveal animation
- Staggered animation with 0.1s delay between characters
- Uses `useInView` and `useAnimate` for precise control
- More "janky" appearance for retro effect

### Performance
- Optimized for large amounts of text
- Efficient character splitting and rendering
- Smooth 60fps animations

## Accessibility

- Text remains readable by screen readers
- Animations respect `prefers-reduced-motion`
- Semantic HTML structure maintained
- Keyboard navigation friendly

## Browser Support

Works in all modern browsers that support:
- CSS transforms and transitions
- Framer Motion
- CSS flexbox
- Viewport intersection detection

## Common Use Cases

- Hero section headlines
- Marketing copy reveals
- Product announcements
- Loading states with text
- Interactive storytelling
- Call-to-action emphasis