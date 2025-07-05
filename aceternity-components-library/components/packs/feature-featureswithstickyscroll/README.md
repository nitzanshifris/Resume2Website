# Features Section with Sticky Scroll

A feature section with sticky scroll and animated backgrounds, ideal for showcasing advanced product features with visuals and smooth transitions.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```
npm install motion @tabler/icons-react clsx tailwind-merge next
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

1. Copy the `FeaturesWithStickyScroll` component from `Feature sections/FeaturesWithStickyScroll/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { FeaturesWithStickyScroll } from "../../Feature sections/FeaturesWithStickyScroll/code";

export default function Page() {
  return <FeaturesWithStickyScroll />;
}
```

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [@tabler/icons-react](https://tabler-icons.io/) (for icons)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [next/image](https://nextjs.org/docs/pages/api-reference/components/image) (for optimized images)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 