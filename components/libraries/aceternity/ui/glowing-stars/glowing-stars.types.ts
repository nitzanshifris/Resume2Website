import { ReactElement } from "react";

export interface GlowingStarsBackgroundCardProps {
  className?: string;
  children?: ReactElement;
}

export interface GlowingStarsDescriptionProps {
  className?: string;
  children?: ReactElement;
}

export interface GlowingStarsTitleProps {
  className?: string;
  children?: ReactElement;
}

export interface IllustrationProps {
  mouseEnter: boolean;
}

export interface StarProps {
  isGlowing: boolean;
  delay: number;
}

export interface GlowProps {
  delay: number;
}