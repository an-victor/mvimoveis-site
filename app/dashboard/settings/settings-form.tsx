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
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="documentId" value={documentId} />

      {state?.message && (
        <div className={`p-4 rounded-md text-sm font-medium ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {state.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Identidade Visual & SEO</CardTitle>
          <CardDescription>Cores, Logo e informações básicas para o Google.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Site (Aba do navegador)</Label>
              <Input id="title" name="title" defaultValue={initialData?.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Trocar Logo do Site</Label>
              <Input id="logo" name="logo" type="file" accept="image/*" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Cor Primária</Label>
              <div className="flex gap-2">
                <Input 
                  id="primaryColor" 
                  name="primaryColor" 
                  type="color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 p-1 h-10 cursor-pointer" 
                />
                <Input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Cor Secundária</Label>
              <div className="flex gap-2">
                <Input 
                  id="secondaryColor" 
                  name="secondaryColor" 
                  type="color" 
                  value={secondaryColor} 
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 p-1 h-10 cursor-pointer" 
                />
                <Input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="description">Descrição do Site (SEO)</Label>
            <Textarea id="description" name="description" defaultValue={initialData?.description} required rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Textos do Início (Banner)</CardTitle>
          <CardDescription>A primeira impressão dos clientes ao abrir o site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Título Principal</Label>
              <Input id="heroTitle" name="heroTitle" defaultValue={initialData?.heroTitle} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Subtítulo Destacado</Label>
              <Input id="heroSubtitle" name="heroSubtitle" defaultValue={initialData?.heroSubtitle} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="banner">Trocar Foto Principal do Banner</Label>
            <Input id="banner" name="banner" type="file" accept="image/*" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroDescription">Texto Descritivo Menor</Label>
            <Textarea id="heroDescription" name="heroDescription" defaultValue={initialData?.heroDescription} required rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contatos do Corretor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone Fixo / Celular</Label>
              <Input id="phone" name="phone" defaultValue={initialData?.phone} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
              <Input id="whatsapp" name="whatsapp" defaultValue={initialData?.whatsapp} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Profissional</Label>
              <Input id="email" name="email" type="email" defaultValue={initialData?.email} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço do Escritório</Label>
            <Input id="address" name="address" defaultValue={initialData?.address} required />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={isPending} className="w-full md:w-auto px-8">
          {isPending ? "Salvando Alterações..." : "Salvar Configurações no Site"}
        </Button>
      </div>
    </form>
  )
}