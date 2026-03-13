import Link from "next/link"
import { MapPin } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { getImageUrl } from "@/sanity/lib/image"
import { formatCurrency } from "@/lib/format-currency"
import { PROPERTIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import type { Property, SiteSettings } from "@/types/sanity"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

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
    <>
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
    </>
  )
}
