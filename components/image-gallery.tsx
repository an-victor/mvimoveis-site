"use client"

import type React from "react"

import { useState } from "react"
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

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious()
    } else if (e.key === "ArrowRight") {
      handleNext()
    }
  }

  if (images.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80" />
      <DialogContent
        className="max-w-7xl w-full h-[90vh] bg-black border-none p-0 flex flex-col"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="flex justify-between items-center p-4 text-white">
          <h2 className="text-xl font-medium">
            {title} - {currentIndex + 1}/{images.length}
          </h2>
          <button onClick={() => onOpenChange(false)} className="rounded-full p-2 hover:bg-white/10 transition-colors">
            <X className="h-6 w-6" />
            <span className="sr-only">Fechar</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={getImageUrl(images[currentIndex], 1200, 800) || "/placeholder.svg"}
              alt={`${title} - Imagem ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <button
            onClick={handlePrevious}
            className="absolute left-4 rounded-full p-2 bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 rounded-full p-2 bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>

        <div className="p-4 bg-black/90">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex ? "border-orange-500 scale-105" : "border-transparent opacity-70"
                }`}
              >
                <img
                  src={getImageUrl(image, 100, 100) || "/placeholder.svg"}
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
