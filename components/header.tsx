"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/sanity/lib/image"
import { NavigationLink } from "@/components/navigation-link"
import type { SiteSettings } from "@/types/sanity"

interface HeaderProps {
  siteSettings: SiteSettings | null
}

export function Header({ siteSettings }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  
  const isHome = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Estilos dinâmicos baseados na rota e no scroll
  const headerClasses = isHome
    ? isScrolled
      ? "fixed top-0 z-50 w-full bg-white shadow-md transition-all duration-300"
      : "absolute top-0 z-50 w-full bg-transparent transition-all duration-300"
    : "sticky top-0 z-50 w-full bg-white border-b shadow-sm"

  const textClasses = isHome && !isScrolled ? "text-white hover:text-brand-accent" : "text-slate-600 hover:text-brand-primary"
  const logoTextClasses = isHome && !isScrolled ? "text-brand-accent" : "text-brand-primary"

  return (
    <header className={headerClasses}>
      <div className="container flex h-20 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {siteSettings?.logo ? (
              <img
                src={getImageUrl(siteSettings.logo, 150, 80) || "/placeholder.svg"}
                alt={siteSettings.title}
                className="h-16 w-auto"
              />
            ) : (
              <span className={`text-2xl font-bold ${logoTextClasses}`}>
                {siteSettings?.title || "Marcelo Victor"}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link href="/" className={`text-base font-medium transition-colors ${textClasses}`}>
            Home
          </Link>
          <Link href="/imoveis" className={`text-base font-medium transition-colors ${textClasses}`}>
            Imóveis
          </Link>
          <NavigationLink href="/#sobre" className={`text-base font-medium transition-colors ${textClasses}`}>
            Sobre
          </NavigationLink>
          <NavigationLink href="/#contato" className={`text-base font-medium transition-colors ${textClasses}`}>
            Contato
          </NavigationLink>
        </nav>

        <div className="flex items-center gap-4">
          {siteSettings?.whatsapp && (
            <Link
              href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-secondary shadow-sm"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={isHome && !isScrolled ? "text-white" : "text-slate-900"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b absolute top-20 left-0 w-full shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-4 gap-4">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-slate-900 hover:text-brand-primary p-2"
            >
              Home
            </Link>
            <Link 
              href="/imoveis" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-slate-900 hover:text-brand-primary p-2"
            >
              Imóveis
            </Link>
            <NavigationLink 
              href="/#sobre" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-slate-900 hover:text-brand-primary p-2"
            >
              Sobre
            </NavigationLink>
            <NavigationLink 
              href="/#contato" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-slate-900 hover:text-brand-primary p-2"
            >
              Contato
            </NavigationLink>
            {siteSettings?.whatsapp && (
              <Link
                href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-md bg-brand-primary px-4 py-3 text-base font-medium text-white hover:bg-brand-secondary"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Falar no WhatsApp
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
