import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast-container"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "CV2WEB | Transform Your Resume Into An Interactive Website",
  description: "Transform your traditional resume into a standout digital web presence. Our AI-powered platform converts your CV into a professional, interactive website in minutes.",
  generator: 'Next.js',
  applicationName: 'CV2WEB',
  keywords: ['resume website', 'cv to website', 'digital resume', 'interactive cv', 'professional portfolio', 'resume transformation', 'career website'],
  authors: [{ name: 'CV2WEB Team' }],
  creator: 'CV2WEB',
  publisher: 'CV2WEB',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cv2web.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CV2WEB | Transform Your Resume Into An Interactive Website',
    description: 'Transform your traditional resume into a standout digital web presence. Our AI-powered platform converts your CV into a professional, interactive website in minutes.',
    url: 'https://cv2web.com',
    siteName: 'CV2WEB',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CV2WEB - Transform Your Resume',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV2WEB | Transform Your Resume Into An Interactive Website',
    description: 'Transform your traditional resume into a standout digital web presence. Our AI-powered platform converts your CV into a professional, interactive website in minutes.',
    images: ['/images/twitter-image.jpg'],
    creator: '@cv2web',
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
  name: 'CV2WEB',
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
