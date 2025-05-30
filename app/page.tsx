import Link from "next/link"
import { ChevronRight, MapPin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { client } from "@/lib/sanity.client"
import { featuredPropertiesQuery, settingsQuery } from "@/lib/sanity.queries"
import Image from "next/image"

export default async function Home() {
  const [settings, properties] = await Promise.all([
    client.fetch(settingsQuery),
    client.fetch(featuredPropertiesQuery),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={settings.logoUrl} alt="Logo" width={120} height={40} className="h-auto w-auto" />
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#inicio" className="text-sm font-medium text-slate-900 hover:text-blue-900">Início</Link>
            <Link href="#imoveis" className="text-sm font-medium text-slate-600 hover:text-blue-900">Imóveis</Link>
            <Link href="#sobre" className="text-sm font-medium text-slate-600 hover:text-blue-900">Sobre</Link>
            <Link href="#depoimentos" className="text-sm font-medium text-slate-600 hover:text-blue-900">Depoimentos</Link>
            <Link href="#contato" className="text-sm font-medium text-slate-600 hover:text-blue-900">Contato</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[80vh] w-full overflow-hidden" id="inicio">
          <Carousel className="absolute inset-0 h-full w-full">
            <CarouselContent>
              {settings.bannerUrls?.map((url: string, index: number) => (
                <CarouselItem key={index} className="h-full w-full">
                  <div className="relative h-full w-full">
                    <Image
                      src={url}
                      alt={`Banner ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/30" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="container relative z-10 flex h-full flex-col items-start justify-center gap-4 text-white">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{settings.title || 'Seu novo lar começa aqui'}</h1>
            <p className="max-w-xl text-xl font-light text-slate-100 md:text-2xl">{settings.subtitle || 'Encontre os melhores imóveis com a gente'}</p>
            <Link href="#imoveis">
              <Button className="mt-4 bg-blue-900 hover:bg-blue-800" size="lg">
                Ver Imóveis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section id="imoveis" className="py-16 bg-slate-50">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Imóveis em Destaque</h2>
              <p className="mt-4 text-lg text-slate-600">Conheça as melhores oportunidades disponíveis no mercado</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property: any, index: number) => (
                <Card key={property._id || index} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video w-full overflow-hidden">
                    <Image
                      src={property.mainImageUrl || "/placeholder.svg"}
                      alt={property.title}
                      width={800}
                      height={600}
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
                      <span className="text-lg font-bold text-blue-900">{property.price}</span>
                      <div className="flex items-center gap-1 text-sm">
                        <span>{property.area}</span>
                        <span className="text-slate-300">|</span>
                        <span>{property.bedrooms} quartos</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 p-4">
                    <Link href={`/imoveis/${property.slug?.current}`} className="w-full">
                      <Button className="w-full bg-blue-900 hover:bg-blue-800">Ver detalhes</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/imoveis">
                <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                  Ver todos os imóveis
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
