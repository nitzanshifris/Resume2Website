# Background Overlay Card

A card component with a background image that changes to a GIF overlay on hover, with a dark overlay for readability.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```bash
npm install clsx tailwind-merge
```

3. Add the utility file if it doesn't exist:

`lib/utils.ts`
```ts
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Usage

1. Copy the `CardDemo` component from `Cards/BackgroundOverlayCard/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { CardDemo } from "../../Cards/BackgroundOverlayCard/code";

export default function Page() {
  return <CardDemo />;
}
```

## Features
- Static background image with animated GIF overlay on hover
- Dark overlay for text readability
- Responsive design
- Dark mode support
- Customizable content and images

## Dependencies
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 