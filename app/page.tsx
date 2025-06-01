import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";
import { SanityDocument } from "next-sanity";
// Removed Autoplay and Carousel imports as they are now in HeroCarousel
// import Autoplay from "embla-carousel-autoplay";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { client } from "@/lib/sanity.client";
import { urlForImage } from "@/lib/sanity.image";
import { settingsQuery, featuredPropertiesQuery } from "@/lib/sanity.queries";
import { HeroCarousel } from "@/components/hero-carousel"; // Import the new Client Component

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
  primaryColor?: string;
  textColor?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
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
    currency: "BRL"
  }).format(value);
};

export default async function Home() {
  const { settings, featuredProperties } = await getHomepageData();

  const bannerImageUrls = (settings?.bannerImages || [])
    .map((img) => {
      try {
        const builder = urlForImage(img);
        if (builder) {
          return builder.width(1920).height(1080).fit("crop").url();
        }
        console.warn("Skipping invalid banner image object:", img);
        return null;
      } catch (error) {
        console.error("Error processing banner image:", error, img);
        return null;
      }
    })
    .filter((url): url is string => !!url);

  const whatsappLink = settings?.contactWhatsApp
    ? `https://wa.me/${settings.contactWhatsApp.replace(/\D/g, '')}`
    : "https://wa.me/seu-numero-aqui";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* HERO */}
        <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
          {/* Use the new HeroCarousel Client Component */}
          <HeroCarousel imageUrls={bannerImageUrls} />

          {/* Overlay content remains in the Server Component */}
          <div className="container relative flex h-full flex-col items-start justify-center gap-4 text-white z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">Carlos Rodrigues</h1>
            <p className="text-xl sm:text-2xl max-w-lg">Seu novo lar começa aqui</p>
            <Link href="/imoveis">
              <Button className="mt-4 bg-primary hover:opacity-90" size="lg">
                Ver Imóveis <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* IMÓVEIS EM DESTAQUE */}
        <section className="py-16 bg-slate-50">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Imóveis em Destaque</h2>
              <p className="mt-4 text-lg text-foreground/70">
                Conheça as melhores oportunidades disponíveis no mercado
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {(featuredProperties || []).map((property) => {
                const imageUrl = property.mainImage
                  ? urlForImage(property.mainImage)?.width(400).height(225).fit("crop").url()
                  : "/placeholder.svg?width=400&height=225";

                return (
                  <Card key={property._id} className="overflow-hidden hover:shadow-lg dark:bg-slate-800">
                    <Link href={`/imoveis/${property.slug?.current || property._id}`} className="block">
                      <div className="aspect-video w-full overflow-hidden">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={property.title || "Imagem do Imóvel"}
                            width={400}
                            height={225}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                            unoptimized={imageUrl.startsWith("/placeholder")}
                          />
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-foreground">
                        {property.title || "Título Indisponível"}
                      </h3>
                      <div className="mt-2 flex items-center text-foreground/70">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span className="text-sm">{property.location || "Localização não informada"}</span>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(property.price)}
                        </span>
                        <div className="flex gap-1 text-sm text-foreground/70">
                          {property.area && <span>{property.area} m²</span>}
                          {property.area && property.bedrooms && <span className="text-slate-300">|</span>}
                          {property.bedrooms && <span>{property.bedrooms} quarto{property.bedrooms > 1 ? 's' : ''}</span>}
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
                  Ver todos os imóveis <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CONTATO */}
        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="container text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Fale com o corretor</h2>
            <p className="text-lg text-foreground/70 mb-6">Entre em contato agora mesmo pelo WhatsApp e tire todas as suas dúvidas.</p>
            <Link href={whatsappLink} target="_blank">
              <Button className="bg-green-600 hover:bg-green-700 text-white" size="lg">
                Conversar pelo WhatsApp
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

