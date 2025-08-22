import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { EditModeProvider } from "@/contexts/edit-mode-context"
import { FontProvider } from "@/contexts/font-context"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Michelle Lopez | Fashion Designer",
  description: "The professional portfolio of Michelle Lopez, expert fashion designer with 11+ years of experience.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background")} suppressHydrationWarning>
        <ThemeProvider>
          <FontProvider>
            <EditModeProvider>
              {children}
              <Toaster />
            </EditModeProvider>
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
