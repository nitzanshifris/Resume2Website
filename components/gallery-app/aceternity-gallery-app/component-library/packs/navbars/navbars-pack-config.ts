import { Navigation, ChevronDown } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { SimpleNavbarWithHoverEffects, NavbarWithChildren } from "./navbars-base";

// Define all navbar variants
const navbarsVariants: PackVariant[] = [
  {
    id: "simple-navbar-with-hover",
    title: "Simple Navbar with Hover Effects",
    description: "Responsive navbar with smooth hover animations and mobile menu",
    icon: Navigation,
    component: SimpleNavbarWithHoverEffects,
    tags: ["navbar", "navigation", "hover", "responsive", "mobile-menu"],
    featured: true,
    codeExample: `import { SimpleNavbarWithHoverEffects } from "@/packs/navbars";

export function MyNavbar() {
  return <SimpleNavbarWithHoverEffects />;
}`,
  },
  {
    id: "navbar-with-children",
    title: "Navbar with Children",
    description: "Advanced navbar with dropdown menus, product showcases, and nested navigation",
    icon: ChevronDown,
    component: NavbarWithChildren,
    tags: ["navbar", "dropdown", "menu", "children", "nested", "mega-menu"],
    featured: false,
    codeExample: `import { NavbarWithChildren } from "@/packs/navbars";

export function MyNavbar() {
  return <NavbarWithChildren />;
}`,
  },
];

// Define the complete navbars pack
const navbarsPack: ComponentPack = {
  id: "navbars",
  name: "navbars",
  title: "Navbars",
  description: "Simple and elegant headers for your website. Responsive navigation components with smooth animations.",
  icon: Navigation,
  category: "navigation",
  variants: navbarsVariants,
  tags: ["navbars", "navigation", "header", "menu", "responsive"],
  dependencies: [
    "motion",
    "clsx",
    "tailwind-merge",
    "@tabler/icons-react",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/navbars",
  documentation: "/packs-gallery/navbars",
  installCommand: "npm i motion clsx tailwind-merge @tabler/icons-react",
  importExample: `import { 
  SimpleNavbarWithHoverEffects,
  NavbarWithChildren,
  MenuItem,
  Menu,
  ProductItem,
  HoveredLink
} from "@/packs/navbars";`,
};

// Register the pack
registerPack(navbarsPack);

// Export for external use
export { navbarsPack, navbarsVariants };
export default navbarsPack;