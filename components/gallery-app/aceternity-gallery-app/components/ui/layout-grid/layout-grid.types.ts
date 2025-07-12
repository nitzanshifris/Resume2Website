import React from "react";

export type Card = {
  id: number;
  content: React.ReactElement | React.ReactNode | string;
  className: string;
  thumbnail: string;
};

export interface LayoutGridProps {
  cards: Card[];
  className?: string;
  containerClassName?: string;
}

export interface LayoutGridDemoProps {
  className?: string;
  containerClassName?: string;
}

export interface LayoutGridGalleryPreviewProps {
  className?: string;
  containerClassName?: string;
}