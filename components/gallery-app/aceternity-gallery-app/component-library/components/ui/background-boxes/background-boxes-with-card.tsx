"use client";
import React from "react";
import { Boxes } from "./background-boxes-base";
import { cn } from "@/lib/utils";

export function BackgroundBoxesWithCard() {
  return (
    <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      
      <Boxes />
      
      <div className="relative z-20 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Premium Features</h2>
        <ul className="space-y-3 text-neutral-300">
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Interactive hover effects
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Smooth animations
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Customizable colors
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Performance optimized
          </li>
        </ul>
      </div>
    </div>
  );
}