import { createClient } from "next-sanity"

export const client = createClient({
  projectId: "98pdr6kx",
  dataset: "production",
  apiVersion: "2024-05-30",
  useCdn: false,
})
