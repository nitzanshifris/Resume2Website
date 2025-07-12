"use client";
import React from "react";
import { BackgroundLines } from "./background-lines-base";

export function BackgroundLinesMinimal() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full h-64" svgOptions={{ duration: 15 }}>
      <div className="relative z-20 text-center">
        <h3 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-xl md:text-2xl font-semibold">
          Minimal Background Lines
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-sm">
          Perfect for subtle section backgrounds
        </p>
      </div>
    </BackgroundLines>
  );
}