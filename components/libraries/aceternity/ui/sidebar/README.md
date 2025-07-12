# Sidebar

An expandable sidebar component that expands on hover, with mobile responsive design and dark mode support. Perfect for dashboard layouts and admin panels.

## Features

- Expandable on hover (desktop)
- Mobile responsive with slide-out menu
- Dark mode support
- Smooth animations with Framer Motion
- Customizable links with icons
- Optional animation disable
- Context-based state management

## Usage

```tsx
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
import { IconBrandTabler, IconUserBolt, IconSettings } from "@tabler/icons-react";
import { useState } from "react";

export function MySidebar() {
  const [open, setOpen] = useState(false);
  
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUserBolt className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
          <div>
            <SidebarLink
              link={{
                label: "User Name",
                href: "#",
                icon: <img src="/avatar.png" className="h-7 w-7 rounded-full" alt="Avatar" />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1">
        {/* Your main content */}
      </main>
    </div>
  );
}
```

## Props

### Sidebar
- `open` - Boolean to control sidebar state
- `setOpen` - Function to update sidebar state
- `animate` - Enable/disable animations (default: true)
- `children` - Sidebar content

### SidebarLink
- `link` - Object containing:
  - `label` - Link text
  - `href` - Link URL
  - `icon` - React element for icon
- `className` - Additional CSS classes

## Variants

1. **Default** - Animated sidebar that expands on hover
2. **No Animation** - Static sidebar with `animate={false}`
3. **Mobile** - Responsive slide-out menu on mobile devices

## Customization

The sidebar can be customized with:
- Custom icons using @tabler/icons-react or any icon library
- Custom colors via Tailwind classes
- Custom logo components
- Additional links and sections