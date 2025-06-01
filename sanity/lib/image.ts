import createImageUrlBuilder from "@sanity/image-url"
import type { Image } from "sanity"

const imageBuilder = createImageUrlBuilder({
  projectId: "98pdr6kx",
  dataset: "production",
})

export const urlForImage = (source: Image | null | undefined) => {
  if (!source?.asset?._ref) {
    return null
  }

  try {
    return imageBuilder.image(source).auto("format").fit("max")
  } catch (error) {
    console.warn("Error building image URL:", error)
    return null
  }
}

export const getImageUrl = (source: Image | null | undefined, width?: number, height?: number) => {
  const builder = urlForImage(source)
  if (!builder) return "/placeholder.svg?height=400&width=600"

  let url = builder
  if (width) url = url.width(width)
  if (height) url = url.height(height)

  return url.url() || "/placeholder.svg?height=400&width=600"
}
