import { ReactElement, ReactNode } from "react";
import { ComponentProps } from "react";
import { motion } from "motion/react";

export interface Links {
  label: string;
  href: string;
  icon: ReactElement | ReactNode;
}

export interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

export interface SidebarProviderProps {
  children: ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}

export interface SidebarProps {
  children: ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}

export interface SidebarBodyProps extends ComponentProps<typeof motion.div> {}

export interface DesktopSidebarProps extends ComponentProps<typeof motion.div> {
  className?: string;
  children?: ReactNode;
}

export interface MobileSidebarProps extends ComponentProps<"div"> {
  className?: string;
  children?: ReactNode;
}

export interface SidebarLinkProps {
  link: Links;
  className?: string;
}