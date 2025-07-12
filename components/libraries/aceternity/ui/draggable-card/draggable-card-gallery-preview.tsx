"use client";
import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "./draggable-card-base";

export function DraggableCardGalleryPreview() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
      <DraggableCardContainer className="relative flex items-center justify-center">
        <DraggableCardBody className="scale-50">
          <img
            src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=150&fit=crop"
            alt="Preview"
            className="pointer-events-none relative z-10 h-32 w-32 object-cover"
          />
          <p className="mt-2 text-center text-sm font-bold text-neutral-700 dark:text-neutral-300">
            Draggable
          </p>
        </DraggableCardBody>
      </DraggableCardContainer>
    </div>
  );
}

export function DraggableCardGalleryGrid() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg">
      <div className="grid grid-cols-3 gap-2 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-16 h-20 bg-white/20 rounded backdrop-blur-sm flex items-center justify-center">
            <span className="text-white text-xs">Card {i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DraggableCardGallerySingle() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900 rounded-lg">
      <div className="w-32 h-40 bg-white/20 rounded backdrop-blur-sm flex items-center justify-center">
        <span className="text-white text-sm">Single Card</span>
      </div>
    </div>
  );
}