import { ReactNode } from "react";

export interface TextRevealCardProps {
  text: string;
  revealText: string;
  children?: ReactNode;
  className?: string;
}

export interface TextRevealCardTitleProps {
  children: ReactNode;
  className?: string;
}

export interface TextRevealCardDescriptionProps {
  children: ReactNode;
  className?: string;
}