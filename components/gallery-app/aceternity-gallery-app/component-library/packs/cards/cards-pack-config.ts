import { CreditCard, Sparkles, MousePointerClick, Layers, FileText } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { CardDemo, ExpandableCardOnClick, BackgroundOverlayCard, ContentCard } from "./cards-base";

// Define all card variants
const cardsVariants: PackVariant[] = [
  {
    id: "feature-block-animated",
    title: "Feature Block Animated Card",
    description: "Interactive card with animated AI tool icons, sparkles, and moving gradient line",
    icon: Sparkles,
    component: CardDemo,
    tags: ["card", "animated", "ai", "tools", "sparkles", "interactive"],
    featured: true,
    codeExample: `import { CardDemo } from "@/packs/cards";

export function MyCard() {
  return <CardDemo />;
}`,
  },
  {
    id: "expandable-card-on-click",
    title: "Expandable Card On Click",
    description: "Interactive cards that expand on click with smooth animations and detailed content",
    icon: MousePointerClick,
    component: ExpandableCardOnClick,
    tags: ["card", "expandable", "interactive", "click", "animation", "layout"],
    featured: false,
    codeExample: `import { ExpandableCardOnClick } from "@/packs/cards";

export function MyExpandableCards() {
  return <ExpandableCardOnClick />;
}`,
  },
  {
    id: "background-overlay-card",
    title: "Background Overlay Card",
    description: "Card with background image that transitions to animated GIF on hover with overlay effect",
    icon: Layers,
    component: BackgroundOverlayCard,
    tags: ["card", "background", "overlay", "hover", "animation", "gif"],
    featured: false,
    codeExample: `import { BackgroundOverlayCard } from "@/packs/cards";

export function MyOverlayCard() {
  return <BackgroundOverlayCard />;
}`,
  },
  {
    id: "content-card",
    title: "Content Card",
    description: "Author card with avatar, name and reading time - perfect for blog posts and articles",
    icon: FileText,
    component: ContentCard,
    tags: ["card", "content", "author", "blog", "avatar", "article"],
    featured: false,
    codeExample: `import { ContentCard } from "@/packs/cards";

export function MyContentCard() {
  return <ContentCard />;
}`,
  },
];

// Define the complete cards pack
const cardsPack: ComponentPack = {
  id: "cards",
  name: "cards",
  title: "Cards",
  description: "A set of cards that can be used for different use cases. Perfect for showcasing features, tools, or any content with beautiful animations.",
  icon: CreditCard,
  category: "content",
  variants: cardsVariants,
  tags: ["cards", "content", "showcase", "animated", "interactive"],
  dependencies: [
    "motion",
    "clsx",
    "tailwind-merge",
    "react-icons",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/cards",
  documentation: "/packs-gallery/cards",
  installCommand: "npm i motion clsx tailwind-merge react-icons",
  importExample: `import { 
  CardDemo,
  Card,
  CardTitle,
  CardDescription,
  CardSkeletonContainer
} from "@/packs/cards";`,
};

// Register the pack
registerPack(cardsPack);

// Export for external use
export { cardsPack, cardsVariants };
export default cardsPack;