import { ReactNode } from "react";

export interface StickyScrollContent {
  /**
   * The title of the content section
   */
  title: string;
  
  /**
   * The description text for the section
   */
  description: string;
  
  /**
   * The visual content to display in the sticky container
   */
  content?: ReactNode;
}

export interface StickyScrollProps {
  /**
   * Array of content objects that renders the sections
   */
  content: StickyScrollContent[];
  
  /**
   * Optional className for the sticky content container
   */
  contentClassName?: string;
}

export interface StickyScrollDemoProps {
  /**
   * The variant of the demo to display
   */
  variant?: 'default' | 'portfolio' | 'product' | 'custom-styling';
}