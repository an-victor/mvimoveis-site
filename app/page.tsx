import Link from "next/link"
import { ChevronRight, MapPin, Star } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { getImageUrl } from "@/sanity/lib/image"
import { formatCurrency } from "@/lib/format-currency"
import { FEATURED_PROPERTIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import type { Property, Testimonial, SiteSettings } from "@/types/sanity"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { BannerCarousel } from "@/components/banner-carousel"
import { NavigationLink } from "@/components/navigation-link"

async function getHomeData() {
  try {
    const [featuredProperties, testimonials, siteSettings] = await Promise.all([
      client.fetch<Property[]>(FEATURED_PROPERTIES_QUERY),
      client.fetch<Testimonial[]>(`*[_type == "testimonial"] | order(_createdAt desc) [0...6] {
  _id,
  name,
  location,
  text,
  avatar,
  rating
}`),
      client.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
    ])

    return {
      featuredProperties: featuredProperties || [],
      testimonials: testimonials || [],
      siteSettings: siteSettings || null,
    }
  } catch (error) {
    console.error("Error fetching home data:", error)
    return {
      featuredProperties: [],
      testimonials: [],
      siteSettings: null,
    }
  }
}

export default async function Home() {
  const { featuredProperties, testimonials, siteSettings } = await getHomeData()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="absolute top-0 z-50 w-full">
        <div className="container flex h-40 items-center justify-between">
          <div className="flex items-center gap-2">
            {siteSettings?.logo ? (
              <img
                src={getImageUrl(siteSettings.logo, 150, 80) || "/placeholder.svg"}
                alt={siteSettings.title}
                className="h-20 w-auto"
              />
            ) : (
              <span className="text-2xl font-bold text-orange-500">{siteSettings?.title || "Marcelo Victor"}</span>
            )}
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-base font-medium text-white hover:text-orange-300">
              Home
            </Link>
            <Link href="/imoveis" className="text-base font-medium text-white hover:text-orange-300">
              Imóveis
            </Link>
            <NavigationLink href="/#sobre" className="text-base font-medium text-white hover:text-orange-300">
              Sobre
            </NavigationLink>
            <NavigationLink href="/#contato" className="text-base font-medium text-white hover:text-orange-300">
              Contato
            </NavigationLink>
          </nav>
          {siteSettings?.whatsapp && (
            <Link
              href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
              className="hidden md:inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
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
              WhatsApp
            </Link>
          )}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
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
        <BannerCarousel images={siteSettings?.bannerImages || []}>
          <div className="container relative flex h-full flex-col items-center justify-center text-center text-white">
            <p className="mb-2 text-xl font-light">
              {siteSettings?.heroSubtitle || "Marcelo Victor - Corretor de Imóveis"}
            </p>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              {siteSettings?.heroTitle ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: siteSettings.heroTitle.replace(
                      /Seus Sonhos/g,
                      '<span class="text-orange-500">Seus Sonhos</span>',
                    ),
                  }}
                />
              ) : (
                <>
                  Encontre o Imóvel dos <span className="text-orange-500">Seus Sonhos</span>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-100">
              {siteSettings?.heroDescription ||
                "Mais de 15 anos de experiência ajudando famílias a encontrar o lar perfeito. Venda, compra e locação com total segurança e transparência."}
            </p>
            <div className="mt-10 flex gap-4">
              {siteSettings?.whatsapp && (
                <Link href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}>
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600" size="lg">
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
                      className="mr-2 h-5 w-5"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    Falar no WhatsApp
                  </Button>
                </Link>
              )}
              <Link href="/imoveis">
                <Button className="mt-4 bg-white text-slate-900 hover:bg-slate-100" size="lg">
                  Ver Imóveis
                </Button>
              </Link>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
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
                className="h-8 w-8"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
              <span className="sr-only">Role para baixo</span>
            </div>
          </div>
        </BannerCarousel>

        {/* Imóveis em Destaque */}
        <section id="imoveis" className="py-16 bg-slate-50">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Imóveis em Destaque</h2>
              <p className="mt-4 text-lg text-slate-600">Conheça as melhores oportunidades disponíveis no mercado</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
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
            <div className="mt-12 text-center">
              <Link href="/imoveis">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                  Ver todos os imóveis
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Sobre o Corretor */}
        <section id="sobre" className="py-16">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="relative aspect-square overflow-hidden rounded-lg md:aspect-auto md:h-[600px]">
                <img
                  src={getImageUrl(siteSettings?.aboutImage, 600, 600) || "/placeholder.svg"}
                  alt={siteSettings?.aboutTitle || "Sobre o corretor"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {siteSettings?.aboutTitle || "Sobre Marcelo Victor"}
                </h2>
                <p className="text-lg text-slate-600">
                  {siteSettings?.aboutDescription ||
                    "Com mais de 15 anos de experiência no mercado imobiliário, me dedico a encontrar o imóvel perfeito para cada cliente, entendendo suas necessidades e oferecendo um atendimento personalizado do início ao fim."}
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-900">Atendimento Personalizado</h3>
                    <p className="text-slate-600">
                      Cada cliente recebe atenção exclusiva e dedicada às suas necessidades específicas.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-900">Especialista em Alto Padrão</h3>
                    <p className="text-slate-600">
                      Conhecimento profundo do mercado de imóveis de luxo e suas particularidades.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-900">Negociação Transparente</h3>
                    <p className="text-slate-600">
                      Processos claros e objetivos para garantir a melhor experiência na compra ou venda.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-900">Suporte Contínuo</h3>
                    <p className="text-slate-600">
                      Acompanhamento em todas as etapas, desde a visita até a finalização do contrato.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" className="py-16 bg-slate-50">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                O que dizem nossos clientes
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                A satisfação de quem já realizou o sonho da casa própria com nossa ajuda
              </p>
            </div>
            {testimonials.length > 0 ? (
              <Carousel className="mx-auto max-w-4xl">
                <CarouselContent>
                  {testimonials.map((testimonial) => (
                    <CarouselItem key={testimonial._id}>
                      <div className="rounded-lg border bg-white p-8 shadow-sm">
                        <div className="mb-4 flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="mb-6 text-lg italic text-slate-600">"{testimonial.text}"</blockquote>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 overflow-hidden rounded-full">
                            <img
                              src={getImageUrl(testimonial.avatar, 100, 100) || "/placeholder.svg"}
                              alt={testimonial.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{testimonial.name}</div>
                            <div className="text-sm text-slate-500">{testimonial.location}</div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-6">
                  <CarouselPrevious className="relative inset-0 translate-y-0" />
                  <CarouselNext className="relative inset-0 translate-y-0" />
                </div>
              </Carousel>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">Nenhum depoimento cadastrado ainda.</p>
                <p className="text-sm text-slate-400">Acesse o Sanity Studio para adicionar depoimentos de clientes.</p>
              </div>
            )}
          </div>
        </section>

        {/* Formulário de Contato */}
        <section id="contato" className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Entre em contato</h2>
                <p className="mt-4 text-lg text-slate-600">
                  Estou à disposição para ajudar você a encontrar o imóvel dos seus sonhos
                </p>
              </div>
              <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <div className="grid md:grid-cols-2">
                  <div className="bg-orange-500 p-8 text-white">
                    <h3 className="mb-6 text-xl font-bold">Informações de Contato</h3>
                    <div className="space-y-4">
                      {siteSettings?.phone && (
                        <div className="flex items-start gap-3">
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
                            className="h-5 w-5 shrink-0"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <div>
                            <div className="text-sm font-medium text-white/70">Telefone</div>
                            <div>{siteSettings.phone}</div>
                          </div>
                        </div>
                      )}
                      {siteSettings?.email && (
                        <div className="flex items-start gap-3">
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
                            className="h-5 w-5 shrink-0"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          <div>
                            <div className="text-sm font-medium text-white/70">Email</div>
                            <div>{siteSettings.email}</div>
                          </div>
                        </div>
                      )}
                      {siteSettings?.address && (
                        <div className="flex items-start gap-3">
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
                            className="h-5 w-5 shrink-0"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <div>
                            <div className="text-sm font-medium text-white/70">Endereço</div>
                            <div>{siteSettings.address}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-8">
                      <h4 className="mb-3 text-sm font-medium text-white/70">Redes Sociais</h4>
                      <div className="flex gap-4">
                        {siteSettings?.facebook && (
                          <a href={siteSettings.facebook} className="text-white hover:text-white/80">
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
                              className="h-5 w-5"
                            >
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                          </a>
                        )}
                        {siteSettings?.instagram && (
                          <a href={siteSettings.instagram} className="text-white hover:text-white/80">
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
                              className="h-5 w-5"
                            >
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                          </a>
                        )}
                        {siteSettings?.linkedin && (
                          <a href={siteSettings.linkedin} className="text-white hover:text-white/80">
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
                              className="h-5 w-5"
                            >
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                              <rect x="2" y="9" width="4" height="12" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <form className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
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
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="whatsapp" className="text-sm font-medium text-slate-700">
                          WhatsApp
                        </label>
                        <input
                          id="whatsapp"
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
                          placeholder="Como posso ajudar você?"
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
