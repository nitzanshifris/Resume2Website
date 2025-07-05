#!/bin/bash

# Fix import issues in generated project
PROJECT_PATH="../apps/backend/generated_projects/a34301fc-731b-48ef-93cd-55ffb67ba5cd"

echo "Fixing import issues in generated project..."

# Check if Timeline component exists
if [ ! -f "$PROJECT_PATH/components/ui/timeline/timeline.tsx" ]; then
    echo "Timeline component missing, copying from template..."
    cp -r ../apps/backend/templates/cv2web-react-template/components/ui/timeline "$PROJECT_PATH/components/ui/"
fi

# Check if BackgroundGradient component exists
if [ ! -f "$PROJECT_PATH/components/ui/background-gradient/background-gradient.tsx" ]; then
    echo "BackgroundGradient component missing, copying from template..."
    cp -r ../apps/backend/templates/cv2web-react-template/components/ui/background-gradient "$PROJECT_PATH/components/ui/"
fi

# Check if FloatingNavbar component exists  
if [ ! -f "$PROJECT_PATH/components/ui/floating-navbar/index.tsx" ] || [ ! -s "$PROJECT_PATH/components/ui/floating-navbar/index.tsx" ]; then
    echo "FloatingNavbar component missing or empty, creating..."
    mkdir -p "$PROJECT_PATH/components/ui/floating-navbar"
    cat > "$PROJECT_PATH/components/ui/floating-navbar/index.tsx" << 'EOF'
"use client";
import React from "react";
import { motion } from "framer-motion";
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
  return (
    <motion.div
      initial={{
        opacity: 1,
        y: -100,
      }}
      animate={{
        y: 0,
        opacity: 1,
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
  );
};
EOF
fi

# Fix the import in the Timeline component export
if [ -f "$PROJECT_PATH/components/ui/timeline/index.tsx" ]; then
    echo "Checking Timeline index.tsx exports..."
    if ! grep -q "export.*from.*timeline" "$PROJECT_PATH/components/ui/timeline/index.tsx"; then
        echo 'export * from "./timeline";' > "$PROJECT_PATH/components/ui/timeline/index.tsx"
    fi
fi

echo "Done! Please restart your Next.js dev server."