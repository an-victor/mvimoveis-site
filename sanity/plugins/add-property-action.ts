import { definePlugin } from "sanity"
import type { DocumentActionComponent } from "sanity"

const AddPropertyAction: DocumentActionComponent = (props) => {
  const { type, draft, published } = props

  if (type !== "property") {
    return null
  }

  return {
    label: "Adicionar Imóvel Modelo",
    icon: () => "🏠",
    onHandle: async () => {
      const client = props.getClient({ apiVersion: "2024-01-01" })

      // Dados fictícios para o imóvel modelo
      const sampleProperty = {
        _type: "property",
        title: "Apartamento Modelo - Edite as Informações",
        slug: {
          _type: "slug",
          current: `apartamento-modelo-${Date.now()}`,
        },
        price: "R$ 850.000",
        location: "Vila Madalena, São Paulo - SP",
        area: "85m²",
        bedrooms: 2,
        bathrooms: 2,
        parkingSpots: 1,
        condoFee: "R$ 800/mês",
        tax: "R$ 3.200/ano",
        description: [
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Este é um imóvel modelo criado automaticamente. Edite todas as informações, adicione suas próprias imagens e personalize conforme necessário.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
          {
            _type: "block",
            children: [
              {
                _type: "span",
                text: "Lembre-se de atualizar: título, preço, localização, descrição, características e principalmente as imagens.",
              },
            ],
            markDefs: [],
            style: "normal",
          },
        ],
        features: [
          "Varanda",
          "Ar-condicionado",
          "Armários planejados",
          "Piso laminado",
          "Portaria 24h",
          "Elevador",
          "Área de lazer",
          "Piscina",
        ],
        featured: false,
        status: "available",
        images: [], // Será preenchido com imagens pelo usuário
        youtubeVideo: "", // Será preenchido pelo usuário
      }

      try {
        const result = await client.create(sampleProperty)

        // Redirecionar para o documento criado
        props.onComplete()

        // Mostrar mensagem de sucesso
        console.log("Imóvel modelo criado com sucesso!")

        return {
          type: "success",
          message: "Imóvel modelo criado! Agora edite as informações e adicione suas imagens.",
        }
      } catch (error) {
        console.error("Erro ao criar imóvel modelo:", error)
        return {
          type: "error",
          message: "Erro ao criar imóvel modelo. Tente novamente.",
        }
      }
    },
  }
}

export const addPropertyActionPlugin = definePlugin({
  name: "add-property-action",
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "property") {
        return [AddPropertyAction, ...prev]
      }
      return prev
    },
  },
})
