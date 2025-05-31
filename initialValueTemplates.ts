// /home/ubuntu/sanity_project/initialValueTemplates.ts
import { defineTemplate, Template } from 'sanity'

// Template para criar um novo imóvel com valores fictícios
const newPropertyTemplate: Template = {
  id: 'new-property-with-defaults',
  title: 'Novo Imóvel (Pré-preenchido)',
  schemaType: 'property',
  value: {
    title: 'Novo Imóvel (Editar Título)',
    slug: { _type: 'slug', current: 'novo-imovel-editar-slug' }, // O usuário precisará gerar um novo slug
    price: 1000000, // Valor fictício
    description: [
      {
        _type: 'block',
        _key: 'randomKey1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'randomKey2',
            marks: [],
            text: 'Descreva aqui os detalhes encantadores deste novo imóvel. Fale sobre a localização privilegiada, os acabamentos de alta qualidade e os diferenciais que o tornam único. Lembre-se de revisar e personalizar este texto.',
          },
        ],
      },
    ],
    area: 120, // Valor fictício
    bedrooms: 3, // Valor fictício
    bathrooms: 2, // Valor fictício
    parkingSpaces: 2, // Valor fictício
    iptu: 1500, // Valor fictício
    condoFee: 500, // Valor fictício
    features: ['Piscina (Exemplo)', 'Churrasqueira (Exemplo)', 'Academia (Exemplo)'], // Valores fictícios
    location: 'Bairro Exemplo, Cidade Exemplo', // Valor fictício
    addressDetails: 'Rua Exemplo, 123 - Bairro Exemplo, Cidade Exemplo - CEP 00000-000. Detalhes adicionais sobre a localização podem ser inseridos aqui.', // Valor fictício
    isFeatured: false,
    // Nota: Imagens (mainImage, gallery) e vídeo (youtubeVideoUrl) precisam ser adicionados manualmente.
  },
}

export const initialValueTemplates: Template[] = [newPropertyTemplate];

