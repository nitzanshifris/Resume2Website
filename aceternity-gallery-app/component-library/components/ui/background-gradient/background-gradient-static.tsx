"use client";
import React from "react";
import { BackgroundGradient } from "./background-gradient-base";

export function BackgroundGradientStatic() {
  return (
    <div>
      <BackgroundGradient 
        animate={false}
        className="rounded-[22px] max-w-sm p-6 sm:p-8 bg-white dark:bg-zinc-900"
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-black dark:text-neutral-200 mb-4">
            Static Gradient
          </h3>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            This variant shows the gradient without animation, perfect for situations where you want 
            the visual impact without the movement.
          </p>
          
          <button className="rounded-full px-6 py-2 text-white bg-black font-medium text-sm dark:bg-zinc-800 hover:bg-gray-800 transition-colors">
            Learn More
          </button>
        </div>
      </BackgroundGradient>
    </div>
  );
}