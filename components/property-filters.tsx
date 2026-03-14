"use client"

import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/format-currency"

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Estados locais para os filtros
  const [type, setType] = useState(searchParams.get("type") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "0")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "10000000")
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "0")
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") || "0")

  // Sincronizar com a URL quando ela mudar externamente
  useEffect(() => {
    setType(searchParams.get("type") || "")
    setMinPrice(searchParams.get("minPrice") || "0")
    setMaxPrice(searchParams.get("maxPrice") || "10000000")
    setBedrooms(searchParams.get("bedrooms") || "0")
    setBathrooms(searchParams.get("bathrooms") || "0")
  }, [searchParams])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (type) params.set("type", type)
    else params.delete("type")
    
    params.set("minPrice", minPrice)
    params.set("maxPrice", maxPrice)
    
    if (bedrooms !== "0") params.set("bedrooms", bedrooms)
    else params.delete("bedrooms")
    
    if (bathrooms !== "0") params.set("bathrooms", bathrooms)
    else params.delete("bathrooms")
    
    router.push(`/imoveis?${params.toString()}`, { scroll: false })
  }

  const clearFilters = () => {
    setType("")
    setMinPrice("0")
    setMaxPrice("10000000")
    setBedrooms("0")
    setBathrooms("0")
    router.push("/imoveis", { scroll: false })
  }

  const propertyTypes = [
    { value: "apartment", label: "Apartamento" },
    { value: "house", label: "Casa" },
    { value: "penthouse", label: "Cobertura" },
    { value: "land", label: "Terreno" },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {(type || bedrooms !== "0" || bathrooms !== "0" || minPrice !== "0") && (
            <span className="ml-1 flex h-2 w-2 rounded-full bg-brand-primary" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtrar imóveis</SheetTitle>
          <SheetDescription>Ajuste os filtros para encontrar o imóvel ideal para você</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-8 pb-20">
          {/* Tipo de Imóvel */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Tipo de imóvel</h3>
            <div className="grid grid-cols-2 gap-3">
              {propertyTypes.map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={item.value} 
                    checked={type === item.value}
                    onCheckedChange={(checked) => setType(checked ? item.value : "")}
                  />
                  <Label htmlFor={item.value} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Faixa de Preço */}
          <div className="border-t pt-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Faixa de preço</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="min-price">Preço Mínimo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">R$</span>
                  <input 
                    id="min-price"
                    type="number" 
                    className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="max-price">Preço Máximo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">R$</span>
                  <input 
                    id="max-price"
                    type="number" 
                    className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quartos */}
          <div className="border-t pt-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Mínimo de Quartos</h3>
            <div className="flex flex-wrap gap-2">
              {["0", "1", "2", "3", "4", "5"].map((num) => (
                <Button 
                  key={num} 
                  variant={bedrooms === num ? "default" : "outline"} 
                  className={`h-10 w-12 rounded-md ${bedrooms === num ? "bg-brand-primary hover:bg-brand-secondary" : ""}`}
                  onClick={() => setBedrooms(num)}
                >
                  {num === "0" ? "Qualquer" : num === "5" ? "5+" : num}
                </Button>
              ))}
            </div>
          </div>

          {/* Banheiros */}
          <div className="border-t pt-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Mínimo de Banheiros</h3>
            <div className="flex flex-wrap gap-2">
              {["0", "1", "2", "3", "4", "5"].map((num) => (
                <Button 
                  key={num} 
                  variant={bathrooms === num ? "default" : "outline"} 
                  className={`h-10 w-12 rounded-md ${bathrooms === num ? "bg-brand-primary hover:bg-brand-secondary" : ""}`}
                  onClick={() => setBathrooms(num)}
                >
                  {num === "0" ? "Qualquer" : num === "5" ? "5+" : num}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-6 flex justify-between gap-4">
          <Button variant="outline" className="flex-1" onClick={clearFilters}>
            Limpar
          </Button>
          <SheetClose asChild>
            <Button className="flex-1 bg-brand-primary hover:bg-brand-secondary" onClick={applyFilters}>
              Aplicar Filtros
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
