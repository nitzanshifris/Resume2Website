// Feature sections type definitions
export interface FeatureItem {
  title: string;
  description: string;
  skeleton: React.ReactNode;
  className?: string;
}

export interface FeatureSectionProps {
  features?: FeatureItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export type FeatureSectionsVariant = "bento-grid" | "simple-grid" | "cards";

export interface FeatureSectionsStyle {
  container?: string;
  grid?: string;
  card?: string;
  title?: string;
  description?: string;
}