"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"

export function PropertyFilters() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filtrar imóveis</SheetTitle>
          <SheetDescription>Ajuste os filtros para encontrar o imóvel ideal para você</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="mb-4 text-sm font-medium">Tipo de imóvel</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="apartment" />
                <label htmlFor="apartment" className="text-sm">
                  Apartamento
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="house" />
                <label htmlFor="house" className="text-sm">
                  Casa
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="penthouse" />
                <label htmlFor="penthouse" className="text-sm">
                  Cobertura
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="land" />
                <label htmlFor="land" className="text-sm">
                  Terreno
                </label>
              </div>
            </div>
          </div>
          <div className="border-t pt-6">
            <h3 className="mb-4 text-sm font-medium">Faixa de preço</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">R$ 500.000</span>
                <span className="text-sm text-slate-500">R$ 5.000.000</span>
              </div>
              <div className="py-4">
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div className="h-2 w-[50%] rounded-full bg-blue-900"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t pt-6">
            <h3 className="mb-4 text-sm font-medium">Quartos</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, "5+"].map((num) => (
                <Button key={num} variant="outline" className="h-9 rounded-full px-4" size="sm">
                  {num}
                </Button>
              ))}
            </div>
          </div>
          <div className="border-t pt-6">
            <h3 className="mb-4 text-sm font-medium">Banheiros</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, "5+"].map((num) => (
                <Button key={num} variant="outline" className="h-9 rounded-full px-4" size="sm">
                  {num}
                </Button>
              ))}
            </div>
          </div>
          <div className="border-t pt-6">
            <h3 className="mb-4 text-sm font-medium">Características</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="pool" />
                <label htmlFor="pool" className="text-sm">
                  Piscina
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="garden" />
                <label htmlFor="garden" className="text-sm">
                  Jardim
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="garage" />
                <label htmlFor="garage" className="text-sm">
                  Garagem
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="balcony" />
                <label htmlFor="balcony" className="text-sm">
                  Varanda
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="gym" />
                <label htmlFor="gym" className="text-sm">
                  Academia
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="security" />
                <label htmlFor="security" className="text-sm">
                  Segurança 24h
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-between border-t pt-6">
            <Button variant="outline">Limpar filtros</Button>
            <Button className="bg-blue-900 hover:bg-blue-800">Aplicar filtros</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
