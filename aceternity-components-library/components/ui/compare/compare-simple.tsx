"use client";
import React, { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
}

export const CompareSimple = ({
  firstImage = "https://picsum.photos/500/400?random=1",
  secondImage = "https://picsum.photos/500/400?random=2",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = (x / rect.width) * 100;
        setSliderXPercent(Math.max(0, Math.min(100, percent)));
      }
    },
    [slideMode, isDragging]
  );

  const handleMouseDown = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(true);
    }
  }, [slideMode]);

  const handleMouseUp = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMouseLeave = useCallback(() => {
    if (slideMode === "hover") {
      setSliderXPercent(initialSliderPercentage);
    }
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode, initialSliderPercentage]);

  return (
    <div
      ref={sliderRef}
      className={cn("w-[400px] h-[400px] overflow-hidden relative", className)}
      style={{
        cursor: slideMode === "drag" ? "grab" : "col-resize",
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slider Line */}
      <motion.div
        className="h-full w-px absolute top-0 bg-white z-30"
        style={{
          left: `${sliderXPercent}%`,
        }}
        transition={{ duration: 0 }}
      >
        {showHandlebar && (
          <div className="h-8 w-8 rounded-full top-1/2 -translate-y-1/2 bg-white z-30 -left-4 absolute flex items-center justify-center shadow-lg border-2 border-gray-300">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        )}
      </motion.div>

      {/* First Image (clipped) */}
      <div className="overflow-hidden w-full h-full relative z-20">
        {firstImage && (
          <motion.div
            className={cn(
              "absolute inset-0 z-20 shrink-0 w-full h-full select-none overflow-hidden",
              firstImageClassName
            )}
            style={{
              clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
            }}
            transition={{ duration: 0 }}
          >
            <img
              alt="first image"
              src={firstImage}
              className={cn(
                "absolute inset-0 z-20 shrink-0 w-full h-full select-none object-cover",
                firstImageClassName
              )}
              draggable={false}
            />
          </motion.div>
        )}
      </div>

      {/* Second Image (background) */}
      {secondImage && (
        <img
          className={cn(
            "absolute top-0 left-0 z-10 w-full h-full select-none object-cover",
            secondImageClassname
          )}
          alt="second image"
          src={secondImage}
          draggable={false}
        />
      )}
    </div>
  );
};