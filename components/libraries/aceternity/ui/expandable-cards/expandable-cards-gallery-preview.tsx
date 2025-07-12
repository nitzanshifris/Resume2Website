"use client";

import React from "react";

export function ExpandableCardsGalleryPreview() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
      <div className="max-w-xs w-full space-y-2 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-blue-500 rounded-md"></div>
            <div className="flex-1">
              <div className="h-3 bg-white/60 rounded w-3/4 mb-1"></div>
              <div className="h-2 bg-white/40 rounded w-1/2"></div>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExpandableCardsGalleryGrid() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg">
      <div className="grid grid-cols-2 gap-2 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-20 h-24 bg-white/20 rounded backdrop-blur-sm flex flex-col p-2">
            <div className="flex-1 bg-blue-400 rounded mb-2"></div>
            <div className="h-2 bg-white/60 rounded w-full mb-1"></div>
            <div className="h-1 bg-white/40 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExpandableCardsGalleryBento() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900 rounded-lg">
      <div className="grid grid-cols-3 grid-rows-2 gap-2 p-4 h-48 w-64">
        <div className="col-span-2 row-span-2 bg-white/20 rounded backdrop-blur-sm p-2">
          <div className="w-full h-16 bg-teal-400 rounded mb-2"></div>
          <div className="h-2 bg-white/60 rounded w-full mb-1"></div>
          <div className="h-1 bg-white/40 rounded w-2/3"></div>
        </div>
        <div className="bg-white/20 rounded backdrop-blur-sm p-2">
          <div className="w-full h-6 bg-green-400 rounded mb-2"></div>
          <div className="h-1 bg-white/60 rounded w-full"></div>
        </div>
        <div className="bg-white/20 rounded backdrop-blur-sm p-2">
          <div className="w-full h-6 bg-emerald-400 rounded mb-2"></div>
          <div className="h-1 bg-white/60 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}