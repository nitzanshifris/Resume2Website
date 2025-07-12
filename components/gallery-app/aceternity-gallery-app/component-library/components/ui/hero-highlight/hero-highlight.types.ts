import { ReactNode } from "react";

export interface HeroHighlightProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export interface HighlightProps {
  children: ReactNode;
  className?: string;
}

export interface HeroHighlightDemoProps {
  className?: string;
}