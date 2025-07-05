"use client";
import { cn } from "../../lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./bento-grid-base";
import {
  IconCode,
  IconPalette,
  IconCloud,
  IconDeviceMobile,
  IconSearch,
} from "@tabler/icons-react";
import { motion } from "motion/react";

const ServiceHeader = ({ icon, color, features }: { icon: string; color: string; features: string[] }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] flex-col justify-center items-center p-4">
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`text-4xl mb-3 p-3 rounded-full ${color}`}
    >
      {icon}
    </motion.div>
    <div className="flex flex-wrap gap-1 justify-center">
      {features.map((feature, index) => (
        <div
          key={index}
          className="px-2 py-1 text-xs bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-full text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
        >
          {feature}
        </div>
      ))}
    </div>
  </div>
);

const items = [
  {
    title: "Web Development",
    description: "Custom web applications built with modern frameworks and best practices for scalability and performance",
    header: (
      <ServiceHeader
        icon="💻"
        color="bg-blue-100 dark:bg-blue-900/20"
        features={["React", "Next.js", "TypeScript", "Responsive"]}
      />
    ),
    className: "md:col-span-2",
    icon: <IconCode className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "UI/UX Design",
    description: "Beautiful and intuitive user interfaces that provide exceptional user experiences",
    header: (
      <ServiceHeader
        icon="🎨"
        color="bg-pink-100 dark:bg-pink-900/20"
        features={["Figma", "Prototyping", "User Research"]}
      />
    ),
    className: "md:col-span-1",
    icon: <IconPalette className="h-4 w-4 text-pink-500" />,
  },
  {
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and deployment strategies for modern applications",
    header: (
      <ServiceHeader
        icon="☁️"
        color="bg-sky-100 dark:bg-sky-900/20"
        features={["AWS", "Docker", "CI/CD", "Monitoring"]}
      />
    ),
    className: "md:col-span-1",
    icon: <IconCloud className="h-4 w-4 text-sky-500" />,
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile applications that work seamlessly on iOS and Android devices",
    header: (
      <ServiceHeader
        icon="📱"
        color="bg-green-100 dark:bg-green-900/20"
        features={["React Native", "Flutter", "Native APIs"]}
      />
    ),
    className: "md:col-span-1",
    icon: <IconDeviceMobile className="h-4 w-4 text-green-500" />,
  },
  {
    title: "SEO Optimization",
    description: "Search engine optimization strategies to improve your website's visibility and ranking",
    header: (
      <ServiceHeader
        icon="🔍"
        color="bg-purple-100 dark:bg-purple-900/20"
        features={["Technical SEO", "Content Strategy", "Analytics"]}
      />
    ),
    className: "md:col-span-1",
    icon: <IconSearch className="h-4 w-4 text-purple-500" />,
  },
];

export function BentoGridServicesShowcase() {
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