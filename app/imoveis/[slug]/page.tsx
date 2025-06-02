import Link from "next/link"
import { ArrowLeft, Bath, Bed, Car, ChevronRight, Heart, MapPin, Maximize, Share2 } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { getImageUrl } from "@/sanity/lib/image"
import { PROPERTY_QUERY, PROPERTIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import { portableTextToPlainText } from "@/sanity/lib/utils"
import type { Property, SiteSettings } from "@/types/sanity"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

async function getPropertyData(slug: string) {
  try {
    const [property, similarProperties, siteSettings] = await Promise.all([
      client.fetch<Property>(PROPERTY_QUERY, { slug }),
      client.fetch<Property[]>(PROPERTIES_QUERY),
      client.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
    ])

    return {
      property: property || null,
      similarProperties: (similarProperties || []).slice(0, 6),
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

export default async function PropertyDetails({ params }: { params: { slug: string } }) {
  const { property, similarProperties, siteSettings } = await getPropertyData(params.slug)

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
          <Link href="/imoveis">
            <Button>Voltar para imóveis</Button>
          </Link>
        </div>
      </div>
    )
  }

  const descriptionText = portableTextToPlainText(property.description)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {siteSettings?.logo ? (
              <img
                src={getImageUrl(siteSettings.logo, 150, 50) || "/placeholder.svg"}
                alt={siteSettings.title}
                className="h-8 w-auto"
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
            <Link href="/#sobre" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Sobre
            </Link>
            <Link href="/#contato" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Contato
            </Link>
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
        {/* Breadcrumb */}
        <div className="bg-slate-50 py-4">
          <div className="container">
            <div className="flex items-center text-sm text-slate-600">
              <Link href="/" className="hover:text-orange-500">
                Início
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <Link href="/imoveis" className="hover:text-orange-500">
                Imóveis
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-slate-900">{property.title}</span>
            </div>
          </div>
        </div>

        {/* Galeria de Imagens e Vídeo */}
        <section className="py-8">
          <div className="container">
            <div className="mb-6 flex items-center justify-between">
              <Link href="/imoveis" className="flex items-center text-sm font-medium text-orange-500 hover:underline">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar para imóveis
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Favoritar</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Compartilhar</span>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Imagem principal */}
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={getImageUrl(property.images?.[0], 800, 600) || "/placeholder.svg"}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Grid de imagens menores e vídeo */}
              <div className="grid grid-cols-2 gap-4">
                {/* Vídeo do YouTube (se disponível) */}
                {property.youtubeVideo && (
                  <div className="relative aspect-[9/16] overflow-hidden rounded-lg col-span-1">
                    <iframe
                      src={`https://www.youtube.com/embed/${property.youtubeVideo}?rel=0&modestbranding=1`}
                      title={`Vídeo do ${property.title}`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Imagens adicionais */}
                {property.images?.slice(1, property.youtubeVideo ? 4 : 5).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={getImageUrl(image, 400, 400) || "/placeholder.svg"}
                      alt={`${property.title} - Imagem ${index + 2}`}
                      className="h-full w-full object-cover"
                    />
                    {index === (property.youtubeVideo ? 2 : 3) &&
                      property.images.length > (property.youtubeVideo ? 4 : 5) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Button
                            variant="outline"
                            className="text-white border-white hover:text-white hover:bg-black/70"
                          >
                            <Maximize className="mr-2 h-4 w-4" />
                            Ver todas as fotos
                          </Button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
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
                  <div className="rounded-lg border bg-white p-4 text-center">
                    <Maximize className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                    <div className="text-sm text-slate-600">Área</div>
                    <div className="font-bold text-slate-900">{property.area}</div>
                  </div>
                  <div className="rounded-lg border bg-white p-4 text-center">
                    <Bed className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                    <div className="text-sm text-slate-600">Quartos</div>
                    <div className="font-bold text-slate-900">{property.bedrooms}</div>
                  </div>
                  <div className="rounded-lg border bg-white p-4 text-center">
                    <Bath className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                    <div className="text-sm text-slate-600">Banheiros</div>
                    <div className="font-bold text-slate-900">{property.bathrooms}</div>
                  </div>
                  <div className="rounded-lg border bg-white p-4 text-center">
                    <Car className="mx-auto mb-2 h-5 w-5 text-orange-500" />
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
                  <TabsContent value="description" className="mt-4 rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Sobre este imóvel</h3>
                    <div className="space-y-4 text-slate-600">
                      <p>{descriptionText}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="features" className="mt-4 rounded-lg border p-6">
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
                            className="mr-2 h-5 w-5 text-orange-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="location" className="mt-4 rounded-lg border p-6">
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
                            className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            Ver no Google Maps
                          </a>
                          {property.virtualTour && (
                            <a
                              href={property.virtualTour}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-md border border-orange-500 px-4 py-2 text-sm font-medium text-orange-500 hover:bg-orange-50"
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
                          <p className="text-slate-500">Mapa da localização</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Imóveis Similares */}
                {similarProperties.length > 0 && (
                  <div className="mb-8">
                    <h3 className="mb-6 text-xl font-bold text-slate-900">Imóveis similares</h3>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {similarProperties
                          .filter((p) => p._id !== property._id)
                          .map((similarProperty) => (
                            <CarouselItem key={similarProperty._id} className="md:basis-1/2 lg:basis-1/3">
                              <Card className="overflow-hidden">
                                <div className="aspect-video w-full overflow-hidden">
                                  <img
                                    src={getImageUrl(similarProperty.images?.[0], 400, 300) || "/placeholder.svg"}
                                    alt={similarProperty.title}
                                    className="h-full w-full object-cover transition-transform hover:scale-105"
                                  />
                                </div>
                                <CardContent className="p-4">
                                  <h4 className="font-bold text-slate-900">{similarProperty.title}</h4>
                                  <div className="mt-1 flex items-center text-slate-500">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span className="text-xs">{similarProperty.location}</span>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="font-bold text-orange-500">{similarProperty.price}</span>
                                    <Link
                                      href={`/imoveis/${similarProperty.slug.current}`}
                                      className="text-xs text-orange-500 hover:underline"
                                    >
                                      Ver detalhes
                                    </Link>
                                  </div>
                                </CardContent>
                              </Card>
                            </CarouselItem>
                          ))}
                      </CarouselContent>
                      <div className="flex justify-center gap-2 mt-4">
                        <CarouselPrevious className="relative inset-0 translate-y-0" />
                        <CarouselNext className="relative inset-0 translate-y-0" />
                      </div>
                    </Carousel>
                  </div>
                )}
              </div>

              {/* Sidebar com informações de contato e preço */}
              <div>
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="mb-4 text-center">
                      <div className="text-sm text-slate-600">Valor</div>
                      <div className="text-3xl font-bold text-orange-500">{property.price}</div>
                    </div>
                    {(property.condoFee || property.tax) && (
                      <div className="mb-6 border-t border-b py-4">
                        <div className="grid grid-cols-2 gap-4">
                          {property.condoFee && (
                            <div className="text-center">
                              <div className="text-sm text-slate-600">Condomínio</div>
                              <div className="font-medium text-slate-900">{property.condoFee}</div>
                            </div>
                          )}
                          {property.tax && (
                            <div className="text-center">
                              <div className="text-sm text-slate-600">IPTU</div>
                              <div className="font-medium text-slate-900">{property.tax}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">Agendar visita</Button>
                      <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50">
                        Entrar em contato
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Fale com o corretor</h3>
                    <div className="mb-6 flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-full">
                        <img
                          src="/placeholder.svg?height=200&width=200"
                          alt="Corretor"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Marcelo Victor</div>
                        <div className="text-sm text-slate-600">Especialista em imóveis de alto padrão</div>
                      </div>
                    </div>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-700">
                          Nome
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-700">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                          Telefone
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-slate-700">
                          Mensagem
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="Olá, tenho interesse neste imóvel e gostaria de mais informações."
                        ></textarea>
                      </div>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">Enviar mensagem</Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
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
                <Link href="/#sobre" className="text-slate-600 hover:text-orange-500">
                  Sobre
                </Link>
                <Link href="/#contato" className="text-slate-600 hover:text-orange-500">
                  Contato
                </Link>
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
