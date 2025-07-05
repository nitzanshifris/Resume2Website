import { ReactNode } from "react";

export interface Tab {
  title: string;
  value: string;
  content?: string | ReactNode | any;
}

export interface TabsProps {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}

export interface FadeInDivProps {
  className?: string;
  key?: string;
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}