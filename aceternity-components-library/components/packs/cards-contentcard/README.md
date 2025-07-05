# Content Card

A card component with an author avatar, name, and reading time, suitable for blog posts or content previews.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```bash
npm install clsx tailwind-merge next
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

1. Copy the `CardDemo` component from `Cards/ContentCard/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { CardDemo } from "../../Cards/ContentCard/code";

export default function Page() {
  return <CardDemo />;
}
```

## Features
- Author avatar and name
- Reading time indicator
- Background image with dark overlay on hover
- Responsive design
- Dark mode support
- Customizable content and images

## Dependencies
- [next/image](https://nextjs.org/docs/api-reference/next/image) (for images)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity.
- The avatar image (`/manu.png`) should be available in your public directory or replaced with your own image. 