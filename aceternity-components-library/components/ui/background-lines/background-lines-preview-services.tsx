"use client";
import React from "react";
import { BackgroundLines } from "./background-lines-base";

export function BackgroundLinesPreviewServices() {
  const services = [
    { title: "Web Dev", icon: "🌐" },
    { title: "Mobile", icon: "📱" },
    { title: "Cloud", icon: "☁️" }
  ];

  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-6 h-80" svgOptions={{ duration: 6 }}>
      <div className="text-center max-w-md mx-auto relative z-20">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-lg md:text-2xl font-bold mb-6">
          My Services
        </h2>
        
        <div className="grid grid-cols-3 gap-3">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white/10 dark:bg-black/20 backdrop-blur-sm p-3 rounded-lg border border-neutral-200 dark:border-neutral-700"
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <h3 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </BackgroundLines>
  );
}