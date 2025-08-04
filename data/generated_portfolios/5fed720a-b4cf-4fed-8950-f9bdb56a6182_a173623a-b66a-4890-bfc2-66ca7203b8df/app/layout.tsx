import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { FontSizeProvider } from "@/contexts/font-size-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { ColorModeProvider } from "@/contexts/color-mode-context"
import { EditModeProvider } from "@/contexts/edit-mode-context"
import { WatermarkProvider } from "@/contexts/watermark-context"
import { Watermark } from "@/components/watermark"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Ran Lotan | System Engineer",
  description: "The professional portfolio of Ran Lotan, System Engineer.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "bg-background font-sans transition-colors duration-300")}>
        <ThemeProvider>
          <ColorModeProvider>
            <EditModeProvider>
              <WatermarkProvider>
                <FontSizeProvider>
                  {children}
                  <Watermark />
                </FontSizeProvider>
              </WatermarkProvider>
            </EditModeProvider>
          </ColorModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
