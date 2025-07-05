import React from "react";

export interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  position?: {
    x: number;
    y: number;
  };
  isStatic?: boolean;
  isFocusing?: () => void;
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
}

export interface LensDemoProps {
  className?: string;
  containerClassName?: string;
}

export interface LensGalleryPreviewProps {
  className?: string;
  containerClassName?: string;
}

export interface LensStaticProps {
  className?: string;
  containerClassName?: string;
  position?: {
    x: number;
    y: number;
  };
  zoomFactor?: number;
  lensSize?: number;
}