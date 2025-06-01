import { defineField, defineType } from "sanity"

export default defineType({
  name: "siteSettings",
  title: "Configurações do Site",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título do Site",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descrição do Site",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "heroImage",
      title: "Imagem do Hero",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bannerImages",
      title: "Imagens do Banner (6 imagens)",
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
      validation: (Rule) => Rule.max(6).error("Máximo de 6 imagens permitidas"),
      description: "Adicione até 6 imagens para o carousel do banner. Elas serão redimensionadas automaticamente.",
    }),
    defineField({
      name: "heroTitle",
      title: "Título do Hero",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Subtítulo do Hero",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Descrição do Hero",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aboutTitle",
      title: "Título da Seção Sobre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aboutDescription",
      title: "Descrição da Seção Sobre",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aboutImage",
      title: "Imagem da Seção Sobre",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "phone",
      title: "Telefone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "address",
      title: "Endereço",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "facebook",
      title: "Facebook",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Configurações do Site",
      }
    },
  },
})
