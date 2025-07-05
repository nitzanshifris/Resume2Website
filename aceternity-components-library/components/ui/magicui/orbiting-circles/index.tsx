// @ts-nocheck
"use client";
import * as React from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbitingCirclesProps {
  className?: string;
  children: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
}: OrbitingCirclesProps) {
  const count = React.Children.count(children);
  const [angle, setAngle] = React.useState(0);
  useAnimationFrame((t) => {
    setAngle((prev) => prev + (reverse ? -speed : speed) * (360 / (duration * 60)));
  });
  return (
    <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center", className)} style={{ width: radius * 2, height: radius * 2 }}>
      {path && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gray-300 dark:border-gray-700"
          style={{ width: radius * 2, height: radius * 2 }}
        />
      )}
      {React.Children.map(children, (child, i) => {
        const theta = ((360 / count) * i + angle + delay) * (Math.PI / 180);
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
        return (
          <motion.div
            key={i}
            className="absolute flex items-center justify-center"
            style={{
              left: `calc(50% + ${x}px - ${iconSize / 2}px)` ,
              top: `calc(50% + ${y}px - ${iconSize / 2}px)` ,
              width: iconSize,
              height: iconSize,
            }}
          >
            {React.isValidElement(child) ? React.cloneElement(child, { className: cn(child.props.className, "w-full h-full") }) : child}
          </motion.div>
        );
      })}
    </div>
  );
}

export default OrbitingCircles; 