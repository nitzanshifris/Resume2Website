# Meteors

Falling star effects with tail animations, creating a meteor shower background.

## Installation

```bash
npm install framer-motion clsx tailwind-merge
```

## Component Code

```tsx
"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number || 20).fill(true);
  return (
    <>
      {meteors.map((el, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
          style={{
            top: 0,
            left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        ></span>
      ))}
    </>
  );
};
```

## Required CSS Animation

Add this to your global CSS file:

```css
@keyframes meteor-effect {
  0% {
    transform: rotate(215deg) translateX(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(215deg) translateX(-500px);
    opacity: 0;
  }
}

.animate-meteor-effect {
  animation: meteor-effect 5s linear infinite;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| number | number | 20 | Number of meteors to display |
| className | string | undefined | Additional CSS classes to apply to each meteor |

## Usage Example

```tsx
import React from "react";
import { Meteors } from "@/components/ui/meteors";

export function MeteorsDemo() {
  return (
    <div className="">
      <div className=" w-full relative max-w-xs">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-2 w-2 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
          </div>

          <h1 className="font-bold text-xl text-white mb-4 relative z-50">
            Meteors because they&apos;re cool
          </h1>

          <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
            I don&apos;t know what to write so I&apos;ll just paste something
            cool here. One more sentence because lorem ipsum is getting boring.
          </p>

          <button className="border px-4 py-1 rounded-lg  border-gray-500 text-gray-300">
            Explore
          </button>

          {/* Meaty part - Meteor effect */}
          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
```

## CV Integration Example

```tsx
import React from "react";
import { Meteors } from "@/components/ui/meteors";

export function CVProjectCard({ 
  title, 
  description, 
  technologies,
  link,
  github 
}: { 
  title: string; 
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}) {
  return (
    <div className="w-full relative">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] rounded-full blur-3xl" />
      
      <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-6 py-8 h-full overflow-hidden rounded-2xl flex flex-col">
        <h3 className="font-bold text-xl text-white mb-2 relative z-50">
          {title}
        </h3>
        
        <p className="font-normal text-base text-slate-400 mb-4 relative z-50">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6 relative z-50">
          {technologies.map((tech) => (
            <span 
              key={tech}
              className="px-2 py-1 text-xs rounded-md bg-gray-800 text-gray-300 border border-gray-700"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3 mt-auto relative z-50">
          {link && (
            <a 
              href={link}
              className="border px-4 py-1 rounded-lg border-gray-500 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Live Demo
            </a>
          )}
          {github && (
            <a 
              href={github}
              className="border px-4 py-1 rounded-lg border-gray-500 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
        
        <Meteors number={10} />
      </div>
    </div>
  );
}
```

## CV Achievement Cards Example

```tsx
import React from "react";
import { Meteors } from "@/components/ui/meteors";

export function CVAchievementCard({ 
  title, 
  organization,
  date,
  description 
}: { 
  title: string; 
  organization: string;
  date: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-500 to-pink-500 transform scale-[0.85] rounded-full blur-3xl opacity-70" />
      
      <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-6 py-6 overflow-hidden rounded-xl">
        <div className="relative z-50">
          <h3 className="font-bold text-lg text-white mb-1">
            {title}
          </h3>
          
          <p className="text-sm text-gray-400 mb-3">
            {organization} • {date}
          </p>
          
          <p className="text-sm text-gray-300">
            {description}
          </p>
        </div>
        
        <Meteors number={15} />
      </div>
    </div>
  );
}
```

## Notes

- The meteors use the corrected rotation value of 215deg
- Each meteor has a gradient tail effect
- Random positioning and animation delays create variety
- Best used with dark backgrounds
- The animation moves meteors diagonally across the container
- Can be used inside cards or as full-page backgrounds