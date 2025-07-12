import { BarChart3, TrendingUp, Grid3x3, Sparkles, Timer } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { StatsForChangelog, StatsWithGridBackground, StatsWithGradient, StatsWithNumberTicker } from "./stats-sections-base";

// Define all stats section variants
const statsSectionsVariants: PackVariant[] = [
  {
    id: "stats-for-changelog",
    title: "Stats For Changelog",
    description: "Beautiful changelog display with tabbed navigation, animations, and responsive design",
    icon: TrendingUp,
    component: StatsForChangelog,
    tags: ["stats", "changelog", "tabs", "animated", "timeline"],
    featured: true,
    codeExample: `import { StatsForChangelog } from "@/packs/stats-sections";

export function MyChangelog() {
  return <StatsForChangelog />;
}`,
  },
  {
    id: "stats-with-grid-background",
    title: "Stats With Grid Background",
    description: "Stats cards with grid pattern background, animated edge elements, and icon containers",
    icon: Grid3x3,
    component: StatsWithGridBackground,
    tags: ["stats", "grid", "cards", "metrics", "animated"],
    featured: true,
    codeExample: `import { StatsWithGridBackground } from "@/packs/stats-sections";

export function MyStats() {
  return <StatsWithGridBackground />;
}`,
  },
  {
    id: "stats-with-gradient",
    title: "Stats With Gradient",
    description: "Stats cards with gradient background, animated blur effects, and diagonal line patterns",
    icon: Sparkles,
    component: StatsWithGradient,
    tags: ["stats", "gradient", "cards", "blur", "animated"],
    featured: true,
    codeExample: `import { StatsWithGradient } from "@/packs/stats-sections";

export function MyStats() {
  return <StatsWithGradient />;
}`,
  },
  {
    id: "stats-with-number-ticker",
    title: "Stats With Number Ticker",
    description: "Animated stats with number counting effect that triggers on scroll",
    icon: Timer,
    component: StatsWithNumberTicker,
    tags: ["stats", "animated", "counter", "ticker", "scroll"],
    featured: true,
    codeExample: `import { StatsWithNumberTicker } from "@/packs/stats-sections";

export function MyStats() {
  return <StatsWithNumberTicker />;
}`,
  },
];

// Define the complete stats sections pack
const statsSectionsPack: ComponentPack = {
  id: "stats-sections",
  name: "stats-sections",
  title: "Stats Sections",
  description: "Perfect for displaying numbers, stats and changelogs. Beautiful components for showcasing metrics and updates.",
  icon: BarChart3,
  category: "content",
  variants: statsSectionsVariants,
  tags: ["stats", "metrics", "changelog", "numbers", "data"],
  dependencies: [
    "motion",
    "clsx",
    "tailwind-merge",
    "next",
    "@tabler/icons-react",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/stats-sections",
  documentation: "/packs-gallery/stats-sections",
  installCommand: "npm i motion clsx tailwind-merge @tabler/icons-react",
  importExample: `import { 
  StatsForChangelog,
  StatsWithGridBackground,
  StatsWithGradient,
  StatsWithNumberTicker
} from "@/packs/stats-sections";`,
};

// Register the pack
registerPack(statsSectionsPack);

// Export for external use
export { statsSectionsPack, statsSectionsVariants };
export default statsSectionsPack;