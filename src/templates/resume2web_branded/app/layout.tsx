import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Resume2WebBranding } from "@/components/resume2web-branding"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Professional Portfolio | Powered by CV2WEB",
  description: "Transform your CV into a stunning portfolio website with CV2WEB - The AI-powered CV to portfolio converter",
  generator: 'CV2WEB'
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
          <Resume2WebBranding position="footer" size="medium" />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
