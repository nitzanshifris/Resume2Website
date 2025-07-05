"use client";
import React from "react";
import { ColourfulText } from "./colourful-text-base";

export function ColourfulTextMinimal() {
  return (
    <div className="p-8 bg-white dark:bg-black">
      <h2 className="text-2xl md:text-4xl font-semibold text-center text-gray-900 dark:text-gray-100">
        Welcome to our <ColourfulText text="creative" /> platform
      </h2>
    </div>
  );
}