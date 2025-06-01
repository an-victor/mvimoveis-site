import type { PortableTextBlock } from "sanity"

export interface Property {
  _id: string
  title: string
  slug: {
    current: string
  }
  price: string
  location: string
  area: string
  bedrooms: number
  bathrooms: number
  parkingSpots: number
  condoFee?: string
  tax?: string
  images: SanityImage[]
  youtubeVideo?: string
  mapUrl?: string
  virtualTour?: string
  description: PortableTextBlock[]
  features: string[]
  featured?: boolean
  status: "available" | "sold" | "rented"
}

export interface Testimonial {
  _id: string
  name: string
  location: string
  text: string
  avatar?: SanityImage
  rating: number
}

export interface SiteSettings {
  title: string
  description: string
  logo?: SanityImage
  heroImage?: SanityImage
  bannerImages?: SanityImage[]
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  aboutTitle: string
  aboutDescription: string
  aboutImage?: SanityImage
  phone: string
  email: string
  address: string
  whatsapp: string
  facebook?: string
  instagram?: string
  linkedin?: string
}

export interface SanityImage {
  _type: "image"
  asset: {
    _ref: string
    _type: "reference"
  }
  alt?: string
}
