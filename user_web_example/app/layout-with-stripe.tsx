import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume2Website",
  description: "Transform your CV into a stunning portfolio",
};

export default function RootLayoutWithStripe({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload Stripe.js */}
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
      </head>
      <body>
        {/* Load Stripe.js before anything else */}
        <Script
          src="https://js.stripe.com/v3/"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}