"use client";
import { cn } from "../../lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./bento-grid-base";
import {
  IconBrandGithub,
  IconExternalLink,
  IconCode,
  IconPalette,
  IconRocket,
  IconShoppingCart,
} from "@tabler/icons-react";
import { motion } from "motion/react";

const ProjectImage = ({ gradient, icon }: { gradient: string; icon: string }) => (
  <div className={`flex flex-1 w-full h-full min-h-[6rem] rounded-lg ${gradient} flex-col justify-center items-center`}>
    <div className="text-4xl mb-2">{icon}</div>
    <div className="flex gap-2">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
      >
        <IconBrandGithub className="h-4 w-4 text-white" />
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
      >
        <IconExternalLink className="h-4 w-4 text-white" />
      </motion.div>
    </div>
  </div>
);

const TechStack = ({ technologies }: { technologies: string[] }) => (
  <div className="flex flex-wrap gap-1 mt-2">
    {technologies.map((tech, index) => (
      <span
        key={index}
        className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300"
      >
        {tech}
      </span>
    ))}
  </div>
);

const EcommerceHeader = () => (
  <ProjectImage
    gradient="bg-gradient-to-br from-purple-500 to-pink-500"
    icon="🛒"
  />
);

const PortfolioHeader = () => (
  <ProjectImage
    gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
    icon="💼"
  />
);

const DashboardHeader = () => (
  <ProjectImage
    gradient="bg-gradient-to-br from-green-500 to-emerald-500"
    icon="📊"
  />
);

const AppHeader = () => (
  <ProjectImage
    gradient="bg-gradient-to-br from-orange-500 to-red-500"
    icon="📱"
  />
);

const WebsiteHeader = () => (
  <ProjectImage
    gradient="bg-gradient-to-br from-indigo-500 to-purple-500"
    icon="🌐"
  />
);

const items = [
  {
    title: "E-commerce Platform",
    description: (
      <div>
        <span className="text-sm">Full-stack online store with payment integration and admin dashboard</span>
        <TechStack technologies={["React", "Node.js", "MongoDB", "Stripe"]} />
      </div>
    ),
    header: <EcommerceHeader />,
    className: "md:col-span-2",
    icon: <IconShoppingCart className="h-4 w-4 text-purple-500" />,
  },
  {
    title: "Portfolio Website",
    description: (
      <div>
        <span className="text-sm">Modern portfolio with animations and responsive design</span>
        <TechStack technologies={["Next.js", "Tailwind", "Framer Motion"]} />
      </div>
    ),
    header: <PortfolioHeader />,
    className: "md:col-span-1",
    icon: <IconPalette className="h-4 w-4 text-blue-500" />,
  },
  {
    title: "Analytics Dashboard",
    description: (
      <div>
        <span className="text-sm">Real-time data visualization and reporting platform</span>
        <TechStack technologies={["Vue.js", "D3.js", "Python", "PostgreSQL"]} />
      </div>
    ),
    header: <DashboardHeader />,
    className: "md:col-span-1",
    icon: <IconCode className="h-4 w-4 text-green-500" />,
  },
  {
    title: "Mobile Application",
    description: (
      <div>
        <span className="text-sm">Cross-platform mobile app with offline capabilities</span>
        <TechStack technologies={["React Native", "Firebase", "Redux"]} />
      </div>
    ),
    header: <AppHeader />,
    className: "md:col-span-1",
    icon: <IconRocket className="h-4 w-4 text-orange-500" />,
  },
  {
    title: "Corporate Website",
    description: (
      <div>
        <span className="text-sm">Enterprise website with CMS integration and SEO optimization</span>
        <TechStack technologies={["WordPress", "PHP", "MySQL"]} />
      </div>
    ),
    header: <WebsiteHeader />,
    className: "md:col-span-1",
    icon: <IconExternalLink className="h-4 w-4 text-indigo-500" />,
  },
];

export function BentoGridProjectsShowcase() {
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