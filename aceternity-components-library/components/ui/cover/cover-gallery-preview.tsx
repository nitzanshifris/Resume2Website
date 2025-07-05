"use client";
import React from "react";
import { Cover } from "./cover-base";

export function CoverGalleryPreview() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg">
      <div className="text-center">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
          Build at <Cover>warp speed</Cover>
        </h3>
        <div className="text-sm text-neutral-400">
          Hover to reveal the magic
        </div>
      </div>
    </div>
  );
}

export function CoverGalleryWordEffect() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg">
      <div className="text-center space-y-2">
        <div className="text-md text-white">
          Experience <Cover>innovation</Cover>
        </div>
        <div className="text-md text-white">
          Create with <Cover>precision</Cover>
        </div>
      </div>
    </div>
  );
}

export function CoverGalleryInteractive() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white">
          Deploy at <Cover>scale</Cover>
        </h3>
        <div className="text-sm text-neutral-400 mt-2">
          Interactive text effects
        </div>
      </div>
    </div>
  );
}