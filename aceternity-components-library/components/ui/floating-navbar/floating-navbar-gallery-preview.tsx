"use client";
import React from "react";
import { FloatingNav } from "./index";
import { Home, User, FolderOpen, Mail, Settings, Heart } from "lucide-react";

// Gallery-specific preview components with consistent sizing
export function FloatingNavbarGalleryBasic() {
  const navItems = [
    { name: "Home", link: "#", icon: <Home className="h-4 w-4" /> },
    { name: "About", link: "#", icon: <User className="h-4 w-4" /> },
    { name: "Projects", link: "#", icon: <FolderOpen className="h-4 w-4" /> },
    { name: "Contact", link: "#", icon: <Mail className="h-4 w-4" /> },
  ];

  return (
    <div className="relative w-full h-[32rem] bg-gradient-to-b from-white to-gray-50 dark:from-neutral-950 dark:to-neutral-900 overflow-y-auto">
      <FloatingNav navItems={navItems} containerClassName="absolute top-10 inset-x-0 mx-auto" />
      <div className="h-[150%] flex flex-col items-center justify-between py-20">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">↓ Scroll down to hide navbar</p>
          <p className="text-gray-500 dark:text-gray-500">The navbar will hide when you scroll down</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">↑ Scroll up to show navbar</p>
          <p className="text-gray-500 dark:text-gray-500">The navbar will appear when you scroll up</p>
        </div>
      </div>
    </div>
  );
}

export function FloatingNavbarGalleryMinimal() {
  const navItems = [
    { name: "Home", link: "#" },
    { name: "About", link: "#" },
    { name: "Contact", link: "#" },
  ];

  return (
    <div className="relative w-full h-[32rem] bg-white dark:bg-black overflow-y-auto">
      <FloatingNav navItems={navItems} containerClassName="absolute top-10 inset-x-0 mx-auto" />
      <div className="h-[150%] flex flex-col items-center justify-between py-20">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Minimal Navigation
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Text-only navigation items</p>
          <p className="text-gray-500 dark:text-gray-500 mt-4">↓ Scroll down</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-500">↑ Scroll up to see navbar</p>
        </div>
      </div>
    </div>
  );
}

export function FloatingNavbarGalleryExtended() {
  const navItems = [
    { name: "Home", link: "#", icon: <Home className="h-4 w-4" /> },
    { name: "Services", link: "#", icon: <Settings className="h-4 w-4" /> },
    { name: "Portfolio", link: "#", icon: <FolderOpen className="h-4 w-4" /> },
    { name: "About", link: "#", icon: <User className="h-4 w-4" /> },
    { name: "Contact", link: "#", icon: <Mail className="h-4 w-4" /> },
    { name: "Support", link: "#", icon: <Heart className="h-4 w-4" /> },
  ];

  return (
    <div className="relative w-full h-[32rem] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 overflow-y-auto">
      <FloatingNav navItems={navItems} containerClassName="absolute top-10 inset-x-0 mx-auto" />
      <div className="h-[150%] flex flex-col items-center justify-between py-20">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Extended Navigation
          </h3>
          <p className="text-gray-600 dark:text-gray-400">More navigation items with icons</p>
          <p className="text-gray-500 dark:text-gray-500 mt-4">↓ Scroll down</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-500">↑ Scroll up to see navbar</p>
        </div>
      </div>
    </div>
  );
}

export function FloatingNavbarGalleryCustom() {
  const navItems = [
    { name: "Dashboard", link: "#", icon: <Home className="h-4 w-4" /> },
    { name: "Analytics", link: "#", icon: <Settings className="h-4 w-4" /> },
    { name: "Projects", link: "#", icon: <FolderOpen className="h-4 w-4" /> },
    { name: "Team", link: "#", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="relative w-full h-[32rem] bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 overflow-y-auto">
      <FloatingNav 
        navItems={navItems} 
        containerClassName="absolute top-10 inset-x-0 mx-auto"
        className="bg-purple-50 dark:bg-purple-900/50 backdrop-blur-md"
      />
      <div className="h-[150%] flex flex-col items-center justify-between py-20">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Custom Styled
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Custom background and styling</p>
          <p className="text-gray-500 dark:text-gray-500 mt-4">↓ Scroll down</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-500">↑ Scroll up to see navbar</p>
        </div>
      </div>
    </div>
  );
}