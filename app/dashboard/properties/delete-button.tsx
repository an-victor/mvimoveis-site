"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DeleteButton() {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      type="submit" 
      title="Excluir" 
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
      onClick={(e) => {
        if (!window.confirm("Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita e removerá o imóvel permanentemente.")) {
          e.preventDefault()
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
