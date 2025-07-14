# Background Lines

Wave pattern animations creating dynamic flowing line effects.

## Installation

```bash
npm install framer-motion clsx tailwind-merge simplex-noise
```

## Component Code

```tsx
"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "motion/react";

export const BackgroundLines = ({
  children,
  className,
  containerClassName,
  colors,
  opacities,
  strokeWidth,
  svgOptions,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  opacities?: number[];
  strokeWidth?: number;
  svgOptions?: React.SVGProps<SVGSVGElement>;
}) => {
  return (
    <div
      className={cn(
        "h-screen w-full relative overflow-hidden bg-white dark:bg-black",
        containerClassName
      )}
    >
      <svg
        className="absolute inset-0 z-0 h-full w-full"
        {...svgOptions}
      >
        <Paths
          colors={colors}
          opacities={opacities}
          strokeWidth={strokeWidth}
        />
      </svg>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};

export const Paths = ({
  colors = ["#a5f3fc", "#22d3ee", "#0891b2", "#0e7490", "#155e75"],
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5],
  strokeWidth = 0.5,
  className,
}: {
  colors?: string[];
  opacities?: number[];
  strokeWidth?: number;
  className?: string;
}) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
    "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
    "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
    "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
    "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
    "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
    "M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787",
    "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
    "M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771",
    "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
    "M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755",
    "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
    "M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739",
    "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
    "M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723",
    "M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715",
    "M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707",
    "M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699",
    "M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691",
    "M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683",
    "M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675",
    "M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667",
    "M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659",
    "M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651",
    "M-177 -421C-177 -421 -109 -16 355 111C819 238 887 643 887 643",
    "M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635",
    "M-163 -437C-163 -437 -95 -32 369 95C833 222 901 627 901 627",
    "M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619",
    "M-149 -453C-149 -453 -81 -48 383 79C847 206 915 611 915 611",
    "M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603",
    "M-135 -469C-135 -469 -67 -64 397 63C861 190 929 595 929 595",
    "M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587",
    "M-121 -485C-121 -485 -53 -80 411 47C875 174 943 579 943 579",
    "M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571",
    "M-107 -501C-107 -501 -39 -96 425 31C889 158 957 563 957 563",
    "M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555",
    "M-93 -517C-93 -517 -25 -112 439 15C903 142 971 547 971 547",
    "M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539",
    "M-79 -533C-79 -533 -11 -128 453 -1C917 126 985 531 985 531",
    "M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523",
    "M-65 -549C-65 -549 3 -144 467 -17C931 110 999 515 999 515",
    "M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507",
    "M-51 -565C-51 -565 17 -160 481 -33C945 94 1013 499 1013 499",
    "M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491",
    "M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483",
  ];

  return (
    <motion.g className={cn("", className)}>
      {paths.map((path, index) => {
        const color = colors[index % colors.length];
        const opacity = opacities[index % opacities.length];
        return (
          <motion.path
            key={index}
            d={path}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: Math.random() * 3 + 2,
              ease: "easeInOut",
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            opacity={opacity}
          />
        );
      })}
    </motion.g>
  );
};
```

## Props

### BackgroundLines

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | undefined | Content to display over the background |
| className | string | undefined | CSS classes for the content container |
| containerClassName | string | undefined | CSS classes for the outer container |
| colors | string[] | Cyan shades | Array of colors for the lines |
| opacities | number[] | [0.3, 0.3, 0.3, 0.5, 0.5] | Array of opacity values |
| strokeWidth | number | 0.5 | Width of the SVG strokes |
| svgOptions | React.SVGProps | undefined | Additional SVG element props |

### Paths

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| colors | string[] | Cyan shades | Array of colors to cycle through |
| opacities | number[] | [0.3, 0.3, 0.3, 0.5, 0.5] | Array of opacity values |
| strokeWidth | number | 0.5 | Width of the SVG strokes |
| className | string | undefined | Additional CSS classes |

## Usage Example

```tsx
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

export function BackgroundLinesDemo() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Sanjana Airlines, <br /> Sajana Textiles.
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
        Get the best advices from our experts, including expert artists,
        painters, marathon enthusiasts and RDX, totally free.
      </p>
    </BackgroundLines>
  );
}
```

## CV Integration Example

```tsx
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

export function CVContactSection({ 
  email, 
  phone, 
  linkedin,
  github 
}: { 
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}) {
  return (
    <BackgroundLines 
      className="flex items-center justify-center w-full flex-col px-4 py-20"
      colors={["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"]}
    >
      <h2 className="text-4xl font-bold text-center mb-8 text-neutral-900 dark:text-white">
        Let's Connect
      </h2>
      
      <div className="max-w-md mx-auto space-y-4 text-center">
        <a 
          href={`mailto:${email}`}
          className="block text-lg text-blue-600 dark:text-blue-400 hover:underline"
        >
          {email}
        </a>
        
        {phone && (
          <p className="text-lg text-neutral-700 dark:text-neutral-300">
            {phone}
          </p>
        )}
        
        <div className="flex gap-4 justify-center mt-6">
          {linkedin && (
            <a 
              href={linkedin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              LinkedIn
            </a>
          )}
          
          {github && (
            <a 
              href={github}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </BackgroundLines>
  );
}
```

## Notes

- Creates animated flowing lines using SVG paths
- Each path animates independently with pathLength animation
- Customizable colors and opacities for variety
- Uses Framer Motion for smooth animations
- Perfect for hero sections or contact areas