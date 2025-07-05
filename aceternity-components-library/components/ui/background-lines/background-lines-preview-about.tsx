"use client";
import React from "react";
import { BackgroundLines } from "./background-lines-base";

export function BackgroundLinesPreviewAbout() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-8 h-80" svgOptions={{ duration: 10 }}>
      <div className="text-center max-w-md mx-auto relative z-20">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-lg md:text-2xl font-bold mb-4">
          About Me
        </h2>
        
        <div className="space-y-3">
          <h3 className="text-sm md:text-base font-semibold text-neutral-800 dark:text-neutral-200">
            John Doe
          </h3>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Full Stack Developer
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Building modern web applications with passion and expertise.
          </p>
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            {["React", "Node.js", "AWS"].map((skill) => (
              <div key={skill} className="bg-white/10 dark:bg-black/20 backdrop-blur-sm px-2 py-1 rounded text-xs">
                <span className="text-neutral-700 dark:text-neutral-300">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BackgroundLines>
  );
}