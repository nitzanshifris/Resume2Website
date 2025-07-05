# Expandable Card On Click

A card grid where each card expands to show more details and content when clicked, with smooth animation and overlay.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```bash
npm install motion clsx tailwind-merge next
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

1. Copy the `ExpandableCardOnClick` component from `Cards/ExpandableCardOnClick/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { ExpandableCardOnClick } from "../../Cards/ExpandableCardOnClick/code";

export default function Page() {
  return <ExpandableCardOnClick />;
}
```

## Features
- Click to expand card with smooth animation
- Overlay background when expanded
- Responsive grid layout
- Dark mode support
- Keyboard (Escape) and outside click to close
- Customizable card content and images

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [next/image](https://nextjs.org/docs/api-reference/next/image) (for images)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 