"use client";
import React from "react";
import { Compare } from "./compare-base";

export function CompareGalleryPreview() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg">
      <div className="p-4 border rounded-2xl dark:bg-neutral-900/50 bg-neutral-100/50 border-neutral-200/50 dark:border-neutral-800/50">
        <Compare
          firstImage="https://picsum.photos/300/200?random=10"
          secondImage="https://picsum.photos/300/200?random=11"
          firstImageClassName="object-cover"
          secondImageClassname="object-cover"
          className="h-[180px] w-[240px] rounded-xl"
          slideMode="hover"
          showHandlebar={true}
        />
      </div>
    </div>
  );
}

export function CompareGalleryAutoplay() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg [perspective:600px]">
      <div
        style={{
          transform: "rotateX(10deg) translateZ(40px)",
        }}
        className="p-2 border rounded-2xl dark:bg-neutral-900/50 bg-neutral-100/50 border-neutral-200/50 dark:border-neutral-800/50"
      >
        <Compare
          firstImage="https://picsum.photos/300/200?random=20"
          secondImage="https://picsum.photos/300/200?random=21"
          firstImageClassName="object-cover"
          secondImageClassname="object-cover"
          className="h-[160px] w-[220px] rounded-xl"
          slideMode="hover"
          showHandlebar={true}
          autoplay={true}
        />
      </div>
    </div>
  );
}

export function CompareGalleryDrag() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-lg">
      <div className="p-4 border rounded-2xl dark:bg-neutral-900/50 bg-neutral-100/50 border-neutral-200/50 dark:border-neutral-800/50">
        <Compare
          firstImage="https://picsum.photos/300/200?random=30"
          secondImage="https://picsum.photos/300/200?random=31"
          firstImageClassName="object-cover"
          secondImageClassname="object-cover"
          className="h-[180px] w-[240px] rounded-xl"
          slideMode="drag"
          showHandlebar={true}
        />
      </div>
    </div>
  );
}