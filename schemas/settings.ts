// /home/ubuntu/sanity_project/schemas/settings.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'settings',
  title: 'Configurações Globais',
  type: 'document',
  // __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'], // Para torná-lo um singleton
  fields: [
    defineField({
      name: 'title',
      title: 'Título Interno',
      type: 'string',
      initialValue: 'Configurações Globais',
      hidden: true, // Esconde este campo da UI, usado apenas internamente
    }),
    defineField({
      name: 'logo',
      title: 'Logo do Site',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Faça upload da logo que aparecerá no cabeçalho.',
      validation: (Rule) => Rule.required().error('A logo é obrigatória.'),
    }),
    defineField({
      name: 'bannerImages',
      title: 'Banners da Página Inicial',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.max(6).error('Máximo de 6 imagens para o banner.'),
      description: 'Adicione até 6 imagens para o carrossel da página inicial.',
    }),
    defineField({
      name: 'aboutImage',
      title: 'Imagem Sobre o Corretor',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Imagem que aparece na seção "Sobre".',
    }),
    defineField({
      name: 'aboutText',
      title: 'Texto Sobre o Corretor',
      type: 'text',
      description: 'Texto descritivo da seção "Sobre".',
    }),
    defineField({
      name: 'testimonials',
      title: 'Depoimentos de Clientes',
      type: 'array',
      of: [{ type: 'testimonial' }], // Referencia o objeto 'testimonial' criado anteriormente
      description: 'Adicione ou edite os depoimentos que aparecem no site.',
    }),
    defineField({
      name: 'primaryColor',
      title: 'Cor Primária',
      type: 'string',
      description: 'Cor principal usada em botões e destaques (formato Hex, ex: #1a2b3c).',
      // Pode-se usar um plugin de color picker aqui se disponível no projeto Sanity
      initialValue: '#3b82f6', // Exemplo de cor azul
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Cor de Fundo Principal',
      type: 'string',
      description: 'Cor de fundo geral do site (formato Hex, ex: #ffffff).',
      initialValue: '#ffffff',
    }),
    defineField({
      name: 'textColor',
      title: 'Cor do Texto Principal',
      type: 'string',
      description: 'Cor padrão do texto no site (formato Hex, ex: #111827).',
      initialValue: '#111827',
    }),
    defineField({
      name: 'institutionalText',
      title: 'Texto Institucional (Rodapé)',
      type: 'text',
      description: 'Texto que aparece no rodapé do site.',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Telefone de Contato',
      type: 'string',
    }),
    defineField({
      name: 'contactWhatsApp',
      title: 'Número do WhatsApp',
      type: 'string',
      description: 'Apenas o número (ex: 5511999998888). O link será gerado automaticamente.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de Contato',
      type: 'string',
    }),
    defineField({
      name: 'contactAddress',
      title: 'Endereço',
      type: 'text',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Configurações Globais'
      }
    }
  }
});

