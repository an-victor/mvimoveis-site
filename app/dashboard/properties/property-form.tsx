"use client"

import { useActionState, useRef, useTransition, useState } from "react"
import { createPropertyAction, updatePropertyAction, removePropertyImageAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Youtube, MapPin, Globe, Image as ImageIcon, DollarSign, X, Loader2, Upload, Info } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/sanity/lib/image"
import { optimizeImage } from "@/lib/image-utils"

export default function PropertyForm({ initialData, isEditing }: { initialData?: any, isEditing?: boolean }) {
  const action = isEditing ? updatePropertyAction : createPropertyAction
  const [state, formAction, isPending] = useActionState(action, { success: false, message: "" })
  const formRef = useRef<HTMLFormElement>(null)
  const [isPendingRemove, startRemoveTransition] = useTransition()
  const [removingKey, setRemovingKey] = useState<string | null>(null)
  const [localImages, setLocalImages] = useState<any[]>(initialData?.images || [])
  
  // Estados para o sistema de preview local
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      
      setIsOptimizing(true)
      try {
        // Otimiza cada imagem antes de adicionar ao estado
        const optimizedFiles = await Promise.all(
          filesArray.map(file => optimizeImage(file))
        )
        setSelectedFiles(prev => [...prev, ...optimizedFiles])
      } catch (error) {
        console.error("Erro na otimização:", error)
      } finally {
        setIsOptimizing(false)
        // Limpa o input para permitir selecionar os mesmos arquivos novamente se desejar
        e.target.value = ""
      }
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Intercepta o submit do form para anexar os arquivos do estado
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Remove os valores originais do input de arquivo se houver
    formData.delete("image")
    
    // Adiciona todos os arquivos do estado selectedFiles
    selectedFiles.forEach(file => {
      formData.append("image", file)
    })

    // Chama a formAction diretamente (useActionState já lida com a transição)
    formAction(formData)
  }

  const handleRemoveImage = (imageKey: string) => {
    setRemovingKey(imageKey)
    startRemoveTransition(async () => {
      await removePropertyImageAction(initialData?._id, imageKey)
      setLocalImages(prev => prev.filter((img: any) => img._key !== imageKey))
      setRemovingKey(null)
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="id" value={initialData?._id} />
      <input type="hidden" name="slug" value={initialData?.slug?.current} />

      {state?.message && (
        <div className={`p-4 rounded-md text-sm font-medium border ${state.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {state.message}
        </div>
      )}

      {/* ── Informações Básicas ── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800">Informações Básicas</CardTitle>
          <CardDescription>Defina o título, valor, localização e o status atual do imóvel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Imóvel</Label>
              <p className="text-xs text-slate-500 mb-2">Um título atrativo para a listagem (ex: Cobertura Duplex no Jardins).</p>
              <Input id="title" name="title" defaultValue={initialData?.title} placeholder="Digite o título..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda ou Locação</Label>
              <p className="text-xs text-slate-500 mb-2">Insira o valor formatado (ex: R$ 1.500.000,00).</p>
              <Input id="price" name="price" defaultValue={initialData?.price} placeholder="R$ 0,00" required />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Localização / Bairro</Label>
              <p className="text-xs text-slate-500 mb-2">A região principal onde o imóvel está situado.</p>
              <Input id="location" name="location" defaultValue={initialData?.location} placeholder="Ex: Itaim Bibi, São Paulo" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status de Disponibilidade</Label>
              <p className="text-xs text-slate-500 mb-2">Define se o imóvel aparecerá nos resultados de busca.</p>
              <div className="relative">
                <select 
                  id="status" 
                  name="status" 
                  defaultValue={initialData?.status || "available"} 
                  className="flex h-11 w-full appearance-none rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-2 text-base text-slate-800 dark:text-slate-200 md:text-sm ring-offset-background placeholder:text-slate-400/80 shadow-inner hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-950 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                >
                  <option value="available">Disponível para Negociação</option>
                  <option value="sold">Vendido</option>
                  <option value="rented">Alugado</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="condoFee" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400" />
                Taxa de Condomínio (opcional)
              </Label>
              <Input id="condoFee" name="condoFee" defaultValue={initialData?.condoFee} placeholder="Ex: R$ 800,00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400" />
                IPTU Mensal (opcional)
              </Label>
              <Input id="tax" name="tax" defaultValue={initialData?.tax} placeholder="Ex: R$ 350,00" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Detalhes Estruturais ── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800">Detalhes Estruturais</CardTitle>
          <CardDescription>Especifique as dimensões e os cômodos que compõem o imóvel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="area">Área Total (m²)</Label>
              <Input id="area" name="area" defaultValue={initialData?.area} placeholder="Ex: 120" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Nº de Quartos</Label>
              <Input id="bedrooms" name="bedrooms" type="number" min="0" defaultValue={initialData?.bedrooms || 0} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Nº de Banheiros</Label>
              <Input id="bathrooms" name="bathrooms" type="number" min="0" defaultValue={initialData?.bathrooms || 0} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parkingSpots">Vagas de Garagem</Label>
              <Input id="parkingSpots" name="parkingSpots" type="number" min="0" defaultValue={initialData?.parkingSpots || 0} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="features">Características e Diferenciais</Label>
            <p className="text-xs text-slate-500 mb-2">Separe as características por vírgula (Ex: Piscina, Varanda Gourmet, Segurança 24h).</p>
            <Input id="features" name="features" defaultValue={initialData?.features} placeholder="Digite as características..." />
          </div>
        </CardContent>
      </Card>

      {/* ── Mídia & Apresentação ── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-brand-primary" />
            Fotos do Imóvel
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? "Selecione novas fotos para adicionar à galeria." 
              : "Selecione as fotos do imóvel. Elas serão enviadas quando você clicar em Cadastrar."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2 border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50 hover:bg-slate-100 transition-colors">
              <Label htmlFor="image" className="text-base cursor-pointer block">
                📷 Clique aqui para selecionar fotos
              </Label>
              <p className="text-xs text-slate-500 mb-4 font-medium flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-blue-500" />
                Você pode selecionar múltiplas fotos de uma vez ou em sequência.
              </p>
              <Input 
                id="image" 
                name="image" 
                type="file" 
                accept="image/*" 
                multiple 
                required={!isEditing && selectedFiles.length === 0} 
                className="bg-white cursor-pointer" 
                onChange={handleFileChange}
              />
            </div>

            {/* Previews de arquivos selecionados localmente (Aguardando Salvar) */}
            {selectedFiles.length > 0 && (
              <div className="bg-blue-50/30 border border-blue-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2 uppercase tracking-wider">
                    <Upload className="h-3.5 w-3.5" />
                    Fotos para enviar ({selectedFiles.length})
                  </h4>
                  <p className="text-[10px] text-blue-600 font-bold bg-white px-2 py-1 rounded border border-blue-200">
                    Aguardando Salvar Formulário
                  </p>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-blue-200 bg-white group shadow-sm">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="h-full w-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                         <button 
                          type="button" 
                          onClick={() => removeSelectedFile(idx)}
                          className="bg-red-500 text-white rounded-full p-1.5 shadow-lg transform scale-90 hover:scale-100 transition-transform"
                          title="Remover foto"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-[8px] text-white py-0.5 text-center font-bold">
                        PRONTO
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Miniaturas das fotos existentes (Se editando) */}
          {isEditing && localImages.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <Label className="text-sm font-semibold text-slate-700">Fotos atuais na galeria ({localImages.length})</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {localImages.map((img: any) => (
                  <div key={img._key} className="relative group rounded-lg overflow-hidden aspect-square border border-slate-200 shadow-sm">
                    <Image
                      src={getImageUrl(img as any, 300, 300) || "/placeholder.svg"}
                      alt="Foto do imóvel"
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      disabled={isPendingRemove}
                      onClick={() => handleRemoveImage(img._key)}
                      className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      title="Remover foto"
                    >
                      {removingKey === img._key
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <X className="h-3 w-3" />}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400">Passe o mouse sobre uma foto e clique no ❌ para removê-la definitivamente.</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descrição Completa</Label>
            <p className="text-xs text-slate-500 mb-2">Crie um texto envolvente destacando os pontos fortes da propriedade e da localização.</p>
            <Textarea 
              id="description" 
              name="description" 
              defaultValue={initialData?.description?.[0]?.children?.[0]?.text} 
              placeholder="Descreva os detalhes em profundidade..." 
              rows={6} 
              required 
              className="resize-y"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Links e Mídia Avançada ── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800">Links e Mídia Avançada</CardTitle>
          <CardDescription>Adicione vídeo do YouTube, localização no mapa e tour virtual 360°.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="youtubeVideo" className="flex items-center gap-2">
              <Youtube className="h-4 w-4 text-red-500" />
              ID do Vídeo do YouTube
            </Label>
            <p className="text-xs text-slate-500 mb-2">
              Cole <strong>apenas o ID</strong> do vídeo, não a URL completa. 
              Exemplo: se a URL for <code className="bg-slate-100 px-1 rounded">youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong></code>, cole apenas <code className="bg-slate-100 px-1 rounded">dQw4w9WgXcQ</code>
            </p>
            <Input 
              id="youtubeVideo" 
              name="youtubeVideo" 
              defaultValue={initialData?.youtubeVideo} 
              placeholder="Ex: dQw4w9WgXcQ" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mapUrl" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Link do Google Maps
            </Label>
            <p className="text-xs text-slate-500 mb-2">Acesse o Google Maps, encontre o endereço e clique em "Compartilhar" para copiar o link.</p>
            <Input 
              id="mapUrl" 
              name="mapUrl" 
              defaultValue={initialData?.mapUrl} 
              placeholder="https://maps.google.com/..." 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="virtualTour" className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-500" />
              Tour Virtual 360° (opcional)
            </Label>
            <p className="text-xs text-slate-500 mb-2">Link para tour virtual imersivo do imóvel (ex: Matterport, Google Street View, etc.).</p>
            <Input 
              id="virtualTour" 
              name="virtualTour" 
              defaultValue={initialData?.virtualTour} 
              placeholder="https://..." 
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <input 
              type="checkbox" 
              id="featured" 
              name="featured" 
              defaultChecked={initialData?.featured ?? false} 
              className="h-4 w-4 accent-orange-500 cursor-pointer"
            />
            <div>
              <Label htmlFor="featured" className="cursor-pointer font-semibold text-amber-800">
                ⭐ Destacar este imóvel na página inicial
              </Label>
              <p className="text-xs text-amber-600 mt-0.5">Imóveis em destaque aparecem na seção principal do site.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 mt-8">
        <Link href="/dashboard/properties">
          <Button type="button" variant="outline" className="px-6">Cancelar Operação</Button>
        </Link>
        <Button type="submit" disabled={isPending} className="bg-brand-primary hover:bg-brand-secondary text-white px-8 font-semibold shadow-md">
          {isPending ? "Processando..." : isEditing ? "Salvar Alterações" : "Cadastrar Imóvel"}
        </Button>
      </div>
    </form>
  )
}
