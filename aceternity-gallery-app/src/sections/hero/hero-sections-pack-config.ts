import { Layout, Zap, Images, Grid3x3, Type, Sparkles, Volume2, MessageCircle, Columns, Smartphone, Layers } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import {
  HeroSectionWithBeamsAndGrid,
  HeroSectionWithImagesGrid,
  HeroWithCenteredImage,
  HeroSectionWithBentoGrid,
  HeroSectionWithTextReveal,
  HeroSectionWithSparkles,
} from "./hero-sections-base";
import {
  HeroSectionWithNoiseBackground,
  CenteredAroundTestimonials,
  TwoColumnWithImage,
  PlayfulHeroSection,
  ModernHeroWithGradients,
  FullBackgroundImageWithText,
  FloatingCards3DHero,
} from "./hero-sections-additional";

// Define all hero section variants
const heroSectionVariants: PackVariant[] = [
  {
    id: "beams-and-grid",
    title: "Hero with Beams and Grid",
    description: "Animated beams with collision detection and background grid pattern",
    icon: Zap,
    component: HeroSectionWithBeamsAndGrid,
    tags: ["animation", "beams", "grid", "collision"],
    featured: true,
    codeExample: `import { HeroSectionWithBeamsAndGrid } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithBeamsAndGrid />;
}`,
  },
  {
    id: "images-grid",
    title: "Hero with Images Grid",
    description: "Features navbar, image avatars, and scrolling image grid background",
    icon: Images,
    component: HeroSectionWithImagesGrid,
    tags: ["navbar", "images", "grid", "avatars"],
    featured: false,
    codeExample: `import { HeroSectionWithImagesGrid } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithImagesGrid />;
}`,
  },
  {
    id: "centered-image",
    title: "Hero with Centered Image",
    description: "Clean hero with centered content and large image display",
    icon: Layout,
    component: HeroWithCenteredImage,
    tags: ["centered", "clean", "image", "minimal"],
    featured: false,
    codeExample: `import { HeroWithCenteredImage } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroWithCenteredImage />;
}`,
  },
  {
    id: "bento-grid",
    title: "Hero with Bento Grid",
    description: "Modern bento-style grid layout with cards and highlighted text",
    icon: Grid3x3,
    component: HeroSectionWithBentoGrid,
    tags: ["bento", "grid", "cards", "modern"],
    featured: true,
    codeExample: `import { HeroSectionWithBentoGrid } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithBentoGrid />;
}`,
  },
  {
    id: "text-reveal",
    title: "Hero with Text Reveal",
    description: "Text reveal effect with gradient highlighting for key phrases",
    icon: Type,
    component: HeroSectionWithTextReveal,
    tags: ["text", "reveal", "gradient", "highlight"],
    featured: false,
    codeExample: `import { HeroSectionWithTextReveal } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithTextReveal />;
}`,
  },
  {
    id: "sparkles",
    title: "Hero with Sparkles",
    description: "Animated sparkle particles background with centered content",
    icon: Sparkles,
    component: HeroSectionWithSparkles,
    tags: ["sparkles", "particles", "animation", "background"],
    featured: false,
    codeExample: `import { HeroSectionWithSparkles } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithSparkles />;
}`,
  },
  {
    id: "noise-background",
    title: "Hero with Noise Background",
    description: "Hero section with noise texture and striped background effect",
    icon: Volume2,
    component: HeroSectionWithNoiseBackground,
    tags: ["noise", "texture", "stripes", "background"],
    featured: false,
    codeExample: `import { HeroSectionWithNoiseBackground } from "@/packs/hero-sections";

export function MyHero() {
  return <HeroSectionWithNoiseBackground />;
}`,
  },
  {
    id: "centered-testimonials",
    title: "Centered Around Testimonials",
    description: "Hero section with animated testimonial cards that move on scroll",
    icon: MessageCircle,
    component: CenteredAroundTestimonials,
    tags: ["testimonials", "scroll", "animation", "cards"],
    featured: true,
    codeExample: `import { CenteredAroundTestimonials } from "@/packs/hero-sections";

export function MyHero() {
  return <CenteredAroundTestimonials />;
}`,
  },
  {
    id: "two-column-with-image",
    title: "Two Column with Image",
    description: "Split layout hero with text on left and dashboard image on right",
    icon: Columns,
    component: TwoColumnWithImage,
    tags: ["two-column", "split", "dashboard", "image"],
    featured: false,
    codeExample: `import { TwoColumnWithImage } from "@/packs/hero-sections";

export function MyHero() {
  return <TwoColumnWithImage />;
}`,
  },
  {
    id: "playful-hero",
    title: "Playful Hero Section",
    description: "Mobile app showcase with animated highlights and chat mockup",
    icon: Smartphone,
    component: PlayfulHeroSection,
    tags: ["mobile", "playful", "animation", "highlights"],
    featured: true,
    codeExample: `import { PlayfulHeroSection } from "@/packs/hero-sections";

export function MyHero() {
  return <PlayfulHeroSection />;
}`,
  },
  {
    id: "modern-gradients",
    title: "Modern Hero with Gradients",
    description: "Minimalist hero section with animated gradient lines and modern typography",
    icon: Sparkles,
    component: ModernHeroWithGradients,
    tags: ["modern", "gradients", "minimal", "animation"],
    featured: false,
    codeExample: `import { ModernHeroWithGradients } from "@/packs/hero-sections";

export function MyHero() {
  return <ModernHeroWithGradients />;
}`,
  },
  {
    id: "full-background-image",
    title: "Full Background Image With Text",
    description: "Hero section with full background image, gradient overlay, and logo showcase",
    icon: Images,
    component: FullBackgroundImageWithText,
    tags: ["background", "image", "overlay", "logos"],
    featured: false,
    codeExample: `import { FullBackgroundImageWithText } from "@/packs/hero-sections";

export function MyHero() {
  return <FullBackgroundImageWithText gradientFade={true} />;
}`,
  },
  {
    id: "floating-cards-3d",
    title: "Floating Cards 3D Hero",
    description: "Interactive 3D cards that respond to mouse movement with glassmorphism design",
    icon: Layers,
    component: FloatingCards3DHero,
    tags: ["3d", "interactive", "glassmorphism", "mouse-tracking"],
    featured: true,
    codeExample: `import { FloatingCards3DHero } from "@/packs/hero-sections";

export function MyHero() {
  return <FloatingCards3DHero />;
}`,
  },
];

// Define the complete hero sections pack
const heroSectionsPack: ComponentPack = {
  id: "hero-sections",
  name: "hero-sections",
  title: "Hero Sections",
  description: "A comprehensive collection of hero section components with animations, beams, grids, and interactive effects. Perfect for landing pages, product launches, and creative headers.",
  icon: Layout,
  category: "hero",
  variants: heroSectionVariants,
  tags: ["landing", "hero", "animation", "beams", "grid", "navbar", "particles"],
  dependencies: [
    "motion",
    "next/image",
    "next/link",
    "react-fast-marquee",
    "react-wrap-balancer",
    "react-rough-notation",
    "react-icons",
    "@tabler/icons-react",
    "next/font/google",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/hero-sections",
  documentation: "/packs-gallery/hero-sections",
  installCommand: "npm i motion next react-fast-marquee react-wrap-balancer react-rough-notation react-icons @tabler/icons-react",
  importExample: `import { 
  HeroSectionWithBeamsAndGrid,
  HeroSectionWithImagesGrid,
  HeroWithCenteredImage,
  HeroSectionWithBentoGrid,
  HeroSectionWithTextReveal,
  HeroSectionWithSparkles,
  HeroSectionWithNoiseBackground,
  CenteredAroundTestimonials,
  TwoColumnWithImage,
  PlayfulHeroSection,
  ModernHeroWithGradients,
  FullBackgroundImageWithText,
  FloatingCards3DHero
} from "@/packs/hero-sections";`,
};

// Register the pack
registerPack(heroSectionsPack);

// Export for external use
export { heroSectionsPack, heroSectionVariants };
export default heroSectionsPack;