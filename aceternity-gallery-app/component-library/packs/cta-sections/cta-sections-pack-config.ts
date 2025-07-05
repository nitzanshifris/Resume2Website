import { Megaphone, Users, Sparkles, Grid } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { SimpleCTAWithImages, CTAWithBackgroundNoise, CTAWithDashedGridLines } from "./cta-sections-base";

// Define all CTA section variants
const ctaSectionVariants: PackVariant[] = [
  {
    id: "simple-cta-images",
    title: "Simple CTA with Images",
    description: "CTA section with featured user avatars, ratings, and hover interactions",
    icon: Users,
    component: SimpleCTAWithImages,
    tags: ["avatars", "testimonials", "hover", "animations", "featured"],
    featured: true,
    codeExample: `import { SimpleCTAWithImages } from "@/packs/cta-sections";

export function MyCTASection() {
  return <SimpleCTAWithImages />;
}`,
  },
  {
    id: "cta-background-noise",
    title: "CTA with Background Noise",
    description: "Modern CTA section with noise texture, gradient lines, and side-by-side images",
    icon: Sparkles,
    component: CTAWithBackgroundNoise,
    tags: ["noise", "texture", "gradient", "images", "modern"],
    featured: true,
    codeExample: `import { CTAWithBackgroundNoise } from "@/packs/cta-sections";

export function MyNoisyCTA() {
  return <CTAWithBackgroundNoise />;
}`,
  },
  {
    id: "cta-dashed-grid-lines",
    title: "CTA with Dashed Grid Lines",
    description: "Clean CTA section with dashed grid lines, testimonial sidebar, and dual buttons",
    icon: Grid,
    component: CTAWithDashedGridLines,
    tags: ["grid", "dashed", "testimonial", "clean", "minimal"],
    featured: false,
    codeExample: `import { CTAWithDashedGridLines } from "@/packs/cta-sections";

export function MyGridCTA() {
  return <CTAWithDashedGridLines />;
}`,
  },
];

// Define the complete CTA sections pack
const ctaSectionsPack: ComponentPack = {
  id: "cta-sections",
  name: "cta-sections",
  title: "CTA Sections",
  description: "CTA sections with modern and minimalist styles. Perfect for conversion-focused landing pages.",
  icon: Megaphone,
  category: "marketing",
  variants: ctaSectionVariants,
  tags: ["cta", "call-to-action", "conversion", "marketing", "landing"],
  dependencies: [
    "motion",
    "clsx",
    "tailwind-merge",
    "react-icons",
    "@tabler/icons-react",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/cta-sections",
  documentation: "/packs-gallery/cta-sections",
  installCommand: "npm i motion clsx tailwind-merge react-icons @tabler/icons-react",
  importExample: `import { 
  SimpleCTAWithImages,
  CTAWithBackgroundNoise,
  CTAWithDashedGridLines,
  FeaturedImages
} from "@/packs/cta-sections";`,
};

// Register the pack
registerPack(ctaSectionsPack);

// Export for external use
export { ctaSectionsPack, ctaSectionVariants };
export default ctaSectionsPack;