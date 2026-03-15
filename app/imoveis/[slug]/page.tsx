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
                  <div className="text-slate-600 leading-relaxed space-y-3">
                    {descriptionText
                      .split("\n")
                      .map((line, i) =>
                        line.trim() === "" ? (
                          <br key={i} />
                        ) : (
                          <p key={i}>{line}</p>
                        )
                      )}
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
                    <a
                      href={`https://wa.me/${(siteSettings?.whatsapp || "").replace(/\D/g, "") || "5511999999999"}?text=${encodeURIComponent(`Olá! Tenho interesse em agendar uma visita para o imóvel: *${property.title}*\n📍 ${property.location}\n💰 ${property.price}\n\nPoderia me dar mais informações?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-green-500 hover:bg-green-600 px-4 py-4 text-base font-bold text-white transition-all shadow-md hover:shadow-lg"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Agendar Visita via WhatsApp
                    </a>
                  </div>
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-md">
                  <h3 className="mb-4 text-lg font-bold text-slate-900 border-b pb-2">Sobre o Corretor</h3>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-brand-primary flex-shrink-0">
                      <img
                        src={
                          siteSettings?.brokerPhoto
                            ? (typeof siteSettings.brokerPhoto === 'string'
                                ? siteSettings.brokerPhoto
                                : getImageUrl(siteSettings.brokerPhoto as any, 200, 200))
                            : "/placeholder-user.jpg"
                        }
                        alt={siteSettings?.brokerName || "Corretor"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {siteSettings?.brokerName || "Marcelo Victor"}
                      </div>
                      <div className="text-sm text-slate-500">
                        {siteSettings?.brokerTitle || "Especialista Imobiliário"}
                      </div>
                    </div>
                  </div>
                  {(siteSettings?.brokerBio) && (
                    <div className="text-sm text-slate-600 italic border-t pt-4">
                      &ldquo;{siteSettings.brokerBio}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
