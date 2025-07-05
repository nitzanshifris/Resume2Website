import { Grid3x3, Columns3, Image, Globe } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { ThreeColumnBentoGrid, ThreeColumnsWithImages, BentoGridExampleThree } from "./bento-grids-base";

// Define all bento grid variants
const bentoGridVariants: PackVariant[] = [
  {
    id: "three-column",
    title: "Three Column Bento Grid",
    description: "ATS platform demo with responsive 3-column layout and interactive cards",
    icon: Columns3,
    component: ThreeColumnBentoGrid,
    tags: ["3-column", "responsive", "cards", "interactive", "animations"],
    featured: true,
    codeExample: `import { ThreeColumnBentoGrid } from "@/packs/bento-grids";

export function MyBentoGrid() {
  return <ThreeColumnBentoGrid />;
}`,
  },
  {
    id: "three-columns-images",
    title: "Three Columns with Images",
    description: "Dashboard showcase with image-rich cards in a 3-column layout",
    icon: Image,
    component: ThreeColumnsWithImages,
    tags: ["dashboard", "images", "3-column", "hover", "showcase"],
    featured: true,
    codeExample: `import { ThreeColumnsWithImages } from "@/packs/bento-grids";

export function MyDashboard() {
  return <ThreeColumnsWithImages />;
}`,
  },
  {
    id: "symmetric-bento",
    title: "Symmetric Bento Grid",
    description: "Beautiful symmetric layout with interactive globe and gradient cards",
    icon: Globe,
    component: BentoGridExampleThree,
    tags: ["symmetric", "globe", "interactive", "gradients", "modern"],
    featured: true,
    codeExample: `import { BentoGridExampleThree } from "@/packs/bento-grids";

export function MySymmetricBento() {
  return <BentoGridExampleThree />;
}`,
  },
];

// Define the complete bento grids pack
const bentoGridsPack: ComponentPack = {
  id: "bento-grids",
  name: "bento-grids",
  title: "Bento Grids",
  description: "A set of bento grids for various use cases. Modern grid layouts with interactive elements and smooth animations.",
  icon: Grid3x3,
  category: "layout",
  variants: bentoGridVariants,
  tags: ["grid", "bento", "layout", "cards", "dashboard"],
  dependencies: [
    "motion",
    "clsx",
    "tailwind-merge",
    "@tabler/icons-react",
    "cobe",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/bento-grids",
  documentation: "/packs-gallery/bento-grids",
  installCommand: "npm i motion clsx tailwind-merge @tabler/icons-react cobe",
  importExample: `import { 
  ThreeColumnBentoGrid,
  ThreeColumnsWithImages,
  BentoGridExampleThree
} from "@/packs/bento-grids";`,
};

// Register the pack
registerPack(bentoGridsPack);

// Export for external use
export { bentoGridsPack, bentoGridVariants };
export default bentoGridsPack;