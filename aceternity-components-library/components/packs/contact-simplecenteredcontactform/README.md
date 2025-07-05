# Simple Centered Contact Form

A clean and modern contact form with social media links, designed for shadcn/ui and Tailwind CSS v4 projects.

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

4. Add custom shadows for Tailwind CSS v4 in your `globals.css`:

```css
@theme inline {
  --shadow-derek: 0px 0px 0px 1px rgb(0 0 0 / 0.06),
    0px 1px 1px -0.5px rgb(0 0 0 / 0.06), 0px 3px 3px -1.5px rgb(0 0 0 / 0.06),
    0px 6px 6px -3px rgb(0 0 0 / 0.06), 0px 12px 12px -6px rgb(0 0 0 / 0.06),
    0px 24px 24px -12px rgb(0 0 0 / 0.06);
  --shadow-input: 0px 2px 3px -1px rgba(0, 0, 0, 0.1),
    0px 1px 0px 0px rgba(25, 28, 33, 0.02),
    0px 0px 0px 1px rgba(25, 28, 33, 0.08);
}
```

For Tailwind CSS v3, add to `tailwind.config.ts`:

```ts
boxShadow: {
  derek: `0px 0px 0px 1px rgb(0 0 0 / 0.06),
    0px 1px 1px -0.5px rgb(0 0 0 / 0.06),
    0px 3px 3px -1.5px rgb(0 0 0 / 0.06),
    0px 6px 6px -3px rgb(0 0 0 / 0.06),
    0px 12px 12px -6px rgb(0 0 0 / 0.06),
    0px 24px 24px -12px rgb(0 0 0 / 0.06)` ,
  input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
},
```

## Usage

1. Copy the `SimpleCenteredContactForm` component from `Contact Sections/SimpleCenteredContactForm/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { SimpleCenteredContactForm } from "../../Contact Sections/SimpleCenteredContactForm/code";

export default function Page() {
  return <SimpleCenteredContactForm />;
}
```

## Features
- Contact form with name, email, company, and message fields
- Social media links (Twitter, GitHub, LinkedIn)
- Clean and centered design
- Responsive layout
- Dark mode support
- Customizable content and styling

## Dependencies
- [@tabler/icons-react](https://tabler-icons.io/) (for icons)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity.
- Customize the social media links and form fields according to your needs. 