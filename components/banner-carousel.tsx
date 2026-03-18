"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getImageUrl } from "@/sanity/lib/image"
import type { SanityImage } from "@/types/sanity"

interface BannerCarouselProps {
  images: SanityImage[]
}

export function BannerCarousel({ images }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // 5 segundos

    return () => clearInterval(interval)
  }, [images.length])

  if (images.length === 0) {
    // Fallback para imagem padrão se não houver imagens
    return (
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 transition-opacity duration-1000">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Placeholder Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/20" />
        </div>

        {/* Indicadores de navegação */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="h-2 w-8 rounded-full bg-white/50" />
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={getImageUrl(image as any, 1920, 1080)}
            alt={`Banner image ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Overlay mais sutil para manter as imagens nítidas */}
          <div className="absolute inset-0 bg-slate-900/20" />
        </div>
      ))}

      {/* Indicadores de navegação */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-8 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>

      {/* Navegação por setas (opcional) */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
            aria-label="Imagem anterior"
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
              className="h-6 w-6"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            onClick={() => setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
            aria-label="Próxima imagem"
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
              className="h-6 w-6"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
    </section>
  )
}
