"use client";

import { AnimatePresence, motion, useMotionTemplate } from "motion/react";
import React, { useCallback, useMemo, useRef, useState } from "react";

interface Position {
  /** The x coordinate of the lens */
  x: number;
  /** The y coordinate of the lens */
  y: number;
}

interface LensProps {
  /** The children of the lens */
  children: React.ReactNode;
  /** The zoom factor of the lens */
  zoomFactor?: number;
  /** The size of the lens */
  lensSize?: number;
  /** The position of the lens */
  position?: Position;
  /** The default position of the lens */
  defaultPosition?: Position;
  /** Whether the lens is static */
  isStatic?: boolean;
  /** The duration of the animation */
  duration?: number;
  /** The color of the lens */
  lensColor?: string;
  /** The aria label of the lens */
  ariaLabel?: string;
}

export function Lens({
  children,
  zoomFactor = 1.3,
  lensSize = 170,
  isStatic = false,
  position = { x: 0, y: 0 },
  defaultPosition,
  duration = 0.1,
  lensColor = "black",
  ariaLabel = "Zoom Area",
}: LensProps) {
  if (zoomFactor < 1) {
    throw new Error("zoomFactor must be greater than 1");
  }
  if (lensSize < 0) {
    throw new Error("lensSize must be greater than 0");
  }

  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState<Position>(position);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPosition = useMemo(() => {
    if (isStatic) return position;
    if (defaultPosition && !isHovering) return defaultPosition;
    return mousePosition;
  }, [isStatic, position, defaultPosition, isHovering, mousePosition]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    },
    []
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsHovering(false);
    }
  }, []);

  const maskImage = useMotionTemplate`radial-gradient(circle ${
    lensSize / 2
  }px at ${currentPosition.x}px ${
    currentPosition.y
  }px, ${lensColor} 100%, transparent 100%)`;

  const shouldShowLens = isStatic || defaultPosition || isHovering;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isStatic && setIsHovering(true)}
      onMouseLeave={() => !isStatic && setIsHovering(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="img"
      aria-label={ariaLabel}
    >
      {children}
      <AnimatePresence>
        {shouldShowLens && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              maskImage,
              WebkitMaskImage: maskImage,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${currentPosition.x}px ${currentPosition.y}px`,
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}