import { MessageSquare, Grid3x3, Sparkles, LayoutGrid } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { TestimonialsGridWithCenteredCarousel, TestimonialsMarqueeGrid, TestimonialsMasonryGrid } from "./testimonials-base";

// Define all testimonial variants
const testimonialsVariants: PackVariant[] = [
  {
    id: "grid-centered-carousel",
    title: "Testimonials Grid with Centered Carousel",
    description: "Featured testimonial carousel overlaying a background grid of testimonials",
    icon: Grid3x3,
    component: TestimonialsGridWithCenteredCarousel,
    tags: ["grid", "carousel", "featured", "animated", "social-proof"],
    featured: true,
    codeExample: `import { TestimonialsGridWithCenteredCarousel } from "@/packs/testimonials";

export function MyTestimonials() {
  return <TestimonialsGridWithCenteredCarousel />;
}`,
  },
  {
    id: "marquee-grid",
    title: "Testimonials Marquee Grid",
    description: "Auto-scrolling testimonials in dual marquee rows with different speeds",
    icon: Sparkles,
    component: TestimonialsMarqueeGrid,
    tags: ["marquee", "auto-scroll", "animated", "continuous", "social-proof"],
    featured: true,
    codeExample: `import { TestimonialsMarqueeGrid } from "@/packs/testimonials";

export function MyMarqueeTestimonials() {
  return <TestimonialsMarqueeGrid />;
}`,
  },
  {
    id: "masonry-grid",
    title: "Testimonials Masonry Grid",
    description: "Pinterest-style masonry grid layout for testimonials with quote icons",
    icon: LayoutGrid,
    component: TestimonialsMasonryGrid,
    tags: ["masonry", "grid", "cards", "quote", "social-proof"],
    featured: true,
    codeExample: `import { TestimonialsMasonryGrid } from "@/packs/testimonials";

export function MyMasonryTestimonials() {
  return <TestimonialsMasonryGrid />;
}`,
  },
];

// Define the complete testimonials pack
const testimonialsPack: ComponentPack = {
  id: "testimonials",
  name: "testimonials",
  title: "Testimonials",
  description: "Testimonials sections for social proof and trust. Showcase customer feedback with beautiful animations.",
  icon: MessageSquare,
  category: "marketing",
  variants: testimonialsVariants,
  tags: ["testimonials", "social-proof", "trust", "reviews", "feedback"],
  dependencies: [
    "motion",
    "clsx",
    "tailwind-merge",
    "@headlessui/react",
    "react-fast-marquee",
    "react-icons",
  ],
  implemented: true,
  featured: true,
  version: "1.0.0",
  author: "Aceternity",
  license: "MIT",
  repository: "https://github.com/aceternity/testimonials",
  documentation: "/packs-gallery/testimonials",
  installCommand: "npm i motion clsx tailwind-merge @headlessui/react react-fast-marquee react-icons",
  importExample: `import { 
  TestimonialsGridWithCenteredCarousel,
  TestimonialsMarqueeGrid,
  TestimonialsMasonryGrid,
  TestimonialsGrid,
  TestimonialsSlider,
  TestimonialsMarquee,
  Card,
  Quote,
  QuoteDescription
} from "@/packs/testimonials";`,
};

// Register the pack
registerPack(testimonialsPack);

// Export for external use
export { testimonialsPack, testimonialsVariants };
export default testimonialsPack;