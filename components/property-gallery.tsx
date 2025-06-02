"use client"

import { useState } from "react"
import { Maximize, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/sanity/lib/image"
import { ImageGallery } from "@/components/image-gallery"
import type { Property } from "@/types/sanity"

interface PropertyGalleryProps {
  property: Property
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)

  if (!property.images || property.images.length === 0) {
    return (
      <div className="flex gap-4 h-[500px]">
        {/* Área do vídeo/imagem principal */}
        <div className="w-1/3 relative overflow-hidden rounded-lg bg-slate-100">
          <div className="flex h-full items-center justify-center text-slate-400">
            {property.youtubeVideo ? "Vídeo não disponível" : "Sem imagem principal"}
          </div>
        </div>

        {/* Grid de imagens menores */}
        <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg bg-slate-100">
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sem imagem</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const remainingImages = Math.max(0, property.images.length - 6) // 6 imagens visíveis no grid direito

  return (
    <>
      <div className="flex gap-4 h-[500px]">
        {/* Vídeo vertical à esquerda - mais estreito */}
        <div className="w-1/3 relative overflow-hidden rounded-lg bg-black">
          {property.youtubeVideo ? (
            <>
              <iframe
                src={`https://www.youtube.com/embed/${property.youtubeVideo}?rel=0&modestbranding=1`}
                title={`Vídeo do ${property.title}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
                <Play className="w-4 h-4 mr-1" />
                Vídeo
              </div>
            </>
          ) : (
            <>
              <img
                src={getImageUrl(property.images[0], 400, 600) || "/placeholder.svg"}
                alt={property.title}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => setGalleryOpen(true)}
              />
            </>
          )}
        </div>

        {/* Grid 3x2 de imagens à direita - mais espaço */}
        <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-2">
          {property.images.slice(0, 6).map((image, index) => {
            const isLast = index === 5
            const shouldShowButton = isLast && remainingImages > 0

            return (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <img
                  src={getImageUrl(image, 400, 300) || "/placeholder.svg"}
                  alt={`${property.title} - Imagem ${index + 1}`}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setGalleryOpen(true)}
                />
                {shouldShowButton && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 hover:bg-black/80 transition-colors">
                    <Button
                      onClick={() => setGalleryOpen(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg text-xs px-2 py-1"
                    >
                      <Maximize className="mr-1 h-3 w-3" />+{remainingImages}
                    </Button>
                  </div>
                )}
              </div>
            )
          })}

          {/* Preencher espaços vazios se houver menos de 6 imagens */}
          {property.images.length < 6 && (
            <>
              {[...Array(6 - property.images.length)].map((_, index) => (
                <div key={`empty-${index}`} className="relative overflow-hidden rounded-lg bg-slate-100">
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                    <Maximize className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Botão adicional para ver todas as fotos se houver muitas */}
      {remainingImages > 0 && (
        <div className="mt-4 text-center">
          <Button
            onClick={() => setGalleryOpen(true)}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            <Maximize className="mr-2 h-4 w-4" />
            Ver todas as {property.images.length} fotos
          </Button>
        </div>
      )}

      <ImageGallery images={property.images} title={property.title} open={galleryOpen} onOpenChange={setGalleryOpen} />
    </>
  )
}
