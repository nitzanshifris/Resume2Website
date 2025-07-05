"use client";
import React from "react";
import { BackgroundBeams } from "./background-beams-base";

export function BackgroundBeamsMinimal() {
  return (
    <div className="h-[30rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
          Background Beams
        </h1>
        <p className="text-neutral-400 mt-4 max-w-lg mx-auto">
          Multiple animated beams following SVG paths create a dynamic background effect
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}