"use client"

import { useState } from "react"
import Image from "next/image"
import { Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/sanity/lib/image"
import { ImageGallery } from "@/components/image-gallery"
import type { Property } from "@/types/sanity"

// Extrai o ID do YouTube de qualquer formato de URL
function extractYouTubeId(input: string): string {
  if (!input) return ""
  // Já é um ID puro (11 chars, sem espaços ou /)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim()
  // Tenta extrair de URLs
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match) return match[1]
  }
  // Fallback: retorna o que foi passado
  return input.trim()
}

interface PropertyGalleryProps {
  property: Property
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)

  const youtubeId = property.youtubeVideo ? extractYouTubeId(property.youtubeVideo) : null

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
      <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[500px]">
        {/* Vídeo vertical à esquerda - mais estreito */}
        <div className="w-full md:w-1/3 relative overflow-hidden rounded-lg bg-black aspect-video md:aspect-auto">
          {youtubeId ? (
            <div className="relative h-full w-full group">
              {videoPlaying ? (
                /* Iframe carrega APENAS após o clique no play */
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1&autoplay=1&enablejsapi=1`}
                  title={`Vídeo do ${property.title}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                /* Thumbnail do YouTube com botão de play */
                <>
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                    alt={`Thumbnail do vídeo: ${property.title}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback para thumbnail de menor qualidade
                      const t = e.target as HTMLImageElement
                      t.src = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                    }}
                  />
                  {/* Overlay escuro */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  {/* Botão de play */}
                  <button
                    onClick={() => setVideoPlaying(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer"
                    aria-label="Assistir vídeo"
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 shadow-2xl hover:scale-110 transition-all duration-200">
                      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white ml-1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                      Ver vídeo do imóvel
                    </span>
                  </button>
                  {/* Badge Vídeo */}
                  <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current"><path d="M8 5v14l11-7z"/></svg>
                    Vídeo
                  </div>
                  {/* Link externo caso embed seja bloqueado */}
                  <a
                    href={`https://www.youtube.com/watch?v=${youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 text-white/70 hover:text-white text-xs underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Abrir no YouTube ↗
                  </a>
                </>
              )}
            </div>
          ) : (
            <>
              <Image
                src={getImageUrl(property.images[0] as any, 400, 600) || "/placeholder.svg"}
                alt={property.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => setGalleryOpen(true)}
              />
            </>
          )}
        </div>

        {/* Grid 3x2 de imagens à direita - mais espaço */}
        <div className="w-full md:flex-1 grid grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2 gap-2">
          {property.images.slice(0, 6).map((image, index) => {
            const isLast = index === 5
            const shouldShowButton = isLast && remainingImages > 0

            return (
              <div key={index} className="relative overflow-hidden rounded-lg aspect-square md:aspect-auto">
                <Image
                  src={getImageUrl(image as any, 400, 300) || "/placeholder.svg"}
                  alt={`${property.title} - Imagem ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
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
                <div
                  key={`empty-${index}`}
                  className="relative overflow-hidden rounded-lg bg-slate-100 aspect-square md:aspect-auto"
                >
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
