import React from "react"
import { client } from "@/lib/sanity.client"
import { urlForImage } from "@/lib/sanity.image"
import { featuredPropertiesQuery, settingsQuery } from "@/lib/sanity.queries"
import { MapPin, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function formatCurrency(value: number | string | undefined) {
  if (!value) return "Sob consulta"
  if (typeof value === "string" && value.startsWith("R$")) return value
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))
}

export default async function Home() {
  const [settings, properties] = await Promise.all([
    client.fetch(settingsQuery),
    client.fetch(featuredPropertiesQuery),
  ])

  return (
    <main className="space-y-20">
      <section className="container py-10">
        <h1 className="text-4xl font-bold">Imóveis em destaque</h1>
        <Carousel>
          <CarouselContent>
            {properties.map((property: any, idx: number) => {
              const image = property.images?.[0]
              return (
                <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                  <Card>
                    <div className="relative aspect-video overflow-hidden">
                      {image ? (
                        <Image
                          src={urlForImage(image).url()}
                          alt={property.title}
                          width={image?.width || 800}
                          height={image?.height || 600}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src="/placeholder.svg"
                          alt="Imagem não disponível"
                          width={800}
                          height={600}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{property.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {property.location}
                      </p>
                      <p className="text-primary font-bold mt-2">{formatCurrency(property.price)}</p>
                    </CardContent>
                    <CardFooter className="p-4">
                      <Link href={`/imoveis/${property.slug}`}>
                        <Button variant="outline">Ver Detalhes</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </main>
  )
}
