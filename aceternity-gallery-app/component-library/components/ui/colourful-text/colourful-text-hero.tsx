"use client";
import React from "react";
import { ColourfulText } from "./colourful-text-base";
import { motion } from "motion/react";

export function ColourfulTextHero() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 to-black">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
      />
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white relative z-10 mb-4">
          Build <ColourfulText text="amazing" /> experiences
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Create stunning visual effects with our animated text component
        </p>
      </div>
    </div>
  );
}