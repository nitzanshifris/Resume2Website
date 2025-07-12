"use client";

import { motion } from "motion/react";
import React from "react";
import { AuroraBackground } from "./aurora-background-base";

export function AuroraBackgroundContentWrapper() {
  return (
    <AuroraBackground showRadialGradient={false} className="min-h-[600px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.5,
          duration: 1,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-8 items-center justify-center px-8 max-w-4xl mx-auto"
      >
        <h2 className="text-2xl md:text-5xl font-bold dark:text-white text-center">
          Welcome to Our Platform
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {[
            { title: "Fast", desc: "Lightning quick performance" },
            { title: "Secure", desc: "Enterprise-grade security" },
            { title: "Scalable", desc: "Grows with your needs" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-lg p-6 text-center"
            >
              <h3 className="text-xl font-semibold dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-4"
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 transition-colors">
            Get Started
          </button>
          <button className="bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-black dark:text-white rounded-full px-6 py-3 backdrop-blur-sm transition-colors">
            Learn More
          </button>
        </motion.div>
      </motion.div>
    </AuroraBackground>
  );
}