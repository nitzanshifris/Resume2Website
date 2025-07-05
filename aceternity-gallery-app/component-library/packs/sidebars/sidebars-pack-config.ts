import { Sidebar, PanelLeftClose } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { SimpleSidebarWithHover, CollapsibleSidebar } from "./sidebars-base";

// Define all sidebar variants
const sidebarsVariants: PackVariant[] = [
  {
    id: "simple-sidebar-with-hover",
    title: "Simple Sidebar with Hover",
    description: "Elegant sidebar with hover effects, animations, and mobile responsive design",
    icon: Sidebar,
    component: SimpleSidebarWithHover,
    tags: ["sidebar", "navigation", "hover", "animated", "responsive"],
    featured: true,
    codeExample: `import { SimpleSidebarWithHover } from "@/packs/sidebars";

export function MySidebar() {
  return <SimpleSidebarWithHover />;
}`,
  },
  {
    id: "collapsible-sidebar",
    title: "Collapsible Sidebar",
    description: "Sidebar with collapse/expand functionality, animated width transitions, and responsive design",
    icon: PanelLeftClose,
    component: CollapsibleSidebar,
    tags: ["sidebar", "collapsible", "animated", "responsive", "toggle"],
    featured: true,
    codeExample: `import { CollapsibleSidebar } from "@/packs/sidebars";

export function MyCollapsibleSidebar() {
  return <CollapsibleSidebar />;
}`,
  },
];

// Define the complete sidebars pack
const sidebarsPack: ComponentPack = {
  id: "sidebars",
  name: "sidebars",
  title: "Sidebars",
  description: "Elegant sidebars with hover effects and open, close states. Beautiful navigation components for your web applications.",
  icon: Sidebar,
  category: "navigation",
  variants: sidebarsVariants,
  tags: ["sidebar", "navigation", "menu", "hover", "animated"],
  dependencies: [
    "motion",
    "clsx",
    "tailwind-merge",
    "@tabler/icons-react",
    "next",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/sidebars",
  documentation: "/packs-gallery/sidebars",
  installCommand: "npm i motion clsx tailwind-merge @tabler/icons-react",
  importExample: `import { 
  SimpleSidebarWithHover,
  CollapsibleSidebar
} from "@/packs/sidebars";`,
};

// Register the pack
registerPack(sidebarsPack);

// Export for external use
export { sidebarsPack, sidebarsVariants };
export default sidebarsPack;