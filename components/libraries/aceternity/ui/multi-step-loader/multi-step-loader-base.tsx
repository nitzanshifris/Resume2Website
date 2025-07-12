"use client";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { IconCheck } from "@tabler/icons-react";

const LoadingState = {
  IDLE: "idle",
  LOADING: "loading",
  COMPLETE: "complete",
};

export interface LoadingStep {
  text: string;
}

export interface MultiStepLoaderProps {
  loadingStates: LoadingStep[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}

export const MultiStepLoader = ({
  loadingStates,
  loading = true,
  duration = 2000,
  loop = true,
}: MultiStepLoaderProps) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentState((prevState) => {
        if (prevState === loadingStates.length - 1) {
          return loop ? 0 : prevState;
        }
        return prevState + 1;
      });
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl"
        >
          <div className="h-96  relative">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>

          <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingStep[];
  value?: number;
}) => {
  return (
    <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0);

        return (
          <motion.div
            key={index}
            className={cn("text-left flex gap-2 mb-4")}
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity: opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
          >
            <div>
              {index > value && (
                <IconCheck className="text-black dark:text-white h-4 w-4" />
              )}
              {index <= value && (
                <IconCheck className="text-black dark:text-white h-4 w-4 opacity-40" />
              )}
            </div>
            <span
              className={cn(
                "text-black dark:text-white text-sm",
                value === index && "text-black dark:text-lime-500 opacity-100"
              )}
            >
              {loadingState.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};