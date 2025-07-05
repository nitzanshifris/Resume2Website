"use client";
import React from "react";
import { ContainerScroll } from "./container-scroll-animation-base";

export function ContainerScrollGalleryPreview() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
      <div className="text-center px-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          3D Scroll Animation
        </h3>
        <div className="text-sm text-neutral-400">
          Rotates content in 3D on scroll
        </div>
        <div className="mt-4 w-32 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-12 scale-75"></div>
      </div>
    </div>
  );
}

export function ContainerScrollGalleryProduct() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg overflow-hidden">
      <div className="text-center px-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Product Showcase
        </h3>
        <div className="text-sm text-neutral-300 mb-4">
          Perfect for product presentations
        </div>
        <div className="w-40 h-24 mx-auto bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
          <div className="text-2xl">📦</div>
        </div>
      </div>
    </div>
  );
}

export function ContainerScrollGalleryFeatures() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-900 to-green-900 rounded-lg overflow-hidden">
      <div className="text-center px-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Feature Grid
        </h3>
        <div className="text-sm text-neutral-300 mb-4">
          Showcase features with style
        </div>
        <div className="grid grid-cols-3 gap-2 w-32 mx-auto">
          <div className="w-8 h-8 bg-blue-500 rounded"></div>
          <div className="w-8 h-8 bg-green-500 rounded"></div>
          <div className="w-8 h-8 bg-purple-500 rounded"></div>
        </div>
      </div>
    </div>
  );
}