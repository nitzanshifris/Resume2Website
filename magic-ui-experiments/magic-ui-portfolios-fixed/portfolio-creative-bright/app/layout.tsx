import "./globals.css";

export const metadata = {
  title: 'Creative Bright Portfolio',
  description: 'Professional portfolio showcasing skills and experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
