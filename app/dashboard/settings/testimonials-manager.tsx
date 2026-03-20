"use client"

import { useActionState, useState, useTransition } from "react"
import { saveTestimonialAction, deleteTestimonialAction } from "@/app/dashboard/properties/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Plus, Pencil, Trash2, X, Loader2, Upload } from "lucide-react"
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

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [_, startTransition] = useTransition()

  const openNew = () => { 
    setEditingItem(null)
    setAvatarFile(null)
    setIsFormOpen(true) 
  }
  
  const openEdit = (t: Testimonial) => { 
    setEditingItem(t)
    setAvatarFile(null)
    setIsFormOpen(true) 
  }
  
  const closeForm = () => { 
    setIsFormOpen(false)
    setEditingItem(null) 
    setAvatarFile(null)
  }

  // Intercepta o submit para anexar o arquivo do estado
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    if (avatarFile) {
      formData.delete("avatar")
      formData.append("avatar", avatarFile)
    }

    startTransition(() => {
      saveAction(formData)
    })
  }

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
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-slate-800 truncate">{t.name}</h4>
                <p className="text-xs text-slate-500 truncate">{t.location}</p>
              </div>
            </div>
            
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
              ))}
            </div>
            
            <p className="text-xs text-slate-600 line-clamp-3 italic">"{t.text}"</p>
            
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => openEdit(t)} className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Pencil className="h-3 w-3 mr-1" /> Editar
              </Button>
              <form action={deleteTestimonialAction} className="inline">
                <input type="hidden" name="id" value={t._id} />
                <Button variant="ghost" size="sm" type="submit" className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-3 w-3 mr-1" /> Excluir
                </Button>
              </form>
            </div>
          </div>
        ))}
        
        {!isFormOpen && (
          <button 
            onClick={openNew}
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-slate-500 hover:text-brand-primary"
          >
            <Plus className="h-8 w-8" />
            <span className="text-sm font-semibold">Adicionar Depoimento</span>
          </button>
        )}
      </div>

      {/* Formulário de Depoimento */}
      {isFormOpen && (
        <div className="border-2 border-brand-primary/20 rounded-xl p-6 bg-white shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {editingItem ? <Pencil className="h-5 w-5 text-blue-500" /> : <Plus className="h-5 w-5 text-brand-primary" />}
              {editingItem ? "Editar Depoimento" : "Novo Depoimento"}
            </h3>
            <Button variant="ghost" size="sm" onClick={closeForm}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="id" value={editingItem?._id} />
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="dep-name" className="text-sm">Nome do Cliente</Label>
                <Input id="dep-name" name="name" defaultValue={editingItem?.name} required placeholder="Ex: Maria Silva" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dep-location" className="text-sm">Localização / Bairro</Label>
                <Input id="dep-location" name="location" defaultValue={editingItem?.location} required placeholder="Ex: Itaim Bibi, SP" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="dep-rating" className="text-sm">Avaliação (1 a 5 estrelas)</Label>
                <select 
                  id="dep-rating" 
                  name="rating" 
                  defaultValue={editingItem?.rating || 5}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{n} estrelas</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="dep-avatar" className="text-sm">Foto do Cliente (opcional)</Label>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 relative group">
                    {avatarFile ? (
                      <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      editingItem?.avatar ? (
                        <Image src={getImageUrl(editingItem.avatar as any, 100, 100) || "/placeholder.svg"} alt="Atual" fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                          <Upload className="h-5 w-5" />
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <Input 
                      id="dep-avatar" 
                      name="avatar" 
                      type="file" 
                      accept="image/*" 
                      className="bg-white cursor-pointer text-xs h-9" 
                      onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    />
                    {avatarFile && <p className="absolute -bottom-4 left-0 text-[8px] text-blue-600 font-bold uppercase tracking-tighter">PRONTA PARA SALVAR</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dep-text" className="text-sm">Texto do Depoimento</Label>
              <Textarea id="dep-text" name="text" defaultValue={editingItem?.text} required placeholder="O que o cliente disse sobre seu serviço..." rows={3} />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" id="dep-featured" name="featured" className="h-4 w-4 accent-orange-500 cursor-pointer" defaultChecked={editingItem?.featured ?? false} />
              <Label htmlFor="dep-featured" className="text-sm cursor-pointer">Destacar na página inicial</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={closeForm}>Cancelar</Button>
              <Button type="submit" disabled={isSavePending} className="bg-brand-primary hover:bg-brand-secondary text-white px-6">
                {isSavePending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : editingItem ? "Salvar Alterações" : "Criar Depoimento"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
