import "./globals.css";

export const metadata = {
  title: 'Neon Cyberpunk Portfolio',
  description: 'Futuristic design with glowing neon effects',
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
