
'use client'

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, ChevronRight } from "lucide-react"
import { urlForImage } from "@/lib/sanity.image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function formatCurrency(value) {
  if (!value) return "Sob consulta"
  if (typeof value === "string" && value.startsWith("R$")) return value
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))
}

export default function HomeClient({ settings, properties }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">Carlos Imóveis</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/">Início</Link>
            <Link href="/imoveis">Imóveis</Link>
            <Link href="#sobre">Sobre</Link>
            <Link href="#depoimentos">Depoimentos</Link>
            <Link href="#contato">Contato</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[80vh] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/30" />
          </div>
          <div className="container relative flex h-full flex-col items-start justify-center gap-4 text-white">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Carlos Rodrigues</h1>
            <p className="max-w-xl text-xl font-light text-slate-100 md:text-2xl">Seu novo lar começa aqui</p>
            <Link href="/imoveis">
              <Button className="mt-4 bg-blue-900 hover:bg-blue-800" size="lg">
                Ver Imóveis <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section id="imoveis" className="py-16 bg-slate-50">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Imóveis em Destaque</h2>
              <p className="mt-4 text-lg text-slate-600">
                Conheça as melhores oportunidades disponíveis no mercado
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property, index) => {
                const image = property.images?.[0]
                return (
                  <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-video w-full overflow-hidden">
                      <Image
                        src={image ? urlForImage(image).url() : "/placeholder.svg"}
                        alt={property.title}
                        width={image?.width || 800}
                        height={image?.height || 600}
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
                        <span className="text-lg font-bold text-blue-900">{formatCurrency(property.price)}</span>
                        <div className="flex items-center gap-1 text-sm">
                          <span>{property.details.area}</span>
                          <span className="text-slate-300">|</span>
                          <span>{property.details.bedrooms} quartos</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50 p-4">
                      <Link href={`/imoveis/${property.id}`} className="w-full">
                        <Button className="w-full bg-blue-900 hover:bg-blue-800">Ver detalhes</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
