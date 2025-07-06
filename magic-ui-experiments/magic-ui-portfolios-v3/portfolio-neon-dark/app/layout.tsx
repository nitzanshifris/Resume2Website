import "./globals.css";

export const metadata = {
  title: 'Neon Dark Portfolio - Michelle Jewett',
  description: 'Cyberpunk aesthetic with glowing effects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black">{children}</body>
    </html>
  )
}
