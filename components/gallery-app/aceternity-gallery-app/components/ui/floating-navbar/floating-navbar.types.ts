import { ReactElement } from "react";

export interface NavItem {
  name: string;
  link: string;
  icon?: ReactElement;
}

export interface FloatingNavbarProps {
  navItems?: NavItem[];
  className?: string;
  containerClassName?: string;
}