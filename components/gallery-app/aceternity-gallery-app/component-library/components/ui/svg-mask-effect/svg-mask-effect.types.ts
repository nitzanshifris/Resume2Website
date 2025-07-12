import { ReactNode } from "react";

export interface MaskContainerProps {
  /**
   * The content that is always visible on the page
   */
  children?: string | ReactNode;
  
  /**
   * The component/text that is revealed on hover
   */
  revealText?: string | ReactNode;
  
  /**
   * Initial size of the mask circle in pixels
   * @default 10
   */
  size?: number;
  
  /**
   * Size of the mask circle when hovered in pixels
   * @default 600
   */
  revealSize?: number;
  
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

export interface SVGMaskEffectDemoProps {
  /**
   * The variant of the demo to display
   */
  variant?: 'default' | 'minimal' | 'colorful' | 'large' | 'multiline';
}