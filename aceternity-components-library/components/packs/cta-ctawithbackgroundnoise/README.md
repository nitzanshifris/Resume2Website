# CTA With Background Noise

A visually striking CTA (Call To Action) section with a background noise texture, gradient overlays, and product images. Designed for modern landing pages using Tailwind CSS v4 and shadcn/ui conventions.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```
npm install react-icons
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

4. Add a noise texture image to your public folder:

- Place a noise image at `/public/noise.webp` (you can use any seamless noise texture, e.g. from [Transparent Textures](https://www.transparenttextures.com/) or [Hero Patterns](https://heropatterns.com/)).

## Usage

1. Copy the `CTAWithBackgroundNoise` component from `CTA Sections/CTAWithBackgroundNoise/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { CTAWithBackgroundNoise } from "../../CTA Sections/CTAWithBackgroundNoise/code";

export default function Page() {
  return <CTAWithBackgroundNoise />;
}
```

## Dependencies
- [react-icons](https://react-icons.github.io/react-icons/) (for icons)
- [next/image](https://nextjs.org/docs/pages/api-reference/components/image) (for optimized images)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- The noise effect requires a `/public/noise.webp` file. You can use any seamless noise texture. 