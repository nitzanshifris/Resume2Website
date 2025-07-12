"use client";
import React from "react";
import { BackgroundGradient } from "./background-gradient-base";

export function BackgroundGradientMinimal() {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] w-full h-32 bg-white dark:bg-zinc-900 flex items-center justify-center">
        <p className="text-lg font-medium text-black dark:text-neutral-200">
          Minimal Gradient Background
        </p>
      </BackgroundGradient>
    </div>
  );
}