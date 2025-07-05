# Floating Dock Component

A macOS-style floating dock component with smooth animations and hover effects. Perfect for navigation menus, social links, or quick action bars.

## Features

- **Responsive Design**: Desktop dock with hover animations, mobile-friendly drawer
- **Smooth Animations**: Spring-based hover effects and size transitions
- **Dark Mode Support**: Built-in dark mode compatibility
- **TypeScript Ready**: Full type safety with interfaces
- **Icon Support**: Works with Tabler Icons or custom React components

## Usage

```tsx
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome, IconUser, IconMail } from "@tabler/icons-react";

const items = [
  {
    title: "Home",
    icon: IconHome,
    href: "/",
  },
  {
    title: "About",
    icon: IconUser,
    href: "/about",
  },
  {
    title: "Contact",
    icon: IconMail,
    href: "/contact",
  },
];

export function MyComponent() {
  return (
    <FloatingDock
      items={items}
      desktopClassName="fixed bottom-8"
      mobileClassName="fixed bottom-4 right-4"
    />
  );
}
```

## Props

### FloatingDock

| Prop | Type | Description |
|------|------|-------------|
| items | `FloatingDockItem[]` | Array of navigation items |
| desktopClassName | `string` (optional) | Additional classes for desktop view |
| mobileClassName | `string` (optional) | Additional classes for mobile view |

### FloatingDockItem

| Property | Type | Description |
|----------|------|-------------|
| title | `string` | Tooltip text shown on hover |
| icon | `TablerIcon \| React.FC` | Icon component to display |
| href | `string` | Link destination |

## Variants

1. **Standard**: Full-featured dock with 6 navigation items
2. **Minimal**: Simple 3-item dock for basic navigation
3. **Portfolio**: Tailored for portfolio sites with resume and social links

## Customization

- Position the dock using className props
- Customize colors through Tailwind classes
- Adjust animation parameters in the component
- Add custom icons or React components

## Dependencies

- `framer-motion`: For animations
- `@tabler/icons-react`: For icons (optional)
- `clsx` & `tailwind-merge`: For className handling