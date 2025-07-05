"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "inline-flex animate-gradient bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}