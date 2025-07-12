"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedList({
  children,
  className,
  delay = 1000,
}: AnimatedListProps) {
  const childrenArray = React.Children.toArray(children);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {childrenArray.map((child, idx) => (
        <div
          key={idx}
          style={{
            animation: `fadeInUp 0.5s ease ${(idx * delay) / 1000}s both`,
          }}
        >
          {child}
        </div>
      ))}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
} 