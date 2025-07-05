# Meteors

A group of beams in the background of a container, sort of like meteors. Creates an animated meteor shower effect.

## Usage

```tsx
import { Meteors } from "./meteors";

export default function Example() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-lg border p-8">
        {/* Your content here */}
        <h1>Content with meteor effect</h1>
        
        {/* Add meteor effect */}
        <Meteors number={20} />
      </div>
    </div>
  );
}
```

## Props

- `number`: Number of meteors to display (default: 20)
- `className`: Additional CSS classes for styling

## Features

- Animated meteor shower effect
- Customizable number of meteors
- Random delay and duration for natural effect
- Smooth opacity transitions
- Gradient trail effect