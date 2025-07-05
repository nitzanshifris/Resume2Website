import { ReactElement } from "react";

export interface ButtonsCardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ButtonDefinition {
  name: string;
  description: string;
  component: ReactElement;
  showDot?: boolean;
  code?: string;
}

export interface TailwindcssButtonsProps {
  className?: string;
}