"use client"

import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { Link } from "lucide-react"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"

interface Project {
  title: string
  description: string
  link: string
}

interface ProjectsSectionProps {
  title: string
  items: Project[]
}

export const ProjectsSection = ({ title, items }: ProjectsSectionProps) => {
  const { getSizeClasses } = useFontSize()

  return (
    <AnimatedSection id="projects">
      <h2
        className={cn(
          "bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent font-bold mb-12 text-center",
          getSizeClasses("sectionTitle"),
        )}
      >
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((project, i) => (
          <motion.div variants={itemVariants} key={i}>
            <a
              href={project.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="h-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
            >
              <CardContainer containerClassName="h-full">
                <CardBody className="bg-black relative group/card hover:shadow-2xl hover:shadow-accent/[0.2] border-white/[0.2] w-full h-full rounded-xl p-6 border flex flex-col justify-between shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)]">
                  <div>
                    <h3 className={cn("font-bold text-neutral-100", getSizeClasses("timelineSubtitle"))}>
                      {project.title}
                    </h3>
                    <p className={cn("text-neutral-300 mt-2", getSizeClasses("bentoDesc"))}>{project.description}</p>
                  </div>
                  <CardItem translateZ="100" className="w-full mt-4 flex justify-end">
                    <Link className="h-12 w-12 text-accent opacity-50 group-hover/card:opacity-100 transition-opacity duration-300" />
                  </CardItem>
                </CardBody>
              </CardContainer>
            </a>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  )
}
