import { ReactNode } from "react";

export interface PinContainerProps {
  children: ReactNode;
  title?: string | ReactNode;
  href?: string;
  className?: string;
  containerClassName?: string;
}

export interface PinPerspectiveProps {
  title?: string | ReactNode;
}