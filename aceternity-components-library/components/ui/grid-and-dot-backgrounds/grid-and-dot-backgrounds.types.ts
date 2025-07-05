import { ReactNode } from "react";

export interface GridAndDotBackgroundsBaseProps {
  children?: ReactNode;
  variant?: "grid" | "gridSmall" | "dot";
  size?: "default" | "small";
  className?: string;
}

export interface GridAndDotBackgroundsDemoProps {
  className?: string;
}