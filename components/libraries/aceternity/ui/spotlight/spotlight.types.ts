export interface SpotlightProps {
  /**
   * Additional CSS classes to apply to the spotlight SVG
   */
  className?: string;
  
  /**
   * The fill color for the spotlight effect
   * @default "white"
   */
  fill?: string;
}

export interface SpotlightDemoProps {
  /**
   * The variant of the spotlight demo to display
   */
  variant?: 'default' | 'primary' | 'custom-position' | 'multiple' | 'subtle';
}