# Logos With Blur Flip

A logo cloud component with animated blur and flip transitions.

## Installation

1. Ensure you have a [shadcn/ui](https://ui.shadcn.com/) project structure, Tailwind CSS v4, and TypeScript set up.
2. Install dependencies:

```
pnpm add motion
# or
npm install motion
```

## Usage

1. Copy the `LogosWithBlurFlip` component from `Logo Clouds/Logo with Blur Flip/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { LogosWithBlurFlip } from "../../Logo Clouds/Logo with Blur Flip/code";

export default function Page() {
  return <LogosWithBlurFlip />;
}
```

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [next/image](https://nextjs.org/docs/pages/api-reference/components/image) (for optimized images)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- If you don't have a `/components/ui` folder, create one for shared UI components as per shadcn/ui best practices. 