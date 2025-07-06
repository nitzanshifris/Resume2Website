import "./globals.css";

export const metadata = {
  title: 'Retro Wave Portfolio',
  description: '80s inspired with gradients and patterns',
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
