"use client";
import React from "react";
import { Boxes } from "./background-boxes-base";
import { cn } from "../../lib/utils";

export function BackgroundBoxesFullscreen() {
  return (
    <div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      
      <Boxes />
      <h1 className={cn("md:text-6xl text-3xl text-white relative z-20 font-bold")}>
        Immersive Experience
      </h1>
      <p className="text-center mt-4 text-neutral-300 relative z-20 text-lg max-w-2xl">
        Create stunning visual effects with animated background boxes that respond to user interaction
      </p>
      <button className="mt-8 px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 relative z-20">
        Get Started
      </button>
    </div>
  );
}