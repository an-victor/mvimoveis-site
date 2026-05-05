"use client"

import { useActionState, useRef, useTransition, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createPropertyAction, updatePropertyAction, removePropertyImageAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Youtube, MapPin, Globe, Image as ImageIcon, DollarSign, X, Loader2, Upload, Info, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/sanity/lib/image"
import { optimizeImage } from "@/lib/image-utils"
import { useToast } from "@/hooks/use-toast"
import PropertySaveOverlay from "@/components/property-save-overlay"

export default function PropertyForm({ initialData, isEditing }: { initialData?: any, isEditing?: boolean }) {
  const router = useRouter()
  const { toast } = useToast()
  const action = isEditing ? updatePropertyAction : createPropertyAction
  const [state, formAction, isPending] = useActionState(action, { success: false, message: "" })
  const formRef = useRef<HTMLFormElement>(null)
  const [isPendingRemove, startRemoveTransition] = useTransition()
  const [removingKey, setRemovingKey] = useState<string | null>(null)
  type MediaItem = {
    type: "local" | "new"
    id: string
    file?: File
    data?: any
    previewUrl?: string
  }

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    return (initialData?.images || []).map((img: any) => ({
      type: "local",
      id: img._key,
      data: img,
      previewUrl: getImageUrl(img, 300, 300) || "/placeholder.svg"
    }))
  })
  
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  // Estados para o sistema de preview local
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [overlayStage, setOverlayStage] = useState<"uploading" | "saving" | "publishing" | "done" | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Efeito para lidar com o sucesso do salvamento
  useEffect(() => {
    if (state?.success) {
      setUploadStatus("finalizado")
      setOverlayStage("done")
      
      // Delay maior para o usuário ler o aviso sobre tempo de publicação
      const timer = setTimeout(() => {
        router.push("/dashboard/properties")
      }, 5000)
      
      return () => clearTimeout(timer)
    } else if (state?.message && !state.success) {
      setUploadStatus("")
      setOverlayStage(null)
      toast({
        title: "Erro no salvamento",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, isEditing, router, toast])

  // Atualiza o status textual e overlay durante o processo com simulação de barra de progresso
  useEffect(() => {
    if (isPending) {
      const newFilesCount = mediaItems.filter(m => m.type === "new").length
      if (newFilesCount > 0) {
        setUploadStatus("uploading")
        setOverlayStage("uploading")
        setUploadProgress(0)
        
        // Simula transição com progresso (cada foto aumenta em média 1.5s a 2s)
        const totalTime = Math.max(3000, newFilesCount * 1800)
        const intervalTime = 100 // atualiza a cada 100ms
        const steps = totalTime / intervalTime
        let currentStep = 0
        
        const interval = setInterval(() => {
          currentStep++
          const progress = Math.min(99, Math.floor((currentStep / steps) * 100))
          setUploadProgress(progress)
          
          if (currentStep >= steps) {
            clearInterval(interval)
            setUploadStatus("saving")
            setOverlayStage("saving")
            setUploadProgress(100)
          }
        }, intervalTime)
        
        return () => clearInterval(interval)
      } else {
        setUploadStatus("saving")
        setOverlayStage("saving")
        setUploadProgress(100)
      }
    } else {
      setUploadProgress(0)
    }
  }, [isPending, mediaItems])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      
      // Verifica se há arquivos de vídeo selecionados
      const videoFiles = filesArray.filter(file => file.type.startsWith('video/'))
      
      if (videoFiles.length > 0) {
        toast({
          variant: "destructive",
          title: "⚠️ Apenas fotos são permitidas aqui!",
          description: "Esta galeria aceita exclusivamente fotos (JPG, PNG, WEBP). Se você possui um vídeo do imóvel, por favor, faça o upload no YouTube e cole o código (ID) do vídeo no campo 'Links e Mídia Avançada' logo abaixo.",
        })
      }

      // Filtra para processar apenas arquivos que sejam imagens
      const imageFiles = filesArray.filter(file => file.type.startsWith('image/'))
      
      if (imageFiles.length === 0) {
        e.target.value = ""
        return
      }

      setIsOptimizing(true)
      try {
        // Otimiza cada imagem antes de adicionar ao estado
        const optimizedFiles = await Promise.all(
          imageFiles.map(file => optimizeImage(file))
        )
        const newItems: MediaItem[] = optimizedFiles.map(file => ({
          type: "new",
          id: Math.random().toString(36).substring(7),
          file,
          previewUrl: URL.createObjectURL(file)
        }))
        setMediaItems(prev => [...prev, ...newItems])
      } catch (error) {
        console.error("Erro na otimização:", error)
        toast({
          variant: "destructive",
          title: "Erro ao processar imagens",
          description: "Ocorreu um problema ao otimizar suas fotos. Tente selecionar menos arquivos de cada vez.",
        })
      } finally {
        setIsOptimizing(false)
        // Limpa o input para permitir selecionar os mesmos arquivos novamente se desejar
        e.target.value = ""
      }
    }
  }

  const handleRemoveMedia = (item: MediaItem) => {
    if (item.type === "local") {
      setRemovingKey(item.id)
      startRemoveTransition(async () => {
        const result = await removePropertyImageAction(initialData?._id, item.id)
        if (result?.success) {
          setMediaItems(prev => prev.filter(m => m.id !== item.id))
        }
        setRemovingKey(null)
      })
    } else {
      setMediaItems(prev => prev.filter(m => m.id !== item.id))
      if (item.previewUrl && item.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl)
      }
    }
  }

  const handleDragStart = (idx: number) => setDraggedIdx(idx)
  
  const handleDragEnter = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return
    setMediaItems(prev => {
      const newItems = [...prev]
      const [draggedItem] = newItems.splice(draggedIdx, 1)
      newItems.splice(idx, 0, draggedItem)
      return newItems
    })
    setDraggedIdx(idx)
  }

  const handleDragEnd = () => setDraggedIdx(null)
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Permite drop
  }

  // Intercepta o submit do form para anexar os arquivos e ordem
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Remove os valores originais do input de arquivo se houver
    formData.delete("image")
    
    // Adiciona a ordem de todas as imagens misturadas
    const orderData = mediaItems.map(item => {
      if (item.type === "local") return { type: "local", data: item.data }
      return { type: "new" }
    })
    formData.append("imagesOrder", JSON.stringify(orderData))

    // Adiciona as imagens novas ao FormData
    mediaItems.forEach(item => {
      if (item.type === "new" && item.file) {
        formData.append("image", item.file)
      }
    })

    // Chama a formAction diretamente (useActionState já lida com a transição)
    formAction(formData)
  }

  return (
    <>
    <PropertySaveOverlay 
      stage={overlayStage} 
      photoCount={mediaItems.filter(m => m.type === "new").length} 
      progress={uploadProgress}
      isEditing={!!isEditing} 
    />
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="id" value={initialData?._id} />
      <input type="hidden" name="slug" value={initialData?.slug?.current} />

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
                📷 Clique aqui para adicionar fotos
              </Label>
              <p className="text-xs text-slate-500 mb-4 font-medium flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-blue-500" />
                Você pode selecionar múltiplas fotos. Arraste e solte as fotos na grade abaixo para reordená-las. A primeira foto será a capa.
              </p>
              <Input 
                id="image" 
                name="image" 
                type="file" 
                accept="image/*" 
                multiple 
                required={!isEditing && mediaItems.length === 0} 
                className="bg-white cursor-pointer" 
                onChange={handleFileChange}
                disabled={isOptimizing || isPendingRemove}
              />
            </div>
            
            {isOptimizing && (
              <div className="flex items-center gap-3 p-4 bg-slate-100 border border-slate-200 rounded-lg animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
                <span className="text-sm font-semibold text-slate-700">Otimizando imagens para o banco de dados...</span>
              </div>
            )}

            {mediaItems.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Fotos Selecionadas ({mediaItems.length})
                  </h4>
                  <p className="text-xs text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                    Arraste para reordenar
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaItems.map((item, idx) => (
                    <div 
                      key={item.id} 
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragEnter={() => handleDragEnter(idx)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      className={`relative aspect-square rounded-md overflow-hidden bg-white shadow-sm cursor-grab active:cursor-grabbing border-2 transition-all ${
                        idx === 0 ? 'border-brand-primary ring-2 ring-brand-primary/20 ring-offset-1' : 'border-slate-200 hover:border-brand-primary/50'
                      } ${draggedIdx === idx ? 'opacity-50 scale-95' : 'opacity-100'}`}
                    >
                      {item.type === 'local' ? (
                        <Image
                          src={item.previewUrl || "/placeholder.svg"}
                          alt="Foto do imóvel"
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover pointer-events-none"
                        />
                      ) : (
                        <img 
                          src={item.previewUrl} 
                          alt="Preview" 
                          className="h-full w-full object-cover pointer-events-none" 
                        />
                      )}

                      {/* Flag de Capa */}
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-brand-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                          CAPA
                        </div>
                      )}
                      
                      {/* Flag de Nova Mídia */}
                      {item.type === 'new' && (
                        <div className="absolute bottom-1 left-1 bg-blue-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                          NOVA
                        </div>
                      )}

                      {/* Botão de Remover */}
                      <button 
                        type="button" 
                        disabled={isPendingRemove}
                        onClick={() => handleRemoveMedia(item)}
                        className={`absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-20 ${
                          removingKey === item.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                        }`}
                        title="Remover foto"
                      >
                        {removingKey === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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

      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-slate-200 mt-8 bg-slate-50/50 p-4 rounded-lg">
        {uploadStatus && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mr-auto animate-in fade-in slide-in-from-left-4 duration-300">
            {uploadStatus === "uploading" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm font-medium text-slate-700">Fazendo upload das fotos... aguarde</span>
              </>
            )}
            {uploadStatus === "saving" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                <span className="text-sm font-medium text-slate-700">Salvando dados do imóvel...</span>
              </>
            )}
            {uploadStatus === "finalizado" && (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-bold text-green-700">Salvo com sucesso! Voltando para a lista...</span>
              </>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button asChild type="button" variant="outline" className="flex-1 sm:flex-none w-full px-6" disabled={isPending}>
            <Link href="/dashboard/properties">
              Cancelar
            </Link>
          </Button>
          <Button 
            type="submit" 
            disabled={isPending || isOptimizing} 
            className="flex-1 sm:flex-none bg-brand-primary hover:bg-brand-secondary text-white px-8 font-semibold shadow-md min-w-[160px]"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processando</span>
              </div>
            ) : isEditing ? "Salvar Alterações" : "Cadastrar Imóvel"}
          </Button>
        </div>
      </div>
    </form>
    </>
  )
}
