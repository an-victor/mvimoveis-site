"use client"
import React from "react";

import React from 'react'

import Link from "next/link"
import { ChevronRight, MapPin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"



export default function Home(): JSX.Element {
  return (

    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">Carlos Imóveis</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-slate-900 hover:text-blue-900">
              Início
            </Link>
            <Link href="/imoveis" className="text-sm font-medium text-slate-600 hover:text-blue-900">
              Imóveis
            </Link>
            <Link href="#sobre" className="text-sm font-medium text-slate-600 hover:text-blue-900">
              Sobre
            </Link>
            <Link href="#depoimentos" className="text-sm font-medium text-slate-600 hover:text-blue-900">
              Depoimentos
            </Link>
            <Link href="#contato" className="text-sm font-medium text-slate-600 hover:text-blue-900">
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
        {/* Hero Section */}
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
                Ver Imóveis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
              {properties.map((property, index) => (
                <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={property.images?.[0] || "/placeholder.svg"}
                      alt={property.title}
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
                        <span>{property.details?.area ?? 'Área não informada'}</span>
                        <span className="text-slate-300">|</span>
                        <span>{property.details?.bedrooms ?? '?'} quartos</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 p-4">
                    <Link href={`/imoveis/${property.id}`} className="w-full">
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

        {/* Sobre o Corretor */}
        <section id="sobre" className="py-16">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className="relative aspect-square overflow-hidden rounded-lg md:aspect-auto md:h-[600px]">
                <img
                  src="/placeholder.svg?height=600&width=600"
                  alt="Carlos Rodrigues - Corretor de Imóveis"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Sobre Carlos Rodrigues</h2>
                <p className="text-lg text-slate-600">
                  Com mais de 15 anos de experiência no mercado imobiliário, me dedico a encontrar o imóvel perfeito
                  para cada cliente, entendendo suas necessidades e oferecendo um atendimento personalizado do início ao
                  fim.
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-900">Atendimento Personalizado</h3>
                    <p className="text-slate-600">
                      Cada cliente recebe atenção exclusiva e dedicada às suas necessidades específicas.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-900">Especialista em Alto Padrão</h3>
                    <p className="text-slate-600">
                      Conhecimento profundo do mercado de imóveis de luxo e suas particularidades.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-900">Negociação Transparente</h3>
                    <p className="text-slate-600">
                      Processos claros e objetivos para garantir a melhor experiência na compra ou venda.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-bold text-slate-900">Suporte Contínuo</h3>
                    <p className="text-slate-600">
                      Acompanhamento em todas as etapas, desde a visita até a finalização do contrato.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" className="py-16 bg-slate-50">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                O que dizem nossos clientes
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                A satisfação de quem já realizou o sonho da casa própria com nossa ajuda
              </p>
            </div>
            <Carousel className="mx-auto max-w-4xl">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="rounded-lg border bg-white p-8 shadow-sm">
                      <div className="mb-4 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="mb-6 text-lg italic text-slate-600">"{testimonial.text}"</blockquote>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-full">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
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
                <CarouselPrevious className="relative inset-0 translate-y-0" />
                <CarouselNext className="relative inset-0 translate-y-0" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Formulário de Contato */}
        <section id="contato" className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Entre em contato</h2>
                <p className="mt-4 text-lg text-slate-600">
                  Estou à disposição para ajudar você a encontrar o imóvel dos seus sonhos
                </p>
              </div>
              <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <div className="grid md:grid-cols-2">
                  <div className="bg-blue-900 p-8 text-white">
                    <h3 className="mb-6 text-xl font-bold">Informações de Contato</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
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
                          className="h-5 w-5 shrink-0"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-white/70">Telefone</div>
                          <div>(11) 99999-9999</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
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
                          className="h-5 w-5 shrink-0"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <div>
                          <div className="text-sm font-medium text-white/70">Email</div>
                          <div>contato@carlosimoveis.com</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
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
                          className="h-5 w-5 shrink-0"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                       
