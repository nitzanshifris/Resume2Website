// Main exports for the component adapter system
export { ComponentMapper } from "./mapper";
export { StyleResolver } from "./style-resolver";
export { ThemeApplicator } from "./theme-applicator";
export { 
  COMPONENT_REGISTRY, 
  findComponentsForDataType, 
  findComponentsForUIStyle,
  canComponentHandleData 
} from "./component-registry";
export { usePortfolioAdapter, useComponentAdapter } from "./usePortfolioAdapter";
export { generateAdapterCode } from "./future-component-template";

// Type exports
export type { ComponentType } from "./general-adapter";
export type { ComponentMapping } from "./component-registry";
export type { StyleConfig } from "./style-resolver";
export type {
  TimelineEntry,
  TimelineItem,
  BentoGridItem,
  Card3DData,
  ExpandableCardData,
  CarouselSlide,
  HeroData,
  SkillItem,
  ProjectData,
  AchievementData,
  ContactData,
  ThemeConfig,
  UIStyle,
  SectionConfig,
} from "./types/backend-types";