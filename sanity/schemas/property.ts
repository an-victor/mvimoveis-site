import { defineField, defineType } from "sanity"

export default defineType({
  name: "property",
  title: "Imóvel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Preço",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Localização",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "area",
      title: "Área (m²)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bedrooms",
      title: "Quartos",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "bathrooms",
      title: "Banheiros",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "parkingSpots",
      title: "Vagas de Garagem",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "condoFee",
      title: "Taxa de Condomínio",
      type: "string",
    }),
    defineField({
      name: "tax",
      title: "IPTU",
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Imagens",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Texto alternativo",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "youtubeVideo",
      title: "Vídeo do YouTube (ID)",
      type: "string",
      description: "Cole apenas o ID do vídeo do YouTube (ex: dQw4w9WgXcQ)",
    }),
    defineField({
      name: "mapUrl",
      title: "Link do Google Maps",
      type: "url",
      description: "Cole o link do Google Maps para a localização do imóvel",
    }),
    defineField({
      name: "virtualTour",
      title: "Tour Virtual (URL)",
      type: "url",
      description: "Link para tour virtual 360° do imóvel",
    }),
    defineField({
      name: "description",
      title: "Descrição",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "features",
      title: "Características",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Imóvel em Destaque",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Disponível", value: "available" },
          { title: "Vendido", value: "sold" },
          { title: "Alugado", value: "rented" },
        ],
      },
      initialValue: "available",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0",
      location: "location",
      price: "price",
    },
    prepare(selection) {
      const { title, media, location, price } = selection
      return {
        title,
        subtitle: `${location} - ${price}`,
        media,
      }
    },
  },
})
