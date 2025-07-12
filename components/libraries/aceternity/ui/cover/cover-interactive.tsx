"use client";
import React from "react";
import { Cover } from "./cover-base";

export function CoverInteractive() {
  return (
    <div className="w-full h-[60vh] px-1 md:px-8 flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl lg:text-4xl font-semibold max-w-4xl mx-auto text-white mb-8">
          Hover over these words to see the magic:
        </h2>
        <div className="space-y-4 text-lg md:text-xl text-neutral-300">
          <div>Create <Cover>amazing</Cover> user experiences</div>
          <div>Build with <Cover>speed</Cover> and precision</div>
          <div>Deploy at <Cover>scale</Cover> effortlessly</div>
        </div>
      </div>
    </div>
  );
}