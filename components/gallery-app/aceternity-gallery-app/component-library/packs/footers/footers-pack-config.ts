import { Layers3, AlignCenter, LayoutGrid } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { SimpleFooterWithFourGrids, CenteredWithLogo, FooterWithGrid } from "./footers-base";

// Define all footer variants
const footersVariants: PackVariant[] = [
  {
    id: "simple-footer-four-grids",
    title: "Simple Footer with Four Grids",
    description: "Clean footer with organized grid layout for pages, socials, legal links, and auth options",
    icon: Layers3,
    component: SimpleFooterWithFourGrids,
    tags: ["footer", "grid", "links", "navigation", "responsive", "clean"],
    featured: true,
    codeExample: `import { SimpleFooterWithFourGrids } from "@/packs/footers";

export function MyFooter() {
  return <SimpleFooterWithFourGrids />;
}`,
  },
  {
    id: "centered-with-logo",
    title: "Centered With Logo",
    description: "Minimalist centered footer with logo, navigation links, decorative line, and social icons",
    icon: AlignCenter,
    component: CenteredWithLogo,
    tags: ["footer", "centered", "minimal", "social", "logo", "clean"],
    featured: false,
    codeExample: `import { CenteredWithLogo } from "@/packs/footers";

export function MyFooter() {
  return <CenteredWithLogo />;
}`,
  },
  {
    id: "footer-with-grid",
    title: "Huge Footer with Grid",
    description: "Comprehensive footer with multiple link sections, company info, and extensive navigation options",
    icon: LayoutGrid,
    component: FooterWithGrid,
    tags: ["footer", "grid", "comprehensive", "navigation", "links", "extensive"],
    featured: false,
    codeExample: `import { FooterWithGrid } from "@/packs/footers";

export function MyFooter() {
  return <FooterWithGrid />;
}`,
  },
];

// Define the complete footers pack
const footersPack: ComponentPack = {
  id: "footers",
  name: "footers",
  title: "Footers",
  description: "Clean footers with a variety of styles and layouts. Perfect for any website with responsive design.",
  icon: Layers3,
  category: "navigation",
  variants: footersVariants,
  tags: ["footers", "navigation", "layout", "responsive", "links"],
  dependencies: [
    "clsx",
    "tailwind-merge",
    "@tabler/icons-react",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/footers",
  documentation: "/packs-gallery/footers",
  installCommand: "npm i clsx tailwind-merge @tabler/icons-react",
  importExample: `import { 
  SimpleFooterWithFourGrids,
  CenteredWithLogo,
  FooterWithGrid
} from "@/packs/footers";`,
};

// Register the pack
registerPack(footersPack);

// Export for external use
export { footersPack, footersVariants };
export default footersPack;