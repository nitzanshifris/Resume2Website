"use client";

import { cn } from "@/lib/utils";
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

// Enhanced types with more control options
export interface EnhancedCardContainerProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  maxRotationX?: number;
  maxRotationY?: number;
  rotationIntensity?: number;
  enableRotation?: boolean;
  perspective?: number;
  transitionDuration?: number;
  rotationMethod?: "normalized" | "dynamic-constraint" | "fixed";
}

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const EnhancedCardContainer = ({
  children,
  className,
  containerClassName,
  maxRotationX = 15,
  maxRotationY = 15,
  rotationIntensity = 1,
  enableRotation = true,
  perspective = 1000,
  transitionDuration = 200,
  rotationMethod = "normalized",
}: EnhancedCardContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !enableRotation) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (rotationMethod) {
      case "normalized": {
        // Best for consistent behavior across all sizes
        const normalizedX = (e.clientX - left) / width - 0.5;
        const normalizedY = (e.clientY - top) / height - 0.5;
        x = normalizedX * 2 * maxRotationY * rotationIntensity;
        y = -normalizedY * 2 * maxRotationX * rotationIntensity;
        break;
      }
      
      case "dynamic-constraint": {
        // Scales constraint with container size
        const constraintX = Math.max(width / 20, 30);
        const constraintY = Math.max(height / 20, 30);
        const rawX = (e.clientX - left - width / 2) / constraintX;
        const rawY = (e.clientY - top - height / 2) / constraintY;
        
        // Apply limits
        x = Math.max(-maxRotationY, Math.min(maxRotationY, rawX)) * rotationIntensity;
        y = Math.max(-maxRotationX, Math.min(maxRotationX, rawY)) * rotationIntensity;
        break;
      }
      
      case "fixed": {
        // Original method with hard limits
        const rawX = (e.clientX - left - width / 2) / 25;
        const rawY = (e.clientY - top - height / 2) / 25;
        
        x = Math.max(-maxRotationY, Math.min(maxRotationY, rawX)) * rotationIntensity;
        y = Math.max(-maxRotationX, Math.min(maxRotationX, rawY)) * rotationIntensity;
        break;
      }
    }

    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn(
          "flex items-center justify-center w-full h-full",
          containerClassName
        )}
        style={{
          perspective: `${perspective}px`,
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative w-full h-full",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
            transition: `transform ${transitionDuration}ms ease-out`,
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

// Re-export existing components for compatibility
export { CardBody, CardItem } from "./3d-card-base";

// Hook for responsive rotation settings
export const useResponsive3DSettings = () => {
  const [settings, setSettings] = useState({
    maxRotationX: 15,
    maxRotationY: 15,
    rotationIntensity: 1,
    perspective: 1000,
  });

  useEffect(() => {
    const updateSettings = () => {
      const vw = window.innerWidth;
      
      if (vw < 640) {
        // Mobile
        setSettings({
          maxRotationX: 10,
          maxRotationY: 10,
          rotationIntensity: 0.8,
          perspective: 800,
        });
      } else if (vw < 1024) {
        // Tablet
        setSettings({
          maxRotationX: 12,
          maxRotationY: 12,
          rotationIntensity: 0.9,
          perspective: 900,
        });
      } else {
        // Desktop
        setSettings({
          maxRotationX: 15,
          maxRotationY: 15,
          rotationIntensity: 1,
          perspective: 1000,
        });
      }
    };

    updateSettings();
    window.addEventListener("resize", updateSettings);
    return () => window.removeEventListener("resize", updateSettings);
  }, []);

  return settings;
};

// Example usage component
export const ResponsiveCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const settings = useResponsive3DSettings();
  
  return (
    <EnhancedCardContainer
      {...settings}
      rotationMethod="normalized"
      className={className}
    >
      {children}
    </EnhancedCardContainer>
  );
};

// Fullscreen-safe card component
export const FullscreenSafeCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <EnhancedCardContainer
      maxRotationX={10}
      maxRotationY={10}
      rotationIntensity={0.7}
      rotationMethod="normalized"
      perspective={1200}
      className={className}
    >
      {children}
    </EnhancedCardContainer>
  );
};