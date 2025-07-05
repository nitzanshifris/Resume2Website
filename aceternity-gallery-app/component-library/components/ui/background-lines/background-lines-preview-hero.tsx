"use client";
import React from "react";
import { BackgroundLines } from "./background-lines-base";

export function BackgroundLinesPreviewHero() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 h-80" svgOptions={{ duration: 8 }}>
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-xl md:text-3xl font-sans py-2 relative z-20 font-bold tracking-tight">
        Amazing Portfolio, <br /> Creative Solutions.
      </h2>
      <p className="max-w-md mx-auto text-xs md:text-sm text-neutral-700 dark:text-neutral-400 text-center mt-2">
        Get the best solutions from our experts, including designers, developers, and creative professionals.
      </p>
    </BackgroundLines>
  );
}