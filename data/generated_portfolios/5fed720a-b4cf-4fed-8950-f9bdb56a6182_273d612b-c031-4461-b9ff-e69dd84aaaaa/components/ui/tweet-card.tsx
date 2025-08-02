import { getTweet } from "react-tweet/api"
import { Tweet } from "react-tweet"
import { cn } from "@/lib/utils"

interface TweetCardProps {
  /** The id of the tweet to display */
  id: string
  /** Optional className for styling */
  className?: string
}

export async function TweetCard({ id, className }: TweetCardProps) {
  try {
    const tweet = await getTweet(id)
    
    if (!tweet) {
      return (
        <div className={cn("p-4 text-center text-muted-foreground", className)}>
          Tweet not found
        </div>
      )
    }

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
  } catch (error) {
    console.error("Error fetching tweet:", error)
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        Error loading tweet
      </div>
    )
  }
}