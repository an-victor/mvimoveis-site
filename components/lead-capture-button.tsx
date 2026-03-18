"use client"

import { useState } from "react"
import { MessageCircle, X, Check, Loader2 } from "lucide-react"
import { saveLead } from "@/app/lib/lead-actions"

interface LeadCaptureButtonProps {
  propertyTitle: string
  propertyLocation: string
  propertyPrice: string
  propertySlug: string
  whatsappNumber: string
}

export function LeadCaptureButton({
  propertyTitle,
  propertyLocation,
  propertyPrice,
  propertySlug,
  whatsappNumber
}: LeadCaptureButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await saveLead({
        name: formData.name,
        phone: formData.phone,
        property_slug: propertySlug,
        property_title: propertyTitle
      })

      if (result.success) {
        // Redirecionar para o WhatsApp
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "") || "5511999999999"}?text=${encodeURIComponent(
          `Olá! Me chamo *${formData.name}* e tenho interesse no imóvel: *${propertyTitle}*\n📍 ${propertyLocation}\n💰 ${propertyPrice}\n\nPoderia me dar mais informações?`
        )}`
        
        window.open(whatsappUrl, "_blank")
        setOpen(false)
        setFormData({ name: "", phone: "" })
      } else {
        alert("Erro ao salvar seus dados. Por favor, tente novamente.")
      }
    } catch (error) {
      console.error("Error submitting lead:", error)
      alert("Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-green-500 hover:bg-green-600 px-4 py-4 text-base font-bold text-white transition-all shadow-md hover:shadow-lg"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Agendar Visita via WhatsApp
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-lg text-slate-900">Agendar Visita</h2>
                <p className="text-xs text-slate-500 mt-0.5">Preencha seus dados para continuar</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-slate-100 transition-colors text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                  Seu Nome Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: João Silva"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                  Seu WhatsApp
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ex: (11) 99999-9999"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] px-4 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <MessageCircle className="h-5 w-5" />
                  )}
                  {loading ? "Processando..." : "Continuar para o WhatsApp"}
                </button>
              </div>
              
              <p className="text-[10px] text-center text-slate-400 px-4 leading-tight">
                Seus dados serão enviados ao corretor para agilizar o seu atendimento.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
