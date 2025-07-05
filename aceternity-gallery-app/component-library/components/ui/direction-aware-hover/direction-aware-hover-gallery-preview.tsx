"use client";
import React from "react";
import { DirectionAwareHover } from "./direction-aware-hover-base";

export function DirectionAwareHoverGalleryPreview() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg">
      <DirectionAwareHover 
        imageUrl="https://images.unsplash.com/photo-1663765970236-f2acfde22237?w=300&h=200&fit=crop"
        className="w-48 h-32"
      >
        <p className="font-bold text-sm">Hover Effect</p>
        <p className="font-normal text-xs">Direction aware</p>
      </DirectionAwareHover>
    </div>
  );
}

export function DirectionAwareHoverGalleryCard() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg">
      <div className="grid grid-cols-2 gap-2 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-20 h-20 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
            <span className="text-white text-xs">Card {i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DirectionAwareHoverGalleryProduct() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900 rounded-lg">
      <DirectionAwareHover 
        imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop"
        className="w-40 h-28"
      >
        <p className="font-bold text-xs">Product</p>
        <p className="font-bold text-sm">$99</p>
      </DirectionAwareHover>
    </div>
  );
}