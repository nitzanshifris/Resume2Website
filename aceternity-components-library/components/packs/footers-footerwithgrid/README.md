# Huge Footer with Grid

A large, content-rich footer with multiple grid sections for components, templates, pages, and SEO pages, plus branding and links.

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

1. Copy the `FooterWithGrid` component from `Footers/FooterWithGrid/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { FooterWithGrid } from "../../Footers/FooterWithGrid/code";

export default function Page() {
  return <FooterWithGrid />;
}
```

## Features
- Four grid sections: Components, Templates, Pages, SEO Pages
- Branding and product info
- Responsive design
- Dark mode support
- Customizable links and content

## Dependencies
- [motion](https://motion.dev/) (for animation, if needed)
- [@tabler/icons-react](https://tabler-icons.io/) (for icons, if needed)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 