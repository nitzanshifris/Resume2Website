"use client";
import React from "react";
import { BackgroundBeams } from "./background-beams-base";
import { motion } from "motion/react";

export function BackgroundBeamsFeatureSection() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-4xl mx-auto p-4 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 mb-8"
        >
          Powerful Features
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Lightning Fast",
              description: "Optimized performance with sub-second response times",
              icon: "⚡",
            },
            {
              title: "Secure by Default",
              description: "Enterprise-grade security with end-to-end encryption",
              icon: "🔒",
            },
            {
              title: "Global Scale",
              description: "Deploy anywhere, scale infinitely with our infrastructure",
              icon: "🌍",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-neutral-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex justify-center gap-4"
        >
          <button className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium border border-neutral-800 hover:border-neutral-700 transition-colors">
            Learn More
          </button>
        </motion.div>
      </div>
      <BackgroundBeams />
    </div>
  );
}