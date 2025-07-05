import { ReactNode } from "react";

export interface Card {
  src: string;
  title: string;
  category: string;
  content: ReactNode;
}

export interface CarouselProps {
  items?: ReactNode[];
  initialScroll?: number;
}

export interface CardProps {
  card: Card;
  index: number;
  layout?: boolean;
  modalPositioning?: "fixed" | "absolute";
}

export interface CarouselContextType {
  onCardClose: (index: number) => void;
  currentIndex: number;
}

export interface BlurImageProps {
  height?: number | string;
  width?: number | string;
  src: string;
  className?: string;
  alt?: string;
  fill?: boolean;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  blurDataURL?: string;
  onLoad?: () => void;
}