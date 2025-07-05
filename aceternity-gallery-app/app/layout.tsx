import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { FloatingParticles } from '@/components/FloatingParticles'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aceternity Components Gallery',
  description: 'Preview and explore UI components from Aceternity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black min-h-screen antialiased`}>
        <div className="relative">
          {/* Aceternity-style gradient background */}
          <div className="fixed inset-0 bg-gradient-to-tr from-black via-gray-950 to-black"></div>
          <div className="fixed inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
          
          {/* Animated gradient orbs */}
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute -inset-[10px] opacity-30">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
          </div>
          
          {/* Noise texture overlay */}
          <div className="fixed inset-0 bg-[url('/noise.webp')] opacity-[0.015] mix-blend-soft-light pointer-events-none"></div>
          
          {/* Grid pattern */}
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
          
          {/* Floating particles */}
          <FloatingParticles />
          
          {/* Content */}
          <div className="relative z-10">
            <Navbar />
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}