"use client";
import React from "react";
import { AnimatedTooltip } from "./animated-tooltip-base";

// Sample tooltip items for gallery previews
const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    designation: "Product Manager",
    image: "https://images.unsplash.com/photo-1494790108755-2616c1c46b3b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Michael Chen",
    designation: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    designation: "Marketing Lead",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop"
  }
];

const skillBadges = [
  {
    id: 1,
    name: "React",
    designation: "Frontend Framework",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "TypeScript",
    designation: "Programming Language",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Node.js",
    designation: "Backend Runtime",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=800&auto=format&fit=crop"
  }
];

const socialProfiles = [
  {
    id: 1,
    name: "Follow on Twitter",
    designation: "@yourhandle",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Connect on LinkedIn",
    designation: "Professional Network",
    image: "https://images.unsplash.com/photo-1586776903121-3d4b52b8e531?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "View GitHub",
    designation: "Code Repository",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop"
  }
];

// Gallery-specific preview components with consistent sizing
export function AnimatedTooltipGalleryTeam() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem]">
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Our Team</h3>
        <AnimatedTooltip items={teamMembers} />
        <p className="text-sm text-gray-600 dark:text-gray-400">Hover over avatars to see team member details</p>
      </div>
    </div>
  );
}

export function AnimatedTooltipGallerySkills() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Tech Stack</h3>
        <AnimatedTooltip items={skillBadges} />
        <p className="text-sm text-gray-600 dark:text-gray-400">Technologies we work with</p>
      </div>
    </div>
  );
}

export function AnimatedTooltipGallerySocial() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Connect With Us</h3>
        <AnimatedTooltip items={socialProfiles} />
        <p className="text-sm text-gray-600 dark:text-gray-400">Find us on social platforms</p>
      </div>
    </div>
  );
}

export function AnimatedTooltipGalleryCompact() {
  const compactTeam = teamMembers.slice(0, 3);
  
  return (
    <div className="flex items-center justify-center p-8 h-[32rem] bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Core Team</h3>
        <AnimatedTooltip items={compactTeam} />
        <p className="text-sm text-gray-600 dark:text-gray-400">Key team members</p>
      </div>
    </div>
  );
}