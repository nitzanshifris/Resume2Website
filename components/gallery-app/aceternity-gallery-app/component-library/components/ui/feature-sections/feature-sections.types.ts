import { ReactNode } from "react";

export interface Feature {
  title: string;
  description: string;
  icon?: ReactNode;
  skeleton?: ReactNode;
  className?: string;
  href?: string;
}

export interface FeatureSectionsProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export interface BentoFeatureSectionsProps extends FeatureSectionsProps {
  variant?: "bento";
}

export interface SimpleFeatureSectionsProps extends FeatureSectionsProps {
  variant?: "simple" | "hover";
  columns?: 1 | 2 | 3 | 4;
}

export interface GridPatternProps {
  width?: number;
  height?: number;
  x?: string;
  y?: string;
  squares?: number[][];
  className?: string;
  pattern?: number[][];
  size?: number;
}