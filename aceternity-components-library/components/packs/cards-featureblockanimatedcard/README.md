# Feature Block Animated Card

A modern and animated card component that showcases a set of tools with smooth animations and interactive elements.

## Installation

1. Make sure your project uses:
   - shadcn/ui project structure
   - Tailwind CSS v4.0
   - TypeScript

2. Install dependencies:

```bash
npm install motion clsx tailwind-merge react-icons
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

4. Add the animation configuration to your Tailwind config:

For Tailwind CSS v4:
```css
@theme inline {
  --animate-move: move 5s linear infinite;
 
  @keyframes move {
    0% {
      transform: translateX(-200px);
    }
    100% {
      transform: translateX(200px);
    }
  }
}
```

For Tailwind CSS v3:
```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
 
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: { move: "move 5s linear infinite" },
      keyframes: {
        move: {
          "0%": { transform: "translateX(-200px)" },
          "100%": { transform: "translateX(200px)" },
        },
      },
    },
  },
  plugins: [],
};
 
export default config;
```

## Usage

1. Copy the `FeatureBlockAnimatedCard` component from `Cards/FeatureBlockAnimatedCard/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { CardDemo } from "../../Cards/FeatureBlockAnimatedCard/code";

export default function Page() {
  return <CardDemo />;
}
```

## Features
- Animated tool icons with smooth transitions
- Sparkle effects with random animations
- Responsive design
- Dark mode support
- Customizable card content
- Gradient backgrounds
- Interactive hover effects

## Components
- `Card`: Main container component
- `CardTitle`: Title component for the card
- `CardDescription`: Description component for the card
- `CardSkeletonContainer`: Container for the animated skeleton
- `Skeleton`: Animated skeleton component with tool icons
- `Sparkles`: Animated sparkle effect component

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [react-icons](https://react-icons.github.io/react-icons/) (for icons)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity.
- The component includes SVG logos for various AI tools (Claude, OpenAI, Gemini, Meta) that can be customized or replaced. 