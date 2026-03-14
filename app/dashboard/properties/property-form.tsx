"use client"

import { useActionState, useRef } from "react"
import { createPropertyAction, updatePropertyAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function PropertyForm({ initialData, isEditing }: { initialData?: any, isEditing?: boolean }) {
  const action = isEditing ? updatePropertyAction : createPropertyAction
  const [state, formAction, isPending] = useActionState(action, { success: false, message: "" })
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={formAction} className="space-y-8">
      <input type="hidden" name="id" value={initialData?._id} />
      <input type="hidden" name="slug" value={initialData?.slug?.current} />

      {state?.message && (
        <div className={`p-4 rounded-md text-sm font-medium border ${state.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {state.message}
        </div>
      )}

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
              <Input id="title" name="title" defaultValue={initialData?.title} placeholder="Digite o título..." required className="bg-slate-50 focus:bg-white transition-colors" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda ou Locação</Label>
              <p className="text-xs text-slate-500 mb-2">Insira o valor formatado (ex: R$ 1.500.000,00).</p>
              <Input id="price" name="price" defaultValue={initialData?.price} placeholder="R$ 0,00" required className="bg-slate-50 focus:bg-white transition-colors" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Localização / Bairro</Label>
              <p className="text-xs text-slate-500 mb-2">A região principal onde o imóvel está situado.</p>
              <Input id="location" name="location" defaultValue={initialData?.location} placeholder="Ex: Itaim Bibi, São Paulo" required className="bg-slate-50 focus:bg-white transition-colors" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status de Disponibilidade</Label>
              <p className="text-xs text-slate-500 mb-2">Define se o imóvel aparecerá nos resultados de busca.</p>
              <div className="relative">
                <select 
                  id="status" 
                  name="status" 
                  defaultValue={initialData?.status || "available"} 
                  className="flex h-10 w-full appearance-none rounded-md border border-input bg-slate-50 px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
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
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800">Detalhes Estruturais</CardTitle>
          <CardDescription>Especifique as dimensões e os cômodos que compõem o imóvel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="area">Área Total (m²)</Label>
              <Input id="area" name="area" defaultValue={initialData?.area} placeholder="Ex: 120" required className="bg-slate-50 focus:bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Nº de Quartos</Label>
              <Input id="bedrooms" name="bedrooms" type="number" min="0" defaultValue={initialData?.bedrooms || 0} required className="bg-slate-50 focus:bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Nº de Banheiros</Label>
              <Input id="bathrooms" name="bathrooms" type="number" min="0" defaultValue={initialData?.bathrooms || 0} required className="bg-slate-50 focus:bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parkingSpots">Vagas de Garagem</Label>
              <Input id="parkingSpots" name="parkingSpots" type="number" min="0" defaultValue={initialData?.parkingSpots || 0} required className="bg-slate-50 focus:bg-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="features">Características e Diferenciais</Label>
            <p className="text-xs text-slate-500 mb-2">Separe as características por vírgula (Ex: Piscina, Varanda Gourmet, Segurança 24h).</p>
            <Input id="features" name="features" defaultValue={initialData?.features} placeholder="Digite as características..." className="bg-slate-50 focus:bg-white" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800">Mídia & Apresentação</CardTitle>
          <CardDescription>Adicione a foto principal e o texto descritivo do imóvel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2 border-2 border-dashed border-slate-200 rounded-lg p-6 bg-slate-50 hover:bg-slate-100 transition-colors">
            <Label htmlFor="image" className="text-base">Upload da Foto Principal</Label>
            <p className="text-xs text-slate-500 mb-4">
              {isEditing ? "Selecione um novo arquivo apenas se desejar substituir a foto atual." : "A foto principal será o destaque nos resultados de busca. Formatos aceitos: JPG, PNG, WEBP."}
            </p>
            <Input id="image" name="image" type="file" accept="image/*" required={!isEditing} className="bg-white cursor-pointer" />
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
              className="bg-slate-50 focus:bg-white resize-y"
            />
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
