"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getImageUrl } from "@/sanity/lib/image"
import type { SanityImage } from "@/types/sanity"

interface BannerCarouselProps {
  images: SanityImage[]
  children: React.ReactNode
}

export function BannerCarousel({ images, children }: BannerCarouselProps) {
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
      <section className="relative h-[100vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920')" }}
        >
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        {children}
      </section>
    )
  }

  return (
    <section className="relative h-[100vh] w-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${getImageUrl(image, 1920, 1080)})`,
          }}
        >
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
      ))}
      {children}
    </section>
  )
}
