"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      {children}
    </div>
  );
}

export function DialogContent({ className, children }: DialogContentProps) {
  return (
    <div className={cn(
      "relative z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg",
      "w-full max-w-lg mx-4 p-6",
      className
    )}>
      {children}
    </div>
  );
}

export function DialogHeader({ className, children }: DialogHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ className, children }: DialogTitleProps) {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)}>
      {children}
    </h3>
  );
}