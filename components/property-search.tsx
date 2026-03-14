"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export function PropertySearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("search") || "")
  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedValue) {
      params.set("search", debouncedValue)
    } else {
      params.delete("search")
    }
    router.push(`/imoveis?${params.toString()}`, { scroll: false })
  }, [debouncedValue, router, searchParams])

  return (
    <div className="relative w-full sm:w-auto">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input 
        type="search" 
        placeholder="Buscar imóveis..." 
        className="w-full pl-9 sm:w-[250px]" 
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
