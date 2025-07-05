"use client";
import React from "react";
import { BackgroundLines } from "./background-lines-base";

export function BackgroundLinesAboutSection() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-20">
      <div className="text-center max-w-4xl mx-auto relative z-20">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl md:text-5xl font-bold mb-8">
          About Me
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
              John Doe
            </h3>
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
              Full Stack Developer
            </p>
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Passionate developer with 5+ years of experience building modern web applications. 
              I specialize in React, Node.js, and cloud technologies, creating scalable solutions 
              that deliver exceptional user experiences.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Core Skills
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {["React", "TypeScript", "Node.js", "AWS", "MongoDB", "Docker"].map((skill) => (
                <div key={skill} className="bg-white/10 dark:bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BackgroundLines>
  );
}