import { groq } from "next-sanity"

export const PROPERTIES_QUERY = groq`*[_type == "property" && status == "available"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  price,
  location,
  area,
  bedrooms,
  bathrooms,
  parkingSpots,
  condoFee,
  tax,
  images,
  youtubeVideo,
  description,
  features,
  featured,
  status
}`

export const FEATURED_PROPERTIES_QUERY = groq`*[_type == "property" && featured == true && status == "available"] | order(_createdAt desc) [0...3] {
  _id,
  title,
  slug,
  price,
  location,
  area,
  bedrooms,
  bathrooms,
  parkingSpots,
  images
}`

export const PROPERTY_QUERY = groq`*[_type == "property" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  price,
  location,
  area,
  bedrooms,
  bathrooms,
  parkingSpots,
  condoFee,
  tax,
  images,
  youtubeVideo,
  description,
  features,
  status
}`

export const TESTIMONIALS_QUERY = groq`*[_type == "testimonial" && featured == true] | order(_createdAt desc) {
  _id,
  name,
  location,
  text,
  avatar,
  rating
}`

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0] {
  title,
  description,
  logo,
  heroImage,
  heroTitle,
  heroSubtitle,
  heroDescription,
  aboutTitle,
  aboutDescription,
  aboutImage,
  phone,
  email,
  address,
  whatsapp,
  facebook,
  instagram,
  linkedin
}`
