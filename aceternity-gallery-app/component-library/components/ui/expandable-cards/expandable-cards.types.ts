import { ReactElement } from 'react';

export interface CardData {
  description: string;
  title: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  content: () => ReactElement | string;
}

export interface ExpandableCardsProps {
  cards?: CardData[];
  className?: string;
}

export interface CloseIconProps {
  className?: string;
}