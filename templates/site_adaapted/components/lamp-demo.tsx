"use client"

import { motion } from "framer-motion"
import { LampEffect } from "./ui/lamp"
import { GlareCard } from "./ui/glare-card"
import { Users, Megaphone, LineChart, Gem } from "lucide-react"

const skills = [
  {
    title: "Social Media Strategy",
    description: "Crafting engaging campaigns across all major platforms.",
    icon: <Users className="h-10 w-10 text-sky-300" />,
  },
  {
    title: "Content Creation",
    description: "Producing compelling blog posts, videos, and graphics.",
    icon: <Megaphone className="h-10 w-10 text-sky-300" />,
  },
  {
    title: "Market Analysis",
    description: "Identifying trends and opportunities through data-driven insights.",
    icon: <LineChart className="h-10 w-10 text-sky-300" />,
  },
  {
    title: "Brand Management",
    description: "Building and maintaining a strong, consistent brand identity.",
    icon: <Gem className="h-10 w-10 text-sky-300" />,
  },
]

export function LampDemo() {
  return (
    <LampEffect>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight md:text-7xl text-slate-100"
      >
        Core Skills
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 place-items-center"
      >
        {skills.map((skill) => (
          <GlareCard key={skill.title} className="flex flex-col items-center justify-center p-6">
            <div className="mb-4">{skill.icon}</div>
            <h3 className="font-bold text-white text-lg mb-2">{skill.title}</h3>
            <p className="font-normal text-base text-neutral-300 text-center">{skill.description}</p>
          </GlareCard>
        ))}
      </motion.div>
    </LampEffect>
  )
}
