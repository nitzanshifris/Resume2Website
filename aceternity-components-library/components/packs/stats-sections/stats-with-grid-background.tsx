"use client";
import { cn } from "./utils";
import React from "react";

export function StatsWithGridBackground() {
  const stats = [
    {
      title: "Active Users",
      value: "10K+",
      description: "Users actively using our platform",
    },
    {
      title: "Revenue",
      value: "$1M+",
      description: "Total revenue generated",
    },
    {
      title: "Countries",
      value: "50+",
      description: "Countries where we operate",
    },
    {
      title: "Support",
      value: "24/7",
      description: "Round the clock support",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-black">
      <div className="absolute inset-0 bg-grid-black/[0.2] dark:bg-grid-white/[0.2]" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-2xl bg-white/50 p-8 backdrop-blur-sm dark:bg-black/50"
            >
              <h3 className="text-4xl font-bold text-black dark:text-white">
                {stat.value}
              </h3>
              <p className="mt-2 text-lg font-medium text-neutral-600 dark:text-neutral-300">
                {stat.title}
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 