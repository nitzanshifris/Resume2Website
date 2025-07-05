import { DollarSign, ToggleLeft, CreditCard } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { PricingWithSwitchAndAddOn, SimplePricingWithThreeTiers } from "./pricing-sections-base";

// Define all pricing section variants
const pricingSectionsVariants: PackVariant[] = [
  {
    id: "switch-and-addon",
    title: "Pricing with Switch and Add On",
    description: "Complete pricing section with monthly/yearly toggle, featured plan highlighting, and add-on promotional section",
    icon: ToggleLeft,
    component: PricingWithSwitchAndAddOn,
    tags: ["pricing", "switch", "toggle", "plans", "addon", "testimonial"],
    featured: true,
    codeExample: `import { PricingWithSwitchAndAddOn } from "@/packs/pricing-sections";

export function MyPricing() {
  return <PricingWithSwitchAndAddOn />;
}`,
  },
  {
    id: "simple-three-tiers",
    title: "Simple Pricing With Three Tiers",
    description: "Clean and minimal pricing cards with featured plan highlighting and additional features section",
    icon: CreditCard,
    component: SimplePricingWithThreeTiers,
    tags: ["pricing", "simple", "cards", "tiers", "minimal"],
    featured: false,
    codeExample: `import { SimplePricingWithThreeTiers } from "@/packs/pricing-sections";

export function MyPricing() {
  return <SimplePricingWithThreeTiers />;
}`,
  },
];

// Define the complete pricing sections pack
const pricingSectionsPack: ComponentPack = {
  id: "pricing-sections",
  name: "pricing-sections",
  title: "Pricing Sections",
  description: "Minimal and elegant pricing sections. Perfect for showcasing your product plans with beautiful animations and interactive elements.",
  icon: DollarSign,
  category: "marketing",
  variants: pricingSectionsVariants,
  tags: ["pricing", "plans", "subscription", "billing", "toggle"],
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
  repository: "https://github.com/aceternity/pricing-sections",
  documentation: "/packs-gallery/pricing-sections",
  installCommand: "npm i motion clsx tailwind-merge @tabler/icons-react",
  importExample: `import { 
  PricingWithSwitchAndAddOn,
  Pricing,
  AddOn,
  tiers
} from "@/packs/pricing-sections";`,
};

// Register the pack
registerPack(pricingSectionsPack);

// Export for external use
export { pricingSectionsPack, pricingSectionsVariants };
export default pricingSectionsPack;