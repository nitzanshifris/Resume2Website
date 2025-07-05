# Simple Blog With Grid

A modern blog section with a responsive grid layout, designed for shadcn/ui and Tailwind CSS v4 projects.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```bash
npm install motion clsx tailwind-merge
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

4. Add custom shadows for Tailwind CSS v4 in your `globals.css`:

```css
@theme inline {
  --shadow-derek: 0px 0px 0px 1px rgb(0 0 0 / 0.06),
    0px 1px 1px -0.5px rgb(0 0 0 / 0.06), 0px 3px 3px -1.5px rgb(0 0 0 / 0.06),
    0px 6px 6px -3px rgb(0 0 0 / 0.06), 0px 12px 12px -6px rgb(0 0 0 / 0.06),
    0px 24px 24px -12px rgb(0 0 0 / 0.06);
  --shadow-input: 0px 2px 3px -1px rgba(0, 0, 0, 0.1),
    0px 1px 0px 0px rgba(25, 28, 33, 0.02),
    0px 0px 0px 1px rgba(25, 28, 33, 0.08);
}
```

For Tailwind CSS v3, add to `tailwind.config.ts`:

```ts
boxShadow: {
  derek: `0px 0px 0px 1px rgb(0 0 0 / 0.06),
    0px 1px 1px -0.5px rgb(0 0 0 / 0.06),
    0px 3px 3px -1.5px rgb(0 0 0 / 0.06),
    0px 6px 6px -3px rgb(0 0 0 / 0.06),
    0px 12px 12px -6px rgb(0 0 0 / 0.06),
    0px 24px 24px -12px rgb(0 0 0 / 0.06)` ,
  input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
},
```

## Usage

1. Copy the `SimpleBlogWithGrid` component from `Blog Sections/SimpleBlogWithGrid/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { SimpleBlogWithGrid } from "../../Blog Sections/SimpleBlogWithGrid/code";

export default function Page() {
  return <SimpleBlogWithGrid />;
}
```

## Features
- Responsive grid layout for blog posts
- Featured blog card with image
- Author information with avatar
- Dark mode support
- Customizable content and styling
- Image blur loading effect
- Grid pattern background

## Dependencies
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/) (for Image component)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity.
- Customize the blog data and styling according to your needs.
- The component uses Next.js Image component for optimized image loading. 