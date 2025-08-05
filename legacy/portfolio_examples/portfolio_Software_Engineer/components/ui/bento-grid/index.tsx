export { BentoGrid, BentoGridItem } from "./bento-grid-base";
export { BentoGridBasic } from "./bento-grid-basic";
export { BentoGridAnimated } from "./bento-grid-animated";
export { BentoGridTwoColumn } from "./bento-grid-two-column";
export { BentoGridSkillsShowcase } from "./bento-grid-skills-showcase";
export { BentoGridProjectsShowcase } from "./bento-grid-projects-showcase";
export { BentoGridServicesShowcase } from "./bento-grid-services-showcase";

// Preview components for gallery
export { BentoGridPreviewBasic } from "./bento-grid-preview-basic";
export { BentoGridPreviewSkills } from "./bento-grid-preview-skills";

// Gallery-optimized components with consistent sizing
export { 
  BentoGridGalleryBasic,
  BentoGridGalleryAnimated,
  BentoGridGallerySkills,
  BentoGridGalleryServices
} from "./bento-grid-gallery-preview";

export type { 
  BentoGridProps, 
  BentoGridItemProps, 
  BentoGridItemData,
  SkillItem,
  ProjectItem,
  ServiceItem
} from "./bento-grid.types";