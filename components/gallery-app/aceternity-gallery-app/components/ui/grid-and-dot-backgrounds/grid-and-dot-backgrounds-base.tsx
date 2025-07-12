"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { GridAndDotBackgroundsBaseProps } from "./grid-and-dot-backgrounds.types";

export function GridAndDotBackgrounds({ 
  children,
  variant = "grid",
  size = "default",
  className 
}: GridAndDotBackgroundsBaseProps) {
  const backgroundStyle = useMemo(() => {
    const gridSize = size === "small" ? "20px" : "40px";
    
    switch (variant) {
      case "gridSmall":
        return {
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        };
      case "dot":
        return {
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: `${gridSize} ${gridSize}`,
        };
      case "grid":
      default:
        return {
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: `${gridSize} ${gridSize}`,
        };
    }
  }, [variant, size]);

  return (
    <div 
      className={cn("relative w-full h-full", className)}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
}

export default GridAndDotBackgrounds;