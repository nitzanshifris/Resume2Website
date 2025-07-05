# Logo Cloud Marquee

A logo cloud component with a smooth, animated marquee effect for displaying brand logos.

## Installation

1. Ensure you have a [shadcn/ui](https://ui.shadcn.com/) project structure, Tailwind CSS v4, and TypeScript set up.
2. Install dependencies:

```
pnpm add react-fast-marquee
# or
npm install react-fast-marquee
```

## Usage

1. Copy the `LogoCloudMarquee` component from `Logo Clouds/LogoCloudMarquee/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { LogoCloudMarquee } from "../../Logo Clouds/LogoCloudMarquee/code";

export default function Page() {
  return <LogoCloudMarquee />;
}
```

## Dependencies
- [react-fast-marquee](https://www.npmjs.com/package/react-fast-marquee) (for the marquee effect)
- [next/image](https://nextjs.org/docs/pages/api-reference/components/image) (for optimized images)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- If you don't have a `/components/ui` folder, create one for shared UI components as per shadcn/ui best practices. 