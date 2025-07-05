"use client";
import React from "react";
import { Boxes } from "./background-boxes-base";

export function BackgroundBoxesMinimal() {
  return (
    <div className="h-64 relative w-full overflow-hidden bg-slate-900 rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
    </div>
  );
}