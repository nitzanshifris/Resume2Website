export interface SpotlightProps {
  /**
   * First gradient color for the spotlight effect
   * @default "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)"
   */
  gradientFirst?: string;
  
  /**
   * Second gradient color for the spotlight effect
   * @default "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)"
   */
  gradientSecond?: string;
  
  /**
   * Third gradient color for the spotlight effect
   * @default "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)"
   */
  gradientThird?: string;
  
  /**
   * Vertical translation offset in pixels
   * @default -350
   */
  translateY?: number;
  
  /**
   * Width of the main spotlight element in pixels
   * @default 560
   */
  width?: number;
  
  /**
   * Height of the spotlight elements in pixels
   * @default 1380
   */
  height?: number;
  
  /**
   * Width of the smaller spotlight elements in pixels
   * @default 240
   */
  smallWidth?: number;
  
  /**
   * Animation duration in seconds
   * @default 7
   */
  duration?: number;
  
  /**
   * Horizontal animation offset in pixels
   * @default 100
   */
  xOffset?: number;
}

export interface SpotlightDemoProps {
  /**
   * The variant of the spotlight demo to display
   */
  variant?: 'default' | 'custom-colors' | 'fast' | 'subtle' | 'large';
}