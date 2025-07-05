# Resizable Navbar Component

A responsive navigation bar that changes width on scroll, featuring smooth animations and mobile support.

## Usage

```tsx
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./resizable-navbar";

export function Example() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "#contact" },
  ];

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <NavbarButton variant="secondary">Login</NavbarButton>
          <NavbarButton variant="primary">Get Started</NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {/* Mobile menu items */}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
```

## Features

- **Responsive Design**: Automatically switches between desktop and mobile layouts
- **Scroll Animation**: Navbar resizes and gains backdrop blur on scroll
- **Mobile Menu**: Fully animated mobile menu with smooth transitions
- **Button Variants**: Multiple button styles (primary, secondary, dark, gradient)
- **Customizable**: All components accept className props for custom styling
- **TypeScript**: Full TypeScript support with proper type definitions

## Components

### Navbar
Main container that handles scroll detection and passes visibility state to children.

### NavBody
Desktop navigation container that animates width and blur on scroll.

### NavItems
Navigation links with hover state animations for desktop view.

### MobileNav
Mobile navigation container with responsive animations.

### MobileNavHeader
Header section for mobile navigation containing logo and toggle button.

### MobileNavMenu
Animated dropdown menu for mobile navigation.

### MobileNavToggle
Hamburger/close icon toggle for mobile menu.

### NavbarLogo
Logo component with default styling.

### NavbarButton
Versatile button component with multiple variants.

## Positioning

By default, the navbar uses `sticky` positioning. To make it fixed:

```tsx
<Navbar className="fixed top-0">
  {/* ... */}
</Navbar>
```

## Customization

All components support the `className` prop for custom styling:

```tsx
<NavBody className="custom-nav-body">
  <NavItems 
    items={navItems} 
    className="custom-nav-items"
  />
</NavBody>
```

## Button Variants

The NavbarButton component supports multiple variants:

- `primary`: Default button with shadow
- `secondary`: Transparent button
- `dark`: Dark button with shadow
- `gradient`: Gradient button with inset shadow