"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useEffect, useState } from "react"

// Property type definition
type PropertyDetail = {
  area: string
  bedrooms: number
  bathrooms: number
  parkingSpots: number
}

type Property = {
  id: string
  title: string
  location: string
  price: string
  details: PropertyDetail
  images: string[]
}

interface PropertyListProps {
  properties: Property[]
}

export function PropertyList({ properties }: PropertyListProps) {
  // Use state to control when to render the properties
  const [isClient, setIsClient] = useState(false)

  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="min-h-[500px] flex items-center justify-center">Carregando imóveis...</div>
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, index) => (
        <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={property.images[0] || "/placeholder.svg"}
              alt={property.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-slate-900">{property.title}</h3>
            <div className="mt-2 flex items-center text-slate-500">
              <MapPin className="mr-1 h-4 w-4" />
              <span className="text-sm">{property.location}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-blue-900">{property.price}</span>
              <div className="flex items-center gap-1 text-sm">
                <span>{property.details.area}</span>
                <span className="text-slate-300">|</span>
                <span>{property.details.bedrooms} quartos</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-slate-50 p-4">
            <Link href={`/imoveis/${property.id}`} className="w-full">
              <Button className="w-full bg-blue-900 hover:bg-blue-800">Ver detalhes</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
