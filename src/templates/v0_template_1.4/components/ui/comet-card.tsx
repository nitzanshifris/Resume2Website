"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface CometCardProps {
  children: React.ReactNode;
  className?: string;
  rotateDepth?: number;
  translateDepth?: number;
}

export function CometCard({
  children,
  className,
  rotateDepth = 17.5,
  translateDepth = 20,
}: CometCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Normalized values (-1 to 1)
    const normalizedX = (x - centerX) / centerX;
    const normalizedY = (y - centerY) / centerY;
    
    // Apply rotation with controlled depth
    const rotateX = -normalizedY * rotateDepth;
    const rotateY = normalizedX * rotateDepth;
    
    // Apply translation
    const translateX = normalizedX * translateDepth;
    const translateY = normalizedY * translateDepth;
    
    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateX(${translateX}px)
      translateY(${translateY}px)
    `;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateX(0px)
      translateY(0px)
    `;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "transition-transform duration-200 ease-out",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}