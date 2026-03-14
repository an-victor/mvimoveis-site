import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { client } from "@/sanity/lib/client"
import { getImageUrl } from "@/sanity/lib/image"
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import type { SiteSettings } from "@/types/sanity"
import { auth } from "@/auth"

const inter = Inter({ subsets: ["latin"] })

async function getSiteSettings() {
  try {
    return await client.fetch<SiteSettings>(SITE_SETTINGS_QUERY)
  } catch (error) {
    console.error("Error fetching site settings in layout:", error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings()
  
  return {
    title: siteSettings?.title || "Marcelo Victor Imóveis | Especialista em Imóveis de Alto Padrão",
    description: siteSettings?.description || "Encontre o imóvel dos seus sonhos com Marcelo Victor, especialista em imóveis de alto padrão em São Paulo.",
    openGraph: {
      title: siteSettings?.title,
      description: siteSettings?.description,
      images: siteSettings?.logo ? [getImageUrl(siteSettings.logo, 1200, 630)] : [],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteSettings = await getSiteSettings()
  const session = await auth()

  const brandStyles = {
    "--brand-primary": siteSettings?.primaryColor || "#f97316",
    "--brand-secondary": siteSettings?.secondaryColor || "#ea580c",
    "--brand-accent": siteSettings?.primaryColor ? `${siteSettings.primaryColor}cc` : "#fb923c",
  } as React.CSSProperties

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} style={brandStyles}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header siteSettings={siteSettings} session={session} />
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
