"use client";

import React from "react";
import { AuroraBackground } from "./aurora-background-base";

export function AuroraBackgroundMinimal() {
  return (
    <AuroraBackground className="min-h-[400px] h-[400px]">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold dark:text-white">
          Aurora
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Minimal implementation with radial gradient
        </p>
      </div>
    </AuroraBackground>
  );
}