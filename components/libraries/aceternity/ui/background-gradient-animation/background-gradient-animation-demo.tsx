"use client";
import React from "react";
import { BackgroundGradientAnimation } from "./background-gradient-animation-base";
import { BackgroundGradientAnimationDemoProps } from "./background-gradient-animation.types";

export function BackgroundGradientAnimationDemo({ className }: BackgroundGradientAnimationDemoProps = {}) {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          Gradients X Animations
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}

export function BackgroundGradientAnimationPreview({ className }: BackgroundGradientAnimationDemoProps = {}) {
  return (
    <BackgroundGradientAnimation containerClassName="h-96 w-full relative overflow-hidden rounded-lg">
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-lg text-center md:text-2xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          Preview Mode
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}

export function BackgroundGradientAnimationCustom({ className }: BackgroundGradientAnimationDemoProps = {}) {
  return (
    <BackgroundGradientAnimation 
      containerClassName="h-96 w-full relative overflow-hidden rounded-lg"
      gradientBackgroundStart="rgb(108, 50, 162)"
      gradientBackgroundEnd="rgb(50, 17, 82)"
      firstColor="255, 113, 18"
      secondColor="74, 221, 255"
      thirdColor="220, 100, 255"
      fourthColor="50, 200, 50"
      fifthColor="180, 50, 180"
      interactive={false}
    >
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-lg text-center md:text-2xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          Custom Colors
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}

export function BackgroundGradientAnimationCallToAction({ className }: BackgroundGradientAnimationDemoProps = {}) {
  return (
    <BackgroundGradientAnimation containerClassName="h-96 w-full relative overflow-hidden rounded-lg">
      <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none text-center">
        <h2 className="text-3xl md:text-5xl bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20 mb-4">
          Get Started Today
        </h2>
        <p className="text-lg md:text-xl text-white/70 mb-6 max-w-2xl">
          Experience the power of animated gradients in your next project
        </p>
        <button className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 pointer-events-auto">
          Learn More
        </button>
      </div>
    </BackgroundGradientAnimation>
  );
}