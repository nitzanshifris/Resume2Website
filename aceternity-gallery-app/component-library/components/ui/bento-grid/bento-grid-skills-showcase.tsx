"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./bento-grid-base";
import {
  IconBrandReact,
  IconBrandNodejs,
  IconBrandPython,
  IconBrandDocker,
  IconCloud,
  IconDatabase,
} from "@tabler/icons-react";
import { motion } from "motion/react";

const SkillCard = ({ skill, color }: { skill: string; color: string }) => (
  <div className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
    {skill}
  </div>
);

const ReactSkillHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] flex-col justify-center items-center p-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="text-4xl text-blue-500 mb-2"
    >
      ⚛️
    </motion.div>
    <div className="flex flex-wrap gap-2 justify-center">
      <SkillCard skill="Hooks" color="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" />
      <SkillCard skill="Context" color="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" />
      <SkillCard skill="Redux" color="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300" />
    </div>
  </div>
);

const BackendSkillHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] flex-col justify-center items-center p-4">
    <div className="text-4xl text-green-500 mb-2">🔧</div>
    <div className="flex flex-wrap gap-2 justify-center">
      <SkillCard skill="APIs" color="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" />
      <SkillCard skill="MongoDB" color="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" />
      <SkillCard skill="Express" color="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300" />
    </div>
  </div>
);

const CloudSkillHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] flex-col justify-center items-center p-4">
    <motion.div
      animate={{ y: [-5, 5, -5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="text-4xl text-sky-500 mb-2"
    >
      ☁️
    </motion.div>
    <div className="flex flex-wrap gap-2 justify-center">
      <SkillCard skill="AWS" color="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300" />
      <SkillCard skill="Docker" color="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" />
      <SkillCard skill="K8s" color="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" />
    </div>
  </div>
);

const DesignSkillHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] flex-col justify-center items-center p-4">
    <div className="text-4xl text-pink-500 mb-2">🎨</div>
    <div className="flex flex-wrap gap-2 justify-center">
      <SkillCard skill="Figma" color="bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300" />
      <SkillCard skill="UI/UX" color="bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300" />
      <SkillCard skill="Design Systems" color="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300" />
    </div>
  </div>
);

const items = [
  {
    title: "Frontend Development",
    description: "Building modern, responsive user interfaces with React and TypeScript",
    header: <ReactSkillHeader />,
    className: "md:col-span-2",
    icon: <IconBrandReact className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Backend Development",
    description: "Creating robust APIs and server-side applications",
    header: <BackendSkillHeader />,
    className: "md:col-span-1",
    icon: <IconBrandNodejs className="h-4 w-4 text-green-500" />,
  },
  {
    title: "Cloud & DevOps",
    description: "Deploying and scaling applications in the cloud",
    header: <CloudSkillHeader />,
    className: "md:col-span-1",
    icon: <IconCloud className="h-4 w-4 text-sky-500" />,
  },
  {
    title: "Design & User Experience",
    description: "Creating beautiful and intuitive user experiences",
    header: <DesignSkillHeader />,
    className: "md:col-span-2",
    icon: <IconDatabase className="h-4 w-4 text-pink-500" />,
  },
];

export function BentoGridSkillsShowcase() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
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