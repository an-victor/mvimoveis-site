"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { getImageUrl } from "@/sanity/lib/image"
import type { SanityImage } from "@/types/sanity"

interface ImageGalleryProps {
  images: SanityImage[]
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImageGallery({ images, title, open, onOpenChange }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  // Foca o container ao abrir para receber eventos de teclado
  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.focus()
    }
  }, [open])

  // Reseta o índice ao fechar
  useEffect(() => {
    if (!open) setCurrentIndex(0)
  }, [open])

  const goTo = useCallback((index: number) => {
    setIsLoading(true)
    setCurrentIndex(index)
  }, [])

  const handlePrevious = useCallback(() => {
    goTo(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }, [currentIndex, images.length, goTo])

  const handleNext = useCallback(() => {
    goTo(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }, [currentIndex, images.length, goTo])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious()
    else if (e.key === "ArrowRight") handleNext()
    else if (e.key === "Escape") onOpenChange(false)
  }

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrevious()
    }
    touchStartX.current = null
  }

  if (images.length === 0) return null

  const currentImage = images[currentIndex]
  const imageUrl = getImageUrl(currentImage as any, 1920, 1080) || "/placeholder.svg"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/95" />
      <DialogContent
        className="max-w-[100vw] w-full h-[100dvh] bg-black border-none p-0 flex flex-col rounded-none"
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        ref={containerRef as any}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 text-white bg-black/60 backdrop-blur-sm flex-shrink-0">
          <h2 className="text-base font-medium text-white/80">
            {title} — <span className="text-white font-bold">{currentIndex + 1}</span>
            <span className="text-white/50"> / {images.length}</span>
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 hover:bg-white/10 transition-colors"
            aria-label="Fechar galeria"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Imagem principal */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <img
            key={imageUrl}
            src={imageUrl}
            alt={`${title} - Imagem ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain select-none"
            style={{ userSelect: "none", WebkitUserSelect: "none" }}
            onLoad={() => setIsLoading(false)}
            draggable={false}
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}

          {/* Botão anterior */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 rounded-full p-3 bg-black/50 hover:bg-black/80 text-white transition-all z-10 hover:scale-110"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Botão próximo */}
          <button
            onClick={handleNext}
            className="absolute right-4 rounded-full p-3 bg-black/50 hover:bg-black/80 text-white transition-all z-10 hover:scale-110"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>

        {/* Miniaturas */}
        <div className="flex-shrink-0 p-4 bg-black/80">
          <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? "border-orange-500 scale-110 opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80 hover:scale-105"
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              >
                <img
                  src={getImageUrl(image as any, 120, 120) || "/placeholder.svg"}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

