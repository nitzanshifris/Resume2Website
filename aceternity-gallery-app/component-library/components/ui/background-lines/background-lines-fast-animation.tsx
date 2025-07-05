"use client";
import React from "react";
import { BackgroundLines } from "./background-lines-base";

export function BackgroundLinesFastAnimation() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4" svgOptions={{ duration: 5 }}>
      <div className="text-center max-w-3xl mx-auto relative z-20">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-6xl font-bold mb-6">
          Fast Animation
        </h2>
        <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-400 mb-8">
          Dynamic lines that move quickly to create an energetic atmosphere
        </p>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
          Experience Speed
        </button>
      </div>
    </BackgroundLines>
  );
}