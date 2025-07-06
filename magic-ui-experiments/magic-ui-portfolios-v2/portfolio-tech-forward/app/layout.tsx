import "./globals.css"

export const metadata = {
  title: 'Tech Forward Portfolio',
  description: 'Modern tech portfolio showcasing cutting-edge projects and technical expertise',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-gray-100">{children}</body>
    </html>
  )
}