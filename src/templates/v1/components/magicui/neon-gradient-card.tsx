"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function NeonGradientCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg p-0.5",
        "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500",
        "animate-gradient-x",
        className
      )}
      {...props}
    >
      <div className="relative h-full w-full rounded-lg bg-gray-900 p-6">
        {children}
      </div>
    </div>
  );
}