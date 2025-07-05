"use client";
import { cn } from "./utils";
import React from "react";

export function StatsWithGradient() {
  const stats = [
    {
      title: "Active Users",
      value: "10K+",
      description: "Users actively using our platform",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Revenue",
      value: "$1M+",
      description: "Total revenue generated",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Countries",
      value: "50+",
      description: "Countries where we operate",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Support",
      value: "24/7",
      description: "Round the clock support",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-lg dark:bg-black"
            >
              <div
                className={cn(
                  "mb-4 rounded-full bg-gradient-to-r p-4",
                  stat.gradient
                )}
              >
                <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
              </div>
              <p className="text-lg font-medium text-neutral-600 dark:text-neutral-300">
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