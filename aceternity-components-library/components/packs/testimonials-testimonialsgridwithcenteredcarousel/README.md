# Testimonials Grid With Centered Carousel

A testimonials section with a grid and a centered animated carousel, providing strong social proof and trust for landing pages.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```
npm install motion clsx tailwind-merge @headlessui/react
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

1. Copy the `TestimonialsGridWithCenteredCarousel` component from `Testimonials/TestimonialsGridWithCenteredCarousel/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { TestimonialsGridWithCenteredCarousel } from "../../Testimonials/TestimonialsGridWithCenteredCarousel/code";

export default function Page() {
  return <TestimonialsGridWithCenteredCarousel />;
}
```

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [@headlessui/react](https://headlessui.com/) (for transitions)
- [next/image](https://nextjs.org/docs/pages/api-reference/components/image) (for optimized images)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 