"use client";
import React from "react";
import { BackgroundGradient } from "./background-gradient-base";
import { IconBrandTwitter, IconBrandLinkedin, IconBrandGithub } from "@tabler/icons-react";

export function BackgroundGradientProfileCard() {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-6 sm:p-10 bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">JD</span>
          </div>
          
          <h3 className="text-xl font-bold text-black dark:text-neutral-200 mb-1">
            John Doe
          </h3>
          
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
            Full Stack Developer
          </p>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            Passionate developer with 5+ years of experience building modern web applications. 
            Specialized in React, Node.js, and cloud technologies.
          </p>
          
          <div className="flex gap-4 mb-6">
            <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
              <IconBrandTwitter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
              <IconBrandLinkedin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
              <IconBrandGithub className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </a>
          </div>
          
          <button className="w-full rounded-full py-2 text-white bg-black font-medium text-sm dark:bg-zinc-800 hover:bg-gray-800 transition-colors">
            Connect
          </button>
        </div>
      </BackgroundGradient>
    </div>
  );
}