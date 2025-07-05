import { ReactNode } from "react";
import { TablerIcon } from "@tabler/icons-react";

export interface FloatingDockItem {
  title: string;
  icon: TablerIcon | React.FC<{ className?: string }>;
  href: string;
}

export interface FloatingDockProps {
  items?: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export interface FloatingDockDesktopProps {
  items?: FloatingDockItem[];
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export interface FloatingDockMobileProps {
  items: FloatingDockItem[];
  className?: string;
}

export interface IconContainerProps {
  icon: TablerIcon | React.FC<{ className?: string }>;
  className?: string;
}