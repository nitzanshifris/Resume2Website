"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-blue-600 text-white hover:bg-blue-700": variant === "default",
            "border border-zinc-700 bg-transparent text-white hover:bg-zinc-800": variant === "outline",
            "text-white hover:bg-zinc-800": variant === "ghost",
          },
          {
            "h-10 py-2 px-4": size === "default",
            "h-9 px-3 text-xs": size === "sm",
            "h-11 px-8": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };