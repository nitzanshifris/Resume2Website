import "./globals.css";

export const metadata = {
  title: 'Modern Gradient Portfolio',
  description: 'Professional portfolio showcasing skills and experience',
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
