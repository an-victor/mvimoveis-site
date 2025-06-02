import Link from "next/link"
import { MapPin } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { getImageUrl } from "@/sanity/lib/image"
import { formatCurrency } from "@/lib/format-currency"
import { PROPERTIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import type { Property, SiteSettings } from "@/types/sanity"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { NavigationLink } from "@/components/navigation-link"

async function getPropertiesData() {
  try {
    const [properties, siteSettings] = await Promise.all([
      client.fetch<Property[]>(PROPERTIES_QUERY),
      client.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
    ])

    return {
      properties: properties || [],
      siteSettings: siteSettings || null,
    }
  } catch (error) {
    console.error("Error fetching properties data:", error)
    return {
      properties: [],
      siteSettings: null,
    }
  }
}

export default async function PropertiesPage() {
  const { properties, siteSettings } = await getPropertiesData()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {siteSettings?.logo ? (
              <img
                src={getImageUrl(siteSettings.logo, 150, 80) || "/placeholder.svg"}
                alt={siteSettings.title}
                className="h-20 w-auto"
              />
            ) : (
              <span className="text-xl font-bold text-slate-900">
                {siteSettings?.title || "Marcelo Victor Imóveis"}
              </span>
            )}
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Início
            </Link>
            <Link href="/imoveis" className="text-sm font-medium text-slate-900 hover:text-orange-500">
              Imóveis
            </Link>
            <NavigationLink href="/#sobre" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Sobre
            </NavigationLink>
            <NavigationLink href="/#contato" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Contato
            </NavigationLink>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Abrir menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 bg-slate-900">
          <div className="container text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Encontre seu imóvel ideal</h1>
            <p className="mt-4 text-lg text-slate-300">
              Explore nossa seleção de imóveis de alto padrão em localizações privilegiadas
            </p>
          </div>
        </section>

        {/* Filtros e Listagem */}
        <section className="py-12">
          <div className="container">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center text-sm font-medium text-orange-500 hover:underline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1 h-4 w-4"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Voltar para página inicial
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="search"
                    placeholder="Buscar imóveis..."
                    className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-4 text-sm sm:w-[250px]"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <select className="rounded-md border border-slate-300 py-2 px-4 text-sm w-full sm:w-auto">
                  <option value="recent">Mais recentes</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="area-asc">Menor área</option>
                  <option value="area-desc">Maior área</option>
                </select>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-slate-500">Exibindo {properties.length} imóveis</div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Card key={property._id} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={getImageUrl(property.images?.[0], 800, 600) || "/placeholder.svg"}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900">{property.title}</h3>
                    <div className="mt-2 flex items-center text-slate-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-500">{formatCurrency(property.price)}</span>
                      <div className="flex items-center gap-1 text-sm">
                        <span>{property.area}</span>
                        <span className="text-slate-300">|</span>
                        <span>{property.bedrooms} quartos</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 p-4">
                    <Link href={`/imoveis/${property.slug.current}`} className="w-full">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">Ver detalhes</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {properties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">Nenhum imóvel encontrado.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-xl font-bold text-slate-900">{siteSettings?.title || "Marcelo Victor Imóveis"}</div>
              <p className="mt-4 text-slate-600">
                {siteSettings?.description ||
                  "Especialista em imóveis de alto padrão, oferecendo um serviço personalizado e exclusivo para cada cliente."}
              </p>
              {siteSettings?.logo && (
                <div className="mt-6">
                  <img
                    src={getImageUrl(siteSettings.logo, 120, 60) || "/placeholder.svg"}
                    alt={siteSettings.title}
                    className="h-12 w-auto"
                  />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Links Rápidos</h3>
              <nav className="mt-4 flex flex-col space-y-2">
                <Link href="/" className="text-slate-600 hover:text-orange-500">
                  Início
                </Link>
                <Link href="/imoveis" className="text-slate-600 hover:text-orange-500">
                  Imóveis
                </Link>
                <NavigationLink href="/#sobre" className="text-slate-600 hover:text-orange-500">
                  Sobre
                </NavigationLink>
                <NavigationLink href="/#contato" className="text-slate-600 hover:text-orange-500">
                  Contato
                </NavigationLink>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Fale Conosco</h3>
              <div className="mt-4 space-y-2">
                {siteSettings?.phone && (
                  <p className="flex items-center text-slate-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-5 w-5 text-orange-500"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {siteSettings.phone}
                  </p>
                )}
                {siteSettings?.email && (
                  <p className="flex items-center text-slate-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-5 w-5 text-orange-500"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {siteSettings.email}
                  </p>
                )}
                {siteSettings?.address && (
                  <p className="flex items-center text-slate-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-5 w-5 text-orange-500"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {siteSettings.address}
                  </p>
                )}
              </div>
              {siteSettings?.whatsapp && (
                <div className="mt-6">
                  <Link
                    href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
                    className="inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    Fale pelo WhatsApp
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="mt-12 border-t pt-6 text-center text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} {siteSettings?.title || "Marcelo Victor Imóveis"}. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
