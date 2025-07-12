"use client";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "./canvas-reveal-effect-base";

// Gallery preview components with consistent sizing
export function CanvasRevealEffectGalleryBasic() {
  return (
    <div className="py-20 flex flex-col lg:flex-row items-center justify-center bg-white dark:bg-black w-full gap-4 mx-auto px-8 h-[32rem]">
      <Card title="Emerald Reveal" icon={<AceternityIcon />}>
        <CanvasRevealEffect
          animationSpeed={5.1}
          containerClassName="bg-emerald-900"
        />
      </Card>
      <Card title="Pink Gradient" icon={<AceternityIcon />}>
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[
            [236, 72, 153],
            [232, 121, 249],
          ]}
          dotSize={2}
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
      </Card>
      <Card title="Sky Blue" icon={<AceternityIcon />}>
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-sky-600"
          colors={[[125, 211, 252]]}
        />
      </Card>
    </div>
  );
}

export function CanvasRevealEffectGalleryColorful() {
  return (
    <div className="py-20 flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-slate-900 to-black w-full gap-4 mx-auto px-8 h-[32rem]">
      <Card title="Rainbow Effect" icon={<Icon className="h-8 w-8" />}>
        <CanvasRevealEffect
          animationSpeed={2}
          containerClassName="bg-purple-900"
          colors={[
            [255, 0, 0],
            [0, 255, 0],
            [0, 0, 255],
          ]}
          dotSize={3}
        />
      </Card>
      <Card title="Sunset Vibes" icon={<Icon className="h-8 w-8" />}>
        <CanvasRevealEffect
          animationSpeed={4}
          containerClassName="bg-orange-800"
          colors={[
            [255, 94, 77],
            [255, 157, 77],
            [255, 206, 84],
          ]}
          dotSize={2}
          showGradient={false}
        />
      </Card>
    </div>
  );
}

export function CanvasRevealEffectGalleryMinimal() {
  return (
    <div className="py-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900 w-full px-8 h-[32rem]">
      <div className="grid grid-cols-2 gap-6 max-w-4xl w-full">
        <Card title="Monochrome" icon={<Icon className="h-8 w-8" />}>
          <CanvasRevealEffect
            animationSpeed={1.5}
            containerClassName="bg-gray-800"
            colors={[[255, 255, 255]]}
            dotSize={1}
            opacities={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
          />
        </Card>
        <Card title="Dark Mode" icon={<Icon className="h-8 w-8" />}>
          <CanvasRevealEffect
            animationSpeed={0.8}
            containerClassName="bg-black"
            colors={[[100, 100, 100]]}
            dotSize={2}
          />
        </Card>
      </div>
    </div>
  );
}

export function CanvasRevealEffectGalleryPortfolio() {
  return (
    <div className="py-20 bg-white dark:bg-zinc-900 w-full px-8 h-[32rem]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            title="Projects" 
            icon={<ProjectIcon />}
            description="Explore my work"
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-blue-600"
              colors={[[59, 130, 246]]}
            />
          </Card>
          <Card 
            title="About Me" 
            icon={<AboutIcon />}
            description="Learn more"
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-green-600"
              colors={[[34, 197, 94]]}
            />
          </Card>
          <Card 
            title="Contact" 
            icon={<ContactIcon />}
            description="Get in touch"
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-purple-600"
              colors={[[147, 51, 234]]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper components
const Card = ({
  title,
  icon,
  children,
  description,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  description?: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] w-full mx-auto p-4 relative h-80"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mx-auto flex items-center justify-center">
          {icon}
        </div>
        <h2 className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4 font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          {title}
        </h2>
        {description && (
          <p className="text-sm opacity-0 group-hover/canvas-card:opacity-100 relative z-10 mt-2 group-hover/canvas-card:text-white text-gray-600 dark:text-gray-300 transition duration-200">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

const AceternityIcon = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white "
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
        style={{ mixBlendMode: "darken" }}
      />
    </svg>
  );
};

export const Icon = ({ className, ...rest }: any) => {
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

const ProjectIcon = () => (
  <svg
    className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

const AboutIcon = () => (
  <svg
    className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const ContactIcon = () => (
  <svg
    className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);