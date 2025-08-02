import { ReactNode, ElementType } from "react";

export interface MouseEnterContextType {
  isMouseEntered: boolean;
  setIsMouseEntered: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CardContainerProps {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
}

export interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export interface CardItemProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: any;
}

// Enhanced types for better control
export interface EnhancedCardContainerProps {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  maxRotationX?: number;
  maxRotationY?: number;
  rotationIntensity?: number;
  enableRotation?: boolean;
  perspective?: number;
  transitionDuration?: number;
  rotationMethod?: "normalized" | "dynamic-constraint" | "fixed";
}