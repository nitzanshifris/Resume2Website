"use client";
import React from "react";
import { Compare } from "./compare-base";

export function CompareAutoplay() {
  return (
    <div className="w-full h-[60vh] px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
      <div
        style={{
          transform: "rotateX(15deg) translateZ(80px)",
        }}
        className="p-1 md:p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100  border-neutral-200 dark:border-neutral-800 mx-auto w-3/4 h-1/2 md:h-3/4"
      >
        <Compare
          firstImage="https://picsum.photos/600/400?random=50"
          secondImage="https://picsum.photos/600/400?random=51"
          firstImageClassName="object-cover"
          secondImageClassname="object-cover"
          className="w-full h-full rounded-[22px] md:rounded-lg"
          slideMode="hover"
          showHandlebar={true}
          autoplay={true}
        />
      </div>
    </div>
  );
}