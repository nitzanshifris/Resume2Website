// Cards type definitions
export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardSkeletonProps {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}

export interface LogoProps {
  className?: string;
}

export type CardVariant = "default" | "animated" | "minimal";

export interface CardsStyle {
  container?: string;
  title?: string;
  description?: string;
  skeleton?: string;
}