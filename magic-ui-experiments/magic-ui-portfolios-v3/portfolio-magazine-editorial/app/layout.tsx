import "./globals.css";

export const metadata = {
  title: 'Magazine Editorial Portfolio - Michelle Jewett',
  description: 'Editorial layout with sophisticated typography',
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
