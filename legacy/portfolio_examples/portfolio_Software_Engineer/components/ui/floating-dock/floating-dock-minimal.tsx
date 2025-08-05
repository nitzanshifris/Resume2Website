"use client";

import React from "react";
import { FloatingDock } from "./floating-dock-base";
import {
  IconHome,
  IconUser,
  IconMail,
} from "@tabler/icons-react";
import { FloatingDockItem } from "./floating-dock.types";

export function FloatingDockMinimalDemo() {
  const links: FloatingDockItem[] = [
    {
      title: "Home",
      icon: IconHome,
      href: "#",
    },
    {
      title: "About",
      icon: IconUser,
      href: "#",
    },
    {
      title: "Contact",
      icon: IconMail,
      href: "#",
    },
  ];

  return (
    <div className="flex items-center justify-center h-[35rem] w-full relative">
      <FloatingDock
        items={links}
        desktopClassName="absolute bottom-8"
      />
    </div>
  );
}