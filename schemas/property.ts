// /home/ubuntu/sanity_project/schemas/property.ts
import { defineType, defineField } from 'sanity';
import { HomeIcon } from '@sanity/icons'; // Example icon

export default defineType({
  name: 'property',
  title: 'Imóvel',
  type: 'document',
  icon: HomeIcon, // Ícone para o tipo de documento no Studio
  groups: [
    { name: 'content', title: 'Conteúdo Principal', default: true },
    { name: 'details', title: 'Detalhes Técnicos' },
    { name: 'media', title: 'Mídia' },
    { name: 'locationGroup', title: 'Localização' },
    { name: 'management', title: 'Gerenciamento' },
  ],
  fields: [
    // Grupo: Conteúdo Principal
    defineField({
      name: 'title',
      title: 'Título do Imóvel',
      type: 'string',
      group: 'content',
      description: 'Ex: Apartamento de Luxo nos Jardins',
      validation: (Rule) => Rule.required().error('O título é obrigatório.'),
    }),
    defineField({
      name: 'slug',
      title: 'URL Amigável (Slug)',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'Será gerado automaticamente a partir do título. Usado no endereço da página do imóvel.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Preço (R$)',
      type: 'number',
      group: 'content',
      description: 'Valor de venda ou aluguel do imóvel.',
      validation: (Rule) => Rule.required().positive('O preço deve ser um valor positivo.'),
    }),
    defineField({
      name: 'description',
      title: 'Descrição Completa',
      type: 'text', // Ou 'blockContent' para rich text
      group: 'content',
      description: 'Descrição detalhada que aparece na página do imóvel (aba Descrição).',
    }),

    // Grupo: Detalhes Técnicos
    defineField({
      name: 'area',
      title: 'Área (m²)',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required().positive('A área deve ser positiva.'),
    }),
    defineField({
      name: 'bedrooms',
      title: 'Quartos',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required().integer().positive('Número de quartos deve ser positivo.'),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Banheiros',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required().integer().positive('Número de banheiros deve ser positivo.'),
    }),
    defineField({
      name: 'parkingSpaces',
      title: 'Vagas de Garagem',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required().integer().min(0).error('Número de vagas não pode ser negativo.'),
    }),
    defineField({
      name: 'iptu',
      title: 'IPTU (R$ / ano)',
      type: 'number',
      group: 'details',
      description: 'Valor anual do IPTU (opcional). Deixe 0 se não aplicável.',
      validation: (Rule) => Rule.min(0).error('Valor do IPTU não pode ser negativo.'),
      initialValue: 0,
    }),
    defineField({
      name: 'condoFee',
      title: 'Condomínio (R$ / mês)',
      type: 'number',
      group: 'details',
      description: 'Valor mensal do condomínio (opcional). Deixe 0 se não aplicável.',
      validation: (Rule) => Rule.min(0).error('Valor do condomínio não pode ser negativo.'),
      initialValue: 0,
    }),
    defineField({
      name: 'features',
      title: 'Características Adicionais',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Liste características como "Piscina", "Churrasqueira", "Academia", etc. (Aba Características)',
    }),

    // Grupo: Mídia
    defineField({
      name: 'mainImage',
      title: 'Imagem Principal',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      description: 'Imagem de destaque exibida na listagem e na página de detalhes.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria de Imagens',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.max(9).error('Máximo de 9 imagens na galeria.'),
      description: 'Adicione até 9 fotos do imóvel.',
    }),
    defineField({
      name: 'youtubeVideoUrl',
      title: 'URL do Vídeo do YouTube',
      type: 'url',
      group: 'media',
      description: 'Opcional: Cole a URL completa de um vídeo do YouTube sobre o imóvel.',
    }),

    // Grupo: Localização
    defineField({
      name: 'location',
      title: 'Localização Breve (Card)',
      type: 'string',
      group: 'locationGroup',
      description: 'Ex: Jardins, São Paulo. Usado nos cards de listagem.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'addressDetails',
      title: 'Detalhes da Localização (Aba)',
      type: 'text', // Ou um tipo mais estruturado se necessário
      group: 'locationGroup',
      description: 'Endereço completo ou descrição detalhada da localização para a aba "Localização".',
    }),

    // Grupo: Gerenciamento
    defineField({
      name: 'isFeatured',
      title: 'Imóvel em Destaque?',
      type: 'boolean',
      group: 'management',
      description: 'Marque esta opção para destacar este imóvel na página inicial.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      media: 'mainImage',
      isFeatured: 'isFeatured',
    },
    prepare({ title, location, media, isFeatured }) {
      return {
        title: title,
        subtitle: `${location}${isFeatured ? ' - ★ Destaque' : ''}`,
        media: media,
      };
    },
  },
});

