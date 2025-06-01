import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./sanity/schemas"
import { addPropertyActionPlugin } from "./sanity/plugins/add-property-action"
import { structure } from "./sanity/structure"

export default defineConfig({
  name: "default",
  title: "Marcelo Victor Imóveis",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    deskTool({
      structure,
    }),
    visionTool(),
    addPropertyActionPlugin(),
  ],

  schema: {
    types: schemaTypes,
  },
})
