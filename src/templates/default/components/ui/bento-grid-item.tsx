import type React from "react"
import { cn } from "@/lib/utils"
import { BackgroundGradient } from "./background-gradient"

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
}) => {
  return (
    <BackgroundGradient
      containerClassName={cn("rounded-xl h-full transition-transform duration-200 hover:-translate-y-1", className)}
      className="rounded-xl bg-card p-6 flex flex-col space-y-4 justify-between h-full"
    >
      {header}
      <div className="transition duration-200">
        <div className="flex items-center gap-2">
          {icon}
          <div className="font-serif font-bold text-card-foreground text-3xl">{title}</div>
        </div>
        <div className="font-sans font-normal text-muted-foreground text-lg mt-2">{description}</div>
      </div>
    </BackgroundGradient>
  )
}
