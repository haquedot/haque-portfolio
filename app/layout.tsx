import type React from "react"
import type { Metadata, Viewport } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import AdHeader from "@/components/ad-header"
import { Suspense } from "react"
import Loading from "@/components/loading"
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
  const currentYear = new Date().getFullYear()
  
  return (
    <html lang="en" suppressHydrationWarning style={{ scrollBehavior: "smooth" }}>
      <body className={inter.className}>
        <PersonSchema />
        <WebSiteSchema />
        <BreadcrumbSchema />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AdHeader
            logo="/matchwize.svg"
            logoDark="/matchwizeDark.svg"
            title="Matchwize"
            description="Optimize Your Resume with AI"
            buttonText="View"
            href="https://matchwize.com/"
            isExternal={true}
            dismissible={true}
          />
          <Suspense fallback={<Loading />}>
            <Analytics />
            <Header />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
            <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted-foreground">
              © {currentYear} Haque. All rights reserved.
            </footer>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}