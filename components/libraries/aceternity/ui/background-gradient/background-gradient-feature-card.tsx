"use client";
import React from "react";
import { BackgroundGradient } from "./background-gradient-base";
import { IconAppWindow } from "@tabler/icons-react";

export function BackgroundGradientFeatureCard() {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <IconAppWindow className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-black dark:text-neutral-200 mb-2 text-center">
          Premium Features
        </h3>
        
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 text-center">
          Unlock advanced capabilities with our premium feature set designed for professionals.
        </p>
        
        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-green-500">✓</span> Advanced Analytics
          </li>
          <li className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-green-500">✓</span> Priority Support
          </li>
          <li className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-green-500">✓</span> Custom Integrations
          </li>
          <li className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-green-500">✓</span> Unlimited Projects
          </li>
        </ul>
        
        <button className="w-full rounded-full py-2 text-white bg-black font-medium text-sm dark:bg-zinc-800 hover:bg-gray-800 transition-colors">
          Get Started
        </button>
      </BackgroundGradient>
    </div>
  );
}