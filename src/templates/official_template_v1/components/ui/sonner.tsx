"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-green-50/90 group-[.toaster]:to-emerald-50/90 group-[.toaster]:dark:from-green-950/90 group-[.toaster]:dark:to-emerald-950/90 group-[.toaster]:border-green-200 group-[.toaster]:dark:border-green-800 group-[.toaster]:text-green-900 group-[.toaster]:dark:text-green-100",
        },
        duration: 2000,
        style: {
          transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        }
      }}
      position="top-right"
      expand={false}
      richColors
      visibleToasts={1}
      {...props}
    />
  )
}

export { Toaster }
