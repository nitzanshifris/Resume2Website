"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "./bento-grid-base";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
  IconBrandReact,
  IconBrandNodejs,
  IconCloud,
  IconPalette,
  IconCode,
  IconDeviceMobile,
  IconSearch,
} from "@tabler/icons-react";
import { motion } from "motion/react";

// Gallery-optimized Bento Grid variants with consistent sizing

const GallerySkeleton = ({ className }: { className?: string }) => (
  <div className={`flex flex-1 w-full h-full min-h-[4rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 ${className}`}></div>
);

export function BentoGridGalleryBasic() {
  const items = [
    {
      title: "Innovation",
      description: "Groundbreaking ideas and creative solutions.",
      header: <GallerySkeleton />,
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Technology",
      description: "Cutting-edge digital transformation.",
      header: <GallerySkeleton />,
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Design",
      description: "Beautiful and functional interfaces.",
      header: <GallerySkeleton />,
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Communication",
      description: "Clear and effective messaging.",
      header: <GallerySkeleton />,
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
  ];

  return (
    <BentoGrid className="max-w-2xl mx-auto md:auto-rows-[8rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}

export function BentoGridGalleryAnimated() {
  const items = [
    {
      title: "Hover Animation",
      description: "Interactive elements with smooth transitions.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[4rem] rounded-xl bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-white/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          />
          <div className="flex items-center justify-center w-full text-white font-bold">
            Hover Me
          </div>
        </div>
      ),
      icon: <IconCode className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Motion Graphics",
      description: "Fluid animations and micro-interactions.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[4rem] rounded-xl bg-gradient-to-br from-purple-200 to-purple-600 items-center justify-center">
          <motion.div
            className="w-8 h-8 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      ),
      icon: <IconPalette className="h-4 w-4 text-purple-500" />,
    },
  ];

  return (
    <BentoGrid className="max-w-2xl mx-auto md:auto-rows-[8rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className="md:col-span-1"
        />
      ))}
    </BentoGrid>
  );
}

export function BentoGridGallerySkills() {
  const items = [
    {
      title: "Frontend",
      description: "React, TypeScript, Next.js",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[4rem] rounded-xl bg-gradient-to-br from-blue-100 dark:from-blue-900/20 to-blue-200 dark:to-blue-800/20 flex-col justify-center items-center">
          <div className="text-2xl p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">⚛️</div>
        </div>
      ),
      className: "md:col-span-1",
      icon: <IconBrandReact className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Backend",
      description: "Node.js, APIs, Databases",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[4rem] rounded-xl bg-gradient-to-br from-green-100 dark:from-green-900/20 to-green-200 dark:to-green-800/20 flex-col justify-center items-center">
          <div className="text-2xl p-2 rounded-full bg-green-100 dark:bg-green-900/20">🔧</div>
        </div>
      ),
      className: "md:col-span-1",
      icon: <IconBrandNodejs className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Cloud & DevOps",
      description: "AWS, Docker, CI/CD",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[4rem] rounded-xl bg-gradient-to-br from-sky-100 dark:from-sky-900/20 to-sky-200 dark:to-sky-800/20 flex-col justify-center items-center">
          <div className="text-2xl p-2 rounded-full bg-sky-100 dark:bg-sky-900/20">☁️</div>
        </div>
      ),
      className: "md:col-span-2",
      icon: <IconCloud className="h-4 w-4 text-sky-500" />,
    },
  ];

  return (
    <BentoGrid className="max-w-2xl mx-auto md:auto-rows-[8rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

export function BentoGridGalleryServices() {
  const ServiceHeader = ({ icon, color }: { icon: string; color: string }) => (
    <div className="flex flex-1 w-full h-full min-h-[4rem] flex-col justify-center items-center p-2">
      <div className={`text-2xl mb-1 p-2 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  );

  const items = [
    {
      title: "Web Development",
      description: "Modern web applications",
      header: <ServiceHeader icon="💻" color="bg-blue-100 dark:bg-blue-900/20" />,
      className: "md:col-span-2",
      icon: <IconCode className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Mobile Apps",
      description: "Cross-platform solutions",
      header: <ServiceHeader icon="📱" color="bg-green-100 dark:bg-green-900/20" />,
      className: "md:col-span-1",
      icon: <IconDeviceMobile className="h-4 w-4 text-green-500" />,
    },
    {
      title: "SEO",
      description: "Search optimization",
      header: <ServiceHeader icon="🔍" color="bg-purple-100 dark:bg-purple-900/20" />,
      className: "md:col-span-1",
      icon: <IconSearch className="h-4 w-4 text-purple-500" />,
    },
  ];

  return (
    <BentoGrid className="max-w-2xl mx-auto md:auto-rows-[8rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}