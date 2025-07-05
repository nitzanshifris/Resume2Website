# Simple Navbar with Hover Effects

A simple and elegant navbar with animated hover effects for desktop and a mobile menu for smaller screens.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```bash
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

1. Copy the `SimpleNavbarWithHoverEffects` component from `Navbars/SimpleNavbarWithHoverEffects/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { SimpleNavbarWithHoverEffects } from "../../Navbars/SimpleNavbarWithHoverEffects/code";

export default function Page() {
  return <SimpleNavbarWithHoverEffects />;
}
```

## Features
- Animated hover effect for desktop navigation
- Responsive mobile menu with animation
- Logo and call-to-action button
- Dark mode support
- Customizable navigation items

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [@tabler/icons-react](https://tabler-icons.io/) (for icons)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 