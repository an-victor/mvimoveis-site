import Link from "next/link"
import { MapPin } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { getImageUrl } from "@/sanity/lib/image"
import { formatCurrency } from "@/lib/format-currency"
import { buildPropertiesQuery, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import type { Property, SiteSettings } from "@/types/sanity"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PropertyCard } from "@/components/property-card"
import { PropertyFilters } from "@/components/property-filters"
import { PropertySearch } from "@/components/property-search"
import { PropertySort } from "@/components/property-sort"

async function getPropertiesData(searchParams: any) {
  try {
    const { 
      search = "", 
      type = "", 
      minPrice = 0, 
      maxPrice = 10000000, 
      bedrooms = 0, 
      bathrooms = 0,
      sort = "recent" 
    } = searchParams;

    const [rawProperties, siteSettings] = await Promise.all([
      client.fetch<Property[]>(buildPropertiesQuery("_createdAt desc"), { 
        search, 
        type, 
        bedrooms: Number(bedrooms), 
        bathrooms: Number(bathrooms),
      }),
      client.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
    ])

    const getNum = (str: string | undefined | null) => {
      if (!str) return 0;
      return Number(str.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, ''));
    };

    const minP = Number(minPrice);
    const maxP = Number(maxPrice);
    
    let properties = (rawProperties || []).filter(p => {
      const pPrice = getNum(p.price);
      return pPrice >= minP && pPrice <= maxP;
    });

    if (sort === "price-asc") {
      properties.sort((a, b) => getNum(a.price) - getNum(b.price));
    } else if (sort === "price-desc") {
      properties.sort((a, b) => getNum(b.price) - getNum(a.price));
    } else if (sort === "area-asc") {
      properties.sort((a, b) => getNum(a.area) - getNum(b.area));
    } else if (sort === "area-desc") {
      properties.sort((a, b) => getNum(b.area) - getNum(a.area));
    }

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

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const { properties, siteSettings } = await getPropertiesData(params)

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
              <Link href="/" className="flex items-center text-sm font-medium text-brand-primary hover:underline">
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
            <div className="flex flex-wrap gap-2 items-center">
              <PropertySearch />
              <PropertyFilters />
              <PropertySort />
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-slate-500">Exibindo {properties.length} imóveis</div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
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
