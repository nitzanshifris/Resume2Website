"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Note: This component is optimized for and looks best in dark mode.
 */

export function BackgroundWithFullVideo() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Background />
      <VideoContent />
    </div>
  );
}

const Background = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden dark:opacity-20"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover dark:[mask-image:radial-gradient(circle_at_center,white,transparent)]"
      >
        <source
          src="https://assets.aceternity.com/background-demo.mp4"
          type="video/mp4"
        />
      </video>
    </motion.div>
  );
};

const VideoContent = () => {
  return (
    <div className="relative z-10">
      <div className="pointer-events-none absolute inset-0 h-full w-full rounded-full bg-black blur-2xl"></div>
      <h1 className="z-2 relative text-center font-sans text-2xl font-bold text-white md:text-5xl lg:text-7xl">
        The best <ColourfulText text="components" /> <br /> you will ever find
      </h1>
    </div>
  );
};

export function ColourfulText({ text }: { text: string }) {
  const colors = [
    "rgb(131, 179, 32)",
    "rgb(47, 195, 106)",
    "rgb(42, 169, 210)",
    "rgb(4, 112, 202)",
    "rgb(107, 10, 255)",
    "rgb(183, 0, 218)",
    "rgb(218, 0, 171)",
    "rgb(230, 64, 92)",
    "rgb(232, 98, 63)",
    "rgb(249, 129, 47)",
  ];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return text.split("").map((char, index) => (
    <motion.span
      key={`${char}-${count}-${index}`}
      initial={{
        y: 0,
      }}
      animate={{
        color: currentColors[index % currentColors.length],
        y: [0, -3, 0],
        scale: [1, 1.01, 1],
        filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      className="inline-block whitespace-pre font-sans tracking-tight"
    >
      {char}
    </motion.span>
  ));
}

export function BackgroundLines() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <LinesContent />
      <ShootingStars
        minSpeed={10}
        maxSpeed={30}
        minDelay={300}
        maxDelay={1000}
        starColor="#9E00FF"
        trailColor="#2EB9DF"
        starWidth={10}
        starHeight={1}
      />
      <Circles />
    </div>
  );
}

const Circles = () => {
  return (
    <div className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0 m-auto h-80 w-80 rounded-full bg-gradient-to-b from-neutral-300 to-transparent to-[40%] dark:from-neutral-700"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 m-auto h-[24rem] w-[24rem] rounded-full bg-gradient-to-b from-neutral-200 to-transparent to-[40%] dark:from-neutral-800"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
          delay: 0.3,
          repeatDelay: 2,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 m-auto h-[28rem] w-[28rem] rounded-full bg-gradient-to-b from-neutral-100 to-transparent to-[40%] dark:from-neutral-900"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
          delay: 0.6,
          repeatDelay: 2,
        }}
      />
    </div>
  );
};

const LinesContent = () => {
  return (
    <div className="relative z-10">
      <h1 className="text-balance mx-auto max-w-2xl text-center text-3xl font-bold text-black dark:text-white md:text-5xl">
        Web apps that make you feel like you&apos;re in the future
      </h1>
      <p className="text-balance mx-auto mt-4 max-w-2xl text-center text-base text-neutral-800 dark:text-neutral-200">
        We are a team of developers who are passionate about creating web apps
        that make you feel like you&apos;re in the future.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button className="w-40 rounded-lg bg-gradient-to-b from-neutral-950 to-neutral-800 px-4 py-2 text-sm text-white">
          Sign up
        </button>
        <button className="w-40 rounded-lg bg-gradient-to-b from-neutral-100 to-neutral-50 px-4 py-2 text-sm text-black">
          Register now
        </button>
      </div>
    </div>
  );
};

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const offset = Math.random() * window.innerWidth;

  switch (side) {
    case 0:
      return { x: offset, y: 0, angle: 45 };
    case 1:
      return { x: window.innerWidth, y: offset, angle: 135 };
    case 2:
      return { x: offset, y: window.innerHeight, angle: 225 };
    case 3:
      return { x: 0, y: offset, angle: 315 };
    default:
      return { x: 0, y: 0, angle: 45 };
  }
};
export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  className,
}) => {
  const [star, setStar] = useState<ShootingStar | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar: ShootingStar = {
        id: Date.now(),
        x,
        y,
        angle,
        scale: 1,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      };
      setStar(newStar);

      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(createStar, randomDelay);
    };

    createStar();

    return () => {};
  }, [minSpeed, maxSpeed, minDelay, maxDelay]);

  useEffect(() => {
    const moveStar = () => {
      if (star) {
        setStar((prevStar) => {
          if (!prevStar) return null;
          const newX =
            prevStar.x +
            prevStar.speed * Math.cos((prevStar.angle * Math.PI) / 180);
          const newY =
            prevStar.y +
            prevStar.speed * Math.sin((prevStar.angle * Math.PI) / 180);
          const newDistance = prevStar.distance + prevStar.speed;
          const newScale = 1 + newDistance / 100;
          if (
            newX < -20 ||
            newX > window.innerWidth + 20 ||
            newY < -20 ||
            newY > window.innerHeight + 20
          ) {
            return null;
          }
          return {
            ...prevStar,
            x: newX,
            y: newY,
            distance: newDistance,
            scale: newScale,
          };
        });
      }
    };

    const animationFrame = requestAnimationFrame(moveStar);
    return () => cancelAnimationFrame(animationFrame);
  }, [star]);

  return (
    <svg
      ref={svgRef}
      className={cn("absolute inset-0 h-full w-full", className)}
    >
      {star && (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill="url(#gradient)"
          transform={`rotate(${star.angle}, ${
            star.x + (starWidth * star.scale) / 2
          }, ${star.y + starHeight / 2})`}
        />
      )}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop
            offset="100%"
            style={{ stopColor: starColor, stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
    </svg>
  );
};

export function BackgroundDots() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden rounded-lg bg-background p-20">
      <div className="absolute inset-0 h-full w-full bg-white dark:bg-black dark:bg-dot-white/[0.2] bg-dot-black/[0.2]"></div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <DotsContent />
    </div>
  );
}

const DotsContent = () => {
  return (
    <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent dark:from-neutral-200 dark:to-neutral-300 sm:text-7xl">
      Radial Gradient
    </p>
  );
};

export function BackgroundNoiseGrid() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white dark:bg-black">
      <NoiseBackground />

      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
          Instant copywriting with our <br /> state of the art tool.
        </h2>
      </div>
    </div>
  );
}

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
    <div className="absolute inset-0 z-0 flex">
      <Noise />
      {strips.map((index) => (
        <div
          key={index}
          className="h-full w-20 bg-gradient-to-r from-neutral-100 to-white shadow-[2px_0px_0px_0px_var(--color-neutral-400)] dark:from-neutral-900 dark:to-neutral-950 dark:shadow-[2px_0px_0px_0px_var(--color-neutral-800)]"
        />
      ))}
    </div>
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

export function BackgroundDotsMasked() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <DotsMaskedBackground />
      <DotsMaskedContent />
    </div>
  );
}

const DotsMaskedContent = () => {
  return (
    <div className="relative z-10">
      <h1 className="text-balance mx-auto max-w-2xl text-center text-3xl font-bold text-black dark:text-white md:text-5xl">
        Web apps that make you feel like you&apos;re in the future
      </h1>
      <p className="text-balance mx-auto mt-4 max-w-2xl text-center text-base text-neutral-800 dark:text-neutral-200">
        We are a team of developers who are passionate about creating web apps
        that make you feel like you&apos;re in the future.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button className="w-40 rounded-lg bg-gradient-to-b from-neutral-950 to-neutral-800 px-4 py-2 text-sm text-white">
          Sign up
        </button>
        <button className="w-40 rounded-lg bg-gradient-to-b from-neutral-100 to-neutral-50 px-4 py-2 text-sm text-black">
          Register now
        </button>
      </div>
    </div>
  );
};

const DotsMaskedBackground = () => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full",
        "bg-[radial-gradient(circle_at_0.5px_0.5px,rgba(0,0,0,0.3)_0.5px,transparent_0)]",
        "dark:bg-[radial-gradient(circle_at_0.5px_0.5px,rgba(255,255,255,0.3)_0.5px,transparent_0)]",
        "[mask-image:radial-gradient(circle_at_center,white,transparent)]",
        "bg-repeat",
        "[background-size:8px_8px]",
      )}
    />
  );
};

export function BackgroundDotsMaskedVertical() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <DotsMaskedVerticalBackground />
      <DotsMaskedVerticalContent />
    </div>
  );
}

const DotsMaskedVerticalContent = () => {
  return (
    <div className="relative z-10">
      <h1 className="text-balance mx-auto max-w-2xl text-center text-3xl font-bold text-black dark:text-white md:text-5xl">
        Web apps that make you feel like you&apos;re in the future
      </h1>
      <p className="text-balance mx-auto mt-4 max-w-2xl text-center text-base text-neutral-800 dark:text-neutral-200">
        We are a team of developers who are passionate about creating web apps
        that make you feel like you&apos;re in the future.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button className="w-40 rounded-lg bg-gradient-to-b from-neutral-950 to-neutral-800 px-4 py-2 text-sm text-white">
          Sign up
        </button>
        <button className="w-40 rounded-lg bg-gradient-to-b from-neutral-100 to-neutral-50 px-4 py-2 text-sm text-black">
          Register now
        </button>
      </div>
    </div>
  );
};

const DotsMaskedVerticalBackground = () => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full",
        "bg-[radial-gradient(circle_at_0.5px_0.5px,rgba(0,0,0,0.3)_0.5px,transparent_0)]",
        "dark:bg-[radial-gradient(circle_at_0.5px_0.5px,rgba(255,255,255,0.3)_0.5px,transparent_0)]",
        "[mask-image:linear-gradient(to_bottom,white,transparent)]",
        "bg-repeat",
        "[background-size:8px_8px]",
      )}
    />
  );
};

export function BackgroundWithSkewedRectangles() {
  return (
    <div className="flex h-screen flex-col items-center justify-center border-b border-neutral-100 dark:border-neutral-800">
      <SkewedRectanglesBackground />
      <SkewedRectanglesContent />
    </div>
  );
}

const SkewedRectanglesContent = () => {
  return (
    <div className="relative z-10">
      <h1 className="text-balance mx-auto max-w-2xl text-center text-3xl font-bold text-black dark:text-white md:text-5xl">
        Web apps that make you feel like you&apos;re in the future
      </h1>
      <p className="text-balance mx-auto mt-4 max-w-2xl text-center text-base text-neutral-800 dark:text-neutral-200">
        We are a team of developers who are passionate about creating web apps
        that make you feel like you&apos;re in the future.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button className="w-40 rounded-lg bg-gradient-to-b from-neutral-950 to-neutral-800 px-4 py-2 text-sm text-white">
          Sign up
        </button>
        <button className="w-40 rounded-lg bg-gradient-to-b from-neutral-100 to-neutral-50 px-4 py-2 text-sm text-black">
          Register now
        </button>
      </div>
    </div>
  );
};

const SkewedRectanglesBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden [perspective:1000px] [transform-style:preserve-3d]">
      <Rectangles
        style={{ transform: "rotateX(45deg)" }}
        className="[mask-image:linear-gradient(to_top,white,transparent)]"
      />
      <Rectangles
        style={{ transform: "rotateX(-45deg)" }}
        className="[mask-image:linear-gradient(to_bottom,white,transparent)]"
      />
    </div>
  );
};

const Rectangles = ({
  className,
  ...props
}: {
  className?: string;
  style?: React.CSSProperties;
}) => {
  const rectangleSVGLight = `<svg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'><rect width='40' height='40' x='0' y='0' stroke='rgba(0,0,0,0.1)' fill='none' /></svg>`;
  const rectangleSVGDark = `<svg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'><rect width='40' height='40' x='0' y='0' stroke='rgba(255,255,255,0.15)' fill='none' /></svg>`;
  const encodedRectangleSVGLight = encodeURIComponent(rectangleSVGLight);
  const encodedRectangleSVGDark = encodeURIComponent(rectangleSVGDark);
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden",
        className,
      )}
      {...props}
    >
      <div
        className={cn("h-full w-full dark:hidden")}
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodedRectangleSVGLight}")`,
          backgroundSize: "40px 40px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className={cn("hidden h-full w-full dark:block")}
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodedRectangleSVGDark}")`,
          backgroundSize: "40px 40px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
};

export function BackgroundWithSkewedLines() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <SkewedLinesBackground />
      <SkewedLinesContent />
    </div>
  );
}

const SkewedLinesContent = () => {
  return (
    <div className="relative z-10">
      <h1 className="text-balance mx-auto max-w-2xl text-center text-3xl font-bold text-black dark:text-white md:text-5xl">
        Web apps that make you feel like you&apos;re in the future
      </h1>
      <p className="text-balance mx-auto mt-4 max-w-2xl text-center text-base text-neutral-800 dark:text-neutral-200">
        We are a team of developers who are passionate about creating web apps
        that make you feel like you&apos;re in the future.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button className="w-40 rounded-lg bg-gradient-to-b from-neutral-950 to-neutral-800 px-4 py-2 text-sm text-white">
          Sign up
        </button>
        <button className="w-40 rounded-lg bg-gradient-to-b from-neutral-100 to-neutral-50 px-4 py-2 text-sm text-black">
          Register now
        </button>
      </div>
    </div>
  );
};

const SkewedLinesBackground = () => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent,white)]",
      )}
    >
      <svg
        className="absolute h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="skewed-lines"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-10,30 L30,-10 M-20,40 L40,-20 M-10,50 L50,-10"
              className="stroke-neutral-800/20 dark:stroke-neutral-200/20"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#skewed-lines)" />
      </svg>
    </div>
  );
};