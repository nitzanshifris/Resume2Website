"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "./lamp-base";
import { LampDemoProps, LampGalleryPreviewProps } from "./lamp.types";

export const LampDemo: React.FC<LampDemoProps> = ({ title, subtitle, className, containerClassName } = {}) => {
  return (
    <LampContainer className={containerClassName}>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className={`mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl ${className || ""}`}
      >
        {title || "Build lamps"} <br /> {subtitle || "the right way"}
      </motion.h1>
    </LampContainer>
  );
};

export function LampGalleryPreview({ className, containerClassName }: LampGalleryPreviewProps = {}) {
  return (
    <LampContainer className={containerClassName || "h-96 w-full relative overflow-hidden rounded-lg"}>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className={`mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-4xl ${className || ""}`}
      >
        Lamp Effect <br /> Preview
      </motion.h1>
    </LampContainer>
  );
}

export function LampSimple({ title, className, containerClassName }: LampDemoProps = {}) {
  return (
    <LampContainer className={containerClassName || "h-96 w-full relative overflow-hidden rounded-lg"}>
      <motion.h2
        initial={{ opacity: 0.5, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.6,
          ease: "easeInOut",
        }}
        className={`mt-8 bg-gradient-to-br from-blue-300 to-purple-500 py-4 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-4xl ${className || ""}`}
      >
        {title || "Simple Lamp"}
      </motion.h2>
    </LampContainer>
  );
}

export function LampColorful({ title, subtitle, className, containerClassName }: LampDemoProps = {}) {
  return (
    <div
      className={containerClassName || "h-96 w-full relative overflow-hidden rounded-lg bg-slate-950"}
    >
      <div className="relative flex w-full h-full scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "16rem" }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-32 overflow-visible w-[16rem] bg-gradient-conic from-pink-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-slate-950 h-20 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-20 h-[100%] left-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "16rem" }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-32 w-[16rem] bg-gradient-conic from-transparent via-transparent to-purple-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-20 h-[100%] right-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-slate-950 h-20 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-24 w-full translate-y-6 scale-x-150 bg-slate-950 blur-xl"></div>
        <div className="absolute inset-auto z-50 h-18 w-[14rem] -translate-y-1/4 rounded-full bg-pink-500 opacity-50 blur-2xl"></div>
        <motion.div
          initial={{ width: "4rem" }}
          whileInView={{ width: "8rem" }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-18 w-32 -translate-y-12 rounded-full bg-purple-400 blur-xl"
        ></motion.div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[16rem] -translate-y-14 bg-purple-400"
        ></motion.div>
      </div>

      <div className="relative z-50 flex -translate-y-40 flex-col items-center px-5">
        <motion.h2
          initial={{ opacity: 0.5, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className={`bg-gradient-to-br from-pink-300 to-purple-500 py-2 bg-clip-text text-center text-xl font-medium tracking-tight text-transparent md:text-3xl ${className || ""}`}
        >
          {title || "Colorful"} <br /> {subtitle || "Lamp Effect"}
        </motion.h2>
      </div>
    </div>
  );
}

export function LampMinimal({ title, className, containerClassName }: LampDemoProps = {}) {
  return (
    <div
      className={containerClassName || "h-96 w-full relative overflow-hidden rounded-lg bg-gray-900"}
    >
      <div className="relative flex w-full h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.1,
            duration: 0.5,
            ease: "easeOut",
          }}
          className="absolute inset-auto z-50 h-24 w-48 -translate-y-8 rounded-full bg-white opacity-20 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "2rem" }}
          whileInView={{ width: "12rem" }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-48 -translate-y-12 bg-white"
        ></motion.div>
      </div>

      <div className="relative z-50 flex -translate-y-16 flex-col items-center px-5">
        <motion.h3
          initial={{ opacity: 0.5, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            ease: "easeInOut",
          }}
          className={`bg-gradient-to-br from-gray-200 to-gray-400 py-2 bg-clip-text text-center text-lg font-medium tracking-tight text-transparent md:text-2xl ${className || ""}`}
        >
          {title || "Minimal Lamp"}
        </motion.h3>
      </div>
    </div>
  );
}