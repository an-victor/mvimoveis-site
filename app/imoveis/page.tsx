// /home/ubuntu/corretor_site/app/imoveis/page.tsx
import Link from "next/link";
import Image from "next/image";
import { SanityDocument } from "next-sanity";
import { MapPin, ArrowLeft } from "lucide-react";

import { client } from "@/lib/sanity.client";
import { urlForImage } from "@/lib/sanity.image";
import { paginatedPropertiesQuery } from "@/lib/sanity.queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PropertyPagination from "@/components/property-pagination"; // Assuming this component exists or will be created
import PropertySearch from "@/components/property-search"; // Assuming this component exists
import PropertySort from "@/components/property-sort"; // Assuming this component exists
import PropertyFilters from "@/components/property-filters"; // Assuming this component exists
import PropertyViewToggle from "@/components/property-view-toggle"; // Assuming this component exists

interface Property extends SanityDocument {
  _id: string;
  title?: string;
  slug?: { current: string };
  location?: string;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  mainImage?: any;
  mainImageUrl?: string;
}

interface PaginatedData {
  properties: Property[];
  totalProperties: number;
}

const ITEMS_PER_PAGE = 9;

// Helper to format currency
const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return "Valor não informado";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Fetch paginated properties
async function getPaginatedProperties(page: number): Promise<PaginatedData> {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  try {
    const data = await client.fetch<PaginatedData>(paginatedPropertiesQuery, {
      start,
      end,
    });
    return data || { properties: [], totalProperties: 0 };
  } catch (error) {
    console.error("Failed to fetch paginated properties:", error);
    return { properties: [], totalProperties: 0 };
  }
}

export default async function PropertiesPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const currentPage = Number(searchParams?.page || "1");
  const { properties, totalProperties } = await getPaginatedProperties(currentPage);

  const totalPages = Math.ceil(totalProperties / ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header is in layout.tsx */}

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 dark:bg-slate-800 py-4 border-b border-border">
          <div className="container mx-auto px-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="9 18 15 12 9 6" /></svg>
                </li>
                <li>
                  <span className="font-medium text-foreground">Imóveis</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-12 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Encontre seu imóvel ideal</h1>
            <p className="mt-4 text-lg text-slate-300">
              Explore nossa seleção de imóveis de alto padrão em localizações privilegiadas
            </p>
          </div>
        </section>

        {/* Filtros e Listagem */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Back Link */}
              <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar para página inicial
              </Link>

              {/* Filters Row - Using placeholder components */}
              <div className="flex flex-wrap items-center gap-2">
                <PropertySearch />
                <PropertySort />
                <PropertyFilters />
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Exibindo {properties.length} de {totalProperties} imóveis
                {totalPages > 1 && ` (Página ${currentPage} de ${totalPages})`}
              </div>
              {/* View Toggle - Using placeholder component */}
              <PropertyViewToggle />
            </div>

            {/* Property Grid */}
            {properties && properties.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => {
                  const imageUrl = property.mainImage
                    ? urlForImage(property.mainImage)?.width(400).height(225).fit("crop").url()
                    : "/placeholder.svg?width=400&height=225";
                  return (
                    <Card
                      key={property._id}
                      className="overflow-hidden transition-all hover:shadow-lg dark:bg-slate-800"
                    >
                      <Link href={`/imoveis/${property.slug?.current || property._id}`} className="block">
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={property.title || "Imagem do Imóvel"}
                              width={400}
                              height={225}
                              className="h-full w-full object-cover transition-transform hover:scale-105"
                            />
                          )}
                        </div>
                      </Link>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-foreground">
                          {property.title || "Título Indisponível"}
                        </h3>
                        <div className="mt-2 flex items-center text-foreground/70">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span className="text-sm">{property.location || "Localização Indisponível"}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(property.price)}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-foreground/70">
                            {property.area && <span>{property.area} m²</span>}
                            {property.area && property.bedrooms && <span className="text-slate-300 dark:text-slate-600">|</span>}
                            {property.bedrooms && <span>{property.bedrooms} quartos</span>}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-slate-50 dark:bg-slate-800/50 p-4">
                        <Link href={`/imoveis/${property.slug?.current || property._id}`} className="w-full">
                          <Button className="w-full bg-primary hover:opacity-90 text-primary-foreground">
                            Ver detalhes
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum imóvel encontrado.
              </div>
            )}

            {/* Pagination - Conditionally rendered */} 
            {totalProperties > ITEMS_PER_PAGE && (
                <PropertyPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl="/imoveis"
                />
            )}
          </div>
        </section>
      </main>

      {/* Footer is in layout.tsx */}
    </div>
  );
}

