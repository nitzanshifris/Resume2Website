import { Layers, Grid3x3, CreditCard, MousePointer2, Scroll } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { FeaturesSectionDemo, SimpleWithCardGradient, SimpleWithHoverEffects, FeaturesWithStickyScroll } from "./feature-sections-base";

// Define all feature section variants
const featureSectionsVariants: PackVariant[] = [
  {
    id: "bento-grid",
    title: "Bento Grid",
    description: "Feature section with bento grid layout showcasing different capabilities with interactive elements",
    icon: Grid3x3,
    component: FeaturesSectionDemo,
    tags: ["grid", "features", "interactive", "globe", "animated"],
    featured: true,
    codeExample: `import { FeaturesSectionDemo } from "@/packs/feature-sections";

export function MyFeatures() {
  return <FeaturesSectionDemo />;
}`,
  },
  {
    id: "simple-card-gradient",
    title: "Simple with Card Gradient",
    description: "Clean feature cards with gradient backgrounds and subtle grid patterns",
    icon: CreditCard,
    component: SimpleWithCardGradient,
    tags: ["cards", "features", "gradient", "grid", "simple"],
    featured: false,
    codeExample: `import { SimpleWithCardGradient } from "@/packs/feature-sections";

export function MyFeatures() {
  return <SimpleWithCardGradient />;
}`,
  },
  {
    id: "simple-hover-effects",
    title: "Simple with Hover Effects",
    description: "Grid layout with interactive hover effects, gradient overlays, and animated borders",
    icon: MousePointer2,
    component: SimpleWithHoverEffects,
    tags: ["grid", "features", "hover", "interactive", "borders"],
    featured: true,
    codeExample: `import { SimpleWithHoverEffects } from "@/packs/feature-sections";

export function MyFeatures() {
  return <SimpleWithHoverEffects />;
}`,
  },
  {
    id: "sticky-scroll",
    title: "Features with Sticky Scroll",
    description: "Advanced scroll-driven features with sticky content, parallax effects, and dynamic backgrounds",
    icon: Scroll,
    component: FeaturesWithStickyScroll,
    tags: ["scroll", "features", "sticky", "parallax", "animated"],
    featured: true,
    codeExample: `import { FeaturesWithStickyScroll } from "@/packs/feature-sections";

export function MyFeatures() {
  return <FeaturesWithStickyScroll />;
}`,
  },
];

// Define the complete feature sections pack
const featureSectionsPack: ComponentPack = {
  id: "feature-sections",
  name: "feature-sections",
  title: "Feature Sections",
  description: "A set of feature sections ranging from bento grids to simple layouts. Perfect for showcasing product features.",
  icon: Layers,
  category: "marketing",
  variants: featureSectionsVariants,
  tags: ["features", "sections", "grid", "showcase", "product"],
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
  repository: "https://github.com/aceternity/feature-sections",
  documentation: "/packs-gallery/feature-sections",
  installCommand: "npm i motion clsx tailwind-merge @tabler/icons-react cobe",
  importExample: `import { 
  FeaturesSectionDemo,
  FeatureCard,
  FeatureTitle,
  FeatureDescription,
  Globe
} from "@/packs/feature-sections";`,
};

// Register the pack
registerPack(featureSectionsPack);

// Export for external use
export { featureSectionsPack, featureSectionsVariants };
export default featureSectionsPack;