import "./globals.css";

export const metadata = {
  title: 'Brutalist Bold Portfolio',
  description: 'Raw, bold design with strong geometric shapes',
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
