import "./globals.css";

export const metadata = {
  title: 'Minimalist Clean Portfolio - Michelle Jewett',
  description: 'Clean design with focus on typography',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className="bg-white">{children}</body>
    </html>
  )
}
