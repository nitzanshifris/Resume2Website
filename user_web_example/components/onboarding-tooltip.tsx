"use client"

import { motion } from "framer-motion"

interface OnboardingTooltipProps {
  text: string
  position?: "top" | "right" | "bottom" | "left"
}

export function OnboardingTooltip({ text, position = "top" }: OnboardingTooltipProps) {
  // Position the tooltip based on the position prop
  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return {
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(-10px)",
          arrow: {
            bottom: "-6px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
          },
        }
      case "right":
        return {
          left: "100%",
          top: "50%",
          transform: "translateY(-50%) translateX(10px)",
          arrow: {
            left: "-6px",
            top: "50%",
            transform: "translateY(-50%) rotate(45deg)",
          },
        }
      case "bottom":
        return {
          top: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(10px)",
          arrow: {
            top: "-6px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
          },
        }
      case "left":
        return {
          right: "100%",
          top: "50%",
          transform: "translateY(-50%) translateX(-10px)",
          arrow: {
            right: "-6px",
            top: "50%",
            transform: "translateY(-50%) rotate(45deg)",
          },
        }
      default:
        return {
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(-10px)",
          arrow: {
            bottom: "-6px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
          },
        }
    }
  }

  const positionStyles = getPositionStyles()

  return (
    <motion.div
      className="absolute z-50 whitespace-nowrap bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
      style={{
        ...positionStyles,
      }}
      initial={{ opacity: 0, ...positionStyles }}
      animate={{ opacity: 1, ...positionStyles }}
      transition={{ delay: 0.5 }}
    >
      {text}
      {/* Arrow */}
      <div className="absolute w-2 h-2 bg-gray-900" style={positionStyles.arrow} />
    </motion.div>
  )
}
