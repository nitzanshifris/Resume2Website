import React from "react";

export type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
} & (
  | { isStatic: true; imageSrc: string }
  | { isStatic?: false; imageSrc?: never }
);

export interface LinkPreviewDemoProps {
  className?: string;
  containerClassName?: string;
}

export interface LinkPreviewGalleryPreviewProps {
  className?: string;
  containerClassName?: string;
}

export interface LinkPreviewWithImageProps {
  className?: string;
  containerClassName?: string;
}