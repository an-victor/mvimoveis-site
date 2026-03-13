import type { StructureBuilder } from "sanity/desk"

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Conteúdo do Site")
    .items([
      // Configurações do Site (singleton)
      S.listItem()
        .title("⚙️ Configurações do Site")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Configurações do Site")),

      S.divider(),

      // Imóveis
      S.listItem()
        .title("🏠 Imóveis")
        .child(
          S.documentTypeList("property")
            .title("Imóveis")
            .child((documentId) => S.document().documentId(documentId).schemaType("property")),
        ),

      // Depoimentos
      S.listItem()
        .title("💬 Depoimentos")
        .child(
          S.documentTypeList("testimonial")
            .title("Depoimentos")
            .child((documentId) => S.document().documentId(documentId).schemaType("testimonial")),
        ),
    ])
