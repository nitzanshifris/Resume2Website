import { ReactNode } from "react";

export interface ButtonProps {
  borderRadius?: string;
  children: ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}

export interface MovingBorderProps {
  children: ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}