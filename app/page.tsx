// /home/ubuntu/corretor_site/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, Star } from "lucide-react";
import { SanityDocument } from "next-sanity";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { client } from "@/lib/sanity.client";
import { urlForImage } from "@/lib/sanity.image";
import { settingsQuery, featuredPropertiesQuery } from "@/lib/sanity.queries";

interface SettingsData extends SanityDocument {
  title?: string;
  bannerImages?: any[];
  aboutImage?: any;
  aboutText?: string;
  testimonials?: {
    _key: string;
    name?: string;
    quote?: string;
    clientImage?: any;
  }[];
}

interface Property extends SanityDocument {
  _id: string;
  title?: string;
  slug?: { current: string };
  location?: string;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  mainImage?: any;
}

async function getHomepageData() {
  const settings = await client.fetch<SettingsData>(settingsQuery);
  const featuredProperties = await client.fetch<Property[]>(featuredPropertiesQuery);
  return { settings, featuredProperties };
}

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return "Valor não informado";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default async function Home() {
  const { settings, featuredProperties } = await getHomepageData();

  const bannerImageUrls = (settings?.bannerImages || [])
    .map((img) => urlForImage(img)?.width(1920).height(1080).fit("crop").url())
    .filter((url): url is string => typeof url === "string");

  const aboutImageUrl = settings?.aboutImage
    ? urlForImage(settings.aboutImage)?.width(600).height(600).fit("cover").url()
    : "/placeholder.svg?height=600&width=600";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* HERO */}
        <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
          {bannerImageUrls.length > 0 ? (
            <Carousel
              opts={{ loop: true }}
              plugins={[Autoplay({ delay: 5000 })]}
              className="h-full w-full"
            >
              <CarouselContent className="h-full">
                {bannerImageUrls.map((url, index) => (
                  <CarouselItem key={index} className="h-full w-full">
                    <div className="relative w-full h-full">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${url})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/30" />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/30" />
            </div>
          )}

          <div className="container relative flex h-full flex-col items-start justify-center gap-4 text-white z-10">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Carlos Rodrigues
            </h1>
            <p className="max-w-xl text-xl font-light text-slate-100 md:text-2xl">
              Seu novo lar começa aqui
            </p>
            <Link href="/imoveis">
              <Button className="mt-4 bg-primary hover:opacity-90" size="lg">
                Ver Imóveis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* IMÓVEIS EM DESTAQUE */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Imóveis em Destaque
              </h2>
              <p className="mt-4 text-lg text-foreground/70">
                Conheça as melhores oportunidades disponíveis no mercado
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => {
                const imageUrl = property.mainImage
                  ? urlForImage(property.mainImage)?.width(400).height(225).fit("crop").url()
                  : "/placeholder.svg?width=400&height=225";

                return (
                  <Card key={property._id} className="overflow-hidden hover:shadow-lg dark:bg-slate-800">
                    <Link href={`/imoveis/${property.slug?.current || property._id}`} className="block">
                      <div className="aspect-video w-full overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={property.title || "Imagem do Imóvel"}
                          width={400}
                          height={225}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-foreground">
                        {property.title || "Título Indisponível"}
                      </h3>
                      <div className="mt-2 flex items-center text-foreground/70">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span className="text-sm">{property.location || "Localização Indisponível"}</span>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(property.price)}
                        </span>
                        <div className="flex gap-1 text-sm text-foreground/70">
                          {property.area && <span>{property.area} m²</span>}
                          {property.area && property.bedrooms && <span className="text-slate-300">|</span>}
                          {property.bedrooms && <span>{property.bedrooms} quartos</span>}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50 dark:bg-slate-800/50 p-4">
                      <Link href={`/imoveis/${property.slug?.current || property._id}`} className="w-full">
                        <Button className="w-full bg-primary text-white hover:opacity-90">
                          Ver detalhes
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            <div className="mt-12 text-center">
              <Link href="/imoveis">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Ver todos os imóveis
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}