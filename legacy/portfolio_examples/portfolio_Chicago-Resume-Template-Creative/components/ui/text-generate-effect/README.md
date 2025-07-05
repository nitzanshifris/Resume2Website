# Text Generate Effect

A cool text effect that fades in text on page load, one by one. Perfect for hero sections and content reveals.

## Features

- **Stagger Animation**: Words appear sequentially with customizable timing
- **Blur Effect**: Optional blur-to-focus transition for dramatic effect
- **Customizable Duration**: Control animation speed per word
- **Dark Mode Support**: Automatically adapts to light/dark themes
- **TypeScript Support**: Fully typed with TypeScript
- **Responsive**: Works on all screen sizes

## Installation

```bash
npm install motion clsx tailwind-merge
```

## Usage

```tsx
import { TextGenerateEffect } from "./text-generate-effect";

const words = "Your amazing text content that will animate beautifully";

export function MyComponent() {
  return (
    <TextGenerateEffect 
      words={words}
      duration={0.8}
      filter={true}
      className="text-center"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `words` | `string` | - | The text to animate (required) |
| `className` | `string` | - | Additional CSS classes |
| `duration` | `number` | `0.5` | Animation duration per word in seconds |
| `filter` | `boolean` | `true` | Whether to apply blur effect |

## Examples

### Basic Usage
```tsx
<TextGenerateEffect words="Hello world, this is amazing!" />
```

### Without Blur Effect
```tsx
<TextGenerateEffect 
  words="Clean text animation without blur" 
  filter={false} 
/>
```

### Custom Timing
```tsx
<TextGenerateEffect 
  words="Slow and dramatic reveal" 
  duration={1.2} 
/>
```

### Custom Styling
```tsx
<TextGenerateEffect 
  words="Custom styled text" 
  className="text-4xl text-blue-500 font-light"
/>
```

## Animation Details

- **Stagger Delay**: 0.2 seconds between words
- **Initial State**: Opacity 0, blur 10px (if filter enabled)
- **Final State**: Opacity 1, no blur
- **Easing**: Smooth motion transitions

## Best Practices

1. **Text Length**: Works best with 10-50 words
2. **Performance**: Avoid very long text blocks
3. **Accessibility**: Consider users with motion sensitivity
4. **Timing**: Adjust duration based on text length
5. **SEO**: Text remains accessible to search engines

## Browser Support

Works in all modern browsers that support:
- CSS Filter effects
- CSS Transforms
- JavaScript ES6+