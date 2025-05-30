// /home/ubuntu/corretor_site/app/imoveis/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SanityDocument } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { ArrowLeft, Bath, Bed, Car, ChevronRight, Heart, MapPin, Maximize, Share2, Check } from "lucide-react";

import { client } from "@/lib/sanity.client";
import { urlForImage } from "@/lib/sanity.image";
import { propertyPathsQuery, propertyBySlugQuery, similarPropertiesQuery } from "@/lib/sanity.queries"; // Assuming similarPropertiesQuery exists
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import PropertyGallery from "@/components/property-gallery"; // Assuming component for gallery modal
import YouTubeEmbed from "@/components/youtube-embed"; // Assuming component for YouTube embed

// Interface for Property data (ensure it matches your Sanity schema)
interface Property extends SanityDocument {
  _id: string;
  title?: string;
  slug?: { current: string };
  location?: string;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  condoFee?: number;
  tax?: number;
  description?: any[]; // Portable Text
  features?: string[];
  mainImage?: any;
  gallery?: any[];
  youtubeVideoUrl?: string;
  // Add other fields as needed
}

// Helper to format currency
const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return "N/A";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Generate static paths for pre-rendering
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(propertyPathsQuery);
  return slugs.map((slug) => ({ slug }));
}

// Fetch property data by slug
async function getPropertyData(slug: string): Promise<{ property: Property | null; similarProperties: Property[] }> {
  const property = await client.fetch<Property | null>(propertyBySlugQuery, { slug });
  let similarProperties: Property[] = [];
  if (property) {
    // Fetch similar properties (example: same type, different ID, limit 3)
    similarProperties = await client.fetch<Property[]>(similarPropertiesQuery, {
      currentId: property._id,
      // Add other criteria like type: property.type if available
      limit: 3
    });
  }
  return { property, similarProperties };
}

export default async function PropertyDetailsPage({ params }: { params: { slug: string } }) {
  const { property, similarProperties } = await getPropertyData(params.slug);

  if (!property) {
    notFound(); // Show 404 if property not found
  }

  const galleryImages = [property.mainImage, ...(property.gallery || [])].filter(Boolean).slice(0, 9);
  const mainImageUrl = property.mainImage ? urlForImage(property.mainImage)?.width(800).height(450).fit("crop").url() : "/placeholder.svg?width=800&height=450";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header is in layout.tsx */}

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-100 dark:bg-slate-800 py-4 border-b border-border">
          <div className="container mx-auto px-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary">Início</Link></li>
                <li><ChevronRight className="h-4 w-4" /></li>
                <li><Link href="/imoveis" className="hover:text-primary">Imóveis</Link></li>
                <li><ChevronRight className="h-4 w-4" /></li>
                <li><span className="font-medium text-foreground">{property.title || "Detalhes do Imóvel"}</span></li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Image Gallery Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-center justify-between">
              <Link href="/imoveis" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar para imóveis
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Favoritar</span>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Compartilhar</span>
                </Button>
              </div>
            </div>

            {/* Gallery Grid - Max 9 images */} 
            <div className="grid gap-2 md:grid-cols-2">
              {/* Main Image */} 
              <div className="relative aspect-video overflow-hidden rounded-lg md:col-span-1">
                {mainImageUrl && (
                  <Image
                    src={mainImageUrl}
                    alt={property.title || "Imagem Principal"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority // Prioritize loading the main image
                  />
                )}
              </div>
              {/* Thumbnail Grid */} 
              <div className="grid grid-cols-2 gap-2 md:col-span-1">
                {galleryImages.slice(1, 5).map((image, index) => (
                  <div key={image._key || index} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    {image && (
                      <Image
                        src={urlForImage(image)?.width(300).height(300).fit("crop").url() || "/placeholder.svg"}
                        alt={`${property.title} - Imagem ${index + 2}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 15vw"
                        className="object-cover"
                      />
                    )}
                    {/* Overlay for 'View All' on the last visible thumbnail */} 
                    {index === 3 && galleryImages.length > 5 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        {/* Replace with PropertyGallery trigger if using a modal */}
                        <Button
                          variant="outline"
                          className="text-white border-white hover:bg-white/10"
                        >
                          <Maximize className="mr-2 h-4 w-4" />
                          Ver todas ({galleryImages.length})
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {/* Fill empty slots if less than 5 images total */} 
                {Array.from({ length: Math.max(0, 4 - (galleryImages.length - 1)) }).map((_, i) => (
                  <div key={`placeholder-${i}`} className="aspect-square rounded-lg bg-muted"></div>
                ))}
              </div>
            </div>
            {/* Optional: Add PropertyGallery component here for modal view */}
            {/* <PropertyGallery images={galleryImages} /> */} 
          </div>
        </section>

        {/* Property Info Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content Area */} 
              <div className="lg:col-span-2">
                {/* Title and Location */}
                <div className="mb-6">
                  <h1 className="mb-2 text-3xl font-bold text-foreground">{property.title || "Título Indisponível"}</h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{property.location || "Localização Indisponível"}</span>
                  </div>
                </div>

                {/* Key Details Icons */}
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[ // Array for easier mapping
                    { icon: Maximize, label: "Área", value: property.area ? `${property.area} m²` : "N/A" },
                    { icon: Bed, label: "Quartos", value: property.bedrooms ?? "N/A" },
                    { icon: Bath, label: "Banheiros", value: property.bathrooms ?? "N/A" },
                    { icon: Car, label: "Vagas", value: property.parkingSpots ?? "N/A" },
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg border bg-card p-4 text-center shadow-sm">
                      <item.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                      <div className="font-bold text-foreground">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Tabs: Description, Features, Location */}
                <Tabs defaultValue="description" className="mb-8">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Descrição</TabsTrigger>
                    <TabsTrigger value="features">Características</TabsTrigger>
                    <TabsTrigger value="location">Localização</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-4 rounded-lg border p-6 prose dark:prose-invert max-w-none">
                    <h3 className="mb-4 text-lg font-bold text-foreground">Sobre este imóvel</h3>
                    {property.description ? (
                      <PortableText value={property.description} />
                    ) : (
                      <p className="text-muted-foreground">Descrição não disponível.</p>
                    )}
                  </TabsContent>
                  <TabsContent value="features" className="mt-4 rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-bold text-foreground">Características e diferenciais</h3>
                    {property.features && property.features.length > 0 ? (
                      <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {property.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="mr-2 h-5 w-5 text-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma característica informada.</p>
                    )}
                  </TabsContent>
                  <TabsContent value="location" className="mt-4 rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-bold text-foreground">Localização</h3>
                    <div className="mb-4 text-muted-foreground">
                      <p>{property.location || "Endereço não disponível."}</p>
                      {/* Add more location details if available in schema */}
                    </div>
                    {/* Placeholder for Map Integration */}
                    <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">Mapa da localização (Integração Pendente)</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* YouTube Video Embed */}
                {property.youtubeVideoUrl && (
                  <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold text-foreground">Vídeo do Imóvel</h3>
                    <YouTubeEmbed url={property.youtubeVideoUrl} />
                  </div>
                )}

                {/* Similar Properties Carousel */}
                {similarProperties && similarProperties.length > 0 && (
                  <div className="mb-8">
                    <h3 className="mb-6 text-xl font-bold text-foreground">Imóveis similares</h3>
                    <Carousel opts={{ align: "start", loop: false }} className="w-full">
                      <CarouselContent className="-ml-4">
                        {similarProperties.map((simProp) => (
                          <CarouselItem key={simProp._id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <Card className="overflow-hidden transition-shadow hover:shadow-md">
                              <Link href={`/imoveis/${simProp.slug?.current || simProp._id}`} className="block">
                                <div className="aspect-video w-full overflow-hidden bg-muted">
                                  {simProp.mainImage && (
                                    <Image
                                      src={urlForImage(simProp.mainImage)?.width(300).height(169).fit("crop").url() || "/placeholder.svg"}
                                      alt={simProp.title || "Imagem Imóvel Similar"}
                                      width={300}
                                      height={169}
                                      className="h-full w-full object-cover transition-transform hover:scale-105"
                                    />
                                  )}
                                </div>
                              </Link>
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-foreground truncate">{simProp.title || "-"}</h4>
                                <div className="mt-1 flex items-center text-muted-foreground">
                                  <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                                  <span className="text-xs truncate">{simProp.location || "-"}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="font-bold text-primary">{formatCurrency(simProp.price)}</span>
                                  <Link href={`/imoveis/${simProp.slug?.current || simProp._id}`} passHref legacyBehavior>
                                    <Button variant="link" size="sm" className="text-xs px-0 h-auto">Ver detalhes</Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute left-[-12px] top-1/2 -translate-y-1/2 z-10" />
                      <CarouselNext className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-10" />
                    </Carousel>
                  </div>
                )}
              </div>

              {/* Sidebar: Price and Contact */}
              <aside>
                <div className="sticky top-24 space-y-6">
                  {/* Price Box */}
                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="mb-4 text-center">
                      <div className="text-sm text-muted-foreground">Valor</div>
                      <div className="text-3xl font-bold text-primary">{formatCurrency(property.price)}</div>
                    </div>
                    <div className="mb-6 border-t border-b py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Condomínio</div>
                          <div className="font-medium text-foreground">{formatCurrency(property.condoFee)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">IPTU</div>
                          <div className="font-medium text-foreground">{formatCurrency(property.tax)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button size="lg" className="w-full bg-primary hover:opacity-90 text-primary-foreground">Agendar visita</Button>
                      <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">Entrar em contato</Button>
                    </div>
                  </div>

                  {/* Contact Box (Fetch broker info from settings or property if needed) */}
                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-foreground">Fale com o corretor</h3>
                    {/* Fetch broker details dynamically if needed */}
                    <div className="mb-4 flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
                        {/* Placeholder - Fetch broker image from settings */}
                        <Image
                          src={"/placeholder.svg?height=64&width=64"} // Replace with dynamic broker image URL
                          alt="Corretor"
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        {/* Placeholder - Fetch broker name from settings */}
                        <div className="font-bold text-foreground">Carlos Rodrigues</div>
                        <div className="text-sm text-muted-foreground">Especialista em imóveis</div>
                      </div>
                    </div>
                    {/* Placeholder - Add contact form or details */}
                    <Button variant="outline" className="w-full">Enviar Mensagem</Button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      {/* Footer is in layout.tsx */}
    </div>
  );
}

