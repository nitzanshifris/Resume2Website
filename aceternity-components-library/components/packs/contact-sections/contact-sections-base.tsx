"use client";
import React from "react";
import { IconMailFilled, IconBrandGithub, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

export function ContactFormGridWithDetails() {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:px-6 md:py-20 lg:grid-cols-2">
      <div className="relative flex flex-col items-center overflow-hidden lg:items-start">
        <div className="flex items-start justify-start">
          <FeatureIconContainer className="flex items-center justify-center overflow-hidden">
            <IconMailFilled className="h-6 w-6 text-blue-500" />
          </FeatureIconContainer>
        </div>
        <h2 className="mt-9 text-left text-xl font-bold text-white md:text-3xl lg:text-5xl">
          Contact us
        </h2>
        <p className="mt-8 max-w-lg text-center text-base text-neutral-400 md:text-left">
          We are always looking for ways to improve our products and services.
          Contact us and let us know how we can help you.
        </p>

        <div className="mt-10 hidden flex-col items-center gap-4 md:flex-row lg:flex">
          <p className="text-sm text-neutral-400">
            contact@yoursaas.ai
          </p>

          <div className="h-1 w-1 rounded-full bg-neutral-400" />
          <p className="text-sm text-neutral-400">
            +1 (800) 123 XX21
          </p>
          <div className="h-1 w-1 rounded-full bg-neutral-400" />

          <p className="text-sm text-neutral-400">
            support@yoursaas.ai
          </p>
        </div>
        <div className="div relative mt-20 flex w-[600px] flex-shrink-0 -translate-x-10 items-center justify-center [perspective:800px] [transform-style:preserve-3d] sm:-translate-x-0 lg:-translate-x-32">
          <Pin className="top-0 right-1" />

          <Image
            src="/world.svg"
            width={500}
            height={500}
            alt="world map"
            className="[transform:rotateX(45deg)_translateZ(0px)] invert filter"
          />
        </div>
      </div>
      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-start gap-4 overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-4 sm:p-10">
        <Grid size={20} />
        <div className="relative z-20 mb-4 w-full">
          <label
            className="mb-2 inline-block text-sm font-medium text-neutral-300"
            htmlFor="name"
          >
            Full name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Manu Arora"
            className="shadow-input h-10 w-full rounded-md border border-neutral-800 bg-neutral-800 pl-4 text-sm text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800 focus:outline-none active:outline-none"
          />
        </div>
        <div className="relative z-20 mb-4 w-full">
          <label
            className="mb-2 inline-block text-sm font-medium text-neutral-300"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="support@aceternity.com"
            className="shadow-input h-10 w-full rounded-md border border-neutral-800 bg-neutral-800 pl-4 text-sm text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800 focus:outline-none active:outline-none"
          />
        </div>
        <div className="relative z-20 mb-4 w-full">
          <label
            className="mb-2 inline-block text-sm font-medium text-neutral-300"
            htmlFor="company"
          >
            Company
          </label>
          <input
            id="company"
            type="text"
            placeholder="Aceternity Labs LLC"
            className="shadow-input h-10 w-full rounded-md border border-neutral-800 bg-neutral-800 pl-4 text-sm text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800 focus:outline-none active:outline-none"
          />
        </div>
        <div className="relative z-20 mb-4 w-full">
          <label
            className="mb-2 inline-block text-sm font-medium text-neutral-300"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder="Type your message here"
            className="shadow-input w-full rounded-md border border-neutral-800 bg-neutral-800 pt-4 pl-4 text-sm text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800 focus:outline-none active:outline-none"
          />
        </div>
        <button className="relative z-10 flex items-center justify-center rounded-md border border-transparent bg-neutral-700 px-4 py-2 text-sm font-medium text-white shadow-[0px_1px_0px_0px_#FFFFFF20_inset] transition duration-200 hover:bg-neutral-600 md:text-sm">
          Submit
        </button>
      </div>
    </div>
  );
}

const Pin = ({ className }: { className?: string }) => {
  return (
    <motion.div
      style={{ transform: "translateZ(1px)" }}
      className={cn(
        "pointer-events-none absolute z-[60] flex h-40 w-96 items-center justify-center opacity-100 transition duration-500",
        className,
      )}
    >
      <div className="h-full w-full">
        <div className="absolute inset-x-0 top-0 z-20 mx-auto inline-block w-fit rounded-lg bg-neutral-800 px-2 py-1 text-xs font-normal text-white">
          We are here
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/90 to-blue-400/0 transition-opacity duration-500"></span>
        </div>

        <div
          style={{
            perspective: "800px",
            transform: "rotateX(70deg) translateZ(0px)",
          }}
          className="absolute left-1/2 top-8 -translate-x-1/2"
        >
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
              }}
              transition={{ duration: 6, repeat: Infinity, delay: 0 }}
              className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.2] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
              }}
              transition={{ duration: 6, repeat: Infinity, delay: 2 }}
              className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.2] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.5, 0],
                scale: 1,
              }}
              transition={{ duration: 6, repeat: Infinity, delay: 4 }}
              className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.2] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            ></motion.div>
          </>
        </div>

        <>
          <motion.div className="absolute left-1/2 top-0 h-20 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-blue-500 blur-[2px]" />
          <motion.div className="absolute left-1/2 top-0 h-20 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-blue-500" />
          <motion.div className="absolute left-1/2 top-[76px] z-40 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-blue-600 blur-[3px]" />
          <motion.div className="absolute left-1/2 top-[77px] z-40 h-[2px] w-[2px] -translate-x-1/2 rounded-full bg-blue-300" />
        </>
      </div>
    </motion.div>
  );
};

export const FeatureIconContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative h-14 w-14 rounded-md bg-gradient-to-b from-neutral-800 to-neutral-950 p-[4px]",
        className,
      )}
    >
      <div
        className={cn(
          "relative z-20 h-full w-full rounded-[5px] bg-neutral-800",
          className,
        )}
      >
        {children}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-30 mx-auto h-4 w-full rounded-full bg-neutral-600 opacity-50 blur-lg"></div>
      <div className="absolute inset-x-0 bottom-0 mx-auto h-px w-[60%] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 mx-auto h-px w-[60%] bg-gradient-to-r from-transparent via-blue-600 to-transparent dark:h-[8px] dark:blur-sm"></div>
    </div>
  );
};

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [7, 3],
    [9, 2],
    [8, 5],
    [10, 1],
    [9, 4],
  ];
  return (
    <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-100/30 to-zinc-100/30 opacity-10 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full fill-white/50 stroke-white/50 mix-blend-overlay"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any, idx: number) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${idx}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

export function SimpleCenteredContactForm() {
  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    console.log(target);
  };

  const socials = [
    {
      title: "twitter",
      href: "https://twitter.com/mannupaaji",
      icon: (
        <IconBrandX className="h-5 w-5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" />
      ),
    },
    {
      title: "github",
      href: "https://github.com/manuarora700",
      icon: (
        <IconBrandGithub className="h-5 w-5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" />
      ),
    },
    {
      title: "linkedin",
      href: "https://linkedin.com/manuarora28",
      icon: (
        <IconBrandLinkedin className="h-5 w-5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" />
      ),
    },
  ];

  return (
    <div className="w-full flex items-center justify-center py-10">
      <div className="flex relative px-4 z-20 items-center w-full justify-center">
        <div className="mx-auto w-full max-w-lg bg-neutral-100 dark:bg-neutral-950 px-4 md:px-10 py-8 shadow-input rounded-3xl">
          <div>
            <h1 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-black dark:text-white">
              Contact Us
            </h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400  text-sm max-w-sm">
              Please reach out to us and we will get back to you at the speed of
              light.
            </p>
          </div>

          <div className="py-10">
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-400"
                >
                  Full Name
                </label>

                <div className="mt-2">
                  <input
                    id="name"
                    type="name"
                    placeholder="Manu Arora"
                    className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5  shadow-input text-black placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 dark:text-white"
                  />
                </div>

                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-400"
                >
                  Email address
                </label>

                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    placeholder="hello@johndoe.com"
                    className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5  shadow-input text-black placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 dark:text-white"
                  />
                </div>

                <label
                  htmlFor="company"
                  className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-400"
                >
                  Company
                </label>

                <div className="mt-2">
                  <input
                    id="company"
                    type="company"
                    placeholder="Aceternity Labs, LLC"
                    className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5  shadow-input text-black placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 dark:text-white"
                  />
                </div>

                <label
                  htmlFor="message"
                  className="block text-sm font-medium leading-6 text-neutral-700 dark:text-neutral-400"
                >
                  message
                </label>

                <div className="mt-2">
                  <textarea
                    rows={5}
                    id="message"
                    placeholder="Enter your message here"
                    className="block w-full bg-white dark:bg-neutral-900 px-4 rounded-md border-0 py-1.5  shadow-input text-black placeholder:text-gray-400 focus:ring-2 focus:ring-neutral-400 focus:outline-none sm:text-sm sm:leading-6 dark:text-white"
                  />
                </div>

                <div>
                  <button className="bg-black relative z-10 hover:bg-black/90  text-white text-sm md:text-sm transition font-medium duration-200  rounded-full px-4 py-2  flex items-center justify-center w-full dark:text-black dark:bg-white dark:hover:bg-neutral-100 dark:hover:shadow-xl">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 py-4">
            {socials.map((social) => (
              <Link href={social.href} key={social.title}>
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}