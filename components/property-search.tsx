"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function PropertySearch() {
  return (
    <div className="relative w-full sm:w-auto">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input type="search" placeholder="Buscar imóveis..." className="w-full pl-9 sm:w-[250px]" />
    </div>
  )
}
