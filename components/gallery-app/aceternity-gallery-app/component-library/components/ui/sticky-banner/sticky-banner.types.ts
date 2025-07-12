export interface StickyBannerProps {
  /**
   * Optional CSS class to apply to the banner
   */
  className?: string;
  
  /**
   * Content to display inside the banner
   */
  children: React.ReactNode;
  
  /**
   * When true, hides the banner after scrolling down 40px
   * @default false
   */
  hideOnScroll?: boolean;
}

export interface StickyBannerDemoProps {
  /**
   * The variant of the sticky banner demo to display
   */
  variant?: 'default' | 'hide-on-scroll' | 'dark' | 'success' | 'warning';
}