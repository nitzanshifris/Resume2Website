"use client";
import React from "react";
import { TextHoverEffect } from "./text-hover-effect-base";

export function TextHoverEffectDemo() {
  return (
    <div className="h-[40rem] flex items-center justify-center">
      <TextHoverEffect text="ACET" />
    </div>
  );
}

export function TextHoverEffectCustom() {
  return (
    <div className="h-[30rem] flex items-center justify-center">
      <TextHoverEffect text="HOVER" duration={0.3} />
    </div>
  );
}

export function TextHoverEffectShort() {
  return (
    <div className="h-[25rem] flex items-center justify-center">
      <TextHoverEffect text="AI" />
    </div>
  );
}

export function TextHoverEffectLong() {
  return (
    <div className="h-[30rem] flex items-center justify-center">
      <TextHoverEffect text="ACETERNITY" duration={0.5} />
    </div>
  );
}

export function TextHoverEffectSlow() {
  return (
    <div className="h-[30rem] flex items-center justify-center">
      <TextHoverEffect text="SLOW" duration={1} />
    </div>
  );
}