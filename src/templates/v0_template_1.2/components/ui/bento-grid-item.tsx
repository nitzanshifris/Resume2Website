import type React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  imageUrl,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  imageUrl?: string
}) => {
  return (
    <div
      className={cn(
        "rounded-xl h-full transition-transform duration-200 hover:-translate-y-1",
        "bg-card flex flex-col",
        "border-2 border-border/50",
        "shadow-lg",
        "group",
        className,
      )}
    >
      {imageUrl ? (
        <div className="relative w-full h-56 overflow-hidden rounded-t-xl">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={typeof title === "string" ? title : ""}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        header
      )}
      <div className="p-6 flex flex-col space-y-4 justify-between flex-grow">
        <div className="transition duration-200">
          <div className="flex items-center gap-2">
            {icon}
            <div className="font-serif font-bold text-card-foreground text-3xl">{title}</div>
          </div>
          <div className="font-sans font-normal text-muted-foreground text-base mt-2">{description}</div>
        </div>
      </div>
    </div>
  )
}
