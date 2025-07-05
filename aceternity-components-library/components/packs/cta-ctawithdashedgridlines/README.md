# CTA With Dashed Grid Lines

A modern CTA (Call To Action) section with animated dashed grid lines, testimonial, and dual action buttons. Designed for landing pages using Tailwind CSS v4 and shadcn/ui conventions.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```
npm install @tabler/icons-react react-icons
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

1. Copy the `CTAWithDashedGridLines` component from `CTA Sections/CTAWithDashedGridLines/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { CTAWithDashedGridLines } from "../../CTA Sections/CTAWithDashedGridLines/code";

export default function Page() {
  return <CTAWithDashedGridLines />;
}
```

## Dependencies
- [@tabler/icons-react](https://tabler-icons.io/) (for icons)
- [react-icons](https://react-icons.github.io/react-icons/) (for icons)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 