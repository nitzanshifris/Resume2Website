import { ReactNode } from "react";

export interface PinContainerProps {
  children: ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}

export interface PinPerspectiveProps {
  title?: string;
}