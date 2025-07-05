import { ReactNode } from "react";
import { MotionValue } from "motion/react";

export interface FollowerPointerCardProps {
  children: ReactNode;
  className?: string;
  title?: string | ReactNode;
}

export interface FollowPointerProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  title?: string | ReactNode;
}