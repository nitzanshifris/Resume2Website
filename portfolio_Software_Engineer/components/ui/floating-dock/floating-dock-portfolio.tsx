"use client";

import React from "react";
import { FloatingDock } from "./floating-dock-base";
import {
  IconBriefcase,
  IconUser,
  IconMail,
  IconBrandGithub,
  IconBrandLinkedin,
  IconFileText,
} from "@tabler/icons-react";
import { FloatingDockItem } from "./floating-dock.types";

export function FloatingDockPortfolioDemo() {
  const links: FloatingDockItem[] = [
    {
      title: "About",
      icon: IconUser,
      href: "#about",
    },
    {
      title: "Projects",
      icon: IconBriefcase,
      href: "#projects",
    },
    {
      title: "Resume",
      icon: IconFileText,
      href: "#resume",
    },
    {
      title: "Contact",
      icon: IconMail,
      href: "#contact",
    },
    {
      title: "GitHub",
      icon: IconBrandGithub,
      href: "https://github.com",
    },
    {
      title: "LinkedIn",
      icon: IconBrandLinkedin,
      href: "https://linkedin.com",
    },
  ];

  return (
    <div className="flex items-center justify-center h-[35rem] w-full relative">
      <FloatingDock
        items={links}
        desktopClassName="absolute bottom-4 left-1/2 -translate-x-1/2"
        mobileClassName="absolute bottom-4 right-4"
      />
    </div>
  );
}