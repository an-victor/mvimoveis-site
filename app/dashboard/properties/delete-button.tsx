"use client"

import { useState } from "react"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export function DeleteButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { pending } = useFormStatus()

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        type="button" 
        title="Excluir" 
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={(e) => {
          e.preventDefault()
          setIsOpen(true)
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-8 text-center space-y-6">
              {/* Ícone animado */}
              <div className="mx-auto w-20 h-20 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>

              {/* Título e descrição */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">
                  Excluir Imóvel?
                </h3>
                <p className="text-sm text-slate-500">
                  Tem certeza que deseja excluir este imóvel? Esta ação <strong className="text-slate-700">não pode ser desfeita</strong> e removerá o imóvel permanentemente do banco de dados e do site.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50" 
                  onClick={() => setIsOpen(false)}
                  disabled={pending}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors"
                  disabled={pending}
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    "Sim, Excluir"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
