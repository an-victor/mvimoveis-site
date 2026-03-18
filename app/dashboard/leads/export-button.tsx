"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExportButtonProps {
  leads: any[]
}

export function ExportLeadsButton({ leads }: ExportButtonProps) {
  const handleExport = () => {
    if (leads.length === 0) return

    // Cabeçalhos do CSV
    const headers = ["ID", "Data/Hora", "Nome", "E-mail", "WhatsApp", "Imóvel", "Slug"]
    
    // Mapear dados
    const rows = leads.map(lead => [
      lead.id,
      new Date(lead.created_at).toLocaleString('pt-BR'),
      lead.name,
      lead.email || "-",
      lead.phone,
      lead.property_title,
      lead.property_slug
    ])

    // Criar conteúdo CSV
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
    ].join("\n")

    // Criar Blob e Download
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const date = new Date().toISOString().split('T')[0]
    
    link.setAttribute("href", url)
    link.setAttribute("download", `leads-mvimoveis-${date}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2" 
      onClick={handleExport}
      disabled={leads.length === 0}
    >
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  )
}
