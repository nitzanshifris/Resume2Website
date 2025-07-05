# Moving Border

A border that moves around the container. Perfect for making your buttons stand out.

## Usage

```tsx
import { Button } from "./moving-border";

export default function Example() {
  return (
    <Button
      borderRadius="1.75rem"
      className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
    >
      Borders are cool
    </Button>
  );
}
```

## Props

- `borderRadius`: Border radius of the button (default: "1.75rem")
- `children`: The content to be displayed inside the button
- `as`: HTML element or React component to use (default: "button")
- `containerClassName`: Additional CSS classes for the container
- `borderClassName`: Additional CSS classes for the border
- `duration`: Duration for the moving border animation in milliseconds (default: 3000)
- `className`: Additional CSS classes for the button

## Features

- Animated moving border effect
- Customizable border radius
- Configurable animation duration
- Support for different HTML elements
- Full TypeScript support