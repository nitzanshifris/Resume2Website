"use client"

import Image from "next/image"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import Link from "next/link"
import { EditableText } from "./ui/editable-text"

interface ThreeDImageCardProps {
  title: string
  subtitle?: string
  description: string
  imageUrl: string
  linkUrl?: string
  buttonText?: string
  onSaveTitle: (value: string) => void
  onSaveSubtitle?: (value: string) => void
  onSaveDescription: (value: string) => void
}

export function ThreeDImageCard({
  title,
  subtitle,
  description,
  imageUrl,
  linkUrl = "#",
  buttonText = "Explore",
  onSaveTitle,
  onSaveSubtitle,
  onSaveDescription,
}: ThreeDImageCardProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-card relative group/card hover:shadow-2xl hover:shadow-accent/50 border-border/20 w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem translateZ="50" className="text-xl font-bold text-card-foreground">
          <EditableText initialValue={title} onSave={onSaveTitle} />
        </CardItem>
        {subtitle && onSaveSubtitle && (
          <CardItem as="p" translateZ="60" className="text-accent font-semibold text-sm max-w-sm mt-1">
            <EditableText initialValue={subtitle} onSave={onSaveSubtitle} />
          </CardItem>
        )}
        <CardItem as="p" translateZ="60" className="text-muted-foreground text-sm max-w-sm mt-2">
          <EditableText textarea initialValue={description} onSave={onSaveDescription} />
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src={imageUrl || "/placeholder.svg"}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt={title}
          />
        </CardItem>
        <div className="flex justify-end items-center mt-10">
          <CardItem
            translateZ={20}
            as={Link}
            href={linkUrl}
            target="__blank"
            className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold"
          >
            {buttonText}
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  )
}
