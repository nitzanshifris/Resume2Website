"use client";
import React from "react";
import { ContainerTextFlip } from "./container-text-flip-base";

export function ContainerTextFlipGalleryPreview() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-4">
          Make it
        </h3>
        <ContainerTextFlip 
          words={["amazing", "beautiful", "modern", "awesome"]}
          className="!text-2xl md:!text-3xl"
          interval={2000}
        />
      </div>
    </div>
  );
}

export function ContainerTextFlipGalleryHero() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-6">
      <div className="text-left">
        <div className="text-sm text-gray-300 mb-2">Build something</div>
        <ContainerTextFlip 
          words={["incredible", "unique", "powerful", "innovative"]}
          className="!text-xl md:!text-2xl"
          interval={1800}
        />
      </div>
    </div>
  );
}

export function ContainerTextFlipGalleryCustom() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900 rounded-lg">
      <div className="text-center space-y-2">
        <div className="text-sm text-gray-300">Technology:</div>
        <ContainerTextFlip 
          words={["React", "Next.js", "TypeScript", "Tailwind"]}
          className="!text-lg md:!text-xl"
          interval={1500}
          animationDuration={400}
        />
      </div>
    </div>
  );
}