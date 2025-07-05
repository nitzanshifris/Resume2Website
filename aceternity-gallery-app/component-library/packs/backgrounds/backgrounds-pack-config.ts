import { Palette, Video, Zap, Circle, Grid3x3, CircleDot, ArrowDownToLine, Square, Activity } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { BackgroundWithFullVideo, BackgroundLines, BackgroundDots, BackgroundNoiseGrid, BackgroundDotsMasked, BackgroundDotsMaskedVertical, BackgroundWithSkewedRectangles, BackgroundWithSkewedLines } from "./backgrounds-base";

// Define all background variants
const backgroundsVariants: PackVariant[] = [
  {
    id: "background-with-full-video",
    title: "Background With Full Video",
    description: "Full-screen video background with animated colorful text and radial mask effect",
    icon: Video,
    component: BackgroundWithFullVideo,
    tags: ["background", "video", "animated", "colorful", "full-screen"],
    featured: true,
    codeExample: `import { BackgroundWithFullVideo } from "@/packs/backgrounds";

export function MyLandingPage() {
  return <BackgroundWithFullVideo />;
}`,
  },
  {
    id: "background-lines",
    title: "Background Lines",
    description: "Animated shooting stars with pulsating circles creating a futuristic space effect",
    icon: Zap,
    component: BackgroundLines,
    tags: ["background", "animated", "shooting-stars", "circles", "space"],
    featured: true,
    codeExample: `import { BackgroundLines } from "@/packs/backgrounds";

export function MyLandingPage() {
  return <BackgroundLines />;
}`,
  },
  {
    id: "background-dots",
    title: "Background Dots",
    description: "Dot pattern background with radial gradient mask creating a subtle depth effect",
    icon: Circle,
    component: BackgroundDots,
    tags: ["background", "dots", "pattern", "radial-gradient", "subtle"],
    featured: false,
    codeExample: `import { BackgroundDots } from "@/packs/backgrounds";

export function MyLandingPage() {
  return <BackgroundDots />;
}`,
  },
  {
    id: "background-noise-grid",
    title: "Background Noise Grid",
    description: "Dynamic striped background with noise texture overlay for a unique visual effect",
    icon: Grid3x3,
    component: BackgroundNoiseGrid,
    tags: ["background", "noise", "grid", "stripes", "dynamic"],
    featured: true,
    codeExample: `import { BackgroundNoiseGrid } from "@/packs/backgrounds";

export function MyLandingPage() {
  return <BackgroundNoiseGrid />;
}`,
  },
  {
    id: "background-dots-masked",
    title: "Background Dots Masked",
    description: "Subtle dot pattern with radial gradient mask using CSS gradients for a clean, modern look",
    icon: CircleDot,
    component: BackgroundDotsMasked,
    tags: ["background", "dots", "masked", "gradient", "css-pattern"],
    featured: false,
    codeExample: `import { BackgroundDotsMasked } from "@/packs/backgrounds";

export function MyLandingPage() {
  return <BackgroundDotsMasked />;
}`,
  },
  {
    id: "background-dots-masked-vertical",
    title: "Background Dots Masked Vertical",
    description: "Dot pattern with vertical linear gradient mask creating a fade-to-bottom effect",
    icon: ArrowDownToLine,
    component: BackgroundDotsMaskedVertical,
    tags: ["background", "dots", "masked", "vertical-gradient", "fade"],
    featured: false,
    codeExample: `import { BackgroundDotsMaskedVertical } from "@/packs/backgrounds";

export function MyLandingPage() {
  return <BackgroundDotsMaskedVertical />;
}`,
  },
  {
    id: "background-skewed-rectangles",
    title: "Background With Skewed Rectangles",
    description: "3D perspective grid with skewed rectangles creating a dynamic spatial effect",
    icon: Square,
    component: BackgroundWithSkewedRectangles,
    tags: ["background", "3d", "perspective", "grid", "skewed"],
    featured: true,
    codeExample: `import { BackgroundWithSkewedRectangles } from "@/packs/backgrounds";

export function MyLandingPage() {
  return <BackgroundWithSkewedRectangles />;
}`,
  },
  {
    id: "background-skewed-lines",
    title: "Background With Skewed Lines",
    description: "Diagonal line pattern with SVG creating a dynamic, modern backdrop",
    icon: Activity,
    component: BackgroundWithSkewedLines,
    tags: ["background", "lines", "diagonal", "svg", "pattern"],
    featured: false,
    codeExample: `import { BackgroundWithSkewedLines } from "@/packs/backgrounds";

export function MyLandingPage() {
  return <BackgroundWithSkewedLines />;
}`,
  },
];

// Define the complete backgrounds pack
const backgroundsPack: ComponentPack = {
  id: "backgrounds",
  name: "backgrounds",
  title: "Backgrounds",
  description: "A set of beautiful, creative backgrounds for landing pages. Elevate your designs with stunning visual effects.",
  icon: Palette,
  category: "visual",
  variants: backgroundsVariants,
  tags: ["background", "visual", "effects", "landing", "creative"],
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
  repository: "https://github.com/aceternity/backgrounds",
  documentation: "/packs-gallery/backgrounds",
  installCommand: "npm i motion clsx tailwind-merge",
  importExample: `import { 
  BackgroundWithFullVideo,
  BackgroundLines,
  BackgroundDots,
  BackgroundNoiseGrid,
  BackgroundDotsMasked,
  BackgroundDotsMaskedVertical,
  BackgroundWithSkewedRectangles,
  BackgroundWithSkewedLines
} from "@/packs/backgrounds";`,
};

// Register the pack
registerPack(backgroundsPack);

// Export for external use
export { backgroundsPack, backgroundsVariants };
export default backgroundsPack;