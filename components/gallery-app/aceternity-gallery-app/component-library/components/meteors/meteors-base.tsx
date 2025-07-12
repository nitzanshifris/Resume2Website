"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { useId } from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const id = useId();
  const meteors = new Array(number || 20).fill(true);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map((el, idx) => {
        const meteorCount = number || 20;
        // Calculate position to evenly distribute meteors across container width
        const position = idx * (800 / meteorCount) - 400; // Spread across 800px range, centered
        
        // Use index-based values for consistent server/client rendering
        const delay = (idx * 0.2) % 5;
        const duration = 5 + (idx % 5);

        return (
          <span
            key={`${id}-meteor-${idx}`}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-40px", // Start above the container
              left: position + "px",
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          ></span>
        );
      })}
    </motion.div>
  );
};