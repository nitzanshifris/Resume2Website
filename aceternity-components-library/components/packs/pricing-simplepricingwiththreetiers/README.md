# Simple Pricing with Three Tiers

A clean and modern pricing section component with three tiers, featuring a gradient design and clear feature lists.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```bash
npm install @tabler/icons-react clsx tailwind-merge
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

1. Copy the `SimplePricingWithThreeTiers` component from `Pricing sections/SimplePricingWithThreeTiers/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { SimplePricingWithThreeTiers } from "../../Pricing sections/SimplePricingWithThreeTiers/code";

export default function Page() {
  return <SimplePricingWithThreeTiers />;
}
```

## Features
- Three-tier pricing structure
- Featured plan highlighting
- Clear feature lists with checkmarks
- Additional features section
- Responsive design
- Dark mode support
- Gradient backgrounds
- Customizable pricing and features

## Dependencies
- [@tabler/icons-react](https://tabler-icons.io/) (for icons)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 