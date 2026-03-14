"use client"

import { useActionState, useRef } from "react"
import { createPropertyAction, updatePropertyAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function PropertyForm({ initialData, isEditing }: { initialData?: any, isEditing?: boolean }) {
  const action = isEditing ? updatePropertyAction : createPropertyAction
  const [state, formAction, isPending] = useActionState(action, { success: false, message: "" })
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={initialData?._id} />
      <input type="hidden" name="slug" value={initialData?.slug?.current} />

      {state?.message && (
        <div className={`p-4 rounded-md text-sm font-medium ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {state.message}
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Imóvel</Label>
              <Input id="title" name="title" defaultValue={initialData?.title} placeholder="Ex: Apartamento 3 Quartos no Centro" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input id="price" name="price" defaultValue={initialData?.price} placeholder="Ex: R$ 500.000,00" required />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localização / Bairro</Label>
              <Input id="location" name="location" defaultValue={initialData?.location} placeholder="Ex: Centro, Cidade" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" name="status" defaultValue={initialData?.status || "available"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="available">Disponível</option>
                <option value="sold">Vendido</option>
                <option value="rented">Alugado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input id="area" name="area" defaultValue={initialData?.area} placeholder="Ex: 120" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Quartos</Label>
              <Input id="bedrooms" name="bedrooms" type="number" min="0" defaultValue={initialData?.bedrooms || 0} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banheiros</Label>
              <Input id="bathrooms" name="bathrooms" type="number" min="0" defaultValue={initialData?.bathrooms || 0} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parkingSpots">Vagas</Label>
              <Input id="parkingSpots" name="parkingSpots" type="number" min="0" defaultValue={initialData?.parkingSpots || 0} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Foto Principal do Imóvel {isEditing && <span className="text-xs text-muted-foreground">(Deixe vazio para manter a atual)</span>}</Label>
            <Input id="image" name="image" type="file" accept="image/*" required={!isEditing} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Características (separadas por vírgula)</Label>
            <Input id="features" name="features" defaultValue={initialData?.features} placeholder="Ex: Piscina, Churrasqueira, Varanda" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Imóvel</Label>
            <Textarea id="description" name="description" defaultValue={initialData?.description?.[0]?.children?.[0]?.text} placeholder="Descreva os detalhes..." rows={4} required />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 pt-4">
        <Link href="/dashboard/properties">
          <Button type="button" variant="outline">Cancelar</Button>
        </Link>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar Imóvel"}
        </Button>
      </div>
    </form>
  )
}