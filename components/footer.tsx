"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react"
import { getImageUrl } from "@/sanity/lib/image"
import { NavigationLink } from "@/components/navigation-link"
import type { SiteSettings } from "@/types/sanity"
import { WhatsAppLeadButton } from "@/components/whatsapp-lead-button"

interface FooterProps {
  siteSettings: SiteSettings | null
}

export function Footer({ siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-white py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand/About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              {siteSettings?.logo ? (
                <img
                  src={getImageUrl(siteSettings.logo, 150, 80) || "/placeholder.svg"}
                  alt={siteSettings.title}
                  className="h-12 w-auto"
                />
              ) : (
                <div className="text-xl font-bold text-slate-900">
                  {siteSettings?.title || "Marcelo Victor Imóveis"}
                </div>
              )}
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              {siteSettings?.description ||
                "Especialista em imóveis de alto padrão, oferecendo um serviço personalizado e exclusivo para cada cliente."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Links Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-slate-600 hover:text-brand-primary transition-colors">
                Início
              </Link>
              <Link href="/imoveis" className="text-slate-600 hover:text-brand-primary transition-colors">
                Imóveis
              </Link>
              <NavigationLink href="/#sobre" className="text-slate-600 hover:text-brand-primary transition-colors">
                Sobre
              </NavigationLink>
              <NavigationLink href="/#contato" className="text-slate-600 hover:text-brand-primary transition-colors">
                Contato
              </NavigationLink>
              <Link href="/politica" className="text-slate-600 hover:text-brand-primary transition-colors">
                Política de Privacidade
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Fale Conosco</h3>
            <div className="space-y-3">
              {siteSettings?.phone && (
                <p className="flex items-center text-slate-600 text-sm">
                  <Phone className="mr-3 h-4 w-4 text-brand-primary" />
                  {siteSettings.phone}
                </p>
              )}
              {siteSettings?.email && (
                <p className="flex items-center text-slate-600 text-sm">
                  <Mail className="mr-3 h-4 w-4 text-brand-primary" />
                  {siteSettings.email}
                </p>
              )}
              {siteSettings?.address && (
                <p className="flex items-start text-slate-600 text-sm">
                  <MapPin className="mr-3 h-4 w-4 text-brand-primary mt-0.5" />
                  <span className="flex-1">{siteSettings.address}</span>
                </p>
              )}
            </div>
            
            {siteSettings?.whatsapp && (
              <div className="mt-6">
                <WhatsAppLeadButton
                  whatsappNumber={siteSettings.whatsapp}
                  className="inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-xs font-medium text-white hover:bg-green-600 transition-colors shadow-sm"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp
                </WhatsAppLeadButton>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-slate-500">
          <p>
            © {currentYear} {siteSettings?.title || "Marcelo Victor Imóveis"}. Todos os direitos reservados.
          </p>
          <p className="mt-2">
            <Link href="/politica" className="hover:text-brand-primary hover:underline">
              Política de Privacidade
            </Link>
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Feito com excelência pela ALX Mídias.
          </p>
        </div>
      </div>
    </footer>
  )
}
