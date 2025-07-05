"use client";
import { cn } from "../../lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./bento-grid-base";
import {
  IconBrandReact,
  IconBrandNodejs,
  IconCloud,
  IconPalette,
} from "@tabler/icons-react";

const SkillHeader = ({ icon, color }: { icon: string; color: string }) => (
  <div className="flex flex-1 w-full h-full min-h-[4rem] flex-col justify-center items-center">
    <div className={`text-2xl p-2 rounded-full ${color}`}>{icon}</div>
  </div>
);

const items = [
  {
    title: "Frontend",
    description: "React & TypeScript",
    header: <SkillHeader icon="⚛️" color="bg-blue-100 dark:bg-blue-900/20" />,
    className: "md:col-span-1",
    icon: <IconBrandReact className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Backend",
    description: "Node.js & APIs",
    header: <SkillHeader icon="🔧" color="bg-green-100 dark:bg-green-900/20" />,
    className: "md:col-span-1",
    icon: <IconBrandNodejs className="h-4 w-4 text-green-500" />,
  },
  {
    title: "Cloud & DevOps",
    description: "AWS & Docker",
    header: <SkillHeader icon="☁️" color="bg-sky-100 dark:bg-sky-900/20" />,
    className: "md:col-span-2",
    icon: <IconCloud className="h-4 w-4 text-sky-500" />,
  },
];

export function BentoGridPreviewSkills() {
  return (
    <BentoGrid className="max-w-2xl mx-auto md:auto-rows-[12rem]">
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