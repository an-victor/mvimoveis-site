"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Loader2, MessageCircle, CheckCircle2, ShieldCheck } from "lucide-react"
import { saveLead } from "@/app/lib/lead-actions"

export interface WhatsAppLeadModalProps {
  isOpen: boolean
  onClose: () => void
  whatsappNumber: string
  /** Mensagem que será enviada ao WhatsApp após o preenchimento */
  whatsappMessage?: string
  /** Contexto opcional de imóvel (aparece no subtítulo do modal) */
  propertyTitle?: string
  propertySlug?: string
  propertyLocation?: string
  propertyPrice?: string
}

type Step = "form" | "success"

export function WhatsAppLeadModal({
  isOpen,
  onClose,
  whatsappNumber,
  whatsappMessage,
  propertyTitle,
  propertySlug,
  propertyLocation,
  propertyPrice,
}: WhatsAppLeadModalProps) {
  const [step, setStep] = useState<Step>("form")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" })

  // Fecha no Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  // Bloqueia o scroll do body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setStep("form")
      setError(null)
      setFormData({ name: "", email: "", phone: "" })
    }
  }, [isOpen])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }, [])

  const buildWhatsAppUrl = useCallback(() => {
    const number = whatsappNumber.replace(/\D/g, "") || "5511999999999"
    let message = whatsappMessage

    if (!message) {
      if (propertyTitle) {
        message = `Olá! Me chamo *${formData.name}* e tenho interesse no imóvel: *${propertyTitle}*`
        if (propertyLocation) message += `\n📍 ${propertyLocation}`
        if (propertyPrice) message += `\n💰 ${propertyPrice}`
        message += `\n\nPoderia me dar mais informações?`
      } else {
        message = `Olá! Me chamo *${formData.name}* e gostaria de saber mais sobre os imóveis disponíveis. Poderia me ajudar?`
      }
    }

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  }, [whatsappNumber, whatsappMessage, formData.name, propertyTitle, propertyLocation, propertyPrice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await saveLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        property_slug: propertySlug || "contato-geral",
        property_title: propertyTitle || "Contato Geral",
      })

      if (result.success) {
        setStep("success")
        // Abre o WhatsApp em nova aba
        const url = buildWhatsAppUrl()
        window.open(url, "_blank", "noopener,noreferrer")
      } else {
        setError("Não foi possível salvar seus dados. Tente novamente.")
      }
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const isGeneral = !propertyTitle

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label="Fale com o corretor"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full sm:max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-300 sm:animate-in sm:fade-in sm:zoom-in-95 sm:duration-200">
        
        {/* Handle para mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {step === "form" ? (
          <>
            {/* Header do modal */}
            <div className="relative px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Ícone WhatsApp */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      {isGeneral ? "Fale com o Corretor" : "Falar sobre este Imóvel"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isGeneral
                        ? "Preencha seus dados para continuar"
                        : propertyTitle && propertyTitle.length > 34
                        ? `${propertyTitle.slice(0, 34)}…`
                        : propertyTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 rounded-full p-2 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nome */}
              <div className="space-y-1.5">
                <label htmlFor="wl-name" className="block text-sm font-semibold text-slate-700">
                  Seu Nome Completo <span className="text-red-400">*</span>
                </label>
                <input
                  id="wl-name"
                  name="name"
                  type="text"
                  required
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: João Silva"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* E-mail */}
              <div className="space-y-1.5">
                <label htmlFor="wl-email" className="block text-sm font-semibold text-slate-700">
                  E-mail <span className="text-red-400">*</span>
                </label>
                <input
                  id="wl-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ex: joao@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Telefone */}
              <div className="space-y-1.5">
                <label htmlFor="wl-phone" className="block text-sm font-semibold text-slate-700">
                  WhatsApp / Telefone <span className="text-red-400">*</span>
                </label>
                <input
                  id="wl-phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ex: (11) 99999-9999"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Erro */}
              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="text-base">⚠️</span> {error}
                </p>
              )}

              {/* Botão de envio */}
              <div className="pt-1">
                <button
                  type="submit"
                  id="wl-submit-btn"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a84f] px-5 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5" />
                      <span>Continuar para o WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

              {/* Nota de privacidade */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Seus dados são usados apenas para atendimento. Não enviamos spam.</span>
              </div>
            </form>
          </>
        ) : (
          /* Tela de sucesso */
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 hover:bg-slate-100 transition-colors text-slate-400"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Dados enviados! 🎉
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                Você será redirecionado ao WhatsApp. Se a conversa não abrir automaticamente,{" "}
                <button
                  onClick={() => window.open(buildWhatsAppUrl(), "_blank", "noopener,noreferrer")}
                  className="text-green-600 font-semibold underline underline-offset-2"
                >
                  clique aqui
                </button>
                .
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-2 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
