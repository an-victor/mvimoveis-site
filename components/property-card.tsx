import Link from "next/link"
import { MapPin } from "lucide-react"
import { getImageUrl } from "@/sanity/lib/image"
import { formatCurrency } from "@/lib/format-currency"
import type { Property } from "@/types/sanity"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={getImageUrl(property.images?.[0], 800, 600) || "/placeholder.svg"}
          alt={property.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-6 flex-1">
        <h3 className="text-xl font-bold text-slate-900 line-clamp-2">{property.title}</h3>
        <div className="mt-2 flex items-center text-slate-500">
          <MapPin className="mr-1 h-4 w-4 shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-brand-primary">{formatCurrency(property.price)}</span>
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <span>{property.area}</span>
            <span className="text-slate-300">|</span>
            <span>{property.bedrooms} qtos</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-slate-50 p-4">
        <Link href={`/imoveis/${property.slug.current}`} className="w-full">
          <Button className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold transition-colors">
            Ver detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
