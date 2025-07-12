"use client";
import React from "react";
import { BackgroundLines } from "./background-lines-base";

export function BackgroundLinesPreviewContact() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-6 h-80" svgOptions={{ duration: 12 }}>
      <div className="text-center max-w-sm mx-auto relative z-20">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-lg md:text-2xl font-bold mb-4">
          Let's Connect
        </h2>
        
        <p className="text-xs text-neutral-700 dark:text-neutral-400 mb-6">
          Ready to work together? Get in touch!
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg mb-1">📧</div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Email</p>
          </div>
          
          <div className="text-center">
            <div className="text-lg mb-1">📱</div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Phone</p>
          </div>
          
          <div className="text-center">
            <div className="text-lg mb-1">📍</div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Location</p>
          </div>
        </div>
        
        <button className="bg-neutral-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-xs font-medium">
          Get Started
        </button>
      </div>
    </BackgroundLines>
  );
}