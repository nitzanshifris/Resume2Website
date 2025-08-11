import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast-container"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "RESUME2WEBSITE | Transform Your Resume Into An Interactive Website",
  description: "Transform your traditional resume into a standout digital web presence. Our AI-powered platform converts your CV into a professional, interactive website in minutes.",
  generator: 'Next.js',
  applicationName: 'RESUME2WEBSITE',
  keywords: ['resume website', 'cv to website', 'digital resume', 'interactive cv', 'professional portfolio', 'resume transformation', 'career website'],
  authors: [{ name: 'RESUME2WEBSITE Team' }],
  creator: 'RESUME2WEBSITE',
  publisher: 'RESUME2WEBSITE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://resume2website.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RESUME2WEBSITE | Transform Your Resume Into An Interactive Website',
    description: 'Transform your traditional resume into a standout digital web presence. Our AI-powered platform converts your CV into a professional, interactive website in minutes.',
    url: 'https://resume2website.com',
    siteName: 'RESUME2WEBSITE',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RESUME2WEBSITE - Transform Your Resume',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RESUME2WEBSITE | Transform Your Resume Into An Interactive Website',
    description: 'Transform your traditional resume into a standout digital web presence. Our AI-powered platform converts your CV into a professional, interactive website in minutes.',
    images: ['/images/twitter-image.jpg'],
    creator: '@resume2website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Add JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RESUME2WEBSITE',
  description: 'Transform your traditional resume into a standout digital web presence. Our AI-powered platform converts your CV into a professional, interactive website in minutes.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '29.00',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
