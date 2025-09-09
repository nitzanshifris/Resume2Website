import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { EditModeProvider } from "@/contexts/edit-mode-context"
import { WatermarkProvider } from "@/contexts/watermark-context"
import { Toaster } from "@/components/ui/sonner"
import { Watermark } from "@/components/watermark"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

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
      <body className={cn("bg-background", inter.variable, playfair.variable)} style={{ backgroundColor: '#f8f5f0' }}>
        <ThemeProvider>
          <EditModeProvider>
            <WatermarkProvider>
              <Watermark />
              {children}
              <Toaster />
            </WatermarkProvider>
          </EditModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
