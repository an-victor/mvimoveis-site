import Link from "next/link"
import { ArrowLeft, Bath, Bed, Car, ChevronRight, Heart, MapPin, Maximize, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

// Simulando busca de dados do imóvel pelo ID
export default function PropertyDetails({ params }: { params: { id: string } }) {
  // Em um cenário real, você buscaria os dados do imóvel pelo ID
  const property = properties.find((p) => p.id === params.id) || properties[0]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">Carlos Imóveis</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Início
            </Link>
            <Link href="/#imoveis" className="text-sm font-medium text-slate-900 hover:text-orange-500">
              Imóveis
            </Link>
            <Link href="/#sobre" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Sobre
            </Link>
            <Link href="/#depoimentos" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Depoimentos
            </Link>
            <Link href="/#contato" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Contato
            </Link>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Abrir menu</span>
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
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-50 py-4">
          <div className="container">
            <div className="flex items-center text-sm text-slate-600">
              <Link href="/" className="hover:text-orange-500">
                Início
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <Link href="/#imoveis" className="hover:text-orange-500">
                Imóveis
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-slate-900">{property.title}</span>
            </div>
          </div>
        </div>

        {/* Galeria de Imagens */}
        <section className="py-8">
          <div className="container">
            <div className="mb-6 flex items-center justify-between">
              <Link href="/#imoveis" className="flex items-center text-sm font-medium text-orange-500 hover:underline">
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {property.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${property.title} - Imagem ${index + 2}`}
                      className="h-full w-full object-cover"
                    />
                    {index === 3 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Button
                          variant="outline"
                          className="text-white border-white hover:text-white hover:bg-black/70"
                        >
                          <Maximize className="mr-2 h-4 w-4" />
                          Ver todas as fotos
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Informações do Imóvel */}
        <section className="py-8">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h1 className="mb-2 text-3xl font-bold text-slate-900">{property.title}</h1>
                  <div className="flex items-center text-slate-600">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg border bg-white p-4 text-center">
                    <Maximize className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                    <div className="text-sm text-slate-600">Área</div>
                    <div className="font-bold text-slate-900">{property.details.area}</div>
                  </div>
                  <div className="rounded-lg border bg-white p-4 text-center">
                    <Bed className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                    <div className="text-sm text-slate-600">Quartos</div>
                    <div className="font-bold text-slate-900">{property.details.bedrooms}</div>
                  </div>
                  <div className="rounded-lg border bg-white p-4 text-center">
                    <Bath className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                    <div className="text-sm text-slate-600">Banheiros</div>
                    <div className="font-bold text-slate-900">{property.details.bathrooms}</div>
                  </div>
                  <div className="rounded-lg border bg-white p-4 text-center">
                    <Car className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                    <div className="text-sm text-slate-600">Vagas</div>
                    <div className="font-bold text-slate-900">{property.details.parkingSpots}</div>
                  </div>
                </div>

                <Tabs defaultValue="description" className="mb-8">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Descrição</TabsTrigger>
                    <TabsTrigger value="features">Características</TabsTrigger>
                    <TabsTrigger value="location">Localização</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-4 rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Sobre este imóvel</h3>
                    <div className="space-y-4 text-slate-600">
                      {property.description.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="features" className="mt-4 rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Características e diferenciais</h3>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
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
                            className="mr-2 h-5 w-5 text-orange-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="location" className="mt-4 rounded-lg border p-6">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Localização</h3>
                    <div className="mb-4 text-slate-600">
                      <p>{property.location}</p>
                      <p className="mt-2">
                        Excelente localização com fácil acesso a transporte público, comércio, restaurantes e áreas de
                        lazer.
                      </p>
                    </div>
                    <div className="aspect-video overflow-hidden rounded-lg bg-slate-200">
                      {/* Aqui você poderia integrar um mapa real como Google Maps */}
                      <div className="flex h-full items-center justify-center">
                        <p className="text-slate-500">Mapa da localização</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Imóveis Similares */}
                <div className="mb-8">
                  <h3 className="mb-6 text-xl font-bold text-slate-900">Imóveis similares</h3>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {properties
                        .filter((p) => p.id !== property.id)
                        .map((similarProperty, index) => (
                          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <Card className="overflow-hidden">
                              <div className="aspect-video w-full overflow-hidden">
                                <img
                                  src={similarProperty.images[0] || "/placeholder.svg"}
                                  alt={similarProperty.title}
                                  className="h-full w-full object-cover transition-transform hover:scale-105"
                                />
                              </div>
                              <CardContent className="p-4">
                                <h4 className="font-bold text-slate-900">{similarProperty.title}</h4>
                                <div className="mt-1 flex items-center text-slate-500">
                                  <MapPin className="mr-1 h-4 w-4" />
                                  <span className="text-xs">{similarProperty.location}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="font-bold text-orange-500">{similarProperty.price}</span>
                                  <Link
                                    href={`/imoveis/${similarProperty.id}`}
                                    className="text-xs text-orange-500 hover:underline"
                                  >
                                    Ver detalhes
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-2 mt-4">
                      <CarouselPrevious className="relative inset-0 translate-y-0" />
                      <CarouselNext className="relative inset-0 translate-y-0" />
                    </div>
                  </Carousel>
                </div>
              </div>

              {/* Sidebar com informações de contato e preço */}
              <div>
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="mb-4 text-center">
                      <div className="text-sm text-slate-600">Valor</div>
                      <div className="text-3xl font-bold text-orange-500">{property.price}</div>
                    </div>
                    <div className="mb-6 border-t border-b py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-slate-600">Condomínio</div>
                          <div className="font-medium text-slate-900">{property.details.condoFee}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-slate-600">IPTU</div>
                          <div className="font-medium text-slate-900">{property.details.tax}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">Agendar visita</Button>
                      <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50">
                        Entrar em contato
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">Fale com o corretor</h3>
                    <div className="mb-6 flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-full">
                        <img
                          src="/placeholder.svg?height=200&width=200"
                          alt="Carlos Rodrigues"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Carlos Rodrigues</div>
                        <div className="text-sm text-slate-600">Especialista em imóveis de alto padrão</div>
                      </div>
                    </div>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-700">
                          Nome
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-700">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                          Telefone
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium text-slate-700">
                          Mensagem
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="Olá, tenho interesse neste imóvel e gostaria de mais informações."
                        ></textarea>
                      </div>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">Enviar mensagem</Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-xl font-bold text-slate-900">Carlos Imóveis</div>
              <p className="mt-4 text-slate-600">
                Especialista em imóveis de alto padrão, oferecendo um serviço personalizado e exclusivo para cada
                cliente.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Links Rápidos</h3>
              <nav className="mt-4 flex flex-col space-y-2">
                <Link href="/" className="text-slate-600 hover:text-orange-500">
                  Início
                </Link>
                <Link href="/#imoveis" className="text-slate-600 hover:text-orange-500">
                  Imóveis
                </Link>
                <Link href="/#sobre" className="text-slate-600 hover:text-orange-500">
                  Sobre
                </Link>
                <Link href="/#depoimentos" className="text-slate-600 hover:text-orange-500">
                  Depoimentos
                </Link>
                <Link href="/#contato" className="text-slate-600 hover:text-orange-500">
                  Contato
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Fale Conosco</h3>
              <div className="mt-4 space-y-2">
                <p className="flex items-center text-slate-600">
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
                    className="mr-2 h-5 w-5 text-orange-500"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  (11) 99999-9999
                </p>
                <p className="flex items-center text-slate-600">
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
                    className="mr-2 h-5 w-5 text-orange-500"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  contato@carlosimoveis.com
                </p>
                <p className="flex items-center text-slate-600">
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
                    className="mr-2 h-5 w-5 text-orange-500"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Av. Paulista, 1000 - Bela Vista, São Paulo - SP
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="https://wa.me/5511999999999"
                  className="inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                >
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
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Fale pelo WhatsApp
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-6 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Carlos Imóveis. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Dados de exemplo para imóveis detalhados
const properties = [
  {
    id: "1",
    title: "Apartamento de Luxo",
    location: "Jardins, São Paulo",
    price: "R$ 1.200.000",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    details: {
      area: "120m²",
      bedrooms: 3,
      bathrooms: 2,
      parkingSpots: 2,
      condoFee: "R$ 1.200/mês",
      tax: "R$ 5.000/ano",
    },
    description: [
      "Luxuoso apartamento localizado no coração dos Jardins, um dos bairros mais nobres de São Paulo. Com acabamento de alto padrão e vista privilegiada para a cidade.",
      "O imóvel conta com 3 dormitórios, sendo 1 suíte master com closet, sala ampla com dois ambientes, varanda gourmet integrada, cozinha planejada e área de serviço completa.",
      "O condomínio oferece infraestrutura completa com piscina, academia, salão de festas, playground e segurança 24 horas. Localização privilegiada, próximo a restaurantes, comércio e transporte público.",
    ],
    features: [
      "Varanda gourmet",
      "Piso em porcelanato",
      "Ar-condicionado",
      "Armários planejados",
      "Churrasqueira",
      "Piscina",
      "Academia",
      "Salão de festas",
      "Playground",
      "Segurança 24h",
      "Portaria",
      "Elevador",
    ],
  },
  {
    id: "2",
    title: "Casa em Condomínio",
    location: "Alphaville, Barueri",
    price: "R$ 2.500.000",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    details: {
      area: "350m²",
      bedrooms: 4,
      bathrooms: 3,
      parkingSpots: 4,
      condoFee: "R$ 1.800/mês",
      tax: "R$ 8.000/ano",
    },
    description: [
      "Magnífica casa em condomínio fechado em Alphaville, com arquitetura moderna e acabamento de alto padrão. Terreno de 500m² com área construída de 350m².",
      "A casa possui 4 suítes espaçosas, sala ampla com pé direito duplo, cozinha gourmet integrada, escritório, área de lazer com piscina e espaço gourmet completo.",
      "O condomínio oferece segurança 24 horas, área de lazer completa com quadras esportivas, piscina, academia e salão de festas. Localização privilegiada, próximo ao Alphaville Tennis Club e Shopping Tamboré.",
    ],
    features: [
      "Piscina privativa",
      "Espaço gourmet",
      "Jardim",
      "Pé direito duplo",
      "Suítes",
      "Closet",
      "Home office",
      "Ar-condicionado",
      "Aquecimento solar",
      "Segurança 24h",
      "Quadra de tênis",
      "Academia",
    ],
  },
  {
    id: "3",
    title: "Cobertura Duplex",
    location: "Vila Nova Conceição, São Paulo",
    price: "R$ 3.800.000",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    details: {
      area: "280m²",
      bedrooms: 3,
      bathrooms: 4,
      parkingSpots: 3,
      condoFee: "R$ 2.500/mês",
      tax: "R$ 12.000/ano",
    },
    description: [
      "Espetacular cobertura duplex na Vila Nova Conceição, um dos bairros mais exclusivos de São Paulo. Com vista panorâmica para o Parque Ibirapuera e acabamento de altíssimo padrão.",
      "No primeiro pavimento, ampla sala de estar e jantar integradas, cozinha gourmet, lavabo e 3 suítes. No pavimento superior, área de lazer privativa com piscina, deck, churrasqueira e espaço gourmet.",
      "O condomínio oferece serviço de concierge, segurança 24 horas, academia completa e salão de festas. Localização privilegiada, a poucos minutos do Parque Ibirapuera e do Shopping Ibirapuera.",
    ],
    features: [
      "Cobertura duplex",
      "Vista panorâmica",
      "Piscina privativa",
      "Terraço",
      "Churrasqueira",
      "Espaço gourmet",
      "Suítes",
      "Closet",
      "Ar-condicionado",
      "Automação residencial",
      "Concierge",
      "Segurança 24h",
    ],
  },
]
