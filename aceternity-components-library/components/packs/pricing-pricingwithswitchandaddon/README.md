# Pricing Section with Switch and Add On

A pricing section component with monthly/yearly toggle switch and an additional add-on section for team purchases.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```bash
npm install motion @tabler/icons-react clsx tailwind-merge
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

1. Copy the `PricingWithSwitchAndAddOn` component from `Pricing sections/PricingWithSwitchAndAddOn/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { PricingWithSwitchAndAddOn } from "../../Pricing sections/PricingWithSwitchAndAddOn/code";

export default function Page() {
  return <PricingWithSwitchAndAddOn />;
}
```

## Features
- Monthly/Yearly pricing toggle with smooth animation
- Responsive grid layout
- Featured plan highlighting
- Add-on section for team purchases
- Dark mode support
- Customizable pricing tiers and features
- Gradient backgrounds and decorative elements

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [@tabler/icons-react](https://tabler-icons.io/) (for icons)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 