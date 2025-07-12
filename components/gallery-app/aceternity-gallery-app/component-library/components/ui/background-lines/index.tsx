export { BackgroundLines } from "./background-lines-base";
export { BackgroundLinesHeroSection } from "./background-lines-hero-section";
export { BackgroundLinesAboutSection } from "./background-lines-about-section";
export { BackgroundLinesServicesSection } from "./background-lines-services-section";
export { BackgroundLinesMinimal } from "./background-lines-minimal";
export { BackgroundLinesFastAnimation } from "./background-lines-fast-animation";
export { BackgroundLinesContactSection } from "./background-lines-contact-section";

// Preview components for gallery
export { BackgroundLinesPreviewHero } from "./background-lines-preview-hero";
export { BackgroundLinesPreviewAbout } from "./background-lines-preview-about";
export { BackgroundLinesPreviewServices } from "./background-lines-preview-services";
export { BackgroundLinesPreviewContact } from "./background-lines-preview-contact";

// Gallery-specific preview components with size constraints
export { 
  BackgroundLinesGalleryHero,
  BackgroundLinesGalleryAbout,
  BackgroundLinesGalleryServices,
  BackgroundLinesGalleryContact,
  BackgroundLinesGalleryMinimal,
  BackgroundLinesGalleryFast
} from "./background-lines-gallery-preview";

export type { 
  BackgroundLinesProps, 
  SVGOptions, 
  HeroSectionProps, 
  AboutSectionProps, 
  ServiceSectionProps 
} from "./background-lines.types";