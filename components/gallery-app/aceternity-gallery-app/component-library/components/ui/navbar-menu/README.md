# Navbar Menu

A navbar menu that animates its children on hover, makes a beautiful bignav

## Installation

```bash
npm i motion clsx tailwind-merge
```

## Usage

```tsx
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";

function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  
  return (
    <div className="fixed top-10 inset-x-0 max-w-2xl mx-auto z-50">
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
```

## Components

### Menu
The main container for navigation items.

**Props:**
- `setActive: (item: string | null) => void` - Function to set the active menu item
- `children: ReactNode` - Menu items to display

### MenuItem
Individual navigation item with dropdown support.

**Props:**
- `setActive: (item: string) => void` - Function to set this item as active
- `active: string | null` - Currently active menu item
- `item: string` - The menu item label
- `children?: ReactNode` - Dropdown content

### ProductItem
Product showcase item for dropdown menus.

**Props:**
- `title: string` - Product title
- `description: string` - Product description
- `href: string` - Link URL
- `src: string` - Image source

### HoveredLink
Simple link component with hover effects.

**Props:**
- `children: ReactNode` - Link content
- `href?: string` - Link URL
- Additional props are spread to the anchor element

## Features

- Smooth animations with Framer Motion
- Responsive design
- Dark mode support
- Dropdown menus with products and links
- Hover effects and transitions