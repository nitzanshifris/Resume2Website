import { ReactNode } from "react";

export interface MenuItemProps {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: ReactNode;
}

export interface MenuProps {
  setActive: (item: string | null) => void;
  children: ReactNode;
}

export interface ProductItemProps {
  title: string;
  description: string;
  href: string;
  src: string;
}

export interface HoveredLinkProps {
  children: ReactNode;
  href?: string;
  [key: string]: any;
}