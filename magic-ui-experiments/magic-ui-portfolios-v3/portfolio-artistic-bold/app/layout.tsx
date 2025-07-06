import "./globals.css";

export const metadata = {
  title: 'Artistic Bold Portfolio - Michelle Jewett',
  description: 'Creative design with bold colors and shapes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className="bg-gradient-to-br from-orange-100 to-red-100">{children}</body>
    </html>
  )
}
