"use client";
import { useScroll, useTransform } from "motion/react";
import React from "react";
import { GoogleGeminiEffect } from "./google-gemini-effect-base";
import { GoogleGeminiEffectDemoProps } from "./google-gemini-effect.types";

export function GoogleGeminiEffectDemo({ className }: GoogleGeminiEffectDemoProps = {}) {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div
      className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip"
      ref={ref}
    >
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />
    </div>
  );
}

export function GoogleGeminiEffectPreview({ className }: GoogleGeminiEffectDemoProps = {}) {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  // Debug: Log scroll progress
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      console.log("Scroll progress:", value);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div
      className="h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip"
      ref={ref}
    >
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
        title="Scroll & See Magic"
        description="Scroll down to see the animated SVG paths come to life"
      />
    </div>
  );
}

export function GoogleGeminiEffectCustom({ className }: GoogleGeminiEffectDemoProps = {}) {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.6], [0.1, 1.1]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.6], [0.2, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.6], [0.3, 1.3]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.6], [0.4, 1.4]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.6], [0.5, 1.5]);

  return (
    <div
      className={`h-[350vh] bg-gradient-to-b from-black to-gray-900 w-full dark:border dark:border-white/[0.1] rounded-md relative pt-32 overflow-clip ${className || ''}`}
      ref={ref}
    >
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
        title="Custom Animation"
        description="Different timing for a unique effect"
      />
    </div>
  );
}