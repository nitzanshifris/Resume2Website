import { ReactNode } from "react";

export interface BackgroundBeamsWithCollisionProps {
  children: ReactNode;
  className?: string;
}

export interface BeamOptions {
  initialX?: number;
  translateX?: number;
  initialY?: number | string;
  translateY?: number | string;
  rotate?: number;
  className?: string;
  duration?: number;
  delay?: number;
  repeatDelay?: number;
}

export interface CollisionMechanismProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  beamOptions?: BeamOptions;
}

export interface CollisionState {
  detected: boolean;
  coordinates: { x: number; y: number } | null;
}

export interface ExplosionProps extends React.HTMLProps<HTMLDivElement> {
  // Inherits all div props
}