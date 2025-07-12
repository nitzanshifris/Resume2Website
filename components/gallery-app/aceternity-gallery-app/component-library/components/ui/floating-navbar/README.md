# Floating Navbar

A beautiful floating navigation bar that hides on scroll down and reveals on scroll up. Perfect for modern web applications that need a clean, minimal navigation experience.

## Features

- **Smart Visibility**: Automatically hides when scrolling down and shows when scrolling up
- **Smooth Animations**: Elegant transitions powered by Framer Motion
- **Responsive Design**: Shows icons on mobile and text on desktop
- **Dark Mode Support**: Built-in dark mode styling
- **Customizable**: Easy to modify styles and behavior

## Usage

```tsx
import { FloatingNavbar } from "@/components/ui/floating-navbar";

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <HomeIcon />, // optional
  },
  {
    name: "About",
    link: "/about",
    icon: <AboutIcon />, // optional
  },
  {
    name: "Contact",
    link: "/contact",
    icon: <ContactIcon />, // optional
  },
];

export default function Example() {
  return <FloatingNavbar navItems={navItems} />;
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| navItems | `NavItem[]` | Array of navigation items with name, link, and optional icon |
| className | `string` | Optional className for custom styling |

### NavItem Type

```typescript
interface NavItem {
  name: string;
  link: string;
  icon?: ReactElement;
}
```

## Variants

- **Standard**: Includes icons for better mobile experience
- **Minimal**: Text-only navigation for cleaner look
- **Portfolio**: Optimized for portfolio websites with relevant sections

## Customization

The component uses Tailwind CSS classes and can be easily customized by passing a `className` prop or modifying the base styles in the component.