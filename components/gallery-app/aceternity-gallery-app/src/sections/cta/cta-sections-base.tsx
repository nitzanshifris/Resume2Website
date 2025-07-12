"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
  animate,
  stagger,
} from "motion/react";
import { BsStarFill } from "react-icons/bs";
import { HiArrowRight } from "react-icons/hi2";
import { IconMessageCircleQuestion } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function SimpleCTAWithImages() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-4 py-20 md:flex-row md:px-8">
      <div className="flex flex-col">
        <motion.h2 className="mx-auto max-w-xl text-center text-xl font-bold text-black md:mx-0 md:text-left md:text-3xl dark:text-white">
          Get realistic with <br />
          Photorealistic AI today.
        </motion.h2>
        <p className="mx-auto mt-8 max-w-md text-center text-sm text-neutral-600 md:mx-0 md:text-left md:text-base dark:text-neutral-400">
          Join the waitlist and be the first one to experience photorealism at
          scale. Get additional 50% discount on the first 100 people.
        </p>
        <FeaturedImages
          textClassName="lg:text-left text-center"
          className="items-center justify-start lg:justify-start"
          containerClassName="md:items-start"
          showStars
        />
      </div>
      <button className="group flex items-center space-x-2 rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 px-4 py-2 text-base text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]">
        <span>Book a call</span>
        <HiArrowRight className="mt-0.5 h-3 w-3 stroke-[1px] text-white transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}

export const FeaturedImages = ({
  textClassName,
  className,
  showStars = false,
  containerClassName,
}: {
  textClassName?: string;
  className?: string;
  showStars?: boolean;
  containerClassName?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  useEffect(() => {
    animate(
      ".animation-container",
      { scale: [1.1, 1, 0.9, 1], opacity: [0, 1] },
      { duration: 0.4, delay: stagger(0.1) },
    );
  }, []);
  return (
    <div
      className={cn(
        "mb-10 mt-10 flex flex-col items-center",
        containerClassName,
      )}
    >
      <div
        className={cn(
          "mb-2 flex flex-col items-center justify-center sm:flex-row",
          className,
        )}
      >
        <div className="mb-4 flex flex-row items-center sm:mb-0">
          {testimonials.map((testimonial, idx) => (
            <div
              className="group relative -mr-4"
              key={testimonial.name}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 160,
                        damping: 20,
                      },
                    }}
                    exit={{ opacity: 0, y: 20, scale: 0.6 }}
                    style={{
                      translateX: translateX,

                      whiteSpace: "nowrap",
                    }}
                    className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-xs shadow-xl"
                  >
                    <div className="absolute inset-x-0 -bottom-px z-30 mx-auto h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                    <div className="absolute inset-x-0 -bottom-px z-30 mx-auto h-px w-[70%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                    <div className="flex items-center gap-2">
                      <div className="relative z-30 text-sm font-bold text-white">
                        {testimonial.name}
                      </div>
                      <div className="rounded-sm bg-neutral-950 px-1 py-0.5 text-xs text-neutral-300">
                        {testimonial.designation}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="animation-container">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    rotate: `${Math.random() * 15 - 5}deg`,
                    scale: 1,
                    opacity: 1,
                  }}
                  whileHover={{ scale: 1.05, zIndex: 30 }}
                  transition={{ duration: 0.2 }}
                  className="relative overflow-hidden rounded-2xl border-2 border-neutral-200"
                >
                  <Image
                    onMouseMove={handleMouseMove}
                    height={100}
                    width={100}
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-14 w-14 object-cover object-top"
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        <div className="ml-6 flex justify-center">
          {[...Array(5)].map((_, index) => (
            <BsStarFill
              key={index}
              className={showStars ? "mx-1 h-4 w-4 text-yellow-400" : "hidden"}
            />
          ))}
        </div>
      </div>
      <p
        className={cn(
          "relative z-40 text-left text-sm text-neutral-400",
          textClassName,
        )}
      >
        Trusted by 27,000+ creators
      </p>
    </div>
  );
};

const testimonials = [
  {
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];

export function CTAWithBackgroundNoise() {
  return (
    <div className="w-full px-4 py-8">
      <section className="w-full grid grid-cols-1 md:grid-cols-2 relative overflow-hidden mx-auto bg-gradient-to-br from-slate-800 dark:from-neutral-900 to-gray-900 rounded-2xl">
        <div className="absolute -top-px right-10 md:right-60 bg-gradient-to-r from-transparent via-purple-500 h-px to-transparent w-1/2 z-30"></div>
        <div className="absolute -top-px right-10 md:right-40 bg-gradient-to-r from-transparent via-indigo-500 h-px to-transparent w-1/2 z-30"></div>
        <div className="absolute -top-px right-10 md:right-80 bg-gradient-to-r from-transparent via-sky-500 h-px to-transparent w-1/2 z-30"></div>
        <div
          className="absolute inset-0 w-full h-full opacity-10 bg-noise [mask-image:radial-gradient(#fff,transparent,75%)]"
          style={{
            backgroundImage: "url(/noise.webp)",
            backgroundSize: "30%",
          }}
        ></div>
        <div className="relative overflow-hidden px-6 md:px-8">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 select-none overflow-hidden rounded-2xl"
            style={{
              mask: "radial-gradient(33.875rem 33.875rem at calc(100% - 8.9375rem) 0, white 3%, transparent 70%)",
            }}
          ></div>

          <div className="relative px-0 py-10 sm:px-10 sm:pt-16 sm:pb-10 lg:px-10">
            <h2 className="text-left text-balance text-xl md:text-2xl lg:text-4xl font-semibold tracking-[-0.015em] text-white">
              Ready to try out the product?
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-sm md:text-base text-neutral-200">
              Get instant access to our state of the art project and join the
              waitlist.
            </p>

            <button className="mt-6 flex space-x-2 items-center group text-base px-4 py-2 rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]">
              <span>Join Waitlist</span>
              <HiArrowRight className="text-white group-hover:translate-x-1 stroke-[1px] h-3 w-3 mt-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
        <div className="relative h-[200px] md:h-[300px] flex gap-4 w-full overflow-hidden px-4 pb-4 md:pb-0">
          <Image
            src="https://assets.aceternity.com/pro/cta-1.jpg"
            alt="cta-1"
            width={300}
            height={500}
            className="h-full w-auto object-cover object-top rounded-lg mt-4 md:mt-0"
          />
          <Image
            src="https://assets.aceternity.com/pro/cta-2.jpg"
            alt="cta-2"
            width={300}
            height={500}
            className="h-full w-auto object-cover object-top mt-8 rounded-lg"
          />
        </div>
        <div className="absolute -bottom-px right-10 md:right-60 bg-gradient-to-r from-transparent via-purple-500 h-px to-transparent w-1/2 z-30"></div>
        <div className="absolute -bottom-px right-10 md:right-40 bg-gradient-to-r from-transparent via-indigo-500 h-px to-transparent w-1/2 z-30"></div>
        <div className="absolute -bottom-px right-10 md:right-80 bg-gradient-to-r from-transparent via-sky-500 h-px to-transparent w-1/2 z-30"></div>
      </section>
    </div>
  );
}

export function CTAWithDashedGridLines() {
  return (
    <div className="w-full px-4 py-8">
      <section className="w-full grid grid-cols-1 md:grid-cols-3 relative overflow-hidden mx-auto bg-gradient-to-br from-gray-100 to-white dark:from-neutral-900 dark:to-neutral-950 rounded-lg">
        <GridLineHorizontal className="top-0" offset="100px" />
        <GridLineHorizontal className="bottom-0 top-auto" offset="100px" />
        <GridLineVertical className="left-0" offset="40px" />
        <GridLineVertical className="left-auto right-0" offset="40px" />
        <div className="md:col-span-2 p-6 md:p-10">
          <h2 className="text-left text-neutral-500 dark:text-neutral-200 text-lg md:text-2xl tracking-tight font-medium">
            Ship products with the{" "}
            <span className="font-bold text-black dark:text-white">
              speed of light
            </span>
          </h2>
          <p className="text-left text-neutral-500 mt-4 max-w-lg dark:text-neutral-200 text-lg md:text-2xl tracking-tight font-medium">
            Get the best in class <span className="text-sky-600 dark:text-sky-400">support</span>{" "}
            for the most advanced{" "}
            <span className="text-indigo-600 dark:text-indigo-400">products</span>.
          </p>

          <div className="flex items-start sm:items-center flex-col sm:flex-row sm:gap-4">
            <button className="mt-6 flex space-x-2 items-center group text-base px-4 py-2 rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]">
              <span>Buy now</span>
              <HiArrowRight className="text-white group-hover:translate-x-1 stroke-[1px] h-3 w-3 mt-0.5 transition-transform duration-200" />
            </button>
            <button className="mt-4 sm:mt-6 flex space-x-2 items-center group text-base px-4 py-2 rounded-lg text-black dark:text-white border border-neutral-200 dark:border-neutral-800">
              <span>Talk to us</span>
              <IconMessageCircleQuestion className="text-black dark:text-white group-hover:translate-x-1 stroke-[1px] h-3 w-3 mt-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-dashed border-neutral-300 dark:border-neutral-700 p-6 md:p-10">
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            &quot;This is the best product ever when it comes to shipping. Ten on
            ten recommended. I just can&apos;t wait to see what happens with this
            product.&quot;
          </p>
          <div className="flex flex-col text-sm items-start mt-4 gap-1">
            <p className="font-bold text-neutral-800 dark:text-neutral-200">
              Michael Scarn
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Side projects builder
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "100px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute w-[calc(100%+var(--offset))] h-[var(--height)] left-[calc(var(--offset)/2*-1)]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    ></div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "40px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute h-[calc(100%+var(--offset))] w-[var(--width)] top-[calc(var(--offset)/2*-1)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    ></div>
  );
};