"use client";
import React, { useEffect, useState, useRef } from "react";
import { 
  motion, 
  useMotionValueEvent, 
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
  animate,
  stagger
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Outfit, Manrope } from "next/font/google";
import { HiArrowRight } from "react-icons/hi2";
import { BsStarFill } from "react-icons/bs";
import { IconArrowRight } from "@tabler/icons-react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import { useInView } from "motion/react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({ 
  subsets: ["latin"], 
  weight: ["400", "700"] 
});

// Hero Section With Noise Background
export function HeroSectionWithNoiseBackground() {
  return (
    <div className="relative flex w-full min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-20 md:py-40 dark:bg-black">
      <NoiseBackground />
 
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <NoiseBadge text="We raised $69M pre seed" />
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-3xl font-bold tracking-tight text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100"
        >
          Write fast with <br /> accurate precision.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mx-auto mt-4 max-w-lg text-center text-sm text-neutral-600 md:text-xl dark:text-neutral-400"
        >
          Our state of the art tool is a tool that allows you to write copy
          instantly.
        </motion.p>
 
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col items-center gap-4 md:flex-row"
        >
          <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-neutral-900 px-6 py-3 text-base font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200">
              Download for Linux
            </button>
            <button className="rounded-lg bg-rose-500 px-6 py-3 text-base font-medium text-white shadow-[0_1px_0_0_#0ea5e9,0_-1px_0_0_#0ea5e9] hover:bg-rose-600 dark:bg-rose-500 dark:shadow-[0_1px_0_0_#0369a1,0_-1px_0_0_#0369a1] dark:hover:bg-rose-600 dark:text-white">
              Download for Windows
            </button>
          </div>
        </motion.div>
 
        <div className="z-40 mt-12 flex w-full justify-center bg-white dark:bg-black">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="relative w-full overflow-hidden rounded-xl shadow-2xl [mask-image:linear-gradient(to_bottom,white,white_40%,transparent)]"
          >
            <Image
              src="https://assets.aceternity.com/linear-demo.webp"
              alt="Product screenshot"
              className="h-auto w-full object-cover"
              width={1024}
              height={576}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
 
const NoiseBadge = ({ text }: { text: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative mx-auto mb-6 flex w-fit items-center justify-center overflow-hidden rounded-full p-px"
    >
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-transparent to-blue-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ width: "300px", height: "20px" }}
      />
      <div className="relative z-10 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
        {text}
      </div>
    </motion.div>
  );
};
 
const NoiseBackground = () => {
  const [strips, setStrips] = useState<number[]>([]);
  useEffect(() => {
    const calculateStrips = () => {
      const viewportWidth = window.innerWidth;
      const stripWidth = 80;
      const numberOfStrips = Math.ceil(viewportWidth / stripWidth);
      setStrips(Array.from({ length: numberOfStrips }, (_, i) => i));
    };
    calculateStrips();
    window.addEventListener("resize", calculateStrips);
    return () => window.removeEventListener("resize", calculateStrips);
  }, []);
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 z-0 flex [mask-image:radial-gradient(circle_at_center,white_0%,white_30%,transparent_70%)]"
    >
      <Noise />
      {strips.map((index) => (
        <div
          key={index}
          className="h-full w-20 bg-gradient-to-r from-neutral-100 to-white shadow-[2px_0px_0px_0px_var(--color-neutral-400)] dark:from-neutral-900 dark:to-neutral-950 dark:shadow-[2px_0px_0px_0px_var(--color-neutral-800)]"
        />
      ))}
    </motion.div>
  );
};
 
const Noise = () => {
  return (
    <div
      className="absolute inset-0 h-full w-full scale-[1.2] transform opacity-[0.05] [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "20%",
      }}
    ></div>
  );
};

// Centered Around Testimonials Hero Section
export function CenteredAroundTestimonials() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const [movedOut, setMovedOut] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setMovedOut(parseFloat(latest.toFixed(2)) > 0.04);
  });

  const TestimonialCard = ({
    testimonial,
    direction,
    className,
  }: {
    testimonial: Testimonial;
    direction?: "left" | "right";
    className?: string;
  }) => {
    return (
      <motion.div
        layoutId={`testimonial-${testimonial.name}`}
        key={String(movedOut)}
        className={cn(
          "absolute z-20 flex items-center gap-2 rounded-md bg-white p-4 opacity-20 shadow-lg lg:opacity-100 dark:bg-neutral-800",
          className,
        )}
        animate={{
          y: movedOut ? 300 : 0,
          x: movedOut
            ? direction === "left"
              ? -400
              : direction === "right"
                ? 400
                : 0
            : 0,
          rotate: testimonial.rotate ?? 20,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <Image
          src={testimonial.src}
          alt={testimonial.name}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <h3 className="text-xs text-neutral-800 md:text-base dark:text-neutral-200">
            {testimonial.name}
          </h3>
          <p className="max-w-md text-[10px] text-neutral-600 md:text-sm dark:text-neutral-400">
            {testimonial.quote}
          </p>
        </div>
      </motion.div>
    );
  };
  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <TestimonialCard
        testimonial={testimonials[0]}
        className="-left-10 top-20"
        direction="left"
      />
      <TestimonialCard
        testimonial={testimonials[1]}
        className="-left-10 top-1/2 -translate-y-1/2"
        direction="left"
      />
      <TestimonialCard
        testimonial={testimonials[2]}
        className="-right-10 top-20"
        direction="right"
      />
      <TestimonialCard
        testimonial={testimonials[3]}
        className="-left-10 bottom-20"
        direction="left"
      />
      <TestimonialCard
        testimonial={testimonials[4]}
        className="-right-10 bottom-1/2 -translate-y-1/2"
        direction="right"
      />
      <TestimonialCard
        testimonial={testimonials[5]}
        className="-right-10 bottom-20"
        direction="right"
      />
      <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 px-4 md:px-8 dark:bg-neutral-900">
        <div className="absolute inset-0 z-30 h-full w-full bg-white opacity-80 md:opacity-0 dark:bg-neutral-900" />
        <Image
          src="https://assets.aceternity.com/pro/logos/aceternity-ui.png"
          alt="Aceternity Logo"
          width={100}
          height={100}
          className="relative z-50 aspect-square w-40 object-contain filter dark:invert"
        />
        <h1
          className={cn(
            "relative z-50 mx-auto mt-10 max-w-5xl text-center text-lg font-semibold text-neutral-700 sm:text-2xl md:text-4xl lg:text-7xl dark:text-neutral-100",
            outfit.className,
          )}
        >
          Join the biggest Image Generation Hackathon ever
        </h1>

        <form className="relative z-50 mx-auto mt-10 flex w-full max-w-xl rounded-full border border-neutral-100 bg-white px-2 py-1.5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.15)_inset] dark:border-neutral-800 dark:bg-neutral-950">
          <input
            type="text"
            placeholder="Enter your email"
            className="w-full border-none bg-transparent text-sm text-black ring-0 focus:outline-none focus:ring-0 dark:text-white"
          />
          <button className="rounded-full bg-black px-4 py-1 text-sm text-white shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset] dark:bg-white dark:text-black">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

interface Testimonial {
  src: string;
  quote: string;
  name: string;
  designation?: string;
  rotate?: number;
}

export const testimonials: Testimonial[] = [
  {
    name: "Manu Arora",
    quote: "Fantastic AI, highly recommend it.",
    src: "https://i.pravatar.cc/150?img=1",
    designation: "Tech Innovator & Entrepreneur",
    rotate: -20,
  },
  {
    name: "Tyler Durden",
    quote: "AI revolutionized my business model.",
    src: "https://i.pravatar.cc/150?img=2",
    designation: "Creative Director & Business Owner",
    rotate: -10,
  },
  {
    name: "Alice Johnson",
    quote: "Transformed the way I work!",
    src: "https://i.pravatar.cc/150?img=3",
    designation: "Senior Software Engineer",
    rotate: 20,
  },
  {
    name: "Bob Smith",
    quote: "Absolutely revolutionary, a game-changer.",
    src: "https://i.pravatar.cc/150?img=4",
    designation: "Industry Analyst",
    rotate: -10,
  },
  {
    name: "Cathy Lee",
    quote: "Improved my work efficiency and daily life.",
    src: "https://i.pravatar.cc/150?img=5",
    designation: "Product Manager",
    rotate: 10,
  },
  {
    name: "David Wright",
    quote: "It's like having a superpower!",
    src: "https://i.pravatar.cc/150?img=6",
    designation: "Research Scientist",
    rotate: 20,
  },
];

// Two Column With Image Hero Section
export function TwoColumnWithImage() {
  return (
    <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 overflow-hidden px-4 pt-20 md:gap-20 md:px-8 md:pt-40 lg:grid-cols-2">
      <div className="flex flex-col items-start">
        <h1 className="max-w-5xl bg-gradient-to-b from-neutral-800 via-neutral-600 to-neutral-600 bg-clip-text text-left text-3xl font-bold tracking-tight text-transparent md:text-5xl md:leading-tight dark:from-neutral-800 dark:via-white dark:to-white">
          Make your dashboard 10x more optimized.
        </h1>
        <p className="relative z-10 mt-2 max-w-3xl text-left text-neutral-600 md:mt-6 md:text-xl dark:text-neutral-400">
          With our expert dashboard solutions, you&apos;ll have no trouble
          tracking your leads, campaigns, and more.
        </p>
        <FeaturedImages
          textClassName="lg:text-left text-left"
          className="items-center justify-start lg:justify-start"
          showStars
        />
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
          <div className="relative z-10 my-4 flex items-center justify-start gap-4">
            <button className="group flex items-center space-x-2 rounded-2xl bg-gradient-to-b from-indigo-500 to-blue-600 px-4 py-2 text-white shadow-[0px_3px_0px_0px_rgba(255,255,255,0.1)_inset]">
              <span>Book a demo</span>{" "}
              <HiArrowRight className="mt-0.5 h-3 w-3 stroke-[1px] text-white transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
          <button className="dark:text-300 text-base font-medium text-neutral-700">
            Know more
          </button>
        </div>
      </div>
      <div>
        <div className="rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-[0px_0px_5px_1px_rgba(0,0,0,0.05)_inset] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0px_0px_5px_1px_rgba(255,255,255,0.05)_inset]">
          <Image
            src="https://assets.aceternity.com/pro/dashboard.webp"
            alt="Dashboard Image"
            width={1000}
            height={1000}
            className="rounded-2xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export const testimonialData = [
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
          {testimonialData.map((testimonial, idx) => (
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
                    style={{ translateX: translateX, whiteSpace: "nowrap" }}
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
          "relative z-40 ml-8 text-center text-sm text-neutral-400",
          textClassName,
        )}
      >
        Trusted by 27,000+ creators
      </p>
    </div>
  );
};

// Playful Hero Section
export function PlayfulHeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  return (
    <div ref={ref} className="mb-20 w-full bg-gray-50 dark:bg-neutral-800">
      <div className="mx-auto grid max-h-[50rem] max-w-7xl grid-cols-1 items-start gap-10 overflow-hidden pt-10 sm:grid-cols-2 md:max-h-[40rem] md:pt-20 lg:grid-cols-3">
        <div className="px-4 py-10 md:px-8 md:py-10 lg:col-span-2">
          <RoughNotationGroup show={isInView}>
            <h2
              className={cn(
                "text-center text-2xl font-bold tracking-tight text-neutral-900 sm:text-left sm:text-4xl lg:text-7xl dark:text-neutral-50",
                manrope.className,
              )}
            >
              Your favourite{" "}
              <RoughNotation
                type="highlight"
                animationDuration={2000}
                iterations={3}
                color="#facc1580"
                multiline
              >
                <span className="text-currentColor">productivity tool</span>
              </RoughNotation>{" "}
              is now available for{" "}
              <RoughNotation
                type="underline"
                animationDuration={2000}
                iterations={10}
                color="#facc15"
              >
                mobile
              </RoughNotation>
            </h2>
            <p className="mt-4 max-w-2xl text-center text-sm text-neutral-500 sm:text-left md:mt-10 md:text-lg dark:text-neutral-400">
              Aceternity AI bring you the best productivity tools for your
              desktop, now available on mobile. Download the app now to avail
              additional{" "}
              <RoughNotation
                type="underline"
                animationDuration={2000}
                iterations={3}
                color="#facc15"
              >
                20% discount
              </RoughNotation>{" "}
              and take your productivity to the next level.
            </p>
          </RoughNotationGroup>
          <div className="mt-10 flex flex-col items-center gap-4 [perspective:800px] sm:flex-row">
            <button className="w-full origin-left rounded-lg bg-yellow-400 px-4 py-2 text-base font-bold text-black transition duration-200 hover:shadow-lg hover:[transform:rotateX(10deg)] sm:w-auto">
              Get the app
            </button>
            <button className="rounded-lg border border-transparent px-4 py-2 text-base text-black transition duration-200 hover:border-yellow-500 dark:text-white">
              Read changelog
            </button>
          </div>
        </div>
        <div className="relative flex h-full w-full flex-shrink-0 justify-end overflow-hidden">
          <Skeleton />
        </div>
      </div>
    </div>
  );
}

const SVGDataURI =
  "data:image/svg+xml;base64,IDxzdmcKICAgICAgd2lkdGg9IjQyMSIKICAgICAgaGVpZ2h0PSI4NTIiCiAgICAgIHZpZXdCb3g9IjAgMCA0MjEgODUyIgogICAgICBmaWxsPSJub25lIgogICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgICA+CiAgICAgIDxwYXRoCiAgICAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgICAgIGNsaXAtcnVsZT0iZXZlbm9kZCIKICAgICAgICBkPSJNNzMgMEgzNDhDMzg2LjY2IDAgNDE4IDMxLjM0MDEgNDE4IDcwVjc4MkM0MTggODIwLjY2IDM4Ni42NiA4NTIgMzQ4IDg1Mkg3M0MzNC4zNDAxIDg1MiAzIDgyMC42NiAzIDc4MlY3MEMzIDMxLjM0MDEgMzQuMzQwMSAwIDczIDBaTTM0OCA2SDczQzM3LjY1MzggNiA5IDM0LjY1MzggOSA3MFY3ODJDOSA4MTcuMzQ2IDM3LjY1MzggODQ2IDczIDg0NkgzNDhDMzgzLjM0NiA4NDYgNDEyIDgxNy4zNDYgNDEyIDc4MlY3MEM0MTIgMzQuNjUzOCAzODMuMzQ2IDYgMzQ4IDZaIgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgIHg9IjMxOCIKICAgICAgICB3aWR0aD0iMTAiCiAgICAgICAgaGVpZ2h0PSI2IgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAgIGZpbGwtb3BhY2l0eT0iMC4yIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgIHg9IjkzIgogICAgICAgIHk9Ijg0NiIKICAgICAgICB3aWR0aD0iMTAiCiAgICAgICAgaGVpZ2h0PSI2IgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAgIGZpbGwtb3BhY2l0eT0iMC4yIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgIHg9IjIiCiAgICAgICAgeT0iOTAiCiAgICAgICAgd2lkdGg9IjYiCiAgICAgICAgaGVpZ2h0PSIxMCIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgICBmaWxsLW9wYWNpdHk9IjAuMiIKICAgICAgLz4KICAgICAgPHJlY3QKICAgICAgICB4PSI0MTIiCiAgICAgICAgeT0iOTAiCiAgICAgICAgd2lkdGg9IjYiCiAgICAgICAgaGVpZ2h0PSIxMCIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgICBmaWxsLW9wYWNpdHk9IjAuMiIKICAgICAgLz4KICAgICAgPHJlY3QKICAgICAgICB4PSIzIgogICAgICAgIHk9Ijc1MiIKICAgICAgICB3aWR0aD0iNiIKICAgICAgICBoZWlnaHQ9IjEwIgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAgIGZpbGwtb3BhY2l0eT0iMC4yIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgIHg9IjQxMiIKICAgICAgICB5PSI3NTIiCiAgICAgICAgd2lkdGg9IjYiCiAgICAgICAgaGVpZ2h0PSIxMCIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgICBmaWxsLW9wYWNpdHk9IjAuMiIKICAgICAgLz4KICAgICAgPHBhdGgKICAgICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICAgIGQ9Ik00MTcuOTcxIDI2Nkg0MTguOTgxQzQyMC4wOTYgMjY2IDQyMSAyNjYuODk1IDQyMSAyNjhWMzY0QzQyMSAzNjUuMTA1IDQyMC4wOTYgMzY2IDQxOC45ODEgMzY2SDQxNy45NzFWMjY2WiIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgLz4KICAgICAgPHBhdGgKICAgICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICAgIGQ9Ik0wIDMwMkMwIDMwMC44OTUgMC45MDQwMiAzMDAgMi4wMTkxOCAzMDBIMy4wMjg3OFYzNjNIMi4wMTkxOEMwLjkwNDAyIDM2MyAwIDM2Mi4xMDUgMCAzNjFWMzAyWiIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgLz4KICAgICAgPHBhdGgKICAgICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICAgIGQ9Ik0wIDIyM0MwIDIyMS44OTUgMC45MDQwMiAyMjEgMi4wMTkxOCAyMjFIMy4wMjg3OFYyODRIMi4wMTkxOEMwLjkwNDAyIDI4NCAwIDI4My4xMDUgMCAyODJWMjIzWiIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgLz4KICAgICAgPHBhdGgKICAgICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICAgIGQ9Ik0wIDE2MkMwIDE2MC44OTUgMC45MDQwMiAxNjAgMi4wMTkxOCAxNjBIMy4wMjg3OFYxOTNIMi4wMTkxOEMwLjkwNDAyIDE5MyAwIDE5Mi4xMDUgMCAxOTFWMTYyWiIKICAgICAgICBmaWxsPSJibGFjayIKICAgICAgLz4KICAgICAgPHJlY3QKICAgICAgICB4PSIxNTAiCiAgICAgICAgeT0iMzAiCiAgICAgICAgd2lkdGg9IjEyMCIKICAgICAgICBoZWlnaHQ9IjM1IgogICAgICAgIHJ4PSIxNy41IgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgIHg9IjI0NCIKICAgICAgICB5PSI0MSIKICAgICAgICB3aWR0aD0iMTMiCiAgICAgICAgaGVpZ2h0PSIxMyIKICAgICAgICByeD0iNi41IgogICAgICAgIGZpbGw9ImJsYWNrIgogICAgICAgIGZpbGwtb3BhY2l0eT0iMC4xIgogICAgICAvPgogICAgPC9zdmc+";

export const Skeleton = () => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  useEffect(() => {
    const sequence = [
      [".first", { opacity: [0, 1] }, { duration: 1, ease: "easeOut" }],
      [".second", { opacity: [0, 1] }, { duration: 1, ease: "easeOut" }],
      [
        ".images .image",
        {
          opacity: [0, 1],
          rotate: [0, Math.floor(Math.random() * 10), 0],
          scale: [1, 1.1, 1],
        },
        { duration: 1, ease: "easeOut", delay: stagger(0.4) },
      ],
    ];

    //@ts-ignore
    if (isInView) animate(sequence);
  }, [isInView]);
  return (
    <div ref={ref} className="realtive m-auto h-[600px] w-[360px] pt-20">
      <div
        style={{
          backgroundImage: `url('${SVGDataURI}')`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
        className="absolute inset-0 mx-auto h-[600px] w-full max-w-[360px] dark:invert dark:filter"
      />
      <div className="relative z-20 mt-0 flex flex-col gap-4 px-8 md:mt-10">
        <div className="first rounded-lg bg-gray-100 p-2 text-sm text-neutral-800 opacity-0 dark:bg-neutral-700 dark:text-neutral-100">
          Hey! Please show me my latest images from my latest trip.
        </div>
        <div className="second rounded-lg bg-gray-100 p-2 text-sm text-neutral-800 opacity-0 dark:bg-neutral-700 dark:text-neutral-100">
          Sure, here are the latest images from your trip to the island of deez
          nuts.
        </div>
        <div className="images grid grid-cols-2 gap-2">
          <Image
            src="https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=2992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="island 1"
            height="200"
            width="200"
            className="image h-full max-h-[100px] w-full rounded-lg object-cover opacity-0"
          />{" "}
          <Image
            src="https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=3449&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="island 1"
            height="200"
            width="200"
            className="image h-full max-h-[100px] w-full rounded-lg object-cover opacity-0"
          />
          <Image
            src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=3592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="island 1"
            height="200"
            width="200"
            className="image h-full max-h-[100px] w-full rounded-lg object-cover opacity-0"
          />{" "}
          <Image
            src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="island 1"
            height="200"
            width="200"
            className="image h-full max-h-[100px] w-full rounded-lg object-cover opacity-0"
          />
        </div>
      </div>
    </div>
  );
};

// Modern Hero With Gradients
export function ModernHeroWithGradients() {
  return (
    <div className="relative h-full min-h-[40rem] w-full bg-white dark:bg-black">
      <div className="relative z-20 mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-4">
        <ModernNavbar />
        <div className="b relative my-12 overflow-hidden rounded-3xl bg-gray-50 py-10 md:py-40 dark:bg-black">
          <TopLines />
          <BottomLines />
          <SideLines />
          <TopGradient />
          <BottomGradient />

          <div className="relative z-20 flex flex-col items-center justify-center overflow-hidden rounded-3xl p-4 md:p-12">
            <Link
              href="#"
              className="flex items-center gap-1 rounded-full border border-[#404040] bg-gradient-to-b from-[#5B5B5D] to-[#262627] px-4 py-1 text-center text-sm text-white"
            >
              <span>Flexible Plans for You</span>
              <IconArrowRight className="h-4 w-4 text-white" />
            </Link>
            <h1 className="bg-gradient-to-b from-black to-neutral-600 bg-clip-text py-4 text-center text-2xl text-transparent md:text-4xl lg:text-7xl dark:from-white dark:to-[#999]">
              Deploy your website <br /> in seconds, not hours
            </h1>
            <p className="mx-auto max-w-2xl py-4 text-center text-base text-neutral-600 md:text-lg dark:text-neutral-300">
              With our state of the art, cutting edge, we are so back kinda
              hosting services, you can deploy your website in seconds.
            </p>
            <div className="flex flex-col items-center gap-4 py-4 sm:flex-row">
              <Link
                href="#"
                className="w-40 gap-1 rounded-full border border-[#404040] bg-gradient-to-b from-[#5B5B5D] to-[#262627] px-4 py-2 text-center text-sm text-white"
              >
                Start a project
              </Link>
              <Link
                href="#"
                className="w-40 gap-1 rounded-full border border-transparent bg-neutral-100 px-4 py-2 text-center text-sm text-black dark:bg-white"
              >
                Book a call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ModernNavbar = () => {
  const links = [
    { label: "Home", href: "#" },
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Blog", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "About Us", href: "#" },
  ];
  return (
    <nav className="flex items-center justify-between">
      <Logo />
      <div className="hidden items-center gap-6 rounded-full border border-neutral-100 bg-neutral-100 px-4 py-3 lg:flex dark:border-neutral-800 dark:bg-neutral-900">
        {links.map((link, idx) => (
          <Link
            key={link.href + idx}
            href={link.href}
            className="text-sm font-medium text-neutral-700 transition duration-200 hover:opacity-80 dark:text-neutral-200"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Link
        href="#"
        className="text-sm font-medium text-neutral-700 transition duration-200 hover:opacity-80 dark:text-neutral-200"
      >
        Login
      </Link>
    </nav>
  );
};

const TopLines = () => {
  return (
    <svg
      width="166"
      height="298"
      viewBox="0 0 166 298"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute inset-x-0 top-0 aspect-square h-[100px] w-full md:h-[200px]"
    >
      <line
        y1="-0.5"
        x2="406"
        y2="-0.5"
        transform="matrix(0 1 1 0 1 -108)"
        stroke="url(#paint0_linear_254_143)"
      />
      <line
        y1="-0.5"
        x2="406"
        y2="-0.5"
        transform="matrix(0 1 1 0 34 -108)"
        stroke="url(#paint1_linear_254_143)"
      />
      <line
        y1="-0.5"
        x2="406"
        y2="-0.5"
        transform="matrix(0 1 1 0 67 -108)"
        stroke="url(#paint2_linear_254_143)"
      />
      <line
        y1="-0.5"
        x2="406"
        y2="-0.5"
        transform="matrix(0 1 1 0 100 -108)"
        stroke="url(#paint3_linear_254_143)"
      />
      <line
        y1="-0.5"
        x2="406"
        y2="-0.5"
        transform="matrix(0 1 1 0 133 -108)"
        stroke="url(#paint4_linear_254_143)"
      />
      <line
        y1="-0.5"
        x2="406"
        y2="-0.5"
        transform="matrix(0 1 1 0 166 -108)"
        stroke="url(#paint5_linear_254_143)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_254_143"
          x1="-7.42412e-06"
          y1="0.500009"
          x2="405"
          y2="0.500009"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_254_143"
          x1="-7.42412e-06"
          y1="0.500009"
          x2="405"
          y2="0.500009"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_254_143"
          x1="-7.42412e-06"
          y1="0.500009"
          x2="405"
          y2="0.500009"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_254_143"
          x1="-7.42412e-06"
          y1="0.500009"
          x2="405"
          y2="0.500009"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_254_143"
          x1="-7.42412e-06"
          y1="0.500009"
          x2="405"
          y2="0.500009"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_254_143"
          x1="-7.42412e-06"
          y1="0.500009"
          x2="405"
          y2="0.500009"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const BottomLines = () => {
  return (
    <svg
      width="445"
      height="418"
      viewBox="0 0 445 418"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute inset-x-0 -bottom-20 z-20 aspect-square h-[150px] w-full md:h-[300px]"
    >
      <line
        x1="139.5"
        y1="418"
        x2="139.5"
        y2="12"
        stroke="url(#paint0_linear_0_1)"
      />
      <line
        x1="172.5"
        y1="418"
        x2="172.5"
        y2="12"
        stroke="url(#paint1_linear_0_1)"
      />
      <line
        x1="205.5"
        y1="418"
        x2="205.5"
        y2="12"
        stroke="url(#paint2_linear_0_1)"
      />
      <line
        x1="238.5"
        y1="418"
        x2="238.5"
        y2="12"
        stroke="url(#paint3_linear_0_1)"
      />
      <line
        x1="271.5"
        y1="418"
        x2="271.5"
        y2="12"
        stroke="url(#paint4_linear_0_1)"
      />
      <line
        x1="304.5"
        y1="418"
        x2="304.5"
        y2="12"
        stroke="url(#paint5_linear_0_1)"
      />
      <path
        d="M1 149L109.028 235.894C112.804 238.931 115 243.515 115 248.361V417"
        stroke="url(#paint6_linear_0_1)"
        strokeOpacity="0.1"
        strokeWidth="1.5"
      />
      <path
        d="M444 149L335.972 235.894C332.196 238.931 330 243.515 330 248.361V417"
        stroke="url(#paint7_linear_0_1)"
        strokeOpacity="0.1"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient
          id="paint0_linear_0_1"
          x1="140.5"
          y1="418"
          x2="140.5"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_0_1"
          x1="173.5"
          y1="418"
          x2="173.5"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_0_1"
          x1="206.5"
          y1="418"
          x2="206.5"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_0_1"
          x1="239.5"
          y1="418"
          x2="239.5"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_0_1"
          x1="272.5"
          y1="418"
          x2="272.5"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_0_1"
          x1="305.5"
          y1="418"
          x2="305.5"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_0_1"
          x1="115"
          y1="390.591"
          x2="-59.1703"
          y2="205.673"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.481613" stopColor="#F8F8F8" />
          <stop offset="1" stopColor="#F8F8F8" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_0_1"
          x1="330"
          y1="390.591"
          x2="504.17"
          y2="205.673"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.481613" stopColor="#F8F8F8" />
          <stop offset="1" stopColor="#F8F8F8" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const SideLines = () => {
  return (
    <svg
      width="1382"
      height="370"
      viewBox="0 0 1382 370"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    >
      <path
        d="M268 115L181.106 6.97176C178.069 3.19599 173.485 1 168.639 1H0"
        stroke="url(#paint0_linear_337_46)"
        strokeOpacity="0.1"
        strokeWidth="1.5"
      />
      <path
        d="M1114 115L1200.89 6.97176C1203.93 3.19599 1208.52 1 1213.36 1H1382"
        stroke="url(#paint1_linear_337_46)"
        strokeOpacity="0.1"
        strokeWidth="1.5"
      />
      <path
        d="M268 255L181.106 363.028C178.069 366.804 173.485 369 168.639 369H0"
        stroke="url(#paint2_linear_337_46)"
        strokeOpacity="0.1"
        strokeWidth="1.5"
      />
      <path
        d="M1114 255L1200.89 363.028C1203.93 366.804 1208.52 369 1213.36 369H1382"
        stroke="url(#paint3_linear_337_46)"
        strokeOpacity="0.1"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient
          id="paint0_linear_337_46"
          x1="26.4087"
          y1="1.00001"
          x2="211.327"
          y2="175.17"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.481613" stopColor="#F8F8F8" />
          <stop offset="1" stopColor="#F8F8F8" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_337_46"
          x1="1355.59"
          y1="1.00001"
          x2="1170.67"
          y2="175.17"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.481613" stopColor="#F8F8F8" />
          <stop offset="1" stopColor="#F8F8F8" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_337_46"
          x1="26.4087"
          y1="369"
          x2="211.327"
          y2="194.83"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.481613" stopColor="#F8F8F8" />
          <stop offset="1" stopColor="#F8F8F8" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_337_46"
          x1="1355.59"
          y1="369"
          x2="1170.67"
          y2="194.83"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.481613" stopColor="#F8F8F8" />
          <stop offset="1" stopColor="#F8F8F8" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const Logo = () => {
  return (
    <svg
      width="40"
      height="39"
      viewBox="0 0 40 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 object-contain invert filter dark:invert-0"
    >
      <path
        d="M23.0384 38H14.4499L23.0384 16.0387H30.4115L39 38H30.4115L26.6844 27.2581L23.0384 38Z"
        fill="url(#paint0_linear_254_127)"
      />
      <path
        d="M10.5608 38H1L14.936 1H25.226L29.1962 12.2989H20.2836L10.5608 38Z"
        fill="url(#paint1_linear_254_127)"
      />
      <path
        d="M23.0384 38H14.4499L23.0384 16.0387H30.4115L39 38H30.4115L26.6844 27.2581L23.0384 38Z"
        stroke="url(#paint2_linear_254_127)"
      />
      <path
        d="M10.5608 38H1L14.936 1H25.226L29.1962 12.2989H20.2836L10.5608 38Z"
        stroke="url(#paint3_linear_254_127)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_254_127"
          x1="5.27928"
          y1="4.36364"
          x2="31.5269"
          y2="52.4504"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ECF9FD" />
          <stop offset="1" stopColor="#AAD3E9" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_254_127"
          x1="5.27928"
          y1="4.36364"
          x2="31.5269"
          y2="52.4504"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ECF9FD" />
          <stop offset="1" stopColor="#AAD3E9" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_254_127"
          x1="8.27241"
          y1="32.7052"
          x2="32.6629"
          y2="18.9511"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.5" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_254_127"
          x1="8.27241"
          y1="32.7052"
          x2="32.6629"
          y2="18.9511"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.5" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const BottomGradient = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="551"
      height="295"
      viewBox="0 0 551 295"
      fill="none"
      className={cn(
        "pointer-events-none absolute -right-80 bottom-0 hidden h-full w-full dark:block",
        className,
      )}
    >
      <path
        d="M118.499 0H532.468L635.375 38.6161L665 194.625L562.093 346H0L24.9473 121.254L118.499 0Z"
        fill="url(#paint0_radial_254_132)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_254_132"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(412.5 346) rotate(-91.153) scale(397.581 423.744)"
        >
          <stop stopColor="#253E9D" />
          <stop offset="0.25" stopColor="#1B3390" />
          <stop offset="0.573634" stopColor="#0C0D2F" />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const TopGradient = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="807"
      height="797"
      viewBox="0 0 807 797"
      fill="none"
      className={cn(
        "pointer-events-none absolute -left-96 top-0 hidden h-full w-full dark:block",
        className,
      )}
    >
      <path
        d="M807 110.119L699.5 -117.546L8.5 -154L-141 246.994L-7 952L127 782.111L279 652.114L513 453.337L807 110.119Z"
        fill="url(#paint0_radial_254_135)"
      />
      <path
        d="M807 110.119L699.5 -117.546L8.5 -154L-141 246.994L-7 952L127 782.111L279 652.114L513 453.337L807 110.119Z"
        fill="url(#paint1_radial_254_135)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_254_135"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(77.0001 15.8894) rotate(90.3625) scale(869.41 413.353)"
        >
          <stop stopColor="#23268F" />
          <stop offset="0.25" stopColor="#1A266B" />
          <stop offset="0.573634" stopColor="#0C0C36" />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_254_135"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(127.5 -31) rotate(1.98106) scale(679.906 715.987)"
        >
          <stop stopColor="#2E459F" />
          <stop offset="0.283363" stopColor="#1C379B" />
          <stop offset="0.573634" stopColor="#0D0D33" />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

// Full Background Image With Text
export function FullBackgroundImageWithText({
  gradientFade = true,
}: {
  gradientFade?: boolean;
}) {
  const logos = [
    {
      name: "Aceternity UI",
      image: "https://assets.aceternity.com/pro/logos/aceternity-ui.png",
    },
    {
      name: "Gamity",
      image: "https://assets.aceternity.com/pro/logos/gamity.png",
    },
    {
      name: "Host it",
      image: "https://assets.aceternity.com/pro/logos/hostit.png",
    },
    {
      name: "Asteroid Kit",
      image: "https://assets.aceternity.com/pro/logos/asteroid-kit.png",
    },
  ];
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-10">
      <div className="absolute inset-0 h-full w-full bg-black"></div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 0.3] }}
        transition={{ duration: 2 }}
        className="absolute inset-0 h-full w-full"
      >
        <BlurImage
          src="https://assets.aceternity.com/pro/image-background.jpg"
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full select-none object-cover",
            gradientFade &&
              "[mask-image:radial-gradient(200px_at_center,transparent,black)]",
          )}
          width={1000}
          height={1000}
          alt="header"
        />
        <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-black to-transparent"></div>
      </motion.div>
      <h1 className="relative z-10 max-w-5xl text-balance bg-gradient-to-b from-neutral-400 via-white to-white bg-clip-text text-center text-3xl font-medium tracking-tight text-transparent md:text-7xl md:leading-tight">
        The best community for <br />
        Indie Hackers
      </h1>
      <p className="relative z-10 mt-2 max-w-2xl text-center text-neutral-200 md:mt-6 md:text-xl">
        We&apos;re building a community of indie hackers to help each other
        succeed. Get in touch with us to join the community.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <BackgroundButton as={Link} href="#" variant="secondary">
          Join Community
        </BackgroundButton>
        <BackgroundButton as={Link} href="#" variant="simple" target="_blank">
          Add your product
        </BackgroundButton>
      </div>
      <div className="relative z-10 mt-10 flex flex-wrap justify-center gap-10">
        {logos.map((logo) => (
          <BlurImage
            key={logo.name}
            src={logo.image}
            width={100}
            height={100}
            alt={logo.name}
            className="w-24 object-contain invert filter md:w-40"
          />
        ))}
      </div>
    </div>
  );
}

const BackgroundButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType | any;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "simple";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "no-underline flex space-x-2 group cursor-pointer relative border-none transition duration-200 rounded-full p-px text-xs font-semibold leading-6 px-4 py-2";

  const variantStyles = {
    primary:
      "w-full sm:w-44 h-10 rounded-lg text-sm text-center items-center justify-center relative z-20 bg-black  text-white",
    secondary:
      "relative z-20 text-sm bg-white  text-black  w-full sm:w-44 h-10  flex items-center justify-center rounded-lg hover:-translate-y-0.5 ",
    simple:
      "relative z-20 text-sm bg-transparent  text-white  w-full sm:w-44 h-10  flex items-center justify-center rounded-lg hover:-translate-y-0.5 ",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

const BlurImage = (props: React.ComponentProps<typeof Image>) => {
  const [isLoading, setLoading] = useState(true);

  const { src, width, height, alt, layout, ...rest } = props;
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "opacity-0" : "opacity-100",
        props.className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={src as string}
      layout={layout}
      alt={alt ? alt : "Avatar"}
      {...rest}
    />
  );
};

// Floating Cards 3D Hero
export function FloatingCards3DHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now() / 1000);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const cards = [
    {
      id: 1,
      title: "Lightning Fast",
      description: "Process millions of data points in real-time",
      icon: "⚡",
      gradient: "from-violet-600 to-indigo-600",
      shadowColor: "rgba(124, 58, 237, 0.5)",
      position: { x: -600, y: -250, z: 150 },
      rotation: { x: 15, y: -25, z: 10 },
    },
    {
      id: 2,
      title: "AI Powered",
      description: "Machine learning algorithms that adapt to your needs",
      icon: "🧠",
      gradient: "from-cyan-600 to-blue-600",
      shadowColor: "rgba(6, 182, 212, 0.5)",
      position: { x: 600, y: -250, z: 200 },
      rotation: { x: -20, y: 25, z: -5 },
    },
    {
      id: 3,
      title: "Global Scale",
      description: "Deploy across multiple regions seamlessly",
      icon: "🌍",
      gradient: "from-emerald-600 to-teal-600",
      shadowColor: "rgba(16, 185, 129, 0.5)",
      position: { x: -650, y: 0, z: 100 },
      rotation: { x: 20, y: -15, z: 15 },
    },
    {
      id: 4,
      title: "Bank-Level Security",
      description: "End-to-end encryption and compliance",
      icon: "🔐",
      gradient: "from-rose-600 to-pink-600",
      shadowColor: "rgba(244, 63, 94, 0.5)",
      position: { x: 650, y: 0, z: 180 },
      rotation: { x: -15, y: 20, z: -10 },
    },
    {
      id: 5,
      title: "24/7 Support",
      description: "Expert assistance whenever you need it",
      icon: "🛟",
      gradient: "from-amber-600 to-orange-600",
      shadowColor: "rgba(245, 158, 11, 0.5)",
      position: { x: -600, y: 250, z: 120 },
      rotation: { x: 10, y: -10, z: 5 },
    },
    {
      id: 6,
      title: "Smart Analytics",
      description: "Insights that drive business growth",
      icon: "📈",
      gradient: "from-purple-600 to-fuchsia-600",
      shadowColor: "rgba(147, 51, 234, 0.5)",
      position: { x: 600, y: 250, z: 160 },
      rotation: { x: -10, y: 10, z: -5 },
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[120vh] w-full items-center justify-center overflow-hidden bg-black py-20"
    >
      {/* Dynamic gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-purple-600/30 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-1/4 right-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/30 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]"
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {/* Particle effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
            initial={{
              x: Math.random() * 2000 - 1000,
              y: Math.random() * 2000 - 1000,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, -50],
              opacity: [0, 1, 0],
              scale: [null, Math.random() * 1.5 + 0.5],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
            style={{
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-30 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
            </span>
            Trusted by 10,000+ companies worldwide
          </motion.div>

          <h1 className="mb-8 text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
            <span className="block">Experience the</span>
            <span className="block mt-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Next Generation
            </span>
            <span className="block mt-3">of Data Intelligence</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-400 md:text-xl">
            Harness the power of AI-driven analytics, real-time processing, and 
            intelligent automation to transform your business into a data powerhouse.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full px-10 font-medium text-white transition-all"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all group-hover:scale-110 group-hover:blur-md" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600" />
              <span className="relative flex items-center gap-2">
                Start Free Trial
                <HiArrowRight className="transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-10 font-medium text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              See Live Demo
            </motion.button>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              SOC 2 Certified
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              GDPR Compliant
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              99.9% Uptime
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating 3D Cards */}
      <div className="absolute inset-0 pointer-events-none" style={{ perspective: "2000px" }}>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="absolute left-1/2 top-1/2"
            initial={{
              opacity: 0,
              scale: 0,
              x: card.position.x - 26,
              y: card.position.y - 26,
              rotateX: card.rotation.x,
              rotateY: card.rotation.y,
              rotateZ: card.rotation.z,
            }}
            animate={{
              opacity: hoveredCard === card.id ? 1 : 0.85,
              scale: hoveredCard === card.id ? 1.08 : 1,
              x: card.position.x + mousePosition.x * 20 - 26,
              y: card.position.y + mousePosition.y * 20 - 26 + Math.sin(time + index * 2) * 8,
              rotateX: card.rotation.x + mousePosition.y * 2,
              rotateY: card.rotation.y + mousePosition.x * 2,
              rotateZ: card.rotation.z,
              z: hoveredCard === card.id ? 100 : 0,
            }}
            transition={{
              delay: index * 0.1,
              duration: 0.8,
              scale: { type: "spring", stiffness: 200, damping: 20 },
              x: { type: "spring", stiffness: 50, damping: 20 },
              y: { type: "spring", stiffness: 50, damping: 20 },
              rotateX: { type: "spring", stiffness: 50, damping: 20 },
              rotateY: { type: "spring", stiffness: 50, damping: 20 },
            }}
            style={{
              transformStyle: "preserve-3d",
              zIndex: hoveredCard === card.id ? 1000 : card.position.z,
            }}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <motion.div
              className="group relative h-52 w-52 cursor-pointer pointer-events-auto"
              animate={{
                rotateY: hoveredCard === card.id ? [0, 360] : 0,
              }}
              transition={{
                duration: 20,
                repeat: hoveredCard === card.id ? Infinity : 0,
                ease: "linear",
              }}
              whileHover={{
                translateY: -10,
              }}
            >
              {/* Card glow effect */}
              <div
                className="absolute -inset-6 rounded-3xl opacity-60 blur-2xl transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${card.gradient.split(' ')[1]} 0%, ${card.gradient.split(' ')[3]} 100%)`,
                  boxShadow: hoveredCard === card.id ? `0 0 100px ${card.shadowColor}` : `0 0 50px ${card.shadowColor}`,
                }}
              />
              
              {/* Card background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/90 backdrop-blur-xl" />
              
              {/* Animated border gradient */}
              <motion.div 
                className="absolute inset-0 rounded-3xl bg-gradient-to-r opacity-70" 
                style={{
                  backgroundImage: `linear-gradient(135deg, ${card.gradient.split(' ')[1]} 0%, ${card.gradient.split(' ')[3]} 100%)`,
                }}
                animate={{
                  opacity: hoveredCard === card.id ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-[2px] rounded-3xl bg-gray-900/95" />
              </motion.div>
              
              {/* Glass overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 via-white/5 to-transparent" />
              
              {/* Card content */}
              <div className="relative flex h-full flex-col items-center justify-center p-5 text-center">
                <motion.div
                  animate={{
                    scale: hoveredCard === card.id ? [1, 1.2, 1] : 1,
                    rotate: hoveredCard === card.id ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: hoveredCard === card.id ? Infinity : 0,
                  }}
                  className="relative mb-4"
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${card.gradient} text-3xl shadow-lg`}>
                    {card.icon}
                  </div>
                  {hoveredCard === card.id && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        background: `radial-gradient(circle, ${card.shadowColor} 0%, transparent 70%)`,
                      }}
                    />
                  )}
                </motion.div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  {card.description}
                </p>
                
                {/* Progress indicator */}
                <motion.div
                  className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCard === card.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={`h-full bg-gradient-to-r ${card.gradient}`}
                    initial={{ x: "-100%" }}
                    animate={{ x: hoveredCard === card.id ? "0%" : "-100%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </motion.div>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
                }}
                animate={hoveredCard === card.id ? {
                  x: ["-100%", "200%"],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: hoveredCard === card.id ? Infinity : 0,
                  repeatDelay: 1,
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent" />
    </div>
  );
}

// Export all additional hero sections
export default {
  HeroSectionWithNoiseBackground,
  CenteredAroundTestimonials,
  TwoColumnWithImage,
  PlayfulHeroSection,
  ModernHeroWithGradients,
  FullBackgroundImageWithText,
  FloatingCards3DHero,
};