// /home/ubuntu/corretor_site/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, Star } from "lucide-react";
import { SanityDocument } from "next-sanity";

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

// Define interfaces for the data types
interface SettingsData extends SanityDocument {
  title?: string;
  bannerImages?: any[]; // Array of image objects from Sanity
  aboutImage?: any;
  aboutImageUrl?: string;
  aboutText?: string;
  testimonials?: {
    _key: string;
    name?: string;
    quote?: string;
    clientImage?: any;
    clientImageUrl?: string;
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
  mainImageUrl?: string;
}

// Fetch data for the homepage
async function getHomepageData() {
  const settings = await client.fetch<SettingsData>(settingsQuery);
  const featuredProperties = await client.fetch<Property[]>(featuredPropertiesQuery);
  return { settings, featuredProperties };
}

// Helper to format currency
const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return "Valor não informado";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default async function Home() {
  const { settings, featuredProperties } = await getHomepageData();

  // Prepare banner images
  const bannerImageUrls = settings?.bannerUrls || [];
    ?.map((img) => urlForImage(img)?.width(1920).height(1080).fit("crop").url())
    .filter(Boolean) as string[];

  const aboutImageUrl = settings?.aboutImage
    ? urlForImage(settings.aboutImage)?.width(600).height(600).fit("cover").url()
    : "/placeholder.svg?height=600&width=600";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header is now in layout.tsx */}

      <main className="flex-1">
        {/* Hero Section with Carousel */}
        <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
          {bannerImageUrls && bannerImageUrls.length > 0 ? (
            <Carousel
              opts={{ loop: true }}
              className="h-full w-full"
              // Add plugins for autoplay if desired
            >
              <CarouselContent className="h-full">
                {bannerImageUrls.map((url, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${url})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/30" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Optional: Add Previous/Next buttons if needed visually inside the hero */}
              {/* <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" /> */}
              {/* <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" /> */}
            </Carousel>
          ) : (
            // Fallback if no banner images
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(\"/placeholder.svg?height=1080&width=1920\")" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/30" />
            </div>
          )}

          {/* Hero Text Content - Always visible over the background/carousel */}
          <div className="container relative flex h-full flex-col items-start justify-center gap-4 text-white z-10">
            {/* You might want to make this text dynamic via Sanity too */}
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

        {/* Imóveis em Destaque */}
        <section id="imoveis-destaque" className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Imóveis em Destaque
              </h2>
              <p className="mt-4 text-lg text-foreground/70">
                Conheça as melhores oportunidades disponíveis no mercado
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProperties && featuredProperties.length > 0 ? (
                featuredProperties.map((property) => {
                  const imageUrl = property.mainImage
                    ? urlForImage(property.mainImage)?.width(400).height(225).fit("crop").url()
                    : "/placeholder.svg?width=400&height=225";
                  return (
                    <Card
                      key={property._id}
                      className="overflow-hidden transition-all hover:shadow-lg dark:bg-slate-800"
                    >
                      <Link href={`/imoveis/${property.slug?.current || property._id}`} className="block">
                        <div className="aspect-video w-full overflow-hidden">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={property.title || "Imagem do Imóvel"}
                              width={400}
                              height={225}
                              className="h-full w-full object-cover transition-transform hover:scale-105"
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
                          <span className="text-sm">{property.location || "Localização Indisponível"}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(property.price)}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-foreground/70">
                            {property.area && <span>{property.area} m²</span>}
                            {property.area && property.bedrooms && <span className="text-slate-300">|</span>}
                            {property.bedrooms && <span>{property.bedrooms} quartos</span>}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-slate-50 dark:bg-slate-800/50 p-4">
                        <Link href={`/imoveis/${property.slug?.current || property._id}`} className="w-full">
                          <Button className="w-full bg-primary hover:opacity-90 text-primary-foreground">
                            Ver detalhes
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <p className="text-center text-foreground/70 col-span-full">
                  Nenhum imóvel em destaque no momento.
                </p>
              )}
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

        {/* Sobre o Corretor */}
        <section id="sobre" className="py-16 bg-background">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="relative aspect-square overflow-hidden rounded-lg md:aspect-auto md:h-[600px]">
                {aboutImageUrl && (
                  <Image
                    src={aboutImageUrl}
                    alt="Sobre Carlos Rodrigues"
                    fill // Use fill for responsive images within a relative container
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Sobre Carlos Rodrigues
                </h2>
                <p className="text-lg text-foreground/70">
                  {settings?.aboutText ||
                    "Com mais de 15 anos de experiência no mercado imobiliário, me dedico a encontrar o imóvel perfeito para cada cliente, entendendo suas necessidades e oferecendo um atendimento personalizado do início ao fim."}
                </p>
                {/* Static content below - could also be made dynamic via Sanity if needed */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-card-foreground">Atendimento Personalizado</h3>
                    <p className="text-card-foreground/70">
                      Cada cliente recebe atenção exclusiva e dedicada às suas necessidades específicas.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-card-foreground">Especialista em Alto Padrão</h3>
                    <p className="text-card-foreground/70">
                      Conhecimento profundo do mercado de imóveis de luxo e suas particularidades.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-card-foreground">Negociação Transparente</h3>
                    <p className="text-card-foreground/70">
                      Processos claros e objetivos para garantir a melhor experiência na compra ou venda.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-card-foreground">Suporte Contínuo</h3>
                    <p className="text-card-foreground/70">
                      Acompanhamento em todas as etapas, desde a visita até a finalização do contrato.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                O que dizem nossos clientes
              </h2>
              <p className="mt-4 text-lg text-foreground/70">
                A satisfação de quem já realizou o sonho da casa própria com nossa ajuda
              </p>
            </div>
            {settings?.testimonials && settings.testimonials.length > 0 ? (
              <Carousel className="mx-auto max-w-4xl">
                <CarouselContent>
                  {settings.testimonials.map((testimonial) => {
                    const avatarUrl = testimonial.clientImage
                      ? urlForImage(testimonial.clientImage)?.width(100).height(100).fit("crop").url()
                      : "/placeholder-user.jpg"; // Use a default user placeholder
                    return (
                      <CarouselItem key={testimonial._key}>
                        <div className="rounded-lg border bg-card p-8 shadow-sm">
                          <div className="mb-4 flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <blockquote className="mb-6 text-lg italic text-card-foreground/80">
                            "{testimonial.quote || "Depoimento não fornecido."}"
                          </blockquote>
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                              {avatarUrl && (
                                <Image
                                  src={avatarUrl}
                                  alt={testimonial.name || "Cliente"}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-card-foreground">
                                {testimonial.name || "Cliente Anônimo"}
                              </div>
                              {/* Location field was not in the schema, remove or add if needed */}
                              {/* <div className="text-sm text-slate-500">{testimonial.location}</div> */}
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <div className="mt-6 flex justify-center gap-2">
                  <CarouselPrevious className="relative inset-auto translate-y-0 static" />
                  <CarouselNext className="relative inset-auto translate-y-0 static" />
                </div>
              </Carousel>
            ) : (
              <p className="text-center text-foreground/70">
                Nenhum depoimento disponível no momento.
              </p>
            )}
          </div>
        </section>

        {/* Formulário de Contato - Keeping static for now, contact info is in footer */}
        <section id="contato" className="py-16 bg-background">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Entre em contato</h2>
                <p className="mt-4 text-lg text-foreground/70">
                  Estou à disposição para ajudar você a encontrar o imóvel dos seus sonhos
                </p>
              </div>
              {/* The form itself usually requires client-side logic or a backend endpoint */}
              {/* Contact details are now dynamically loaded in the footer from layout.tsx */}
              <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                <div className="grid md:grid-cols-2">
                  {/* Contact Info Column (Now redundant? Info is in footer) */}
                  <div className="bg-primary p-8 text-primary-foreground">
                    <h3 className="mb-6 text-xl font-bold">Informações de Contato</h3>
                    <p className="text-sm">
                      Os detalhes de contato (telefone, WhatsApp, email, endereço) são exibidos no rodapé do site.
                    </p>
                    {/* You could add social media links here if managed in Sanity */}
                  </div>
                  {/* Contact Form Column */}
                  <div className="p-8">
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground/80">
                          Nome
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          className="block w-full rounded-md border border-border bg-input px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground/80">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="block w-full rounded-md border border-border bg-input px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground/80">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="block w-full rounded-md border border-border bg-input px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="(XX) XXXXX-XXXX"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="mb-1 block text-sm font-medium text-foreground/80">
                          Mensagem
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          required
                          className="block w-full rounded-md border border-border bg-input px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="Olá, tenho interesse em mais informações..."
                        ></textarea>
                      </div>
                      <div>
                        <Button type="submit" className="w-full bg-primary hover:opacity-90 text-primary-foreground">
                          Enviar Mensagem
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer is now in layout.tsx */}
    </div>
  );
}

