"use client";
import React from "react";
import { DirectionAwareHover } from "./direction-aware-hover-base";

export function DirectionAwareHoverCard() {
  const projects = [
    {
      title: "Project Alpha",
      description: "A revolutionary approach to web development",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop",
      tech: "React, TypeScript"
    },
    {
      title: "Design System",
      description: "Component library with modern patterns",
      imageUrl: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=500&h=500&fit=crop",
      tech: "Tailwind, Framer Motion"
    },
    {
      title: "Mobile App",
      description: "Cross-platform mobile solution",
      imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=500&fit=crop",
      tech: "React Native"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {projects.map((project, index) => (
        <DirectionAwareHover 
          key={index}
          imageUrl={project.imageUrl}
          className="w-full h-80"
        >
          <div className="space-y-2">
            <h3 className="font-bold text-xl">{project.title}</h3>
            <p className="font-normal text-sm opacity-90">{project.description}</p>
            <p className="font-normal text-xs opacity-70">{project.tech}</p>
          </div>
        </DirectionAwareHover>
      ))}
    </div>
  );
}