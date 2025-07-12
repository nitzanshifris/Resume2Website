"use client";
import React from "react";
import { Cover } from "./cover-base";

export function CoverWordEffect() {
  return (
    <div className="w-full h-[60vh] px-1 md:px-8 flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold max-w-4xl mx-auto relative z-20 py-6">
          Welcome to the <Cover>future</Cover> of web development
        </h1>
        <div className="text-lg md:text-xl text-neutral-400 mt-4 max-w-2xl mx-auto">
          Experience lightning-fast development with our cutting-edge tools and <Cover>innovative</Cover> solutions.
        </div>
      </div>
    </div>
  );
}