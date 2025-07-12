import { Mail, MessageSquare } from "lucide-react";
import { ComponentPack, PackVariant, registerPack } from "../pack-registry";
import { ContactFormGridWithDetails, SimpleCenteredContactForm } from "./contact-sections-base";

// Define all contact section variants
const contactSectionsVariants: PackVariant[] = [
  {
    id: "contact-form-grid-details",
    title: "Contact Form Grid with Details",
    description: "Contact form with world map visualization, animated pin location, and grid background",
    icon: Mail,
    component: ContactFormGridWithDetails,
    tags: ["contact", "form", "map", "animation", "grid", "micro-interactions"],
    featured: true,
    codeExample: `import { ContactFormGridWithDetails } from "@/packs/contact-sections";

export function MyContactSection() {
  return <ContactFormGridWithDetails />;
}`,
  },
  {
    id: "simple-centered-contact-form",
    title: "Simple Centered Contact Form",
    description: "Clean, minimal contact form with social links and dark mode support",
    icon: MessageSquare,
    component: SimpleCenteredContactForm,
    tags: ["contact", "form", "minimal", "centered", "social-links"],
    featured: false,
    codeExample: `import { SimpleCenteredContactForm } from "@/packs/contact-sections";

export function MyContactSection() {
  return <SimpleCenteredContactForm />;
}`,
  },
];

// Define the complete contact sections pack
const contactSectionsPack: ComponentPack = {
  id: "contact-sections",
  name: "contact-sections",
  title: "Contact Sections",
  description: "Contact sections with forms and micro interactions. Beautiful, responsive contact forms with animations.",
  icon: Mail,
  category: "forms",
  variants: contactSectionsVariants,
  tags: ["contact", "forms", "sections", "animations", "micro-interactions"],
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
  repository: "https://github.com/aceternity/contact-sections",
  documentation: "/packs-gallery/contact-sections",
  installCommand: "npm i motion clsx tailwind-merge @tabler/icons-react",
  importExample: `import { 
  ContactFormGridWithDetails,
  SimpleCenteredContactForm,
  FeatureIconContainer,
  Grid,
  GridPattern
} from "@/packs/contact-sections";`,
};

// Register the pack
registerPack(contactSectionsPack);

// Export for external use
export { contactSectionsPack, contactSectionsVariants };
export default contactSectionsPack;