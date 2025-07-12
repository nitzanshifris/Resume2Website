import { Cloud, Shuffle, Wind, Lightbulb } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { 
  LogosWithBlurFlip,
  LogoCloudMarquee,
  SpotlightLogoCloud
} from "./logo-clouds-base";

// Define all logo cloud variants
const logoCloudVariants: PackVariant[] = [
  {
    id: "blur-flip",
    title: "Logos with Blur Flip",
    description: "Animated logo cloud with blur effect that flips between two sets of logos",
    icon: Shuffle,
    component: LogosWithBlurFlip,
    tags: ["animation", "blur", "flip", "transition"],
    featured: false,
    codeExample: `import { LogosWithBlurFlip } from "@/packs/logo-clouds";

export function MyLogoCloud() {
  return <LogosWithBlurFlip />;
}`,
  },
  {
    id: "cloud-marquee",
    title: "Logo Cloud Marquee",
    description: "Dual direction marquee with gradient mask edges using react-fast-marquee",
    icon: Wind,
    component: LogoCloudMarquee,
    tags: ["marquee", "mask", "dual-direction", "smooth"],
    featured: true,
    codeExample: `import { LogoCloudMarquee } from "@/packs/logo-clouds";

export function MyLogoMarquee() {
  return <LogoCloudMarquee />;
}`,
  },
  {
    id: "spotlight",
    title: "Spotlight Logo Cloud",
    description: "Logo grid with ambient color effects and gradient spotlight backgrounds",
    icon: Lightbulb,
    component: SpotlightLogoCloud,
    tags: ["spotlight", "ambient", "gradient", "effects"],
    featured: true,
    codeExample: `import { SpotlightLogoCloud } from "@/packs/logo-clouds";

export function MySpotlightLogos() {
  return <SpotlightLogoCloud />;
}`,
  },
];

// Define the complete logo clouds pack
const logoCloudsPack: ComponentPack = {
  id: "logo-clouds",
  name: "logo-clouds",
  title: "Logo Clouds",
  description: "A collection of logo clouds with micro interactions and minimal animations. Perfect for showcasing client logos, partner brands, or technology stacks with smooth transitions and effects.",
  icon: Cloud,
  category: "content",
  variants: logoCloudVariants,
  tags: ["logos", "brands", "animation", "carousel", "showcase", "partners"],
  dependencies: [
    "motion",
    "next/image",
    "clsx",
    "tailwind-merge",
    "react-fast-marquee",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/logo-clouds",
  documentation: "/packs-gallery/logo-clouds",
  installCommand: "npm i motion clsx tailwind-merge react-fast-marquee",
  importExample: `import { 
  LogosWithBlurFlip,
  LogoCloudMarquee,
  SpotlightLogoCloud
} from "@/packs/logo-clouds";`,
};

// Register the pack
registerPack(logoCloudsPack);

// Export for external use
export { logoCloudsPack, logoCloudVariants };
export default logoCloudsPack;