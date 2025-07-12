"use client";

import React from "react";

export function FeatureSectionsGalleryPreview() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
      <div className="max-w-lg w-full p-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/20 transition-colors">
              <div className="w-6 h-6 bg-blue-500 rounded mb-2"></div>
              <div className="h-3 bg-white/60 rounded w-full mb-2"></div>
              <div className="h-2 bg-white/40 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeatureSectionsGalleryBento() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg">
      <div className="grid grid-cols-6 grid-rows-2 gap-2 p-4 h-48 w-80">
        <div className="col-span-4 row-span-1 bg-white/20 rounded backdrop-blur-sm p-2">
          <div className="h-3 bg-purple-400 rounded w-full mb-2"></div>
          <div className="h-2 bg-white/60 rounded w-2/3"></div>
        </div>
        <div className="col-span-2 row-span-2 bg-white/20 rounded backdrop-blur-sm p-2">
          <div className="w-full h-12 bg-blue-400 rounded mb-2"></div>
          <div className="h-1 bg-white/60 rounded w-full"></div>
        </div>
        <div className="col-span-3 bg-white/20 rounded backdrop-blur-sm p-2">
          <div className="w-8 h-8 bg-green-400 rounded mb-1"></div>
          <div className="h-1 bg-white/60 rounded w-full"></div>
        </div>
        <div className="col-span-1 bg-white/20 rounded backdrop-blur-sm"></div>
      </div>
    </div>
  );
}

export function FeatureSectionsGalleryHover() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900 rounded-lg">
      <div className="grid grid-cols-2 gap-4 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/20 rounded backdrop-blur-sm p-3 hover:bg-white/30 transition-colors group">
            <div className="w-5 h-5 bg-teal-400 rounded mb-2 group-hover:scale-110 transition-transform"></div>
            <div className="h-2 bg-white/60 rounded w-full mb-1"></div>
            <div className="h-1 bg-white/40 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}