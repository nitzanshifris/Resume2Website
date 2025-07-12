import { ReactElement } from "react";

export interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

export interface GridItemProps {
  area: string;
  icon: ReactElement;
  title: string;
  description: ReactElement | string;
}