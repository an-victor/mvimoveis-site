import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { client } from "@/sanity/lib/client"
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import type { SiteSettings } from "@/types/sanity"

const inter = Inter({ subsets: ["latin"] })

async function getSiteSettings() {
  try {
    return await client.fetch<SiteSettings>(SITE_SETTINGS_QUERY)
  } catch (error) {
    console.error("Error fetching site settings in layout:", error)
    return null
  }
}

export const metadata: Metadata = {
  title: "Marcelo Victor Imóveis | Especialista em Imóveis de Alto Padrão",
  description:
    "Encontre o imóvel dos seus sonhos com Marcelo Victor, especialista em imóveis de alto padrão em São Paulo.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteSettings = await getSiteSettings()

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header siteSettings={siteSettings} />
            <main className="flex-1">
              {children}
            </main>
            <Footer siteSettings={siteSettings} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
