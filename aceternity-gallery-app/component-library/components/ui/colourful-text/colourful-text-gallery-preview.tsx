"use client";
import React from "react";
import { ColourfulText } from "./colourful-text-base";
import { motion } from "motion/react";

export function ColourfulTextGalleryPreview() {
  return (
    <div className="w-full h-64 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-lg">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
      />
      <h1 className="text-2xl md:text-4xl font-bold text-center text-white relative z-10">
        <ColourfulText text="Colourful" /> Text Effect
      </h1>
    </div>
  );
}

export function ColourfulTextGalleryMinimal() {
  return (
    <div className="w-full p-8 bg-white dark:bg-gray-900 rounded-lg">
      <p className="text-lg md:text-2xl font-medium text-center text-gray-900 dark:text-gray-100">
        Make your text <ColourfulText text="vibrant" />
      </p>
    </div>
  );
}

export function ColourfulTextGalleryHero() {
  return (
    <div className="w-full h-64 flex items-center justify-center relative overflow-hidden bg-black rounded-lg">
      <motion.img
        src="https://assets.aceternity.com/linear-demo.webp"
        className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      />
      <h2 className="text-xl md:text-3xl font-bold text-center text-white relative z-2">
        The <ColourfulText text="best" /> components
      </h2>
    </div>
  );
}