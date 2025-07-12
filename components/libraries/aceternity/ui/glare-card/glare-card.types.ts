import { ReactElement } from "react";

export interface GlareCardProps {
  children: ReactElement;
  className?: string;
  /**
   * Optional Tailwind classes to apply on the outer container (controls width / aspect ratio etc.)
   */
  containerClassName?: string;
}