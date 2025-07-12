"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FlipWordsProps } from "./flip-words.types";

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: FlipWordsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Move to next word
  const startAnimation = useCallback(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  // Start animation on mount and handle cleanup
  useEffect(() => {
    const cleanup = startAnimation();
    return cleanup;
  }, [startAnimation]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        exit={{
          opacity: 0,
          y: -40,
          x: 40,
          filter: "blur(8px)",
          scale: 2,
          position: "absolute",
        }}
        className={cn(
          "relative z-10 inline-block px-2 text-left",
          className
        )}
        key={currentIndex}
      >
        {words[currentIndex].split(" ").map((word, wordIndex) => {
          return (
            <motion.span
              key={word + wordIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: wordIndex * 0.3,
                duration: 0.3,
              }}
              className="inline-block whitespace-nowrap"
            >
              {word.split("").map((letter, letterIndex) => {
                return (
                  <LayoutGroup key={word + letterIndex}>
                    <motion.span
                      key={letter + letterIndex}
                      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                      transition={{
                        delay: wordIndex * 0.3 + letterIndex * 0.05,
                        duration: 0.2,
                      }}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  </LayoutGroup>
                );
              })}
              <span className="inline-block">&nbsp;</span>
            </motion.span>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};