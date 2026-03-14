import { createClient } from "next-sanity"

export const writeClient = createClient({
  projectId: "98pdr6kx",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Cliente de escrita nunca deve usar CDN
  token: process.env.SANITY_API_WRITE_TOKEN,
})