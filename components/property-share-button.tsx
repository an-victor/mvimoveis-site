"use client"

import { useState, useEffect } from "react"
import { Share2, Copy, Check, X, MessageCircle, ChevronLeft, ChevronRight, Link as LinkIcon } from "lucide-react"
import { getImageUrl } from "@/sanity/lib/image"

interface PropertyShareButtonProps {
  property: {
    title: string
    price: string
    location: string
    area: string
    bedrooms: number
    bathrooms: number
    slug: { current: string }
    images?: any[]
  }
}

export function PropertyShareButton({ property }: PropertyShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [customMessage, setCustomMessage] = useState("")
  const [pageUrl, setPageUrl] = useState("")

  const images = property.images || []

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href)
    }
  }, [])

  // Mensagem padrão gerada automaticamente
  const defaultMessage = `🏠 *${property.title}*
📍 ${property.location}
💰 ${property.price}
📐 ${property.area} m² | 🛏 ${property.bedrooms} quartos | 🚿 ${property.bathrooms} banheiros

Confira mais detalhes e fotos aqui:
🔗 ${pageUrl}`

  useEffect(() => {
    if (pageUrl) setCustomMessage(defaultMessage)
  }, [pageUrl])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
      const ta = document.createElement("textarea")
      ta.value = pageUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleShareWhatsApp = () => {
    const msg = customMessage || defaultMessage
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(url, "_blank")
  }

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} - ${property.price} em ${property.location}`,
          url: pageUrl,
        })
      } catch {}
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      {/* Botão de Compartilhar */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:border-green-400 hover:text-green-600 hover:shadow-md transition-all duration-200 group"
        title="Compartilhar imóvel"
      >
        <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Compartilhar</span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="relative z-10 w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Handle para mobile */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-lg text-slate-900">Compartilhar Imóvel</h2>
                <p className="text-xs text-slate-500 mt-0.5">Envie direto para possíveis compradores</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-slate-100 transition-colors text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

              {/* Seletor de Imagem */}
              {images.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Selecione a imagem de destaque
                  </p>
                  <div className="relative">
                    {/* Preview da imagem selecionada */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 mb-3">
                      <img
                        src={getImageUrl(images[selectedImageIndex], 800, 450) || "/placeholder.svg"}
                        alt="Imagem selecionada"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                        {selectedImageIndex + 1} / {images.length}
                      </div>
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => setSelectedImageIndex(i => i === 0 ? images.length - 1 : i - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setSelectedImageIndex(i => i === images.length - 1 ? 0 : i + 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Miniaturas */}
                    {images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedImageIndex(i)}
                            className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                              i === selectedImageIndex
                                ? "border-green-500 scale-105 shadow-md"
                                : "border-transparent opacity-60 hover:opacity-90"
                            }`}
                          >
                            <img
                              src={getImageUrl(img, 100, 100) || "/placeholder.svg"}
                              alt={`Foto ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Editor de Mensagem */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Mensagem (editável)
                  </p>
                  <button
                    onClick={() => setCustomMessage(defaultMessage)}
                    className="text-xs text-brand-primary hover:underline"
                  >
                    Restaurar padrão
                  </button>
                </div>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all font-mono"
                  placeholder="Escreva uma mensagem personalizada..."
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{customMessage.length} caracteres</p>
              </div>

              {/* Link copiável */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Link do imóvel
                </p>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <LinkIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="flex-1 text-sm text-slate-600 truncate">{pageUrl}</span>
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      copied
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                    }`}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleCopyLink}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                    copied
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Link copiado!" : "Copiar link"}
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] px-4 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enviar pelo WhatsApp
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
