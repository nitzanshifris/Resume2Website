# Pricing Section with Switch

A modern pricing section component with a monthly/yearly toggle switch and animated price transitions.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```bash
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

1. Copy the `PricingWithSwitch` component from `Pricing sections/PricingWithSwitch/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { PricingWithSwitch } from "../../Pricing sections/PricingWithSwitch/code";

export default function Page() {
  return <PricingWithSwitch />;
}
```

## Features
- Monthly/Yearly pricing toggle with smooth animation
- Animated price transitions
- Featured plan with gradient background
- Responsive grid layout
- Dark mode support
- Custom font (Outfit) integration
- Customizable pricing tiers and features

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [@tabler/icons-react](https://tabler-icons.io/) (for icons)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [next/font](https://nextjs.org/docs/pages/api-reference/components/font) (for custom font)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity.
- The component uses the Outfit font from Google Fonts, make sure to include it in your project. 