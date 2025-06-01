import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./sanity/schemas" // Certifique-se que este caminho está correto
import { structure } from "./sanity/structure"   // Certifique-se que este caminho está correto

export default defineConfig({
  name: "default",
  title: "Marcelo Victor Imóveis",

  projectId: "98pdr6kx",
  dataset: "production",

  plugins: [
    deskTool({
      structure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})