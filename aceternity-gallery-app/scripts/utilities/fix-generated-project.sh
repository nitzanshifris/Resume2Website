#!/bin/bash

# Fix the generated project components
PROJECT_PATH="../apps/backend/generated_projects/a34301fc-731b-48ef-93cd-55ffb67ba5cd"
COMPONENT_LIB_PATH="../apps/backend/component-library/components/ui"

echo "Fixing Timeline component..."
if [ ! -f "$PROJECT_PATH/components/ui/timeline/index.tsx" ]; then
    echo "Creating Timeline index.tsx..."
    mkdir -p "$PROJECT_PATH/components/ui/timeline"
    
    # Export from timeline.tsx
    echo 'export * from "./timeline";' > "$PROJECT_PATH/components/ui/timeline/index.tsx"
fi

echo "Fixing BackgroundGradient component..."
if [ ! -f "$PROJECT_PATH/components/ui/background-gradient/index.tsx" ]; then
    echo "Creating BackgroundGradient index.tsx..."
    mkdir -p "$PROJECT_PATH/components/ui/background-gradient"
    
    # Export from background-gradient.tsx
    echo 'export * from "./background-gradient";' > "$PROJECT_PATH/components/ui/background-gradient/index.tsx"
fi

echo "Fixing FloatingNavbar component..."
if [ ! -f "$PROJECT_PATH/components/ui/floating-navbar/index.tsx" ] || [ ! -s "$PROJECT_PATH/components/ui/floating-navbar/index.tsx" ]; then
    echo "Creating FloatingNavbar component..."
    mkdir -p "$PROJECT_PATH/components/ui/floating-navbar"
    
    # Create a complete FloatingNavbar component
    cat > "$PROJECT_PATH/components/ui/floating-navbar/index.tsx" << 'EOF'
"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const FloatingNavbar = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export const FloatingNav = FloatingNavbar;
EOF
fi

# Also check if we need to copy missing component files from component library
echo "Checking for missing component files..."

# Copy Timeline variants if missing
if [ -d "$COMPONENT_LIB_PATH/timeline" ] && [ ! -f "$PROJECT_PATH/components/ui/timeline/timeline-base.tsx" ]; then
    echo "Copying Timeline variants from component library..."
    cp -r "$COMPONENT_LIB_PATH/timeline/"*.tsx "$PROJECT_PATH/components/ui/timeline/" 2>/dev/null || true
fi

# Copy BackgroundGradient variants if missing
if [ -d "$COMPONENT_LIB_PATH/background-gradient" ] && [ ! -f "$PROJECT_PATH/components/ui/background-gradient/background-gradient-base.tsx" ]; then
    echo "Copying BackgroundGradient variants from component library..."
    cp -r "$COMPONENT_LIB_PATH/background-gradient/"*.tsx "$PROJECT_PATH/components/ui/background-gradient/" 2>/dev/null || true
fi

echo "Done! The components should now be properly imported."
echo "The Next.js dev server should automatically reload with the changes."