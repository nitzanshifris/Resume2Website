"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampUnderline = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      
      {/* Simple glowing underline */}
      <div className="absolute top-full left-0 right-0 h-8 pointer-events-none">
        
        {/* Bright glowing underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          className="absolute top-0 left-0 right-0 h-2 bg-accent"
          style={{ 
            transformOrigin: 'center',
            boxShadow: `
              0 0 10px hsl(var(--accent)),
              0 0 20px hsl(var(--accent)),
              0 0 30px hsl(var(--accent) / 0.8)
            `
          }}
        />
        
      </div>
    </div>
  );
};