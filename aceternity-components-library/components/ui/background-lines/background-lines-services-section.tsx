"use client";
import React from "react";
import { BackgroundLines } from "./background-lines-base";

export function BackgroundLinesServicesSection() {
  const services = [
    {
      title: "Web Development",
      description: "Custom web applications built with modern frameworks and best practices",
      icon: "🌐"
    },
    {
      title: "Mobile Apps",
      description: "Cross-platform mobile applications that work seamlessly on all devices",
      icon: "📱"
    },
    {
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment strategies",
      icon: "☁️"
    },
    {
      title: "Consulting",
      description: "Technical consulting and architecture planning for your projects",
      icon: "💡"
    }
  ];

  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-20">
      <div className="text-center max-w-6xl mx-auto relative z-20">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl md:text-5xl font-bold mb-12">
          Services I Offer
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white/10 dark:bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12">
          <button className="bg-neutral-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </BackgroundLines>
  );
}