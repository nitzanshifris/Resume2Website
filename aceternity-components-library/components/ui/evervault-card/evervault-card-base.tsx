"use client";

import { useMotionValue } from "motion/react";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "motion/react";
import { cn } from "../../lib/utils";
import type { EvervaultCardProps, CardPatternProps, IconProps } from "./evervault-card.types";

export const EvervaultCard = ({
  text,
  className,
}: EvervaultCardProps) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(1500);
    setRandomString(str);
  }

  return (
    <div
      className={cn(
        "p-0.5 bg-transparent aspect-square flex items-center justify-center w-full h-full relative",
        className
      )}
    >
      <div
        onMouseMove={onMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full"
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          randomString={randomString}
          isHovered={isHovered}
        />
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-44 w-44 rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
            <span className="dark:text-white text-black z-20">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, randomString, isHovered }: CardPatternProps) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl [mask-image:linear-gradient(white,transparent)]"></div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-blue-700 backdrop-blur-xl transition duration-500"
        style={style}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl mix-blend-overlay"
        style={style}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <p className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const Icon = ({ className, ...rest }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};