import Header from "@/components/header"
import AdHeader from "@/components/ad-header"
import { Suspense } from "react"
import Loading from "@/components/loading"
import Cat from "@/components/Cat"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentYear = new Date().getFullYear()

  return (
    <>
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
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
        <Cat/>
        <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted-foreground">
          © {currentYear} Haque. All rights reserved.
        </footer>
      </Suspense>
    </>
  )
}
