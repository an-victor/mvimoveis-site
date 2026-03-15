import Link from "next/link"
import { groq } from "next-sanity"
import { ArrowLeft, Bath, Bed, Car, ChevronRight, Heart, MapPin, Maximize, Share2 } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { getImageUrl } from "@/sanity/lib/image"
import { formatCurrency } from "@/lib/format-currency"
import { PROPERTY_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import { portableTextToPlainText } from "@/sanity/lib/utils"
import type { Property, SiteSettings } from "@/types/sanity"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyCard } from "@/components/property-card"
import type { Metadata } from "next"

async function getPropertyData(slug: string) {
  try {
    const [property, similarProperties, siteSettings] = await Promise.all([
      client.fetch<Property>(PROPERTY_QUERY, { slug }),
      client.fetch<Property[]>(
        groq`*[_type == "property" && status == "available"] | order(_createdAt desc) [0...7] {
          _id, title, slug, price, location, area, bedrooms, bathrooms, parkingSpots, images, featured, status, type
        }`
      ),
      client.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
    ])

    return {
      property: property || null,
      similarProperties: (similarProperties || []).slice(0, 7),
      siteSettings: siteSettings || null,
    }
  } catch (error) {
    console.error("Error fetching property data:", error)
    return {
      property: null,
      similarProperties: [],
      siteSettings: null,
    }
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { property, siteSettings } = await getPropertyData(slug)
  
  if (!property) return {}

  const description = portableTextToPlainText(property.description).slice(0, 160)
  
  return {
    title: `${property.title} | ${siteSettings?.title || "Marcelo Victor Imóveis"}`,
    description: description || siteSettings?.description,
    openGraph: {
      title: property.title,
      description: description,
      images: property.images?.[0] ? [getImageUrl(property.images[0] as any, 1200, 630)] : [],
    },
  }
}

export default async function PropertyDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { property, similarProperties, siteSettings } = await getPropertyData(slug)

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-slate-900">Imóvel não encontrado</h1>
          <Link href="/imoveis">
            <Button className="bg-brand-primary hover:bg-brand-secondary">Voltar para imóveis</Button>
          </Link>
        </div>
      </div>
    )
  }

  const descriptionText = portableTextToPlainText(property.description)

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="bg-slate-50 py-4">
        <div className="container">
          <div className="flex items-center text-sm text-slate-600">
            <Link href="/" className="hover:text-brand-primary transition-colors">
              Início
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link href="/imoveis" className="hover:text-brand-primary transition-colors">
              Imóveis
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-slate-900 font-medium">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Galeria de Imagens e Vídeo */}
      <section className="py-8">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/imoveis" className="flex items-center text-sm font-medium text-brand-primary hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar para imóveis
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full hover:text-red-500">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Favoritar</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:text-brand-primary">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Compartilhar</span>
              </Button>
            </div>
          </div>

          <PropertyGallery property={property} />
        </div>
      </section>

      {/* Informações do Imóvel */}
      <section className="py-8">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-slate-900">{property.title}</h1>
                <div className="flex items-center text-slate-600">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{property.location}</span>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border bg-white p-4 text-center shadow-sm">
                  <Maximize className="mx-auto mb-2 h-5 w-5 text-brand-primary" />
                  <div className="text-sm text-slate-600">Área</div>
                  <div className="font-bold text-slate-900">{property.area}</div>
                </div>
                <div className="rounded-lg border bg-white p-4 text-center shadow-sm">
                  <Bed className="mx-auto mb-2 h-5 w-5 text-brand-primary" />
                  <div className="text-sm text-slate-600">Quartos</div>
                  <div className="font-bold text-slate-900">{property.bedrooms}</div>
                </div>
                <div className="rounded-lg border bg-white p-4 text-center shadow-sm">
                  <Bed className="mx-auto mb-2 h-5 w-5 text-brand-primary" />
                  {/* Note: In the original it was Bed for both Bedrooms and Bathrooms icons sometimes, let's use Bath for bathrooms */}
                  <div className="text-sm text-slate-600">Banheiros</div>
                  <div className="font-bold text-slate-900">{property.bathrooms}</div>
                </div>
                <div className="rounded-lg border bg-white p-4 text-center shadow-sm">
                  <Car className="mx-auto mb-2 h-5 w-5 text-brand-primary" />
                  <div className="text-sm text-slate-600">Vagas</div>
                  <div className="font-bold text-slate-900">{property.parkingSpots}</div>
                </div>
              </div>

              <Tabs defaultValue="description" className="mb-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Descrição</TabsTrigger>
                  <TabsTrigger value="features">Características</TabsTrigger>
                  <TabsTrigger value="location">Localização</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4 rounded-lg border p-6 bg-white shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">Sobre este imóvel</h3>
                  <div className="space-y-4 text-slate-600 leading-relaxed">
                    <p>{descriptionText}</p>
                  </div>
                </TabsContent>
                <TabsContent value="features" className="mt-4 rounded-lg border p-6 bg-white shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">Características e diferenciais</h3>
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
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
                          className="mr-2 h-5 w-5 text-brand-primary"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="location" className="mt-4 rounded-lg border p-6 bg-white shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">Localização</h3>
                  <div className="mb-4 text-slate-600">
                    <p>{property.location}</p>
                    <p className="mt-2">
                      Excelente localização com fácil acesso a transporte público, comércio, restaurantes e áreas de
                      lazer.
                    </p>
                  </div>

                  {property.mapUrl ? (
                    <div className="space-y-4">
                      <div className="aspect-video overflow-hidden rounded-lg">
                        <iframe
                          src={property.mapUrl.replace("/maps/", "/maps/embed?")}
                          className="h-full w-full border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={property.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-secondary transition-colors"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Ver no Google Maps
                        </a>
                        {property.virtualTour && (
                          <a
                            href={property.virtualTour}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-md border border-brand-primary px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                          >
                            <Maximize className="mr-2 h-4 w-4" />
                            Tour Virtual 360°
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video overflow-hidden rounded-lg bg-slate-200">
                      <div className="flex h-full items-center justify-center">
                        <p className="text-slate-500">Mapa da localização indisponível</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Imóveis Similares */}
              {similarProperties.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-6 text-xl font-bold text-slate-900">Imóveis similares</h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {similarProperties
                      .filter((p) => p._id !== property._id)
                      .slice(0, 3)
                      .map((similarProperty) => (
                        <PropertyCard key={similarProperty._id} property={similarProperty} />
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar com informações de contato e preço */}
            <div>
              <div className="sticky top-24 space-y-6">
                <div className="rounded-lg border bg-white p-6 shadow-md">
                  <div className="mb-4 text-center">
                    <div className="text-sm text-slate-600 uppercase tracking-wider font-semibold">Valor do Imóvel</div>
                    <div className="text-3xl font-bold text-brand-primary">{formatCurrency(property.price)}</div>
                  </div>
                  {(property.condoFee || property.tax) && (
                    <div className="mb-6 border-t border-b py-4">
                      <div className="grid grid-cols-2 gap-4">
                        {property.condoFee && (
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Condomínio</div>
                            <div className="font-medium text-slate-900">{formatCurrency(property.condoFee)}</div>
                          </div>
                        )}
                        {property.tax && (
                          <div className="text-center">
                            <div className="text-sm text-slate-600">IPTU</div>
                            <div className="font-medium text-slate-900">{formatCurrency(property.tax)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    <Button className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-6">
                      Agendar visita
                    </Button>
                    {siteSettings?.whatsapp && (
                      <a
                        href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}?text=Olá! Tenho interesse no imóvel: ${property.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-md border-2 border-brand-primary px-4 py-3 text-sm font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                      >
                        Falar com Marcelo Victor
                      </a>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-md">
                  <h3 className="mb-4 text-lg font-bold text-slate-900 border-b pb-2">Sobre o Corretor</h3>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-brand-primary">
                      <img
                        src="/placeholder-user.jpg"
                        alt="Marcelo Victor"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Marcelo Victor</div>
                      <div className="text-sm text-slate-600">Especialista imobiliário</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 italic">
                    "Meu compromisso é encontrar o lar ideal para você e sua família com total transparência e dedicação."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
