import "./globals.css";

export const metadata = {
  title: 'Michelle Jewett - Retro Cyberpunk Portfolio',
  description: 'Professional portfolio showcasing experience and skills',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950">{children}</body>
    </html>
  )
}
