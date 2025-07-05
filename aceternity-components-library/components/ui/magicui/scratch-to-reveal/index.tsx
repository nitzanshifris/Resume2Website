"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

interface ScratchToRevealProps {
  width: number;
  height: number;
  minScratchPercentage?: number;
  onComplete?: () => void;
  className?: string;
  gradientColors?: [string, string, string];
  children: React.ReactNode;
}

const ScratchToReveal: React.FC<ScratchToRevealProps> = ({
  width,
  height,
  minScratchPercentage = 50,
  onComplete,
  className,
  gradientColors = ["#e5e5e5", "#94a3b8", "#e5e5e5"],
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(0.5, gradientColors[1]);
    gradient.addColorStop(1, gradientColors[2]);

    // Fill canvas with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Set up scratching
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [width, height, gradientColors]);

  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = x - rect.left;
    const offsetY = y - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    if (lastPosition) {
      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, 15, 0, Math.PI * 2);
      ctx.fill();
    }
    
    setLastPosition({ x: offsetX, y: offsetY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
    checkCompletion();
  };

  const handleMouseUp = () => {
    setIsScratching(false);
    setLastPosition(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScratching) return;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
    checkCompletion();
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
    setLastPosition(null);
  };

  const checkCompletion = () => {
    const canvas = canvasRef.current;
    if (!canvas || isComplete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    const totalPixels = width * height;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / totalPixels) * 100;

    if (percentage >= minScratchPercentage) {
      setIsComplete(true);
      onComplete?.();
    }
  };

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width, height }}
    >
      {/* Hidden content underneath */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        {children}
      </div>
      
      {/* Scratchable overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: isComplete ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 cursor-pointer rounded-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </motion.div>
    </div>
  );
};

export { ScratchToReveal };