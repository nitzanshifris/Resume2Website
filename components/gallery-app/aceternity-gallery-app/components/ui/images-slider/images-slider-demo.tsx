"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "./images-slider-base";
import { ImagesSliderDemoProps } from "./images-slider.types";
 
export function ImagesSliderDemo({ className }: ImagesSliderDemoProps = {}) {
  const images = [
    "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return (
    <ImagesSlider className={className || "h-[40rem]"} images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          The hero section slideshow <br /> nobody asked for
        </motion.p>
        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Join now →</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  );
}

// Preview variant for gallery - constrained display
export function ImagesSliderPreview({ className }: ImagesSliderDemoProps = {}) {
  const images = [
    "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  
  return (
    <ImagesSlider className={className || "h-96 w-full"} images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-4xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Hero Slideshow <br /> Preview
        </motion.p>
        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Get Started →</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  );
}

// Minimal variant - no button
export function ImagesSliderMinimal({ className }: ImagesSliderDemoProps = {}) {
  const images = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2340&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?q=80&w=2340&auto=format&fit=crop",
  ];
  
  return (
    <ImagesSlider className={className || "h-96 w-full"} images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.h2 className="font-bold text-2xl md:text-5xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Beautiful Landscapes
        </motion.h2>
        <motion.p className="text-neutral-300 text-center mt-2">
          Discover amazing places around the world
        </motion.p>
      </motion.div>
    </ImagesSlider>
  );
}

// Product showcase variant
export function ImagesSliderProduct({ className }: ImagesSliderDemoProps = {}) {
  const images = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2399&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2340&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2380&auto=format&fit=crop",
  ];
  
  return (
    <ImagesSlider className={className || "h-96 w-full"} images={images} direction="down">
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.h2 className="font-bold text-2xl md:text-5xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Featured Products
        </motion.h2>
        <motion.p className="text-neutral-300 text-center mt-2 mb-6">
          Premium quality, exceptional design
        </motion.p>
        <div className="flex gap-4">
          <button className="px-6 py-2 backdrop-blur-sm border bg-white/10 border-white/20 text-white rounded-full">
            Shop Now
          </button>
          <button className="px-6 py-2 backdrop-blur-sm border border-white/20 text-white rounded-full">
            Learn More
          </button>
        </div>
      </motion.div>
    </ImagesSlider>
  );
}

// Dark overlay variant
export function ImagesSliderDark({ className }: ImagesSliderDemoProps = {}) {
  const images = [
    "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2560&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2384&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2340&auto=format&fit=crop",
  ];
  
  return (
    <ImagesSlider 
      className={className || "h-96 w-full"} 
      images={images}
      overlayClassName="bg-black/80"
      autoplay={false}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center text-center"
      >
        <motion.h2 className="font-bold text-3xl md:text-6xl text-white mb-4">
          Manual Navigation
        </motion.h2>
        <motion.p className="text-neutral-200 text-lg mb-8 max-w-xl">
          Use arrow keys to navigate through the slides. Autoplay is disabled for this variant.
        </motion.p>
        <div className="flex items-center gap-8 text-neutral-400">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 text-xs border border-neutral-600 rounded bg-neutral-800">←</kbd>
            <span className="text-sm">Previous</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Next</span>
            <kbd className="px-2 py-1 text-xs border border-neutral-600 rounded bg-neutral-800">→</kbd>
          </div>
        </div>
      </motion.div>
    </ImagesSlider>
  );
}