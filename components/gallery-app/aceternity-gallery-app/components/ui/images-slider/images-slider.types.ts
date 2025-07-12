import { ReactNode } from "react";

export interface ImagesSliderProps {
  images: string[];
  children: ReactNode;
  overlay?: ReactNode;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
}

export interface ImagesSliderDemoProps {
  className?: string;
}