import "./globals.css";

export const metadata = {
  title: 'Corporate Executive Portfolio',
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
