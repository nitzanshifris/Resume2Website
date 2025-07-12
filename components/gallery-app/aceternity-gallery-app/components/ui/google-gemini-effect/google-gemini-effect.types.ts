import { MotionValue } from "framer-motion";
import { ReactElement } from "react";

export interface GoogleGeminiEffectProps {
  pathLengths: MotionValue[];
  title?: string;
  description?: string;
  className?: string;
}

export interface GoogleGeminiEffectDemoProps {
  className?: string;
}