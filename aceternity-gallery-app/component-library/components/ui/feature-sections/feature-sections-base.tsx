"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { FeatureSectionsProps } from "./feature-sections.types";

export function FeatureSections({ 
  features, 
  title, 
  subtitle, 
  className 
}: FeatureSectionsProps) {
  return (
    <div className={cn("py-20 lg:py-40 max-w-7xl mx-auto", className)}>
      {(title || subtitle) && (
        <div className="px-8 mb-12">
          {title && (
            <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
              {title}
            </h4>
          )}
          {subtitle && (
            <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            {feature.icon && (
              <div className="mb-4 text-neutral-600 dark:text-neutral-400">
                {feature.icon}
              </div>
            )}
            <h3 className="text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-100">
              {feature.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

export const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

export const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};