import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./sanity/schemas"
import { structure } from "./sanity/structure"

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
