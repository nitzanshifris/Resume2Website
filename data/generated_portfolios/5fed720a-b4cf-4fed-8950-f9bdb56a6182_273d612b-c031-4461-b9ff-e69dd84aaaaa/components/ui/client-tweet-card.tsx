"use client"

import { Tweet } from "react-tweet"
import { cn } from "@/lib/utils"

interface ClientTweetCardProps {
  /** The id of the tweet to display */
  id: string
  /** Optional className for styling */
  className?: string
}

export function ClientTweetCard({ id, className }: ClientTweetCardProps) {
  return (
    <div
      className={cn(
        "w-full [&_.react-tweet-theme]:!bg-transparent",
        className
      )}
      data-theme="light"
    >
      <Tweet id={id} />
    </div>
  )
}