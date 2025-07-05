import { Type, TextCursorInput, Keyboard, Eye } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { TextAnimationFlippingWords, TextAnimationTypewriterEffect, TextAnimationBlurFadeInDemo } from "./text-animations-base";

// Define all text animation variants
const textAnimationsVariants: PackVariant[] = [
  {
    id: "text-animation-flipping-words",
    title: "Text Animation Flipping Words",
    description: "Animated typewriter effect with rotating 3D characters and a dynamic cursor indicator",
    icon: TextCursorInput,
    component: TextAnimationFlippingWords,
    tags: ["text", "animation", "typewriter", "3d", "flipping"],
    featured: true,
    codeExample: `import { TextAnimationFlippingWords } from "@/packs/text-animations";

export function MyLandingPage() {
  return <TextAnimationFlippingWords />;
}`,
  },
  {
    id: "text-animation-typewriter-effect",
    title: "Text Animation Typewriter Effect",
    description: "Classic typewriter animation with customizable typing speed, 3D character effects and animated cursor",
    icon: Keyboard,
    component: TextAnimationTypewriterEffect,
    tags: ["text", "animation", "typewriter", "typing", "cursor"],
    featured: true,
    codeExample: `import { TextAnimationTypewriterEffect } from "@/packs/text-animations";

export function MyLandingPage() {
  return <TextAnimationTypewriterEffect />;
}`,
  },
  {
    id: "text-animation-blur-fade-in",
    title: "Text Animation Blur Fade In",
    description: "Word-by-word blur fade animation triggered on scroll with staggered timing for smooth reveal",
    icon: Eye,
    component: TextAnimationBlurFadeInDemo,
    tags: ["text", "animation", "blur", "fade", "scroll"],
    featured: false,
    codeExample: `import { TextAnimationBlurFadeInDemo } from "@/packs/text-animations";

export function MyLandingPage() {
  return <TextAnimationBlurFadeInDemo />;
}`,
  },
];

// Define the complete text animations pack
const textAnimationsPack: ComponentPack = {
  id: "text-animations",
  name: "text-animations",
  title: "Text Animations",
  description: "Text animations components for headings and paragraphs. Add life to your typography with smooth, eye-catching effects.",
  icon: Type,
  category: "animation",
  variants: textAnimationsVariants,
  tags: ["text", "animation", "typography", "effects", "motion"],
  dependencies: [
    "motion",
    "clsx",
    "tailwind-merge",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/text-animations",
  documentation: "/packs-gallery/text-animations",
  installCommand: "npm i motion clsx tailwind-merge",
  importExample: `import { 
  TextAnimationFlippingWords,
  TextAnimationTypewriterEffect,
  TextAnimationBlurFadeInDemo
} from "@/packs/text-animations";`,
};

// Register the pack
registerPack(textAnimationsPack);

// Export for external use
export { textAnimationsPack, textAnimationsVariants };
export default textAnimationsPack;