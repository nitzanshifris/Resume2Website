import { ReactNode } from "react";

export interface HeroSectionProps {
  className?: string;
  children?: ReactNode;
}

export interface BadgeProps extends React.ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
}

export interface ButtonProps {
  children?: ReactNode;
  className?: string;
  variant?: "simple" | "outline" | "primary";
  as?: React.ElementType<any>;
  href?: string;
  [x: string]: any;
}

export interface HeroSectionPackVariants {
  beamsAndGrid: "hero-section-with-beams-and-grid";
  imagesGrid: "hero-section-with-images-grid";
  centeredImage: "hero-with-centered-image";
  bentoGrid: "hero-section-with-bento-grid";
  textReveal: "hero-section-with-text-reveal";
  sparkles: "hero-section-with-sparkles";
}

export interface PackMetadata {
  name: string;
  description: string;
  category: "hero";
  variants: string[];
  dependencies: string[];
  tags: string[];
}