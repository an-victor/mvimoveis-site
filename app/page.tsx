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
import { PropertyCard } from "@/components/property-card"

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
    <>
      {/* Banner com Imagens em Destaque */}
      <BannerCarousel images={siteSettings?.bannerImages || []} />

      {/* Hero Section com Texto - COM PARALLAX */}
      <section
        className="py-16 relative bg-fixed bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80')`,
        }}
      >
        <div className="container text-center relative z-10">
          <p className="mb-4 text-xl font-light text-white/90">
            {siteSettings?.heroSubtitle || "Marcelo Victor - Corretor de Imóveis"}
          </p>
          <h1 className="max-w-4xl mx-auto text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {siteSettings?.heroTitle ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: siteSettings.heroTitle.replace(
                    /Seus Sonhos/g,
                    '<span class="text-orange-400">Seus Sonhos</span>',
                  ),
                }}
              />
            ) : (
              <>
                Encontre o Imóvel dos <span className="text-orange-400">Seus Sonhos</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90">
            {siteSettings?.heroDescription ||
              "Mais de 15 anos de experiência ajudando famílias a encontrar o lar perfeito. Venda, compra e locação com total segurança e transparência."}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            {siteSettings?.whatsapp && (
              <Link href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}>
                <Button className="bg-brand-primary hover:bg-brand-secondary shadow-lg" size="lg">
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
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Falar no WhatsApp
                </Button>
              </Link>
            )}
            <Link href="/imoveis">
              <Button
                variant="outline"
                className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white shadow-lg"
                size="lg"
              >
                Ver Imóveis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Imóveis em Destaque */}
      <section id="imoveis" className="py-16 bg-slate-50">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Imóveis em Destaque</h2>
            <p className="mt-4 text-lg text-slate-600">Conheça as melhores oportunidades disponíveis no mercado</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/imoveis">
              <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-orange-50">
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

      {/* Depoimentos - COM PARALLAX */}
      <section
        id="depoimentos"
        className="py-16 relative bg-fixed bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2096&q=80')`,
        }}
      >
        <div className="container relative z-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">O que dizem nossos clientes</h2>
            <p className="mt-4 text-lg text-white/90">
              A satisfação de quem já realizou o sonho da casa própria com nossa ajuda
            </p>
          </div>
          {testimonials.length > 0 ? (
            <Carousel className="mx-auto max-w-4xl">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial._id}>
                    <div className="rounded-lg border bg-white/95 backdrop-blur-sm p-8 shadow-xl">
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
                <CarouselPrevious className="relative inset-0 translate-y-0 bg-white/20 border-white/30 text-white hover:bg-white/30" />
                <CarouselNext className="relative inset-0 translate-y-0 bg-white/20 border-white/30 text-white hover:bg-white/30" />
              </div>
            </Carousel>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/80 mb-4">Nenhum depoimento cadastrado ainda.</p>
              <p className="text-sm text-white/60">Acesse o Sanity Studio para adicionar depoimentos de clientes.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action - WhatsApp */}
      <section id="contato" className="py-20 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center text-white">
            <div className="mb-8">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Pronto para Encontrar seu Imóvel?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Fale comigo agora mesmo pelo WhatsApp e receba atendimento personalizado para encontrar o imóvel dos
                seus sonhos!
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Atendimento Imediato</h3>
                <p className="text-orange-100 text-sm">Resposta rápida e personalizada para suas dúvidas</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Consultoria Gratuita</h3>
                <p className="text-orange-100 text-sm">Análise completa das suas necessidades sem custo</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H18V0h-2v2H8V0H6v2H3.5C2.67 2 2 2.67 2 3.5v15C2 19.33 2.67 20 3.5 20h17c.83 0 1.5-.67 1.5-1.5v-15C22 2.67 21.33 2 20.5 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Visitas Agendadas</h3>
                <p className="text-orange-100 text-sm">Organize visitas nos horários mais convenientes</p>
              </div>
            </div>

            <div className="space-y-6">
              {siteSettings?.whatsapp && (
                <a
                  href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}?text=Olá! Tenho interesse em conhecer os imóveis disponíveis. Gostaria de receber mais informações.`}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-green-700 bg-white rounded-full hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488" />
                  </svg>
                  Falar no WhatsApp Agora
                </a>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-orange-100">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="text-sm">Resposta em até 5 minutos</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="text-sm">Atendimento personalizado</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="text-sm">Sem compromisso</span>
                </div>
              </div>

              <p className="text-orange-200 text-sm max-w-md mx-auto">
                Ou ligue diretamente: {siteSettings?.phone || "(11) 99999-9999"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
