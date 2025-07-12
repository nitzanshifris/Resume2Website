// Export base components
export { FeatureSections, FeatureCard, FeatureTitle, FeatureDescription } from "./feature-sections-base";

// Export variants
export { FeatureSectionsBento, SkeletonOne, SkeletonTwo, SkeletonThree, SkeletonFour, Globe } from "./feature-sections-bento";
export { FeatureSectionsSimple, Grid, GridPattern } from "./feature-sections-simple";
export { FeatureSectionsHover } from "./feature-sections-hover";

// Export gallery previews
export { 
  FeatureSectionsGalleryPreview,
  FeatureSectionsGalleryBento,
  FeatureSectionsGalleryHover
} from "./feature-sections-gallery-preview";

// Export types
export type { 
  Feature,
  FeatureSectionsProps,
  BentoFeatureSectionsProps,
  SimpleFeatureSectionsProps,
  GridPatternProps
} from "./feature-sections.types";