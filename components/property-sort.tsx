"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function PropertySort() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState("recent")

  const options = [
    { value: "recent", label: "Mais recentes" },
    { value: "price-asc", label: "Menor preço" },
    { value: "price-desc", label: "Maior preço" },
    { value: "area-asc", label: "Menor área" },
    { value: "area-desc", label: "Maior área" },
  ]

  const selectedLabel = options.find((option) => option.value === selected)?.label || "Ordenar por"

  return (
    <div className="relative">
      <Button variant="outline" className="w-full sm:w-[180px] justify-between" onClick={() => setIsOpen(!isOpen)}>
        {selectedLabel}
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${
                  selected === option.value ? "bg-slate-50 text-blue-900 font-medium" : "text-slate-700"
                }`}
                onClick={() => {
                  setSelected(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
