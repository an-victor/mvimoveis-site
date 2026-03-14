"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function PropertySort() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const selected = searchParams.get("sort") || "recent"

  const options = [
    { value: "recent", label: "Mais recentes" },
    { value: "price-asc", label: "Menor preço" },
    { value: "price-desc", label: "Maior preço" },
    { value: "area-asc", label: "Menor área" },
    { value: "area-desc", label: "Maior área" },
  ]

  const selectedLabel = options.find((option) => option.value === selected)?.label || "Ordenar por"

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    router.push(`/imoveis?${params.toString()}`, { scroll: false })
    setIsOpen(false)
  }

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="outline" className="w-full sm:w-[180px] justify-between" onClick={() => setIsOpen(!isOpen)}>
        {selectedLabel}
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-full sm:w-[180px] bg-white rounded-md shadow-lg border">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${
                  selected === option.value ? "bg-slate-50 text-brand-primary font-medium" : "text-slate-700"
                }`}
                onClick={() => handleSort(option.value)}
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
