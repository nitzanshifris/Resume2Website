"use client";
import React from "react";
import { FloatingNavbar } from "./floating-navbar-base";
import type { FloatingNavbarProps } from "./floating-navbar.types";

export const FloatingNavbarMinimal = ({
  navItems = [
    {
      name: "Features",
      link: "/features",
    },
    {
      name: "Pricing",
      link: "/pricing",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Blog",
      link: "/blog",
    },
  ],
  className,
  containerClassName,
}: Partial<FloatingNavbarProps>) => {
  return <FloatingNavbar navItems={navItems} className={className} containerClassName={containerClassName} />;
};