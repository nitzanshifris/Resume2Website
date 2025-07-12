"use client";
import React from "react";
import { Compare } from "./compare-base";

export function CompareDrag() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center px-1 [perspective:800px] [transform-style:preserve-3d] md:px-8">
      <div
        style={{
          transform: "rotateX(15deg) translateZ(80px)",
        }}
        className="mx-auto h-1/2 w-3/4 rounded-3xl border border-neutral-200 bg-neutral-100 p-1 md:h-3/4 md:p-4 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <Compare
          firstImage="https://picsum.photos/600/400?random=60"
          secondImage="https://picsum.photos/600/400?random=61"
          firstImageClassName="object-cover"
          secondImageClassname="object-cover"
          className="h-full w-full rounded-[22px] md:rounded-lg"
          slideMode="drag"
          showHandlebar={true}
        />
      </div>
    </div>
  );
}