"use client";

import { AnimatedTooltip } from "./animated-tooltip-base";

const skillBadges = [
  {
    id: 1,
    name: "React Expert",
    designation: "5+ years • 50+ projects",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 2,
    name: "TypeScript Pro",
    designation: "4+ years • Enterprise level",
    image:
      "https://images.unsplash.com/photo-1619410283995-43d9134e7656?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 3,
    name: "Node.js Master",
    designation: "6+ years • Backend specialist",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3456&q=80",
  },
];

export function AnimatedTooltipSkillBadges() {
  return (
    <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-xl p-8">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Technical Skills</h3>
        <AnimatedTooltip items={skillBadges} />
      </div>
    </div>
  );
}