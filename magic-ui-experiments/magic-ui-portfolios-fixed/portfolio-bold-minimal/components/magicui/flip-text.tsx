"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function FlipText({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-block animate-flip-in",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}