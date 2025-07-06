import "./globals.css";

export const metadata = {
  title: 'Minimalist Zen Portfolio',
  description: 'Clean and peaceful with focus on typography',
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
