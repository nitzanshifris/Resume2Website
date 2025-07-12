"use client";
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "./hero-highlight-base";
import { HeroHighlightDemoProps } from "./hero-highlight.types";

export function HeroHighlightDemo({ className }: HeroHighlightDemoProps = {}) {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        With insomnia, nothing&apos;s real. Everything is far away. Everything
        is a{" "}
        <Highlight className="text-black dark:text-white">
          copy, of a copy, of a copy.
        </Highlight>
      </motion.h1>
    </HeroHighlight>
  );
}

export function HeroHighlightPreview({ className }: HeroHighlightDemoProps = {}) {
  return (
    <HeroHighlight containerClassName="h-96 w-full relative overflow-hidden rounded-lg">
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-xl px-4 md:text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-white max-w-2xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        Beautiful{" "}
        <Highlight className="text-black dark:text-white">
          highlighted text
        </Highlight>{" "}
        with animated background
      </motion.h1>
    </HeroHighlight>
  );
}

export function HeroHighlightMinimal({ className }: HeroHighlightDemoProps = {}) {
  return (
    <HeroHighlight containerClassName="h-96 w-full relative overflow-hidden rounded-lg">
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-700 dark:text-white text-center">
        Simple text with{" "}
        <Highlight>
          highlight effect
        </Highlight>
      </h1>
    </HeroHighlight>
  );
}

export function HeroHighlightMultiple({ className }: HeroHighlightDemoProps = {}) {
  return (
    <HeroHighlight containerClassName="h-96 w-full relative overflow-hidden rounded-lg">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-700 dark:text-white">
          <Highlight>Build</Highlight> amazing products
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Create stunning interfaces with{" "}
          <Highlight className="text-black dark:text-white">
            animated highlights
          </Highlight>{" "}
          that capture attention and{" "}
          <Highlight className="text-black dark:text-white">
            delight users
          </Highlight>
        </p>
      </motion.div>
    </HeroHighlight>
  );
}

export function HeroHighlightCallToAction({ className }: HeroHighlightDemoProps = {}) {
  return (
    <HeroHighlight containerClassName="h-96 w-full relative overflow-hidden rounded-lg">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-center space-y-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-700 dark:text-white">
          Ready to{" "}
          <Highlight className="text-black dark:text-white">
            transform your ideas
          </Highlight>
          ?
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto">
          Join thousands of developers building the future
        </p>
        <button className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:scale-105 transition-transform">
          Get Started Free
        </button>
      </motion.div>
    </HeroHighlight>
  );
}