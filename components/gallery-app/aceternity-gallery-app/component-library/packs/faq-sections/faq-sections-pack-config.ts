import { HelpCircle, MessageSquare, Grid3x3 } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { FrequentlyAskedQuestionsAccordion, SimpleFaqsWithBackground, FAQsWithGrid } from "./faq-sections-base";

// Define all FAQ section variants
const faqSectionsVariants: PackVariant[] = [
  {
    id: "faq-accordion",
    title: "Frequently asked questions with accordion",
    description: "FAQ section with smooth accordion animations, plus/minus icons, and minimal design",
    icon: HelpCircle,
    component: FrequentlyAskedQuestionsAccordion,
    tags: ["faq", "accordion", "animated", "minimal", "micro-interactions"],
    featured: true,
    codeExample: `import { FrequentlyAskedQuestionsAccordion } from "@/packs/faq-sections";

export function MyFAQSection() {
  return <FrequentlyAskedQuestionsAccordion />;
}`,
  },
  {
    id: "simple-faqs-with-background",
    title: "Simple FAQs with Background",
    description: "FAQ section with card backgrounds, chevron icons, and beautiful text blur animations",
    icon: MessageSquare,
    component: SimpleFaqsWithBackground,
    tags: ["faq", "cards", "background", "blur-animation", "chevron"],
    featured: false,
    codeExample: `import { SimpleFaqsWithBackground } from "@/packs/faq-sections";

export function MyFAQSection() {
  return <SimpleFaqsWithBackground />;
}`,
  },
  {
    id: "faqs-with-grid",
    title: "FAQs with Grid",
    description: "Minimal FAQ section with grid layout, clean design, and rotating plus icons",
    icon: Grid3x3,
    component: FAQsWithGrid,
    tags: ["faq", "grid", "minimal", "clean", "plus-icon"],
    featured: false,
    codeExample: `import { FAQsWithGrid } from "@/packs/faq-sections";

export function MyFAQSection() {
  return <FAQsWithGrid />;
}`,
  },
];

// Define the complete FAQ sections pack
const faqSectionsPack: ComponentPack = {
  id: "faq-sections",
  name: "faq-sections",
  title: "Frequently Asked Questions",
  description: "Elegant and minimal FAQs with grid, accordions and micro-interactions. Beautiful FAQ layouts for your website.",
  icon: HelpCircle,
  category: "content",
  variants: faqSectionsVariants,
  tags: ["faq", "accordion", "questions", "support", "help"],
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
  repository: "https://github.com/aceternity/faq-sections",
  documentation: "/packs-gallery/faq-sections",
  installCommand: "npm i motion clsx tailwind-merge @tabler/icons-react",
  importExample: `import { 
  FrequentlyAskedQuestionsAccordion,
  SimpleFaqsWithBackground,
  FAQsWithGrid
} from "@/packs/faq-sections";`,
};

// Register the pack
registerPack(faqSectionsPack);

// Export for external use
export { faqSectionsPack, faqSectionsVariants };
export default faqSectionsPack;