import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export const metadata: Metadata = {
  title: "Coming Soon | Resume2Website",
  description: "There is a new way to get hired, and no, it's not a PDF resume",
}

export default function ComingSoonLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
      {children}
    </div>
  )
}