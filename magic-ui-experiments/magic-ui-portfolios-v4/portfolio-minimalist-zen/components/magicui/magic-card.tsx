"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function MagicCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-8",
        "bg-gradient-to-br from-gray-50 to-gray-100",
        "hover:shadow-2xl transition-all duration-300",
        "hover:scale-105",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}