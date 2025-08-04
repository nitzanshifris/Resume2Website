"use client"

import { motion, stagger, useAnimate, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
}) => {
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    }
  })

  const [scope, animate] = useAnimate()
  const isInView = useInView(scope, { once: true, amount: 0.5 })
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)

  useEffect(() => {
    if (isInView) {
      const animation = animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
        },
        {
          duration: 0.2,
          delay: stagger(0.035),
          ease: "easeInOut",
        },
      )
      // Set state to true only when the animation promise resolves
      animation.then(() => {
        setIsAnimationComplete(true)
      })
    }
  }, [isInView, animate])

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{ display: "none", opacity: 0 }}
                  key={`char-${index}`}
                  className={cn(word.className)}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          )
        })}
      </motion.div>
    )
  }
  return (
    <div className={cn(className)}>
      {renderWords()}
      {/* The cursor is now rendered conditionally and outside the motion.div scope */}
      {isAnimationComplete && (
        <motion.span
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className={cn("inline-block rounded-sm w-[2px] h-5 md:h-6 lg:h-7 bg-white align-middle", cursorClassName)}
        ></motion.span>
      )}
    </div>
  )
}
