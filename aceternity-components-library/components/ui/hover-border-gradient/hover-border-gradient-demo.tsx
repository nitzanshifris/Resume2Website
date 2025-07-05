"use client";
import React from "react";
import { HoverBorderGradient, AceternityLogo } from "./hover-border-gradient-base";
import { HoverBorderGradientDemoProps } from "./hover-border-gradient.types";

export function HoverBorderGradientDemo({ className, containerClassName }: HoverBorderGradientDemoProps = {}) {
  return (
    <div className="m-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <AceternityLogo />
        <span>Aceternity UI</span>
      </HoverBorderGradient>
    </div>
  );
}

// Preview variant for gallery - constrained display
export function HoverBorderGradientPreview({ className, containerClassName }: HoverBorderGradientDemoProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full relative flex items-center justify-center"}>
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <AceternityLogo />
        <span>Aceternity UI</span>
      </HoverBorderGradient>
    </div>
  );
}

// Minimal variant - text only
export function HoverBorderGradientMinimal({ className, containerClassName }: HoverBorderGradientDemoProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full relative flex items-center justify-center"}>
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white"
      >
        <span>Click Me</span>
      </HoverBorderGradient>
    </div>
  );
}

// Link variant
export function HoverBorderGradientLink({ className, containerClassName }: HoverBorderGradientDemoProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full relative flex items-center justify-center"}>
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="a"
        href="#"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <span>Learn More</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </HoverBorderGradient>
    </div>
  );
}

// Square variant
export function HoverBorderGradientSquare({ className, containerClassName }: HoverBorderGradientDemoProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full relative flex items-center justify-center"}>
      <HoverBorderGradient
        containerClassName="rounded-lg"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white px-8 py-4"
      >
        <span className="text-lg font-semibold">Get Started</span>
      </HoverBorderGradient>
    </div>
  );
}