"use client";
import React from "react";
import { DirectionAwareHover } from "./direction-aware-hover-base";

export function DirectionAwareHoverFeatures() {
  const features = [
    {
      title: "Lightning Fast",
      description: "Optimized performance",
      icon: "⚡",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop"
    },
    {
      title: "Secure by Design",
      description: "Enterprise-grade security",
      icon: "🔒",
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=400&fit=crop"
    },
    {
      title: "Always Synced",
      description: "Real-time updates",
      icon: "🔄",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop"
    },
    {
      title: "Global Scale",
      description: "Worldwide deployment",
      icon: "🌍",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8">
      {features.map((feature, index) => (
        <DirectionAwareHover 
          key={index}
          imageUrl={feature.imageUrl}
          className="w-full h-64"
        >
          <div className="space-y-1">
            <div className="text-3xl mb-2">{feature.icon}</div>
            <h4 className="font-bold text-lg">{feature.title}</h4>
            <p className="font-normal text-xs opacity-80">{feature.description}</p>
          </div>
        </DirectionAwareHover>
      ))}
    </div>
  );
}