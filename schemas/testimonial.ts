// /home/ubuntu/sanity_project/schemas/objects/testimonial.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Depoimento',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome do Cliente',
      type: 'string',
      validation: (Rule) => Rule.required().error('O nome do cliente é obrigatório.'),
    }),
    defineField({
      name: 'quote',
      title: 'Depoimento',
      type: 'text',
      validation: (Rule) => Rule.required().error('O texto do depoimento é obrigatório.'),
    }),
    defineField({
      name: 'clientImage',
      title: 'Foto do Cliente',
      type: 'image',
      options: {
        hotspot: true, // Permite selecionar o ponto focal da imagem
      },
      description: 'Opcional: Foto do cliente que deu o depoimento.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'quote',
      media: 'clientImage',
    },
  },
});

