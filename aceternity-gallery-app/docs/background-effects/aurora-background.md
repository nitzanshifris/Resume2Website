# Aurora Background

Aurora borealis effects creating beautiful, animated northern lights backgrounds.

## Installation

```bash
npm install framer-motion clsx tailwind-merge
```

## Component Code

```tsx
"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col  h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900  text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            //   I'm sorry but this is what peak developer experience looks like
            // I'm just setting the background here so I don't have to
            // style it later
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Content to display over the aurora background |
| className | string | undefined | Additional CSS classes for the container |
| showRadialGradient | boolean | true | Whether to apply a radial gradient mask |
| ...props | HTMLDivElement props | - | All standard div element props |

## Required CSS Animation

Add this to your global CSS file:

```css
@keyframes aurora {
  from {
    background-position: 50% 50%, 50% 50%;
  }
  to {
    background-position: 350% 50%, 350% 50%;
  }
}

.animate-aurora {
  animation: aurora 60s linear infinite;
}
```

## Usage Example

```tsx
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "motion/react";

export function AuroraBackgroundDemo() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Background lights are cool you know.
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          And this, is chemical burn.
        </div>
        <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
          Debug now
        </button>
      </motion.div>
    </AuroraBackground>
  );
}
```

## CV Integration Example

```tsx
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "motion/react";

export function CVHeroWithAurora({ 
  name, 
  title, 
  tagline 
}: { 
  name: string; 
  title: string; 
  tagline: string; 
}) {
  return (
    <AuroraBackground showRadialGradient={false}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 text-center"
      >
        <h1 className="text-5xl md:text-8xl font-bold dark:text-white">
          {name}
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-light text-neutral-700 dark:text-neutral-200">
          {title}
        </h2>
        
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl">
          {tagline}
        </p>
        
        <div className="flex gap-4 mt-8">
          <button className="bg-black dark:bg-white rounded-full text-white dark:text-black px-6 py-3 font-medium hover:scale-105 transition-transform">
            View Portfolio
          </button>
          <button className="border border-black dark:border-white rounded-full px-6 py-3 font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
            Download CV
          </button>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
```

## Notes

- Creates a beautiful aurora borealis effect using CSS gradients
- Animated using CSS keyframes for smooth performance
- Includes blur and mix-blend-mode effects for realism
- Dark mode support with inverted colors
- The radial gradient mask can be toggled for different effects
- Requires the CSS animation to be added to your global styles