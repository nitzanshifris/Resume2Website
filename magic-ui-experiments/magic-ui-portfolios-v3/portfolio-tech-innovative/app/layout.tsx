import "./globals.css";

export const metadata = {
  title: 'Tech Innovative Portfolio - Michelle Jewett',
  description: 'Modern tech aesthetic with data visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className="bg-gradient-to-br from-gray-900 to-blue-950">{children}</body>
    </html>
  )
}
