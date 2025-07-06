import "./globals.css";

export const metadata = {
  title: 'Tech Developer Dark Portfolio',
  description: 'Professional portfolio built with Next.js and Magic UI',
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
