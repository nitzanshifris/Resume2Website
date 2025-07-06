import "./globals.css";

export const metadata = {
  title: 'Glassmorphism Modern Portfolio',
  description: 'Transparent glass effects with depth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
