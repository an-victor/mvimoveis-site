import Link from "next/link"
import { ChevronRight, Star } from "lucide-react"
import { client } from "@/sanity/lib/client"
import { getImageUrl } from "@/sanity/lib/image"
import { FEATURED_PROPERTIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import type { Property, Testimonial, SiteSettings } from "@/types/sanity"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { BannerCarousel } from "@/components/banner-carousel"
import { PropertyCard } from "@/components/property-card"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { HeroWhatsAppButton } from "@/components/hero-whatsapp-button"

// Revalidar a página a cada 1 hora (3600 segundos) para rotacionar os imóveis em destaque
export const revalidate = 60

// Função simples de shuffle com semente para garantir ordem consistente na mesma hora
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array]
  let m = result.length, t, i
  
  // Algoritmo Fisher-Yates com semente
  while (m) {
    // Gerador de número pseudo-aleatório baseado na semente
    const x = Math.sin(seed++) * 10000
    i = Math.floor((x - Math.floor(x)) * m--)
    
    t = result[m]
    result[m] = result[i]
    result[i] = t
  }
  
  return result
}

async function getHomeData() {
  try {
    const [allFeaturedProperties, testimonials, siteSettings] = await Promise.all([
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

    // Lógica de rotação a cada 60 minutos
    let featuredProperties = allFeaturedProperties || []
    
    if (featuredProperties.length > 9) {
      // Semente baseada na hora atual desde o epoch (muda a cada 60 min)
      const currentHourSeed = Math.floor(Date.now() / (1000 * 60 * 60))
      featuredProperties = seededShuffle(featuredProperties, currentHourSeed).slice(0, 9)
    } else {
      // Se houver 9 ou menos, apenas limita o máximo
      featuredProperties = featuredProperties.slice(0, 9)
    }

    return {
      featuredProperties,
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
          <div className="glass-panel p-10 rounded-2xl max-w-4xl mx-auto transform transition-all duration-700 hover:scale-[1.01]">
            <p className="mb-4 text-xl font-medium tracking-wide text-orange-400 uppercase drop-shadow-sm">
              {siteSettings?.heroSubtitle || "Marcelo Victor - Corretor de Imóveis"}
            </p>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl drop-shadow-md leading-tight">
              {siteSettings?.heroTitle ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: siteSettings.heroTitle.replace(
                      /Seus Sonhos/g,
                      '<span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Seus Sonhos</span>',
                    ),
                  }}
                />
              ) : (
                <>
                  Encontre o Imóvel dos <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Seus Sonhos</span>
                </>
              )}
            </h1>
            <p className="mt-8 text-lg md:text-xl text-slate-200 font-light leading-relaxed max-w-2xl mx-auto">
              {siteSettings?.heroDescription ||
                "Mais de 15 anos de experiência ajudando famílias a encontrar o lar perfeito. Venda, compra e locação com total segurança e transparência."}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            {siteSettings?.whatsapp && (
              <HeroWhatsAppButton whatsappNumber={siteSettings.whatsapp} />
            )}
            <Button
              asChild
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-full px-8"
              size="lg"
            >
              <Link href="/imoveis">
                Ver Imóveis
                <ChevronRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          </div>
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
            <Button asChild variant="outline" className="border-brand-primary text-brand-primary hover:bg-orange-50">
              <Link href="/imoveis">
                Ver todos os imóveis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sobre o Corretor */}
      <AboutSection siteSettings={siteSettings} />

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
      <ContactSection siteSettings={siteSettings} />
    </>
  )
}
