"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CompareProps {
  firstImage: string;
  secondImage: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  className?: string;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
}

export const Compare = ({
  firstImage,
  secondImage,
  firstImageClassName,
  secondImageClassname,
  className,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
}: CompareProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        handleMove(e.clientX);
      }
    },
    [slideMode, isDragging, handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        handleMove(e.touches[0].clientX);
      }
    },
    [slideMode, isDragging, handleMove]
  );

  const handleMouseDown = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(true);
    }
  }, [slideMode]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(true);
    }
  }, [slideMode]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (slideMode === "hover") {
      container.addEventListener("mousemove", handleMouseMove);
    } else if (slideMode === "drag") {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("touchmove", handleTouchMove);
      container.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    slideMode,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleTouchMove,
    handleTouchStart,
    handleTouchEnd,
  ]);

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        setSliderPosition((prev) => (prev === 50 ? 10 : 50));
      }, autoplayDuration);
      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDuration]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ cursor: slideMode === "drag" ? "ew-resize" : "default" }}
    >
      {/* Second Image (revealed) */}
      <img
        src={secondImage}
        alt="Second"
        className={cn("absolute inset-0 w-full h-full", secondImageClassname)}
      />

      {/* First Image (covering) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={firstImage}
          alt="First"
          className={cn("absolute inset-0 w-full h-full", firstImageClassName)}
        />
      </div>

      {/* Slider Handle */}
      {showHandlebar && (
        <div
          ref={sliderRef}
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{
            left: `${sliderPosition}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-700"
            >
              <path
                d="M8 12H16M8 12L12 8M8 12L12 16M16 12L12 8M16 12L12 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Labels */}
      {slideMode === "hover" && (
        <>
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm font-medium backdrop-blur-sm">
            Before
          </div>
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm font-medium backdrop-blur-sm">
            After
          </div>
        </>
      )}
    </div>
  );
};