import Link from "next/link"
import { groq } from "next-sanity"
import { ArrowLeft, Bath, Bed, Car, ChevronRight, Heart, MapPin, Maximize } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { getImageUrl } from "@/sanity/lib/image"
import { formatCurrency } from "@/lib/format-currency"
import { PROPERTY_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import { portableTextToPlainText } from "@/sanity/lib/utils"
import type { Property, SiteSettings, SanityImage } from "@/types/sanity"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyCard } from "@/components/property-card"
import { PropertyShareButton } from "@/components/property-share-button"
import { LeadCaptureButton } from "@/components/lead-capture-button"
import { LeadContactForm } from "@/components/lead-contact-form"
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
      images: property.images?.[0] ? [getImageUrl(property.images[0], 1200, 630)] : [],
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
            <div className="flex gap-2 items-center">
              <Button variant="outline" size="icon" className="rounded-full hover:text-red-500" title="Favoritar">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Favoritar</span>
              </Button>
              <PropertyShareButton property={property} />
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
                {/* Indicador de navegação */}
                <p className="text-xs text-slate-400 text-center mb-3 flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 15l-6-6M9 15l6-6"/></svg>
                  Selecione uma seção para visualizar
                </p>
                <TabsList className={`grid w-full h-auto p-1.5 gap-2 bg-slate-100 rounded-xl border border-slate-200 ${property.virtualTour ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  <TabsTrigger
                    value="description"
                    className="
                      flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg
                      text-slate-500 font-medium transition-all duration-200
                      data-[state=active]:bg-white data-[state=active]:text-brand-primary
                      data-[state=active]:shadow-md data-[state=active]:font-bold
                      data-[state=active]:scale-[1.02]
                      hover:text-slate-700 hover:bg-white/60
                    "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <span className="text-xs sm:text-sm">Descrição</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="features"
                    className="
                      flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg
                      text-slate-500 font-medium transition-all duration-200
                      data-[state=active]:bg-white data-[state=active]:text-brand-primary
                      data-[state=active]:shadow-md data-[state=active]:font-bold
                      data-[state=active]:scale-[1.02]
                      hover:text-slate-700 hover:bg-white/60
                    "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    <span className="text-xs sm:text-sm">Características</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="location"
                    className="
                      flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg
                      text-slate-500 font-medium transition-all duration-200
                      data-[state=active]:bg-white data-[state=active]:text-brand-primary
                      data-[state=active]:shadow-md data-[state=active]:font-bold
                      data-[state=active]:scale-[1.02]
                      hover:text-slate-700 hover:bg-white/60
                    "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className="text-xs sm:text-sm">Localização</span>
                  </TabsTrigger>

                  {property.virtualTour && (
                    <TabsTrigger
                      value="virtual-tour"
                      className="
                        flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg
                        text-slate-500 font-medium transition-all duration-200
                        data-[state=active]:bg-white data-[state=active]:text-brand-primary
                        data-[state=active]:shadow-md data-[state=active]:font-bold
                        data-[state=active]:scale-[1.02]
                        hover:text-slate-700 hover:bg-white/60
                      "
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
                      </svg>
                      <span className="text-xs sm:text-sm">Tour 360°</span>
                    </TabsTrigger>
                  )}
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
                {property.virtualTour && (
                  <TabsContent value="virtual-tour" className="mt-4 rounded-lg border p-6 bg-white shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Tour Virtual 360°</h3>
                    <div className="aspect-video overflow-hidden rounded-lg bg-slate-100">
                      <iframe
                        src={property.virtualTour}
                        className="h-full w-full border-0"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-4">
                      <a
                        href={property.virtualTour}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md border border-brand-primary px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                      >
                        <Maximize className="mr-2 h-4 w-4" />
                        Ver em tela cheia
                      </a>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
              
              {/* Formulário de Contato Direto */}
              <div className="mb-12">
                <LeadContactForm propertyTitle={property.title} propertySlug={property.slug.current} />
              </div>

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
                    <LeadCaptureButton
                      propertyTitle={property.title}
                      propertyLocation={property.location}
                      propertyPrice={formatCurrency(property.price)}
                      propertySlug={property.slug.current}
                      whatsappNumber={siteSettings?.whatsapp || "5511999999999"}
                    />
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
                                : getImageUrl(siteSettings.brokerPhoto as SanityImage, 200, 200))
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
