"use client";
import React from "react";
import { GridAndDotBackgrounds } from "./grid-and-dot-backgrounds-base";
import { GridAndDotBackgroundsDemoProps } from "./grid-and-dot-backgrounds.types";

export function GridAndDotBackgroundsDemo({ className }: GridAndDotBackgroundsDemoProps = {}) {
  return (
    <div className="h-[50rem] w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Backgrounds
      </p>
    </div>
  );
}

export function GridAndDotBackgroundsPreview({ className }: GridAndDotBackgroundsDemoProps = {}) {
  return (
    <GridAndDotBackgrounds variant="grid" className="h-96 w-full bg-black relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-2xl md:text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Grid Background
      </p>
    </GridAndDotBackgrounds>
  );
}

export function GridAndDotBackgroundsSmall({ className }: GridAndDotBackgroundsDemoProps = {}) {
  return (
    <GridAndDotBackgrounds variant="gridSmall" className="h-96 w-full bg-black relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-2xl md:text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Small Grid
      </p>
    </GridAndDotBackgrounds>
  );
}

export function GridAndDotBackgroundsDot({ className }: GridAndDotBackgroundsDemoProps = {}) {
  return (
    <GridAndDotBackgrounds variant="dot" className="h-96 w-full bg-black relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-2xl md:text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Dot Background
      </p>
    </GridAndDotBackgrounds>
  );
}