"use client";

import { AnimatedTooltip } from "./animated-tooltip-base";

const socialProfiles = [
  {
    id: 1,
    name: "@techguru",
    designation: "GitHub • 15k followers",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3560&q=80",
  },
  {
    id: 2,
    name: "@designmaster",
    designation: "Dribbble • 8k followers",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 3,
    name: "@codewithjane",
    designation: "Twitter • 12k followers",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 4,
    name: "@devtalks",
    designation: "LinkedIn • 20k connections",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
];

export function AnimatedTooltipSocialProfiles() {
  return (
    <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-8">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Connect With Us</h3>
        <AnimatedTooltip items={socialProfiles} />
      </div>
    </div>
  );
}