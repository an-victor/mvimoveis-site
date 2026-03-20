"use client"

import { useActionState, useState, useTransition } from "react"
import { updateSiteSettingsAction, removeBannerImageAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { X, Loader2, Upload, Info } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/sanity/lib/image"
import { optimizeImage } from "@/lib/image-utils"

export default function SettingsForm({ initialData, documentId }: { initialData: any, documentId: string }) {
  const [state, formAction, isPending] = useActionState(updateSiteSettingsAction, { success: false, message: "" })
  
  const [primaryColor, setPrimaryColor] = useState(initialData?.primaryColor || "#f97316")
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondaryColor || "#1e293b")
  const [isPendingRemoveBanner, startRemoveBannerTransition] = useTransition()
  const [removingBannerKey, setRemovingBannerKey] = useState<string | null>(null)
  const [localBanners, setLocalBanners] = useState<any[]>(initialData?.bannerImages || [])

  // Estados para preview local (Configurações)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [brokerPhotoFile, setBrokerPhotoFile] = useState<File | null>(null)
  const [selectedBanners, setSelectedBanners] = useState<File[]>([])

  const handleRemoveBanner = (imageKey: string) => {
    setRemovingBannerKey(imageKey)
    startRemoveBannerTransition(async () => {
      await removeBannerImageAction(documentId, imageKey)
      setLocalBanners(prev => prev.filter((img: any) => img._key !== imageKey))
      setRemovingBannerKey(null)
    })
  }

  // Intercepta o submit do form para anexar todos os arquivos dos estados
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Anexa arquivos que estão nos estados (Logo e Foto Corretor são únicos)
    if (logoFile) {
      formData.delete("logo")
      formData.append("logo", logoFile)
    }
    
    if (brokerPhotoFile) {
      formData.delete("brokerPhoto")
      formData.append("brokerPhoto", brokerPhotoFile)
    }

    // Anexa múltiplos banners
    if (selectedBanners.length > 0) {
      formData.delete("banner")
      selectedBanners.forEach(file => {
        formData.append("banner", file)
      })
    }

    startTransition(() => {
      formAction(formData)
    })
  }

  const [_, startTransition] = useTransition()

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
              <Label htmlFor="logo" className="cursor-pointer">Upload da Logo</Label>
              <p className="text-[10px] text-slate-500 mb-2">Formato recomendado: PNG transparente ou SVG.</p>
              
              <div className="flex items-center gap-4">
                <Input 
                  id="logo" 
                  name="logo" 
                  type="file" 
                  accept="image/*" 
                  className="bg-white cursor-pointer h-9 text-xs" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const optimized = await optimizeImage(file, 800, 800)
                      setLogoFile(optimized)
                    } else {
                      setLogoFile(null)
                    }
                  }}
                />
                {logoFile && (
                  <div className="relative h-10 w-10 border border-brand-primary rounded overflow-hidden shadow-sm flex-shrink-0 bg-white">
                    <img src={URL.createObjectURL(logoFile)} alt="Logo Preview" className="h-full w-full object-contain p-1" />
                    <button type="button" onClick={() => setLogoFile(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                )}
              </div>
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
          
          {/* Miniaturas do Banner Existentes */}
          {localBanners.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">
                Imagens atuais no carrossel ({localBanners.length})
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {localBanners.map((img: any) => (
                  <div key={img._key} className="relative group rounded-lg overflow-hidden aspect-video border border-slate-200 shadow-sm bg-slate-100">
                    <Image
                      src={getImageUrl(img as any, 400, 225) || "/placeholder.svg"}
                      alt="Imagem do banner"
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      disabled={isPendingRemoveBanner}
                      onClick={() => handleRemoveBanner(img._key)}
                      className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      title="Remover imagem do banner"
                    >
                      {removingBannerKey === img._key
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <X className="h-3 w-3" />}
                    </button>
                    {img._key === localBanners[0]?._key && (
                      <span className="absolute bottom-1.5 left-1.5 bg-brand-primary/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Capa
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="space-y-2 border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50 hover:bg-slate-100 transition-colors">
              <Label htmlFor="banner" className="text-base cursor-pointer block">
                🖼️ Selecionar novas imagens para o banner
              </Label>
              <p className="text-xs text-slate-500 mb-4 font-medium flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-blue-500" />
                Você pode selecionar múltiplas fotos em sequência.
              </p>
              <Input 
                id="banner" 
                name="banner" 
                type="file" 
                accept="image/*" 
                multiple 
                className="bg-white cursor-pointer" 
                onChange={async (e) => {
                  if (e.target.files) {
                    const filesArray = Array.from(e.target.files)
                    const optimized = await Promise.all(filesArray.map(f => optimizeImage(f)))
                    setSelectedBanners(prev => [...prev, ...optimized])
                    e.target.value = ""
                  }
                }}
              />
            </div>

            {/* Previews de NOVOS Banners selecionados */}
            {selectedBanners.length > 0 && (
              <div className="bg-blue-50/30 border border-blue-100 rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold text-blue-800 flex items-center gap-2 uppercase tracking-wider">
                  <Upload className="h-3.5 w-3.5" />
                  Novas imagens prontas ({selectedBanners.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedBanners.map((file, idx) => (
                    <div key={idx} className="relative aspect-video rounded overflow-hidden border border-blue-200 shadow-sm bg-white group">
                      <img src={URL.createObjectURL(file)} alt="Preview banner" className="h-full w-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setSelectedBanners(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-[8px] text-white py-0.5 text-center font-bold">
                        AGUARDANDO SALVAR
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800">Perfil do Corretor</CardTitle>
          <CardDescription>Informações e foto que aparecem na página de cada imóvel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="brokerName">Nome Completo</Label>
              <p className="text-xs text-slate-500 mb-2">Como seu nome aparecerá para os clientes.</p>
              <Input id="brokerName" name="brokerName" defaultValue={initialData?.brokerName} placeholder="Ex: Marcelo Victor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brokerTitle">Título / Especialidade</Label>
              <p className="text-xs text-slate-500 mb-2">Sua especialização ou cargo.</p>
              <Input id="brokerTitle" name="brokerTitle" defaultValue={initialData?.brokerTitle} placeholder="Ex: Especialista em Alto Padrão" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brokerBio">Frase de Apresentação</Label>
            <Textarea 
              id="brokerBio" 
              name="brokerBio" 
              defaultValue={initialData?.brokerBio} 
              placeholder="Ex: Meu compromisso é encontrar o lar ideal para você..."
              rows={3}
            />
          </div>

          <div className="space-y-3 border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50 hover:bg-slate-100 transition-colors">
            <Label htmlFor="brokerPhoto" className="text-base cursor-pointer">
              📸 Foto de Perfil do Corretor
            </Label>
            <p className="text-[10px] text-slate-500 mb-4">Recomendado: foto profissional quadrada (400x400px).</p>
            
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-brand-primary flex-shrink-0 bg-white shadow-sm relative group">
                {brokerPhotoFile ? (
                  <img src={URL.createObjectURL(brokerPhotoFile)} alt="Preview corretor" className="h-full w-full object-cover" />
                ) : (
                   <img 
                    src={initialData?.brokerPhoto ? (typeof initialData.brokerPhoto === 'string' ? initialData.brokerPhoto : getImageUrl(initialData.brokerPhoto, 200, 200)) : '/placeholder-user.jpg'} 
                    alt="Foto atual" 
                    className="h-full w-full object-cover" 
                  />
                )}
                {brokerPhotoFile && (
                  <button type="button" onClick={() => setBrokerPhotoFile(null)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-5 w-5 text-white" />
                  </button>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input 
                  id="brokerPhoto" 
                  name="brokerPhoto" 
                  type="file" 
                  accept="image/*" 
                  className="bg-white cursor-pointer h-9 text-xs" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const optimized = await optimizeImage(file, 600, 600)
                      setBrokerPhotoFile(optimized)
                    } else {
                      setBrokerPhotoFile(null)
                    }
                  }}
                />
                {brokerPhotoFile && <p className="text-[10px] text-blue-600 font-bold uppercase">Pronta para enviar</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4 border-t border-slate-200 mt-8">
        <Button type="submit" size="lg" disabled={isPending} className="w-full md:w-auto px-10 bg-brand-primary hover:bg-brand-secondary text-white font-bold shadow-lg transition-all transform hover:scale-[1.02]">
          {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "SALVAR TODAS AS CONFIGURAÇÕES"}
        </Button>
      </div>
    </form>
  )
}
