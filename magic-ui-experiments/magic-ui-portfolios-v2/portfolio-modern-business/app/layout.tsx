import "./globals.css"

export const metadata = {
  title: 'Modern Business Portfolio',
  description: 'Professional portfolio showcasing business expertise and achievements',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
