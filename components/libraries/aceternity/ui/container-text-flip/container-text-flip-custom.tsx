"use client";
import React from "react";
import { ContainerTextFlip } from "./container-text-flip-base";
import { motion } from "motion/react";

export function ContainerTextFlipCustom() {
  const technicalWords = ["React", "Next.js", "TypeScript", "Tailwind"];
  
  return (
    <div className="text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Built with{" "}
          <ContainerTextFlip 
            words={technicalWords}
            interval={2000}
            animationDuration={500}
            className="!text-2xl md:!text-4xl"
          />
        </h2>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Experience the power of{" "}
          <ContainerTextFlip 
            words={["innovation", "creativity", "technology", "design"]}
            interval={2500}
            className="!text-lg md:!text-2xl inline-flex align-middle"
          />
        </p>
      </motion.div>
    </div>
  );
}