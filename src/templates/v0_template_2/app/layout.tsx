import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { FontSizeProvider } from "@/contexts/font-size-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { CustomCursor } from "@/components/ui/custom-cursor"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Michelle Lopez | Fashion Designer",
  description: "The professional portfolio of Michelle Lopez, Fashion Designer.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "bg-black font-sans custom-cursor-area")}>
        <CustomCursor />
        <ThemeProvider>
          <FontSizeProvider>{children}</FontSizeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
