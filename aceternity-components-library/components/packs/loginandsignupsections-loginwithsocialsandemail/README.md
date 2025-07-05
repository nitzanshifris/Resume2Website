# Login With Socials And Email

A modern login form with animated ambient color, social login buttons, and email login, designed for shadcn/ui and Tailwind CSS v4 projects.

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

1. Copy the `LoginWithSocialsAndEmail` component from `LoginAndSignupSections/LoginWithSocialsAndEmail/code.tsx` into your project.
2. Import and use it in your page or layout:

```tsx
import { LoginWithSocialsAndEmail } from "../../LoginAndSignupSections/LoginWithSocialsAndEmail/code";

export default function Page() {
  return <LoginWithSocialsAndEmail />;
}
```

## Features
- Social login buttons (GitHub, Google)
- Animated ambient color background
- Email login with animated input
- Responsive design
- Dark mode support
- Customizable links and content

## Dependencies
- [motion](https://motion.dev/) (for animation)
- [@tabler/icons-react](https://tabler-icons.io/) (for icons)
- [clsx](https://www.npmjs.com/package/clsx) (for className merging)
- [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) (for className merging)
- [React](https://react.dev/)

## Notes
- Make sure your project uses Tailwind CSS v4 and shadcn/ui for best compatibility.
- Place this component only in its designated pack folder for modularity. 