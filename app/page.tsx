import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { SanityDocument } from "next-sanity";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { client } from "@/lib/sanity.client";
import { urlForImage } from "@/lib/sanity.image";
import { settingsQuery, featuredPropertiesQuery } from "@/lib/sanity.queries";

interface SettingsData extends SanityDocument {
  bannerUrls?: any[];
  aboutImage?: any;
  testimonials?: {
    _key: string;
    name: string;
    quote: string;
    clientImage?: any;
  }[];
}

interface Property extends SanityDocument {
  _id: string;
  title: string;
  slug: { current: string };
  location: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  mainImage: any;
}

const formatCurrency = (value: number | undefined) => {
  if (!value) return "Valor não informado";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default async function Home() {
  const settings = await client.fetch<SettingsData>(settingsQuery);
  const featuredProperties = await client.fetch<Property[]>(featuredPropertiesQuery);

  const bannerImages = (settings?.bannerUrls || [])
    .map((img) => urlForImage(img)?.width(1920).height(1080).fit("crop").url())
    .filter((url): url is string => !!url);

  const aboutImageUrl = settings?.aboutImage
    ? urlForImage(settings.aboutImage)?.width(600).height(600).fit("cover").url()
    : "/placeholder.svg?height=600&width=600";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* HERO */}
        <section className="relative h-[80vh] w-full overflow-hidden">
          {bannerImages.length > 0 ? (
            <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="h-full w-full">
              <CarouselContent className="h-full">
                {bannerImages.map((url, index) => (
                  <CarouselItem key={index} className="h-full w-full">
                    <div className="relative w-full h-full">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
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
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/30" />
            </div>
          )}

          <div className="container relative flex h-full flex-col items-start justify-center gap-4 text-white z-10">
            <h1 className="text-4xl md:text-6xl font-bold">Carlos Rodrigues</h1>
            <p className="text-xl md:text-2xl text-slate-100">Seu novo lar começa aqui</p>
            <Link href="/imoveis">
              <Button className="mt-4 bg-blue-900 hover:bg-blue-800" size="lg">
                Ver Imóveis <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* IMÓVEIS EM DESTAQUE */}
        <section className="py-16 bg-slate-50">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Imóveis em Destaque</h2>
              <p className="mt-4 text-lg text-slate-600">Conheça as melhores oportunidades disponíveis no mercado</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => {
                const imageUrl = property.mainImage ? urlForImage(property.mainImage)?.width(400).height(225).fit("crop").url() : "/placeholder.svg";
                return (
                  <Card key={property._id} className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-video w-full overflow-hidden">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={property.title}
                        width={400}
                        height={225}
                        className="h-full w-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-slate-900">{property.title}</h3>
                      <div className="mt-2 flex items-center text-slate-500">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <span className="text-lg font-bold text-blue-900">{formatCurrency(property.price)}</span>
                        <div className="text-sm text-slate-500">
                          {property.area && `${property.area}m²`} {property.bedrooms && ` | ${property.bedrooms} quartos`}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50 p-4">
                      <Link href={`/imoveis/${property.slug?.current}`} className="w-full">
                        <Button className="w-full bg-blue-900 hover:bg-blue-800">Ver detalhes</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            <div className="mt-12 text-center">
              <Link href="/imoveis">
                <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                  Ver todos os imóveis <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Seções: Sobre, Depoimentos e Contato devem ser importadas como components ou completadas aqui */}

      </main>
    </div>
  );
}
