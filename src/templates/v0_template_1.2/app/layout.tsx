import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Watermark } from "@/components/watermark"
import { SettingsProvider } from "@/components/settings/settings-provider"
// REMOVE SettingsPanel import

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Michelle Lopez | Fashion Designer",
  description: "The professional portfolio of Michelle Lopez, expert fashion designer with 11+ years of experience.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background", inter.variable, playfair.variable)}>
        <ThemeProvider>
          <SettingsProvider>
            <Watermark />
            {children}
            {/* REMOVE <SettingsPanel /> from here */}
            <Toaster />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
