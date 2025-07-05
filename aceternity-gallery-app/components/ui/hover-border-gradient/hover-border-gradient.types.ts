import { ReactElement } from "react";

export type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export interface HoverBorderGradientProps
  extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: React.ElementType;
  duration?: number;
  clockwise?: boolean;
}

export interface HoverBorderGradientDemoProps {
  className?: string;
  containerClassName?: string;
}