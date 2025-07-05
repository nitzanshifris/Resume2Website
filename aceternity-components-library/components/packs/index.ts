// Import all pack configurations to register them
import "./hero-sections/hero-sections-pack-config";
import "./logo-clouds/logo-clouds-pack-config";
import "./bento-grids/bento-grids-pack-config";
import "./cta-sections/cta-sections-pack-config";
import "./testimonials/testimonials-pack-config";
import "./feature-sections/feature-sections-pack-config";
import "./pricing-sections/pricing-sections-pack-config";
import "./cards/cards-pack-config";
import "./navbars/navbars-pack-config";
import "./footers/footers-pack-config";
import "./contact-sections/contact-sections-pack-config";
import "./blog-sections/blog-sections-pack-config";
import "./blog-content-sections/blog-content-sections-pack-config";
import "./faq-sections/faq-sections-pack-config";
import "./sidebars/sidebars-pack-config";
import "./stats-sections/stats-sections-pack-config";
import "./backgrounds/backgrounds-pack-config";
import "./text-animations/text-animations-pack-config";

// Re-export registry utilities
export * from "./pack-registry";

// Re-export individual pack configs
export { default as heroSectionsPack } from "./hero-sections/hero-sections-pack-config";
export { default as logoCloudsPack } from "./logo-clouds/logo-clouds-pack-config";
export { default as bentoGridsPack } from "./bento-grids/bento-grids-pack-config";
export { default as ctaSectionsPack } from "./cta-sections/cta-sections-pack-config";
export { default as testimonialsPack } from "./testimonials/testimonials-pack-config";
export { default as featureSectionsPack } from "./feature-sections/feature-sections-pack-config";
export { default as pricingSectionsPack } from "./pricing-sections/pricing-sections-pack-config";
export { default as cardsPack } from "./cards/cards-pack-config";
export { default as navbarsPack } from "./navbars/navbars-pack-config";
export { default as footersPack } from "./footers/footers-pack-config";
export { default as contactSectionsPack } from "./contact-sections/contact-sections-pack-config";
export { default as blogSectionsPack } from "./blog-sections/blog-sections-pack-config";
export { default as blogContentSectionsPack } from "./blog-content-sections/blog-content-sections-pack-config";
export { default as faqSectionsPack } from "./faq-sections/faq-sections-pack-config";
export { default as sidebarsPack } from "./sidebars/sidebars-pack-config";
export { default as statsSectionsPack } from "./stats-sections/stats-sections-pack-config";
export { default as backgroundsPack } from "./backgrounds/backgrounds-pack-config";
export { default as textAnimationsPack } from "./text-animations/text-animations-pack-config";