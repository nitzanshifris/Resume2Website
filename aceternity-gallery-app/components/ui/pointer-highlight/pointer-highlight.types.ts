import { ReactNode } from "react";

export interface PointerHighlightProps {
  children: ReactNode;
  rectangleClassName?: string;
  pointerClassName?: string;
  containerClassName?: string;
}