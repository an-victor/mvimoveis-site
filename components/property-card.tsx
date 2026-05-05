"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Car, Maximize, ArrowRight } from "lucide-react"
import { getImageUrl } from "@/sanity/lib/image"
import { formatCurrency } from "@/lib/format-currency"
import type { Property } from "@/types/sanity"
import { motion } from "framer-motion"

interface PropertyCardProps {
  property: Property
  index?: number
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/imoveis/${property?.slug?.current || "#"}`} className="block h-full group">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full cursor-pointer font-sans">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={getImageUrl(property?.images?.[0] as any, 800, 600) || "/placeholder.svg"}
              alt={property?.title || "Imóvel"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {property?.status === "available" && (
                <span className="rounded-full bg-green-500/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Disponível
                </span>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="inline-flex items-center rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-sm font-medium text-white">
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-brand-primary" />
                <span className="truncate max-w-[200px]">{property?.location || "Localização não informada"}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col flex-1 p-6">
            <h3 className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight mb-2 group-hover:text-brand-primary transition-colors">
              {property?.title || "Imóvel sem título"}
            </h3>
            
            <div className="mb-4 text-2xl font-extrabold text-brand-primary tracking-tight">
              {formatCurrency(property.price)}
            </div>
            
            <div className="grid grid-cols-4 gap-2 border-y border-slate-100 py-4 mb-4 mt-auto">
              <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
                <Maximize className="h-4 w-4" />
                <span className="text-xs font-medium">{property?.area || "-"}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 text-slate-500 border-l border-slate-100">
                <Bed className="h-4 w-4" />
                <span className="text-xs font-medium">{property?.bedrooms || "-"}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 text-slate-500 border-l border-slate-100">
                <Bath className="h-4 w-4" />
                <span className="text-xs font-medium">{property?.bathrooms || "-"}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 text-slate-500 border-l border-slate-100">
                <Car className="h-4 w-4" />
                <span className="text-xs font-medium">{property?.parkingSpots || "-"}</span>
              </div>
            </div>

            <span className="flex items-center justify-center w-full py-2.5 border border-brand-primary text-brand-primary font-semibold text-sm transition-all duration-300 rounded-xl group-hover:bg-brand-primary group-hover:text-white">
              Ver Detalhes
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
