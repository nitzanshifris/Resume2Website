import "./globals.css";

export const metadata = {
  title: 'Startup Founder Portfolio',
  description: 'Professional portfolio built with Next.js and Magic UI',
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
