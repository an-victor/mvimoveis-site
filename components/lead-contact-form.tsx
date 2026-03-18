"use client"

import { useState } from "react"
import { Send, Check, Loader2, Mail } from "lucide-react"
import { saveLead } from "@/app/lib/lead-actions"
import { Button } from "@/components/ui/button"

interface LeadContactFormProps {
  propertyTitle: string
  propertySlug: string
}

export function LeadContactForm({ propertyTitle, propertySlug }: LeadContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await saveLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        property_slug: propertySlug,
        property_title: propertyTitle
      })

      if (result.success) {
        setSuccess(true)
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        alert("Erro ao enviar mensagem. Tente novamente.")
      }
    } catch (error) {
      console.error("Error submitting lead:", error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-100 p-8 text-center animate-in zoom-in duration-300">
        <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
          <Check className="text-white h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Mensagem Enviada!</h3>
        <p className="text-green-700">Obrigado pelo seu interesse. Retornaremos em breve via e-mail ou WhatsApp.</p>
        <Button 
          variant="outline" 
          className="mt-6 border-green-200 hover:bg-green-100 text-green-800"
          onClick={() => setSuccess(false)}
        >
          Enviar outra mensagem
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <Mail className="text-brand-primary h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Tem alguma dúvida?</h3>
          <p className="text-sm text-slate-500">Envie uma mensagem direta para o corretor</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nome</label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">WhatsApp</label>
            <input
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">E-mail</label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Sua Mensagem</label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Gostaria de saber mais sobre este imóvel..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all h-auto"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Send className="mr-2 h-5 w-5" />
          )}
          {loading ? "Enviando..." : "Enviar Mensagem por E-mail"}
        </Button>
        <p className="text-[10px] text-center text-slate-400">
          Ao enviar, você concorda com nossa política de privacidade e tratamento de dados.
        </p>
      </form>
    </div>
  )
}
