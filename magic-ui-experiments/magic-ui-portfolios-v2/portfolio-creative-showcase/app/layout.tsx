import "./globals.css"

export const metadata = {
  title: 'Creative Showcase Portfolio',
  description: 'Vibrant portfolio showcasing creative projects and artistic works',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900">{children}</body>
    </html>
  )
}
