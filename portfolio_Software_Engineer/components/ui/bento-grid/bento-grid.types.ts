import { ReactNode } from "react";

export interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export interface BentoGridItemProps {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface BentoGridItemData {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  header: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}

export interface SkillItem {
  name: string;
  description: string;
  icon: React.ReactNode;
  level?: string;
  category?: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  pricing?: string;
}