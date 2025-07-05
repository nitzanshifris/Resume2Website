"use client";

import React from "react";
import { FloatingDock } from "./floating-dock-base";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import { FloatingDockItem } from "./floating-dock.types";

export function FloatingDockStandardDemo() {
  const links: FloatingDockItem[] = [
    {
      title: "Home",
      icon: IconHome,
      href: "#",
    },
    {
      title: "Products",
      icon: IconTerminal2,
      href: "#",
    },
    {
      title: "Components",
      icon: IconNewSection,
      href: "#",
    },
    {
      title: "Changelog",
      icon: IconExchange,
      href: "#",
    },
    {
      title: "Twitter",
      icon: IconBrandX,
      href: "#",
    },
    {
      title: "GitHub",
      icon: IconBrandGithub,
      href: "#",
    },
  ];

  return (
    <div className="flex items-center justify-center h-[35rem] w-full">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for your use case
        items={links}
      />
    </div>
  );
}