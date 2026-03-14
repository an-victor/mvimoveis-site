"use client"

import { useActionState, useState } from "react"
import { updateSiteSettingsAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SettingsForm({ initialData, documentId }: { initialData: any, documentId: string }) {
  const [state, formAction, isPending] = useActionState(updateSiteSettingsAction, { success: false, message: "" })
  
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || "#f97316")
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondaryColor || "#1e293b")

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="documentId" value={documentId} />

      {state?.message && (
        <div className={`p-4 rounded-md text-sm font-medium border ${state.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {state.message}
        </div>
      )}

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800">Identidade Visual & SEO</CardTitle>
          <CardDescription>Configure a marca da sua imobiliária e otimize sua presença no Google.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Site (Aba do navegador)</Label>
              <p className="text-xs text-slate-500 mb-2">Este texto aparece na aba do navegador e no título das buscas do Google.</p>
              <Input id="title" name="title" defaultValue={initialData?.title} required />
            </div>
            <div className="space-y-2 border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
              <Label htmlFor="logo">Upload da Logo</Label>
              <p className="text-xs text-slate-500 mb-2">Formato recomendado: PNG transparente ou SVG.</p>
              <Input id="logo" name="logo" type="file" accept="image/*" className="bg-white cursor-pointer" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Cor Primária (Botões e Destaques)</Label>
              <p className="text-xs text-slate-500 mb-2">A cor principal da sua marca.</p>
              <div className="flex gap-2">
                <Input 
                  id="primaryColor" 
                  name="primaryColor" 
                  type="color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-14 p-1 h-10 cursor-pointer rounded-md border-slate-300" 
                />
                <Input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Cor Secundária (Fundo e Rodapé)</Label>
              <p className="text-xs text-slate-500 mb-2">Uma cor de contraste para seções secundárias.</p>
              <div className="flex gap-2">
                <Input 
                  id="secondaryColor" 
                  name="secondaryColor" 
                  type="color" 
                  value={secondaryColor} 
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-14 p-1 h-10 cursor-pointer rounded-md border-slate-300" 
                />
                <Input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Label htmlFor="description">Descrição do Site (SEO)</Label>
            <p className="text-xs text-slate-500 mb-2">Um resumo sobre você ou sua imobiliária. Isso ajuda clientes a te encontrarem no Google.</p>
            <Textarea id="description" name="description" defaultValue={initialData?.description} required rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800">Banner da Página Inicial</CardTitle>
          <CardDescription>A primeira impressão dos clientes ao abrir o seu site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Título Principal (Hero)</Label>
              <p className="text-xs text-slate-500 mb-2">A frase de maior impacto (ex: Encontre o Imóvel dos Seus Sonhos).</p>
              <Input id="heroTitle" name="heroTitle" defaultValue={initialData?.heroTitle} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Subtítulo Destacado</Label>
              <p className="text-xs text-slate-500 mb-2">Pequeno texto acima do título (ex: Marcelo Victor - Corretor de Imóveis).</p>
              <Input id="heroSubtitle" name="heroSubtitle" defaultValue={initialData?.heroSubtitle} required />
            </div>
          </div>
          
          <div className="space-y-2 border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
            <Label htmlFor="banner">Trocar Imagem de Fundo do Banner</Label>
            <p className="text-xs text-slate-500 mb-2">Recomendado: Imagem de alta qualidade em formato paisagem (1920x1080).</p>
            <Input id="banner" name="banner" type="file" accept="image/*" className="bg-white cursor-pointer" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroDescription">Texto Descritivo de Apoio</Label>
            <p className="text-xs text-slate-500 mb-2">Parágrafo que complementa o título principal no banner.</p>
            <Textarea id="heroDescription" name="heroDescription" defaultValue={initialData?.heroDescription} required rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800">Contatos de Atendimento</CardTitle>
          <CardDescription>Como os clientes chegarão até você.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone Fixo / Direto</Label>
              <p className="text-xs text-slate-500 mb-2">Ex: (11) 3333-3333</p>
              <Input id="phone" name="phone" defaultValue={initialData?.phone} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
              <p className="text-xs text-slate-500 mb-2">Apenas números. Ex: 11999999999</p>
              <Input id="whatsapp" name="whatsapp" defaultValue={initialData?.whatsapp} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Profissional</Label>
              <p className="text-xs text-slate-500 mb-2">Ex: contato@marcelovictor.com</p>
              <Input id="email" name="email" type="email" defaultValue={initialData?.email} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço do Escritório</Label>
            <p className="text-xs text-slate-500 mb-2">Onde seus clientes podem te visitar presencialmente.</p>
            <Input id="address" name="address" defaultValue={initialData?.address} required />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4 border-t border-slate-200 mt-8">
        <Button type="submit" size="lg" disabled={isPending} className="w-full md:w-auto px-8 bg-brand-primary hover:bg-brand-secondary text-white font-semibold shadow-md">
          {isPending ? "Salvando Alterações..." : "Salvar Configurações"}
        </Button>
      </div>
    </form>
  )
}
