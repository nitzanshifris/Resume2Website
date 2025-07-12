"use client";
import React from "react";
import { HeroSectionOne } from "./hero-sections-base";
import { HeroSectionDemoProps } from "./hero-sections.types";

// Full demo - the original
export function HeroSectionDemo({ className, containerClassName }: HeroSectionDemoProps = {}) {
  return <HeroSectionOne containerClassName={containerClassName} />;
}

// Preview variant for gallery - constrained height
export function HeroSectionPreview({ className, containerClassName }: HeroSectionDemoProps = {}) {
  return (
    <div className={containerClassName || "h-[600px] w-full relative overflow-hidden rounded-lg overflow-y-auto"}>
      <HeroSectionOne />
    </div>
  );
}

// Minimal variant - without image
export function HeroSectionMinimal({ className, containerClassName }: HeroSectionDemoProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full relative overflow-hidden rounded-lg"}>
      <HeroSectionOne />
    </div>
  );
}