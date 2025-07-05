# Centered Footer with Logo

A centered footer with a logo, navigation links, social icons, and a horizontal grid line.

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

1. Copy the `CenteredWithLogo` component from `Footers/CenteredWithLogo/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { CenteredWithLogo } from "../../Footers/CenteredWithLogo/code";

export default function Page() {
  return <CenteredWithLogo />;
}
```

## Features
- Centered logo and navigation links
- Social media icons (Twitter, LinkedIn, GitHub, Facebook, Instagram)
- Horizontal grid line for separation
- Responsive design
- Dark mode support
- Customizable links and content

## Dependencies
- [motion](https://motion.dev/) (for animation, if needed)
- [@tabler/icons-react](https://tabler-icons.io/) (for icons)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 