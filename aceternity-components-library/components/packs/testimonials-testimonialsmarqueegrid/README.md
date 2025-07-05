# Testimonials Marquee Grid

A testimonials section with a horizontally scrolling marquee grid, providing dynamic social proof for landing pages.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```
npm install motion clsx tailwind-merge react-fast-marquee
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

1. Copy the `TestimonialsMarqueeGrid` component from `Testimonials/TestimonialsMarqueeGrid/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { TestimonialsMarqueeGrid } from "../../Testimonials/TestimonialsMarqueeGrid/code";

export default function Page() {
  return <TestimonialsMarqueeGrid />;
}
```

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [react-fast-marquee](https://www.npmjs.com/package/react-fast-marquee) (for marquee effect)
- [next/image](https://nextjs.org/docs/pages/api-reference/components/image) (for optimized images)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 