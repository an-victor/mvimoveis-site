"use client"

import { useActionState, useState } from "react"
import { saveTestimonialAction, deleteTestimonialAction } from "@/app/dashboard/properties/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Plus, Pencil, Trash2, X } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/sanity/lib/image"

interface Testimonial {
  _id: string
  name: string
  location: string
  text: string
  rating: number
  featured: boolean
  avatar?: any
}

interface Props {
  testimonials: Testimonial[]
}

export function TestimonialsManager({ testimonials }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [saveState, saveAction, isSavePending] = useActionState(saveTestimonialAction, { success: false, message: "" })

  const openNew = () => { setEditingItem(null); setIsFormOpen(true) }
  const openEdit = (t: Testimonial) => { setEditingItem(t); setIsFormOpen(true) }
  const closeForm = () => { setIsFormOpen(false); setEditingItem(null) }

  return (
    <div className="space-y-6">
      {/* Lista de depoimentos existentes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.length === 0 && !isFormOpen && (
          <div className="col-span-full text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-500 text-sm">Nenhum depoimento cadastrado ainda.</p>
            <p className="text-slate-400 text-xs mt-1">Clique em "Adicionar Depoimento" para começar.</p>
          </div>
        )}
        {testimonials.map((t) => (
          <div key={t._id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3 relative">
            {t.featured && (
              <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">⭐ Destaque</span>
            )}
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100">
                {t.avatar ? (
                  <Image
                    src={getImageUrl(t.avatar as any, 100, 100) || "/placeholder.svg"}
                    alt={t.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400 text-lg font-bold">
                    {t.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.location}</p>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`h-3 w-3 ${s <= t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-3">"{t.text}"</p>
            <div className="flex gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => openEdit(t)}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                <Pencil className="h-3 w-3" /> Editar
              </button>
              <form action={deleteTestimonialAction} className="ml-auto">
                <input type="hidden" name="id" value={t._id} />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium"
                  onClick={(e) => { if (!confirm("Remover este depoimento?")) e.preventDefault() }}
                >
                  <Trash2 className="h-3 w-3" /> Remover
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Botão abrir form */}
      {!isFormOpen && (
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 hover:border-brand-primary rounded-lg text-sm text-slate-600 hover:text-brand-primary font-medium transition-colors w-full justify-center"
        >
          <Plus className="h-4 w-4" />
          Adicionar Depoimento
        </button>
      )}

      {/* Formulário */}
      {isFormOpen && (
        <div className="border border-brand-primary/30 bg-slate-50 rounded-xl p-6 space-y-4 relative">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{editingItem ? "Editar Depoimento" : "Novo Depoimento"}</h3>
            <button type="button" onClick={closeForm} className="text-slate-400 hover:text-slate-700"><X className="h-4 w-4" /></button>
          </div>

          {saveState?.message && (
            <div className={`p-3 rounded-md text-sm font-medium border ${saveState.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
              {saveState.message}
            </div>
          )}

          <form action={saveAction} className="space-y-4">
            <input type="hidden" name="id" value={editingItem?._id || ""} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dep-name" className="text-sm">Nome do Cliente</Label>
                <Input id="dep-name" name="name" required defaultValue={editingItem?.name} placeholder="Ex: Maria Souza" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dep-location" className="text-sm">Cidade / Bairro</Label>
                <Input id="dep-location" name="location" required defaultValue={editingItem?.location} placeholder="Ex: São Paulo, SP" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dep-text" className="text-sm">Texto do Depoimento</Label>
              <Textarea id="dep-text" name="text" required defaultValue={editingItem?.text} rows={3} placeholder="O que o cliente disse sobre você?" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dep-rating" className="text-sm">Avaliação (1–5 estrelas)</Label>
                <select
                  id="dep-rating"
                  name="rating"
                  defaultValue={editingItem?.rating || 5}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{"⭐".repeat(n)} — {n} estrela{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dep-avatar" className="text-sm">Foto do Cliente (opcional)</Label>
                {editingItem?.avatar && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border border-slate-200">
                      <Image
                        src={getImageUrl(editingItem.avatar as any, 60, 60) || "/placeholder.svg"}
                        alt={editingItem.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-slate-500">Foto atual. Selecione outra para substituir.</span>
                  </div>
                )}
                <Input id="dep-avatar" name="avatar" type="file" accept="image/*" className="bg-white cursor-pointer text-xs" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="dep-featured" name="featured" className="h-4 w-4 accent-orange-500 cursor-pointer" defaultChecked={editingItem?.featured ?? false} />
              <Label htmlFor="dep-featured" className="text-sm cursor-pointer">Exibir este depoimento em destaque no site</Label>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={closeForm} className="px-4">Cancelar</Button>
              <Button type="submit" disabled={isSavePending} className="bg-brand-primary hover:bg-brand-secondary text-white px-6">
                {isSavePending ? "Salvando..." : editingItem ? "Salvar Alterações" : "Criar Depoimento"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
