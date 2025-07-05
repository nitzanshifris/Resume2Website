"use client";
import React from "react";
import { BackgroundLines } from "./background-lines-base";

export function BackgroundLinesContactSection() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-20" svgOptions={{ duration: 12 }}>
      <div className="text-center max-w-4xl mx-auto relative z-20">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl md:text-5xl font-bold mb-8">
          Let's Work Together
        </h2>
        
        <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-400 mb-12 max-w-2xl mx-auto">
          Ready to bring your ideas to life? Get in touch and let's create something amazing together.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Email</h3>
            <p className="text-neutral-600 dark:text-neutral-400">hello@example.com</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Phone</h3>
            <p className="text-neutral-600 dark:text-neutral-400">+1 (555) 123-4567</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Location</h3>
            <p className="text-neutral-600 dark:text-neutral-400">San Francisco, CA</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-neutral-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            Send Message
          </button>
          <button className="border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 px-8 py-3 rounded-full font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Download CV
          </button>
        </div>
      </div>
    </BackgroundLines>
  );
}