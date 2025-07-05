"use client";
import React from "react";
import { BackgroundBeamsWithCollision } from "./background-beams-with-collision-base";
import { motion } from "motion/react";

export function BackgroundBeamsWithCollisionInteractiveDemo() {
  return (
    <BackgroundBeamsWithCollision className="h-[50rem]">
      <div className="relative z-20 flex flex-col items-center justify-center space-y-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-center text-black dark:text-white"
        >
          Interactive Beam Collisions
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-gray-600 dark:text-gray-300 max-w-2xl px-4"
        >
          Watch as beams fall from above and explode into particles when they hit the ground. 
          Each collision creates a unique burst of energy.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          {[
            { label: "Beams", value: "7", icon: "⚡" },
            { label: "Particles", value: "20", icon: "✨" },
            { label: "Physics", value: "Real", icon: "🎯" },
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-black dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Collision detection runs at 50ms intervals
          </p>
        </motion.div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}