"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function ComingSoonPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      // Here you would typically send the email to your backend
      console.log("Email submitted:", email)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-transparent via-white to-gray-100 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/[0.08] to-sky-400/[0.15]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/[0.06] to-emerald-500/[0.09]"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
        {/* Logo */}
        <div className="mb-12">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-W06bZ3SFofUK6WnxqgVriR6hMWwugE.png"
            alt="R2W Logo"
            width={180}
            height={120}
            className="mx-auto"
          />
        </div>

        {/* Main Headline */}
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-800 leading-tight max-w-4xl mx-auto">
            {"There is a new way to "}
            <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">
              get hired
            </span>
            {","}
            <br />
            {"and no, it's not a "}
            <span className="relative inline-block">
              <span className="text-gray-800">PDF</span> <span className="text-gray-800">resume</span>
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {/* First diagonal line (top-left to bottom-right) */}
                <div className="absolute w-[130%] h-1 bg-red-500 transform rotate-12 origin-center"></div>
                {/* Second diagonal line (top-right to bottom-left) */}
                <div className="absolute w-[130%] h-1 bg-red-500 transform -rotate-12 origin-center"></div>
              </div>
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-black max-w-2xl mx-auto">
          Be the first to know when we're live and get{" "}
          <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent font-semibold">
            40% off
          </span>
        </p>

        {/* Email Signup Form */}
        <div className="max-w-lg mx-auto mt-16">
          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex gap-0 bg-white rounded-full shadow-lg border border-gray-200 p-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-0 focus:ring-0 focus:outline-none bg-transparent text-base px-6 py-4"
                required
              />
              <Button
                type="submit"
                className="h-14 px-8 bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Early Access
              </Button>
            </form>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm border border-emerald-200 rounded-2xl p-8 shadow-lg">
              <div className="text-emerald-600 text-xl font-semibold mb-3">🎉 You're on the list!</div>
              <p className="text-gray-600 text-lg">We'll notify you as soon as we launch.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}