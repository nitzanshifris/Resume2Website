# Three Column Bento Grid

A bento grid layout with three columns, animated skeletons, and interactive upload, suitable for ATS or dashboard use cases.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```
npm install motion clsx tailwind-merge @tabler/icons-react
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

1. Copy the `ThreeColumnBentoGrid` component from `Bento Grids/ThreeColumnBentoGrid/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { ThreeColumnBentoGrid } from "../../Bento Grids/ThreeColumnBentoGrid/code";

export default function Page() {
  return <ThreeColumnBentoGrid />;
}
```

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [@tabler/icons-react](https://tabler.io/icons) (for icons)
- [next/image](https://nextjs.org/docs/pages/api-reference/components/image) (for optimized images)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- If you don't have a `/components/ui` folder, create one for shared UI components as per shadcn/ui best practices. 