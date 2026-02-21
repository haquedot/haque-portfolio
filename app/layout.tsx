import type React from "react"
import type { Metadata, Viewport } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import { baseMetadata } from "@/lib/metadata"
import { PersonSchema, WebSiteSchema, BreadcrumbSchema } from "@/lib/schema-markup"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  ...baseMetadata,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ scrollBehavior: "smooth" }}>
      <body className={inter.className}>
        <PersonSchema />
        <WebSiteSchema />
        <BreadcrumbSchema />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Analytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}